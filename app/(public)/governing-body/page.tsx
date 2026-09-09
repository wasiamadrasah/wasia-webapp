import { Outfit } from "next/font/google"
import Image from "next/image"
import { Mail, Phone } from "lucide-react"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { getGoverningBodyMembers } from "@/lib/db"

const categoryColors: Record<string, string> = {
  President: "bg-emerald-50 text-emerald-700",
  VicePresident: "bg-blue-50 text-blue-700",
  Secretary: "bg-amber-50 text-amber-700",
  Treasurer: "bg-violet-50 text-violet-700",
  Auditor: "bg-rose-50 text-rose-700",
  Chairman: "bg-emerald-50 text-emerald-700",
  Principal: "bg-blue-50 text-blue-700",
  Guardian: "bg-amber-50 text-amber-700",
  Teacher: "bg-violet-50 text-violet-700",
  Donor: "bg-rose-50 text-rose-700",
  Nominee: "bg-slate-100 text-slate-700",
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export const dynamic = "force-dynamic"

export default async function GoverningBodyPage() {
  const governingBody = await getGoverningBodyMembers()
  const totalMembers = governingBody.length
  const remainder = totalMembers % 4

  function isValidUrl(value: string | null | undefined) {
    if (!value) return false
    try {
      // Accept absolute URLs only
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  return (
    <main>
      {/* Hero Section */}
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <Mail className="h-3.5 w-3.5 text-emerald-400" />
            <span>GOVERNANCE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Governing{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Body
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            For Academic Year 2026
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Governing Body" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* Governing Body Members */}
      <section className="bg-slate-50 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            {governingBody.map((member, index) => {
              let colClass = "lg:col-span-3"

              // Center incomplete final row
              if (remainder > 0 && index >= totalMembers - remainder) {
                if (remainder === 1 && index === totalMembers - 1) {
                  colClass = "lg:col-span-3 lg:col-start-5"
                }

                if (remainder === 2) {
                  if (index === totalMembers - 2) {
                    colClass = "lg:col-span-3 lg:col-start-4"
                  }
                }

                if (remainder === 3) {
                  if (index === totalMembers - 3) {
                    colClass = "lg:col-span-3 lg:col-start-2"
                  }
                }
              }

              return (
                <div key={member.id} className={colClass}>
                  <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    {/* Square Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                      {isValidUrl(member.image_url) ? (
                        <Image
                          src={member.image_url as string}
                          alt={member.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                          <span className="text-center text-slate-400">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="mb-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            categoryColors[member.category] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {member.category}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900">
                        {member.name}
                      </h2>

                      <p className="mt-1 text-sm font-medium text-emerald-700">
                        {member.designation}
                      </p>

                      <div className="mt-4 space-y-2">
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{member.phone}</span>
                          </div>
                        )}

                        {member.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="break-all">{member.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-8 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              Institutional Governance & Accountability
            </h3>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
              The Governing Body ensures transparent administration, strategic
              leadership, policy implementation, and continuous institutional
              development for academic excellence.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
