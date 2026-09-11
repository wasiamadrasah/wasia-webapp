"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSafeSession } from "@/lib/hooks/use-safe-session"
import {
  IconChartBar,
  IconDashboard,
  IconFileWord,
  IconFolder,
  IconReport,
  IconSettings,
  IconUsers,
  IconBolt,
  IconUser,
  IconUserStar,
  IconFileText,
  IconBell,
  IconUserCheck,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@school.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "My Profile",
      url: "/admin/account",
      icon: IconUser,
    },
    {
      title: "Website Configuration",
      url: "/admin/web-config",
      icon: IconBolt,
      items: [
        {
          title: "Homepage Settings",
          url: "/admin/web-config/homepage",
        },
        {
          title: "Theme & Appearance",
          url: "/admin/web-config/theme",
        },
      ],
    },
    {
      title: "Frontend Content",
      url: "/admin/notices",
      icon: IconFolder,
      items: [
        {
          title: "Events",
          url: "/admin/events",
        },
        {
          title: "Notices",
          url: "/admin/notices",
        },
        {
          title: "News",
          url: "/admin/news",
        },
        {
          title: "Blogs",
          url: "/admin/blogs",
        },
        {
          title: "Photo Gallery",
          url: "/admin/photo-gallery",
        },
        {
          title: "Video Gallery",
          url: "/admin/video-gallery",
        },
        {
          title: "Downloads",
          url: "/admin/downloads",
        }
      ],
    },
    {
      title: "Pages",
      url: "/admin/pages",
      icon: IconFileText,
      items: [
        {
          title: "Governing Body",
          url: "/admin/pages/governing-body",
        },
        {
          title: "About",
          url: "/admin/pages/about",
        },
        {
          title: "History",
          url: "/admin/pages/history",
        },
        {
          title: "Admission",
          url: "/admin/pages/admission",
        },
        {
          title: "Results",
          url: "/admin/pages/results",
        },
        {
          title: "Performance Metrics",
          url: "/admin/pages/performance-metrics",
        },
      ],
    },
    {
      title: "Students",
      url: "/admin/students",
      icon: IconUsers,
      items: [
        {
          title: "Student Management",
          url: "/admin/students",
        },
        {
          title: "Enrollment History",
          url: "/admin/students/enrollments",
        },
        {
          title: "Quick Student Add",
          url: "/admin/students/quick-add",
        },
        {
          title: "Full Admission",
          url: "/admin/students/admit",
        },
        {
          title: "Bulk Import",
          url: "/admin/students/import",
        },
        {
          title: "Admission Applications",
          url: "/admin/students/applications",
        },
        {
          title: "Student Settings",
          url: "/admin/students/settings",
        },
      ],
    },
    {
      title: "Human Resources",
      url: "/admin/employees",
      icon: IconUserStar,
      items: [
        {
          title: "Employees",
          url: "/admin/employees",
        },
        {
          title: "Employee Attendance",
          url: "/admin/employee-attendance",
        },
        {
          title: "Employee Leave",
          url: "/admin/employee-leave",
        },
      ],
    },
    {
      title: "Academics",
      url: "/admin/academics",
      icon: IconReport,
      items: [
        {
          title: "Sessions",
          url: "/admin/academics/sessions",
        },
        {
          title: "Versions",
          url: "/admin/academics/versions",
        },
        {
          title: "Shifts",
          url: "/admin/academics/shifts",
        },
        {
          title: "Classes",
          url: "/admin/academics/classes",
        },
        {
          title: "Sections",
          url: "/admin/academics/sections",
        },
        {
          title: "Department/Groups",
          url: "/admin/academics/groups",
        },
        {
          title: "Class Setup",
          url: "/admin/academics/class-setup",
        },
        {
          title: "Subjects",
          url: "/admin/academics/subjects",
        },
        {
          title: "Teacher Assign",
          url: "/admin/academics/teacher-assign",
        },
        {
          title: "Classroom Management",
          url: "/admin/academics/classroom-management",
        },
      ],
    },
    {
      title: "Exam Management",
      url: "/admin/exam-management",
      icon: IconChartBar,
      items: [
        {
          title: "Examinations",
          url: "/admin/exam-management/examinations",
        },
        {
          title: "Exam Schedules",
          url: "/admin/exam-management/schedules",
        },
        {
          title: "Exam Attendance",
          url: "/admin/exam-management/attendance",
        },
        {
          title: "Grade Management",
          url: "/admin/exam-management/grades",
        },
        {
          title: "Exam Settings",
          url: "/admin/exam-management/settings",
        },
      ],
    },
    {
      title: "Certificates",
      url: "/admin/certificates",
      icon: IconFileWord,
      items: [
        {
          title: "Testimonials",
          url: "/admin/certificates/testimonials",
        },
        {
          title: "Transfer Certificates",
          url: "/admin/certificates/transfer",
        },
      ],
    },
    {
      title: "Quick Communications",
      url: "/admin/communications",
      icon: IconBell,
      items: [
        {
          title: "Notifications",
          url: "/admin/communications/notifications",
        },
        {
          title: "Direct Messaging",
          url: "/admin/communications/direct-messaging",
        },
        {
          title: "Email",
          url: "/admin/communications/email",
        },
        {
          title: "SMS",
          url: "/admin/communications/sms",
        }
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUserCheck,
    },
    {
      title: "Settings",
      url: "/admin/iconfig",
      icon: IconSettings,
      items: [
        {
          title: "Account Settings",
          url: "/admin/account",
        },
        {
          title: "Institute Settings",
          url: "/admin/iconfig",
        },
        {
          title: "System Setting",
          url: "/admin/settings/system",
        },
        {
          title: "ID Generation",
          url: "/admin/settings/id-generation",
        },
        {
          title: "Online Admission Setting",
          url: "/admin/settings/online-admission",
        },
        {
          title: "Notification Setting",
          url: "/admin/settings/notifications",
        },
        {
          title: "WhatsApp Messaging",
          url: "/admin/settings/whatsapp",
        },
        {
          title: "SMS Setting",
          url: "/admin/settings/sms",
        },
        {
          title: "Email Setting",
          url: "/admin/settings/email",
        },
        {
          title: "Payment Methods",
          url: "/admin/settings/payment-methods",
        },
        {
          title: "Front CMS Setting",
          url: "/admin/settings/front-cms",
        },
        {
          title: "Roles & Permissions",
          url: "/admin/settings/roles-permissions",
        },
        {
          title: "Backup & Restore",
          url: "/admin/settings/backup-restore",
        },
        {
          title: "Languages",
          url: "/admin/settings/languages",
        },
        {
          title: "Activity Logs",
          url: "/admin/activity-logs",
        },
      ],
    },
  ],
  documents: [],
}

