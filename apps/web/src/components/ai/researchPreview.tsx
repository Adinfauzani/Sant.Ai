"use client";

import { Activity, ExternalLink, FileSearch, FileText, Globe, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@santai/ui/dialog";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@santai/ui/trace";

const DEMO_SOURCES = [
  { title: "Ringkasan riset contoh", domain: "example.com", type: "Web" },
  { title: "Dokumen contoh (PDF)", domain: "example.org", type: "Dokumen" },
  { title: "Catatan analisis contoh", domain: "example.net", type: "Dokumen" },
];

/**
 * Pratinjau alur riset AI MU. Seluruh isinya data contoh yang diisolasi dari
 * percakapan nyata — tidak ada permintaan ke model atau backend.
 */
export function ResearchPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-surface hover:text-text"
        >
          <Activity className="size-3.5" />
          Lihat contoh aktivitas riset
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4 text-primary" />
            Aktivitas riset AI MU
          </DialogTitle>
          <DialogDescription>
            Contoh tampilan alur riset. Bukan hasil riset nyata dan tidak
            mengirim permintaan ke model.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-surface/40 px-3 py-2.5">
          <Trace>
            <TraceLine>
              <TraceIcon>
                <Search />
              </TraceIcon>
              <TraceTitle>Mencari informasi yang relevan</TraceTitle>
              <TraceDescription>6 sumber ditemukan</TraceDescription>
            </TraceLine>

            <TraceLine>
              <TraceIcon>
                <Globe />
              </TraceIcon>
              <TraceTitle>Memeriksa hasil web</TraceTitle>
              <TraceDescription>Tidak ada hasil yang relevan</TraceDescription>
            </TraceLine>

            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger status="running">
                <TraceIcon>
                  <FileSearch />
                </TraceIcon>
                <TraceTitle>Menganalisis dokumen</TraceTitle>
                <TraceDescription>18 sumber dari 6 dokumen</TraceDescription>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                Membaca bagian yang relevan, mencocokkan klaim, lalu menyusun
                ringkasan. Detail seperti ini hanya muncul saat pengguna
                membuka langkahnya.
              </TraceCollapsibleContent>
            </TraceCollapsible>

            <TraceLine status="pending">
              <TraceIcon>
                <FileText />
              </TraceIcon>
              <TraceTitle>Menyusun laporan akhir</TraceTitle>
              <TraceDescription>Menunggu analisis selesai</TraceDescription>
            </TraceLine>
          </Trace>
        </div>

        <div className="rounded-xl border border-border">
          <p className="border-b border-border px-3 py-2 text-[11.5px] font-medium text-text-secondary">
            Sumber · {DEMO_SOURCES.length}
          </p>
          <ul className="flex flex-col gap-0.5 p-1.5">
            {DEMO_SOURCES.map((source) => (
              <li key={source.title}>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-surface"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-medium text-text">
                      {source.title}
                    </span>
                    <span className="block truncate text-[10px] text-muted">
                      {source.type} · {source.domain}
                    </span>
                  </span>
                  <ExternalLink className="size-3 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[10.5px] leading-4 text-muted">
          Data contoh untuk demonstrasi antarmuka. Respons AI MU yang asli hanya
          menampilkan aktivitas dan sumber yang benar-benar teramati.
        </p>
      </DialogContent>
    </Dialog>
  );
}
