"use client";

import { FileText, GitBranch, Award, Activity, Eye, Heart, MessageSquare, Download } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

interface Props {
  stats: Stat[];
}

export default function ProfileStatistics({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-surface/50 p-3 transition-all hover:border-primary/20 hover:bg-primary-soft"
        >
          <div className="mb-1.5 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-background text-muted">
              {stat.icon}
            </div>
            <span className="text-[10px] font-medium text-muted">{stat.label}</span>
          </div>
          <p className="font-heading text-lg font-bold text-text">{stat.value.toLocaleString()}</p>
          {stat.trend && (
            <span className={`text-[10px] ${
              stat.trend === "up" ? "text-emerald-500" : stat.trend === "down" ? "text-red-500" : "text-muted"
            }`}>
              {stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "→"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
