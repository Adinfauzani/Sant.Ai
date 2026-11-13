"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/authClient";
import Link from "next/link";
import { Button } from "@santai/ui/button";
import { Input } from "@santai/ui/input";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import { joinProject, completeProject, addComment } from "@/lib/projects/actions";

export function JoinProjectButton({ projectId }: { projectId: string }) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleJoin() {
    if (!role) return;
    setLoading(true);
    try {
      await joinProject(projectId, role);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal gabung");
    }
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h4 className="text-xs font-semibold text-text">Gabung Proyek Ini</h4>
      <Input
        className="mt-2 text-xs"
        type="text"
        placeholder="Peranmu (mis. Frontend Dev)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <Button
        size="sm"
        className="mt-2 w-full"
        onClick={handleJoin}
        disabled={loading || !role}
      >
        {loading && <TwinOrbit className="size-4 text-current" />}{loading ? "Lagi gabung…" : "Gabung Proyek"}
      </Button>
    </div>
  );
}

export function CompleteProjectButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleComplete() {
    if (!confirm("Tandai proyek ini udah selesai?")) return;
    setLoading(true);
    try {
      await completeProject(projectId);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal");
    }
    setLoading(false);
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="w-full"
      onClick={handleComplete}
      disabled={loading}
    >
      {loading && <TwinOrbit className="size-4 text-current" />}{loading ? "Lagi diproses…" : "Tandai Selesai"}
    </Button>
  );
}

export function ProjectCommentForm({ projectId }: { projectId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const form = new FormData();
    form.set("content", content);
    form.set("projectId", projectId);
    try {
      await addComment(form);
      setContent("");
      router.refresh();
    } catch {
      // ignore
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        className="flex-1 text-xs"
        type="text"
        placeholder="Tulis komentar…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button type="submit" size="sm" disabled={loading || !content.trim()}>Kirim</Button>
    </form>
  );
}

export function ProjectComments({
  comments,
}: {
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user: { id: string; name: string; image: string | null };
  }>;
}) {
  return (
    <>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border border-border bg-surface p-3"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary">
              {comment.user.name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-text">{comment.user.name}</span>
            <span className="text-[10px] text-muted">
              {comment.createdAt.toLocaleDateString("id-ID")}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{comment.content}</p>
        </div>
      ))}
    </>
  );
}
