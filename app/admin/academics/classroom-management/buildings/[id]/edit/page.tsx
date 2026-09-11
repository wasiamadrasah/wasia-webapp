import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAcademicBuildingById } from "@/lib/db"
import { updateBuildingAction } from "@/app/admin/academics/actions"
import { PageHeader } from "@/components/digicampus/page-header"
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
    <div className="w-full max-w-2xl space-y-6">
      <PageHeader
        title="Edit Building"
        description={`Update details for "${building.name}".`}
        action={
          <Button asChild variant="outline" className="h-10 border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
            <Link href="/admin/academics/classroom-management?tab=buildings">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Back to Buildings</span>
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
            <Label htmlFor="name" className="text-sm font-bold text-foreground">
              Building Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={building.name}
              required
              className="h-10 border-input bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-bold text-foreground">
              Description / Location Note
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={building.description ?? ""}
              placeholder="Describe physical location or general usage..."
              rows={3}
              className="border-input bg-background text-sm"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3.5 mt-2">
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-sm font-semibold text-foreground cursor-pointer">
                Active Building
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow classrooms to be created and used under this building.
              </p>
            </div>
            <Switch
              id="is_active"
              name="is_active"
              value="true"
              defaultChecked={building.is_active}
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
            <Link href="/admin/academics/classroom-management?tab=buildings">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
