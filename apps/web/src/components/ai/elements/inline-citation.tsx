"use client";

import type { ComponentProps, ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@santai/ui/hoverCard";

export type InlineCitationSource = {
  id?: string;
  title: string;
  url?: string;
  description?: string;
};

export function InlineCitation({
  index,
  source,
  className,
}: {
  index: number;
  source: InlineCitationSource;
  className?: string;
}) {
  const label = `[${index}]`;
  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer noopener"
            data-slot="inline-citation"
            className={cn(
              "inline-flex align-super text-[10px] font-semibold text-primary hover:underline",
              className,
            )}
          >
            {label}
          </a>
        ) : (
          <button
            type="button"
            data-slot="inline-citation"
            className={cn(
              "inline-flex align-super text-[10px] font-semibold text-primary",
              className,
            )}
          >
            {label}
          </button>
        )}
      </HoverCardTrigger>
      <HoverCardContent className="w-72 text-xs" align="start">
        <div className="font-medium text-text">{source.title}</div>
        {source.description ? (
          <p className="mt-1 leading-relaxed text-muted">{source.description}</p>
        ) : null}
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-flex items-center gap-1 text-primary hover:underline"
          >
            Buka sumber <ExternalLink className="size-3" />
          </a>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}

export function InlineCitationList({
  sources,
  className,
  ...props
}: ComponentProps<"ol"> & { sources: InlineCitationSource[] }) {
  if (!sources.length) return null;
  return (
    <ol
      data-slot="inline-citation-list"
      className={cn("mt-2 space-y-1 text-xs text-muted", className)}
      {...props}
    >
      {sources.map((s, i) => (
        <li key={s.id ?? `${s.title}-${i}`} className="flex gap-2">
          <span className="shrink-0 font-semibold text-primary">[{i + 1}]</span>
          <span className="min-w-0">
            {s.url ? (
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="hover:text-text hover:underline">
                {s.title}
              </a>
            ) : (
              s.title
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
