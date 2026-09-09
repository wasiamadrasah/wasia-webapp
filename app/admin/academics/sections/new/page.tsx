import Link from "next/link"
import { createSectionAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NewSectionPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Section</h1>
        <p className="text-muted-foreground mt-1">
          Create a new classroom section.
        </p>
      </div>

      <form action={createSectionAction} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Section Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" placeholder="e.g. Section A" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (Optional)</Label>
            <Input id="capacity" name="capacity" type="number" min="1" placeholder="e.g. 40" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room_no">Room No. (Optional)</Label>
            <Input id="room_no" name="room_no" placeholder="e.g. 302" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="is_active" name="is_active" value="true" defaultChecked />
          <Label htmlFor="is_active">Active Section</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Create Section
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/sections">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
