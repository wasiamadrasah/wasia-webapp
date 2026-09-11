"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Monitor,
  Smartphone,
  Cpu,
  Globe,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock,
  MapPin,
  Network,
  AlertCircle,
  Eye,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react"

interface ActivityLog {
  id: string
  admin_id: string
  username?: string
  email: string
  login_time: string
  logout_time?: string
  ip_address?: string
  country?: string
  city?: string
  device_type?: string
  device_name?: string
  browser?: string
  os?: string
  user_agent?: string
  login_status: string
  failure_reason?: string
  duration_seconds?: number
  created_at: string
  updated_at: string
}

interface ActivityLogsDataTableProps {
  data: ActivityLog[]
  loading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ActivityLogsDataTable({
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: ActivityLogsDataTableProps) {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4 text-[#3B82F6]" />
      case "tablet":
        return <Cpu className="h-4 w-4 text-[#8B5CF6]" />
      default:
        return <Monitor className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "success") {
      return (
        <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs px-2.5 py-0.5 inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          <span>Success</span>
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="rounded-full bg-rose-50 text-rose-700 border-rose-200 font-semibold text-xs px-2.5 py-0.5 inline-flex items-center gap-1">
        <ShieldAlert className="h-3 w-3" />
        <span>Failed</span>
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    } catch {
      return dateString
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Active Session"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log)
    setDetailsOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 w-full bg-[#F1F5F9] rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-[#F1F5F9] p-3 mb-3">
          <AlertCircle className="h-6 w-6 text-[#94A3B8]" />
        </div>
        <p className="text-sm font-semibold text-foreground">No activity logs found</p>
        <p className="text-xs text-muted-foreground mt-1">Admin authentication activities will be recorded here.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full space-y-5">
      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-border bg-card shadow-2xs">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/40 border-b border-border">
              <TableHead className="text-sm font-bold text-foreground">Administrator</TableHead>
              <TableHead className="text-sm font-bold text-foreground">Login Time</TableHead>
              <TableHead className="text-sm font-bold text-foreground">Device</TableHead>
              <TableHead className="text-sm font-bold text-foreground">Location</TableHead>
              <TableHead className="text-sm font-bold text-foreground">IP Address</TableHead>
              <TableHead className="text-sm font-bold text-foreground">Status</TableHead>
              <TableHead className="text-sm font-bold text-foreground">Duration</TableHead>
              <TableHead className="text-right text-sm font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/40 border-b border-border transition-colors">
                <TableCell className="py-3.5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-foreground">{log.username || "Admin User"}</span>
                    <span className="text-xs text-muted-foreground">{log.email}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(log.login_time)}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(log.device_type)}
                    <span className="text-sm font-medium text-foreground">{log.device_type || "Desktop"}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    {log.country ? (
                      <>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{log.city ? `${log.city}, ${log.country}` : log.country}</span>
                      </>
                    ) : (
                      <span className="text-[#94A3B8]">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-sm text-foreground font-mono">
                    {log.ip_address ? (
                      <>
                        <Network className="h-4 w-4 text-muted-foreground" />
                        <span>{log.ip_address}</span>
                      </>
                    ) : (
                      <span className="text-[#94A3B8]">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-3.5 whitespace-nowrap">{getStatusBadge(log.login_status)}</TableCell>
                <TableCell className="py-3.5 text-sm font-medium text-foreground whitespace-nowrap">
                  {formatDuration(log.duration_seconds)}
                </TableCell>
                <TableCell className="py-3.5 text-right whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleViewDetails(log)} className="cursor-pointer gap-2 text-sm">
                        <Eye className="h-4 w-4 text-primary" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      {log.ip_address && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              window.open(`https://ip-api.com/#${log.ip_address}`, "_blank")
                            }}
                            className="cursor-pointer gap-2 text-sm"
                          >
                            <Globe className="h-4 w-4 text-primary" />
                            <span>Check IP Info</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View (Clean Single Outer Border) */}
      <div className="block md:hidden space-y-3">
        {data.map((log) => (
          <div key={log.id} className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{log.username || "Admin User"}</p>
                <p className="text-xs text-muted-foreground truncate">{log.email}</p>
              </div>
              <div className="shrink-0">{getStatusBadge(log.login_status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Time</span>
                <span className="font-medium text-foreground block">{formatDate(log.login_time)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Device</span>
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  {getDeviceIcon(log.device_type)}
                  <span>{log.device_type || "Desktop"}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(log)}
                className="h-8 gap-1.5 text-xs font-semibold text-primary border-primary/20 bg-primary/10 hover:bg-primary/20"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Details</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <span className="text-sm font-medium text-muted-foreground">
          Showing Page <strong className="text-foreground">{currentPage + 1}</strong> of <strong className="text-foreground">{totalPages || 1}</strong>
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="h-9 text-sm font-medium border-border text-foreground hover:bg-muted/40"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="h-9 text-sm font-medium border-border text-foreground hover:bg-muted/40"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Details Dialog Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-xl rounded-xl border border-border p-0 overflow-hidden">
          <DialogHeader className="border-b border-border bg-muted/40 px-6 py-4">
            <DialogTitle className="text-lg font-bold text-foreground">Activity Details</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Comprehensive session and security metrics for this authentication event.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 p-6 text-sm max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-muted/40 p-3.5 border border-border">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs">User / Admin</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedLog.username || "Admin User"}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{selectedLog.email}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs">Login Status</span>
                  <div className="mt-1">{getStatusBadge(selectedLog.login_status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs">Login Time</span>
                  <p className="font-medium text-foreground mt-0.5">{formatDate(selectedLog.login_time)}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs">Logout Time</span>
                  <p className="font-medium text-foreground mt-0.5">
                    {selectedLog.logout_time ? formatDate(selectedLog.logout_time) : "Still Active"}
                  </p>
                </div>
              </div>

              {selectedLog.login_status === "failed" && selectedLog.failure_reason && (
                <div className="rounded-lg bg-rose-50 p-3 border border-rose-200">
                  <span className="font-bold text-rose-700 block text-xs">Failure Reason</span>
                  <p className="text-rose-600 mt-0.5 font-medium">{selectedLog.failure_reason}</p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-border">
                <h4 className="font-bold text-foreground">Device & Operating System</h4>
                <div className="grid grid-cols-2 gap-3 bg-card p-3 rounded-lg border border-border">
                  <div>
                    <span className="text-muted-foreground block text-xs">Device Type</span>
                    <span className="font-medium text-foreground">{selectedLog.device_type || "Desktop"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Device Name</span>
                    <span className="font-medium text-foreground">{selectedLog.device_name || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Browser</span>
                    <span className="font-medium text-foreground">{selectedLog.browser || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">OS</span>
                    <span className="font-medium text-foreground">{selectedLog.os || "Unknown"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <h4 className="font-bold text-foreground">Network & Location</h4>
                <div className="grid grid-cols-2 gap-3 bg-card p-3 rounded-lg border border-border">
                  <div>
                    <span className="text-muted-foreground block text-xs">IP Address</span>
                    <span className="font-mono font-medium text-foreground">{selectedLog.ip_address || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Location</span>
                    <span className="font-medium text-foreground">
                      {selectedLog.city && selectedLog.country
                        ? `${selectedLog.city}, ${selectedLog.country}`
                        : selectedLog.country || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="font-bold text-foreground block mb-1 text-xs">User Agent</span>
                <p className="rounded-lg bg-muted/40 p-2.5 text-xs font-mono text-muted-foreground break-all border border-border">
                  {selectedLog.user_agent || "Unknown"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
