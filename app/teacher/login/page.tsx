"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertCircle,
  BookOpenCheck,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
} from "lucide-react"

export default function TeacherLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        loginAs: "teacher",
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password.")
        return
      }

      router.push("/teacher/dashboard")
    } catch {
      setError("Unable to sign in right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-md lg:max-w-6xl w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_460px]">
        <section className="hidden lg:flex lg:flex-col lg:justify-between bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
              <GraduationCap className="size-4" />
              Faculty Access
            </div>

            <h1 className="mt-8 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A focused workspace for teacher records.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Sign in to manage your profile, academic qualifications, experience, training, and family information from one mobile-ready portal.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Feature icon={ShieldCheck} title="Protected access" description="Only active teacher accounts can enter this portal." />
            <Feature icon={BookOpenCheck} title="Record-first design" description="Every section is optimized for quick review and updates." />
          </div>
        </section>

        <section className="flex items-center p-5 sm:p-8">
          <div className="w-full">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Teacher Portal
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">Use your teacher account to continue.</p>
            </div>

            <form onSubmit={login} className="space-y-5">
              {error ? (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="teacher@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 transition hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-md bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-center text-xs text-slate-500">
                Need public site access?{" "}
                <Link href="/" className="font-medium text-slate-700 underline-offset-4 hover:underline">
                  Go to homepage
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-4">
      <Icon className="size-5 text-cyan-200" />
      <p className="mt-3 text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-300">{description}</p>
    </div>
  )
}
