"use client";

import { Zap, TrendingUp, Flame, Award, CalendarRange } from "lucide-react";
import { Progress } from "@santai/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@santai/ui/tooltip";

interface Props {
  points: number;
  level: string;
  weeklyProgress?: number;
  monthlyProgress?: number;
  streak?: number;
}

const LEVELS = ["Beginner", "Active", "Lead", "Expert"];

const LEVEL_THRESHOLDS: Record<string, { min: number; max: number; color: string }> = {
  Beginner: { min: 0, max: 49, color: "from-primary/50 to-primary" },
  Active: { min: 50, max: 199, color: "from-primary to-brand" },
  Lead: { min: 200, max: 499, color: "from-brand to-primary" },
  Expert: { min: 500, max: 9999, color: "from-primary via-brand to-primary" },
};

function getLevelProgress(points: number, level: string) {
  const thresh = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS.Beginner;
  const range = thresh.max - thresh.min;
  const progress = range > 0 ? ((points - thresh.min) / range) * 100 : 100;
  return Math.min(100, Math.max(0, progress));
}

function getNextLevel(level: string): string {
  const idx = LEVELS.indexOf(level);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : "Maksimal";
}

export default function ProfileReputation({ points, level, weeklyProgress, monthlyProgress, streak }: Props) {
  const progress = getLevelProgress(points, level);
  const nextLevel = getNextLevel(level);
  const thresh = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS.Beginner;

  return (
    <TooltipProvider>
      <div className="rounded-xl border border-border bg-surface/50 p-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Reputasi</p>
              <p className="text-lg font-bold font-heading text-text">{points.toLocaleString()} <span className="text-xs font-normal text-muted">poin</span></p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
                <Award className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-semibold text-primary">{level}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Level: {level} &middot; Berikutnya: {nextLevel}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Progress ke level berikutnya */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted">
            <span>{points.toLocaleString()} / {thresh.max.toLocaleString()} XP</span>
            <span>Level berikutnya: {nextLevel}</span>
          </div>
          <Progress
            value={progress}
            indicatorClassName={`bg-gradient-to-r ${thresh.color}`}
            className="h-1.5"
          />
        </div>

        {/* Streak + Aktivitas mingguan/bulanan (hanya jika disediakan) */}
        {(streak !== undefined || weeklyProgress !== undefined || monthlyProgress !== undefined) && (
          <div className="grid grid-cols-3 gap-2">
            {streak !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-lg border border-border bg-background p-2 text-center">
                    <Flame className="mx-auto mb-0.5 h-3.5 w-3.5 text-warning" />
                    <p className="text-xs font-bold text-text">{streak}</p>
                    <p className="text-[9px] text-muted">hari beruntun</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Streak kontribusi aktif</TooltipContent>
              </Tooltip>
            )}
            {weeklyProgress !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-lg border border-border bg-background p-2 text-center">
                    <TrendingUp className="mx-auto mb-0.5 h-3.5 w-3.5 text-success" />
                    <p className="text-xs font-bold text-text">{weeklyProgress}%</p>
                    <p className="text-[9px] text-muted">minggu ini</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Aktivitas kemajuan mingguan</TooltipContent>
              </Tooltip>
            )}
            {monthlyProgress !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-lg border border-border bg-background p-2 text-center">
                    <CalendarRange className="mx-auto mb-0.5 h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-bold text-text">{monthlyProgress}%</p>
                    <p className="text-[9px] text-muted">bulan ini</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Aktivitas kemajuan bulanan</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
