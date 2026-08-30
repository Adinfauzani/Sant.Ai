"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinCommunity, leaveCommunity } from "@/lib/communityActions";

export default function MembershipButton({
  communitySlug,
  initialMember,
}: {
  communitySlug: string;
  initialMember: boolean;
}) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(initialMember);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const res = isMember
        ? await leaveCommunity(communitySlug)
        : await joinCommunity(communitySlug);
      if (!res.ok) {
        setError(res.error ?? "Something went wrong");
        return;
      }
      setIsMember(!isMember);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        onClick={handle}
        disabled={pending}
        className={`shrink-0 gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          isMember
            ? "border border-border bg-card text-text hover:bg-surface"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {pending ? "..." : isMember ? "Leave Community" : "Join Community"}
      </button>
      {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}