"use client";

import { GitCommit, Tag, Calendar } from "lucide-react";

const roadmap = [
  {
    year: "2026",
    title: "Fondasi",
    text: "Bentuk struktur, onboarding anggota, standarisasi alur kerja, dan mulai proyek pertama.",
  },
  {
    year: "2027",
    title: "Penguatan Ekosistem",
    text: "Perluas tim, jalin kemitraan awal, mulai riset terstruktur, dan rancang arsitektur AI MU.",
  },
  {
    year: "2028",
    title: "Ekspansi Kolaborasi",
    text: "Perluas kemitraan industri, buka program magang, dorong publikasi dan open source.",
  },
  {
    year: "2029",
    title: "Skalabilitas",
    text: "Tangani proyek yang lebih besar, terapkan standar kualitas, perluas AI MU, bangun jejaring alumni.",
  },
  {
    year: "2030",
    title: "Ekosistem Matang",
    text: "Jadi ekosistem inovasi yang berkelanjutan, berdampak ke teknologi Indonesia, dan AI MU jadi pilar digital Muhammadiyah.",
  },
];

export function AboutRoadmap() {
  return (
    <section className="relative overflow-hidden border-t border-border section-padding">
      {/* single-accent canvas shape */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="container-main relative">
        <div className="section-header text-center">
          <p className="section-label">Roadmap</p>
          <h2 className="editorial-md text-text">Perjalanan 2026 sampai 2030</h2>
          <p className="section-desc mx-auto">
            Dari fondasi kecil sampai jadi ekosistem yang matang. Satu langkah tiap tahun.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {roadmap.map((item, i) => (
            <div key={item.year} className="relative flex gap-5 pb-10 last:pb-0">
              {/* git node + spine */}
              <div className="relative flex flex-col items-center">
                <span className="z-10 grid size-9 shrink-0 place-items-center rounded-full border-2 border-primary/40 bg-background text-primary">
                  <GitCommit className="size-4" />
                </span>
                {i < roadmap.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>

              {/* konten */}
              <div className="min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                    <Tag className="size-3" />
                    v{i + 1}.0
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
                    <Calendar className="size-3" />
                    {item.year}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[11px] text-muted">
                  git tag -a v{i + 1}.0 -m "{item.title.toLowerCase()}"
                </p>
                <h3 className="mt-2 font-heading text-lg font-bold tracking-tight text-text">
                  {item.title}
                </h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
