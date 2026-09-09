"use client"

import { Outfit } from "next/font/google"
import Link from "next/link"
import {
  GraduationCap,
  CalendarDays,
  FileCheck,
  Download,
  ClipboardList,
  BadgeCheck,
  Phone,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"

const admissionSteps = [
  {
    title: "Online Application Submission",
    description:
      "Applicants must complete the admission form online through the government school admission portal.",
    icon: ClipboardList,
  },
  {
    title: "Application Fee Payment",
    description:
      "After form submission, application fees must be paid via Teletalk SMS following official instructions.",
    icon: FileCheck,
  },
  {
    title: "Lottery / Merit Selection",
    description:
      "Student selection is conducted through the official centralized admission process.",
    icon: BadgeCheck,
  },
  {
    title: "Final Admission Confirmation",
    description:
      "Selected students must complete document verification and final admission within the given dates.",
    icon: GraduationCap,
  },
]

const requirements = [
  "Online application print copy",
  "Student birth certificate copy",
  "Passport-size photographs",
  "Guardian NID copy",
  "Previous academic transcript / testimonial",
  "Migration / transfer certificate (if applicable)",
]

const schedule = [
  {
    title: "Online Application",
    date: "Government schedule as published",
  },
  {
    title: "Lottery / Selection Result",
    date: "Official merit list publication date",
  },
  {
    title: "Final Admission",
    date: "17, 18 & 21 December 2025 (1st merit as per school notice)",
  },
]

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default function AdmissionPage() {
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
            <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
            <span>ENROLLMENT GUIDE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Admission{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Information
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Purba Bakalia City Corporation High School admission process follows
            government online application and centralized selection guidelines.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Admission" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-slate-50 px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            {/* Fixed-size icon container — prevents flex shrink on narrow screens */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <CalendarDays className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Application Mode</h3>
            <p className="mt-2 text-sm text-slate-600">Online (Government Portal)</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <ClipboardList className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Fee Payment</h3>
            <p className="mt-2 text-sm text-slate-600">Teletalk SMS System</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <BadgeCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Selection</h3>
            <p className="mt-2 text-sm text-slate-600">Lottery / Merit Based</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <Phone className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Admission Help</h3>
            <p className="mt-2 text-sm text-slate-600">01309-131385</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Admission Process</h2>
            <p className="mt-3 text-slate-600">Complete these steps for successful admission.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {admissionSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <div
                  key={step.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-md"
                >
                  {/* shrink-0 keeps the icon box square at all screen widths */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Icon className="h-7 w-7 text-emerald-600" />
                  </div>

                  <div className="mt-5">
                    <span className="text-sm font-semibold text-emerald-700">Step {index + 1}</span>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requirements + Schedule */}
      <section className="bg-slate-50 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* Requirements */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Required Documents</h2>

            <ul className="mt-6 space-y-4">
              {requirements.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {/* Wrapper div with fixed h-6 w-6 + shrink-0 ensures uniform icon size in the list */}
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Important Schedule</h2>

            <div className="mt-6 space-y-4">
              {schedule.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 px-4 py-4"
                >
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-white px-6 py-12 md:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            {/* Rounded pill container with fixed size — icon stays clearly visible on mobile */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Important Note</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Students must carefully follow official government admission
                instructions, submit accurate information, and preserve payment
                confirmation details for future verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <Download className="h-8 w-8 text-emerald-600" />
          </div>

          <h2 className="mt-4 text-3xl font-bold text-slate-900">Apply Online</h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Complete your admission application through the official portal and
            school notice instructions.
          </p>

          <Link
            href="https://gsa.teletalk.com.bd"
            target="_blank"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Apply Now
          </Link>
        </div>
      </section>
    </main>
  )
}
