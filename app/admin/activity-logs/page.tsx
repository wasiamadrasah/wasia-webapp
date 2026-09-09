"use client"

import { useState, useEffect } from "react"
import { getAllAdminActivityLogs } from "@/app/admin/actions"
import { PageHeader } from "@/components/digicampus/page-header"
import { ActivityLogsDataTable } from "@/components/admin/activity-logs-data-table"
import { AlertCircle, Activity } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

const ITEMS_PER_PAGE = 20

export default function ActivityLogsPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true)
      setError(null)
      try {
        const result = await getAllAdminActivityLogs(
          ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
        )

        if (result.success) {
          setActivities(result.data)
          setTotalCount(result.total)
        } else {
          setError(result.message || "Failed to fetch activity logs")
        }
      } catch (err) {
        setError("An error occurred while fetching activity logs")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [currentPage])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="w-full max-w-none space-y-6">
      <PageHeader
        title="Activity Logs"
        description="Monitor login activities, security events, and session history across all administrator accounts."
        action={
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-3.5 py-1.5 text-xs font-semibold text-[#4F46E5] shadow-xs">
            <Activity className="h-3.5 w-3.5" />
            <span>{totalCount} Total Logs</span>
          </div>
        }
      />

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ActivityLogsDataTable
        data={activities}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
