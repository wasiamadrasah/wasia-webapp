"use client"

import { useState } from "react"
import { SectionCards } from "@/components/section-cards"
import { AttendanceCards } from "@/components/attendance-cards"
import { EmployeeOverview } from "@/components/employee-overview"
import { LoginActivityFeed } from "@/components/login-activity-feed"
import { DashboardCharts } from "@/components/dashboard-charts"

export default function DashboardPage() {
  const [attendanceMode, setAttendanceMode] = useState<"live" | "demo">("live")

  return (
    <div className="w-full max-w-none @container/main flex flex-1 flex-col gap-2">
      <div className="w-full max-w-none flex flex-col gap-6 py-4 md:py-6">
        <SectionCards />
        <div className="flex flex-col gap-6">
          <AttendanceCards attendanceMode={attendanceMode} />
          <DashboardCharts attendanceMode={attendanceMode} setAttendanceMode={setAttendanceMode} />
          <EmployeeOverview attendanceMode={attendanceMode} />
          <LoginActivityFeed />
        </div>
      </div>
    </div>
  )
}
