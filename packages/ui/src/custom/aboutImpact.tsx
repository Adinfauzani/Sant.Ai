"use client";

import { GraduationCap, Landmark, Building2, Heart, Globe, Map } from "lucide-react";

const impact = [
  { icon: GraduationCap, title: "Mahasiswa", text: "Pengalaman kerja nyata, portofolio profesional, dan skill yang relevan sejak masih kuliah." },
  { icon: Landmark, title: "Universitas", text: "Lulusan yang lebih siap kerja, reputasi akademik kuat, dan contoh model pembelajaran berbasis proyek." },
  { icon: Building2, title: "Industri", text: "Akses ke talenta digital yang terbiasa kerja profesional, plus peluang kolaborasi riset." },
  { icon: Heart, title: "Muhammadiyah", text: "Dukungan teknologi lewat AI MU untuk percepat transformasi digital di berbagai lini." },
  { icon: Globe, title: "Masyarakat", text: "Solusi digital yang kasih manfaat langsung, layanan lebih efisien, informasi makin terjangkau." },
  { icon: Map, title: "Indonesia", text: "Sedikit-sedikit, ikut memperkuat ekosistem talenta digital dan inovasi nasional." },
];

const orbitPos = [
  { x: 50, y: 10 },
  { x: 88, y: 37.6 },
  { x: 73.6, y: 82.4 },
  { x: 26.4, y: 82.4 },
  { x: 12, y: 37.6 },
];

export function AboutImpact() {
  return (
    <section className="relative overflow-hidden border-t border-border section-padding">
      {/* canvas shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-0 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border border-primary/10" />
        <div className="absolute right-0 top-1/2 h-14 w-14 -translate-y-1/2 rotate-12 rounded-2xl border-2 border-primary/10" />
        <div className="absolute left-1/3 top-10 h-2 w-2 rounded-full bg-cyan-400/60" />
        <div className="absolute right-1/3 bottom-12 h-3 w-3 rounded-full bg-primary/50" />
      </div>
      <div className="container-main relative">
        <div className="section-header text-center">
          <p className="section-label">Dampak</p>
          <h2 className="editorial-md text-text">Buat siapa semua ini?</h2>
          <p className="section-desc mx-auto">
            Dampaknya nggak berhenti di mahasiswa. Dari kampus, ikut menyentuh banyak pihak.
          </p>
        </div>
        {/* mobile / tablet: grid kompak */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {impact.map((d, i) => {
            const Icon = d.icon;
            return (
              <div key={d.title} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
                <span aria-hidden="true" className={`pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full ${i % 2 === 0 ? "border-2 border-cyan-400/20" : "bg-primary/5"}`} />
                <span aria-hidden="true" className={`pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 rotate-12 rounded-md border-2 ${i % 2 === 0 ? "border-amber-400/20" : "border-emerald-400/20"}`} />
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-bold text-text">{d.title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted">{d.text}</p>
              </div>
            );
          })}
        </div>

        {/* desktop: orbit konsentris */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-2xl lg:block">
          {/* SVG orbit : cincin + garis radial */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-base)" strokeOpacity="0.45" strokeWidth="0.35" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="var(--border-base)" strokeOpacity="0.18" strokeWidth="0.3" />
            {orbitPos.map((p, i) => {
              const dx = p.x - 50;
              const dy = p.y - 50;
              const dist = Math.hypot(dx, dy) || 1;
              const ix = p.x - (dx / dist) * 14;
              const iy = p.y - (dy / dist) * 14;
              const sway = i % 2 === 0 ? -1 : 1;
              return (
                <path
                  key={i}
                  d={`M50 50 C ${50 + dx * 0.32} ${50 + dy * 0.32 - 10 * sway}, ${ix - dx * 0.2} ${iy - dy * 0.2 + 10 * sway}, ${ix} ${iy}`}
                  fill="none"
                  stroke="var(--border-base)"
                  strokeOpacity="0.3"
                  strokeWidth="0.32"
                />
              );
            })}
            <circle cx="50" cy="50" r="1.1" fill="var(--primary-base)" />
          </svg>

          {/* inti : Mahasiswa */}
          <div className="absolute left-1/2 top-1/2 z-20 w-44 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center rounded-3xl border border-primary/40 bg-primary/10 p-5 text-center shadow-lg shadow-primary/5 backdrop-blur-sm">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">Inti</p>
              <h3 className="mt-0.5 font-heading text-lg font-bold text-text">Mahasiswa</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{impact[0].text}</p>
            </div>
          </div>

          {/* orbit sekeliling */}
          {orbitPos.map((p, i) => {
            const d = impact[i + 1];
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="absolute z-10 w-32 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-1.5 text-xs font-bold text-text">{d.title}</h3>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted">{d.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
