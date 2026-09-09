"use client"

import { Outfit } from "next/font/google"
import Link from "next/link"
import {
  HeartHandshake,
  BookOpen,
  ShieldCheck,
  Users,
  Stethoscope,
  Trophy,
  Phone,
  ChevronRight,
  BadgeCheck,
  School,
} from "lucide-react"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"

const supportServices = [
  {
    title: "Academic Guidance",
    description:
      "Subject support, mentoring, study planning, exam preparation guidance, and teacher consultation.",
    icon: BookOpen,
  },
  {
    title: "Counseling & Wellbeing",
    description:
      "Emotional support, personal counseling, motivation, and student wellbeing initiatives.",
    icon: HeartHandshake,
  },
  {
    title: "Safety & Discipline",
    description:
      "Safe campus environment, anti-bullying policies, discipline monitoring, and student protection.",
    icon: ShieldCheck,
  },
  {
    title: "Health Support",
    description:
      "Basic first aid, health awareness, hygiene education, and emergency medical support.",
    icon: Stethoscope,
  },
]

const activities = [
  "Scout Activities & Leadership Programs",
  "Red Crescent Volunteer Services",
  "Annual Sports & Physical Development",
  "Debate, Quiz & Creative Competitions",
  "Cultural Programs & National Events",
  "Student Cabinet & Leadership Development",
]

const facilities = [
  "Modern classrooms with digital support",
  "Library and reading opportunities",
  "ICT-enabled academic services",
  "Co-curricular participation",
  "Guardian communication support",
  "Inclusive student development environment",
]

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default function StudentLifeSupportPage() {
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
            <School className="h-3.5 w-3.5 text-emerald-400" />
            <span>STUDENT LIFE & SUPPORT</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Student Life{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              & Support
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Empowering students through academic excellence, wellbeing,
            leadership, safety, and co-curricular opportunities.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Student Life & Support" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="bg-slate-50 px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Academic Support
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Mentorship, planning, and performance guidance
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <HeartHandshake className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Wellbeing
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Counseling and student care support
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Trophy className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Activities
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Sports, leadership, and competitions
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Phone className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Guardian Support
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Parent-school communication system
            </p>
          </div>
        </div>
      </section>

      {/* Support Services */}
      <section className="bg-white px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Student Support Services
            </h2>
            <p className="mt-3 text-slate-600">
              Comprehensive support systems for holistic student development.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {supportServices.map((service) => {
              const Icon = service.icon

              return (
                <div
                  key={service.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Icon className="h-7 w-7 text-emerald-600" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Activities + Facilities */}
      <section className="bg-slate-50 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* Activities */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Student Activities
            </h2>

            <ul className="mt-6 space-y-4">
              {activities.map((activity) => (
                <li key={activity} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-slate-700">{activity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Facilities */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Student Facilities
            </h2>

            <ul className="mt-6 space-y-4">
              {facilities.map((facility) => (
                <li key={facility} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-slate-700">{facility}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership & Community */}
      <section className="bg-white px-6 py-16 md:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <Users className="mx-auto h-12 w-12 text-emerald-600" />

          <h2 className="mt-5 text-3xl font-bold text-slate-900">
            Building Responsible Future Citizens
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
            Through leadership programs, volunteerism, academic discipline, and
            character development, we prepare students to become responsible,
            skilled, and compassionate contributors to society.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Contact Student Support
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}