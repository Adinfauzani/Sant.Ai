"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  contributions: { createdAt: Date }[];
}

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (max === 0) return 1;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export default function ContributionGraph({ contributions }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const { weeks, maxCount, total } = useMemo(() => {
    const byDate = new Map<string, number>();
    for (const c of contributions) {
      const d = new Date(c.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      byDate.set(key, (byDate.get(key) || 0) + 1);
    }

    const today = new Date();
    const end = new Date(today);
    const start = new Date(end);
    start.setDate(start.getDate() - 364);

    const days: DayData[] = [];
    let max = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const count = byDate.get(key) || 0;
      max = Math.max(max, count);
      days.push({ date: key, count, level: 0 });
    }

    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    for (let i = 0; i < start.getDay(); i++) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }

    for (const day of days) {
      day.level = getLevel(day.count, max);
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { weeks, maxCount: max, total: byDate.size };
  }, [contributions]);

  if (contributions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface/5 p-6 text-center">
        <p className="text-xs text-muted">No contributions in the past year.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-text">
          {total} day{total !== 1 ? "s" : ""} with contributions
        </h3>
        <div className="flex items-center gap-1 text-[10px] text-muted">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className={cn(
                "h-3 w-3 rounded-[2px]",
                level === 0 && "bg-border/30",
                level === 1 && "bg-primary/20",
                level === 2 && "bg-primary/40",
                level === 3 && "bg-primary/60",
                level === 4 && "bg-primary",
              )}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-[3px]">
          <div className="flex flex-col gap-[3px] pr-1 pt-5">
            {DAYS.map((d, i) => (
              <span key={i} className="h-[10px] text-[8px] leading-[10px] text-muted">{d}</span>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {wi === 0 || week[0]?.date?.slice(5, 7) !== weeks[Math.max(0, wi - 1)]?.[0]?.date?.slice(5, 7)
                ? <span className="h-[10px] text-[8px] leading-[10px] text-muted">{MONTHS[parseInt(week.find((d) => d.date)?.date?.slice(5, 7) || "0") - 1] || ""}</span>
                : <span className="h-[10px]" />}
              {week.map((day, di) => (
                <div
                  key={di}
                  className={cn(
                    "relative h-[10px] w-[10px] rounded-[2px] cursor-pointer",
                    day.level === 0 && "bg-border/30",
                    day.level === 1 && "bg-primary/20",
                    day.level === 2 && "bg-primary/40",
                    day.level === 3 && "bg-primary/60",
                    day.level === 4 && "bg-primary",
                  )}
                  onMouseEnter={(e) => {
                    if (day.date) {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ date: day.date, count: day.count, x: rect.left, y: rect.top - 8 });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 rounded border border-border bg-background px-2 py-1 text-[10px] shadow-sm pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          <span className="font-medium text-text">{tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""}</span>
          <span className="text-muted"> on {tooltip.date}</span>
        </div>
      )}
    </div>
  );
}
