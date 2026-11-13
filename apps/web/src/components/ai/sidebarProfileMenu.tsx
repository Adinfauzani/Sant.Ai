"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronsUpDown,
  Gauge,
  Loader2,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@santai/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@santai/ui/tooltip";
import { cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/profile/gravatar";
import { signOut } from "@/lib/auth/authClient";
import { useTheme } from "@/components/shared/themeProvider";
import { getAimUsage, type AimUsage } from "@/lib/ai/aimuActions";
import {
  AIMU_MENU_ITEM,
  AIMU_MENU_SURFACE,
} from "@/components/ai/sidebarTypes";

const MENU_SURFACE = `w-60 ${AIMU_MENU_SURFACE}`;
const MENU_ITEM = AIMU_MENU_ITEM;

function UsageDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [usage, setUsage] = useState<AimUsage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    getAimUsage()
      .then((value) => {
        if (active) setUsage(value);
      })
      .catch(() => {
        if (active) setUsage(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  const stats: Array<{ label: string; value: number | undefined }> = [
    { label: "Percakapan", value: usage?.chats },
    { label: "Pesan", value: usage?.messages },
    { label: "Disematkan", value: usage?.pinned },
    { label: "Diarsipkan", value: usage?.archived },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Penggunaan &amp; Batas</DialogTitle>
          <DialogDescription>
            Ringkasan aktivitas AI MU di akunmu saat ini.
          </DialogDescription>
        </DialogHeader>

        {loading && !usage ? (
          <div className="flex items-center gap-2 py-4 text-xs text-muted">
            <Loader2 className="size-3.5 animate-spin" />
            Memuat ringkasan…
          </div>
        ) : usage ? (
          <dl className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface/60 px-3 py-2.5"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 text-lg font-extrabold tabular-nums text-text">
                  {stat.value ?? 0}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="py-4 text-xs text-muted">
            Ringkasan belum bisa dimuat. Coba lagi nanti.
          </p>
        )}

        <p className="text-[11px] leading-relaxed text-muted">
          Kuota dan batas paket akan tampil di sini saat tersedia. Untuk
          sekarang, semua percakapan tersimpan di akunmu.
        </p>
      </DialogContent>
    </Dialog>
  );
}

export function SidebarProfileMenu({
  collapsed,
  name,
  email,
  username,
}: {
  collapsed: boolean;
  name: string;
  email: string;
  username?: string;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [usageOpen, setUsageOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const avatarUrl = email ? getAvatarUrl(email, 64) : null;
  const initial = name.charAt(0).toUpperCase() || "U";
  const settingsHref = username ? `/${username}/settings` : "/profile";

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const trigger = (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-aimu-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aimu-accent/60",
        collapsed && "justify-center px-0",
      )}
      aria-label="Menu akun"
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-aimu-border"
        />
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aimu-accent-soft text-[11px] font-bold text-aimu-accent">
          {initial}
        </span>
      )}
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-semibold text-aimu-text">
              {name}
            </span>
            <span className="block truncate text-[10.5px] text-aimu-muted">
              {email}
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-aimu-muted" />
        </>
      )}
    </button>
  );

  return (
    <>
      <DropdownMenu>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">{name}</TooltipContent>
          </Tooltip>
        ) : (
          <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        )}

        <DropdownMenuContent
          side="right"
          align="end"
          sideOffset={8}
          className={MENU_SURFACE}
        >
          <DropdownMenuLabel className="min-w-0">
            <span className="block truncate text-[12px] font-semibold text-aimu-text">
              {name}
            </span>
            <span className="block truncate text-[10.5px] font-normal text-aimu-muted">
              {email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-aimu-border" />

          <DropdownMenuItem asChild className={MENU_ITEM}>
            <Link href={username ? `/${username}` : "/profile"}>
              <User className="size-3.5" />
              Profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={MENU_ITEM}>
            <Link href={settingsHref}>
              <Settings className="size-3.5" />
              Pengaturan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={MENU_ITEM}
            onSelect={() => setUsageOpen(true)}
          >
            <Gauge className="size-3.5" />
            Penggunaan &amp; Batas
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className={MENU_ITEM}>
              <Sun className="size-3.5" />
              Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className={MENU_SURFACE}>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as "light" | "dark")}
              >
                <DropdownMenuRadioItem value="light" className={MENU_ITEM}>
                  <Sun className="size-3.5" />
                  Terang
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className={MENU_ITEM}>
                  <Moon className="size-3.5" />
                  Gelap
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-aimu-border" />
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-[12.5px] text-red-400 focus:bg-red-500/10 focus:text-red-300"
            disabled={signingOut}
            onSelect={() => void handleSignOut()}
          >
            {signingOut ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <LogOut className="size-3.5" />
            )}
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UsageDialog open={usageOpen} onOpenChange={setUsageOpen} />
    </>
  );
}
