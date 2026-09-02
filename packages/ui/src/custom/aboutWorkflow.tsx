"use client";

import { Waypoints, Boxes, PenTool, Code2, Bug, Rocket } from "lucide-react";

const workflow = [
  { icon: Waypoints, title: "Discovery", text: "Riset kebutuhan user & masalah nyata, lalu tentukan masalah mana yang paling penting dipecahin." },
  { icon: Boxes, title: "Planning", text: "Breakdown scope jadi tugas kecil, tentukan peran tiap anggota, dan sepakati tenggat." },
  { icon: PenTool, title: "Design", text: "Rancang alur & antarmuka biar solusinya enak dipakai user sejak awal proyek." },
  { icon: Code2, title: "Development", text: "Tulis kode terstruktur, kolaborasi di tim dengan code review di tiap perubahan." },
  { icon: Bug, title: "Testing", text: "Uji unit, integrasi, dan fungsional biar bug ketangkep sebelum sampai ke user." },
  { icon: Rocket, title: "Deploy & iterate", text: "Rilis versi pertama, pantau performa, lalu perbaiki terus sesuai feedback user." },
] as const;

export function AboutWorkflow() {
  return (
    <section className="relative overflow-hidden border-t border-border section-padding">
      {/* canvas shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-12 h-4 w-4 rounded-full bg-primary/40" />
        <div className="absolute left-8 bottom-16 h-3 w-3 rounded-full bg-amber-400/50" />
      </div>
      <div className="container-main relative">
        <div className="section-header text-center">
          <p className="section-label">Cara kerja</p>
          <h2 className="editorial-md text-text">Belajar lewat proyek yang beneran</h2>
          <p className="section-desc mx-auto">
            Bukan tugas yang berakhir di nilai. Kamu jalani siklus nyata dari ide sampai produk dipakai.
          </p>
        </div>
        <div className="relative mt-16">
          {/* spine melengkung zigzag */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/60 via-border to-border lg:block" />

          <div className="space-y-0">
            {workflow.map((step, i) => {
              const Icon = step.icon;
              const left = i % 2 === 0;
              const phase = i < 2 ? "primary" : i < 4 ? "cyan" : "amber";
              const accent =
                phase === "primary"
                  ? "border-primary/40 bg-primary text-white"
                  : phase === "cyan"
                    ? "border-cyan-500/40 bg-cyan-400 text-cyan-500 dark:text-cyan-300"
                    : "border-amber-500/40 bg-amber-400 text-amber-500 dark:text-amber-300";
              const numColor =
                phase === "primary"
                  ? "text-primary"
                  : phase === "cyan"
                    ? "text-cyan-500 dark:text-cyan-300"
                    : "text-amber-500 dark:text-amber-300";

              return (
                <div key={step.title} className="relative lg:flex lg:h-auto lg:items-center lg:py-2">
                  {/* card (kiri/kanan bergantian) */}
                  <div className={`relative z-10 lg:w-1/2 ${left ? "lg:pr-14 lg:text-right" : "lg:order-2 lg:pl-14"}`}>
                    <div className="relative inline-block w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
                      <span aria-hidden="true" className={`pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full ${phase === "cyan" ? "bg-cyan-400/10" : phase === "amber" ? "border-2 border-amber-400/20" : "border-2 border-primary/15"}`} />
                      <span aria-hidden="true" className={`pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 ${phase === "cyan" ? "rotate-45 border-2 border-cyan-400/20" : phase === "amber" ? "bg-amber-400/10" : "rounded-full bg-primary/5"}`} />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`font-mono text-3xl font-bold ${numColor}`}>0{i + 1}</span>
                        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${accent}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <h3 className="mt-4 font-heading text-base font-bold text-text">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
                    </div>
                  </div>

                  {/* spacer */}
                  <div aria-hidden="true" className="hidden lg:block lg:w-1/2" />

                  {/* spine dot */}
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 z-10 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-border bg-background lg:grid"
                  >
                    <span className={`h-2 w-2 rounded-full ${phase === "primary" ? "bg-primary" : phase === "cyan" ? "bg-cyan-400" : "bg-amber-400"}`} />
                  </span>

                  {/* kurva dari card ke spine */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                    className={`absolute top-1/2 hidden h-10 w-28 -translate-y-1/2 lg:block ${left ? "right-1/2" : "left-1/2 -scale-x-100"}`}
                  >
                    <path
                      d="M100 20 C 62 4, 30 36, 18 20"
                      fill="none"
                      stroke="var(--border-base)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
