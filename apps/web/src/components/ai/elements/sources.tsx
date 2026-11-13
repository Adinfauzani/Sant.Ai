"use client";

import { ExternalLink, Globe } from "lucide-react";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceTitle,
} from "./trace";

export interface ChatSource {
  url: string;
  title: string;
  domain: string;
  type: string;
}

/**
 * Ambil tautan yang benar-benar dikutip di jawaban AI. Blok kode dan inline
 * code diabaikan supaya contoh kode tidak muncul sebagai "sumber".
 */
export function extractSources(markdown: string, limit = 8): ChatSource[] {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ");

  const seen = new Set<string>();
  const sources: ChatSource[] = [];
  const re = /\[([^\]]{1,180})\]\((https?:\/\/[^\s)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(withoutCode)) !== null) {
    const url = match[2].replace(/[.,;:]+$/, "");
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const parsed = new URL(url);
      sources.push({
        url,
        title: match[1].trim() || parsed.hostname,
        domain: parsed.hostname.replace(/^www\./, ""),
        type: "Web",
      });
    } catch {
      // Tautan tidak valid: lewati.
    }
    if (sources.length >= limit) break;
  }

  return sources;
}

/** Sumber aktual yang diekstrak dari tautan jawaban, ditampilkan sebagai baris Trace. */
export function MessageSources({ sources }: { sources: ChatSource[] }) {
  if (sources.length === 0) return null;

  return (
    <div className="w-full max-w-[42rem]">
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger status="default">
            <TraceIcon>
              <Globe />
            </TraceIcon>
            <TraceTitle>Sumber</TraceTitle>
            <TraceDescription>
              {sources.length} tautan dari respons
            </TraceDescription>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <ul className="flex flex-col gap-1.5 py-0.5">
              {sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buka sumber: ${source.title}`}
                    className="group flex items-start gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-surface/60"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11.5px] font-medium text-text">
                        {source.title}
                      </span>
                      <span className="block truncate text-[10.5px] text-muted">
                        {source.domain}
                      </span>
                    </span>
                    <ExternalLink className="mt-0.5 size-3 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  );
}
