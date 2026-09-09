import Link from "next/link"
import { createGroupAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NewGroupPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Group / Department</h1>
        <p className="text-muted-foreground mt-1">
          Create a new academic group (e.g. Science).
        </p>
      </div>

      <form action={createGroupAction} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Group Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" placeholder="e.g. Science Group" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_name">Short Name / Code (Optional)</Label>
          <Input id="short_name" name="short_name" placeholder="e.g. SC" />
          <p className="text-xs text-muted-foreground">
            A short abbreviation (e.g., SC for Science, CO for Commerce, HU for Humanities).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="is_active" name="is_active" value="true" defaultChecked />
          <Label htmlFor="is_active">Active Group</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Create Group
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/groups">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
