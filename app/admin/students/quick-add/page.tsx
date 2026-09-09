import { getAcademicClassConfigs } from "@/lib/db"
import { QuickAddManager } from "@/components/admin/quick-add-manager"
import { PageHeader } from "@/components/digicampus/page-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function QuickAddStudentsPage() {
  const classConfigs = await getAcademicClassConfigs()

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Quick Student Intake"
        description="Quickly enroll single or multiple students into a specific academic placement with essential details."
        action={
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-lg border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2 shadow-2xs"
          >
            <Link href="/admin/students">
              <ArrowLeft className="size-4 text-muted-foreground" />
              <span>Back to Students</span>
            </Link>
          </Button>
        }
      />

      <QuickAddManager classConfigs={classConfigs} />
    </div>
  )
}
