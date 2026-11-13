"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Users, Sparkles } from "lucide-react";

const items = [
  {
    step: "01",
    title: "Post your idea",
    desc: "Share your project concept and get feedback from peers across different study programs.",
    icon: BookOpen,
  },
  {
    step: "02",
    title: "Build your team",
    desc: "Form cross-disciplinary teams with complementary skills from SD, TI, and SI.",
    icon: Users,
  },
  {
    step: "03",
    title: "Ship and earn",
    desc: "Complete the project, build your portfolio, and earn reputation in the ecosystem.",
    icon: Sparkles,
  },
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
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="w-full flex-shrink-0 px-1">
                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5">
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-2 select-none font-mono text-[34px] font-bold leading-none text-border/70"
                  >
                    {item.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-heading text-base font-semibold tracking-tight text-text">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                goTo(i);
                resetTimer();
              }}
              aria-label={`Tampilkan langkah ${item.step}`}
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
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="group relative overflow-hidden rounded-lg border border-border bg-card transition-colors duration-150 hover:border-border-strong"
            >
              <span
                aria-hidden="true"
                className="absolute right-4 top-3 select-none font-mono text-[40px] font-bold leading-none text-border/70"
              >
                {item.step}
              </span>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold tracking-tight text-text transition-colors group-hover:text-primary">
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
