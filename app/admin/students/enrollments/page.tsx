import { getStudentEnrollments, getAcademicClassConfigs } from "@/lib/db"
import { PromotionsManager } from "@/components/admin/promotions-manager"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function StudentEnrollmentsPage() {
  const [enrollments, classConfigs] = await Promise.all([
    getStudentEnrollments(),
    getAcademicClassConfigs(),
  ])

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="ghost" className="size-8">
          <Link href="/admin/students">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Enrollment History</h1>
          <p className="text-muted-foreground mt-1">
            Track and promote student academic enrollments.
          </p>
        </div>
      </div>

      <PromotionsManager enrollments={enrollments} classConfigs={classConfigs} />
    </div>
  )
}
