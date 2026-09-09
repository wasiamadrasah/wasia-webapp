import { getSections } from "@/lib/db"
import { AcademicSimpleTable, type ExtraColumnSpec } from "@/components/admin/academic-simple-table"
import {
  toggleSectionActiveAction,
  deleteSectionAction,
} from "@/app/admin/academics/actions"

export default async function SectionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const sections = await getSections()

  const extraColumns: ExtraColumnSpec[] = [
    {
      header: "Capacity",
      key: "capacity",
      renderType: "capacity",
    },
    {
      header: "Room No.",
      key: "room_no",
      renderType: "text",
    },
  ]

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sections</h1>
        <p className="text-muted-foreground mt-2">
          Manage classroom sections (e.g. Section A, Section B).
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
        data={sections}
        basePath="/admin/academics/sections"
        addLabel="Add Section"
        filterPlaceholder="Filter sections by name..."
        extraColumns={extraColumns}
        toggleAction={toggleSectionActiveAction}
        deleteAction={deleteSectionAction}
        deleteWarning="This will permanently delete this section. It will fail if any class configuration references it."
      />
    </div>
  )
}
