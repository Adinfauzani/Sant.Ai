"use client"

import * as React from "react"
import { cn } from "./utils"
import { cva, type VariantProps } from "class-variance-authority"

const InputGroupContext = React.createContext<{ focusWithin: boolean }>({ focusWithin: false })

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const [focusWithin, setFocusWithin] = React.useState(false)
  return (
    <InputGroupContext.Provider value={{ focusWithin }}>
      <div
        ref={ref}
        data-focus-within={focusWithin || undefined}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={() => setFocusWithin(false)}
        className={cn(
          "group/input-group relative flex min-w-0 items-center rounded-md border border-border transition-colors",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring",
          "has-[[data-slot=input-group-control][aria-invalid]]:border-destructive",
          className
        )}
        {...props}
      />
    </InputGroupContext.Provider>
  )
})
InputGroup.displayName = "InputGroup"

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    data-slot="input-group-control"
    className={cn(
      "h-9 w-full bg-transparent px-3 py-1 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      className
    )}
    {...props}
  />
))
InputGroupInput.displayName = "InputGroupInput"

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { align?: "inline-start" | "inline-end" | "block-start" | "block-end" }
>(({ className, align = "inline-start", ...props }, ref) => {
  const { focusWithin } = React.useContext(InputGroupContext)
  return (
    <div
      ref={ref}
      data-focus-within={focusWithin || undefined}
      className={cn(
        "flex items-center gap-0.5",
        align === "inline-start" && "order-first pl-2.5",
        align === "inline-end" && "order-last pr-2.5",
        align === "block-start" && "order-first mb-1 w-full",
        align === "block-end" && "order-last mt-1 w-full",
        className
      )}
      {...props}
    />
  )
})
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    size?: "xs" | "icon-xs" | "sm" | "icon-sm"
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }
>(({ className, size = "xs", variant = "ghost", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      variant === "ghost" && "text-muted hover:bg-accent hover:text-accent-foreground",
      variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
      variant === "outline" && "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
      variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      variant === "link" && "text-primary underline-offset-4 hover:underline",
      variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      size === "xs" && "h-7 px-2 text-xs",
      size === "icon-xs" && "h-7 w-7",
      size === "sm" && "h-8 px-3 text-xs",
      size === "icon-sm" && "h-8 w-8",
      className
    )}
    {...props}
  />
))
InputGroupButton.displayName = "InputGroupButton"

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs text-muted", className)}
    {...props}
  />
))
InputGroupText.displayName = "InputGroupText"

export { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton, InputGroupText }
