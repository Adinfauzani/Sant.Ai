"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hoverCard";

interface Badge {
  earned: boolean;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

interface Props {
  badges: Badge[];
}

export default function ProfileBadges({ badges }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <HoverCard key={badge.label} openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <button
              type="button"
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all hover:border-primary/30 hover:bg-primary-soft ${
                badge.earned
                  ? "border-primary/20 bg-primary-soft text-primary"
                  : "border-border text-muted opacity-50"
              }`}
            >
              <span className="h-3.5 w-3.5">{badge.icon}</span>
              <span>{badge.label}</span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 p-4">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                badge.earned ? "bg-primary/10 text-primary" : "bg-surface text-muted"
              }`}>
                {badge.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-text">{badge.label}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{badge.desc}</p>
                {badge.earned ? (
                  <p className="mt-1.5 text-[10px] text-emerald-500">✓ Earned</p>
                ) : (
                  <p className="mt-1.5 text-[10px] text-muted">Locked</p>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
