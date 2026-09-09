import { TeacherDataTable } from "@/components/admin/teacher-data-table"
import { getAdminTeachers } from "@/lib/db"
import { PageHeader } from "@/components/digicampus/page-header"

export default async function TeachersPage() {
  const teachers = await getAdminTeachers()

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher records, staff credentials, login permissions, and profile information."
      />

      <TeacherDataTable
        data={teachers.map((teacher) => ({
          id: teacher.id,
          name: teacher.full_name_en || "Unnamed teacher",
          employeeId: teacher.employee_id,
          profilePhoto: teacher.profile_photo,
          designation: teacher.designation || teacher.subject,
          phone: teacher.contact_number,
          registeredOn: teacher.joining_date,
          status: teacher.status === "inactive" ? "inactive" : "active",
          canLogin: teacher.status === "inactive" ? false : teacher.can_login !== false,
        }))}
      />
    </div>
  )
}
