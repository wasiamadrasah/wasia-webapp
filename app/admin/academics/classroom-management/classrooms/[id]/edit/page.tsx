import { notFound } from "next/navigation"
import Link from "next/link"
import { getAcademicClassroomById, getAcademicBuildings } from "@/lib/db"
import { updateClassroomAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

const floorOptions = [
  { value: 0, label: "Ground Floor" },
  { value: 1, label: "1st Floor" },
  { value: 2, label: "2nd Floor" },
  { value: 3, label: "3rd Floor" },
  { value: 4, label: "4th Floor" },
  { value: 5, label: "5th Floor" },
  { value: 6, label: "6th Floor" },
  { value: 7, label: "7th Floor" },
  { value: 8, label: "8th Floor" },
  { value: 9, label: "9th Floor" },
  { value: 10, label: "10th Floor" },
  { value: 11, label: "11th Floor" },
  { value: 12, label: "12th Floor" },
  { value: 13, label: "13th Floor" },
  { value: 14, label: "14th Floor" },
  { value: 15, label: "15th Floor" },
]

export default async function EditClassroomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const { id } = await params
  const classroom = await getAcademicClassroomById(id)
  const resolvedSearchParams = (await searchParams) ?? {}

  if (!classroom) {
    notFound()
  }

  const buildings = await getAcademicBuildings()
  // Include either active buildings OR the classroom's currently assigned building (even if it's inactive)
  const availableBuildings = buildings.filter(
    (b) => b.is_active || b.id === classroom.building_id
  )

  const action = updateClassroomAction.bind(null, id)

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Classroom</h1>
        <p className="text-muted-foreground mt-1">
          {classroom.building_name} — {classroom.name}
        </p>
      </div>

      {resolvedSearchParams.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            resolvedSearchParams.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {resolvedSearchParams.message}
        </div>
      ) : null}

      <form action={action} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="building_id">
            Building <span className="text-red-500">*</span>
          </Label>
          <select
            id="building_id"
            name="building_id"
            required
            defaultValue={classroom.building_id}
            className={selectClass}
          >
            {availableBuildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} {!b.is_active ? "(Inactive)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            Classroom Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={classroom.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor">
            Floor <span className="text-red-500">*</span>
          </Label>
          <select
            id="floor"
            name="floor"
            required
            defaultValue={classroom.floor}
            className={selectClass}
          >
            {floorOptions.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">
            Capacity (Number of Students) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            defaultValue={classroom.capacity}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={classroom.is_active}
          />
          <Label htmlFor="is_active">Active Classroom</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Save Changes
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/classroom-management?tab=classrooms">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
