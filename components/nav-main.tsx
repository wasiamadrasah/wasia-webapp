"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"

type NavItem = {
  title: string
  url?: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
  isSection?: boolean
  items?: NavItem[]
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const pathname = usePathname()

  const findActiveTitle = (navItems: NavItem[], path: string | null) => {
    if (!path) return null
    for (const item of navItems) {
      const childItems = item.items ?? []
      const hasActiveChild = childItems.some(
        (sub) => sub.url && sub.url !== "#" && (path === sub.url || path.startsWith(sub.url + "/"))
      )
      if (hasActiveChild || (item.url && item.url !== "#" && (path === item.url || path.startsWith(item.url + "/")) && childItems.length > 0)) {
        return item.title
      }
    }
    return null
  }

  const [openItem, setOpenItem] = React.useState<string | null>(() => findActiveTitle(items, pathname))

  const prevPathnameRef = React.useRef(pathname)
  React.useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      const newActive = findActiveTitle(items, pathname)
      setOpenItem(newActive)
    }
  }, [pathname, items])

  const handleToggle = (title: string, isOpen: boolean) => {
    setOpenItem(isOpen ? title : null)
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <NavItemRenderer
            key={item.title}
            item={item}
            pathname={pathname}
            isOpen={openItem === item.title}
            onToggle={(isOpen) => handleToggle(item.title, isOpen)}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavItemRenderer({
  item,
  pathname,
  isOpen,
  onToggle,
}: {
  item: NavItem
  pathname: string
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}) {
  const { state, isMobile } = useSidebar()
  const childItems = item.items ?? []
  const isChildActive = childItems.some(
    (sub) => pathname === sub.url || (sub.url && sub.url !== "#" && pathname?.startsWith(sub.url + "/"))
  )
  const isItemActive = pathname === item.url || isChildActive

  if (childItems.length > 0) {
    if (state === "collapsed" && !isMobile) {
      return (
        <SidebarMenuItem key={item.title}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                isActive={isItemActive}
                className="cursor-pointer"
              >
                {item.icon && <item.icon className="size-4.5 group-data-[collapsible=icon]:size-5.5 shrink-0" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="center"
              sideOffset={14}
              className="min-w-52 bg-card border border-border shadow-md p-1.5 rounded-xl z-50 overflow-visible"
            >
              <DropdownMenuArrow className="fill-card stroke-border stroke-[1.5]" width={18} height={9} />
              <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-border" />
              {childItems.map((subItem) => {
                const isSubActive = pathname === subItem.url
                return (
                  <DropdownMenuItem
                    key={subItem.title}
                    asChild
                    className={cn(
                      "cursor-pointer rounded-lg px-2.5 py-2 text-sm font-medium transition-colors my-0.5",
                      isSubActive
                        ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted focus:bg-muted focus:text-foreground"
                    )}
                  >
                    <Link href={subItem.url || "#"}>
                      <span>{subItem.title}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      )
    }

    return (
      <Collapsible
        key={item.title}
        asChild
        open={isOpen}
        onOpenChange={onToggle}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isItemActive} tooltip={item.title}>
              {item.icon && <item.icon className="size-4.5 group-data-[collapsible=icon]:size-5.5 shrink-0" />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.25,1)] group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {childItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                    <Link href={subItem.url || "#"}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={isItemActive} tooltip={item.title}>
        <Link href={item.url || "#"}>
          {item.icon && <item.icon className="size-4.5 group-data-[collapsible=icon]:size-5.5 shrink-0" />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
