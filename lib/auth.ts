import "server-only"

import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import crypto from "crypto"

import { createSupabaseAdminClient } from "@/lib/db"
import { checkDatabaseRateLimit, RATE_LIMITS } from "@/lib/rate-limit"

type LoginRole = "admin" | "teacher" | "student"

type AccountRecord = {
	id: string
	email: string
	password_hash: string
	role?: string | null
	status?: string | null
	can_login?: boolean | null
	staff_id?: string | null
}

const normalizeEmail = (email?: string) => email?.trim().toLowerCase() ?? ""

function verifyCaptcha(userInputCode: string, token: string): boolean {
	try {
		if (!userInputCode || !token) return false

		const parts = token.split(".")
		if (parts.length !== 2) return false
		const [base64Payload, signature] = parts

		const payload = Buffer.from(base64Payload, "base64").toString("utf8")
		const [code, expiresAtStr] = payload.split("|")
		const expiresAt = parseInt(expiresAtStr, 10)

		if (isNaN(expiresAt) || Date.now() > expiresAt) {
			return false // Expired
		}

		const secret = process.env.NEXTAUTH_SECRET
		if (!secret) return false // Missing secret — reject all tokens
		const hmac = crypto.createHmac("sha256", secret)
		hmac.update(payload)
		const expectedSignature = hmac.digest("hex")

		if (signature !== expectedSignature) {
			return false // Tampered signature
		}

		return userInputCode.trim() === code.trim()
	} catch {
		return false
	}
}

const isActiveAccount = (status?: string | null) => {
	if (!status) {
		return true
	}

	return status.toLowerCase() === "active"
}

async function verifyPassword(password: string, hash?: string | null) {
	if (!hash) {
		return false
	}

	return compare(password, hash)
}

async function findAdminByEmail(email: string) {
	const supabase = createSupabaseAdminClient()
	const { data, error } = await supabase
		.from("admins")
		.select("id, email, password_hash, role")
		.ilike("email", email)
		.limit(1)
		.maybeSingle<AccountRecord>()

	if (error) {
		return null
	}

	return data
}

async function findStaffAccountByEmail(email: string) {
	const supabase = createSupabaseAdminClient()
	const { data, error } = await supabase
		.from("staff_accounts")
		.select("id, staff_id, email, password_hash, role, status, can_login")
		.ilike("email", email)
		.limit(1)
		.maybeSingle<AccountRecord>()

	if (error) {
		return null
	}

	return data
}

async function resolveTeacherId(account: AccountRecord) {
	if (account.staff_id) {
		return account.staff_id
	}

	const normalizedEmail = normalizeEmail(account.email)
	if (!normalizedEmail) {
		return null
	}

	const supabase = createSupabaseAdminClient()
	const { data, error } = await supabase
		.from("staffs")
		.select("id")
		.ilike("email", normalizedEmail)
		.limit(1)
		.maybeSingle<{ id: string }>()

	if (error) {
		return null
	}

	return data?.id ?? null
}

