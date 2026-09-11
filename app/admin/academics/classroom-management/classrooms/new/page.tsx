import Link from "next/link"
import { ArrowLeft, AlertCircle, Plus } from "lucide-react"
import { getAcademicBuildings } from "@/lib/db"
import { createClassroomAction } from "@/app/admin/academics/actions"
import { FormSelect } from "@/components/admin/form-select"
import { FLOOR_OPTIONS } from "@/components/admin/classrooms-table"
import { PageHeader } from "@/components/digicampus/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default async function NewClassroomPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const params = (await searchParams) ?? {}
  const buildings = await getAcademicBuildings()
  const activeBuildings = buildings.filter((b) => b.is_active)

  const buildingOptions = activeBuildings.map((b) => ({
    value: b.id,
    label: b.name,
  }))

  return (
    <div className="w-full max-w-2xl space-y-6">
      <PageHeader
        title="Add Classroom"
        description="Register a new classroom under an active building."
        action={
          <Button asChild variant="outline" className="h-10 border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
            <Link href="/admin/academics/classroom-management?tab=classrooms">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Back to Rooms</span>
            </Link>
          </Button>
        }
      />

      {params.status === "error" && params.message ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 px-4 py-3 text-sm text-rose-800 dark:text-rose-300 font-medium">
          {params.message}
        </div>
      ) : null}

      {activeBuildings.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800/60 p-6 text-amber-800 dark:text-amber-300 space-y-4">
          <div className="flex gap-3 items-start">
            <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200">No Active Buildings Configured</h3>
              <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                You must have at least one active building in the school system before you can register classrooms.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Link href="/admin/academics/classroom-management/buildings/new" className="flex items-center gap-1.5">
                <Plus className="size-4" /> Add Building
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/academics/classroom-management?tab=buildings">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form action={createClassroomAction} className="space-y-6 rounded-xl border border-border p-6 bg-card shadow-2xs">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="building_id" className="text-sm font-bold text-foreground">
                Building <span className="text-rose-500">*</span>
              </Label>
              <FormSelect
                id="building_id"
                name="building_id"
                placeholder="Select Building"
                options={buildingOptions}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-bold text-foreground">
                Classroom Name / Room Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Room 101, Science Lab, Seminar Room"
                required
                className="h-10 border-input bg-background"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="floor" className="text-sm font-bold text-foreground">
                  Floor <span className="text-rose-500">*</span>
                </Label>
                <FormSelect
                  id="floor"
                  name="floor"
                  defaultValue="0"
                  placeholder="Select Floor"
                  options={FLOOR_OPTIONS}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="capacity" className="text-sm font-bold text-foreground">
                  Student Capacity <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue="40"
                  required
                  className="h-10 border-input bg-background"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3.5 mt-2">
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-sm font-semibold text-foreground cursor-pointer">
                  Active Classroom
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow this classroom to be allocated for class combinations.
                </p>
              </div>
              <Switch id="is_active" name="is_active" value="true" defaultChecked />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5"
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
