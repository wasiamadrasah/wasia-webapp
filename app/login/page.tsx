import Link from "next/link"
import { Outfit } from "next/font/google"
import { GraduationCap, UserCircle } from "lucide-react"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata = {
  title: "Portal Access - Purba Bakalia City Corporation High School",
  description: "Select your workspace to access the school management system.",
}

export default function PortalLoginPage() {
  const portals = [
    {
      name: "Student Portal",
      description: "Access your dashboard, class routine, academic profile, and announcements.",
      href: "/student/login",
      icon: UserCircle,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-500",
    },
    {
      name: "Teacher Portal",
      description: "Manage classes, student records, personal profile, and faculty actions.",
      href: "/teacher/login",
      icon: GraduationCap,
      color: "from-[#006a4e] to-emerald-700",
      accent: "text-[#006a4e]",
    },
  ]

  return (
    <main className={`${outfit.className} min-h-screen bg-[#f6f7fb] flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8`}>
      <div className="mx-auto w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4 shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Purba Bakalia City Corporation High School
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Welcome to the digital portal ecosystem. Select your workspace to continue.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
          {portals.map((portal) => {
            const Icon = portal.icon
            return (
              <Link
                key={portal.href}
                href={portal.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${portal.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {portal.name}
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {portal.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-sm font-semibold text-[#006a4e] group-hover:underline">
                  Enter portal &rarr;
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 underline underline-offset-4">
            Back to public website
          </Link>
        </div>
      </div>
    </main>
  )
}
