import { getAcademicClassConfigs } from "@/lib/db"
import { getBulkImportLogs } from "@/app/admin/students/actions"
import { BulkImportManager } from "@/components/admin/bulk-import-manager"
import { BulkImportHistory } from "@/components/admin/bulk-import-history"
import { PageHeader } from "@/components/digicampus/page-header"

export const dynamic = "force-dynamic"

export default async function BulkImportStudentsPage() {
  const [classConfigs, logs] = await Promise.all([
    getAcademicClassConfigs(),
    getBulkImportLogs(),
  ])

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Bulk Student Admission"
        description="Import and enroll multiple students via a pre-formatted CSV template."
      />

      <BulkImportManager classConfigs={classConfigs} />

      <BulkImportHistory logs={logs} classConfigs={classConfigs} />
    </div>
  )
}
