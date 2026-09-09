import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  color?: "blue" | "green" | "purple" | "orange" | "red"
  trend?: {
    value: number
    isPositive: boolean
  }
}

const colorClasses = {
  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
}

const iconBgClasses = {
  blue: "bg-blue-100 dark:bg-blue-900/40",
  green: "bg-green-100 dark:bg-green-900/40",
  purple: "bg-purple-100 dark:bg-purple-900/40",
  orange: "bg-orange-100 dark:bg-orange-900/40",
  red: "bg-red-100 dark:bg-red-900/40",
}

export function StatsCard({ 
  title, 
  value, 
  subtitle,
  icon,
  color = "blue",
  trend 
}: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              <span className={`text-xs font-semibold ${trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">from last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`rounded-lg p-3 ${iconBgClasses[color]}`}>
            <div className={colorClasses[color]}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
