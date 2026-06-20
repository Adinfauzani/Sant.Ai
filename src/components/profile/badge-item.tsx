interface Props {
  icon: React.ReactNode;
  label: string;
  description?: string;
  earned?: boolean;
}

export default function BadgeItem({ icon, label, description, earned = true }: Props) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 ${earned ? "border-border bg-surface/5" : "border-border/30 opacity-40"}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${earned ? "bg-primary/10 text-primary" : "bg-surface text-muted"}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text">{label}</p>
        {description && <p className="text-[10px] text-muted">{description}</p>}
      </div>
    </div>
  );
}
