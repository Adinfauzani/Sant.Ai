"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ChangeEvent, type ReactNode, type RefObject } from "react";
import {
  ChevronDown,
  Mic,
  Paperclip,
  Send,
  SlidersHorizontal,
  Square,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { VoicePanel } from "@/components/ai/voicePanel";
import { AttachmentChip, PromptInputShell, PromptInputTextarea } from "@/components/ai/elements";

export type PickedFile = { name: string; mime: string; base64: string };

const MODES = [
  { id: "standard", label: "Standar", hint: "Jawaban langsung" },
  { id: "reasoning", label: "Penalaran", hint: "Segera hadir" },
  { id: "image", label: "Buat Gambar", hint: "Segera hadir" },
  { id: "research", label: "Riset Mendalam", hint: "Segera hadir" },
  { id: "code", label: "Asisten Kode", hint: "Segera hadir" },
] as const;

const TOOL_BUTTON =
  "flex h-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-40";

function IconTip({
  label,
  children,
  side = "top",
}: {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Composer AI MU: textarea yang tumbuh otomatis, lampiran, pemilih mode
 * (hanya "Standar" yang aktif), dan pratinjau interaksi suara.
 */
export function ChatComposer({
  input,
  onInputChange,
  files,
  onFilesChange,
  editing,
  onCancelEdit,
  onSubmit,
  isBusy,
  onStop,
  guest,
  guestLocked,
  error,
  textareaRef,
}: {
  input: string;
  onInputChange: (value: string) => void;
  files: PickedFile[];
  onFilesChange: (files: PickedFile[]) => void;
  editing: boolean;
  onCancelEdit: () => void;
  onSubmit: () => void;
  isBusy: boolean;
  onStop: () => void;
  guest: boolean;
  guestLocked: boolean;
  error?: Error;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  }, [input, textareaRef]);

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    if (list.length === 0) return;
    void (async () => {
      const results: PickedFile[] = [];
      for (const file of list) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
        }
        results.push({
          name: file.name,
          mime: file.type || "application/octet-stream",
          base64: btoa(binary),
        });
      }
      onFilesChange([...files, ...results]);
    })();
    e.target.value = "";
  };

  if (guestLocked) {
    return (
      <div className="text-center">
        <p className="mb-3 text-xs text-muted">
          Penasaran lebih dalam? Login untuk lanjut menyimpan percakapanmu.
        </p>
        <Link
          href="/login?next=/chat"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Login untuk lanjut chat
        </Link>
      </div>
    );
  }

  if (voiceOpen) {
    return <VoicePanel onClose={() => setVoiceOpen(false)} />;
  }

  const hasInput = input.trim().length > 0 || files.length > 0;

  return (
    <TooltipProvider delayDuration={250}>
      <PromptInputShell
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {editing && (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-surface/70 px-2 py-1 text-xs text-text-secondary">
            <span className="truncate">
              Mengedit pesan — kirim ulang untuk menggantikan percakapan
              setelahnya.
            </span>
            <button
              type="button"
              onClick={onCancelEdit}
              aria-label="Batalkan edit"
              title="Batalkan edit"
              className="flex size-5 shrink-0 items-center justify-center rounded text-muted transition-colors hover:text-text"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        {files.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {files.map((file, index) => (
              <AttachmentChip
                key={`${file.name}-${index}`}
                name={file.name}
                onRemove={() => onFilesChange(files.filter((_, i) => i !== index))}
              />
            ))}
          </div>
        )}

        <PromptInputTextarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              if (e.nativeEvent.isComposing) return;
              e.preventDefault();
              onSubmit();
            }
            if (e.key === "Escape" && editing) {
              onCancelEdit();
            }
          }}
          placeholder={
            guest
              ? "Coba 1 pertanyaan tanpa login..."
              : "Tanyakan apapun untuk AI MU..."
          }
          aria-label="Pesan untuk AI MU"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-0.5">
            <IconTip label="Lampirkan file">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Lampirkan file"
                className={cn(TOOL_BUTTON, "size-8")}
              >
                <Paperclip className="size-4" />
              </button>
            </IconTip>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFiles}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Mode percakapan"
                  className="flex h-8 min-w-0 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text"
                >
                  <SlidersHorizontal className="size-3.5 shrink-0" />
                  <span className="truncate">Standar</span>
                  <ChevronDown className="size-3 shrink-0 text-muted" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
                  Mode
                </DropdownMenuLabel>
                {MODES.map((mode, index) => (
                  <Fragment key={mode.id}>
                    <DropdownMenuItem
                      disabled={mode.id !== "standard"}
                      className="text-xs"
                    >
                      <span className="flex flex-col">
                        <span>{mode.label}</span>
                        <span className="text-[10px] text-muted">
                          {mode.hint}
                        </span>
                      </span>
                      {mode.id === "standard" && (
                        <span className="ml-auto size-1.5 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                    {index === 0 && <DropdownMenuSeparator />}
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <IconTip label="Interaksi suara (pratinjau)">
              <button
                type="button"
                onClick={() => setVoiceOpen(true)}
                disabled={isBusy}
                aria-label="Interaksi suara (pratinjau)"
                className={cn(TOOL_BUTTON, "size-8")}
              >
                <Mic className="size-4" />
              </button>
            </IconTip>

            {isBusy ? (
              <IconTip label="Hentikan jawaban">
                <button
                  type="button"
                  onClick={onStop}
                  aria-label="Hentikan jawaban"
                  className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                  <Square className="size-3 fill-current" />
                </button>
              </IconTip>
            ) : (
              <IconTip label="Kirim">
                <button
                  type="submit"
                  disabled={!hasInput}
                  aria-label="Kirim"
                  className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Send className="size-3.5" />
                </button>
              </IconTip>
            )}
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive">{error.message}</p>
        )}
      </PromptInputShell>
    </TooltipProvider>
  );
}
