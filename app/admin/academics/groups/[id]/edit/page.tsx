import { notFound } from "next/navigation"
import Link from "next/link"
import { getGroups } from "@/lib/db"
import { updateGroupAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const groups = await getGroups()
  const group = groups.find((g) => g.id === id)

  if (!group) notFound()

  const action = updateGroupAction.bind(null, id)

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Group / Department</h1>
        <p className="text-muted-foreground mt-1">{group.name}</p>
      </div>

      <form action={action} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Group Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={group.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_name">Short Name / Code (Optional)</Label>
          <Input id="short_name" name="short_name" defaultValue={group.short_name ?? ""} />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={group.is_active}
          />
          <Label htmlFor="is_active">Active Group</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Save Changes
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/groups">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
