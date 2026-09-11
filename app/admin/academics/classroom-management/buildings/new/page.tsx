import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createBuildingAction } from "@/app/admin/academics/actions"
import { PageHeader } from "@/components/digicampus/page-header"
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
    <div className="w-full max-w-2xl space-y-6">
      <PageHeader
        title="Add Building"
        description="Register a new academic building or campus facility."
        action={
          <Button asChild variant="outline" className="h-10 border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
            <Link href="/admin/academics/classroom-management?tab=buildings">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Back to Buildings</span>
            </Link>
          </Button>
        }
      />

      {params.status === "error" && params.message ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 px-4 py-3 text-sm text-rose-800 dark:text-rose-300 font-medium">
          {params.message}
        </div>
      ) : null}

      <form action={createBuildingAction} className="space-y-6 rounded-xl border border-border p-6 bg-card shadow-2xs">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-bold text-foreground">
              Building Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Science Block, Main Academic Building"
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
              placeholder="Describe the building, its general usage, or physical location on campus..."
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
                Allow classrooms to be created under this building.
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
