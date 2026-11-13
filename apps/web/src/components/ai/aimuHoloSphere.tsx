"use client";

import { cn } from "@/lib/utils";

/**
 * Orbe "holo" AI MU digambar dengan CSS saja — tanpa aset gambar eksternal,
 * sehingga greeting tetap utuh di fresh clone maupun di Vercel.
 */
export function AimuHoloSphere({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <span className="absolute -inset-6 rounded-full bg-primary/20 blur-2xl" />
      <span className="aimu-holo-sphere animate-aimu-float size-full" />
    </span>
  );
}
