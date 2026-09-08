"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

const GIF_SRC = "/Model/aimu-idle.gif";

function playClickSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.04);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.13);
    setTimeout(() => ctx.close(), 200);
  } catch {
    /* AudioContext tidak tersedia */
  }
}

export default function AimuAnimatedFace({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const audioRef = useRef(playClickSound);

  return (
    <img
      src={GIF_SRC}
      alt="AI MU"
      draggable={false}
      onClick={() => {
        audioRef.current();
        onClick?.();
      }}
      className={cn(
        "pointer-events-auto h-full w-full rounded-full object-contain",
        className,
      )}
    />
  );
}