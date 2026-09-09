import { getAcademicClassConfigs, getAcademicSessions } from "@/lib/db"
import { ClassConfigTable } from "@/components/admin/class-config-table"

export const dynamic = "force-dynamic"

export default async function ClassSetupPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string; session?: string }>
}) {
  const params = (await searchParams) ?? {}
  const [configs, sessions] = await Promise.all([
    getAcademicClassConfigs(params.session),
    getAcademicSessions(),
  ])

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Class Setup</h1>
        <p className="text-muted-foreground mt-2">
          Configure academic class combinations (Session + Version + Shift + Class + Section + Group).
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

      <ClassConfigTable data={configs} sessions={sessions} />
    </div>
  )
}
