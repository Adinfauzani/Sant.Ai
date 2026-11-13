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
    title: "Dasbor",
    url: "/dashboard",
    icon: LayoutDashboard as LucideIcon,
  },
  {
    title: "Papan Kerja",
    url: "/dashboard/boards",
    icon: Kanban as LucideIcon,
  },
  {
    title: "Data Intelligence",
    url: "#",
    icon: Globe as LucideIcon,
    items: [
      { title: "Ringkasan", url: "/dashboard/data-intelligence/overview", icon: Globe as LucideIcon },
      { title: "Literasi Digital", url: "/dashboard/data-intelligence/literasi", icon: BookOpen as LucideIcon },
      { title: "Keamanan Digital", url: "/dashboard/data-intelligence/keamanan", icon: Shield as LucideIcon },
      { title: "Isu Publik", url: "/dashboard/data-intelligence/isu-publik", icon: TrendingUp as LucideIcon },
    ],
  },
  {
    title: "Analitik",
    url: "#",
    icon: TrendingUp as LucideIcon,
    items: [
      { title: "Tren", url: "/dashboard/analytics/trends", icon: TrendingUp as LucideIcon },
      { title: "Sentimen", url: "/dashboard/analytics/sentiment", icon: Smile as LucideIcon },
      { title: "Kata Kunci", url: "/dashboard/analytics/keywords", icon: Hash as LucideIcon },
      { title: "Sumber", url: "/dashboard/analytics/sources", icon: Radio as LucideIcon },
    ],
  },
  {
    title: "Konten",
    url: "#",
    icon: FileText as LucideIcon,
    items: [
      { title: "Artikel", url: "/dashboard/content/articles", icon: FileText as LucideIcon },
      { title: "YouTube", url: "/dashboard/content/youtube", icon: Youtube as LucideIcon },
    ],
  },
]

const sudoNav: NavItem[] = [
  ...baseNav,
  {
    title: "Pusat Status",
    url: "#",
    icon: Activity as LucideIcon,
    items: [
      { title: "Ringkasan", url: "/dashboard/status", icon: Activity as LucideIcon },
      { title: "Monitor", url: "/dashboard/status/monitors", icon: Radio as LucideIcon },
      { title: "Insiden", url: "/dashboard/status/incidents", icon: AlertTriangle as LucideIcon },
      { title: "Pemeliharaan", url: "/dashboard/status/maintenance", icon: Wrench as LucideIcon },
      { title: "Notifikasi", url: "/dashboard/status/notifications", icon: Bell as LucideIcon },
      { title: "Analitik", url: "/dashboard/status/analytics", icon: BarChart as LucideIcon },
      { title: "Pengaturan", url: "/dashboard/status/settings", icon: Settings as LucideIcon },
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                  SA
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">Sant.Ai</span>
                  <span className="truncate text-xs text-muted group-data-[collapsible=icon]:hidden">
                    {role === "Sudo" || role === "sudo" ? "Dasbor Admin" : "Dashboard"}
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
          <SidebarGroupLabel>Papan Kerja</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/boards"}>
                  <Link href="/dashboard/boards">
                    <Kanban />
                    <span>Semua Papan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/boards">
                    <Plus />
                    <span>Papan Baru</span>
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
                <span className="group-data-[collapsible=icon]:hidden">Pengaturan Akun</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild>
              <Link href="#">
                <LifeBuoy />
                <span className="group-data-[collapsible=icon]:hidden">Bantuan</span>
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
