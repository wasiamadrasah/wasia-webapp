import { getAcademicClassConfigs, getSubjects, getGroups } from "@/lib/db"
import { AdmissionWizard } from "@/components/admin/admission-wizard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"

export default async function AdmitStudentPage() {
  const [classConfigs, subjects, groups] = await Promise.all([
    getAcademicClassConfigs(),
    getSubjects(),
    getGroups(),
  ])

  // Filter active subjects to pass to wizard
  const activeSubjects = subjects
    .filter((s) => s.is_active)
    .map((s) => ({
      id: s.id,
      name: s.name,
      is_active: s.is_active,
    }))

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="ghost" className="size-8">
          <Link href="/admin/students">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Full Student Admission</h1>
          <p className="text-muted-foreground mt-1">
            Complete the detailed admission forms to generate permanent records and academic placements.
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        <AdmissionWizard classConfigs={classConfigs} allSubjects={activeSubjects} groups={groups} />
      </Suspense>
    </div>
  )
}
