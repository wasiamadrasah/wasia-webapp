import { PageHeader } from "@/components/digicampus/page-header"
import { InstituteSettingsForm } from "@/components/admin/institute-settings-form"
import { getInstituteSettings } from "@/lib/institute-settings-store"

export default async function InstituteConfigurationPage() {
  const settings = await getInstituteSettings()

  return (
    <div className="w-full max-w-none space-y-6">
      <PageHeader
        title="Website Configuration"
        description="Manage your institute branding, site metadata, domain details, social links, and contact information."
      />
      <InstituteSettingsForm settings={settings} />
    </div>
  )
}