import { CheckCircle2, User } from "lucide-react"

interface WelcomeSectionProps {
  teacherName: string
  designation?: string
  subject?: string
  profileCompletion: number
}

export function WelcomeSection({
  teacherName,
  designation,
  subject,
  profileCompletion,
}: WelcomeSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_360px]">
        <div className="flex gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <User className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Today
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Welcome, {teacherName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Review your records, keep your profile current, and move through each teacher section from one workspace.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {designation ? <InfoPill label={designation} /> : null}
              {subject ? <InfoPill label={subject} /> : null}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">Profile Completion</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Based on key profile fields</p>
            </div>
            <span className="text-2xl font-semibold text-slate-950 dark:text-white">{profileCompletion}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <CheckCircle2 className="size-3.5 text-emerald-500" />
      {label}
    </span>
  )
}
