import * as React from "react"
import { SystemSettingsManager } from "@/components/admin/system-settings-manager"

export const dynamic = "force-dynamic"

export default function SystemSettingsPage() {
  return (
    <div className="w-full pb-12">
      <SystemSettingsManager />
    </div>
  )
}
