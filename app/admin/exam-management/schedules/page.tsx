import { getExamSchedules, getExams, getClasses } from "@/lib/db"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreateExamScheduleDialog, ExamScheduleActions } from "./client-schedules-forms"
import { PageHeader } from "@/components/digicampus/page-header"

function formatDateDMY(dateString: string) {
  if (!dateString) return "—"
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export default async function ExamSchedulesPage() {
  const schedules = await getExamSchedules()
  const exams = await getExams()
  const classes = await getClasses()

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Exam Schedules"
        description="Schedule exam dates and times for each class and subject."
        action={
          <CreateExamScheduleDialog 
            exams={exams} 
            classes={classes} 
          />
        }
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 font-semibold pl-4">#</TableHead>
              <TableHead className="font-semibold">Exam</TableHead>
              <TableHead className="font-semibold">Class</TableHead>
              <TableHead className="font-semibold">Subject</TableHead>
              <TableHead className="font-semibold">Date & Time</TableHead>
              <TableHead className="font-semibold">Room</TableHead>
              <TableHead className="text-right w-24 font-semibold pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                  No schedules configured yet. Click "Add Schedule" to get started.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule, index) => (
                <TableRow key={schedule.id}>
                  <TableCell className="tabular-nums text-muted-foreground font-medium pl-4">{index + 1}</TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{schedule.exam_name}</TableCell>
                  <TableCell className="font-medium text-slate-700 dark:text-slate-300">{schedule.class_name}</TableCell>
                  <TableCell className="font-medium text-slate-700 dark:text-slate-300">{schedule.subject_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-foreground/90">
                        {formatDateDMY(schedule.exam_date)}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {schedule.start_time.substring(0, 5)} – {schedule.end_time.substring(0, 5)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {schedule.room_id || "—"}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <ExamScheduleActions 
                      schedule={schedule}
                      exams={exams}
                      classes={classes}
                    />
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
