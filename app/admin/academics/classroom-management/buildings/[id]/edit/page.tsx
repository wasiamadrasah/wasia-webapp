import { notFound } from "next/navigation"
import Link from "next/link"
import { getAcademicBuildingById } from "@/lib/db"
import { updateBuildingAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default async function EditBuildingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const { id } = await params
  const building = await getAcademicBuildingById(id)
  const resolvedSearchParams = (await searchParams) ?? {}

  if (!building) {
    notFound()
  }

  const action = updateBuildingAction.bind(null, id)

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Building</h1>
        <p className="text-muted-foreground mt-1">{building.name}</p>
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
          <Label htmlFor="name">
            Building Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={building.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={building.description ?? ""}
            placeholder="Describe the building, its general usage, or physical location on campus..."
            rows={4}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={building.is_active}
          />
          <Label htmlFor="is_active">Active Building</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Save Changes
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/classroom-management?tab=buildings">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
