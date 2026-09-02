"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, Plus, LogOut, Settings, User, LayoutDashboard } from "lucide-react"

import { Button } from "@santai/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@santai/ui/avatar"
import { SearchDropdown } from "@/components/search-dropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu"
import { useSession, authClient } from "@/lib/authClient"
import { createAimChat } from "@/lib/aimuActions"

const ADMIN_ROLES = ["sudo", "admin", "moderator"]

export function ProfileHeaderClient({ username }: { username: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const user = session?.user
  const role = ((user as any)?.role ?? "").toLowerCase()
  const isAdmin = ADMIN_ROLES.includes(role)

  const handleAimStart = async () => {
    try {
      const res = await createAimChat()
      router.push(`/chat/${res.id}`)
    } catch {
      router.push("/chat?coba=1")
    }
  }

  return (
    <>
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Link href="/" className="group/logo flex size-8 items-center justify-center overflow-hidden rounded-md">
          <Image
            src="/assets/Sant.ai.png"
            alt="Sant.Ai"
            width={32}
            height={32}
            className="object-contain"
          />
        </Link>
        <span className="hidden max-w-[120px] truncate text-sm font-semibold md:inline">
          {username}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="hidden md:block max-w-sm">
          <SearchDropdown placeholder="Search..." />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg transition duration-150 hover:bg-accent" onClick={handleAimStart}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-robot-face">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
            <path d="M9 16c1 .667 2 1 3 1s2 -.333 3 -1" />
            <path d="M9 7l-1 -4" />
            <path d="M15 7l1 -4" />
            <path d="M9 12v-1" />
            <path d="M15 12v-1" />
          </svg>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg transition duration-150 hover:bg-accent [&>svg]:size-[18px]">
          <Bell />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg transition duration-150 hover:bg-accent [&>svg]:size-[18px]">
          <Plus />
        </Button>
        {user && (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="text-xs">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/${user.username || username}`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${user.username || username}/settings`} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {isAdmin && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={async () => {
                  await authClient.signOut()
                  router.push("/")
                  router.refresh()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  )
}
