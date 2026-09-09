"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { toast } from "@/components/ui/sonner"
import {
  CalendarDays,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Printer,
  ChevronRight,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/digicampus/page-header"
import { FormDatePicker } from "@/components/admin/form-date-picker"
import {
  getStaffsForAttendance,
  saveOrUpdateAttendance,
  getAttendanceSettings,
  updateAttendanceSettings,
  getDailyAttendanceReport,
  getMonthlyAttendanceReport,
  AttendanceRecordInput,
} from "@/app/admin/attendance-actions"

type AttendanceItem = {
  staff_id: string
  employee_id: string
  full_name_en: string
  contact_number: string
  designation: string
  profile_photo: string | null
  type: string
  attendance_id: string | null
  status: "present" | "absent" | "leave"
  in_time: string
  out_time: string
  is_late: boolean
  is_early_exit: boolean
  remark: string
  shift_id: string | null
}

const formatDateDMY = (dateStr: string) => {
  if (!dateStr) return ""
  const [year, month, day] = dateStr.split("-")
  if (!year || !month || !day) return dateStr
  return `${day}/${month}/${year}`
}

const formatDateDisplayWord = (dateStr: string) => {
  if (!dateStr) return ""
  const parts = dateStr.split("-")
  if (parts.length < 3) return dateStr
  const year = parts[0]
  const monthIdx = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[monthIdx] || parts[1]
  return `${day} ${month} ${year}`
}

const formatCurrentTime12Hour = () => {
  const now = new Date()
  const day = now.getDate()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[now.getMonth()]
  const year = now.getFullYear()
  
  let hours = now.getHours()
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12
  const formattedHours = String(hours).padStart(2, "0")
  
  return `${day} ${month} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`
}

const getDefInTime = (designation: string, name: string) => {
  const lowerName = (name || "").toLowerCase()
  if (designation === "Head Teacher" || lowerName.includes("kazim")) {
    return "10:30 AM"
  }
  return "10:10 AM"
}

const formatTime12Hour = (timeStr: string) => {
  if (!timeStr || timeStr === "-") return "-"
  const parts = timeStr.split(":")
  if (parts.length < 2) return timeStr
  const hour = parseInt(parts[0], 10)
  const minute = parts[1]
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const formattedHour = String(displayHour).padStart(2, "0")
  return `${formattedHour}:${minute} ${ampm}`
}

const getLateInMinutes = (defInStr: string, inTimeStr: string, isLate: boolean) => {
  if (!isLate || !inTimeStr || inTimeStr === "-") return "-"
  try {
    const [defHourStr, defMinStr] = defInStr.replace(/ AM| PM/, "").split(":")
    const isDefPm = defInStr.includes("PM")
    let defHour = parseInt(defHourStr, 10)
    if (isDefPm && defHour !== 12) defHour += 12
    if (!isDefPm && defHour === 12) defHour = 0
    const defMinutes = defHour * 60 + parseInt(defMinStr, 10)

    const [inHourStr, inMinStr] = inTimeStr.split(":")
    const inMinutes = parseInt(inHourStr, 10) * 60 + parseInt(inMinStr, 10)

    if (inMinutes > defMinutes) {
      return `${inMinutes - defMinutes}m`
    }
  } catch (e) {}
  return "15m"
}

const getEarlyOutMinutes = (outTimeStr: string, isEarlyExit: boolean) => {
  if (!isEarlyExit || !outTimeStr || outTimeStr === "-") return "-"
  try {
    const [outHourStr, outMinStr] = outTimeStr.split(":")
    const outMinutes = parseInt(outHourStr, 10) * 60 + parseInt(outMinStr, 10)
    const targetMinutes = 14 * 60 // 2:00 PM
    if (outMinutes < targetMinutes) {
      return `-${targetMinutes - outMinutes}m`
    }
  } catch (e) {}
  return "-39m"
}

const getHoursWorked = (inTimeStr: string, outTimeStr: string) => {
  if (!inTimeStr || inTimeStr === "-" || !outTimeStr || outTimeStr === "-") return "-"
  try {
    const [inHourStr, inMinStr] = inTimeStr.split(":")
    const [outHourStr, outMinStr] = outTimeStr.split(":")
    const inMinutes = parseInt(inHourStr, 10) * 60 + parseInt(inMinStr, 10)
    const outMinutes = parseInt(outHourStr, 10) * 60 + parseInt(outMinStr, 10)
    const diff = outMinutes - inMinutes
    if (diff > 0) {
      const h = Math.floor(diff / 60)
      const m = diff % 60
      return `${h}h ${m}m`
    }
  } catch (e) {}
  return "-"
}

const formatStatus = (status: string) => {
  if (!status) return "-"
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function EmployeeAttendancePage() {
  const [activeTab, setActiveTab] = useState<"attendance" | "report" | "setting" | "time">("attendance")
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [records, setRecords] = useState<AttendanceItem[]>([])
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilters, setStatusFilters] = useState({
    present: true,
    leave: true,
    absent: true,
  })

  // Settings
  const [smsSettings, setSmsSettings] = useState({
    in_sms_enabled: false,
    out_sms_enabled: false,
  })
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false)

  // Reports
  const [reportType, setReportType] = useState<"daily" | "monthly">("daily")
  const [dailyFilters, setDailyFilters] = useState({
    date: new Date().toISOString().split("T")[0],
    shift: "all",
    present: true,
    leave: true,
    absent: true,
    employeeId: "",
  })
  const [monthlyFilters, setMonthlyFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    type: "total", // total, details
    category: "both", // teacher, staff, both
    shift: "all",
    employeeId: "",
  })
  const [reportLoading, setReportLoading] = useState<boolean>(false)
  const [reportRecords, setReportRecords] = useState<any[]>([])
  const [instituteLogo, setInstituteLogo] = useState<string | null>(null)

  // Fetch school logo on mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/public/home-feed")
        const data = await response.json()
        if (data.institute_settings?.primary?.logo) {
          setInstituteLogo(data.institute_settings.primary.logo)
        }
      } catch (error) {
        console.warn("Failed to fetch institute logo:", error)
      }
    }
    fetchLogo()
  }, [])

  // Fetch Attendance Log List
  const fetchAttendanceList = async (targetDate: string) => {
    setLoading(true)
    try {
      const res = await getStaffsForAttendance(targetDate)
      if (res.success && res.data) {
        setRecords(res.data as AttendanceItem[])
      } else {
        toast.error(res.message || "Failed to load staff attendance records")
      }
    } catch (err) {
      toast.error("Error communicating with servers")
    } finally {
      setLoading(false)
    }
  }

  // Fetch Global Settings
  const fetchSettings = async () => {
    setSettingsLoading(true)
    try {
      const res = await getAttendanceSettings()
      if (res.success && res.data) {
        setSmsSettings(res.data)
      }
    } catch {
      console.warn("Failed to fetch attendance settings")
    } finally {
      setSettingsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendanceList(date)
    } else if (activeTab === "setting") {
      fetchSettings()
    }
  }, [activeTab, date])

  // Update Field locally in state
  const handleRecordChange = (staffId: string, field: keyof AttendanceItem, value: any) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.staff_id === staffId) {
          const updated = { ...rec, [field]: value }
          // If status changes to absent or leave, reset times
          if (field === "status") {
            if (value === "absent" || value === "leave") {
              updated.in_time = ""
              updated.out_time = ""
              updated.is_late = false
              updated.is_early_exit = false
            } else if (value === "present" && !updated.in_time) {
              // Default check in time if marked present
              updated.in_time = "09:00"
            }
          }
          return updated
        }
        return rec
      })
    )
  }

  // Bulk set all Out Times
  const handleSetAllOutTimes = () => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.status === "present" && !rec.out_time) {
          return { ...rec, out_time: "17:00" }
        }
        return rec
      })
    )
    toast.success("Applied checkout time to all present staff members")
  }

  // Save Batch Changes to DB
  const handleSaveAttendance = async () => {
    setSaving(true)
    try {
      const payload: AttendanceRecordInput[] = records.map((rec) => ({
        staff_id: rec.staff_id,
        date,
        status: rec.status,
        in_time: rec.in_time || null,
        out_time: rec.out_time || null,
        is_late: rec.is_late,
        is_early_exit: rec.is_early_exit,
        remark: rec.remark || null,
        shift_id: rec.shift_id || null,
      }))
      const res = await saveOrUpdateAttendance(payload)
      if (res.success) {
        toast.success(res.message || "Attendance saved successfully!")
        fetchAttendanceList(date)
      } else {
        toast.error(res.message || "Failed to update attendance")
      }
    } catch {
      toast.error("Failed to connect to database server")
    } finally {
      setSaving(false)
    }
  }

  // Handle Settings Update (Mocked/Inactive warning as per user request)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.warning("SMS service is inactive. Subscription is required to enable SMS notifications.")
  }

  // Generate Daily or Monthly Report preview
  const handleGenerateReport = async () => {
    setReportLoading(true)
    try {
      if (reportType === "daily") {
        const res = await getDailyAttendanceReport(
          dailyFilters.date,
          dailyFilters.shift,
          dailyFilters.employeeId
        )
        if (res.success && res.data) {
          // Filter logs on client based on checkbox states
          const filtered = res.data.filter((item: any) => {
            if (item.status === "present" && !dailyFilters.present) return false
            if (item.status === "leave" && !dailyFilters.leave) return false
            if (item.status === "absent" && !dailyFilters.absent) return false
            return true
          })
          setReportRecords(filtered)
          toast.success(`Generated report with ${filtered.length} records`)
        } else {
          toast.error(res.message || "Failed to fetch daily report")
        }
      } else {
        const res = await getMonthlyAttendanceReport(
          monthlyFilters.startDate,
          monthlyFilters.endDate,
          monthlyFilters.type,
          monthlyFilters.category,
          monthlyFilters.shift,
          monthlyFilters.employeeId
        )
        if (res.success && res.data) {
          setReportRecords(res.data)
          toast.success(`Generated monthly analysis report`)
        } else {
          toast.error(res.message || "Failed to fetch monthly report")
        }
      }
    } catch {
      toast.error("Failed to generate report")
    } finally {
      setReportLoading(false)
    }
  }

  // Print Report action
  const handlePrintReport = () => {
    if (reportRecords.length === 0) {
      toast.error("No records available to print. Please generate a report first.")
      return
    }

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("Pop-up blocker is preventing the print layout.")
      return
    }

    const isDaily = reportType === "daily"
    const title = isDaily ? "Employee Daily Attendance Report" : "Employee Monthly Attendance Summary"

    // Summary calculations (specifically for daily report stats bar)
    const totalCount = reportRecords.length
    const presentCount = reportRecords.filter((r) => r.status === "present").length
    const absentCount = reportRecords.filter((r) => r.status === "absent").length
    const lateCount = reportRecords.filter((r) => r.status === "present" && r.is_late).length
    const leaveCount = reportRecords.filter((r) => r.status === "leave").length
    const dayOffCount = 0 // Day Off count

    let reportHeaderHTML = ""
    let tableHeaders = ""
    let tableRows = ""

    if (isDaily) {
      reportHeaderHTML = `
        <div class="header-container">
          <img src="${instituteLogo || ''}" class="school-logo" onerror="this.style.display='none';" />
          <div class="header-text">
            <h1 class="school-title">Purba Bakalia City Corporation High School</h1>
            <p class="school-address">Abdul Latif Hat, 18 No.Ward, East Bakalia, P.S-Bakalia, Chattogram</p>
            <p class="school-contact">Cont: 01309131385 Email: pbcc4010@gmail.com</p>
            <h2 class="report-subtitle">Employee date and shift wise attendance report</h2>
          </div>
        </div>
        <div class="meta-row">
          <div class="meta-left">Attendance Date: ${formatDateDisplayWord(dailyFilters.date)}</div>
          <div class="meta-right">Printed : ${formatCurrentTime12Hour()}</div>
        </div>
        <div class="summary-bar">
          <div class="summary-col total">Total : ${totalCount}</div>
          <div class="summary-col present">Present : ${presentCount}</div>
          <div class="summary-col absent">Absent : ${absentCount}</div>
          <div class="summary-col late">Late : ${lateCount}</div>
          <div class="summary-col leave">Leave : ${leaveCount}</div>
          <div class="summary-col day-off">Day Off : ${dayOffCount}</div>
        </div>
      `
      tableHeaders = `
        <th style="width: 40px; text-align: center;">S/L</th>
        <th style="text-align: left; min-width: 140px;">Name</th>
        <th style="text-align: left; min-width: 130px;">Designation</th>
        <th style="text-align: center; width: 75px;">Def. In</th>
        <th style="text-align: center; width: 75px;">In Time</th>
        <th style="text-align: center; width: 65px;">late In</th>
        <th style="text-align: center; width: 75px;">Def. Out</th>
        <th style="text-align: center; width: 75px;">Out Time</th>
        <th style="text-align: center; width: 75px;">Early Out</th>
        <th style="text-align: center; width: 65px;">Hours</th>
        <th style="text-align: center; width: 75px;">Status</th>
        <th style="text-align: left;">Remark</th>
      `
      tableRows = reportRecords.map((rec, index) => {
        const defIn = getDefInTime(rec.designation, rec.full_name_en)
        const formattedIn = formatTime12Hour(rec.in_time)
        const lateIn = getLateInMinutes(defIn, rec.in_time, rec.is_late)
        const defOut = "04:00 PM"
        const formattedOut = formatTime12Hour(rec.out_time)
        const earlyOut = getEarlyOutMinutes(rec.out_time, rec.is_early_exit)
        const hoursWorked = getHoursWorked(rec.in_time, rec.out_time)
        const status = formatStatus(rec.status)
        const remark = rec.remark || "-"

        return `
          <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: left; font-weight: bold; color: #333;">${rec.full_name_en}</td>
            <td style="text-align: left;">${rec.designation}</td>
            <td style="text-align: center;">${defIn}</td>
            <td style="text-align: center;">${formattedIn}</td>
            <td style="text-align: center;">${lateIn}</td>
            <td style="text-align: center;">${defOut}</td>
            <td style="text-align: center;">${formattedOut}</td>
            <td style="text-align: center;">${earlyOut}</td>
            <td style="text-align: center;">${hoursWorked}</td>
            <td style="text-align: center;">${status}</td>
            <td style="text-align: left;">${remark}</td>
          </tr>
        `
      }).join("")
    } else {
      reportHeaderHTML = `
        <div class="header-container">
          <img src="${instituteLogo || ''}" class="school-logo" onerror="this.style.display='none';" />
          <div class="header-text">
            <h1 class="school-title">Purba Bakalia City Corporation High School</h1>
            <p class="school-address">Abdul Latif Hat, 18 No.Ward, East Bakalia, P.S-Bakalia, Chattogram</p>
            <p class="school-contact">Cont: 01309131385 Email: pbcc4010@gmail.com</p>
            <h2 class="report-subtitle">Employee Monthly Attendance Summary</h2>
          </div>
        </div>
        <div class="meta-row">
          <div class="meta-left">Date Range: ${formatDateDisplayWord(monthlyFilters.startDate)} - ${formatDateDisplayWord(monthlyFilters.endDate)}</div>
          <div class="meta-right">Printed : ${formatCurrentTime12Hour()}</div>
        </div>
      `
      tableHeaders = `
        <th style="width: 40px; text-align: center;">S/L</th>
        <th style="width: 100px; text-align: center;">Employee ID</th>
        <th style="text-align: left; min-width: 160px;">Name</th>
        <th style="text-align: left; min-width: 140px;">Designation</th>
        <th style="text-align: center; width: 90px;">Present Days</th>
        <th style="text-align: center; width: 90px;">Absent Days</th>
        <th style="text-align: center; width: 90px;">Leave Days</th>
        <th style="text-align: center; width: 95px;">Late Instances</th>
        <th style="text-align: center; width: 90px;">Early Exits</th>
        <th style="text-align: center; width: 90px;">Total Logs</th>
      `
      tableRows = reportRecords.map((rec, index) => `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td style="text-align: center; font-family: monospace;">${rec.employee_id}</td>
          <td style="text-align: left; font-weight: bold; color: #333;">${rec.full_name_en}</td>
          <td style="text-align: left;">${rec.designation}</td>
          <td style="text-align: center;">${rec.present_count}</td>
          <td style="text-align: center;">${rec.absent_count}</td>
          <td style="text-align: center;">${rec.leave_count}</td>
          <td style="text-align: center;">${rec.late_count}</td>
          <td style="text-align: center;">${rec.early_exit_count}</td>
          <td style="text-align: center;">${rec.total_days}</td>
        </tr>
      `).join("")
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 20px;
              color: #000;
              margin: 0;
            }
            .header-container {
              position: relative;
              text-align: center;
              margin-bottom: 10px;
              min-height: 85px;
            }
            .school-logo {
              position: absolute;
              left: 10px;
              top: 5px;
              width: 75px;
              height: 75px;
              object-fit: contain;
            }
            .header-text {
              margin: 0 auto;
              max-width: 80%;
            }
            .school-title {
              font-size: 20px;
              font-weight: bold;
              color: #1e3a8a;
              margin: 0 0 3px 0;
            }
            .school-address {
              font-size: 11px;
              margin: 0 0 2px 0;
              color: #333;
            }
            .school-contact {
              font-size: 11px;
              margin: 0 0 5px 0;
              color: #333;
            }
            .report-subtitle {
              font-size: 13px;
              font-weight: bold;
              color: #4b5563;
              margin: 0;
              text-decoration: underline;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              padding-bottom: 4px;
              margin-top: 10px;
              font-size: 11px;
              font-weight: bold;
            }
            .summary-bar {
              display: flex;
              width: 100%;
              margin-top: 12px;
              margin-bottom: 12px;
            }
            .summary-col {
              flex: 1;
              text-align: center;
              padding: 6px 2px;
              font-weight: bold;
              font-size: 12px;
              border: 1px solid #000;
              margin-right: -1px;
            }
            .summary-col.total { background-color: #86efac; color: #000; }
            .summary-col.present { background-color: #fca5a5; color: #000; }
            .summary-col.absent { background-color: #2dd4bf; color: #000; }
            .summary-col.late { background-color: #a5b4fc; color: #000; }
            .summary-col.leave { background-color: #fef9c3; color: #000; }
            .summary-col.day-off { background-color: #93c5fd; color: #000; }

            table.report-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
              font-size: 10px;
            }
            table.report-table th, table.report-table td {
              border: 1px solid #000;
              padding: 5px 4px;
              vertical-align: middle;
            }
            table.report-table th {
              background-color: #f3f4f6;
              color: #000;
              font-weight: bold;
              text-align: center;
            }
            @media print {
              body { padding: 0; }
              @page {
                size: A4 landscape;
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          ${reportHeaderHTML}
          <table class="report-table">
            <thead>
              <tr>${tableHeaders}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Filter local logs for logging tab
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.full_name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.contact_number.includes(searchQuery)

    const matchesStatus =
      (rec.status === "present" && statusFilters.present) ||
      (rec.status === "leave" && statusFilters.leave) ||
      (rec.status === "absent" && statusFilters.absent)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="w-full max-w-none space-y-6" suppressHydrationWarning>
      <PageHeader
        title="Employee Attendance"
        description="Manage and track daily attendance, shifts, and reports for teachers and staff."
      />

      <div className="w-full max-w-none border-b border-border bg-card shadow-xs rounded-t-lg">
        <nav className="flex space-x-1 px-4 py-2" aria-label="Tabs">
          {[
            { id: "attendance", label: "Attendance", icon: Clock },
            { id: "report", label: "Report", icon: FileText },
            { id: "setting", label: "Setting", icon: Settings },
            { id: "time", label: "Time Setting", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="w-full max-w-none min-h-[400px]">
        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 1: ATTENDANCE LOGGING */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Date selection */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Attendance Date</label>
                    <div className="w-[180px]">
                      <FormDatePicker
                        value={date}
                        onChange={(newDate) => setDate(newDate)}
                        className="h-10!"
                      />
                    </div>
                  </div>

                  {/* Shift Selection */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Shift</label>
                    <Select defaultValue="day">
                      <SelectTrigger className="h-10! min-w-[120px] bg-card border-border text-sm">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day Shift</SelectItem>
                        <SelectItem value="morning">Morning Shift</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status checklist filters */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Filter View</label>
                    <div className="flex items-center gap-4 h-10! px-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          id="filter-present"
                          checked={statusFilters.present}
                          onCheckedChange={(checked) => setStatusFilters({ ...statusFilters, present: !!checked })}
                        />
                        <label htmlFor="filter-present" className="text-sm font-medium text-foreground cursor-pointer select-none">
                          Present
                        </label>
                      </div>
                      <div className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          id="filter-leave"
                          checked={statusFilters.leave}
                          onCheckedChange={(checked) => setStatusFilters({ ...statusFilters, leave: !!checked })}
                        />
                        <label htmlFor="filter-leave" className="text-sm font-medium text-foreground cursor-pointer select-none">
                          Leave
                        </label>
                      </div>
                      <div className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          id="filter-absent"
                          checked={statusFilters.absent}
                          onCheckedChange={(checked) => setStatusFilters({ ...statusFilters, absent: !!checked })}
                        />
                        <label htmlFor="filter-absent" className="text-sm font-medium text-foreground cursor-pointer select-none">
                          Absent
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-3 self-end">
                  <button
                    onClick={() => fetchAttendanceList(date)}
                    className="flex h-10! items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Reload
                  </button>
                  <button
                    onClick={handleSetAllOutTimes}
                    className="flex h-10! items-center justify-center gap-2 rounded-lg border border-border bg-muted/70 hover:bg-muted px-4 text-sm font-medium text-foreground transition-colors"
                  >
                    Set Checkouts
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by Employee ID, Name, or Mobile Number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10! w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>
            </div>

            {/* Attendance Grid Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading employee list...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <AlertCircle className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">No records match the current filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full min-w-[1200px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">S/L</TableHead>
                        <TableHead className="w-[120px]">Username</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[250px]">Name</TableHead>
                        <TableHead className="w-[150px]">Number</TableHead>
                        <TableHead className="text-center w-[150px]">SMS (In / Out)</TableHead>
                        <TableHead className="w-[150px]">In Time</TableHead>
                        <TableHead className="w-[150px]">Out Time</TableHead>
                        <TableHead className="text-center w-[100px]">Late</TableHead>
                        <TableHead className="text-center w-[100px]">Early Exit</TableHead>
                        <TableHead>Remark</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record, index) => {
                        const isAbsent = record.status === "absent"
                        const isLeave = record.status === "leave"

                        return (
                          <TableRow key={record.staff_id}>
                            {/* Serial */}
                            <TableCell className="font-medium">{index + 1}</TableCell>

                            {/* Username / Code */}
                            <TableCell className="font-mono text-xs">{record.employee_id}</TableCell>

                            {/* Status Selector */}
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Select
                                  value={record.status}
                                  onValueChange={(val: any) => handleRecordChange(record.staff_id, "status", val)}
                                >
                                  <SelectTrigger className="h-9 w-[100px] text-xs font-semibold bg-background border-border">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="leave">Leave</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>

                            {/* Name */}
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                  {record.profile_photo ? (
                                    <Image src={record.profile_photo} alt={record.full_name_en} width={32} height={32} className="h-full w-full object-cover rounded" />
                                  ) : (
                                    record.full_name_en.charAt(0)
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-foreground truncate">{record.full_name_en}</p>
                                  <p className="text-xs text-muted-foreground truncate">{record.designation}</p>
                                </div>
                              </div>
                            </TableCell>

                            {/* Mobile Number */}
                            <TableCell className="text-xs text-muted-foreground">{record.contact_number}</TableCell>

                            {/* SMS Mock triggers */}
                            <TableCell>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toast.warning("SMS subscription is currently inactive.")}
                                  className="h-8 px-2 text-[10px] font-semibold border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-foreground bg-card transition-colors"
                                >
                                  SMS (In)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toast.warning("SMS subscription is currently inactive.")}
                                  className="h-8 px-2 text-[10px] font-semibold border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-foreground bg-card transition-colors"
                                >
                                  SMS (Out)
                                </button>
                              </div>
                            </TableCell>

                            {/* Check In Time */}
                            <TableCell>
                              <input
                                type="time"
                                value={record.in_time}
                                disabled={isAbsent || isLeave}
                                onChange={(e) => handleRecordChange(record.staff_id, "in_time", e.target.value)}
                                className="h-9 w-28 rounded-md border border-border bg-card px-2 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:bg-muted/50 disabled:text-muted-foreground transition"
                              />
                            </TableCell>

                            {/* Check Out Time */}
                            <TableCell>
                              <input
                                type="time"
                                value={record.out_time}
                                disabled={isAbsent || isLeave}
                                onChange={(e) => handleRecordChange(record.staff_id, "out_time", e.target.value)}
                                className="h-9 w-28 rounded-md border border-border bg-card px-2 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:bg-muted/50 disabled:text-muted-foreground transition"
                              />
                            </TableCell>

                            {/* Late Toggle */}
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Switch
                                  checked={record.is_late}
                                  disabled={isAbsent || isLeave}
                                  onCheckedChange={(checked) => handleRecordChange(record.staff_id, "is_late", checked)}
                                />
                              </div>
                            </TableCell>

                            {/* Early Exit Toggle */}
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Switch
                                  checked={record.is_early_exit}
                                  disabled={isAbsent || isLeave}
                                  onCheckedChange={(checked) => handleRecordChange(record.staff_id, "is_early_exit", checked)}
                                />
                              </div>
                            </TableCell>

                            {/* Remark Text input */}
                            <TableCell>
                              <input
                                type="text"
                                placeholder="Add remark..."
                                value={record.remark}
                                onChange={(e) => handleRecordChange(record.staff_id, "remark", e.target.value)}
                                className="h-9 w-full min-w-[150px] rounded-md border border-border bg-card px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 rounded-lg border border-border bg-card p-4 shadow-xs">
              <button
                onClick={handleSaveAttendance}
                disabled={saving || loading || records.length === 0}
                className="min-w-[150px] h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 transition"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 2: REPORTS PANEL */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "report" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-lg border border-border bg-card p-5 shadow-xs space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">Report Scope</h3>
                
                {/* Daily vs Monthly Select */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg border border-border">
                  <button
                    onClick={() => { setReportType("daily"); setReportRecords([]); }}
                    className={`h-9 text-xs font-semibold rounded-md transition ${
                      reportType === "daily" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Daily Report
                  </button>
                  <button
                    onClick={() => { setReportType("monthly"); setReportRecords([]); }}
                    className={`h-9 text-xs font-semibold rounded-md transition ${
                      reportType === "monthly" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Monthly Report
                  </button>
                </div>

                {reportType === "daily" ? (
                  /* Daily Filters Form */
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Attendance Date *</label>
                      <FormDatePicker
                        value={dailyFilters.date}
                        onChange={(newDate) => setDailyFilters({ ...dailyFilters, date: newDate })}
                        className="h-10! w-full"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground mb-1 block">Select Shift</label>
                      <Select
                        value={dailyFilters.shift}
                        onValueChange={(val) => setDailyFilters({ ...dailyFilters, shift: val })}
                      >
                        <SelectTrigger className="h-10! w-full bg-card border-border text-sm">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Shifts</SelectItem>
                          <SelectItem value="day">Day Shift</SelectItem>
                          <SelectItem value="morning">Morning Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground block mb-1">Include Statuses</label>
                      <div className="space-y-2 py-1">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            id="daily-present"
                            checked={dailyFilters.present}
                            onCheckedChange={(checked) => setDailyFilters({ ...dailyFilters, present: !!checked })}
                          />
                          <label htmlFor="daily-present" className="text-sm text-foreground cursor-pointer select-none">
                            Present
                          </label>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            id="daily-leave"
                            checked={dailyFilters.leave}
                            onCheckedChange={(checked) => setDailyFilters({ ...dailyFilters, leave: !!checked })}
                          />
                          <label htmlFor="daily-leave" className="text-sm text-foreground cursor-pointer select-none">
                            Leave
                          </label>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            id="daily-absent"
                            checked={dailyFilters.absent}
                            onCheckedChange={(checked) => setDailyFilters({ ...dailyFilters, absent: !!checked })}
                          />
                          <label htmlFor="daily-absent" className="text-sm text-foreground cursor-pointer select-none">
                            Absent
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Monthly Filters Form */
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground block">Report Type *</label>
                      <div className="flex flex-col gap-2 pt-1">
                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input
                            type="radio"
                            name="monthlyType"
                            checked={monthlyFilters.type === "total"}
                            onChange={() => setMonthlyFilters({ ...monthlyFilters, type: "total" })}
                            className="accent-primary h-4 w-4 cursor-pointer"
                          />
                          Total Summary Count
                        </label>
                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input
                            type="radio"
                            name="monthlyType"
                            checked={monthlyFilters.type === "details"}
                            onChange={() => setMonthlyFilters({ ...monthlyFilters, type: "details" })}
                            className="accent-primary h-4 w-4 cursor-pointer"
                          />
                          Detailed Logs
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground block">Category *</label>
                      <div className="flex flex-col gap-2 pt-1">
                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={monthlyFilters.category === "teacher"}
                            onChange={() => setMonthlyFilters({ ...monthlyFilters, category: "teacher" })}
                            className="accent-primary h-4 w-4 cursor-pointer"
                          />
                          Teachers Only
                        </label>
                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={monthlyFilters.category === "staff"}
                            onChange={() => setMonthlyFilters({ ...monthlyFilters, category: "staff" })}
                            className="accent-primary h-4 w-4 cursor-pointer"
                          />
                          Support Staff Only
                        </label>
                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={monthlyFilters.category === "both"}
                            onChange={() => setMonthlyFilters({ ...monthlyFilters, category: "both" })}
                            className="accent-primary h-4 w-4 cursor-pointer"
                          />
                          Both
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground mb-1 block">Select Shift</label>
                      <Select
                        value={monthlyFilters.shift}
                        onValueChange={(val) => setMonthlyFilters({ ...monthlyFilters, shift: val })}
                      >
                        <SelectTrigger className="h-10! w-full bg-card border-border text-sm">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Shifts</SelectItem>
                          <SelectItem value="day">Day Shift</SelectItem>
                          <SelectItem value="morning">Morning Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">From Date *</label>
                      <FormDatePicker
                        value={monthlyFilters.startDate}
                        onChange={(newDate) => setMonthlyFilters({ ...monthlyFilters, startDate: newDate })}
                        className="h-10! w-full"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">To Date *</label>
                      <FormDatePicker
                        value={monthlyFilters.endDate}
                        onChange={(newDate) => setMonthlyFilters({ ...monthlyFilters, endDate: newDate })}
                        className="h-10! w-full"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleGenerateReport}
                    disabled={reportLoading}
                    className="w-full h-10! bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-xs"
                  >
                    {reportLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Preview"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Display Report preview */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-lg border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-semibold text-foreground">Report Preview</h3>
                  <button
                    onClick={handlePrintReport}
                    disabled={reportRecords.length === 0}
                    className="flex h-10! items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 text-sm font-semibold transition disabled:opacity-50 shadow-xs"
                  >
                    <Printer className="h-4 w-4" />
                    Print PDF Report
                  </button>
                </div>

                {reportRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">No Report Generated Yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Configure scope settings on the left panel and click &quot;Generate Preview&quot;</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    {reportType === "daily" ? (
                      /* Daily table preview */
                      <Table className="w-full min-w-[1100px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px] text-center">S/L</TableHead>
                            <TableHead className="text-left">Name</TableHead>
                            <TableHead className="text-left">Designation</TableHead>
                            <TableHead className="text-center">Def. In</TableHead>
                            <TableHead className="text-center">In Time</TableHead>
                            <TableHead className="text-center">late In</TableHead>
                            <TableHead className="text-center">Def. Out</TableHead>
                            <TableHead className="text-center">Out Time</TableHead>
                            <TableHead className="text-center">Early Out</TableHead>
                            <TableHead className="text-center">Hours</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-left">Remark</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportRecords.map((rec, index) => {
                            const defIn = getDefInTime(rec.designation, rec.full_name_en)
                            const formattedIn = formatTime12Hour(rec.in_time)
                            const lateIn = getLateInMinutes(defIn, rec.in_time, rec.is_late)
                            const defOut = "04:00 PM"
                            const formattedOut = formatTime12Hour(rec.out_time)
                            const earlyOut = getEarlyOutMinutes(rec.out_time, rec.is_early_exit)
                            const hoursWorked = getHoursWorked(rec.in_time, rec.out_time)
                            const status = formatStatus(rec.status)
                            const remark = rec.remark || "-"

                            return (
                              <TableRow key={rec.attendance_id || index}>
                                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                <TableCell className="text-left font-semibold text-foreground">{rec.full_name_en}</TableCell>
                                <TableCell className="text-left text-xs text-muted-foreground">{rec.designation}</TableCell>
                                <TableCell className="text-center text-xs font-mono">{defIn}</TableCell>
                                <TableCell className="text-center text-xs font-mono">{formattedIn}</TableCell>
                                <TableCell className="text-center text-xs font-mono">{lateIn}</TableCell>
                                <TableCell className="text-center text-xs font-mono">{defOut}</TableCell>
                                <TableCell className="text-center text-xs font-mono">{formattedOut}</TableCell>
                                <TableCell className="text-center text-xs font-mono">{earlyOut}</TableCell>
                                <TableCell className="text-center text-xs font-mono">{hoursWorked}</TableCell>
                                <TableCell className="text-center">
                                  <span className="inline-flex px-2 py-1 text-[10px] font-bold uppercase rounded-md border border-border bg-muted text-muted-foreground">
                                    {status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-left text-xs text-muted-foreground truncate max-w-[150px]">{remark}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      /* Monthly table preview */
                      <Table className="w-full min-w-[900px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>S/L</TableHead>
                            <TableHead>Employee ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead className="text-center">Present</TableHead>
                            <TableHead className="text-center">Absent</TableHead>
                            <TableHead className="text-center">Leave</TableHead>
                            <TableHead className="text-center">Late</TableHead>
                            <TableHead className="text-center">Early Exit</TableHead>
                            <TableHead className="text-center">Total Logs</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportRecords.map((rec, index) => (
                            <TableRow key={rec.id}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell className="font-mono text-xs">{rec.employee_id}</TableCell>
                              <TableCell className="font-semibold">{rec.full_name_en}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{rec.designation}</TableCell>
                              <TableCell className="text-center font-semibold">{rec.present_count}</TableCell>
                              <TableCell className="text-center font-semibold">{rec.absent_count}</TableCell>
                              <TableCell className="text-center font-semibold">{rec.leave_count}</TableCell>
                              <TableCell className="text-center">{rec.late_count}</TableCell>
                              <TableCell className="text-center">{rec.early_exit_count}</TableCell>
                              <TableCell className="text-center font-medium text-muted-foreground">{rec.total_days}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 3: CONFIGURATION SETTINGS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "setting" && (
          <div className="max-w-2xl">
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
              <div className="border-b border-border bg-muted/50 px-5 py-4 flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Settings className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Global SMS Settings</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Configure automatic SMS alerts when employees check-in or check-out.</p>
                </div>
              </div>

              {settingsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Loading configurations...</p>
                </div>
              ) : (
                <form onSubmit={handleSaveSettings} className="space-y-6 p-5">
                  {/* Warning banner indicating active sub limits */}
                  <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30 p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">Subscription Required</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">The SMS Notification gateway is currently deactivated because the system has no active gateway subscription. Toggles remain read-only.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Employee In SMS Toggle */}
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                      <div>
                        <label className="text-sm font-semibold text-foreground block">Employee In SMS</label>
                        <span className="text-xs text-muted-foreground">Automatically send an SMS when employee check-in time is recorded.</span>
                      </div>
                      <Switch
                        checked={smsSettings.in_sms_enabled}
                        disabled={true}
                      />
                    </div>

                    {/* Employee Out SMS Toggle */}
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                      <div>
                        <label className="text-sm font-semibold text-foreground block">Employee Out SMS</label>
                        <span className="text-xs text-muted-foreground">Automatically send an SMS when employee check-out time is recorded.</span>
                      </div>
                      <Switch
                        checked={smsSettings.out_sms_enabled}
                        disabled={true}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={true}
                      className="min-w-[150px] h-10 bg-primary text-primary-foreground font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 4: SHIFT / TIME SETTINGS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "time" && (
          <div className="max-w-4xl space-y-6">
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
              <div className="border-b border-border bg-muted/50 px-5 py-4 flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Shift Schedules & Time Rules</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Review global school shifts and associated check-in grace period boundaries.</p>
                </div>
              </div>

              <div className="p-5 overflow-x-auto">
                <Table className="w-full min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shift Name</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Late Grace Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold text-foreground flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Morning Shift
                      </TableCell>
                      <TableCell className="font-mono text-xs">07:30 AM</TableCell>
                      <TableCell className="font-mono text-xs">12:30 PM</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">15 mins (Marked late after 07:45 AM)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-foreground flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Day Shift
                      </TableCell>
                      <TableCell className="font-mono text-xs">12:00 PM</TableCell>
                      <TableCell className="font-mono text-xs">05:00 PM</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">15 mins (Marked late after 12:15 PM)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-foreground flex items-center gap-2 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/30"></span>
                        Evening Shift
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">05:00 PM</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">09:00 PM</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                          Inactive
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-xs flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">Configuring Grace Periods</h4>
                <p className="text-xs text-muted-foreground mt-1">Schedules and grace parameters are linked directly to your school shifts. If you need to add, activate, or alter shift time-bounds, please navigate to the Academic Configurations workspace.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
