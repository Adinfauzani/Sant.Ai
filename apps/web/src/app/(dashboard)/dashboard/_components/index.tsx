import { cn } from "@/lib/utils";

/**
 * Kartu dasbor: permukaan datar dengan garis rambut (hairline), tanpa
 * efek Hover lift supaya konsisten dengan bahasa design yang flat.
 */
export function Card({ title, action, children, className }: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-6",
      className
    )}>
      {title && (
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          {action && <div className="text-xs text-muted">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
