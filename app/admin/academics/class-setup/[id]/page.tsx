import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

import {
  getAcademicClassConfigById,
  getAcademicClassConfigs,
  getClassSubjects,
  getSubjectTeachers,
  getSubjects,
  getAdminTeachers,
} from "@/lib/db"
import { ClassSubjectsManager } from "@/components/admin/class-subjects-manager"
import { SubjectTeachersManager } from "@/components/admin/subject-teachers-manager"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, ArrowLeft } from "lucide-react"

export default async function ClassConfigDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ status?: string; message?: string }>
}) {
  const { id } = await params
  const sp = (await searchParams) ?? {}

  const config = await getAcademicClassConfigById(id)
  if (!config) notFound()

  const [classSubjects, subjectTeachers, allSubjects, teachersData, allConfigs] = await Promise.all([
    getClassSubjects(id),
    getSubjectTeachers(id),
    getSubjects({ activeOnly: true }),
    getAdminTeachers(),
    getAcademicClassConfigs(config.session_id),
  ])

  const teachers = teachersData.map((t) => ({
    id: t.id,
    name: t.full_name_en || "Unnamed Teacher",
  }))

  const configLabel = [
    config.session_name,
    config.version_name,
    config.shift_name,
    config.class_name,
    config.section_name,
  ]
    .filter(Boolean)
    .join(" › ")

  const otherConfigs = allConfigs.filter((c) => c.id !== id)

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Back to Class Setup button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground">
          <Link href="/admin/academics/class-setup">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Class Setup
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border p-6 bg-card shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{configLabel}</h1>
          <div className="flex flex-wrap items-center gap-3">
            {config.class_teacher_name && (
              <span className="text-sm text-muted-foreground">
                Class Teacher: <strong className="text-foreground">{config.class_teacher_name}</strong>
              </span>
            )}
            <Badge variant={config.is_active ? "default" : "secondary"}>
              {config.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link href={`/admin/academics/class-setup/${id}/edit`}>
            <Pencil className="mr-2 size-4" /> Edit Configuration
          </Link>
        </Button>
      </div>

      {sp.message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            sp.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {sp.message}
        </div>
      )}

      {/* Subjects Manager */}
      <ClassSubjectsManager
        configId={id}
        assignedSubjects={classSubjects}
        allSubjects={allSubjects}
        otherConfigs={otherConfigs}
        currentConfig={config}
      />

      {/* Subject Teachers Manager */}
      <SubjectTeachersManager
        configId={id}
        assignments={subjectTeachers}
        assignedSubjects={classSubjects}
        teachers={teachers}
      />
    </div>
  )
}
