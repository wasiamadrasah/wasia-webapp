import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"

import { getAuthSession } from "@/lib/auth"
import { getTeacherDashboardMetrics } from "@/lib/db"
import { WelcomeSection } from "@/components/teacher/welcome-section"
import { MetricGrid, type MetricLink } from "@/components/teacher/metric-grid"
import { ActivityTable, type ActivityItem } from "@/components/teacher/activity-table"
import { ChartContainer, StatisticItem } from "@/components/teacher/chart-container"

export default async function TeacherDashboard() {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return null
  }

  const metrics = await getTeacherDashboardMetrics(session.user.id)
  const totalRecords =
    metrics.academics + metrics.experience + metrics.training + metrics.family
  const academicProgress = Math.min(Math.round((metrics.academics / 5) * 100), 100)
  const professionalProgress = Math.min(
    Math.round(((metrics.experience + metrics.training) / 10) * 100),
    100
  )

  const metricCards: MetricLink[] = [
    {
      label: "Academic Records",
      value: metrics.academics,
      href: "/teacher/academics",
      icon: <BookOpen className="h-6 w-6" />,
      color: "blue",
    },
    {
      label: "Experience Entries",
      value: metrics.experience,
      href: "/teacher/experience",
      icon: <BriefcaseBusiness className="h-6 w-6" />,
      color: "green",
    },
    {
      label: "Training Records",
      value: metrics.training,
      href: "/teacher/training",
      icon: <Sparkles className="h-6 w-6" />,
      color: "purple",
    },
    {
      label: "Family Information",
      value: metrics.family,
      href: "/teacher/family",
      icon: <Users className="h-6 w-6" />,
      color: "orange",
    },
  ]

  const activityItems: ActivityItem[] = metricCards.map((card) => ({
    section: card.label,
    count: card.value,
    status: card.value > 0 ? "active" : "inactive",
    lastUpdated: card.value > 0 ? "Available" : "Not started",
  }))

  return (
    <section className="space-y-6">
      <WelcomeSection
        teacherName={metrics.profile?.full_name_en || session.user.email || "Teacher"}
        designation={metrics.profile?.designation ?? undefined}
        subject={metrics.profile?.subject ?? undefined}
        profileCompletion={metrics.profileCompletion}
      />

      <MetricGrid metrics={metricCards} />

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartContainer
          title="Profile Status"
          subtitle="Complete your profile information"
        >
          <div className="space-y-5">
            <StatisticItem
              label="Overall Completion"
              value={`${metrics.profileCompletion}%`}
              percentage={metrics.profileCompletion}
              color="blue"
            />
            <StatisticItem
              label="Academic Records"
              value={`${academicProgress}%`}
              percentage={academicProgress}
              color="green"
            />
            <StatisticItem
              label="Professional Profile"
              value={`${professionalProgress}%`}
              percentage={professionalProgress}
              color="purple"
            />
          </div>
        </ChartContainer>

        <ChartContainer title="Record Summary" subtitle="Total entries by category">
          <div className="space-y-5">
            <StatisticItem
              label="Academic"
              value={metrics.academics}
              percentage={Math.min(metrics.academics * 20, 100)}
              color="blue"
            />
            <StatisticItem
              label="Experience"
              value={metrics.experience}
              percentage={Math.min(metrics.experience * 25, 100)}
              color="green"
            />
            <StatisticItem
              label="Training"
              value={metrics.training}
              percentage={Math.min(metrics.training * 25, 100)}
              color="purple"
            />
            <StatisticItem
              label="Family"
              value={metrics.family}
              percentage={Math.min(metrics.family * 33, 100)}
              color="orange"
            />
          </div>
        </ChartContainer>

        <ChartContainer title="Quick Stats" subtitle="Profile insights">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Total Records</span>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {totalRecords}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <span className="text-sm font-medium text-green-900 dark:text-green-200">Completion Rate</span>
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                {metrics.profileCompletion}%
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <span className="text-sm font-medium text-purple-900 dark:text-purple-200">Profile Status</span>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                metrics.profileCompletion >= 80
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}>
                {metrics.profileCompletion >= 80 ? "Strong" : "In Progress"}
              </span>
            </div>
          </div>
        </ChartContainer>
      </div>

      <ActivityTable
        items={activityItems}
        title="Activity Summary"
        icon={<TrendingUp className="h-5 w-5" />}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-950 dark:text-white">Need Help?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Check your account information or contact the school administrator if your portal access needs attention.
          </p>
          <Link
            href="/teacher/settings"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-950 hover:text-slate-700 dark:text-white dark:hover:text-slate-300"
          >
            Review account settings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-950 dark:text-white">Profile Completion Tips</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Complete all sections of your profile to unlock additional features and insights.
          </p>
          <Link
            href="/teacher/profile"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-950 hover:text-slate-700 dark:text-white dark:hover:text-slate-300"
          >
            Complete profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
