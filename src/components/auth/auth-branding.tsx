"use client";

import { motion } from "framer-motion";
import { Code, Users, Award, Lightbulb } from "lucide-react";

const features = [
  {
    icon: <Code className="h-5 w-5" />,
    title: "Build Real Projects",
    desc: "Collaborate on innovative projects and solve real-world problems.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Cross-Program Collaboration",
    desc: "Work together with students from SD, TI, and SI.",
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: "Build Your Portfolio",
    desc: "Showcase achievements, contributions, and project experiences.",
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Turn Ideas Into Innovation",
    desc: "Transform ideas into meaningful technology solutions.",
  },
];

export function AuthBranding() {
  return (
    <div className="flex h-full flex-col justify-between p-8 lg:p-12">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <div>
            <p className="text-base font-bold text-text">Sant.Ai</p>
            <p className="text-[9px] font-medium tracking-[0.15em] text-muted">
              SAINS &amp; TECHNOLOGY
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-1.5">
          <p className="text-xs font-medium text-muted">
            Universitas Saintek Muhammadiyah
          </p>
          <p className="text-xs text-muted">Fakultas Ilmu Komputer</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-blue-400">
              SD
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-400">
              TI
            </span>
            <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-purple-400">
              SI
            </span>
          </div>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted">
          Connect, collaborate, and build impactful technology projects with
          students across Data Science, Informatics Engineering, and Information
          Systems.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            className="flex gap-3"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{f.title}</p>
              <p className="text-xs text-muted">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
