"use client"

import { useState, useEffect } from "react"
import { LogIn, Globe, Smartphone, Monitor, AlertCircle, Cpu, RotateCw, User } from "lucide-react"
import { getLoginActivities } from "@/app/admin/actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LoginActivity {
  id: string
  username?: string
  email: string
  login_time: string
  ip_address?: string
  device_type?: string
  device_name?: string
  browser?: string
  os?: string
  user_agent?: string
  login_status: string
  country?: string
  city?: string
}

export function LoginActivityFeed() {
  const [activities, setActivities] = useState<LoginActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function fetchActivities() {
    try {
      const result = await getLoginActivities(10)
      if (result.success) {
        setActivities(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch login activities:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchActivities()
  }

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4 text-blue-500" />
      case "tablet":
        return <Cpu className="h-4 w-4 text-purple-500" />
      default:
        return <Monitor className="h-4 w-4 text-slate-500" />
    }
  }

  const getInitials = (username?: string, email?: string) => {
    const name = username || email || "U"
    return name.charAt(0).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  const formatDetailedTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <Card className="border border-border/60 bg-card rounded-lg shadow-sm border-t-[3px] border-t-blue-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6">
          <div className="flex flex-col gap-1">
            <div className="h-5 bg-muted rounded w-48 animate-pulse" />
            <div className="h-3.5 bg-muted rounded w-64 mt-1.5 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-muted/40 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className="border border-border/60 bg-card rounded-lg shadow-sm border-t-[3px] border-t-blue-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base font-bold text-card-foreground">Recent Login Activity</CardTitle>
            <p className="text-xs text-muted-foreground">Last 10 login attempts</p>
          </div>
          <button onClick={handleRefresh} className="p-1.5 hover:bg-muted rounded border border-border/60 bg-muted/20">
            <RotateCw className={`h-4 w-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <div className="rounded-full bg-slate-100 dark:bg-muted p-4 mb-4">
            <LogIn className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No login activity yet</p>
          <p className="text-xs text-muted-foreground mt-1">Your login history will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border/60 bg-card rounded-lg shadow-sm border-t-[3px] border-t-blue-600 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-bold text-card-foreground">Recent Login Activity</CardTitle>
          <p className="text-sm text-muted-foreground">Last 10 login attempts on this portal</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="p-1.5 hover:bg-muted rounded border border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 border-b border-border/60">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-6">User Profile</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell w-[140px]">Device</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell w-[130px]">OS</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell w-[130px]">Browser</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell w-[150px]">IP Address</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden xl:table-cell w-[180px]">Location</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-[160px]">Time</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-[110px] pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-muted/30 transition-colors border-b border-border/40 text-sm">
                  {/* User Profile */}
                  <TableCell className="py-3 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20 font-bold text-sm border border-blue-500/20">
                        {getInitials(activity.username, activity.email)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground/90">
                          {activity.username || activity.email.split("@")[0]}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {activity.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Device */}
                  <TableCell className="py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/60 border border-border/40">
                        {getDeviceIcon(activity.device_type)}
                      </div>
                      <span className="font-semibold text-foreground/80 capitalize">
                        {activity.device_type || "Desktop"}
                      </span>
                    </div>
                  </TableCell>

                  {/* OS */}
                  <TableCell className="py-3 hidden lg:table-cell font-semibold text-foreground/80">
                    {activity.os || "—"}
                  </TableCell>

                  {/* Browser */}
                  <TableCell className="py-3 hidden md:table-cell font-semibold text-foreground/80">
                    {activity.browser || "—"}
                  </TableCell>

                  {/* IP Address */}
                  <TableCell className="py-3 hidden lg:table-cell font-mono font-semibold text-foreground/80">
                    {activity.ip_address || "—"}
                  </TableCell>

                  {/* Location */}
                  <TableCell className="py-3 hidden xl:table-cell">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-foreground/80">
                        {activity.city && activity.country
                          ? `${activity.city}, ${activity.country}`
                          : activity.country || activity.city || "—"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Time */}
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground/90">{formatDate(activity.login_time)}</span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatDetailedTime(activity.login_time)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3 pr-6">
                    {activity.login_status === "success" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none hover:bg-emerald-500/10 py-0.5 px-2 rounded-full font-bold uppercase text-[10px] tracking-wider">
                        Success
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-none hover:bg-red-500/10 py-0.5 px-2 rounded-full font-bold uppercase text-[10px] tracking-wider">
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
