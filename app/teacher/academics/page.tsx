import { BookOpenCheck } from "lucide-react"

import { getAuthSession } from "@/lib/auth"
import { getTeacherAcademics } from "@/lib/db"
import { AcademicAddCard } from "@/components/teacher/academic-add-card"

type AcademicsPageProps = {
  searchParams?: Promise<{ status?: string; message?: string }>
}

export default async function AcademicsPage({ searchParams }: AcademicsPageProps) {
  const session = await getAuthSession()
  const params = (await searchParams) ?? {}
  const list = session?.user?.id ? await getTeacherAcademics(session.user.id) : []

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Teacher Records"
        title="Academic Qualifications"
        description="Add degrees, institutions, passing years, and result details for your teacher profile."
      />

      <StatusMessage status={params.status} message={params.message} />

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <AcademicAddCard />

        <RecordPanel title="Qualifications" count={list.length} icon={<BookOpenCheck className="size-5" />}>
          {list.length === 0 ? (
            <EmptyState message="No academic records found." />
          ) : (
            <div className="grid gap-3">
              {list.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-950 dark:text-white">{item.degree || "Degree"}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.institution || "Institution"}</p>
                    </div>
                    <span className="w-fit rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                      {item.passing_year || "Year not set"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {item.subject || "General"} - {item.result || "Result not set"}
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
