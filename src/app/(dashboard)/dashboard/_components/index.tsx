import { cn } from "@/lib/utils";

export function Card({ title, action, children, className }: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-gradient-to-br from-surface/30 to-surface/10 p-5", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          {action && <div className="text-[10px] text-muted">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
