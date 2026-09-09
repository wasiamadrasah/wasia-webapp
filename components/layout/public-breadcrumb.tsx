import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

type PublicBreadcrumbProps = {
  current: string
  className?: string
  tone?: "onDark" | "onLight"
  plainCurrent?: boolean
  parent?: {
    label: string
    href: string
  }
}

const banglaBreadcrumbMap: Record<string, string> = {
  "Home": "হোম",
  "Contact": "যোগাযোগ",
  "Contact Us": "যোগাযোগ",
  "About": "পরিচিতি",
  "About Us": "আমাদের পরিচিতি",
  "Teachers": "শিক্ষকমণ্ডলী",
  "Teachers List": "শিক্ষকবৃন্দের তালিকা",
  "Staffs": "কর্মকর্তা-কর্মচারী",
  "Notices": "নোটিশ বোর্ড",
  "Notice": "নোটিশ",
  "Events": "অনুষ্ঠানমালা",
  "Event": "অনুষ্ঠান",
  "Gallery": "ফটোগ্যালারি",
  "Photo Gallery": "ফটোগ্যালারি",
  "Admission": "ভর্তি তথ্য",
  "Admissions": "ভর্তি তথ্য",
  "Results": "পরীক্ষার ফলাফল",
  "Result": "ফলাফল",
  "News": "সর্বশেষ সংবাদ",
  "FAQ": "সাধারণ জিজ্ঞাসা",
  "Policies": "নীতিমালা",
  "Students": "শিক্ষার্থীবৃন্দ",
  "Student Life & Support": "শিক্ষার্থী কর্নার",
  "Downloads": "ডাউনলোড",
  "Governing Body": "পরিচালনা পর্ষদ",
  "Head Teacher": "মুহতামিম / প্রধান",
  "Headmaster": "মুহতামিম / প্রধান",
  "Performance Report": "অর্জন ও মূল্যায়ন",
  "History": "ইতিহাস ও পটভূমি",
}

function toBangla(text?: string | null): string {
  if (!text) return ""
  const trimmed = text.trim()
  return banglaBreadcrumbMap[trimmed] || trimmed
}

export function PublicBreadcrumb({
  current,
  className = "",
  tone = "onDark",
  plainCurrent = true,
  parent,
}: PublicBreadcrumbProps) {
  const isLight = tone === "onLight"

  const linkClass = isLight
    ? "inline-flex items-center gap-1.5 text-[15px] font-medium text-[#5F6B67] transition-colors duration-200 hover:text-[#075E54]"
    : "inline-flex items-center gap-1.5 text-[15px] font-medium text-[#DCEEE9] transition-colors duration-200 hover:text-[#B68A18]"

  const separatorClass = isLight
    ? "h-3.5 w-3.5 text-[#5F6B67]/50 shrink-0"
    : "h-3.5 w-3.5 text-[#B68A18] shrink-0"

  const currentClass = plainCurrent
    ? (isLight
      ? "text-[15px] font-semibold text-[#17211E]"
      : "text-[15px] font-semibold text-[#B68A18]")
    : (isLight
      ? "inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#075E54] px-3 py-1 rounded-md bg-[#F0F7F5] border border-[#075E54]/15"
      : "inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#B68A18] px-3 py-1 rounded-md bg-white/10 border border-[#B68A18]/30")

  return (
    <nav className={`inline-flex items-center ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center gap-2 flex-wrap">
        {/* Home Link */}
        <li className="flex items-center">
          <Link href="/" className={linkClass}>
            <Home className="h-4 w-4 shrink-0" />
            <span>হোম</span>
          </Link>
        </li>

        {/* Parent Link if provided */}
        {parent && (
          <>
            <li className="flex items-center" aria-hidden="true">
              <ChevronRight className={separatorClass} />
            </li>
            <li className="flex items-center">
              <Link href={parent.href} className={linkClass}>
                <span>{toBangla(parent.label)}</span>
              </Link>
            </li>
          </>
        )}

        {/* Separator */}
        <li className="flex items-center" aria-hidden="true">
          <ChevronRight className={separatorClass} />
        </li>

        {/* Current Page */}
        <li className={`${currentClass} flex items-center`}>
          <span>{toBangla(current)}</span>
        </li>
      </ol>
    </nav>
  )
}