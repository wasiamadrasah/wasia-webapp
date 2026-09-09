import { ReactNode } from "react"

export interface ActivityItem {
  section: string
  count: number
  status: "active" | "inactive" | "pending" | "completed"
  lastUpdated?: string
}

interface ActivityTableProps {
  items: ActivityItem[]
  title?: string
  icon?: ReactNode
}

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  inactive: "bg-muted/50 text-muted-foreground dark:bg-slate-800 dark:text-slate-300",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  completed: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
}

const statusLabels = {
  active: "Active",
  inactive: "Not started",
  pending: "Pending",
  completed: "Completed",
}

export function ActivityTable({ items, title = "Activity Summary", icon }: ActivityTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-border px-4 py-3 dark:border-slate-800 sm:px-5">
        <div className="flex items-center gap-2">
          {icon ? <div className="text-muted-foreground dark:text-muted-foreground">{icon}</div> : null}
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((item, idx) => (
          <div
            key={`${item.section}-${idx}`}
            className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-5"
          >
            <div>
              <p className="font-medium text-slate-950 dark:text-white">{item.section}</p>
              {item.lastUpdated ? (
                <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">{item.lastUpdated}</p>
              ) : null}
            </div>
            <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-right">
              {item.count}
            </p>
            <span className={`w-fit rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
              {statusLabels[item.status]}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
