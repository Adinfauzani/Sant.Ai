"use client";

import { Bold, Italic, Strikethrough, Code, Code2, Quote, Link, ImageIcon, List, ListOrdered, CheckSquare, Table, Minus, Heading1, Heading2, Heading3, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onInsert: (value: string, cursorOffset: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

type Tool = {
  label: string;
  icon: React.ElementType;
  action: (ta: HTMLTextAreaElement) => { value: string; cursorOffset: number };
  shortcut?: string;
};

const tools: Tool[] = [
  {
    label: "Heading",
    icon: Heading1,
    action: (ta) => {
      const start = ta.selectionStart;
      const val = ta.value;
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      return { value: val.substring(0, lineStart) + "### " + val.substring(lineStart), cursorOffset: 4 };
    },
  },
  {
    label: "Bold",
    icon: Bold,
    shortcut: "Ctrl+B",
    action: (ta) => {
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      return selected ? { value: text.substring(0, start) + "**" + selected + "**" + text.substring(end), cursorOffset: 0 } : { value: text.substring(0, start) + "****" + text.substring(end), cursorOffset: 2 };
    },
  },
  {
    label: "Italic",
    icon: Italic,
    shortcut: "Ctrl+I",
    action: (ta) => {
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      return selected ? { value: text.substring(0, start) + "_" + selected + "_" + text.substring(end), cursorOffset: 0 } : { value: text.substring(0, start) + "__" + text.substring(end), cursorOffset: 1 };
    },
  },
  {
    label: "Strikethrough",
    icon: Strikethrough,
    action: (ta) => {
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      return selected ? { value: text.substring(0, start) + "~~" + selected + "~~" + text.substring(end), cursorOffset: 0 } : { value: text.substring(0, start) + "~~~~" + text.substring(end), cursorOffset: 2 };
    },
  },
  {
    label: "Inline Code",
    icon: Code,
    action: (ta) => {
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      return selected ? { value: text.substring(0, start) + "`" + selected + "`" + text.substring(end), cursorOffset: 0 } : { value: text.substring(0, start) + "``" + text.substring(end), cursorOffset: 1 };
    },
  },
  {
    label: "Code Block",
    icon: Code2,
    shortcut: "Ctrl+Shift+C",
    action: (ta) => {
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      const block = "```\n" + selected + "\n```";
      const cursorOffset = selected ? 0 : 4;
      return { value: text.substring(0, start) + block + text.substring(end), cursorOffset };
    },
  },
  {
    label: "Quote",
    icon: Quote,
    action: (ta) => {
      const start = ta.selectionStart, val = ta.value;
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      return { value: val.substring(0, lineStart) + "> " + val.substring(lineStart), cursorOffset: 2 };
    },
  },
  {
    label: "Link",
    icon: Link,
    shortcut: "Ctrl+K",
    action: (ta) => {
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      const link = selected ? "[" + selected + "](url)" : "[link](url)";
      return { value: text.substring(0, start) + link + text.substring(end), cursorOffset: link.length - 1 };
    },
  },
  {
    label: "Image",
    icon: ImageIcon,
    action: (ta) => {
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      const img = selected ? "![" + selected + "](url)" : "![alt](url)";
      return { value: text.substring(0, start) + img + text.substring(end), cursorOffset: img.length - 1 };
    },
  },
  {
    label: "Bullet List",
    icon: List,
    action: (ta) => {
      const start = ta.selectionStart, val = ta.value;
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      return { value: val.substring(0, lineStart) + "- " + val.substring(lineStart), cursorOffset: 2 };
    },
  },
  {
    label: "Ordered List",
    icon: ListOrdered,
    action: (ta) => {
      const start = ta.selectionStart, val = ta.value;
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      return { value: val.substring(0, lineStart) + "1. " + val.substring(lineStart), cursorOffset: 3 };
    },
  },
  {
    label: "Task List",
    icon: CheckSquare,
    action: (ta) => {
      const start = ta.selectionStart, val = ta.value;
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      return { value: val.substring(0, lineStart) + "- [ ] " + val.substring(lineStart), cursorOffset: 6 };
    },
  },
  {
    label: "Table",
    icon: Table,
    action: (ta) => {
      const tbl = "\n| Header | Header |\n| ------ | ------ |\n| Cell | Cell |\n";
      const start = ta.selectionStart, text = ta.value;
      return { value: text.substring(0, start) + tbl + text.substring(ta.selectionEnd), cursorOffset: tbl.length };
    },
  },
  {
    label: "Horizontal Line",
    icon: Minus,
    action: (ta) => {
      const start = ta.selectionStart, text = ta.value;
      return { value: text.substring(0, start) + "\n---\n" + text.substring(ta.selectionEnd), cursorOffset: 5 };
    },
  },
];

export default function MarkdownToolbar({ textareaRef, onInsert, onUndo, onRedo, canUndo, canRedo }: Props) {
  const [showMore, setShowMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const primary = tools.slice(0, isMobile ? 5 : tools.length);
  const secondary = tools.slice(isMobile ? 5 : tools.length);

  function handleTool(tool: Tool) {
    const ta = textareaRef.current;
    if (!ta) return;
    const { value, cursorOffset } = tool.action(ta);
    onInsert(value, cursorOffset);
  }

  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-0.5 overflow-x-auto rounded-t-lg border border-border bg-surface/80 px-2 py-1.5 backdrop-blur"
      ref={scrollRef}
      role="toolbar"
      aria-label="Markdown formatting toolbar"
    >
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted hover:bg-surface hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Undo (Ctrl+Z)"
        title="Undo (Ctrl+Z)"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted hover:bg-surface hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Redo (Ctrl+Shift+Z)"
        title="Redo (Ctrl+Shift+Z)"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
      </button>

      <div className="mx-1 h-5 w-px bg-border" />

      {primary.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.label}
            type="button"
            onClick={() => handleTool(tool)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted hover:bg-surface hover:text-text transition-colors"
            aria-label={tool.label + (tool.shortcut ? ` (${tool.shortcut})` : "")}
            title={tool.label + (tool.shortcut ? ` (${tool.shortcut})` : "")}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}

      {secondary.length > 0 && (
        <>
          <div className="mx-1 h-5 w-px bg-border" />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-surface hover:text-text transition-colors"
              aria-label="More formatting options"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showMore && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
                <div className={cn("absolute z-50 flex flex-nowrap gap-0.5 rounded-lg border border-border bg-background p-1.5 shadow-lg", isMobile ? "right-0 top-full mt-1" : "left-full top-0 ml-1")}>
                  {secondary.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.label}
                        type="button"
                        onClick={() => { handleTool(tool); setShowMore(false); }}
                        className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-surface hover:text-text transition-colors"
                        aria-label={tool.label}
                        title={tool.label}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
