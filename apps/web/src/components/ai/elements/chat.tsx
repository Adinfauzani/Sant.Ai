"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Chat({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="chat"
      className={cn("flex h-full min-h-0 flex-col", className)}
      {...props}
    />
  );
}

export function ChatHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-header"
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export function ChatMessages({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-messages"
      className={cn("relative flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  );
}

export function ChatEmptyState({
  className,
  icon,
  title,
  description,
  actions,
  children,
  ...props
}: ComponentProps<"div"> & {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      data-slot="chat-empty-state"
      className={cn(
        "flex h-full flex-col items-center justify-center px-4 py-10 text-center",
        className,
      )}
      {...props}
    >
      {icon ? <div className="mb-4">{icon}</div> : null}
      {title ? (
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-text sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {children}
      {actions ? <div className="mt-6">{actions}</div> : null}
    </div>
  );
}

export function ChatFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-footer"
      className={cn("shrink-0 px-4 pb-4 pt-1 md:px-8 md:pb-6", className)}
      {...props}
    />
  );
}

export function ChatStatusBar({
  status,
  className,
  ...props
}: ComponentProps<"div"> & { status?: "ready" | "streaming" | "error" }) {
  const label =
    status === "streaming" ? "berpikir" : status === "error" ? "gagal" : "siap";
  return (
    <div
      data-slot="chat-status"
      data-status={status ?? "ready"}
      className={cn(
        "hidden items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary sm:flex",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "error" ? "bg-destructive" : "bg-primary",
          status === "streaming" && "animate-pulse",
        )}
      />
      <span>AI MU · {label}</span>
    </div>
  );
}
