"use client"

import {
  Landmark,
  School,
  CalendarDays,
  BadgeCheck,
  MonitorSmartphone,
  Trophy,
  Users,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"

const timeline = [
  {
    year: "2003",
    title: "Institution Established",
    description:
      "Purba Bakalia City Corporation High School began its journey to provide quality secondary education in Purba Bakalia, Chattogram.",
  },
  {
    year: "2009",
    title: "City Corporation Affiliation",
    description:
      "Official inclusion under Chattogram City Corporation strengthened governance and institutional credibility.",
  },
  {
    year: "2010–2014",
    title: "Academic Recognition",
    description:
      "Progressive academic approvals expanded institutional scope and recognition.",
  },
  {
    year: "2013–2015",
    title: "Secondary Stream Expansion",
    description:
      "Science, Humanities, and Business Studies streams were introduced.",
  },
  {
    year: "2019",
    title: "MPO Enrollment",
    description:
      "The school achieved MPO inclusion, marking a major institutional milestone.",
  },
  {
    year: "Today",
    title: "Digital & Holistic Growth",
    description:
      "Modern ICT systems, discipline, leadership, and academic excellence define the school’s present identity.",
  },
]

const achievements = [
  "Established in 2003",
  "City Corporation affiliation in 2009",
  "Expansion to full secondary education",
  "Science, Humanities & Business Studies streams",
  "MPO inclusion in 2019",
  "Digital academic and administrative transformation",
]

export default function HistoryPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 px-4 py-16 text-white sm:px-6 md:px-10 md:py-24">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-emerald-300 backdrop-blur">
              <Landmark className="h-4 w-4" />
              Our Legacy
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-7xl">
              Our{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                History
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
              Since 2003, Purba Bakalia City Corporation High School has grown
              from a community vision into a respected educational institution
              shaped by academic excellence, civic support, and progressive
              transformation.
            </p>

            <PublicBreadcrumb
              current="History"
              className="mt-8 flex justify-center text-sm text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Story Intro */}
      <section className="px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
              <School className="h-12 w-12 text-emerald-400" />
              <h2 className="mt-6 text-3xl font-bold">
                A Journey of Purpose
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                Founded to serve the educational needs of Purba Bakalia,
                the institution steadily evolved through academic expansion,
                government recognition, and technological modernization.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Educational Growth with Community Roots
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                Purba Bakalia City Corporation High School was established in
                2003 with the mission of providing accessible and disciplined
                education in Chattogram. Over the years, it gained academic
                recognition, introduced multiple academic streams, secured MPO
                inclusion, and embraced ICT-enabled systems for modern learning.
                Today, it stands as a symbol of educational progress, moral
                values, and student empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-50 px-4 py-14 sm:px-6 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Milestones Through Time
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              Major developments that shaped our institution’s identity.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-slate-200 md:block lg:left-1/2" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={item.year + item.title}
                  className={`relative grid gap-6 md:grid-cols-2 ${
                    index % 2 === 0 ? "" : ""
                  }`}
                >
                  <div
                    className={`${
                      index % 2 === 0
                        ? "md:pr-10 lg:text-right"
                        : "md:col-start-2 md:pl-10"
                    }`}
                  >
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
                      <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                        {item.year}
                      </span>

                      <h3 className="mt-4 text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="absolute left-2 top-10 hidden h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow md:block lg:left-1/2 lg:-translate-x-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: School,
                title: "Established",
                value: "2003",
              },
              {
                icon: CalendarDays,
                title: "CCC Affiliation",
                value: "2009",
              },
              {
                icon: BadgeCheck,
                title: "MPO Inclusion",
                value: "2019",
              },
              {
                icon: MonitorSmartphone,
                title: "Modern Era",
                value: "Digital Systems",
              },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                    <Icon className="h-7 w-7 text-emerald-600" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Achievements + Culture */}
      <section className="bg-slate-50 px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Key Achievements
            </h2>

            <div className="mt-6 space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement} className="flex gap-3">
                  <Trophy className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <p className="text-sm leading-relaxed text-slate-700">
                    {achievement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Culture & Community
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <Users className="mt-0.5 h-5 w-5 text-emerald-400" />
                <p className="text-sm leading-relaxed text-slate-300">
                  Leadership, discipline, and civic responsibility remain
                  central to student development.
                </p>
              </div>

              <div className="flex gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 text-emerald-400" />
                <p className="text-sm leading-relaxed text-slate-300">
                  Strong SSC preparation and academic commitment define
                  institutional priorities.
                </p>
              </div>

              <div className="flex gap-3">
                <MonitorSmartphone className="mt-0.5 h-5 w-5 text-emerald-400" />
                <p className="text-sm leading-relaxed text-slate-300">
                  Modern ICT tools support communication, records, and digital
                  education systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 pb-20 pt-14 sm:px-6 md:px-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-gradient-to-r from-emerald-600 to-teal-600 p-10 text-white shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Continuing Our Legacy
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-50 sm:text-base">
                From humble beginnings in 2003 to becoming a progressive
                educational institution, our history reflects resilience,
                transformation, and commitment to shaping future generations.
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-slate-100">
                Explore Our Future
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}