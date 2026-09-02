"use client";

import { type ReactNode } from "react";

type Variant =
  | "neural"
  | "blueprint"
  | "grid"
  | "dot-matrix"
  | "circuit"
  | "knowledge"
  | "timeline"
  | "molecular";

const variants: Record<Variant, { grid: string; radial: string }> = {
  neural: {
    grid: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
           linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
    radial: `radial-gradient(circle at 50% 50%, rgba(99,102,241,0.06), transparent 60%)`,
  },
  blueprint: {
    grid: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
           linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
    radial: `radial-gradient(circle at 20% 30%, rgba(6,182,212,0.05), transparent 50%)`,
  },
  grid: {
    grid: `linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px),
           linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)`,
    radial: `radial-gradient(circle at 80% 20%, rgba(99,102,241,0.04), transparent 50%)`,
  },
  "dot-matrix": {
    grid: `radial-gradient(circle, rgba(99,102,241,0.06) 1px, transparent 1px)`,
    radial: `radial-gradient(circle at 50% 50%, rgba(6,182,212,0.04), transparent 60%)`,
  },
  circuit: {
    grid: `linear-gradient(60deg, rgba(99,102,241,0.03) 25%, transparent 25%, transparent 75%, rgba(99,102,241,0.03) 75%),
           linear-gradient(60deg, rgba(99,102,241,0.03) 25%, transparent 25%, transparent 75%, rgba(99,102,241,0.03) 75%)`,
    radial: `radial-gradient(circle at 30% 70%, rgba(6,182,212,0.04), transparent 50%)`,
  },
  knowledge: {
    grid: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
           linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
    radial: `radial-gradient(circle at 70% 40%, rgba(99,102,241,0.05), transparent 50%)`,
  },
  timeline: {
    grid: `linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
    radial: `radial-gradient(circle at 50% 0%, rgba(6,182,212,0.04), transparent 60%)`,
  },
  molecular: {
    grid: `radial-gradient(circle at 20% 30%, rgba(99,102,241,0.05) 1px, transparent 1px),
           radial-gradient(circle at 80% 70%, rgba(6,182,212,0.05) 1px, transparent 1px)`,
    radial: `radial-gradient(circle at 50% 50%, rgba(99,102,241,0.04), transparent 60%)`,
  },
};

export function ScientificBackground({
  variant = "grid",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children?: ReactNode;
}) {
  const { grid, radial } = variants[variant];

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: grid, backgroundSize: "24px 24px" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: radial }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
