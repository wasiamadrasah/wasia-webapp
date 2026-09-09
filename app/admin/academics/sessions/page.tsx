import { getAcademicSessions } from "@/lib/db"
import { AcademicSessionsTable } from "@/components/admin/academic-sessions-table"

export default async function SessionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const sessions = await getAcademicSessions()

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Sessions</h1>
        <p className="text-muted-foreground mt-2">
          Manage academic years and activate the current session.
        </p>
      </div>

      {params.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            params.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {params.message}
        </div>
      ) : null}

      <AcademicSessionsTable data={sessions} />
    </div>
  )
}
