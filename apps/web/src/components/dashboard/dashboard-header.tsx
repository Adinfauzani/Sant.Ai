"use client"

import Link from "next/link"
import { Bell, Plus } from "lucide-react"
import { SidebarTrigger } from "@santai/ui/sidebar"
import { Button } from "@santai/ui/button"
import { DashboardSearch } from "./dashboard-search"

export function DashboardHeader({
  user,
  role,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null }
  role: string
}) {

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background/80 px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h2 className="text-sm font-semibold text-foreground">Dashboard</h2>
      </div>

      <div className="mx-auto hidden w-full max-w-[420px] md:block">
        <DashboardSearch role={role} />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
          <Plus className="h-[18px] w-[18px]" />
        </Button>

        <Link
          href="/dashboard/account"
          className="flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-2 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30"
        >
          {user.image ? (
            <img src={user.image} alt={user.name || ""} className="h-7 w-7 rounded-lg object-cover" />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </Link>

      </div>
    </header>
  )
}
