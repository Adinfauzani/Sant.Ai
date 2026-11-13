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
      {/* single-accent canvas shape */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
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
          {impact.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-4" />
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
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
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
            <div className="flex flex-col items-center rounded-xl border border-primary/40 bg-primary/10 p-5 text-center">
              <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-5" />
              </span>
              <p className="mt-2 text-xs font-bold tracking-widest text-primary uppercase">Inti</p>
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
                <div className="flex flex-col items-center rounded-xl border border-border bg-card p-3 text-center">
                  <span className="grid size-8 place-items-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-4" />
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
