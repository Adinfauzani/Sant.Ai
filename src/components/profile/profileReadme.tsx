"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

interface Props {
  readme: string;
  readmeType: "text" | "markdown";
  isOwner?: boolean;
  onSave?: (readme: string, readmeType: "text" | "markdown") => Promise<void>;
}

export default function ProfileReadme({ readme, readmeType, isOwner, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(readme);
  const [mode, setMode] = useState<"text" | "markdown">(readmeType);
  const [saving, setSaving] = useState(false);

  if (!readme && !isOwner) return null;

  async function handleSave() {
    if (!onSave) return;
    setSaving(true);
    await onSave(content, mode);
    setSaving(false);
    setEditing(false);
  }

  function handleCancel() {
    setContent(readme);
    setMode(readmeType);
    setEditing(false);
  }

  if (editing && isOwner) {
    return (
      <div className="rounded-lg border border-border bg-surface/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={cn(
              "rounded px-2 py-1 text-[11px] font-medium transition-colors",
              mode === "text" ? "bg-primary text-white" : "text-muted hover:text-text",
            )}
          >
            Plain Text
          </button>
          <button
            type="button"
            onClick={() => setMode("markdown")}
            className={cn(
              "rounded px-2 py-1 text-[11px] font-medium transition-colors",
              mode === "markdown" ? "bg-primary text-white" : "text-muted hover:text-text",
            )}
          >
            Markdown
          </button>
          <span className="ml-auto text-[10px] text-muted">
            {mode === "markdown" ? "Supports **bold**, *italic*, `code`, links, and lists" : "Plain text only"}
          </span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            mode === "markdown"
              ? "Write your profile README using markdown..."
              : "Write a short bio about yourself..."
          }
          rows={6}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text outline-none placeholder:text-muted/50 focus:border-primary"
        />

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded px-3 py-1.5 text-[11px] text-muted hover:text-text transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-lg border border-border bg-surface/5 p-4">
      {isOwner && (
        <button
          type="button"
          onClick={() => {
            setContent(readme);
            setMode(readmeType);
            setEditing(true);
          }}
          className="absolute right-2 top-2 rounded px-2 py-1 text-[10px] text-muted opacity-0 hover:bg-surface hover:text-text transition-all group-hover:opacity-100"
        >
          Edit
        </button>
      )}
      {readmeType === "markdown" ? (
        <div className="github-readme">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
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
            {readme}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">{readme}</p>
      )}
    </div>
  );
}


