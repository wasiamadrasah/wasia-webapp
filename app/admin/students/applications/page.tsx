import { getAdmissionApplications } from "@/lib/db"
import { processAdmissionApplicationAction } from "@/app/admin/students/actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"
import { PageHeader } from "@/components/digicampus/page-header"

export default async function AdmissionApplicationsPage() {
  const applications = await getAdmissionApplications()

  return (
    <div className="w-full space-y-6">


      <PageHeader
        title="Admission Applications"
        description="Review and approve prospective students applying online."
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 font-semibold">Application No</TableHead>
              <TableHead className="font-semibold">Student Name</TableHead>
              <TableHead className="font-semibold">Placement Combo</TableHead>
              <TableHead className="font-semibold">Guardian Name</TableHead>
              <TableHead className="font-semibold">Contact Phone</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right pr-6 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                  No online applications found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => {
                const student = app.student_data_json as any
                const guardian = app.guardian_data_json as any

                // Server action bindings
                const approveAction = processAdmissionApplicationAction.bind(null, app.id, true, "")
                const rejectAction = processAdmissionApplicationAction.bind(null, app.id, false, "")

                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-sm font-semibold pl-4">{app.application_no}</TableCell>
                    <TableCell className="font-medium text-foreground">{student.name_en}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{app.class_combination_name}</TableCell>
                    <TableCell>{guardian.father_name || guardian.mother_name || "—"}</TableCell>
                    <TableCell className="font-mono">{student.mobile || "—"}</TableCell>
                    <TableCell>
                      {app.status === "Pending" && (
                        <Badge variant="warning">
                          Pending
                        </Badge>
                      )}
                      {app.status === "Approved" && (
                        <Badge variant="success">
                          Approved
                        </Badge>
                      )}
                      {app.status === "Rejected" && (
                        <Badge variant="destructive">
                          Rejected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {app.status === "Pending" ? (
                        <div className="flex gap-1.5 justify-end">
                          <form action={approveAction}>
                            <Button
                              type="submit"
                              size="sm"
                              variant="soft-success"
                              className="h-8"
                            >
                              <Check className="size-3.5 mr-1" /> Approve
                            </Button>
                          </form>
                          <form action={rejectAction}>
                            <Button
                              type="submit"
                              size="sm"
                              variant="soft-danger"
                              className="h-8"
                            >
                              <X className="size-3.5 mr-1" /> Reject
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic font-medium pr-2">Reviewed</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
