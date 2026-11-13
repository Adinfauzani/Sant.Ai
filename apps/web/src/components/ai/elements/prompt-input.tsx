"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Primitive composer surface (presentational). Wiring/state lives in chatComposer.tsx. */
export function PromptInputShell({ className, ...props }: ComponentProps<"form">) {
  return (
    <form
      className={cn(
        "flex flex-col gap-1 rounded-2xl border border-border/80 bg-background/95 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/85 transition-[border-color,box-shadow] duration-150 focus-within:border-border-strong focus-within:shadow-xl",
        className,
      )}
      {...props}
    />
  );
}

export function PromptInputTextarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={1}
      className={cn(
        "block max-h-48 min-h-[24px] w-full min-w-0 resize-none border-none bg-transparent p-0 text-[15px] leading-6 text-text placeholder:font-normal placeholder:text-muted focus:outline-none focus:ring-0",
        className,
      )}
      {...props}
    />
  );
}
