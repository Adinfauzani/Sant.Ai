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
      {/* single-accent canvas shape */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-24 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
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
          {/* spine */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block"
          />

          <div className="space-y-0">
            {workflow.map((step, i) => {
              const Icon = step.icon;
              const left = i % 2 === 0;

              return (
                <div
                  key={step.title}
                  className="relative lg:flex lg:h-auto lg:items-center lg:py-2"
                >
                  {/* card (kiri/kanan bergantian) */}
                  <div
                    className={`relative z-10 lg:w-1/2 ${left ? "lg:pr-14 lg:text-right" : "lg:order-2 lg:pl-14"}`}
                  >
                    <div className="relative inline-block w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-6 text-left">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-3xl font-bold text-primary">0{i + 1}</span>
                        <span className="grid size-10 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                          <Icon className="size-5" />
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
                    className="absolute left-1/2 top-1/2 z-10 hidden size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-border bg-background lg:grid"
                  >
                    <span className="size-2 rounded-full bg-primary" />
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
