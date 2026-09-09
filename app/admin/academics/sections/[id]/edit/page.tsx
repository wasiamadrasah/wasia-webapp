import { notFound } from "next/navigation"
import Link from "next/link"
import { getSections } from "@/lib/db"
import { updateSectionAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sections = await getSections()
  const sec = sections.find((s) => s.id === id)

  if (!sec) notFound()

  const action = updateSectionAction.bind(null, id)

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Section</h1>
        <p className="text-muted-foreground mt-1">{sec.name}</p>
      </div>

      <form action={action} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Section Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={sec.name} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (Optional)</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              defaultValue={sec.capacity ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room_no">Room No. (Optional)</Label>
            <Input id="room_no" name="room_no" defaultValue={sec.room_no ?? ""} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={sec.is_active}
          />
          <Label htmlFor="is_active">Active Section</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Save Changes
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/sections">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
