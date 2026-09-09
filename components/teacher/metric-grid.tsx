import Link from "next/link"
import { ArrowRight } from "lucide-react"

export interface MetricLink {
  label: string
  value: number
  href: string
  icon: React.ReactNode
  color?: "blue" | "green" | "purple" | "orange" | "red"
}

interface MetricGridProps {
  metrics: MetricLink[]
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  purple: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  orange: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  red: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Link
          key={metric.label}
          href={metric.href}
          className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {metric.value}
              </p>
            </div>
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${colorClasses[metric.color || "blue"]}`}>
              {metric.icon}
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-slate-950 dark:text-slate-400 dark:group-hover:text-white">
            Open section
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  )
}
