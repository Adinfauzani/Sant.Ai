import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium leading-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary-soft text-primary",
        secondary:
          "border-transparent bg-surface text-muted",
        destructive:
          "border-destructive-border bg-destructive-soft text-destructive",
        success:
          "border-success-border bg-success-soft text-success",
        warning:
          "border-warning-border bg-warning-soft text-warning",
        outline: "border-border text-muted",
        beginner:
          "border-success-border bg-success-soft text-success",
        intermediate:
          "border-warning-border bg-warning-soft text-warning",
        advanced:
          "border-destructive-border bg-destructive-soft text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
