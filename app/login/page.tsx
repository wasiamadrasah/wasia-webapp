import Link from "next/link"
import localFont from "next/font/local"
import "@/app/(public)/public-site.css"
import { GraduationCap, UserCircle, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"

const kalpurush = localFont({
  src: "../../public/fonts/kalpurush.woff2",
  variable: "--font-kalpurush",
  display: "swap",
})

const bensen = localFont({
  src: "../../public/fonts/BenSenHandwriting.ttf",
  variable: "--font-bensen",
  display: "swap",
})

export const metadata = {
  title: "ডিজিটাল পোর্টাল নির্বাচন - ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসা",
  description: "শিক্ষার্থী এবং শিক্ষক পোর্টাল এক্সেস করতে আপনার বিভাগ নির্বাচন করুন।",
}

export default function PortalLoginPage() {
  const portals = [
    {
      name: "শিক্ষার্থী পোর্টাল",
      subName: "Student Portal",
      description: "ক্লাস রুটিন, নোটিশ বোর্ড, হাজিরা তথ্য ও একাডেমিক প্রোফাইল দেখার জন্য প্রবেশ করুন।",
      href: "/student/login",
      icon: UserCircle,
      badge: "শিক্ষার্থীদের জন্য",
      primaryColor: "bg-[#075E54]",
      textColor: "text-[#075E54]",
      borderHover: "hover:border-[#075E54]/40",
      accentBg: "bg-[#075E54]/10",
    },
    {
      name: "শিক্ষক ও কর্মকর্তা পোর্টাল",
      subName: "Teacher & Faculty Portal",
      description: "শ্রেণি ব্যবস্থাপনা, শিক্ষার্থী হাজিরা, পাঠ পরিকল্পনা ও প্রশাসনিক কার্যাবলীর জন্য।",
      href: "/teacher/login",
      icon: GraduationCap,
      badge: "শিক্ষকদের জন্য",
      primaryColor: "bg-[#064A42]",
      textColor: "text-[#064A42]",
      borderHover: "hover:border-[#064A42]/40",
      accentBg: "bg-[#064A42]/10",
    },
  ]

  return (
    <main
      className={`public-site ${kalpurush.variable} ${bensen.variable} min-h-screen bg-[#F7F8F5] flex flex-col justify-between px-4 py-12 sm:px-6 lg:px-8 text-[#17211E]`}
      style={{
        fontFamily: `var(--font-kalpurush), "Kalpurush", sans-serif`,
      }}
    >
      <div className="mx-auto w-full max-w-4xl my-auto">
        {/* Header Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B68A18]/30 bg-[#B68A18]/10 px-4 py-1.5 text-xs font-semibold text-[#B68A18] mb-4">
            <Sparkles className="size-3.5" />
            <span>ডিজিটাল প্রাতিষ্ঠানিক সেবা</span>
          </div>

          <h1
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17211E]"
            style={{
              fontFamily: `var(--font-bensen), "BenSen", var(--font-kalpurush), sans-serif`,
            }}
          >
            ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসা
          </h1>
          <p className="mt-2.5 text-base sm:text-lg text-[#5F6B67] max-w-xl mx-auto">
            আপনার অ্যাকাউন্টে প্রবেশ করতে নিচের নির্দিষ্ট পোর্টাল নির্বাচন করুন
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {portals.map((portal) => {
            const Icon = portal.icon
            return (
              <Link
                key={portal.href}
                href={portal.href}
                className={`group relative flex flex-col justify-between rounded-2xl border border-[#E2E7E4] bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${portal.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${portal.accentBg} ${portal.textColor} group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#5F6B67] bg-[#F7F8F5] px-2.5 py-1 rounded-full border border-[#E2E7E4]">
                      {portal.badge}
                    </span>
                  </div>

                  <h2
                    className="font-heading text-2xl font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors mb-2.5"
                    style={{
                      fontFamily: `var(--font-bensen), "BenSen", var(--font-kalpurush), sans-serif`,
                    }}
                  >
                    {portal.name}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-[#5F6B67]">
                    {portal.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E7E4] flex items-center justify-between text-[15px] font-semibold text-[#075E54]">
                  <span>পোর্টালে প্রবেশ করুন</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Security / Info reassurance */}
        <div className="mt-10 flex items-center justify-center gap-2 text-[15px] text-[#5F6B67]">
          <ShieldCheck className="size-4 text-[#075E54]" />
          <span>সকল পোর্টাল তথ্য এনক্রিপ্ট ও প্রাতিষ্ঠানিক নীতিমালা দ্বারা সুরক্ষিত</span>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#5F6B67] hover:text-[#075E54] transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </Link>
        </div>
      </div>

      {/* Footer copyright note */}
      <footer className="text-center text-xs text-[#5F6B67] pt-8">
        © {new Date().getFullYear()} ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসা • সর্বস্বত্ব সংরক্ষিত
      </footer>
    </main>
  )
}
