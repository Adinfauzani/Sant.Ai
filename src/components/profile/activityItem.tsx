import { cn } from "@/lib/utils";

interface Props {
  icon: React.ReactNode;
  description: string;
  date: string;
  points?: number;
}

export default function ActivityItem({ icon, description, date, points }: Props) {
  return (
    <div className="flex items-start gap-3 border-b border-border/50 py-3 last:border-0">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border text-muted">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text">{description}</p>
        <p className="mt-0.5 text-[10px] text-muted">{date}</p>
      </div>
      {points !== undefined && (
        <span className={cn("shrink-0 text-xs font-semibold", points >= 0 ? "text-emerald-500" : "text-muted")}>
          {points >= 0 ? `+${points}` : points}
        </span>
      )}
    </div>
  );
}
