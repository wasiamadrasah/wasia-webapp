import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileTextIcon } from "lucide-react"

const pages = [
  {
    title: "Governing Body",
    description: "Manage governing body members",
    href: "/admin/pages/governing-body",
    icon: FileTextIcon,
  },
  {
    title: "About",
    description: "Coming soon",
    href: "#",
    icon: FileTextIcon,
    disabled: true,
  },
  {
    title: "History",
    description: "Coming soon",
    href: "#",
    icon: FileTextIcon,
    disabled: true,
  },
  {
    title: "Admission",
    description: "Coming soon",
    href: "#",
    icon: FileTextIcon,
    disabled: true,
  },
  {
    title: "Results",
    description: "Coming soon",
    href: "#",
    icon: FileTextIcon,
    disabled: true,
  },
  {
    title: "Performance Metrics",
    description: "Coming soon",
    href: "#",
    icon: FileTextIcon,
    disabled: true,
  },
]

export const metadata = {
  title: "Pages | Admin",
}

export default async function PagesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <main className="flex flex-col gap-6 px-6 py-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Pages</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage static pages and content sections
        </p>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          const Icon = page.icon
          return (
            <div
              key={page.title}
              className="rounded-lg border border-slate-200 bg-white p-6 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Icon className="mb-3 h-6 w-6 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {page.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {page.description}
                  </p>
                </div>
              </div>
              {!page.disabled && (
                <Button asChild className="mt-4 w-full">
                  <Link href={page.href}>Manage</Link>
                </Button>
              )}
              {page.disabled && (
                <Button disabled className="mt-4 w-full">
                  Coming Soon
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
