import * as React from "react"

import { cn } from "./utils"

export type BubbleVariant =
  | "default"
  | "secondary"
  | "muted"
  | "tinted"
  | "outline"
  | "ghost"
  | "destructive"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: BubbleVariant
  align?: "start" | "end"
}) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * Surface colours live on the content, keyed off the bubble's `data-variant`.
 * Each variant owns its own border colour so no utility has to override
 * another one in the cascade.
 */
const bubbleSurface: Record<BubbleVariant, string> = {
  default:
    "group-data-[variant=default]/bubble:border-transparent group-data-[variant=default]/bubble:bg-primary group-data-[variant=default]/bubble:text-primary-foreground",
  secondary:
    "group-data-[variant=secondary]/bubble:border-transparent group-data-[variant=secondary]/bubble:bg-surface group-data-[variant=secondary]/bubble:text-text",
  muted:
    "group-data-[variant=muted]/bubble:border-transparent group-data-[variant=muted]/bubble:bg-surface/60 group-data-[variant=muted]/bubble:text-text-secondary",
  tinted:
    "group-data-[variant=tinted]/bubble:border-transparent group-data-[variant=tinted]/bubble:bg-primary-soft group-data-[variant=tinted]/bubble:text-text",
  outline:
    "group-data-[variant=outline]/bubble:border-border group-data-[variant=outline]/bubble:bg-card group-data-[variant=outline]/bubble:text-text",
  ghost:
    "group-data-[variant=ghost]/bubble:border-transparent group-data-[variant=ghost]/bubble:bg-transparent group-data-[variant=ghost]/bubble:text-text group-data-[variant=ghost]/bubble:rounded-none group-data-[variant=ghost]/bubble:p-0",
  destructive:
    "group-data-[variant=destructive]/bubble:border-transparent group-data-[variant=destructive]/bubble:bg-destructive-soft group-data-[variant=destructive]/bubble:text-destructive",
}

const BubbleContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { render?: React.ElementType }
>(({ className, render: Render, ...props }, ref) => {
  const classNames = cn(
    "w-fit max-w-full min-w-0 overflow-hidden rounded-2xl border px-3.5 py-2.5 text-sm leading-relaxed break-words transition-colors [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-2 [button,a]:focus-visible:ring-ring/30",
    bubbleSurface.default,
    bubbleSurface.secondary,
    bubbleSurface.muted,
    bubbleSurface.tinted,
    bubbleSurface.outline,
    bubbleSurface.ghost,
    bubbleSurface.destructive,
    className
  )

  if (Render) {
    const Element = Render as React.ComponentType<
      React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
    >
    return (
      <Element
        ref={ref}
        data-slot="bubble-content"
        className={classNames}
        {...props}
      />
    )
  }

  return (
    <div
      ref={ref}
      data-slot="bubble-content"
      className={classNames}
      {...props}
    />
  )
})
BubbleContent.displayName = "BubbleContent"

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "bottom"
  align?: "start" | "end"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(
        "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-border bg-card px-1.5 py-0.5 text-sm shadow-sm has-[button]:p-0",
        side === "top" ? "top-0 -translate-y-3/4" : "bottom-0 translate-y-3/4",
        align === "start" ? "left-3" : "right-3",
        className
      )}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
