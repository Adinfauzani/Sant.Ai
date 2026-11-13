"use client";

import { useMemo, useState, type ComponentProps } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@santai/ui/collapsible";

function extractText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    return extractText((node as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}

export function CodeBlock({
  code,
  language,
  children,
  className,
  collapsible = false,
  defaultOpen = true,
  maxHeight,
  showLineNumbers = false,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  code?: string;
  language?: string;
  children?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  maxHeight?: number;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const text = useMemo(() => (code ?? extractText(children)).replace(/\n$/, ""), [code, children]);
  const lines = text.split("\n");
  const lang = (language ?? "").replace(/^language-/, "") || "text";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const body = (
    <div className="relative">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface/50 px-3 py-1.5 text-[11px]">
        <span className="font-mono text-muted">{lang}</span>
        <button
          type="button"
          onClick={() => void copy()}
          aria-label="Salin kode"
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-muted transition-colors hover:bg-surface hover:text-text"
        >
          {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
          <span>{copied ? "Tersalin" : "Salin"}</span>
        </button>
      </div>
      <div
        className="overflow-auto"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <pre className="m-0 p-3 font-mono text-xs leading-relaxed">
          {showLineNumbers ? (
            <code className="grid grid-cols-[auto_1fr] gap-x-3">
              {lines.map((line, i) => (
                <span key={i} className="contents">
                  <span className="select-none text-right text-muted">{i + 1}</span>
                  <span className="min-w-0 whitespace-pre-wrap break-words text-text">{line || " "}</span>
                </span>
              ))}
            </code>
          ) : (
            <code className="block whitespace-pre-wrap break-words text-text">{text || children}</code>
          )}
        </pre>
      </div>
    </div>
  );

  if (collapsible) {
    return (
      <Collapsible open={open} onOpenChange={setOpen} asChild>
        <div
          data-slot="code-block"
          data-language={lang}
          className={cn("my-2 overflow-hidden rounded-lg border border-border bg-card", className)}
          {...props}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] text-text-secondary hover:bg-surface/60">
            <span className="font-mono">{lang}</span>
            <ChevronDown className={cn("size-3.5 text-muted transition-transform", open && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t border-border data-[state=closed]:hidden">
            {body}
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <div
      data-slot="code-block"
      data-language={lang}
      className={cn("my-2 overflow-hidden rounded-lg border border-border bg-card", className)}
      {...props}
    >
      {body}
    </div>
  );
}

export function InlineCode({ className, ...props }: ComponentProps<"code">) {
  return (
    <code
      data-slot="inline-code"
      className={cn(
        "rounded bg-surface px-1 py-0.5 font-mono text-[0.85em] text-text",
        className,
      )}
      {...props}
    />
  );
}
