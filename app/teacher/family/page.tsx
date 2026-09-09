import { UserPlus, Users } from "lucide-react"

import { getAuthSession } from "@/lib/auth"
import { getTeacherFamily } from "@/lib/db"
import { SubmitButton } from "@/components/forms/submit-button"
import { addTeacherFamilyAction } from "@/app/teacher/actions"

type FamilyPageProps = {
  searchParams?: Promise<{ status?: string; message?: string }>
}

export default async function FamilyPage({ searchParams }: FamilyPageProps) {
  const session = await getAuthSession()
  const params = (await searchParams) ?? {}
  const list = session?.user?.id ? await getTeacherFamily(session.user.id) : []

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Teacher Records"
        title="Family Information"
        description="Maintain family contact records used for teacher personnel information."
      />

      <StatusMessage status={params.status} message={params.message} />

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <form action={addTeacherFamilyAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <UserPlus className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Add family member</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Name and relationship are required.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="Name">
              <input name="name" placeholder="Family member name" className={inputClass} required />
            </Field>
            <Field label="Relationship">
              <input name="relationship" placeholder="Spouse, child, parent" className={inputClass} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Age">
                <input name="age" placeholder="Age" className={inputClass} />
              </Field>
              <Field label="Blood Group">
                <input name="blood_group" placeholder="A+, O-" className={inputClass} />
              </Field>
            </div>
          </div>

          <SubmitButton idleLabel="Add Family Member" pendingLabel="Adding..." className={buttonClass} />
        </form>

        <RecordPanel title="Family Members" count={list.length} icon={<Users className="size-5" />}>
          {list.length === 0 ? (
            <EmptyState message="No family records found." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {list.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950 dark:text-white">{item.name || "Unnamed member"}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.relationship || "Relationship not set"}</p>
                    </div>
                    <span className="w-fit rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                      {item.blood_group || "-"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Age: {item.age || "-"}</p>
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
