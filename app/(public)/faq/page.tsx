"use client"

import { Outfit } from "next/font/google"
import Link from "next/link"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  ChevronDown,
  HelpCircle,
  GraduationCap,
  Wallet,
  School,
} from "lucide-react"

import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"

type FAQ = {
  q: string
  a: string
  category: string
}

const faqs: FAQ[] = [
  // Admissions
  {
    category: "Admissions",
    q: "When does the admission process begin?",
    a: "Admission forms are generally available from November each year. Admission notices are published on the official website and school notice board.",
  },
  {
    category: "Admissions",
    q: "Is there an admission test?",
    a: "Yes. Admission tests are conducted for selected classes based on institutional requirements and seat availability.",
  },
  {
    category: "Admissions",
    q: "Which documents are required for admission?",
    a: "Students must submit birth certificate, transfer certificate (if applicable), passport-size photographs, and academic transcripts.",
  },

  // Academics
  {
    category: "Academics",
    q: "Which curriculum does the school follow?",
    a: "The institution follows the National Curriculum and Textbook Board (NCTB) curriculum under the Chattogram Education Board.",
  },
  {
    category: "Academics",
    q: "Are extra academic support classes available?",
    a: "Yes. Special academic support and revision classes are arranged for SSC candidates and weak students when necessary.",
  },
  {
    category: "Academics",
    q: "How are academic results communicated?",
    a: "Results are published through report cards, notice boards, and parent meetings organized by the institution.",
  },

  // Fees
  {
    category: "Fees",
    q: "Can fees be paid digitally?",
    a: "Yes. Fees may be paid through mobile banking services and approved banking channels.",
  },
  {
    category: "Fees",
    q: "Are scholarships available?",
    a: "Merit-based scholarships and special financial assistance may be provided according to institutional policy.",
  },

  // General
  {
    category: "General",
    q: "What are the school hours?",
    a: "Academic activities are generally conducted from morning to afternoon according to the official class routine.",
  },
  {
    category: "General",
    q: "Does the school arrange co-curricular activities?",
    a: "Yes. The institution regularly organizes scouting, cultural programs, sports competitions, debates, and national day celebrations.",
  },
  {
    category: "General",
    q: "How can guardians contact teachers?",
    a: "Guardians may communicate through the school office or during scheduled guardian meetings and academic consultation sessions.",
  },
]

const categories = [
  "All",
  ...Array.from(new Set(faqs.map((f) => f.category))),
]

const categoryIcons: Record<string, LucideIcon> = {
  All: HelpCircle,
  Admissions: School,
  Academics: GraduationCap,
  Fees: Wallet,
  General: HelpCircle,
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory)

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
            <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>HELP CENTER</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Find answers to the most commonly asked questions regarding
            admissions, academics, fees, and institutional activities.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="FAQ" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-slate-50 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-5xl">
          {/* TOP */}
          <div className="mb-14 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Support & Information
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              How Can We Help You?
            </h2>
          </div>

          {/* CATEGORY FILTER */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat]

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    setOpen(null)
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat}
                </button>
              )
            })}
          </div>

          {/* FAQ ACCORDION */}
          <div className="space-y-4">
            {filtered.map((faq, i) => (
              <div
                key={`${faq.q}-${i}`}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left md:px-8"
                >
                  <div>
                    <div className="mb-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {faq.category}
                    </div>

                    <h3 className="text-base font-black leading-7 text-slate-900 md:text-lg">
                      {faq.q}
                    </h3>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 ${
                      open === i
                        ? "rotate-180 bg-emerald-50 text-emerald-600"
                        : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    open === i
                      ? "grid-rows-[1fr] border-t border-slate-100"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 py-5 md:px-8">
                      <p className="text-sm leading-8 text-slate-600 md:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <HelpCircle className="h-8 w-8 text-emerald-700" />
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-900">
              Still Have Questions?
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              If you need additional information regarding admissions,
              academics, institutional policies, or student activities, feel
              free to contact our office.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center rounded-full bg-emerald-600 px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
