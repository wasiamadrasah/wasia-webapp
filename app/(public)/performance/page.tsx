"use client"

import { Outfit } from "next/font/google"
import Link from "next/link"
import {
  GraduationCap,
  Trophy,
  ChevronRight,
} from "lucide-react"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"

type ExamResult = {
  exam: string
  year: string
  appeared: number
  passed: number
  notPassed: number
  passRate: number
  gpa5: number
  gpa5Rate: number
  gpa4: number
  gpa3: number
  gpa2: number
  gpa1: number
  resultLink: string
}

const examResults: ExamResult[] = [
  {
    exam: "SSC",
    year: "2021",
    appeared: 109,
    passed: 104,
    notPassed: 5,
    passRate: 95.41,
    gpa5: 6,
    gpa5Rate: 5.77,
    gpa4: 16,
    gpa3: 41,
    gpa2: 35,
    gpa1: 6,
    resultLink: "/results/ssc-2021",
  },
  {
    exam: "SSC",
    year: "2022",
    appeared: 121,
    passed: 113,
    notPassed: 8,
    passRate: 93.39,
    gpa5: 10,
    gpa5Rate: 8.85,
    gpa4: 37,
    gpa3: 45,
    gpa2: 20,
    gpa1: 1,
    resultLink: "/results/ssc-2022",
  },
  {
    exam: "SSC",
    year: "2023",
    appeared: 112,
    passed: 106,
    notPassed: 6,
    passRate: 94.64,
    gpa5: 5,
    gpa5Rate: 4.72,
    gpa4: 45,
    gpa3: 42,
    gpa2: 14,
    gpa1: 0,
    resultLink: "/results/ssc-2023",
  },
  {
    exam: "SSC",
    year: "2024",
    appeared: 134,
    passed: 126,
    notPassed: 8,
    passRate: 94.03,
    gpa5: 14,
    gpa5Rate: 11.11,
    gpa4: 30,
    gpa3: 63,
    gpa2: 15,
    gpa1: 4,
    resultLink: "/results/ssc-2024",
  },
  {
    exam: "SSC",
    year: "2025",
    appeared: 117,
    passed: 93,
    notPassed: 24,
    passRate: 79.49,
    gpa5: 16,
    gpa5Rate: 17.2,
    gpa4: 27,
    gpa3: 39,
    gpa2: 11,
    gpa1: 0,
    resultLink: "/results/ssc-2025",
  },
]

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default function ResultsPage() {
  const latest = examResults[examResults.length - 1]

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
            <span>ANALYTICS</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Performance{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Report
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Historical performance reports, pass trends, GPA-5 growth, and detailed
            academic statistics from 2021–2025.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Performance Report" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="bg-white px-6 py-12 pt-0 md:px-10">
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-8 text-center mx-auto max-w-7xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <Trophy className="h-7 w-7 text-emerald-600" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Data-Driven Academic Excellence
            </h3>

            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
              These statistics reflect our institution’s evolving academic
              journey, highlighting both achievements and opportunities for
              future growth.
            </p>
          </div>        
      </section>


{/* Accurate Multi-Metric Bar Chart Section */}
<section className="bg-slate-50 px-6 py-16 md:px-10">
  <div className="mx-auto max-w-6xl">
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-slate-900">
        Year-wise SSC Performance
      </h2>
      <p className="mt-3 text-slate-600">
        Separate comparison of Appeared, Passed, Not Passed, and GPA-5 counts.
      </p>
    </div>

{/* Latest Stats */}
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">2025 Pass Rate</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {latest.passRate}%
            </h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">2025 GPA-5</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {latest.gpa5}
            </h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Appeared</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {latest.appeared}
            </h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Passed</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {latest.passed}
            </h3>
          </div>
        </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={examResults}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 10,
            }}
            barCategoryGap="18%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                name,
              ]}
            />
            <Legend />

            {/* Appeared */}
            <Bar
              dataKey="appeared"
              name="Appeared"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />

            {/* Passed */}
            <Bar
              dataKey="passed"
              name="Passed"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />

            {/* Not Passed */}
            <Bar
              dataKey="notPassed"
              name="Not Passed"
              fill="#ef4444"
              radius={[6, 6, 0, 0]}
            />

            {/* GPA-5 */}
            <Bar
              dataKey="gpa5"
              name="GPA-5"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Pass Rate Secondary Chart */}
    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-slate-900">
          Pass Rate (%) Trend
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Percentage-based yearly pass performance.
        </p>
      </div>

      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={examResults}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Pass Rate"]}
            />
            <Legend />

            <Bar
              dataKey="passRate"
              name="Pass Rate %"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</section>

      {/* Detailed Table */}
      <section className="bg-white px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Detailed SSC History
            </h2>
            <p className="mt-3 text-slate-600">
              Complete pass, GPA, and participation records.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Year
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Appeared
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Passed
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Not Passed
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Pass %
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      GPA-5
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      GPA-5 %
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-slate-700">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {examResults.map((result) => (
                    <tr
                      key={result.year}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {result.year}
                      </td>
                      <td className="px-4 py-4 text-sm">{result.appeared}</td>
                      <td className="px-4 py-4 text-sm">{result.passed}</td>
                      <td className="px-4 py-4 text-sm">{result.notPassed}</td>
                      <td className="px-4 py-4 text-sm">
                        {result.passRate}%
                      </td>
                      <td className="px-4 py-4 text-sm">{result.gpa5}</td>
                      <td className="px-4 py-4 text-sm">
                        {result.gpa5Rate}%
                      </td>

                      <td className="px-4 py-4 text-right">
                        <Link
                          href={result.resultLink}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          View
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
