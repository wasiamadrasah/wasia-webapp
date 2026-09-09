import { getAdmissionSettings, getClasses } from "@/lib/db"
import { AdmissionSettingsForm } from "@/components/admin/admission-settings-form"

export default async function OnlineAdmissionSettingPage() {
  const [settings, classes] = await Promise.all([
    getAdmissionSettings(),
    getClasses(),
  ])

  return (
    <div className="w-full space-y-6 pb-12">
      <AdmissionSettingsForm
        settings={settings}
        classes={classes}
      />
    </div>
  )
}
