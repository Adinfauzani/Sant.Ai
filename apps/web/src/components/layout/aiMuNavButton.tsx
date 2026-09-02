"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Loader2 } from "lucide-react";
import { createAimChat } from "@/lib/aimuActions";

export default function AiMuNavButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await createAimChat();
      router.push(`/chat/${res.id}`);
    } catch {
      router.push("/chat?coba=1");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label="Chat AI MU"
      title="Chat AI MU"
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
    </button>
  );
}