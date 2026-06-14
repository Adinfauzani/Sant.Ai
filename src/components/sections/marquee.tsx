"use client";

import { motion } from "framer-motion";

const topics = [
  "Machine Learning",
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Cloud Computing",
  "Cyber Security",
  "Mobile Apps",
  "Artificial Intelligence",
  "Database Design",
  "API Development",
  "DevOps",
  "Blockchain",
  "IoT",
  "Computer Vision",
  "Natural Language Processing",
  "Software Architecture",
];

const item = (t: string, i: number) => (
  <span
    key={`${t}-${i}`}
    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
  >
    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
    {t}
  </span>
);

export default function MarqueeSection() {
  return (
    <section className="overflow-hidden py-10 md:py-14">
      <div className="container-main mb-6 text-center">
        <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Explore
        </p>
        <h2 className="font-heading text-2xl font-bold text-text md:text-3xl">
          Yang Harus Dipelajari
        </h2>
      </div>

      <div className="relative">
        <div className="animate-marquee flex gap-3" style={{ width: "max-content" }}>
          {[...Array(3)].map((_, loop) =>
            topics.map((t, i) => item(t, loop * topics.length + i)),
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
