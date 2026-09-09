import { getAcademicVersions } from "@/lib/db"
import { AcademicSimpleTable, type ExtraColumnSpec } from "@/components/admin/academic-simple-table"
import {
  toggleVersionActiveAction,
  deleteVersionAction,
} from "@/app/admin/academics/actions"

export default async function VersionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const versions = await getAcademicVersions()

  const extraColumns: ExtraColumnSpec[] = [
    {
      header: "Code",
      key: "code",
      renderType: "badge",
    },
  ]

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Versions</h1>
        <p className="text-muted-foreground mt-2">
          Manage academic versions (e.g. Bangla Version, English Version).
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

      <AcademicSimpleTable
        data={versions}
        basePath="/admin/academics/versions"
        addLabel="Add Version"
        filterPlaceholder="Filter by name..."
        extraColumns={extraColumns}
        toggleAction={toggleVersionActiveAction}
        deleteAction={deleteVersionAction}
        deleteWarning="This will permanently delete this version. It will fail if any class configuration references it."
      />
    </div>
  )
}
