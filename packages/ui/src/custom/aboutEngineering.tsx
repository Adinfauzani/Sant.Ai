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
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-[#0b1120] shadow-2xl shadow-black/20">
          {/* terminal title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            <span className="ml-3 font-mono text-xs text-slate-400">santai --culture --dev</span>
          </div>
          {/* terminal body */}
          <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
            {engineering.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={e.title} className="group relative overflow-hidden bg-[#0b1120] p-5 transition-colors duration-200 hover:bg-white/[0.03]">
                  <span aria-hidden="true" className={`pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full ${i % 2 === 0 ? "border border-cyan-400/20" : "bg-white/[0.03]"}`} />
                  <span aria-hidden="true" className={`pointer-events-none absolute -bottom-4 -left-4 h-8 w-8 rotate-12 rounded-md border ${i % 2 === 0 ? "border-slate-500/20" : "border-amber-400/15"}`} />
                  <div className="flex min-h-5 items-center gap-2 font-mono text-[13px] text-emerald-400">
                    <span className="select-none text-slate-500">$</span>
                    <TypeCommand text={e.cmd} delay={i * 380} />
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="group-hover:border-cyan-400/40 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-cyan-400/10 bg-cyan-400/10 text-cyan-300 transition-colors">
                      <Icon className="h-4 w-4" />
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
