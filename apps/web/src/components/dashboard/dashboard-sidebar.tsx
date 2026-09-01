"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Globe,
  BookOpen,
  Shield,
  TrendingUp,
  Smile,
  Hash,
  Radio,
  FileText,
  Youtube,
  Activity,
  AlertTriangle,
  Bell,
  BarChart,
  Wrench,
  Settings,
  Kanban,
  Plus,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarRail,
} from "@santai/ui/sidebar"
import { DashboardNav, type NavItem } from "./dashboard-nav"
import { DashboardUser } from "./dashboard-user"

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    image?: string | null
  }
  role: string
}

const baseNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard as LucideIcon,
  },
  {
    title: "Boards",
    url: "/dashboard/boards",
    icon: Kanban as LucideIcon,
  },
  {
    title: "Data Intelligence",
    url: "#",
    icon: Globe as LucideIcon,
    items: [
      { title: "Overview", url: "/dashboard/data-intelligence/overview", icon: Globe as LucideIcon },
      { title: "Literasi Digital", url: "/dashboard/data-intelligence/literasi", icon: BookOpen as LucideIcon },
      { title: "Keamanan Digital", url: "/dashboard/data-intelligence/keamanan", icon: Shield as LucideIcon },
      { title: "Isu Publik", url: "/dashboard/data-intelligence/isu-publik", icon: TrendingUp as LucideIcon },
    ],
  },
  {
    title: "Analytics",
    url: "#",
    icon: TrendingUp as LucideIcon,
    items: [
      { title: "Trends", url: "/dashboard/analytics/trends", icon: TrendingUp as LucideIcon },
      { title: "Sentiment", url: "/dashboard/analytics/sentiment", icon: Smile as LucideIcon },
      { title: "Keywords", url: "/dashboard/analytics/keywords", icon: Hash as LucideIcon },
      { title: "Sources", url: "/dashboard/analytics/sources", icon: Radio as LucideIcon },
    ],
  },
  {
    title: "Content",
    url: "#",
    icon: FileText as LucideIcon,
    items: [
      { title: "Articles", url: "/dashboard/content/articles", icon: FileText as LucideIcon },
      { title: "YouTube", url: "/dashboard/content/youtube", icon: Youtube as LucideIcon },
    ],
  },
]

const sudoNav: NavItem[] = [
  ...baseNav,
  {
    title: "Status Center",
    url: "#",
    icon: Activity as LucideIcon,
    items: [
      { title: "Overview", url: "/dashboard/status", icon: Activity as LucideIcon },
      { title: "Monitors", url: "/dashboard/status/monitors", icon: Radio as LucideIcon },
      { title: "Incidents", url: "/dashboard/status/incidents", icon: AlertTriangle as LucideIcon },
      { title: "Maintenance", url: "/dashboard/status/maintenance", icon: Wrench as LucideIcon },
      { title: "Notifications", url: "/dashboard/status/notifications", icon: Bell as LucideIcon },
      { title: "Analytics", url: "/dashboard/status/analytics", icon: BarChart as LucideIcon },
      { title: "Settings", url: "/dashboard/status/settings", icon: Settings as LucideIcon },
    ],
  },
]

export function DashboardSidebar({ user, role, ...props }: DashboardSidebarProps) {
  const pathname = usePathname()
  const nav = role === "Sudo" || role === "sudo" ? sudoNav : baseNav

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                  SA
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">Sant.Ai</span>
                  <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    {role === "Sudo" || role === "sudo" ? "Admin Dashboard" : "Dashboard"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <DashboardNav items={nav} />

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Boards</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/boards"}>
                  <Link href="/dashboard/boards">
                    <Kanban />
                    <span>All Boards</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/boards">
                    <Plus />
                    <span>New Board</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild>
              <Link href="/dashboard/account">
                <Settings />
                <span className="group-data-[collapsible=icon]:hidden">Account Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild>
              <Link href="#">
                <LifeBuoy />
                <span className="group-data-[collapsible=icon]:hidden">Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <DashboardUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
