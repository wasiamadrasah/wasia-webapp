import { getGradeScales } from "@/lib/db"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreateGradeScaleDialog, GradeScaleActions } from "./client-grade-forms"
import { PageHeader } from "@/components/digicampus/page-header"

export default async function GradeScalesPage() {
  const gradeScales = await getGradeScales()

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Grade Scales"
        description="Manage grading scales (e.g., GPA 5, CGPA 4, University Standard)."
        action={<CreateGradeScaleDialog />}
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 font-semibold pl-4">#</TableHead>
              <TableHead className="font-semibold">Scale Name</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="text-right w-24 font-semibold pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradeScales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground h-32">
                  No grade scales configured yet.
                </TableCell>
              </TableRow>
            ) : (
              gradeScales.map((scale, index) => (
                <TableRow key={scale.id}>
                  <TableCell className="tabular-nums text-muted-foreground font-medium pl-4">{index + 1}</TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{scale.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-md truncate">{scale.description || "—"}</TableCell>
                  <TableCell className="text-right pr-4">
                    <GradeScaleActions scale={scale} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
