import { getGroups } from "@/lib/db"
import { AcademicSimpleTable, type ExtraColumnSpec } from "@/components/admin/academic-simple-table"
import {
  toggleGroupActiveAction,
  deleteGroupAction,
} from "@/app/admin/academics/actions"

export default async function GroupsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const groups = await getGroups()

  const extraColumns: ExtraColumnSpec[] = [
    {
      header: "Short Name",
      key: "short_name",
      renderType: "mono",
    },
  ]

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Department / Groups</h1>
        <p className="text-muted-foreground mt-2">
          Manage academic departments/groups (e.g. Science, Commerce, Humanities).
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
        data={groups}
        basePath="/admin/academics/groups"
        addLabel="Add Group"
        filterPlaceholder="Filter groups by name..."
        extraColumns={extraColumns}
        toggleAction={toggleGroupActiveAction}
        deleteAction={deleteGroupAction}
        deleteWarning="This will permanently delete this group. It will fail if any class configuration references it."
      />
    </div>
  )
}
