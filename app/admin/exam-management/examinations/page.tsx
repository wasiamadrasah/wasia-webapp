import { getExams, getAcademicSessions } from "@/lib/db"
import { deleteExamAction } from "../actions"
import { Trash2, MoreHorizontal } from "lucide-react"
import { CreateExamDialog } from "./create-exam-dialog"
import { EditExamDialog } from "./edit-exam-dialog"
import { DeleteExamDialog } from "./delete-exam-dialog"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/digicampus/page-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function ExaminationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  const params = (await searchParams) ?? {}
  const exams = await getExams()
  const sessions = await getAcademicSessions()

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Examinations"
        description="Create and manage examinations (e.g. First Term, Midterm, Final Exam)."
        action={<CreateExamDialog sessions={sessions} />}
      />

      {params.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm w-full">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Exam Name</TableHead>
                <TableHead className="font-semibold">Session</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-8 text-center text-muted-foreground">
                    No examinations found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{exam.name}</TableCell>
                    <TableCell className="text-muted-foreground">{exam.session_name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        exam.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20'
                      }`}>
                        {exam.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-foreground/80" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <EditExamDialog exam={exam} sessions={sessions} />
                          <DropdownMenuSeparator />
                          <DeleteExamDialog id={exam.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
