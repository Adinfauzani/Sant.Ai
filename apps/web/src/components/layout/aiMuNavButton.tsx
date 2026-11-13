"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";
import { TwinOrbit } from "@santai/ui/twinOrbit";

export default function AiMuNavButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    // Percakapan baru dibuat setelah pesan pertama, bukan saat dibuka.
    router.push("/chat");
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
      {loading ? <TwinOrbit className="size-4" /> : <Bot className="h-4 w-4" />}
    </button>
  );
}