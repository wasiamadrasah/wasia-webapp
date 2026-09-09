import { BriefcaseBusiness, Building2 } from "lucide-react"

import { getAuthSession } from "@/lib/auth"
import { getTeacherExperience } from "@/lib/db"
import { SubmitButton } from "@/components/forms/submit-button"
import { addTeacherExperienceAction } from "@/app/teacher/actions"

type ExperiencePageProps = {
  searchParams?: Promise<{ status?: string; message?: string }>
}

export default async function ExperiencePage({ searchParams }: ExperiencePageProps) {
  const session = await getAuthSession()
  const params = (await searchParams) ?? {}
  const list = session?.user?.id ? await getTeacherExperience(session.user.id) : []

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Teacher Records"
        title="Professional Experience"
        description="Record your teaching roles, institutes, employment type, and service period."
      />

      <StatusMessage status={params.status} message={params.message} />

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <form action={addTeacherExperienceAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <BriefcaseBusiness className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Add experience</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Track current and previous teaching roles.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="Institute Name">
              <input name="institute_name" placeholder="Institute name" className={inputClass} required />
            </Field>
            <Field label="Designation">
              <input name="designation" placeholder="Designation" className={inputClass} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Subject">
                <input name="subject" placeholder="Subject" className={inputClass} />
              </Field>
              <Field label="Employment Type">
                <input name="employment_type" placeholder="Full-time, part-time" className={inputClass} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date">
                <input name="start_date" placeholder="dd/mm/yyyy" className={inputClass} required />
              </Field>
              <Field label="End Date">
                <input name="end_date" placeholder="dd/mm/yyyy" className={inputClass} />
              </Field>
            </div>
          </div>

          <SubmitButton idleLabel="Add Experience" pendingLabel="Adding..." className={buttonClass} />
        </form>

        <RecordPanel title="Experience History" count={list.length} icon={<Building2 className="size-5" />}>
          {list.length === 0 ? (
            <EmptyState message="No experience records found." />
          ) : (
            <div className="grid gap-3">
              {list.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-950 dark:text-white">{item.designation || "Role"}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.institute_name || "Institute"}</p>
                    </div>
                    <span className="w-fit rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                      {item.employment_type || "Type not set"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {item.subject || "General"} - {formatDate(item.start_date) || "Start date missing"} to {formatDate(item.end_date) || "Present"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </RecordPanel>
      </div>
    </section>
  )
}

const inputClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-slate-800"

const buttonClass =
  "mt-5 h-10 w-full rounded-md bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  )
}

function StatusMessage({ status, message }: { status?: string; message?: string }) {
  if (!message) return null
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200" : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"}`}>
      {message}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      {children}
    </label>
  )
}

function RecordPanel({ title, count, icon, children }: { title: string; count: number; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-slate-400">{icon}</span>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{count} total</span>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      {message}
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return ""
  const [year, month, day] = value.split("-")

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}
