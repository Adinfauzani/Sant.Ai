"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Users, Sparkles } from "lucide-react";

const items = [
  { step: "01", title: "Post your idea", desc: "Share your project concept and get feedback from peers across different study programs.", icon: BookOpen, color: "from-blue-600 to-cyan-500", cover: "from-blue-600/20 to-cyan-400/10" },
  { step: "02", title: "Build your team", desc: "Form cross-disciplinary teams with complementary skills from SD, TI, and SI.", icon: Users, color: "from-emerald-600 to-teal-500", cover: "from-emerald-600/20 to-teal-400/10" },
  { step: "03", title: "Ship and earn", desc: "Complete the project, build your portfolio, and earn reputation in the ecosystem.", icon: Sparkles, color: "from-purple-600 to-violet-500", cover: "from-purple-600/20 to-violet-400/10" },
];

export default function GuideCarousel() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrent((i + items.length) % items.length);
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 8000);
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
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="w-full flex-shrink-0 px-1">
                <div className="group relative overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-sm">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.cover} opacity-20`} />
                  <div className="absolute right-2 top-2 font-mono text-[34px] font-black leading-none text-border/40 select-none">
                    {item.step}
                  </div>
                  <div className="relative z-10 p-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mt-3 font-heading text-base font-bold text-text">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {items.map((_, i) => (
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
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="group relative overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-transparent hover:shadow-lg hover:shadow-primary/5">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.cover} opacity-20`} />
              <div className="absolute right-3 top-3 font-mono text-[40px] font-black leading-none text-border/40 select-none">
                {item.step}
              </div>
              <div className="relative z-10 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg shadow-primary/10`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-text transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
