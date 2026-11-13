"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info, Loader2, Mic, Square, Volume2, X } from "lucide-react";
import { Wave } from "@/components/loading-ui/wave";
import { cn } from "@/lib/utils";

type VoiceState = "listening" | "processing" | "speaking" | "done";

const LABELS: Record<VoiceState, string> = {
  listening: "Mendengarkan...",
  processing: "Memproses suara...",
  speaking: "AI MU sedang berbicara...",
  done: "Pratinjau selesai",
};

const HINTS: Record<VoiceState, string> = {
  listening: "Ucapkan pertanyaanmu seperti biasa.",
  processing: "Menyiapkan transkrip pertanyaanmu.",
  speaking: "AI MU membacakan jawabannya.",
  done:
    "Alur antarmuka suara sudah dicoba. Transkripsi dan suara belum tersambung pada tahap ini.",
};

const ACTION_LABELS: Record<VoiceState, string> = {
  listening: "Batal",
  processing: "Batalkan",
  speaking: "Hentikan",
  done: "Tutup",
};

/**
 * Pratinjau antarmuka suara AI MU. Seluruh transisi di sini adalah state
 * frontend untuk memvalidasi desain — tidak ada mikrofon atau text-to-speech
 * yang benar-benar dijalankan, dan panel menandainya secara eksplisit.
 */
export function VoicePanel({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<VoiceState>("listening");

  useEffect(() => {
    if (state === "done") return;
    const next: Record<Exclude<VoiceState, "done">, [VoiceState, number]> = {
      listening: ["processing", 4200],
      processing: ["speaking", 2400],
      speaking: ["done", 4200],
    };
    const [target, delay] = next[state];
    const timer = window.setTimeout(() => setState(target), delay);
    return () => window.clearTimeout(timer);
  }, [state]);

  const active = state === "listening" || state === "speaking";

  return (
    <section
      aria-label="Interaksi suara AI MU"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-warning-border bg-warning-soft px-1.5 py-0.5 text-[10px] font-medium text-warning">
          <Info className="size-3" />
          Pratinjau UI
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup interaksi suara"
          title="Tutup"
          className="flex size-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-text"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div
        aria-live="polite"
        className="flex flex-col items-center gap-2 py-1 text-center"
      >
        <div
          className={cn(
            "flex h-12 items-center",
            state === "listening" && "text-primary",
            state === "speaking" && "text-brand",
            state === "processing" && "text-muted",
            state === "done" && "text-success",
          )}
        >
          {active ? (
            <Wave className="h-10 w-28" />
          ) : state === "processing" ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <CheckCircle2 className="size-6" />
          )}
        </div>

        <p className="flex items-center gap-1.5 text-sm font-medium text-text">
          {state === "listening" && <Mic className="size-3.5 text-primary" />}
          {state === "speaking" && (
            <Volume2 className="size-3.5 text-brand" />
          )}
          {LABELS[state]}
        </p>
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          {HINTS[state]}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text"
        >
          {state === "done" ? (
            "Tutup"
          ) : (
            <>
              <Square className="size-3 fill-current" />
              {ACTION_LABELS[state]}
            </>
          )}
        </button>
      </div>

      <p className="text-center text-[10px] leading-4 text-muted">
        Mikrofon dan suara belum tersambung. Tombol ini hanya mempratinjau
        tampilan interaksi suara.
      </p>
    </section>
  );
}
