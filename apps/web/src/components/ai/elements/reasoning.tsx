"use client";

import { CheckCircle2, FileText, LoaderCircle, Sparkles } from "lucide-react";
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
  type TraceLineStatus,
} from "./trace";

export type TracePhase = "waiting" | "streaming" | "done";

/**
 * Adapter aktivitas AI yang dapat diamati (bukan penalaran internal):
 * - Membaca lampiran (jika pengguna mengirim lampiran)
 * - Menyiapkan/menghasilkan respons (berdasarkan status stream nyata)
 * - Selesai / gagal
 */
export function MessageTrace({
  files,
  phase,
  failed = false,
}: {
  files: Array<{ name?: string }>;
  phase: TracePhase;
  failed?: boolean;
}) {
  const names =
    files
      .map((file) => file.name?.trim())
      .filter(Boolean)
      .join(", ") || `${files.length} lampiran`;

  const showDone = phase === "done" && (failed || files.length > 0);
  const showProgress = phase !== "done";
  if (!showDone && !showProgress) return null;

  const generateStatus: TraceLineStatus = failed
    ? "error"
    : phase === "done"
      ? "default"
      : "running";

  return (
    <div className="w-full max-w-[42rem] rounded-lg border border-border/60 bg-surface/30 px-3 py-2">
      <Trace>
        {files.length > 0 ? (
          <TraceLine status="default">
            <TraceIcon>
              <FileText />
            </TraceIcon>
            <TraceTitle>Membaca lampiran</TraceTitle>
            <TraceDescription className="truncate">{names}</TraceDescription>
          </TraceLine>
        ) : null}

        <TraceLine status={generateStatus}>
          <TraceIcon>
            {failed ? <Sparkles /> : phase === "done" ? <CheckCircle2 /> : <LoaderCircle />}
          </TraceIcon>
          <TraceTitle>
            {failed
              ? "Gagal memproses permintaan"
              : phase === "waiting"
                ? "Menyiapkan respons"
                : phase === "streaming"
                  ? "Menghasilkan respons"
                  : "Respons selesai"}
          </TraceTitle>
          <TraceDescription>
            {failed
              ? "Terjadi kesalahan saat menghasilkan respons"
              : phase === "waiting"
                ? "Memproses permintaan"
                : phase === "streaming"
                  ? "Jawaban sedang ditulis"
                  : "Aktivitas selesai"}
          </TraceDescription>
        </TraceLine>
      </Trace>
    </div>
  );
}
