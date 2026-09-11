import { getSubjects } from "@/lib/db"
import { SubjectsTable } from "@/components/admin/subjects-table"
import { PageHeader } from "@/components/digicampus/page-header"

export const dynamic = "force-dynamic"
export const revalidate = 0

type SubjectsPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

export default async function SubjectsPage() {
  const subjects = await getSubjects()

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Subjects"
        description="Manage the master subject catalogue."
      />

      <SubjectsTable data={subjects} />
    </div>
  )
}
