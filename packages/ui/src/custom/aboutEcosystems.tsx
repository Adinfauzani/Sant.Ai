"use client";

import { ScientificBackground } from "../scientificBackground";
import { Sparkles, Library, Cpu, Microscope, ArrowRight } from "lucide-react";
import Link from "next/link";

const ecosystems = [
  {
    icon: Sparkles,
    title: "AI MU",
    text: "Ekosistem kecerdasan buatan yang jadi ujung tombak transformasi digital Muhammadiyah. Kamu ikut membangun solusi AI: asisten virtual, otomasi layanan, sampai chatbot yang beneran dipakai lembaga dan masyarakat.",
  },
  {
    icon: Library,
    title: "Learning Ecosystem",
    text: "Belajar bareng mahasiswa senior, mentor, dan praktisi industri. Proses nggak berhenti di satu semester, terus berkembang seiring makin kompleksnya proyek yang kamu kerjain.",
  },
  {
    icon: Cpu,
    title: "Technology Ecosystem",
    text: "Jelajah berbagai domain: web, mobile, cloud, IoT, keamanan siber, sampai AI. Semua dikelola terstruktur biar tiap proyek pakai praktik terbaik industri.",
  },
  {
    icon: Microscope,
    title: "Research Ecosystem",
    text: "Lebih dari bikin produk. Kamu didorong riset, bikin prototipe inovatif, publikasi, sampai berkontribusi ke proyek open source.",
  },
];

export function AboutEcosystems() {
  return (
    <section className="relative border-t border-border section-padding">
      <ScientificBackground variant="circuit" className="absolute inset-0">
        <div className="absolute inset-0 bg-background/80" />
      </ScientificBackground>

      {/* single-accent canvas shape */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-[3rem] bg-primary/10" />
        <div className="absolute -left-20 bottom-16 h-64 w-64 rotate-12 rounded-2xl border border-primary/15" />
      </div>

      <div className="container-main relative">
        <div className="section-header text-center">
          <p className="section-label">Ekosistem</p>
          <h2 className="editorial-md text-text">Empat ekosistem, satu perjalanan</h2>
          <p className="section-desc mx-auto">
            Kamu nggak cuma belajar, tapi sekalian riset, bikin teknologi, dan jadi bagian dari solusi AI. Semuanya saling nyambung.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {ecosystems.map((e, i) => {
            const Icon = e.icon;
            const isAI = e.title === "AI MU";
            if (isAI) {
              return (
                <div
                  key={e.title}
                  className="relative flex h-full flex-col overflow-hidden rounded-xl border border-primary/40 bg-card p-8 lg:col-span-1 lg:row-span-2"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -right-10 size-56 rounded-full bg-primary/10"
                  />
                  <div className="relative flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-5 flex size-12 items-center justify-center rounded-lg border border-primary/30 bg-primary text-primary-foreground">
                        <Icon className="size-6" />
                      </div>
                      <p className="text-xs font-bold tracking-widest text-primary uppercase">
                        Ujung tombak AI
                      </p>
                      <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-text lg:text-3xl">
                        AI MU
                      </h3>
                    </div>
                    <p className="mt-6 text-[15px] leading-relaxed text-text lg:text-base">
                      Ekosistem kecerdasan buatan yang jadi{" "}
                      <span className="font-bold text-primary">
                        ujung tombak transformasi digital Muhammadiyah
                      </span>
                      . Kamu ikut membangun solusi AI yang beneran dipakai lembaga dan masyarakat: dari
                      asisten virtual, otomasi layanan, sampai chatbot cerdas di berbagai amal usaha.
                      Bukan cuma belajar AI, kamu bikin AI yang kegunaannya langsung kerasa.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {["AI Assistant", "Automation", "Chatbot"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={e.title}
                className={`relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors duration-150 hover:border-border-strong lg:col-span-1 lg:row-span-1 ${i === 3 ? "lg:col-start-2" : ""}`}
              >
                <div>
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-text">{e.title}</h3>
                </div>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">{e.text}</p>
              </div>
            );
          })}

          <div className="flex h-full flex-col items-start justify-between overflow-hidden rounded-xl border border-dashed border-border-strong bg-surface/50 p-6">
            <p className="font-heading text-base font-bold text-text">Mulai di Sant.Ai</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Semua ekosistem ini berjalan berdampingan. Pilih jalurmu dan ikut bangun kolaborasi.
            </p>
            <Link
              href="/community"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Tata cara gabung <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
