"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const LABELS = ["Science", "Data", "Technology", "Research", "Engineering"];

const INTERVAL = 2800;

export default function HeroLabel({
  interval = INTERVAL,
  className,
}: {
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLeaving(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LABELS.length);
        setLeaving(false);
      }, 450);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <span
      className={cn(
        "animated-border inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-[11px] sm:text-xs",
        className,
      )}
    >
      <span
        key={index}
        className={cn("truncate", leaving ? "label-fade-out" : "label-fade-in")}
      >
        {LABELS[index]}
      </span>
    </span>
  );
}