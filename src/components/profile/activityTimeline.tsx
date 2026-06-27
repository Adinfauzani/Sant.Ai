"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  icon: React.ReactNode;
  description: string;
  date: string;
  points?: number;
  type?: string;
}

interface Props {
  activities: Activity[];
  className?: string;
}

export default function ActivityTimeline({ activities, className }: Props) {
  if (activities.length === 0) return null;

  return (
    <div className={cn("space-y-0", className)}>
      {activities.map((activity, i) => (
        <TimelineItem key={activity.id} activity={activity} isLast={i === activities.length - 1} index={i} />
      ))}
    </div>
  );
}

function TimelineItem({ activity, isLast, index }: { activity: Activity; isLast: boolean; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex gap-3 pl-4 transition-all duration-500",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Timeline line */}
      {!isLast && <div className="absolute bottom-0 left-[14px] top-5 w-px bg-border" />}

      {/* Icon */}
      <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted">
        {activity.icon}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <p className="text-xs leading-relaxed text-text">{activity.description}</p>
        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted">
          <span>{activity.date}</span>
          {activity.points !== undefined && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">+{activity.points} pts</span>
          )}
        </div>
      </div>
    </div>
  );
}
