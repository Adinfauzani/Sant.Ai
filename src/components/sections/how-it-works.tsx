"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Users, Award, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Project Ideas",
    desc: "Post your project ideas and get feedback from peers across different majors.",
    color: "from-blue-600 to-cyan-500",
    cover: "from-blue-600/20 to-cyan-400/10",
    step: "01",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Cross-Major Teams",
    desc: "Form teams with students from Data Science, Informatics, and Information Systems.",
    color: "from-emerald-600 to-teal-500",
    cover: "from-emerald-600/20 to-teal-400/10",
    step: "02",
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: "Reputation System",
    desc: "Build your reputation through contributions and completed projects.",
    color: "from-purple-600 to-violet-500",
    cover: "from-purple-600/20 to-violet-400/10",
    step: "03",
  },
];

function FeatureCard({ f, index }: { f: typeof features[number]; index: number }) {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute -inset-px rounded-[20px] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:blur-sm" />
      <div className="relative h-full overflow-hidden rounded-[20px] border border-border bg-surface/60 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-primary/5">
        <div className={`absolute inset-0 bg-gradient-to-br ${f.cover} opacity-20`} />
        <div className="absolute right-3 top-3 font-mono text-[40px] font-black leading-none text-border/40 select-none">
          {f.step}
        </div>
        <div className="relative z-10 p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg shadow-primary/10`}>
            <div className="text-white">{f.icon}</div>
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold text-text transition-colors group-hover:text-primary">
            {f.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
          <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-all group-hover:gap-1.5 group-hover:opacity-100">
            Learn more <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % features.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + features.length) % features.length), []);

  useEffect(() => {
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, [next]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">
            Start in <span className="text-primary">Three</span> Steps
          </h2>
          <p className="mt-3 text-sm text-muted">
            From idea to impact — collaborate across study programs
          </p>
        </div>

        {/* Desktop: 3 cards with connector */}
        <div className="relative hidden md:block">
          <div className="absolute left-0 right-0 top-[52px] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="grid grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} f={f} index={i} />
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-8 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="relative md:hidden">
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <FeatureCard f={features[current]} index={current} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
