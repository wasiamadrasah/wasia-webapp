import Link from "next/link"
import { createVersionAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NewVersionPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Version</h1>
        <p className="text-muted-foreground mt-1">
          Create a new academic version (e.g. Bangla Version).
        </p>
      </div>

      <form action={createVersionAction} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Version Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" placeholder="e.g. Bangla Version" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">
            Version Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            name="code"
            placeholder="e.g. BV"
            maxLength={10}
            required
            className="uppercase"
          />
          <p className="text-xs text-muted-foreground">
            A short identifier code (e.g., BV for Bangla Version, EV for English Version).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="is_active" name="is_active" value="true" defaultChecked />
          <Label htmlFor="is_active">Active Version</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Create Version
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/versions">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
