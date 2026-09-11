import { getAcademicClassConfigs, getAcademicSessions } from "@/lib/db"
import { ClassConfigTable } from "@/components/admin/class-config-table"
import { PageHeader } from "@/components/digicampus/page-header"

export const dynamic = "force-dynamic"
export const revalidate = 0

type ClassSetupPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
    session?: string
  }>
}

export default async function ClassSetupPage({ searchParams }: ClassSetupPageProps) {
  const params = (await searchParams) ?? {}
  const [configs, sessions] = await Promise.all([
    getAcademicClassConfigs(params.session),
    getAcademicSessions(),
  ])

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Class Setup"
        description="Configure academic class combinations (Session + Version + Shift + Class + Section + Group)."
      />

      <ClassConfigTable data={configs} sessions={sessions} />
    </div>
  )
}
