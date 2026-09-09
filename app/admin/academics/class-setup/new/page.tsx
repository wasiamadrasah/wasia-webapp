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
    name: t.full_name_en || "Unnamed",
  }))

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Class Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Define a unique academic class combination.
        </p>
      </div>
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
