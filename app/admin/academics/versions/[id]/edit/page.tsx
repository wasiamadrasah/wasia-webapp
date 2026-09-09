import { notFound } from "next/navigation"
import Link from "next/link"
import { getAcademicVersions } from "@/lib/db"
import { updateVersionAction } from "@/app/admin/academics/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default async function EditVersionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const versions = await getAcademicVersions()
  const version = versions.find((v) => v.id === id)

  if (!version) notFound()

  const action = updateVersionAction.bind(null, id)

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Version</h1>
        <p className="text-muted-foreground mt-1">{version.name}</p>
      </div>

      <form action={action} className="space-y-6 rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">
            Version Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={version.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">
            Version Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            name="code"
            defaultValue={version.code}
            maxLength={10}
            required
            className="uppercase"
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={version.is_active}
          />
          <Label htmlFor="is_active">Active Version</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Save Changes
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/academics/versions">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
