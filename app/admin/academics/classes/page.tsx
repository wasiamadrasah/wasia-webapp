import { getClasses } from "@/lib/db"
import { ClassesTable } from "@/components/admin/classes-table"

export default async function ClassesPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const classes = await getClasses()

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground mt-2">
          Manage classes/grades (e.g. Class 1, Class 9).
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

      <ClassesTable data={classes} />
    </div>
  )
}
