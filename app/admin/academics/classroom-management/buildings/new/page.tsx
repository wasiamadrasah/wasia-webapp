import Link from "next/link"
import { createBuildingAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default async function NewBuildingPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Building</h1>
        <p className="text-muted-foreground mt-1">
          Add a new building to the school campus.
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

      <form action={createBuildingAction} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Building Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" placeholder="e.g. Science Block, Main Building" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the building, its general usage, or physical location on campus..."
            rows={4}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="is_active" name="is_active" value="true" defaultChecked />
          <Label htmlFor="is_active">Active Building</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Create Building
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/classroom-management?tab=buildings">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
