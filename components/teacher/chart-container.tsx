import React from "react"

interface ChartContainerProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function ChartContainer({
  title,
  subtitle,
  children,
  footer,
}: ChartContainerProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
        <h3 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      {footer ? (
        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
          {footer}
        </div>
      ) : null}
    </section>
  )
}

interface StatisticItemProps {
  label: string
  value: string | number
  percentage?: number
  color?: "blue" | "green" | "purple" | "orange"
}

const colorBars = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  purple: "bg-violet-500",
  orange: "bg-amber-500",
}

export function StatisticItem({
  label,
  value,
  percentage = 0,
  color = "blue",
}: StatisticItemProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
        <p className="text-sm font-semibold text-slate-950 dark:text-white">{value}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${colorBars[color]} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
