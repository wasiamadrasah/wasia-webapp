"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import {
  AlertCircle,
  Eye,
  EyeOff,
  Fingerprint,
  Layers3,
  Lock,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { generateCaptcha } from "@/app/admin/actions"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [securityCode, setSecurityCode] = useState("------")
  const [captchaToken, setCaptchaToken] = useState("")
  const [userInputCode, setUserInputCode] = useState("")

  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadNewCaptcha = async () => {
    setIsRefreshing(true)
    try {
      const res = await generateCaptcha()
      setSecurityCode(res.code)
      setCaptchaToken(res.token)
    } catch (err) {
      console.error("Failed to generate CAPTCHA:", err)
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  useEffect(() => {
    loadNewCaptcha()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userInputCode !== securityCode) {
      setError("Incorrect security verification code.")
      loadNewCaptcha()
      setUserInputCode("")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        loginAs: "admin",
        securityCode: captchaToken,
        userInputCode,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password.")
        loadNewCaptcha()
        setUserInputCode("")
      } else if (result?.ok) {
        const isWorkspace = typeof window !== "undefined" && (window.location.hostname.startsWith("console.") || window.location.hostname.startsWith("workspace."))
        const targetPath = isWorkspace ? "/dashboard" : "/admin/dashboard"
        window.location.href = `${targetPath}?status=success&message=Signed in successfully`
      }
    } catch {
      setError("Unable to sign in right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("mx-auto w-full max-w-5xl", className)} {...props}>
      <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl lg:grid-cols-[1.1fr_480px]">
        {/* Left Branding / Hero Panel */}
        <section className="relative hidden lg:flex lg:flex-col lg:justify-between bg-primary p-10 text-primary-foreground border-r border-primary/20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white">
              <Layers3 className="h-4 w-4" />
              <span>DigiCampus 2.0 • Admin Portal</span>
            </div>

            <h1 className="mt-8 max-w-lg text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Centralized Control & Campus Management
            </h1>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90">
              Sign in to manage academic records, staff administration, notices, events, and institute configurations seamlessly.
            </p>
          </div>

          <div className="relative z-10 mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white mb-3">
                <Fingerprint className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-white">Encrypted & Protected</p>
              <p className="mt-1 text-xs leading-normal text-white/80">Only authorized admin credentials can access system controls.</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white mb-3">
                <Lock className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-white">Audited Actions</p>
              <p className="mt-1 text-xs leading-normal text-white/80">Every administrative action is tracked and securely logged.</p>
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex items-center p-6 sm:p-10 bg-card text-card-foreground">
          <div className="w-full space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Authentication</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your administrative credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm font-semibold text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-bold text-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-10 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-bold text-foreground">
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
                    className="h-10 w-full rounded-lg border border-input bg-background px-3.5 pr-11 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Verification Code */}
              <div className="space-y-1.5">
                <label htmlFor="userInputCode" className="text-sm font-bold text-foreground">
                  Verification Code
                </label>
                <div className="grid gap-2.5 sm:grid-cols-[1fr_auto]">
                  <input
                    id="userInputCode"
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value.replace(/\D/g, ""))}
                    required
                    className="h-10 min-w-0 rounded-lg border border-input bg-background px-3.5 text-sm font-mono text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex h-10 w-full items-center justify-between rounded-lg border border-primary/20 bg-primary/10 px-3 font-mono text-base font-bold tracking-widest text-primary select-none sm:w-36">
                    <span className="line-through decoration-primary/70 decoration-2 skew-x-12 select-none">
                      {securityCode}
                    </span>
                    <button
                      type="button"
                      onClick={loadNewCaptcha}
                      disabled={isRefreshing}
                      className="grid h-7 w-7 place-items-center rounded-md text-primary hover:bg-primary/20 hover:shadow-2xs active:scale-90 transition-all disabled:opacity-50 cursor-pointer"
                      title="Get new code"
                      aria-label="Get new verification code"
                    >
                      <RefreshCw className={cn("h-3.5 w-3.5 transition-transform duration-500", isRefreshing && "animate-spin")} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-10 w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                <span>{isLoading ? "Onboarding..." : "Onboard"}</span>
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="pt-2 text-center text-xs text-muted-foreground">
                Need public site access?{" "}
                <Link href="/" className="font-semibold text-primary hover:underline">
                  Go to homepage
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
