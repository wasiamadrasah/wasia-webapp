import { getSubjects } from "@/lib/db"
import { SubjectsTable } from "@/components/admin/subjects-table"

export const dynamic = "force-dynamic"

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const subjects = await getSubjects()

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <p className="text-muted-foreground mt-2">Manage the master subject catalogue.</p>
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

      <SubjectsTable data={subjects} />
    </div>
  )
}
