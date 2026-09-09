import { notFound } from "next/navigation"
import Link from "next/link"
import { getAcademicShifts } from "@/lib/db"
import { updateShiftAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default async function EditShiftPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const shifts = await getAcademicShifts()
  const shift = shifts.find((s) => s.id === id)

  if (!shift) notFound()

  const action = updateShiftAction.bind(null, id)

  // Convert "HH:MM:SS" (Postgres time) to "HH:MM" (HTML input time expects HH:MM)
  const formatTimeForInput = (timeStr: string | null) => {
    if (!timeStr) return ""
    return timeStr.substring(0, 5) // slices "HH:MM" out of "HH:MM:SS" or "HH:MM"
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Shift</h1>
        <p className="text-muted-foreground mt-1">{shift.name}</p>
      </div>

      <form action={action} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Shift Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={shift.name} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              name="start_time"
              type="time"
              defaultValue={formatTimeForInput(shift.start_time)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              name="end_time"
              type="time"
              defaultValue={formatTimeForInput(shift.end_time)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={shift.is_active}
          />
          <Label htmlFor="is_active">Active Shift</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Save Changes
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/shifts">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
