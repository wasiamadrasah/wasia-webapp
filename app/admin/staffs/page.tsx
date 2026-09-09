import { StaffDataTable } from "@/components/admin/staff-data-table"
import { getAdminStaffs } from "@/lib/db"
import { PageHeader } from "@/components/digicampus/page-header"

export default async function StaffsPage() {
  const staffs = await getAdminStaffs()

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage non-teaching staff records, employee IDs, contact info, and profile details."
      />

      <StaffDataTable
        data={staffs.map((staff) => ({
          id: staff.id,
          name: staff.full_name_en || "Unnamed staff",
          employeeId: staff.employee_id,
          designation: staff.designation || staff.subject,
          phone: staff.contact_number,
          registeredOn: staff.joining_date,
        }))}
      />
    </div>
  )
}
