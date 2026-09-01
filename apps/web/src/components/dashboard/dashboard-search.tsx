"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
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
  Users,
  Newspaper,
  type LucideIcon,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@santai/ui/command"

interface SearchItem {
  title: string
  url: string
  icon: LucideIcon
  category: "Navigation" | "Content" | "Analytics" | "Settings" | "Users"
}

const allItems: SearchItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, category: "Navigation" },
  { title: "Data Intelligence Overview", url: "/dashboard/data-intelligence/overview", icon: Globe, category: "Navigation" },
  { title: "Literasi Digital", url: "/dashboard/data-intelligence/literasi", icon: BookOpen, category: "Navigation" },
  { title: "Keamanan Digital", url: "/dashboard/data-intelligence/keamanan", icon: Shield, category: "Navigation" },
  { title: "Isu Publik", url: "/dashboard/data-intelligence/isu-publik", icon: TrendingUp, category: "Navigation" },

  { title: "Articles", url: "/dashboard/content/articles", icon: Newspaper, category: "Content" },
  { title: "YouTube", url: "/dashboard/content/youtube", icon: Youtube, category: "Content" },

  { title: "Analytics Trends", url: "/dashboard/analytics/trends", icon: TrendingUp, category: "Analytics" },
  { title: "Sentiment Analysis", url: "/dashboard/analytics/sentiment", icon: Smile, category: "Analytics" },
  { title: "Keywords", url: "/dashboard/analytics/keywords", icon: Hash, category: "Analytics" },
  { title: "Sources", url: "/dashboard/analytics/sources", icon: Radio, category: "Analytics" },

  { title: "Account Settings", url: "/dashboard/account", icon: Settings, category: "Settings" },
  { title: "Article Settings", url: "/dashboard/content/articles", icon: FileText, category: "Settings" },
  { title: "YouTube Settings", url: "/dashboard/content/youtube", icon: Youtube, category: "Settings" },
]

const sudoItems: SearchItem[] = [
  { title: "Status Overview", url: "/dashboard/status", icon: Activity, category: "Navigation" },
  { title: "Monitors", url: "/dashboard/status/monitors", icon: Radio, category: "Navigation" },
  { title: "Incidents", url: "/dashboard/status/incidents", icon: AlertTriangle, category: "Navigation" },
  { title: "Maintenance", url: "/dashboard/status/maintenance", icon: Wrench, category: "Navigation" },
  { title: "Notifications", url: "/dashboard/status/notifications", icon: Bell, category: "Navigation" },
  { title: "Status Analytics", url: "/dashboard/status/analytics", icon: BarChart, category: "Analytics" },
  { title: "Status Settings", url: "/dashboard/status/settings", icon: Settings, category: "Settings" },

  { title: "User Management", url: "/dashboard/management/keywords", icon: Users, category: "Users" },
  { title: "Community Management", url: "/dashboard/management/sources", icon: Users, category: "Users" },
]

const categories = ["Navigation", "Content", "Analytics", "Settings", "Users"] as const

export function DashboardSearch({ role }: { role: string }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  const isSudo = role === "Sudo" || role === "sudo"
  const items = isSudo ? [...allItems, ...sudoItems] : allItems

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
      >
        <Search className="h-[18px] w-[18px] shrink-0" />
        <span className="flex-1 text-left">Search dashboard...</span>
        <kbd className="hidden rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-flex">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search dashboard..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {categories.map((category) => {
            const categoryItems = items.filter((item) => item.category === category)
            if (categoryItems.length === 0) return null
            return (
              <CommandGroup key={category} heading={category}>
                {categoryItems.map((item) => (
                  <CommandItem
                    key={item.url}
                    value={`${category} ${item.title}`}
                    onSelect={() => {
                      setOpen(false)
                      router.push(item.url)
                    }}
                  >
                    <item.icon className="h-[18px] w-[18px] text-muted-foreground" />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
