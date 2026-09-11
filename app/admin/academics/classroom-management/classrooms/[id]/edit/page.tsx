import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAcademicClassroomById, getAcademicBuildings } from "@/lib/db"
import { updateClassroomAction } from "@/app/admin/academics/actions"
import { FormSelect } from "@/components/admin/form-select"
import { FLOOR_OPTIONS } from "@/components/admin/classrooms-table"
import { PageHeader } from "@/components/digicampus/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default async function EditClassroomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const { id } = await params
  const classroom = await getAcademicClassroomById(id)
  const resolvedSearchParams = (await searchParams) ?? {}

  if (!classroom) {
    notFound()
  }

  const buildings = await getAcademicBuildings()
  const availableBuildings = buildings.filter(
    (b) => b.is_active || b.id === classroom.building_id
  )

  const buildingOptions = availableBuildings.map((b) => ({
    value: b.id,
    label: `${b.name}${!b.is_active ? " (Inactive)" : ""}`,
  }))

  const action = updateClassroomAction.bind(null, id)

  return (
    <div className="w-full max-w-2xl space-y-6">
      <PageHeader
        title="Edit Classroom"
        description={`Update classroom details for "${classroom.name}".`}
        action={
          <Button asChild variant="outline" className="h-10 border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
            <Link href="/admin/academics/classroom-management?tab=classrooms">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Back to Rooms</span>
            </Link>
          </Button>
        }
      />

      {resolvedSearchParams.status === "error" && resolvedSearchParams.message ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 px-4 py-3 text-sm text-rose-800 dark:text-rose-300 font-medium">
          {resolvedSearchParams.message}
        </div>
      ) : null}

      <form action={action} className="space-y-6 rounded-xl border border-border p-6 bg-card shadow-2xs">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="building_id" className="text-sm font-bold text-foreground">
              Building <span className="text-rose-500">*</span>
            </Label>
            <FormSelect
              id="building_id"
              name="building_id"
              defaultValue={classroom.building_id}
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
              defaultValue={classroom.name}
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
                defaultValue={classroom.floor.toString()}
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
                defaultValue={classroom.capacity}
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
            <Switch
              id="is_active"
              name="is_active"
              value="true"
              defaultChecked={classroom.is_active}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5"
          >
            Save Changes
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/classroom-management?tab=classrooms">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
