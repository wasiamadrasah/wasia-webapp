import { PageHeader } from "@/components/digicampus/page-header"
import { getIDGenerationSettings } from "@/lib/id-generation-store"
import { IDGenerationForm } from "@/components/admin/id-generation-form"

export const dynamic = "force-dynamic"

export default async function IDGenerationSettingsPage() {
  const settings = await getIDGenerationSettings()

  return (
    <div className="w-full space-y-6 pb-12">
      <PageHeader
        title="ID Generation Settings"
        description="Configure automated identifier formats, prefixes, digit lengths, and sequences for Staff and Students."
      />

      <IDGenerationForm initialSettings={settings} />
    </div>
  )
}
