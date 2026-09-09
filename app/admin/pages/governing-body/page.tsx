import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/auth"
import { getGoverningBodyMembersForAdmin } from "@/lib/db"
import { PageHeader } from "@/components/digicampus/page-header"
import { GoverningBodyMembersTable } from "./governing-body-members-table"
import { NewMemberDialog } from "./new-member-dialog"


export default async function GoverningBodyAdminPage() {
  const session = await getAuthSession()

  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }

  const members = await getGoverningBodyMembersForAdmin()

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Governing Body Members"
        description="Manage the institutional governing board, executive committee, and key administrative council members."
        action={<NewMemberDialog />}
      />

      <GoverningBodyMembersTable members={members} />
    </div>
  )
}
