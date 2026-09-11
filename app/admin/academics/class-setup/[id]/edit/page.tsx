import { notFound } from "next/navigation"
import {
  getAcademicClassConfigById,
  getAcademicSessions,
  getAcademicVersions,
  getAcademicShifts,
  getClasses,
  getSections,
  getGroups,
  getAdminTeachers,
  getAcademicClassrooms,
} from "@/lib/db"
import { ClassConfigForm } from "@/components/admin/class-config-form"
import { PageHeader } from "@/components/digicampus/page-header"

export default async function EditClassConfigPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [
    config,
    sessions,
    versions,
    shifts,
    classes,
    sections,
    groups,
    teachersData,
    classrooms,
  ] = await Promise.all([
    getAcademicClassConfigById(id),
    getAcademicSessions(),
    getAcademicVersions(),
    getAcademicShifts(),
    getClasses(),
    getSections(),
    getGroups(),
    getAdminTeachers(),
    getAcademicClassrooms(),
  ])

  if (!config) notFound()

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

  return (
    <div className="max-w-3xl space-y-6 pb-10">
      <PageHeader
        title="Edit Class Configuration"
        description={`Update setup parameters and teacher assignment for "${configLabel}".`}
      />

      <ClassConfigForm
        sessions={sessions}
        versions={versions}
        shifts={shifts}
        classes={classes}
        sections={sections}
        groups={groups}
        teachers={teachers}
        classrooms={classrooms}
        configId={id}
        defaultValues={{
          session_id: config.session_id,
          version_id: config.version_id,
          shift_id: config.shift_id,
          class_id: config.class_id,
          section_id: config.section_id,
          group_id: config.group_id,
          class_teacher_id: config.class_teacher_id,
          classroom_id: config.classroom_id,
          capacity: config.capacity,
          is_active: config.is_active,
        }}
      />
    </div>
  )
}
