import { EmployeeDataTable } from "@/components/admin/employee-data-table"
import { getAdminEmployees } from "@/lib/db"
import { PageHeader } from "@/components/digicampus/page-header"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EmployeesPage() {
  const employees = await getAdminEmployees()

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Employees"
        description="Manage all teaching and administrative personnel records, credentials, login permissions, and profile information."
      />

      <EmployeeDataTable
        data={employees.map((emp) => ({
          id: emp.id,
          name: emp.full_name_en || "Unnamed employee",
          nameBn: emp.full_name_bn,
          employeeId: emp.employee_id,
          profilePhoto: emp.profile_photo,
          designation: emp.designation || emp.subject,
          phone: emp.contact_number,
          email: emp.email,
          category: emp.category === "staff" ? "staff" : "teacher",
          registeredOn: emp.joining_date,
          status: emp.status === "inactive" ? "inactive" : "active",
          canLogin: emp.status === "inactive" ? false : emp.can_login !== false,
        }))}
      />
    </div>
  )
}
