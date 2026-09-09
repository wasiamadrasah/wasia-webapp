import type { Metadata } from "next"
import { AdmissionNavbar } from "@/components/admission/admission-navbar"
import { AdmissionFooter } from "@/components/admission/admission-footer"
import { AdmissionScrollbarOverride } from "@/components/admission/admission-scrollbar-override"
import { AdmissionMaterialProvider } from "@/components/admission/admission-theme-provider"

export const metadata: Metadata = {
  title: "Admission Portal | Purba Bakalia City Corporation High School",
  description: "Online admission information, prospectus, guidelines, notices and contact for Purba Bakalia City Corporation High School.",
}

export default function AdmissionPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdmissionMaterialProvider>
      <div className="admission-portal" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AdmissionScrollbarOverride />
        <AdmissionNavbar />
        <div style={{ flex: 1 }}>{children}</div>
        <AdmissionFooter />
      </div>
    </AdmissionMaterialProvider>
  )
}

