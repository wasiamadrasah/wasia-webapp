import { getAcademicShifts } from "@/lib/db"
import { AcademicSimpleTable, type ExtraColumnSpec } from "@/components/admin/academic-simple-table"
import {
  toggleShiftActiveAction,
  deleteShiftAction,
} from "@/app/admin/academics/actions"

export default async function ShiftsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const shifts = await getAcademicShifts()

  const extraColumns: ExtraColumnSpec[] = [
    {
      header: "Start Time",
      key: "start_time",
      renderType: "mono",
    },
    {
      header: "End Time",
      key: "end_time",
      renderType: "mono",
    },
  ]

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Shifts</h1>
        <p className="text-muted-foreground mt-2">
          Manage school shifts and timings (e.g. Morning Shift, Day Shift).
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
        data={shifts}
        basePath="/admin/academics/shifts"
        addLabel="Add Shift"
        filterPlaceholder="Filter shifts..."
        extraColumns={extraColumns}
        toggleAction={toggleShiftActiveAction}
        deleteAction={deleteShiftAction}
        deleteWarning="This will permanently delete this shift. It will fail if any class configuration references it."
      />
    </div>
  )
}