export function AppSidebar({
  userSession,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userSession?: { name?: string | null; email?: string | null; image?: string | null } | null
}) {
  const sessionRes = useSafeSession()
  const clientUser = sessionRes?.data?.user

  const activeUser = userSession || clientUser

  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin") ?? false
  const dashboardHref = isAdminRoute ? "/admin/dashboard" : "/dashboard"

  const formatUrl = React.useCallback((url: string) => {
    if (!isAdminRoute && url.startsWith("/admin")) {
      return url.replace(/^\/admin/, "") || "/"
    }
    return url
  }, [isAdminRoute])

  const navMain = React.useMemo(() => {
    return data.navMain.map(item => {
      const itemCopy = { ...item, url: formatUrl(item.url || "") }
      if ('items' in item && Array.isArray(item.items)) {
        return {
          ...itemCopy,
          items: item.items.map((subItem: { title: string; url: string }) => ({
            ...subItem,
            url: formatUrl(subItem.url)
          }))
        }
      }
      return itemCopy
    })
  }, [formatUrl])

  const userData = {
    name: activeUser?.name || "Admin User",
    email: activeUser?.email || "admin@school.com",
    avatar: activeUser?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 px-4 group-data-[collapsible=icon]:px-0 py-0 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center shrink-0 border-b border-sidebar-border">
        <a href={dashboardHref} className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center">
          <div className="size-9 group-data-[collapsible=icon]:size-10.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-1 flex items-center justify-center shrink-0 shadow-xs transition-all">
            <Image
              src="/images/system/icon.png"
              alt="DigiCampus"
              width={32}
              height={32}
              className="size-7 group-data-[collapsible=icon]:size-8 object-contain"
            />
          </div>
          <div className="flex items-center gap-1.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              DigiCampus
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              v2.0
            </span>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
