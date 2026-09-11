import { Metadata } from "next"
import { getAllUsers } from "./actions"
import { UsersManager } from "@/components/admin/users-manager"

export const metadata: Metadata = {
  title: "User Management | DigiCampus Admin Portal",
  description: "View and manage all registered users in the system across staff, teachers, and student roles.",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminUsersPage() {
  const res = await getAllUsers()

  const initialData = res.data || {
    staffUsers: [],
    studentUsers: [],
    isSuperAdmin: false,
    currentUserRole: "admin",
    stats: {
      totalUsers: 0,
      totalStaff: 0,
      totalStudents: 0,
      totalActive: 0,
      totalAdmins: 0,
      totalTeachers: 0,
    },
  }

  return <UsersManager initialData={initialData} />
}
