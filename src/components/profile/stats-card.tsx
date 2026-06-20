interface Props {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

export default function StatsCard({ label, value, icon }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface/5 p-4">
      {icon && <div className="text-muted">{icon}</div>}
      <p className="mt-1 font-semibold text-2xl text-text">{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
