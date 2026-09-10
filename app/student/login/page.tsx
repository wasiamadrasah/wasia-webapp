"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import localFont from "next/font/local"
import "@/app/(public)/public-site.css"
import {
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowLeft,
  GraduationCap,
  ArrowRight,
} from "lucide-react"

const kalpurush = localFont({
  src: "../../../public/fonts/kalpurush.woff2",
  variable: "--font-kalpurush",
  display: "swap",
})

const bensen = localFont({
  src: "../../../public/fonts/BenSenHandwriting.ttf",
  variable: "--font-bensen",
  display: "swap",
})

export default function StudentLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [idWarning, setIdWarning] = useState("")
  const [passwordWarning, setPasswordWarning] = useState("")
  const [instituteLogo, setInstituteLogo] = useState<string | null>(null)
  const [instituteName, setInstituteName] = useState<string>("ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসা")
  const router = useRouter()

  useEffect(() => {
    fetch("/api/public/home-feed", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        const logo = data.institute_settings?.primary?.logo
        const nameBn = data.institute_settings?.primary?.instituteNameBn?.trim()
        const nameEn = data.institute_settings?.primary?.instituteName?.trim()
        if (logo) setInstituteLogo(logo)
        if (nameBn) setInstituteName(nameBn)
        else if (nameEn) setInstituteName(nameEn)
      })
      .catch(() => {
        /* fallback to default */
      })
  }, [])

  const banglaDigitsMap: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  }

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    // Convert Bengali numerals to English numerals
    const convertedDigits = rawVal.replace(/[০-৯]/g, (char) => banglaDigitsMap[char] || char)

    // Check if there are any remaining Bengali characters
    if (/[\u0980-\u09FF]/.test(convertedDigits)) {
      setIdWarning("স্টুডেন্ট আইডি শুধুমাত্র ইংরেজি অক্ষরে ও সংখ্যায় লিখুন। আপনার কীবোর্ড ইংরেজিতে পরিবর্তন করুন।")
      // Filter out Bengali characters
      const filtered = convertedDigits.replace(/[\u0980-\u09FF]/g, "")
      setEmail(filtered)
    } else {
      setIdWarning("")
      setEmail(convertedDigits)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value

    // Check if there are any Bengali characters
    if (/[\u0980-\u09FF]/.test(rawVal)) {
      setPasswordWarning("পাসওয়ার্ডের জন্য ইংরেজি কীবোর্ড ব্যবহার করুন (বাংলা বর্ণ গ্রহণযোগ্য নয়)।")
      // Filter out Bengali characters
      const filtered = rawVal.replace(/[\u0980-\u09FF]/g, "")
      setPassword(filtered)
    } else {
      setPasswordWarning("")
      setPassword(rawVal)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (/[\u0980-\u09FF]/.test(email) || /[\u0980-\u09FF]/.test(password)) {
      setError("আইডি ও পাসওয়ার্ড অবশ্যই ইংরেজি কীবোর্ডে টাইপ করতে হবে।")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        loginAs: "student",
        redirect: false,
      })

      if (result?.error) {
        setError("স্টুডেন্ট আইডি অথবা পাসওয়ার্ড সঠিক নয়। দয়া করে পুনরায় চেষ্টা করুন।")
        return
      }

      router.push("/student/dashboard")
    } catch {
      setError("লগইন করতে সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      className={`public-site ${kalpurush.variable} ${bensen.variable} min-h-screen bg-[#F7F8F5] flex flex-col lg:grid lg:grid-cols-12 text-[#17211E] selection:bg-[#075E54] selection:text-white`}
      style={{
        fontFamily: `var(--font-kalpurush), "Kalpurush", sans-serif`,
      }}
    >
      {/* ── Left Branded Editorial Hero (Desktop) ── */}
      <section className="hidden lg:flex lg:col-span-7 xl:col-span-7 relative bg-[#064A42] flex-col justify-between p-12 xl:p-16 text-white overflow-hidden">
        {/* Islamic Educational Heritage Architectural Background Image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/islamic-heritage-bg.jpg"
            alt="ঐতিহাসিক দ্বীনি শিক্ষাঙ্গন"
            fill
            className="object-cover object-center opacity-40 brightness-90 contrast-110"
            priority
          />
          {/* Balanced Green Overlay for Crisp Visibility & Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#064A42] via-[#064A42]/80 to-[#064A42]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#064A42] via-transparent to-[#064A42]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(182,138,24,0.2),transparent_70%)]" />
        </div>

        {/* Top Header Link */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-100/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>মূল ওয়েবসাইট</span>
          </Link>
        </div>

        {/* Center Editorial Branding */}
        <div className="relative z-10 my-auto max-w-lg">
          {/* Bismillah in Amiri Font */}
          <div
            className="text-2xl text-[#E7C66B] mb-4 font-serif select-none"
            style={{ fontFamily: '"Amiri", "Traditional Arabic", serif' }}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>

          <h1
            className="font-heading text-4xl xl:text-5xl font-bold leading-tight text-white"
            style={{
              fontFamily: `var(--font-bensen), "BenSen", var(--font-kalpurush), sans-serif`,
            }}
          >
            {instituteName}
          </h1>

          <p className="mt-2 text-xl font-medium text-emerald-200">
            শিক্ষার্থী ডিজিটাল পোর্টাল
          </p>

          {/* Institutional Gold Divider */}
          <div className="w-14 h-0.5 bg-[#B68A18] my-6" />

          <p className="text-base text-emerald-100/95 leading-relaxed">
            জ্ঞান, আমল ও তাকওয়ার সমন্বয়ে গঠিত এক আদর্শ দ্বীনি শিক্ষাঙ্গন। দৈনিক ক্লাস রুটিন, উপস্থিতি ও ফলাফল দেখতে সাইন ইন করুন।
          </p>

          {/* Clean Islamic Quote */}
          <blockquote className="mt-8 border-l-2 border-[#B68A18] pl-4 text-emerald-100/90 text-sm leading-relaxed bg-black/10 py-2 rounded-r-lg">
            <span
              className="text-base text-[#F9E7B3] font-serif not-italic mr-2"
              style={{ fontFamily: '"Amiri", "Traditional Arabic", serif' }}
            >
              رَّبِّ زِدْنِي عِلْمًا
            </span>
            <span>&ldquo;হে আমার প্রতিপালক, আমার জ্ঞান বৃদ্ধি করে দিন।&rdquo;</span>
            <span className="block text-xs text-emerald-300/80 mt-0.5">— সূরা ত্বাহা: ১১৪</span>
          </blockquote>
        </div>

        {/* Bottom Quiet Footer */}
        <div className="relative z-10 text-xs text-emerald-200/70 flex items-center gap-2">
          <span>ডিজিটাল শিক্ষা ব্যবস্থাপনা</span>
          <span>•</span>
          <span>কারিগরি সহযোগিতায়: ডিজিক্যাম্পাস</span>
        </div>
      </section>

      {/* ── Right Form Column ── */}
      <section className="flex-1 flex flex-col justify-center px-4 py-10 sm:px-6 lg:px-8 lg:col-span-5 xl:col-span-5 bg-[#F7F8F5]">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Back Link */}
          <div className="flex items-center justify-start mb-6 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#075E54] hover:text-[#064A42]"
            >
              <ArrowLeft className="size-4" />
              <span>মূল ওয়েবসাইট</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-[#E2E7E4] p-6 sm:p-9 shadow-sm">
            {/* Institute Logo & Title */}
            <div className="text-center mb-7">
              {instituteLogo ? (
                <div className="flex justify-center mb-4">
                  <div className="relative h-20 w-20 rounded-full bg-[#F7F8F5] p-2 border border-[#E2E7E4] shadow-xs">
                    <Image
                      src={instituteLogo}
                      alt={instituteName}
                      fill
                      className="object-contain p-1.5"
                      sizes="80px"
                      priority
                      onError={() => setInstituteLogo(null)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F7F5] border border-[#075E54]/20 text-[#075E54]">
                    <GraduationCap className="size-8" />
                  </div>
                </div>
              )}

              <p className="text-xs font-semibold text-[#075E54] tracking-wide uppercase">
                {instituteName}
              </p>
              <h2
                className="mt-1.5 font-heading text-2xl sm:text-3xl font-bold text-[#17211E]"
                style={{
                  fontFamily: `var(--font-bensen), "BenSen", var(--font-kalpurush), sans-serif`,
                }}
              >
                শিক্ষার্থী লগইন
              </h2>
              <p className="mt-1 text-sm text-[#5F6B67]">
                আপনার অ্যাকাউন্টে প্রবেশ করতে আইডি ও পাসওয়ার্ড দিন
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs sm:text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Student ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="student-id"
                    className="block text-[15px] font-semibold text-[#17211E]"
                  >
                    স্টুডেন্ট আইডি
                  </label>
                  <span className="text-[11px] font-medium text-[#5F6B67]">ইংরেজি অক্ষরে</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6B67]">
                    <User className="size-4" />
                  </span>
                  <input
                    id="student-id"
                    type="text"
                    placeholder="যেমন: 26100001"
                    value={email}
                    onChange={handleIdChange}
                    required
                    autoComplete="username"
                    className={`block h-11 w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-[15px] text-[#17211E] placeholder:text-[#5F6B67]/60 outline-none transition ${idWarning
                      ? "border-amber-500 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                      : "border-[#E2E7E4] focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/15"
                      }`}
                  />
                </div>
                {idWarning && (
                  <p className="text-[12px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <span className="font-bold">⚠</span>
                    <span>{idWarning}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="student-password"
                    className="block text-[15px] font-semibold text-[#17211E]"
                  >
                    পাসওয়ার্ড
                  </label>
                  <span className="text-[11px] font-medium text-[#5F6B67]">ইংরেজি অক্ষরে</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6B67]">
                    <Lock className="size-4" />
                  </span>
                  <input
                    id="student-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    autoComplete="current-password"
                    className={`block h-11 w-full rounded-lg border bg-white py-2 pl-10 pr-11 text-[15px] text-[#17211E] placeholder:text-[#5F6B67]/60 outline-none transition ${passwordWarning
                      ? "border-amber-500 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                      : "border-[#E2E7E4] focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/15"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5F6B67] hover:text-[#17211E] transition-colors"
                    aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {passwordWarning && (
                  <p className="text-[12px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <span className="font-bold">⚠</span>
                    <span>{passwordWarning}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-[#075E54] hover:bg-[#064A42] text-white text-[15px] font-semibold shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <span>যাচাই করা হচ্ছে...</span>
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            {/* Help / Footer in Card */}
            <div className="mt-6 pt-5 border-t border-[#E2E7E4] text-center">
              <p className="text-xs text-[#5F6B67] leading-relaxed">
                পাসওয়ার্ড ভুলে গেলে বা কোনো সমস্যার জন্য মাদ্রাসা অফিসে যোগাযোগ করুন
              </p>
              <div className="mt-3 flex items-center justify-center text-xs font-semibold text-[#075E54]">
                <Link href="/" className="hover:underline underline-offset-4">
                  মূল ওয়েবসাইটে ফিরে যান
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
