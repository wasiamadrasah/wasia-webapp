import Link from "next/link"
import { createSessionAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NewSessionPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Session</h1>
        <p className="text-muted-foreground mt-1">Create a new academic session (year).</p>
      </div>

      <form action={createSessionAction} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Session Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" placeholder="e.g. 2026" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" name="start_date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" name="end_date" type="date" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="is_active" name="is_active" value="true" defaultChecked />
          <Label htmlFor="is_active">Set as Active Session</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit">Create Session</Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/sessions">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
