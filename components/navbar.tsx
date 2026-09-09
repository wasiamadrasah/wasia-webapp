"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Globe,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useSafeSession } from "@/lib/hooks/use-safe-session"
import { useTheme } from "@/app/providers"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function formatRoleTitle(role?: string | null): string {
  if (!role) return "Admin"
  const clean = role.toLowerCase().trim()
  if (clean === "superadmin" || clean === "super_admin" || clean === "super admin") {
    return "Super Admin"
  }
  if (clean === "admin") {
    return "Admin"
  }
  return clean.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSafeSession()
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isAdminRoute = pathname?.startsWith("/admin") ?? false
  const accountHref = isAdminRoute ? "/admin/account" : "/account"
  const notificationsHref = isAdminRoute ? "/admin/communications/notifications" : "/communications/notifications"
  const settingsHref = isAdminRoute ? "/admin/iconfig" : "/iconfig"

  const user = {
    name: session?.user?.name || "Admin User",
    email: session?.user?.email || "admin@school.com",
    avatar: session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    role: formatRoleTitle(session?.user?.userRole || (session?.user as { role?: string })?.role),
  }

  const handleSignOut = () => {
    const isWorkspace = typeof window !== "undefined" && (window.location.hostname.startsWith("console.") || window.location.hostname.startsWith("workspace."))
    const callbackUrl = isWorkspace
      ? `${window.location.protocol}//${window.location.host}/login`
      : `${window.location.protocol}//${window.location.host}/admin/login`
    signOut({ callbackUrl })
  }

  return (
    <div className="flex items-center gap-2">
      {/* Quick Website Link */}
      <Button variant="ghost" size="icon" asChild title="Visit Public Website" className="h-9 w-9 text-muted-foreground hover:text-foreground">
        <Link href="/" target="_blank" rel="noreferrer">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Visit Website</span>
        </Link>
      </Button>

      {/* Theme Toggle Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer gap-2 text-xs font-medium">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer gap-2 text-xs font-medium">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer gap-2 text-xs font-medium">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Main User Avatar & Account Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full ring-2 ring-transparent transition hover:ring-[#4F46E5]/40 focus:ring-2 focus:ring-[#4F46E5]">
            <Avatar className="h-8 w-8 rounded-full border border-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl" sideOffset={8}>
          
          {/* User Profile Header */}
          <DropdownMenuLabel className="p-2 font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-full border border-border shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm rounded-full">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground leading-none">{user.name}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-1.5 flex items-center">
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary border border-primary/20">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Core Navigation Items */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer gap-2.5 rounded-lg text-xs py-2">
              <Link href={accountHref}>
                <User className="h-4 w-4 text-primary" />
                <span>My Profile & Account</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer gap-2.5 rounded-lg text-xs py-2">
              <Link href={notificationsHref}>
                <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer gap-2.5 rounded-lg text-xs py-2">
              <Link href={settingsHref}>
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Institute Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout Action */}
          <DropdownMenuItem
            onClick={handleSignOut}
            variant="destructive"
            className="cursor-pointer gap-2.5 rounded-lg text-xs py-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

