import {
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

export default async function NewClassConfigPage() {
  const [sessions, versions, shifts, classes, sections, groups, teachersData, classrooms] =
    await Promise.all([
      getAcademicSessions(),
      getAcademicVersions(),
      getAcademicShifts(),
      getClasses(),
      getSections(),
      getGroups(),
      getAdminTeachers(),
      getAcademicClassrooms(),
    ])

  const teachers = teachersData.map((t) => ({
    id: t.id,
    name: t.full_name_en || "Unnamed Teacher",
  }))

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="New Class Configuration"
        description="Define a unique academic class combination (Session + Version + Shift + Class + Section + Group)."
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
      />
    </div>
  )
}
