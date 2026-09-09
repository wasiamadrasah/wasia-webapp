import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const adminPrefix = "/admin"
const teacherPrefix = "/teacher"
const studentPrefix = "/student"

export async function proxy(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname
  const hostname = request.headers.get('host') || ''
  const isWorkspaceSubdomain = hostname.startsWith('console.')

  // 0. Bypass middleware completely for next-auth api endpoints
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  const isAdminRoute =
    pathname === adminPrefix || pathname.startsWith(`${adminPrefix}/`)

  // 1. Admin portal is ONLY accessible on the console subdomain.
  //    Block it everywhere else with a hard 404 (no rewrite — URL not disclosed).
  if (isAdminRoute && !isWorkspaceSubdomain) {
    return new NextResponse(null, { status: 404 })
  }

  // 2. Subdomain routing for admission portal
  if (hostname.startsWith('admission.')) {
    url.pathname = `/admission-portal${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // 3. admin.* subdomain is invalid — return hard 404
  if (hostname.startsWith('admin.')) {
    return new NextResponse(null, { status: 404 })
  }

  // Fetch authentication token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const requestHeaders = new Headers(request.headers)

  // 3. Console subdomain routing
  if (isWorkspaceSubdomain) {
    // Strip "/admin" prefix if present on subdomain to maintain clean URLs
    if (isAdminRoute) {
      const cleanPath = pathname === adminPrefix ? "/" : pathname.substring(adminPrefix.length)
      const redirectUrl = new URL(cleanPath, request.url)
      redirectUrl.search = url.search
      return NextResponse.redirect(redirectUrl)
    }

    // Skip Next.js internals, API paths, and static assets
    const isSystemRoute = pathname.startsWith("/_next/") || pathname.startsWith("/api/") || pathname.includes(".")
    if (isSystemRoute) {
      requestHeaders.set("x-pathname", pathname)
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    // Set x-pathname to standard admin path so inner layout checks pass cleanly
    const rewrittenPath = `/admin${pathname}`
    requestHeaders.set("x-pathname", rewrittenPath)

    // Handle authentication checks for console subdomain
    if (pathname === "/login" || pathname === "/") {
      if (token?.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      if (token?.role === "teacher") {
        return NextResponse.redirect(new URL(`${url.protocol}//${hostname.replace('console.', '')}/teacher/dashboard`))
      }
      if (token?.role === "student") {
        return NextResponse.redirect(new URL(`${url.protocol}//${hostname.replace('console.', '')}/student/dashboard`))
      }
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } else {
      // Require admin permissions for all console subdomain pages
      if (token?.role !== "admin") {
        const redirectUrl = new URL("/login", request.url)
        redirectUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Rewrite request internally to App Router's /admin path
    url.pathname = rewrittenPath
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    })
  }

  // 4. Non-console routing (Teacher, Student, and Public layouts)
  requestHeaders.set("x-pathname", pathname)

  const isTeacherRoute = pathname === teacherPrefix || pathname.startsWith(`${teacherPrefix}/`)
  const isStudentRoute = pathname === studentPrefix || pathname.startsWith(`${studentPrefix}/`)

  const isTeacherLogin = pathname === "/teacher/login"
  const isStudentLogin = pathname === "/student/login"

  // Handle Teacher Login routing
  if (isTeacherLogin) {
    if (token?.role === "teacher") {
      return NextResponse.redirect(new URL("/teacher/dashboard", request.url))
    }
    if (token?.role === "admin") {
      return NextResponse.redirect(new URL(`${url.protocol}//console.${hostname}/dashboard`))
    }
    if (token?.role === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url))
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Handle Student Login routing
  if (isStudentLogin) {
    if (token?.role === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url))
    }
    if (token?.role === "admin") {
      return NextResponse.redirect(new URL(`${url.protocol}//console.${hostname}/dashboard`))
    }
    if (token?.role === "teacher") {
      return NextResponse.redirect(new URL("/teacher/dashboard", request.url))
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Route security checks
  if (isTeacherRoute && token?.role !== "teacher") {
    return NextResponse.redirect(new URL("/teacher/login", request.url))
  }

  if (isStudentRoute && token?.role !== "student") {
    return NextResponse.redirect(new URL("/student/login", request.url))
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
