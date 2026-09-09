import type { ElementType, ReactNode } from "react"
import { PublicBreadcrumb } from "./public-breadcrumb"

export type PublicHeroProps = {
  title: string
  subtitle?: string
  badgeText?: string
  badgeIcon?: ElementType<{ className?: string }>
  breadcrumbCurrent?: string
  breadcrumbParent?: {
    label: string
    href: string
  }
  children?: ReactNode
  className?: string
  align?: "center" | "left"
}

export function PublicHero({
  title,
  subtitle,
  badgeText,
  badgeIcon: BadgeIcon,
  breadcrumbCurrent,
  breadcrumbParent,
  children,
  className = "",
  align = "center",
}: PublicHeroProps) {
  const isLeft = align === "left"
  const currentBreadcrumb = breadcrumbCurrent ?? title

  return (
    <section
      className={`relative border-b-2 border-[#B68A18] bg-[#064A42] py-8 md:py-10 text-white ${className}`}
    >
      <div
        className={`mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ${
          isLeft ? "text-left" : "text-center"
        }`}
      >
        {/* Optional Eyebrow Badge */}
        {badgeText && (
          <div
            className={`mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#B68A18]/40 bg-white/10 px-3.5 py-0.5 text-[14px] font-semibold text-[#B68A18]`}
          >
            {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5 text-[#B68A18]" />}
            <span>{badgeText}</span>
          </div>
        )}

        {/* Main Heading */}
        <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
          {title}
        </h1>

        {/* Optional Subtitle */}
        {subtitle && (
          <p
            className={`mt-2 max-w-2xl text-[15px] leading-relaxed text-[#DCEEE9] ${
              isLeft ? "" : "mx-auto"
            }`}
          >
            {subtitle}
          </p>
        )}

        {/* Breadcrumb Navigation */}
        {currentBreadcrumb && (
          <div className={`mt-3.5 flex ${isLeft ? "justify-start" : "justify-center"}`}>
            <PublicBreadcrumb
              current={currentBreadcrumb}
              parent={breadcrumbParent}
              className="text-[15px] text-white/90"
              plainCurrent
            />
          </div>
        )}

        {/* Optional Additional Content (Search bar, Filter tabs, Action buttons) */}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  )
}

export default PublicHero
