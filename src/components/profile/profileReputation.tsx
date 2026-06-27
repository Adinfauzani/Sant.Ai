"use client";

import { Zap, TrendingUp, Flame, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface Props {
  points: number;
  level: string;
  weeklyProgress?: number;
  monthlyProgress?: number;
  streak?: number;
}

const LEVEL_THRESHOLDS: Record<string, { min: number; max: number; color: string }> = {
  Beginner: { min: 0, max: 49, color: "from-primary/60 to-primary" },
  Active: { min: 50, max: 199, color: "from-primary to-accent" },
  Lead: { min: 200, max: 499, color: "from-accent to-primary" },
  Expert: { min: 500, max: 9999, color: "from-primary via-accent to-primary" },
};

function getLevelProgress(points: number, level: string) {
  const thresh = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS.Beginner;
  const range = thresh.max - thresh.min;
  const progress = range > 0 ? ((points - thresh.min) / range) * 100 : 100;
  return Math.min(100, Math.max(0, progress));
}

function getNextLevel(level: string): string {
  const levels = ["Beginner", "Active", "Lead", "Expert"];
  const idx = levels.indexOf(level);
  return idx < levels.length - 1 ? levels[idx + 1] : "Max";
}

export default function ProfileReputation({ points, level, weeklyProgress = 35, monthlyProgress = 60, streak = 0 }: Props) {
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
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Reputation</p>
              <p className="text-lg font-bold font-heading text-text">{points.toLocaleString()} <span className="text-xs font-normal text-muted">pts</span></p>
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
              <p>Level: {level} &middot; Next: {nextLevel}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Progress to next level */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted">
            <span>{points.toLocaleString()} / {thresh.max.toLocaleString()} XP</span>
            <span>Next: {nextLevel}</span>
          </div>
          <Progress
            value={progress}
            indicatorClassName={`bg-gradient-to-r ${thresh.color}`}
            className="h-1.5"
          />
        </div>

        {/* Streak + Weekly/Monthly */}
        <div className="grid grid-cols-3 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-lg border border-border bg-background p-2 text-center">
                <Flame className="mx-auto mb-0.5 h-3.5 w-3.5 text-orange-500" />
                <p className="text-xs font-bold text-text">{streak}</p>
                <p className="text-[9px] text-muted">day streak</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">Current contribution streak</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-lg border border-border bg-background p-2 text-center">
                <TrendingUp className="mx-auto mb-0.5 h-3.5 w-3.5 text-emerald-500" />
                <p className="text-xs font-bold text-text">{weeklyProgress}%</p>
                <p className="text-[9px] text-muted">this week</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">Weekly activity progress</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-lg border border-border bg-background p-2 text-center">
                <TrendingUp className="mx-auto mb-0.5 h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-bold text-text">{monthlyProgress}%</p>
                <p className="text-[9px] text-muted">this month</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">Monthly activity progress</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
