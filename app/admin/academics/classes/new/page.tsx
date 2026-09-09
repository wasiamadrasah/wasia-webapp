import Link from "next/link"
import { createClassAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NewClassPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Class</h1>
        <p className="text-muted-foreground mt-1">
          Create a new class or grade level.
        </p>
      </div>

      <form action={createClassAction} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Class Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" placeholder="e.g. Class 9" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numeric_value">Numeric Grade Value</Label>
            <Input id="numeric_value" name="numeric_value" type="number" min="0" placeholder="e.g. 9" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input id="display_order" name="display_order" type="number" min="0" defaultValue="0" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="is_active" name="is_active" value="true" defaultChecked />
          <Label htmlFor="is_active">Active Class</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Create Class
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/classes">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
