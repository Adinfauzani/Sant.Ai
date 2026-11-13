"use client";

import type { ComponentProps, ReactNode } from "react";
import { AlertTriangle, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmationState =
  | "idle"
  | "pending"
  | "approved"
  | "rejected"
  | "error";

export function Confirmation({
  state = "idle",
  className,
  ...props
}: ComponentProps<"div"> & { state?: ConfirmationState }) {
  return (
    <div
      data-slot="confirmation"
      data-state={state}
      className={cn(
        "w-full rounded-xl border border-border bg-card p-3 text-sm",
        state === "error" && "border-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export function ConfirmationHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-header"
      className={cn("flex items-start gap-2", className)}
      {...props}
    />
  );
}

export function ConfirmationIcon({
  state = "idle",
  className,
}: {
  state?: ConfirmationState;
  className?: string;
}) {
  if (state === "approved") {
    return (
      <span className={cn("mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary", className)}>
        <Check className="size-3" />
      </span>
    );
  }
  if (state === "rejected" || state === "error") {
    return (
      <span className={cn("mt-0.5 flex size-5 items-center justify-center rounded-full bg-destructive-soft text-destructive", className)}>
        <X className="size-3" />
      </span>
    );
  }
  if (state === "pending") {
    return (
      <span className={cn("mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary", className)}>
        <Loader2 className="size-3 animate-spin" />
      </span>
    );
  }
  return (
    <span className={cn("mt-0.5 flex size-5 items-center justify-center rounded-full bg-warning-soft text-warning-foreground", className)}>
      <AlertTriangle className="size-3" />
    </span>
  );
}

export function ConfirmationTitle({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-title"
      className={cn("text-sm font-medium text-text", className)}
      {...props}
    />
  );
}

export function ConfirmationDescription({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-description"
      className={cn("mt-0.5 text-xs leading-relaxed text-muted", className)}
      {...props}
    />
  );
}

export function ConfirmationActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-actions"
      className={cn("mt-3 flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export function ConfirmationApproveButton({
  className,
  children,
  loading,
  ...props
}: ComponentProps<"button"> & { loading?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50",
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
      {children ?? "Setujui"}
    </button>
  );
}

export function ConfirmationRejectButton({
  className,
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-text transition-colors hover:bg-surface disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <X className="size-3" />
      {children ?? "Tolak"}
    </button>
  );
}

export function ConfirmationResult({
  state,
  approvedText = "Disetujui.",
  rejectedText = "Ditolak.",
  errorText = "Gagal memproses konfirmasi.",
}: {
  state: ConfirmationState;
  approvedText?: ReactNode;
  rejectedText?: ReactNode;
  errorText?: ReactNode;
}) {
  if (state === "approved") {
    return <p className="mt-2 text-xs text-primary">{approvedText}</p>;
  }
  if (state === "rejected") {
    return <p className="mt-2 text-xs text-muted">{rejectedText}</p>;
  }
  if (state === "error") {
    return <p className="mt-2 text-xs text-destructive">{errorText}</p>;
  }
  return null;
}
