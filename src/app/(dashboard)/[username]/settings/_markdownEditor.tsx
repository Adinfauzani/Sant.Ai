"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Eye, Edit3, Upload, Save, Check, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import MarkdownToolbar from "./_mdToolbar";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

type SaveStatus = "saved" | "unsaved" | "saving";

const STORAGE_KEY = "sant-ai:md-tab";

export default function MarkdownEditor({ value, onChange }: Props) {
  const [tab, setTab] = useState<"edit" | "preview">(() => {
    if (typeof window === "undefined") return "edit";
    return (localStorage.getItem(STORAGE_KEY) as "edit" | "preview") || "edit";
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [dragging, setDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((val: string) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(val);
      if (next.length > 100) next.shift();
      return next;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 99));
  }, [historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  function handleUndo() {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    onChange(history[newIndex]);
  }

  function handleRedo() {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    onChange(history[newIndex]);
  }

  function handleChange(newVal: string) {
    onChange(newVal);
    setSaveStatus("unsaved");
  }

  function handleInsert(value: string, cursorOffset: number) {
    onChange(value);
    pushHistory(value);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (ta) {
        const pos = ta.selectionStart + cursorOffset;
        ta.focus();
        ta.setSelectionRange(pos, pos);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget;
    const isCtrl = e.ctrlKey || e.metaKey;

    if (isCtrl && e.key === "b") {
      e.preventDefault();
      wrapSelection(ta, "**", "**");
    } else if (isCtrl && e.key === "i") {
      e.preventDefault();
      wrapSelection(ta, "_", "_");
    } else if (isCtrl && e.key === "k") {
      e.preventDefault();
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      const link = selected ? "[" + selected + "](url)" : "[link](url)";
      handleInsert(text.substring(0, start) + link + text.substring(end), link.length - 1);
    } else if (isCtrl && e.shiftKey && e.key === "C") {
      e.preventDefault();
      const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
      const block = "```\n" + (selected || "code") + "\n```";
      handleInsert(text.substring(0, start) + block + text.substring(end), 4);
    } else if (isCtrl && e.shiftKey && e.key === "Z") {
      e.preventDefault();
      handleRedo();
    } else if (isCtrl && e.key === "z") {
      e.preventDefault();
      handleUndo();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const start = ta.selectionStart, val = ta.value;
      const spaces = e.shiftKey ? "" : "  ";
      const newVal = val.substring(0, start) + spaces + val.substring(ta.selectionEnd);
      handleInsert(newVal, spaces.length);
    }
  }

  function wrapSelection(ta: HTMLTextAreaElement, before: string, after: string) {
    const start = ta.selectionStart, end = ta.selectionEnd, text = ta.value, selected = text.substring(start, end);
    const wrapped = selected ? before + selected + after : before + after;
    handleInsert(text.substring(0, start) + wrapped + text.substring(end), before.length);
  }

  function handleTabChange(newTab: "edit" | "preview") {
    setTab(newTab);
    localStorage.setItem(STORAGE_KEY, newTab);
  }

  // Auto-save every 5s
  useEffect(() => {
    if (saveStatus !== "unsaved") return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      setSaveStatus("saving");
      setTimeout(() => setSaveStatus("saved"), 300);
    }, 5000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [value, saveStatus]);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(f.name));
    if (files.length === 0) return;
    for (const file of files) {
      uploadFile(file);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const items = Array.from(e.clipboardData.items);
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) uploadFile(file);
        return;
      }
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      uploadFile(file);
    }
    e.target.value = "";
  }

  function uploadFile(file: File) {
    const url = URL.createObjectURL(file);
    const ta = textareaRef.current;
    if (ta) {
      const img = `![${file.name}](${url})`;
      const start = ta.selectionStart, text = ta.value;
      handleInsert(text.substring(0, start) + img + text.substring(ta.selectionEnd), img.length);
    }
  }

  // Save on Ctrl+S
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setSaveStatus("saving");
        setTimeout(() => setSaveStatus("saved"), 300);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const chars = value.length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text">Profile README</label>

      <div
        className={cn(
          "rounded-xl border border-border bg-surface/5 transition-all",
          dragging && "border-primary border-dashed bg-primary/5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        {/* Tabs */}
        <div className="flex items-center gap-0.5 border-b border-border px-3 pt-2">
          <button
            type="button"
            onClick={() => handleTabChange("edit")}
            className={cn(
              "flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-xs font-medium transition-colors",
              tab === "edit" ? "bg-background text-text" : "text-muted hover:text-text",
            )}
          >
            <Edit3 className="h-3.5 w-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-xs font-medium transition-colors",
              tab === "preview" ? "bg-background text-text" : "text-muted hover:text-text",
            )}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <div className="ml-auto flex items-center gap-2 text-[10px]">
            {saveStatus === "saving" && <span className="flex items-center gap-1 text-muted"><Loader2 className="h-3 w-3 animate-spin" /> Saving...</span>}
            {saveStatus === "saved" && <span className="flex items-center gap-1 text-emerald-500"><Check className="h-3 w-3" /> Saved</span>}
            {saveStatus === "unsaved" && <span className="text-amber-500">Unsaved changes</span>}
          </div>
        </div>

        {/* Toolbar (edit mode only) */}
        {tab === "edit" && (
          <MarkdownToolbar
            textareaRef={textareaRef}
            onInsert={handleInsert}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        )}

        {/* Editor / Preview */}
        {tab === "edit" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { handleChange(e.target.value); pushHistory(e.target.value); }}
            onKeyDown={handleKeyDown}
            rows={12}
            placeholder={`Write your profile README using Markdown...

Introduce yourself.

Share your interests.

Showcase your projects.

Add links and images.

This README will appear on your public profile.`}
            className="w-full bg-background px-4 py-3 text-sm text-text outline-none placeholder:text-muted/30 resize-y min-h-[200px] font-mono leading-relaxed"
            aria-label="Profile README markdown editor"
          />
        ) : (
          <div className="github-readme min-h-[200px] px-4 py-3">
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                  img: ({ src, alt }) => <img src={src} alt={alt || ""} loading="lazy" />,
                  code: ({ className, children }) => {
                    const isInline = !className || className === "language-";
                    return isInline
                      ? <code>{children}</code>
                      : <code className={className}>{children}</code>;
                  },
                  pre: ({ children, className }) => <pre className={className}>{children}</pre>,
                  input: ({ type, checked }) => type === "checkbox" ? <input type="checkbox" checked={checked} readOnly /> : null,
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted/50 text-sm">Nothing to preview</p>
            )}
          </div>
        )}

        {/* Drop zone overlay */}
        {dragging && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-primary">
              <Upload className="h-8 w-8" />
              <p className="text-sm font-medium">Drop images here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted">
        <div className="flex items-center gap-2">
          <Upload className="h-3 w-3 shrink-0" />
          <span>Paste, drop, or </span>
          <label className="cursor-pointer text-primary hover:underline">
            click to upload
            <input type="file" accept="image/png,image/jpg,image/jpeg,image/svg+xml,image/gif,image/webp" multiple className="hidden" onChange={handleFileInput} />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <span>{chars.toLocaleString()} characters</span>
          <span className="text-border">|</span>
          <span>{words.toLocaleString()} words</span>
          <span className="text-border">|</span>
          <span>{readTime} min read</span>
        </div>
      </div>
    </div>
  );
}
