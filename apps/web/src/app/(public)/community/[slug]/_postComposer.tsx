"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { createPost } from "@/lib/community/communityActions";

export default function PostComposer({
  communityId,
}: {
  communityId: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (pending || !content.trim()) return;
    setPending(true);
    setError(null);
    try {
      const res = await createPost(communityId, content);
      if (!res.ok) {
        setError(res.error ?? "Something went wrong");
        return;
      }
      setContent("");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        rows={2}
        placeholder="Mulai diskusi atau bagikan update..."
        className="w-full resize-none bg-transparent text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] text-muted">{content.length}/500</p>
        <button
          onClick={handleSubmit}
          disabled={pending || !content.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" /> Post
        </button>
      </div>
      {error && <p className="mt-2 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}