"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getDashboardChartData } from "@/app/admin/actions"
import { Info } from "lucide-react"

type AttendanceItem = {
  name: string
  value: number
  color: string
}

type ClassItem = {
  class: string
  students: number
  color: string
}

type ChartData = {
  attendance: AttendanceItem[]
  attendanceDemo: AttendanceItem[]
  classBaseStudents: ClassItem[]
}

interface DashboardChartsProps {
  attendanceMode: "live" | "demo"
  setAttendanceMode: (mode: "live" | "demo") => void
}

export function DashboardCharts({ attendanceMode, setAttendanceMode }: DashboardChartsProps) {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    async function fetchChartData() {
      try {
        const result = await getDashboardChartData()
        if (result.success && result.data) {
          setData(result.data as ChartData)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (!mounted || loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-none">
        <div className="lg:col-span-1 h-[320px] rounded-lg border border-border bg-card animate-pulse" />
        <div className="lg:col-span-2 h-[320px] rounded-lg border border-border bg-card animate-pulse" />
      </div>
    )
  }

  const attendanceData = attendanceMode === "live" 
    ? (data?.attendance || []) 
    : (data?.attendanceDemo || [])

  const classData = data?.classBaseStudents || []
  const totalStudents = classData.reduce((sum, item) => sum + item.students, 0)
  
  const formatTooltipValue = (value: any) => [`${value} Students`, "Count"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-none">
      {/* ─── LEFT: Student Attendance Chart (Donut) ─── */}
      <Card className="lg:col-span-1 border border-border/60 bg-card rounded-lg shadow-sm border-t-[3px] border-t-cyan-400 relative hover:shadow-md transition-shadow duration-300 py-4 flex flex-col justify-between">
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-bold text-card-foreground">
                Student Attendance Chart
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {attendanceMode === "live" ? "Live system log status" : "Simulated preview statistics"}
              </p>
            </div>
            {/* Toggle Modes */}
            <div className="flex bg-muted p-0.5 rounded-md border border-border/40">
              <button
                onClick={() => setAttendanceMode("live")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-all ${
                  attendanceMode === "live"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-card-foreground"
                }`}
              >
                Live
              </button>
              <button
                onClick={() => setAttendanceMode("demo")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-all ${
                  attendanceMode === "demo"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-card-foreground"
                }`}
              >
                Demo
              </button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center relative pt-4 min-h-[180px] px-5">
            <div className="w-full h-[180px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={attendanceMode === "live" ? 0 : 3}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                      color: "var(--card-foreground)",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    }}
                    itemStyle={{ color: "var(--card-foreground)" }}
                    labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Inner Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-card-foreground leading-none tracking-tight">
                  {attendanceMode === "live" ? "Offline" : `${totalStudents}`}
                </span>
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider mt-1.5 leading-none">
                  {attendanceMode === "live" ? "No Tracking" : "Students"}
                </span>
              </div>
            </div>

            {/* Custom Legend Layout */}
            <div className="flex gap-4 mt-4 justify-center items-center">
              {attendanceData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-[2px]"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.name} {attendanceMode === "demo" && `(${item.value}%)`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </div>

        {/* Warning / Offline Notice banner */}
        <div className="mx-5 mt-4 px-3 py-2 bg-amber-500/10 rounded-md border border-amber-500/20 flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs leading-normal text-amber-600 dark:text-amber-400 font-medium">
            {attendanceMode === "live" 
              ? "Attendance tracking module is not active. Install register sensors to record live counts." 
              : "Demo simulation view. Showing expected attendance rates based on normal registration activity."}
          </p>
        </div>
      </Card>

      {/* ─── RIGHT: Class Base Student (Bar) ─── */}
      <Card className="lg:col-span-2 border border-border/60 bg-card rounded-lg shadow-sm border-t-[3px] border-t-green-500 hover:shadow-md transition-shadow duration-300 py-4 flex flex-col justify-between">
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-bold text-card-foreground">
                Class Base Student
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total registered students grouped by academic class
              </p>
            </div>
            {/* Legend indicator */}
            <div className="flex items-center gap-1.5 border border-border/40 bg-muted/40 px-2 py-0.5 rounded text-xs font-medium text-muted-foreground">
              <div className="w-2.5 h-2.5 bg-primary/80 rounded-[2px]" />
              <span>Students</span>
            </div>
          </CardHeader>

          <CardContent className="pt-4 min-h-[220px] px-5">
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" strokeOpacity={0.25} />
                  <XAxis 
                    dataKey="class" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0, 180]}
                    ticks={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180]}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                      color: "var(--card-foreground)",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                    }}
                    itemStyle={{ color: "var(--card-foreground)" }}
                    labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
                  />
                  <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                    {classData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </div>

        {/* Small stats footer */}
        <div className="mx-5 mt-2 px-3 py-2 bg-muted/40 rounded-md border border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <span>Registered Classes: <strong className="text-foreground">{classData.length}</strong></span>
          <span>Total Student Body: <strong className="text-foreground">{totalStudents}</strong></span>
        </div>
      </Card>
    </div>
  )
}
