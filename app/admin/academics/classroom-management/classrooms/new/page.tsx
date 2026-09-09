import Link from "next/link"
import { getAcademicBuildings } from "@/lib/db"
import { createClassroomAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Plus } from "lucide-react"

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

export default async function NewClassroomPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const buildings = await getAcademicBuildings()
  const activeBuildings = buildings.filter((b) => b.is_active)

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Classroom</h1>
        <p className="text-muted-foreground mt-1">
          Add a new classroom to an existing building.
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

      {activeBuildings.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800 space-y-4">
          <div className="flex gap-3 items-start">
            <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">No Active Buildings Configured</h3>
              <p className="text-sm mt-1 text-amber-800">
                You must have at least one active building in the school system before you can register classrooms.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-none">
              <Link href="/admin/academics/classroom-management/buildings/new" className="flex items-center gap-1.5">
                <Plus className="size-4" /> Add Building
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-amber-200 hover:bg-amber-100/50">
              <Link href="/admin/academics/classroom-management?tab=buildings">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form action={createClassroomAction} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="building_id">
              Building <span className="text-red-500">*</span>
            </Label>
            <select
              id="building_id"
              name="building_id"
              required
              defaultValue=""
              className={selectClass}
            >
              <option value="" disabled>Select Building</option>
              {activeBuildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Classroom Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" name="name" placeholder="e.g. Room 101, Lab A, Seminar Room" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">
              Floor <span className="text-red-500">*</span>
            </Label>
            <select
              id="floor"
              name="floor"
              required
              defaultValue=""
              className={selectClass}
            >
              <option value="" disabled>Select Floor</option>
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
              defaultValue="40"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="is_active" name="is_active" value="true" defaultChecked />
            <Label htmlFor="is_active">Active Classroom</Label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              Create Classroom
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/academics/classroom-management?tab=classrooms">Cancel</Link>
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
