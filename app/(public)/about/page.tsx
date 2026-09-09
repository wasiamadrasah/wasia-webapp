import { Outfit } from "next/font/google"
import {
  Target,
  Eye,
  Heart,
  Building2,
  Trophy,
  School,
  BookOpen,
  Users,
  Landmark,
} from "lucide-react"

import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about Purba Bakalia City Corporation High School, its history, mission, vision, achievements, and educational excellence.",
  path: "/about",
  keywords: [
    "PBCCHS",
    "Purba Bakalia City Corporation High School",
    "Bakalia School",
    "Chattogram School",
    "About School",
  ],
})

const values = [
  {
    icon: Target,
    title: "Academic Excellence",
    desc: "Providing quality education through disciplined academic activities and modern teaching methods.",
  },
  {
    icon: Heart,
    title: "Character Building",
    desc: "Developing responsible, ethical, and patriotic students with strong moral values.",
  },
  {
    icon: Eye,
    title: "Digital Learning",
    desc: "Encouraging technology-based education through smart classrooms and digital resources.",
  },
]

const milestones = [
  {
    year: "2003",
    event:
      "Purba Bakalia City Corporation High School was established with the vision of ensuring quality education in Bakalia.",
  },
  {
    year: "2009",
    event:
      "The institution came under Chattogram City Corporation and expanded academic operations.",
  },
  {
    year: "2013",
    event:
      "Science and Business Studies groups were officially introduced for SSC level students.",
  },
  {
    year: "2015",
    event:
      "Infrastructure and classroom facilities were modernized to improve the learning environment.",
  },
  {
    year: "2019",
    event:
      "The institution achieved MPO recognition and strengthened academic management.",
  },
  {
    year: "2025",
    event:
      "Students achieved remarkable SSC results with increasing participation in co-curricular activities.",
  },
]

const achievements = [
  "Outstanding SSC Results in Chattogram Education Board",
  "Recognized for disciplined academic environment",
  "Active participation in Scouts and cultural programs",
  "Technology-based educational management introduced",
  "Growing reputation among leading schools in Bakalia",
]

const facilities = [
  {
    icon: Building2,
    label: "Academic Building",
    count: "Modern",
  },
  {
    icon: BookOpen,
    label: "Library",
    count: "Rich Collection",
  },
  {
    icon: School,
    label: "Science Lab",
    count: "Advanced",
  },
  {
    icon: Landmark,
    label: "Computer Lab",
    count: "Digital",
  },
  {
    icon: Users,
    label: "Current Students",
    count: "700+",
  },
  {
    icon: Building2,
    label: "Campus Area",
    count: "29 Shotok",
  },
  {
    icon: Building2,
    label: "Classrooms",
    count: "Smart Ready",
  },
  {
    icon: Building2,
    label: "Scout Activities",
    count: "Active",
  },
]

const missionCards = [
  {
    title: "Our Mission",
    icon: Target,
    iconWrapClass: "bg-emerald-50",
    iconClass: "text-emerald-600",
    body: "To provide quality education that develops knowledge, morality, discipline, creativity, and leadership among students.",
  },
  {
    title: "Our Vision",
    icon: Eye,
    iconWrapClass: "bg-sky-50",
    iconClass: "text-sky-600",
    body: "To become a leading educational institution in Chattogram through innovation, academic excellence, and modern learning.",
  },
  {
    title: "Core Values",
    icon: Heart,
    iconWrapClass: "bg-rose-50",
    iconClass: "text-rose-600",
    body: "Integrity, respect, patriotism, discipline, innovation, and social responsibility guide our educational philosophy.",
  },
]

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default function AboutPage() {
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
            <School className="h-3.5 w-3.5 text-emerald-400" />
            <span>ABOUT US</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Our Story
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Vision &amp; Mission
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            A modern educational institution committed to academic excellence,
            discipline, innovation, and holistic student development.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="About Us" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Our History
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Journey Since 2003
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Purba Bakalia City Corporation High School was established in
              2003 with the vision of providing quality and affordable education
              to students in the Bakalia area of Chattogram.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Over the years, the institution has developed into a respected
              educational center known for academic discipline, student
              development, and active participation in cultural and scouting
              activities.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-4xl font-black text-emerald-600">
                  700+
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  Active Students
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-4xl font-black text-emerald-600">
                  2003
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  Year Established
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT TIMELINE */}
          <div className="relative">
            <div className="absolute bottom-8 left-7 top-8 w-px bg-gradient-to-b from-emerald-200 via-emerald-500 to-cyan-200" />

            <div className="space-y-6">
              {milestones.map(({ year, event }, i) => (
                <div key={`${year}-${i}`} className="relative pl-20">
                  <div className="absolute left-0 top-1 z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-slate-950 text-xs font-black text-emerald-300 shadow-xl shadow-emerald-900/10">
                    {year}
                  </div>

                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg md:p-6">
                    <p className="text-sm leading-7 text-slate-600">
                      {event}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-slate-50 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Mission & Vision
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              What Drives Our Institution
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {missionCards.map(
              ({ title, icon: Icon, iconWrapClass, iconClass, body }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`mb-5 inline-flex rounded-2xl p-4 ${iconWrapClass}`}
                  >
                    <Icon className={`h-7 w-7 ${iconClass}`} />
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {title}
                  </h3>

                  <p className="mt-4 text-sm leading-8 text-slate-600">
                    {body}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Why Choose Us
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Educational Strengths
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                  <Icon className="h-8 w-8 text-emerald-600" />
                </div>

                <h3 className="text-lg font-black text-slate-900">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="bg-slate-50 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Facilities
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Modern Campus Environment
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map(({ icon: Icon, label, count }) => (
              <div
                key={label}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="text-2xl font-black text-slate-900">
                  {count}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Achievements
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Awards & Recognition
            </h2>
          </div>

          <div className="space-y-4">
            {achievements.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <div className="rounded-xl bg-emerald-100 p-2">
                  <Trophy className="h-5 w-5 text-emerald-600" />
                </div>

                <p className="text-sm leading-7 text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
