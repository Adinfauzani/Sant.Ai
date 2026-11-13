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
  category: "Navigasi" | "Konten" | "Analitik" | "Pengaturan" | "Pengguna"
}

const allItems: SearchItem[] = [
  { title: "Dasbor", url: "/dashboard", icon: LayoutDashboard, category: "Navigasi" },
  { title: "Ringkasan Data Intelligence", url: "/dashboard/data-intelligence/overview", icon: Globe, category: "Navigasi" },
  { title: "Literasi Digital", url: "/dashboard/data-intelligence/literasi", icon: BookOpen, category: "Navigasi" },
  { title: "Keamanan Digital", url: "/dashboard/data-intelligence/keamanan", icon: Shield, category: "Navigasi" },
  { title: "Isu Publik", url: "/dashboard/data-intelligence/isu-publik", icon: TrendingUp, category: "Navigasi" },

  { title: "Artikel", url: "/dashboard/content/articles", icon: Newspaper, category: "Konten" },
  { title: "YouTube", url: "/dashboard/content/youtube", icon: Youtube, category: "Konten" },

  { title: "Analitik Tren", url: "/dashboard/analytics/trends", icon: TrendingUp, category: "Analitik" },
  { title: "Analisis Sentimen", url: "/dashboard/analytics/sentiment", icon: Smile, category: "Analitik" },
  { title: "Kata Kunci", url: "/dashboard/analytics/keywords", icon: Hash, category: "Analitik" },
  { title: "Sumber", url: "/dashboard/analytics/sources", icon: Radio, category: "Analitik" },

  { title: "Pengaturan Akun", url: "/dashboard/account", icon: Settings, category: "Pengaturan" },
  { title: "Pengaturan Artikel", url: "/dashboard/content/articles", icon: FileText, category: "Pengaturan" },
  { title: "Pengaturan YouTube", url: "/dashboard/content/youtube", icon: Youtube, category: "Pengaturan" },
]

const sudoItems: SearchItem[] = [
  { title: "Ringkasan Status", url: "/dashboard/status", icon: Activity, category: "Navigasi" },
  { title: "Monitor", url: "/dashboard/status/monitors", icon: Radio, category: "Navigasi" },
  { title: "Insiden", url: "/dashboard/status/incidents", icon: AlertTriangle, category: "Navigasi" },
  { title: "Pemeliharaan", url: "/dashboard/status/maintenance", icon: Wrench, category: "Navigasi" },
  { title: "Notifikasi", url: "/dashboard/status/notifications", icon: Bell, category: "Navigasi" },
  { title: "Analitik Status", url: "/dashboard/status/analytics", icon: BarChart, category: "Analitik" },
  { title: "Pengaturan Status", url: "/dashboard/status/settings", icon: Settings, category: "Pengaturan" },

  { title: "Manajemen Pengguna", url: "/dashboard/management/keywords", icon: Users, category: "Pengguna" },
  { title: "Manajemen Komunitas", url: "/dashboard/management/sources", icon: Users, category: "Pengguna" },
]

const categories = ["Navigasi", "Konten", "Analitik", "Pengaturan", "Pengguna"] as const

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
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-text"
      >
        <Search className="h-[18px] w-[18px] shrink-0" />
        <span className="flex-1 text-left">Cari di dasbor...</span>
        <kbd className="hidden rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted md:inline-flex">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari di dasbor..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil.</CommandEmpty>
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
                    <item.icon className="h-[18px] w-[18px] text-muted" />
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
