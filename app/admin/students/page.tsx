import { 
  getAcademicSessions, 
  getClasses, 
  getAcademicClassConfigs, 
  getStudentEnrollments,
  getGroups
} from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { StudentQueryManager } from "@/components/admin/student-query-manager"

interface StudentDirectoryPageProps {
  searchParams?: Promise<{
    session_id?: string
    class_id?: string
    group_id?: string
    section_id?: string
    category?: string
    admission_type?: string
    search?: string
  }>
}

export default async function StudentDirectoryPage({ searchParams }: StudentDirectoryPageProps) {
  const params = (await searchParams) ?? {}

  const hasQuery = !!(
    params.session_id ||
    params.class_id ||
    params.group_id ||
    params.section_id ||
    params.category ||
    params.admission_type ||
    params.search
  )

  // Always fetch dropdown options + institute settings in parallel
  const [sessions, classes, classConfigs, instituteSettings, groups] = await Promise.all([
    getAcademicSessions(),
    getClasses(),
    getAcademicClassConfigs(),
    getInstituteSettings(),
    getGroups()
  ])

  let enrollments: any[] = []

  if (hasQuery) {
    // Fetch all enrollments — each record includes config_session_id, config_class_id etc.
    const rawEnrollments = await getStudentEnrollments()

    enrollments = rawEnrollments.filter((e) => {
      // Direct ID comparisons using the embedded config IDs
      if (params.session_id && e.config_session_id !== params.session_id) return false
      if (params.class_id   && e.config_class_id   !== params.class_id)   return false
      if (params.group_id   && e.config_group_id   !== params.group_id)   return false
      if (params.section_id && e.config_section_id !== params.section_id) return false
      if (params.category   && e.student_category  !== params.category)   return false
      if (params.admission_type && e.admission_type !== params.admission_type) return false
      if (params.search) {
        const q = params.search.toLowerCase()
        const match =
          e.student_uid?.toLowerCase().includes(q) ||
          e.student_name_en?.toLowerCase().includes(q) ||
          e.student_name_bn?.toLowerCase().includes(q) ||
          e.student_mobile?.includes(q)
        if (!match) return false
      }
      return true
    })
  }

  // School info from institute settings
  const schoolInfo = {
    name:    instituteSettings.primary.instituteName,
    address: instituteSettings.contact.address || "",
    logoUrl: instituteSettings.primary.logo || "/images/system/icon.png",
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Manager</h1>
        <p className="text-muted-foreground mt-2">
          Perform query combinations to filter, print, and export academic enrollments.
        </p>
      </div>

      <StudentQueryManager
        sessions={sessions}
        classes={classes}
        classConfigs={classConfigs}
        groups={groups}
        enrollments={enrollments}
        schoolInfo={schoolInfo}
      />
    </div>
  )
}
