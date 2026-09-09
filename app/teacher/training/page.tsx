import { Sparkles, Trophy } from "lucide-react"

import { getAuthSession } from "@/lib/auth"
import { getTeacherTraining } from "@/lib/db"
import { SubmitButton } from "@/components/forms/submit-button"
import { addTeacherTrainingAction } from "@/app/teacher/actions"

type TrainingPageProps = {
  searchParams?: Promise<{ status?: string; message?: string }>
}

export default async function TrainingPage({ searchParams }: TrainingPageProps) {
  const session = await getAuthSession()
  const params = (await searchParams) ?? {}
  const list = session?.user?.id ? await getTeacherTraining(session.user.id) : []

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Teacher Records"
        title="Training Information"
        description="Keep professional training, workshops, and development programs organized."
      />

      <StatusMessage status={params.status} message={params.message} />

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <form action={addTeacherTrainingAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Add training</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Capture training name, institute, year, and duration.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="Training Name">
              <input name="training_name" placeholder="Training name" className={inputClass} required />
            </Field>
            <Field label="Training Institute">
              <input name="training_institute" placeholder="Training institute" className={inputClass} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Year">
                <input name="year" placeholder="2024" className={inputClass} required />
              </Field>
              <Field label="Duration">
                <input name="duration" placeholder="5 days" className={inputClass} />
              </Field>
            </div>
            <Field label="Subject">
              <input name="subject" placeholder="Subject or focus area" className={inputClass} />
            </Field>
          </div>

          <SubmitButton idleLabel="Add Training" pendingLabel="Adding..." className={buttonClass} />
        </form>

        <RecordPanel title="Training History" count={list.length} icon={<Trophy className="size-5" />}>
          {list.length === 0 ? (
            <EmptyState message="No training records found." />
          ) : (
            <div className="grid gap-3">
              {list.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-950 dark:text-white">{item.training_name || "Training"}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.training_institute || "Institute"}</p>
                    </div>
                    <span className="w-fit rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                      {item.year || "Year not set"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {item.subject || "General"} - {item.duration || "Duration not set"}
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
