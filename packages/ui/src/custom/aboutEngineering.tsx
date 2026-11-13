"use client";

import { GitCommit, GitPullRequest, Bug, Workflow, Layers, IterationCcw } from "lucide-react";
import { TypeCommand } from "./typeCommand";
import { ScientificBackground } from "../scientificBackground";

const engineering = [
  { icon: GitCommit, title: "Git & Version Control", cmd: "git branch -a", text: "Jejak perubahan kerjaan rapi dan bisa ditarik kapan aja." },
  { icon: GitPullRequest, title: "Code Review", cmd: "git push origin dev", text: "Saling review biar kualitas naik dan ilmu kebagi-bagi." },
  { icon: Bug, title: "Testing", cmd: "pnpm test", text: "Pastiin yang dibangun beneran jalan, bukan asal jadi." },
  { icon: Workflow, title: "Agile & Scrum", cmd: "sprint start", text: "Kerja iteratif, respon cepat, prioritas jelas." },
  { icon: Layers, title: "Clean Architecture", cmd: "make modules", text: "Kode terstruktur biar gampang dirawat dan dikembangin." },
  { icon: IterationCcw, title: "CI/CD", cmd: "ci/cd run", text: "Proses rilis otomatis, feedback cepet, deploy lancar." },
] as const;

/**
 * Panel terminal adalah satu-satunya "perangkat" gelap di halaman ini, jadi
 * warnanya sengaja dikunci di palet gelap (bukan token tema) — di dalamnya
 * selalu ada latar #0b1120 baik di mode terang maupun gelap.
 */
export function AboutEngineering() {
  return (
    <section className="relative border-t border-border section-padding">
      <ScientificBackground variant="blueprint" className="absolute inset-0">
        <div className="absolute inset-0 bg-background/90" />
      </ScientificBackground>

      <div className="container-main relative">
        <div className="section-header text-center">
          <p className="section-label">Budaya engineering</p>
          <h2 className="editorial-md text-text">Kerja kayak di perusahaan teknologi</h2>
          <p className="section-desc mx-auto">
            Sejak hari pertama, kamu dibiasain sama praktik yang dipakai industri nyata.
          </p>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-[#0b1120]">
          {/* terminal title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <span className="size-3 rounded-full bg-red-400/80" />
            <span className="size-3 rounded-full bg-amber-400/80" />
            <span className="size-3 rounded-full bg-emerald-400/80" />
            <span className="ml-3 font-mono text-xs text-slate-400">santai --culture --dev</span>
          </div>

          {/* terminal body */}
          <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
            {engineering.map((e, i) => {
              const Icon = e.icon;
              return (
                <div
                  key={e.title}
                  className="group relative overflow-hidden bg-[#0b1120] p-5 transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <div className="flex min-h-5 items-center gap-2 font-mono text-[13px] text-emerald-400">
                    <span className="select-none text-slate-500">$</span>
                    <TypeCommand text={e.cmd} delay={i * 380} />
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-md border border-blue-400/20 bg-blue-400/10 text-blue-300 transition-colors group-hover:border-blue-400/40">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{e.title}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{e.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
