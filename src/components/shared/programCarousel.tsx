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
    color: "from-blue-600 to-cyan-500",
    cover: "from-blue-600/20 to-cyan-400/10",
  },
  {
    title: "Teknik Informatika",
    tag: "TI",
    icon: Code,
    desc: "Software engineering, system architecture, and application development. Build production-ready solutions.",
    topics: ["Web Dev", "Mobile Dev", "Cloud", "Security"],
    careers: ["Software Engineer", "Fullstack Dev", "DevOps Engineer"],
    color: "from-emerald-600 to-teal-500",
    cover: "from-emerald-600/20 to-teal-400/10",
  },
  {
    title: "Sistem Informasi",
    tag: "SI",
    icon: Database,
    desc: "Bridge business processes with technology. Design effective information systems for organizations.",
    topics: ["Business Process", "ERP", "UI/UX", "PM"],
    careers: ["System Analyst", "IT Consultant", "Project Manager"],
    color: "from-purple-600 to-violet-500",
    cover: "from-purple-600/20 to-violet-400/10",
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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
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
                <div className="group relative overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-sm">
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.cover} opacity-20`} />
                  <div className="relative z-10 p-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${p.color} shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <h3 className="font-heading text-base font-bold text-text">{p.title}</h3>
                      <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">{p.tag}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.topics.map((t) => (
                        <span key={t} className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {programs.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-4 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden gap-6 md:grid md:grid-cols-3">
        {programs.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="group relative overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-transparent hover:shadow-lg hover:shadow-primary/5">
              <div className={`absolute inset-0 bg-gradient-to-br ${p.cover} opacity-20`} />
              <div className="relative z-10 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} shadow-lg shadow-primary/10`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-text transition-colors group-hover:text-primary">{p.title}</h3>
                  <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">{p.tag}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.topics.map((t) => (
                    <span key={t} className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
