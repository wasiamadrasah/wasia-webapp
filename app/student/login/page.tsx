"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { AlertCircle, Eye, EyeOff, User, Lock, ArrowLeft, GraduationCap, ShieldCheck, Sparkles } from "lucide-react"

export default function StudentLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [instituteLogo, setInstituteLogo] = useState<string | null>(null)
  const [instituteName, setInstituteName] = useState<string>("Purba Bakalia City Corporation High School")
  const router = useRouter()

  useEffect(() => {
    fetch("/api/public/home-feed", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data) return
        const logo = data.institute_settings?.primary?.logo
        const name = data.institute_settings?.primary?.instituteName?.trim()
        if (logo) setInstituteLogo(logo)
        if (name) setInstituteName(name)
      })
      .catch(() => {/* silently fail — page is still usable without logo */})
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        loginAs: "student",
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid Student ID or password.")
        return
      }

      router.push("/student/dashboard")
    } catch {
      setError("Unable to sign in. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] lg:bg-white flex flex-col lg:grid lg:grid-cols-12 overflow-hidden">
      {/* Branded Left Banner (Hidden on Mobile) */}
      <section className="hidden lg:flex lg:col-span-7 relative bg-[#006a4e] flex-col justify-between p-12 text-white overflow-hidden">
        {/* Animated Brand Theme Green/Teal Glow */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-400 opacity-20 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-teal-500 opacity-20 blur-[120px]" />

        {/* Back link */}
        <div className="relative z-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <ArrowLeft className="size-3.5" />
            Back to portal select
          </Link>
        </div>
        {/* Centre content */}
        <div className="relative z-10 my-auto max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
            <GraduationCap className="size-4" />
            Student Portal
          </div>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-white xl:text-6xl">
            Empowering Your Academic Journey.
          </h1>

          <p className="mt-6 text-base leading-relaxed text-emerald-100/90">
            Welcome to the Purba Bakalia City Corporation High School Student Portal. Sign in to view your academic class information, profile details, daily routine schedule, and active notices.
          </p>
        </div>

        {/* Bottom feature cards */}
        <div className="relative z-10 grid grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
            <ShieldCheck className="size-5 text-emerald-300" />
            <p className="mt-3 text-sm font-semibold text-white">Secure Access</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-100/70">Your credentials are encrypted and protected by active system policies.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
            <Sparkles className="size-5 text-emerald-300" />
            <p className="mt-3 text-sm font-semibold text-white">Stay Informed</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-100/70">Get immediate access to school notice boards, schedules, and active files.</p>
          </div>
        </div>
      </section>

      {/* Form Right Column */}
      <section className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:col-span-5 bg-[#f6f7fb] lg:bg-white">
        <div className="mx-auto w-full max-w-md">

          <div className="bg-white lg:bg-transparent py-8 px-6 lg:p-0 shadow rounded-2xl lg:shadow-none border border-slate-200 lg:border-none sm:px-10 lg:px-0">
            <div className="mb-8">
              {/* Institute Logo */}
              {instituteLogo ? (
                <div className="flex justify-center mb-5">
                  <div className="relative h-24 w-24">
                    <Image
                      src={instituteLogo}
                      alt={instituteName}
                      fill
                      className="object-contain"
                      sizes="96px"
                      onError={() => setInstituteLogo(null)}
                    />
                  </div>
                </div>
              ) : null}
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-slate-500">Please enter your student credentials to log in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Student ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="size-4" />
                  </span>
                  <input
                    id="email"
                    type="text"
                    placeholder="Enter student ID (e.g. 26100001)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="size-4" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#006a4e] hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006a4e] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center mt-4">
                <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-4">
                  Back to homepage
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
