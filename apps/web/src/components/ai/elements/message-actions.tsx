"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  Copy,
  Ellipsis,
  Pencil,
  RefreshCw,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@santai/ui/tooltip";
import { cn } from "@/lib/utils";

/** Menyalin teks ke clipboard dengan umpan balik singkat. */
export async function copyText(
  text: string,
  label = "Disalin ke clipboard",
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
    return true;
  } catch {
    toast.error("Tidak bisa menyalin teks.");
    return false;
  }
}

/**
 * Berbagi teks lewat Web Share API. Percakapan AI MU bersifat privat dan
 * tidak punya tautan publik, jadi fallback-nya adalah menyalin teks.
 */
export async function shareText(text: string, title: string): Promise<void> {
  const nav = typeof navigator === "undefined" ? undefined : navigator;
  if (nav && typeof nav.share === "function") {
    try {
      await nav.share({ title, text });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
  }
  await copyText(text, "Teks disalin, bagikan secara manual");
}

function ActionButton({
  label,
  icon,
  onClick,
  active,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            aria-pressed={active}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-40",
              active &&
                "bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary",
            )}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MoreMenu({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={250}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={label}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <Ellipsis className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-60">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMessageActions({
  text,
  onEdit,
  onShare,
  onRetry,
  onDelete,
  disabled,
}: {
  text: string;
  onEdit: () => void;
  onShare: () => void;
  onRetry: () => void;
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      <ActionButton
        label="Salin pesan"
        icon={<Copy className="h-3.5 w-3.5" />}
        onClick={() => void copyText(text, "Pesan disalin")}
        disabled={disabled}
      />
      <ActionButton
        label="Edit pesan"
        icon={<Pencil className="h-3.5 w-3.5" />}
        onClick={onEdit}
        disabled={disabled}
      />
      <ActionButton
        label="Bagikan pesan"
        icon={<Share2 className="h-3.5 w-3.5" />}
        onClick={onShare}
        disabled={disabled}
      />
      <MoreMenu label="Tindakan lainnya">
        <DropdownMenuItem onSelect={onRetry} disabled={disabled}>
          <RefreshCw />
          Ulangi dari pesan ini
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onDelete}
          disabled={disabled}
          className="text-destructive focus:bg-destructive-soft focus:text-destructive"
        >
          <Trash2 />
          Hapus pesan dan balasan berikutnya
        </DropdownMenuItem>
      </MoreMenu>
    </div>
  );
}

export type MessageFeedback = "like" | "dislike";

export function AiMessageActions({
  text,
  markdown,
  feedback,
  onFeedback,
  onShare,
  onRegenerate,
  onEditPrompt,
  busy,
}: {
  text: string;
  markdown: string;
  feedback?: MessageFeedback;
  onFeedback: (value: MessageFeedback) => void;
  onShare: () => void;
  onRegenerate: () => void;
  onEditPrompt: () => void;
  busy?: boolean;
}) {
  return (
    <div className="flex items-center justify-start gap-0.5">
      <ActionButton
        label="Salin respons"
        icon={<Copy className="h-3.5 w-3.5" />}
        onClick={() => void copyText(text, "Respons disalin")}
      />
      <ActionButton
        label="Suka"
        icon={<ThumbsUp className="h-3.5 w-3.5" />}
        active={feedback === "like"}
        onClick={() => onFeedback("like")}
      />
      <ActionButton
        label="Tidak suka"
        icon={<ThumbsDown className="h-3.5 w-3.5" />}
        active={feedback === "dislike"}
        onClick={() => onFeedback("dislike")}
      />
      <ActionButton
        label="Bagikan respons"
        icon={<Share2 className="h-3.5 w-3.5" />}
        onClick={onShare}
      />
      <MoreMenu label="Tindakan lainnya">
        <DropdownMenuItem onSelect={onRegenerate} disabled={busy}>
          <RefreshCw />
          Regenerasi respons
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onEditPrompt} disabled={busy}>
          <Pencil />
          Edit prompt lalu kirim ulang
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => void copyText(markdown, "Markdown sumber disalin")}
        >
          <Copy />
          Salin markdown sumber
        </DropdownMenuItem>
      </MoreMenu>
    </div>
  );
}
