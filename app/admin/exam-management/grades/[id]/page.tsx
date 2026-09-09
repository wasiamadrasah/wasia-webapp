import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getGradeScaleById, getGradeScaleDetails } from "@/lib/db"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CreateGradeScaleDetailDialog, GradeScaleDetailActions } from "./client-configure-forms"
import { PageHeader } from "@/components/digicampus/page-header"

function getLetterGradeBadge(letter: string) {
  const l = letter.toUpperCase()
  if (l.startsWith("A") || l.startsWith("S")) {
    return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40"
  }
  if (l.startsWith("B")) {
    return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40"
  }
  if (l.startsWith("C") || l.startsWith("D")) {
    return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40"
  }
  if (l.startsWith("F") || l.startsWith("U") || l.startsWith("E")) {
    return "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40"
  }
  return "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800/40"
}

export default async function GradeScaleConfigurePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const scale = await getGradeScaleById(id)
  if (!scale) notFound()

  const details = await getGradeScaleDetails(id)

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="hover:bg-slate-100 dark:hover:bg-slate-800">
          <Link href="/admin/exam-management/grades">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Grade Scales
          </Link>
        </Button>
      </div>

      <PageHeader
        title={scale.name}
        description={scale.description || undefined}
        action={<CreateGradeScaleDetailDialog scaleId={id} />}
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 font-semibold pl-4">#</TableHead>
              <TableHead className="font-semibold">Letter Grade</TableHead>
              <TableHead className="font-semibold">Grade Point</TableHead>
              <TableHead className="font-semibold">Mark Range</TableHead>
              <TableHead className="font-semibold">Remarks</TableHead>
              <TableHead className="text-right w-24 font-semibold pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                  No grade details added yet. Click "Add Grade" to get started.
                </TableCell>
              </TableRow>
            ) : (
              details.map((detail, index) => (
                <TableRow key={detail.id}>
                  <TableCell className="tabular-nums text-muted-foreground font-medium pl-4">{index + 1}</TableCell>
                  <TableCell>
                    <span className={`font-bold text-xs border px-2.5 py-1 rounded-md inline-block min-w-[36px] text-center ${getLetterGradeBadge(detail.grade_letter)}`}>
                      {detail.grade_letter}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200/40 dark:border-slate-700/40">
                      {detail.grade_point.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground/90 font-medium">
                    {detail.min_percentage}% – {detail.max_percentage}%
                  </TableCell>
                  <TableCell>
                    {detail.remarks ? (
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/30 dark:border-slate-700/30 px-2 py-1 rounded">
                        {detail.remarks}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/55">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <GradeScaleDetailActions detail={detail} />
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
