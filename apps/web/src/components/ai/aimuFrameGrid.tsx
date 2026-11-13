"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const BASE = "/Model/V2";

export default function AimuFrameGrid({ frames }: { frames: string[] }) {
  const [selected, setSelected] = useState(frames[0] ?? "ModelSleep");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center rounded-xl bg-white/5 p-6">
        <img
          src={`${BASE}/${selected}.webp`}
          alt={selected}
          draggable={false}
          className="h-40 w-40 rounded-2xl object-contain"
        />
      </div>
      <div className="grid grid-cols-5 gap-3">
        {frames.map((f) => (
          <button
            key={f}
            onClick={() => setSelected(f)}
            className={cn(
              "group flex flex-col items-center gap-1 rounded-lg border p-2 transition",
              selected === f
                ? "border-border bg-primary/10"
                : "border-white/10 bg-white/5 hover:bg-white/10",
            )}
          >
            <img
              src={`${BASE}/${f}.webp`}
              alt={f}
              draggable={false}
              className="h-14 w-14 object-contain"
            />
            <span className="text-[10px] text-white/50">
              {f.replace("Model", "")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
