import { Outfit } from "next/font/google"
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Landmark,
} from "lucide-react"

import { createPageMetadata } from "@/lib/seo"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"

export const metadata = createPageMetadata({
  title: "Policies & Documents",
  description:
    "Official policies, academic guidelines, institutional procedures, and governance documents of Purba Bakalia City Corporation High School.",
  path: "/policies",
  keywords: [
    "school policies",
    "PBCCHS policies",
    "academic policy",
    "school rules",
    "student guidelines",
  ],
})

type PolicyDoc = {
  title: string
  description: string
  category: string
  updated: string
  fileUrl?: string
}

const policies: PolicyDoc[] = [
  {
    title: "Student Code of Conduct",
    description:
      "Guidelines regarding student behaviour, discipline, uniform policy, academic integrity, and respectful conduct within the institution.",
    category: "Student",
    updated: "January 2026",
  },
  {
    title: "Attendance & Leave Policy",
    description:
      "Rules regarding minimum attendance requirements, leave applications, guardian communication, and irregular attendance procedures.",
    category: "Academic",
    updated: "December 2025",
  },
  {
    title: "Examination & Assessment Policy",
    description:
      "Procedures related to examinations, grading systems, assessment methods, promotion criteria, and result publication.",
    category: "Academic",
    updated: "January 2026",
  },
  {
    title: "Digital Device Usage Policy",
    description:
      "Guidelines regarding student mobile phone usage, digital classroom devices, internet safety, and responsible technology use.",
    category: "Student",
    updated: "October 2025",
  },
  {
    title: "Anti-Bullying & Safety Policy",
    description:
      "Institutional policy ensuring a safe, respectful, and harassment-free learning environment for all students.",
    category: "Safety",
    updated: "January 2026",
  },
  {
    title: "Teacher Recruitment Policy",
    description:
      "Recruitment standards, qualification requirements, interview procedures, and staff appointment regulations.",
    category: "HR",
    updated: "September 2025",
  },
  {
    title: "Fee Collection & Refund Policy",
    description:
      "Rules regarding tuition payment schedules, late fees, refunds, and financial assistance procedures.",
    category: "Financial",
    updated: "August 2025",
  },
  {
    title: "Data Privacy & Information Protection",
    description:
      "Policy regarding collection, storage, and protection of student, parent, and staff information.",
    category: "Compliance",
    updated: "November 2025",
  },
  {
    title: "Emergency & Disaster Preparedness",
    description:
      "Safety procedures for fire emergencies, natural disasters, evacuation protocols, and first aid response.",
    category: "Safety",
    updated: "January 2026",
  },
]

const categoryStyles: Record<string, string> = {
  Student: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Academic: "bg-blue-50 text-blue-700 border-blue-100",
  Financial: "bg-amber-50 text-amber-700 border-amber-100",
  HR: "bg-violet-50 text-violet-700 border-violet-100",
  Compliance: "bg-slate-100 text-slate-700 border-slate-200",
  Safety: "bg-rose-50 text-rose-700 border-rose-100",
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default function PoliciesPage() {
  return (
    <main>
      {/* HERO */}
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>GOVERNANCE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Policies{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              &amp; Documents
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Official school policies, procedures, and governance documents.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Policies" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-slate-100 bg-white px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <BookOpen className="h-8 w-8 text-emerald-600" />

            <h3 className="mt-4 text-lg font-black text-slate-900">
              Academic Policies
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Rules and procedures regarding academics, examinations,
              attendance, and student assessment systems.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />

            <h3 className="mt-4 text-lg font-black text-slate-900">
              Student Safety
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Institutional commitments to discipline, safety, anti-bullying,
              and responsible student conduct.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <Landmark className="h-8 w-8 text-emerald-600" />

            <h3 className="mt-4 text-lg font-black text-slate-900">
              Governance
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Administrative procedures, compliance standards, institutional
              management, and operational policies.
            </p>
          </div>
        </div>
      </section>

      {/* POLICY LIST */}
      <section className="bg-slate-50 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Official Documents
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Policies & Institutional Guidelines
            </h2>
          </div>

          <div className="grid gap-6">
            {policies.map((policy, i) => (
              <article
                key={`${policy.title}-${i}`}
                className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  {/* ICON */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                    <FileText className="h-6 w-6 text-slate-600" />
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900">
                        {policy.title}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${categoryStyles[policy.category]}`}
                      >
                        {policy.category}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-8 text-slate-600">
                      {policy.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <span className="text-xs font-medium text-slate-400">
                        Last Updated: {policy.updated}
                      </span>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="shrink-0">
                    {policy.fileUrl ? (
                      <a
                        href={policy.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-100"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* FOOTNOTE */}
          <div className="mt-14 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-center">
            <p className="text-sm leading-7 text-emerald-800">
              For printed copies, certified policy documents, or additional
              institutional guidelines, please contact the school office during
              official working hours.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
