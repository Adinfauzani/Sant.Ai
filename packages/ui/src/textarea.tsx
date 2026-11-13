import * as React from "react"

import { cn } from "./utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, rows = 3, ...props }, ref) => {
    return (
      <textarea
        rows={rows}
        className={cn(
          "flex min-h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-text shadow-xs transition-colors placeholder:text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
