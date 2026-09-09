"use client"

import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function formatSegment(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const parts = pathname.split("/").filter(Boolean)

  const isAdminRoute = parts[0] === "admin"
  const trail = isAdminRoute ? parts.slice(1) : parts

  if (trail.length === 0 || trail[0] === "dashboard") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-[#0F172A]">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const dashboardHref = isAdminRoute ? "/admin/dashboard" : "/dashboard"

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={dashboardHref} className="text-[#64748B] hover:text-[#0F172A] font-medium">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>

        {trail.map((segment, index) => {
          const isLast = index === trail.length - 1
          const href = `/${parts.slice(0, (parts[0] === "admin" ? 1 : 0) + index + 1).join("/")}`
          const label = formatSegment(segment)

          return (
            <div key={href} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-[#0F172A]">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="text-[#64748B] hover:text-[#0F172A] font-medium">{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
