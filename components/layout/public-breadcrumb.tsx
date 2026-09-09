import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

type PublicBreadcrumbProps = {
  current: string
  className?: string
  tone?: "onDark" | "onLight"
  plainCurrent?: boolean
}

export function PublicBreadcrumb({ current, className, tone = "onDark", plainCurrent = false }: PublicBreadcrumbProps) {
  const isLight = tone === "onLight"

  const linkClass = isLight
    ? "inline-flex items-center gap-1.5 text-slate-500 transition-all duration-200 hover:text-slate-700 hover:gap-2"
    : "inline-flex items-center gap-1.5 text-slate-300 transition-all duration-200 hover:text-emerald-300 hover:gap-2"

  const separatorClass = isLight
    ? "h-4 w-4 text-slate-300 shrink-0"
    : "h-4 w-4 text-slate-400 shrink-0"

  const currentClass = plainCurrent
    ? (isLight
      ? "font-semibold text-slate-700"
      : "font-semibold text-emerald-400")
    : (isLight
      ? "inline-flex items-center gap-1.5 font-semibold text-slate-700 px-3 py-1 rounded-lg bg-slate-100"
      : "inline-flex items-center gap-1.5 font-semibold text-emerald-300 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-700/30")

  return (
    <nav className={className} aria-label="Breadcrumb">
      <ol className="inline-flex items-center gap-1.5">
        <li className="flex items-center">
          <Link href="/" className={linkClass}>
            <Home className="h-4 w-4 shrink-0" />
            <span>Home</span>
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className={separatorClass} />
        </li>
        <li className={`${currentClass} flex items-center`}>
          <span>{current}</span>
        </li>
      </ol>
    </nav>
  )
}