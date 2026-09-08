"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerForEvent, unregisterFromEvent } from "@/lib/eventActions";

export default function RegisterButton({
  eventSlug,
  status,
  maxParticipants,
  registeredCount,
  initialRegistered,
}: {
  eventSlug: string;
  status: string;
  maxParticipants: number;
  registeredCount: number;
  initialRegistered: boolean;
}) {
  const router = useRouter();
  const [registered, setRegistered] = useState(initialRegistered);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusDisabled = status === "Closed" || (maxParticipants > 0 && registeredCount >= maxParticipants) || pending;

  async function handle() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const res = registered
        ? await unregisterFromEvent(eventSlug)
        : await registerForEvent(eventSlug);
      if (!res.ok) {
        setError(res.error ?? "Something went wrong");
        return;
      }
      setRegistered(res.registered ?? false);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  }

  const label = pending
    ? "..."
    : status === "Closed"
      ? "Registrasi Ditutup"
      : maxParticipants > 0 && registeredCount >= maxParticipants
        ? "Event Penuh"
        : registered
          ? "Terdaftar, Batalkan"
          : "Register Now";

  return (
    <div>
      <button
        onClick={handle}
        disabled={statusDisabled}
        className={`gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
          registered
            ? "border border-border bg-card text-text hover:bg-surface"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {label}
      </button>
      {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}