"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart3, Code, Database } from "lucide-react";

const programs = [
  {
    title: "Sains Data",
    tag: "SD",
    icon: BarChart3,
    desc: "Data science, statistical modeling, and machine learning. Learn to extract insights from data at scale.",
    topics: ["Python", "Machine Learning", "Big Data", "Visualization"],
    careers: ["Data Scientist", "Data Analyst", "ML Engineer"],
  },
  {
    title: "Teknik Informatika",
    tag: "TI",
    icon: Code,
    desc: "Software engineering, system architecture, and application development. Build production-ready solutions.",
    topics: ["Web Dev", "Mobile Dev", "Cloud", "Security"],
    careers: ["Software Engineer", "Fullstack Dev", "DevOps Engineer"],
  },
  {
    title: "Sistem Informasi",
    tag: "SI",
    icon: Database,
    desc: "Bridge business processes with technology. Design effective information systems for organizations.",
    topics: ["Business Process", "ERP", "UI/UX", "PM"],
    careers: ["System Analyst", "IT Consultant", "Project Manager"],
  },
];

export default function ProgramCarousel() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrent((i + programs.length) % programs.length);
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % programs.length);
    }, 10000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const minSwipe = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (Math.abs(dist) >= minSwipe) {
      goTo(current + (dist > 0 ? 1 : -1));
    }
    resetTimer();
  };

  return (
    <>
      {/* Mobile carousel */}
      <div className="overflow-hidden md:hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {programs.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="w-full flex-shrink-0 px-1">
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <h3 className="font-heading text-base font-semibold tracking-tight text-text">
                      {p.title}
                    </h3>
                    <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">
                      {p.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.topics.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {programs.map((p, i) => (
            <button
              key={p.title}
              type="button"
              onClick={() => {
                goTo(i);
                resetTimer();
              }}
              aria-label={`Tampilkan program ${p.title}`}
              aria-current={i === current ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                i === current ? "w-5 bg-primary" : "w-1.5 bg-border-strong"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {programs.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="group rounded-lg border border-border bg-card p-6 transition-colors duration-150 hover:border-border-strong"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="font-heading text-base font-semibold tracking-tight text-text transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
                <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">
                  {p.tag}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
