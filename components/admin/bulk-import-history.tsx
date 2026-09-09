"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, History } from "lucide-react"

interface BulkImportHistoryProps {
  logs: any[]
  classConfigs: any[]
}

export function BulkImportHistory({ logs, classConfigs }: BulkImportHistoryProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center shadow-2xs">
        <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground mb-3">
          <Clock className="size-6 text-muted-foreground/60" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">No Import History Yet</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          Bulk admission activities and upload logs will automatically appear here once you process student imports.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden w-full">
      {/* Header Banner */}
      <div className="bg-slate-100/70 dark:bg-slate-800/40 px-6 py-3.5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2.5">
          <History className="size-4 text-primary dark:text-indigo-400 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/90">
            Recent Bulk Import Logs ({logs.length})
          </h3>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/40 border-b border-border">
              <TableHead className="text-xs font-bold text-foreground pl-6 min-w-[160px]">
                Date & Time
              </TableHead>
              <TableHead className="text-xs font-bold text-foreground min-w-[180px]">
                Performed By
              </TableHead>
              <TableHead className="text-xs font-bold text-foreground min-w-[280px]">
                Target Academic Placement
              </TableHead>
              <TableHead className="text-xs font-bold text-foreground text-right min-w-[140px]">
                Students Imported
              </TableHead>
              <TableHead className="text-xs font-bold text-foreground text-right pr-6 min-w-[120px]">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => {
              const adminData = Array.isArray(log.admins) ? log.admins[0] : log.admins
              const adminName = adminData?.full_name || adminData?.email || "Admin User"
              const importedCount = log.new_values?.imported_count || 0

              const configId = log.new_values?.target_class_config
              const config = classConfigs?.find((c) => c.id === configId)
              let classConfigName = configId ? configId.substring(0, 8) + "..." : "Unknown Combination"

              if (config) {
                classConfigName = [
                  config.session_name,
                  config.class_name,
                  config.section_name ? `Sec: ${config.section_name}` : null,
                  config.shift_name ? `Shift: ${config.shift_name}` : null,
                  config.group_name ? `Grp: ${config.group_name}` : null,
                ]
                  .filter(Boolean)
                  .join(" › ")
              }

              return (
                <TableRow key={log.id} className="hover:bg-muted/20 border-b border-border transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap pl-6 py-3.5">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium text-sm text-foreground py-3.5">
                    {adminName}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground/90 whitespace-nowrap py-3.5">
                    {classConfigName}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm py-3.5">
                    {importedCount}
                  </TableCell>
                  <TableCell className="text-right pr-6 py-3.5">
                    {log.status === "success" ? (
                      <Badge variant="success" className="gap-1 text-[11px]">
                        <CheckCircle2 className="size-3" /> Success
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1 text-[11px]">
                        <XCircle className="size-3" /> Failed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