async function findStudentAccountByUid(identifier: string) {
	const supabase = createSupabaseAdminClient()
	const { data, error } = await supabase
		.from("student_accounts")
		.select("id, student_id, student_uid, email, password_hash, role, status")
		.eq("student_uid", identifier)
		.limit(1)
		.maybeSingle()

	if (error) {
		console.error("findStudentAccountByUid error:", error)
		return null
	}

	return data
}

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 8,
		updateAge: 60 * 30,
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				loginAs: { label: "Login As", type: "text" },
				securityCode: { label: "Security Code", type: "text" },
				userInputCode: { label: "User Input Code", type: "text" },
				userAgent: { label: "User Agent", type: "text" },
			},
			async authorize(credentials, req) {
				const email = normalizeEmail(credentials?.email)
				const password = credentials?.password ?? ""
				const loginAs = credentials?.loginAs as LoginRole | undefined
				const userAgent = credentials?.userAgent ?? ""
				const securityCode = credentials?.securityCode ?? ""
				const userInputCode = credentials?.userInputCode ?? ""

				if (!email || !password) {
					return null
				}

				if (loginAs === "admin") {
					// Enforce IP-level rate limiting on admin login attempts
					const headers = req?.headers as Record<string, string> | undefined
					const ipAddress =
						(headers?.["x-forwarded-for"]?.split(",")[0]?.trim()) ||
						headers?.["x-real-ip"] ||
						headers?.["cf-connecting-ip"] ||
						"unknown"
					const rateLimitKey = `admin-login:${ipAddress}`
					const rateLimit = await checkDatabaseRateLimit(rateLimitKey, RATE_LIMITS.AUTH_LOGIN)
					if (!rateLimit.allowed) {
						return null
					}

					// Enforce server-side cryptographic CAPTCHA verification
					if (!verifyCaptcha(userInputCode, securityCode)) {
						return null
					}

					const admin = await findAdminByEmail(email)

					if (!admin) {
						return null
					}

					const isValid = await verifyPassword(password, admin.password_hash)

					if (!isValid) {
						return null
					}

					return {
						id: admin.id,
						email: admin.email,
						role: "admin",
						userAgent,
						ipAddress,
					}
				}

				if (loginAs === "teacher") {
					const staff = await findStaffAccountByEmail(email)

					if (!staff || !isActiveAccount(staff.status)) {
						return null
					}

					if (staff.can_login === false) {
						return null
					}

					const accountRole = staff.role?.toLowerCase() ?? "teacher"
					const isTeacher = accountRole === "teacher"

					if (!isTeacher) {
						return null
					}

					const isValid = await verifyPassword(password, staff.password_hash)
					const teacherId = await resolveTeacherId(staff)

					if (!isValid || !teacherId) {
						return null
					}

					// Extract IP address from request headers
					const headers = req?.headers as Record<string, string> | undefined
					const ipAddress = 
						(headers?.["x-forwarded-for"]?.split(",")[0]?.trim()) ||
						headers?.["x-real-ip"] ||
						headers?.["cf-connecting-ip"] ||
						headers?.["x-client-ip"] ||
						"unknown"

					return {
						id: teacherId,
						email: staff.email,
						role: "teacher",
						userAgent,
						ipAddress,
					}
				}

				if (loginAs === "student") {
					const studentAccount = await findStudentAccountByUid(email)

					if (!studentAccount || studentAccount.status !== "active") {
						return null
					}

					const isValid = await verifyPassword(password, studentAccount.password_hash)

					if (!isValid) {
						return null
					}

					const headers = req?.headers as Record<string, string> | undefined
					const ipAddress = 
						(headers?.["x-forwarded-for"]?.split(",")[0]?.trim()) ||
						headers?.["x-real-ip"] ||
						headers?.["cf-connecting-ip"] ||
						headers?.["x-client-ip"] ||
						"unknown"

					return {
						id: studentAccount.student_id,
						email: studentAccount.email || `${studentAccount.student_uid}@student.school.com`,
						role: "student",
						userAgent,
						ipAddress,
					}
				}

				return null
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			// Log login activity for admin users
			if (user && user.email && user.id) {
				try {
					// Dynamically import to avoid circular dependencies
					const { logLoginActivity } = await import("@/app/admin/actions")
					
					// Log with user data including extracted IP and user agent
					await logLoginActivity(
						"ipAddress" in user && typeof user.ipAddress === "string" ? user.ipAddress : undefined,
						"userAgent" in user && typeof user.userAgent === "string" ? user.userAgent : undefined,
						user.id,
						user.email,
						undefined // username - will be extracted from email
					)
				} catch (error) {
					console.error("Failed to log login activity:", error)
					// Don't fail the login if logging fails
				}
			}
			return true
		},
		async redirect({ url, baseUrl }) {
			try {
				if (url.startsWith("/")) {
					return `${baseUrl}${url}`
				}
				const urlObj = new URL(url)
				const baseObj = new URL(baseUrl)
				if (urlObj.hostname === baseObj.hostname || urlObj.hostname.endsWith(`.${baseObj.hostname}`)) {
					return url
				}
			} catch {
				// Ignore invalid URLs and return default base URL
			}
			return baseUrl
		},
		async jwt({ token, user }) {
			try {
				if (user) {
					token.id = user.id
					token.role = user.role
					token.email = user.email
				}
			} catch (error) {
				console.error("[NextAuth] JWT callback error:", error)
			}

			return token
		},
		async session({ session, token }) {
			try {
				if (session.user) {
					session.user.id = typeof token.id === "string" ? token.id : ""
					session.user.role = (token.role === "admin" ? "admin" : token.role === "student" ? "student" : "teacher") as "admin" | "teacher" | "student"
					
					// Fetch latest admin profile data if admin
					if (token.role === "admin" && token.email) {
						try {
							const supabase = createSupabaseAdminClient()
							const { data, error } = await supabase
								.from("admins")
								.select("id, full_name, profile_photo, role")
								.ilike("email", token.email)
								.limit(1)
								.maybeSingle<{ id: string; full_name: string | null; profile_photo: string | null; role: string | null }>()
							
							if (error) {
								console.warn("[NextAuth] Failed to fetch admin profile:", error)
								session.user.name = session.user.name || "Admin"
								session.user.image = session.user.image || null
								session.user.userRole = "Admin"
							} else if (data) {
								session.user.name = data.full_name || "Admin"
								session.user.image = data.profile_photo || null

								// Check role from admin_roles first, then admins table
								let rawRole = ""
								try {
									const { data: roleData } = await supabase
										.from("admin_roles")
										.select("role")
										.eq("user_id", data.id)
										.limit(1)
										.maybeSingle<{ role: string }>()
									rawRole = roleData?.role || ""
								} catch {
									rawRole = ""
								}

								if (!rawRole) {
									rawRole = data.role || ""
								}

								const cleanRole = (rawRole || "admin").toLowerCase().trim()
								let formattedRole = "Admin"

								if (cleanRole === "superadmin" || cleanRole === "super_admin" || cleanRole === "super admin") {
									formattedRole = "Super Admin"
								} else if (cleanRole === "admin") {
									formattedRole = "Admin"
								} else if (cleanRole) {
									formattedRole = cleanRole.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
								}

								session.user.userRole = formattedRole
							}
						} catch (error) {
							console.error("[NextAuth] Admin profile fetch error:", error)
							session.user.name = session.user.name || "Admin"
							session.user.image = session.user.image || null
							session.user.userRole = "Admin"
						}
					}

					// Fetch latest teacher/staff profile data if teacher
					if (token.role === "teacher" && token.email) {
						try {
							const supabase = createSupabaseAdminClient()
							const { data } = await supabase
								.from("staffs")
								.select("name, designation, role, photo")
								.ilike("email", token.email)
								.limit(1)
								.maybeSingle<{ name: string | null; designation: string | null; role: string | null; photo: string | null }>()

							if (data) {
								session.user.name = data.name || session.user.name || "Teacher"
								session.user.image = data.photo || session.user.image || null
								session.user.userRole = data.designation || data.role || "Teacher"
							} else {
								session.user.userRole = "Teacher"
							}
						} catch {
							session.user.userRole = "Teacher"
						}
					}

					// Fetch latest student profile data if student
					if (token.role === "student" && token.id) {
						try {
							const supabase = createSupabaseAdminClient()
							const { data, error } = await supabase
								.from("students")
								.select("name_en, photo")
								.eq("id", token.id)
								.limit(1)
								.maybeSingle()
							
							if (error) {
								console.warn("[NextAuth] Failed to fetch student profile:", error)
								session.user.name = session.user.name || "Student"
								session.user.image = session.user.image || null
								session.user.userRole = "Student"
							} else if (data) {
								session.user.name = data.name_en || "Student"
								session.user.image = data.photo || null
								session.user.userRole = "Student"
							}
						} catch (error) {
							console.error("[NextAuth] Student profile fetch error:", error)
							session.user.name = session.user.name || "Student"
							session.user.image = session.user.image || null
							session.user.userRole = "Student"
						}
					}
				}
			} catch (error) {
				console.error("[NextAuth] Session callback error:", error)
				// Return session with minimal data to prevent auth failures
				if (session.user) {
					session.user.id = typeof token.id === "string" ? token.id : ""
					session.user.role = (token.role === "admin" ? "admin" : token.role === "student" ? "student" : "teacher") as "admin" | "teacher" | "student"
				}
			}

			return session
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	useSecureCookies: process.env.NODE_ENV === "production",
}

export function getAuthSession() {
	return getServerSession(authOptions)
}
