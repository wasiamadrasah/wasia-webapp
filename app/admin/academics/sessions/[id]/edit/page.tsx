import { notFound } from "next/navigation"
import Link from "next/link"
import { getAcademicSessions } from "@/lib/db"
import { updateSessionAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sessions = await getAcademicSessions()
  const session = sessions.find((s) => s.id === id)
  if (!session) notFound()

  const action = updateSessionAction.bind(null, id)

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Session</h1>
        <p className="text-muted-foreground mt-1">{session.name}</p>
      </div>

      <form action={action} className="space-y-6 rounded-xl border p-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Session Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={session.name} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={session.start_date ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              defaultValue={session.end_date ?? ""}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={session.is_active}
          />
          <Label htmlFor="is_active">Active Session</Label>
        </div>

        <div className="flex gap-3">
          <Button type="submit">Save Changes</Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/sessions">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
