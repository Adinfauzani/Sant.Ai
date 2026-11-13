"use client";

import { Button } from "../button";
import { ScientificBackground } from "../scientificBackground";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden section-padding">
      <ScientificBackground variant="neural" className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </ScientificBackground>

      <div className="container-main relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 editorial-label">About Sant.Ai</p>
          <h1 className="editorial-xl text-text">Kuliah itu penting. Tapi nggak cukup.</h1>
          <p className="mt-6 editorial-body mx-auto text-muted">
            Sant.Ai hadir biar ilmu yang kamu pelajari di kelas beneran kepake. Bangun proyek nyata, kerja
            tim ala industri, dan pulang kuliah dengan portofolio, bukan cuma nilai.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/register">
                Gabung sekarang <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/showcase">Lihat karya mahasiswa</Link>
            </Button>
          </div>
        </div>

        {/* Apa itu Sant.Ai */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          {/* canvas shapes */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 size-40 rounded-full bg-primary/10 blur-2xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/20"
          />

          <div className="relative rounded-xl border border-border bg-card p-6 sm:p-10">
            <p className="editorial-label">Apa itu Sant.Ai?</p>
            <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-text sm:text-base">
              <p>
                Sant.Ai adalah{" "}
                <span className="font-bold text-primary">Innovation &amp; Technology Hub</span> di bawah
                Fakultas Ilmu Komputer Universitas Saintek Muhammadiyah. Bukan komunitas biasa yang
                sekadar kumpul dan nongkrong. Ini wadah tempat{" "}
                <span className="font-semibold">ide, talenta, dan kebutuhan nyata</span> bisa ketemu di
                satu titik, lalu beneran dikerjain sampai jadi produk yang dipakai orang.
              </p>
              <p>
                Di sini kamu nggak cuma diajarin teori. Kamu{" "}
                <span className="font-semibold">langsung dicemplungin ke proyek nyata</span> dengan standar
                kerja industri, mulai dari version control, code review, testing, sampai cara kerja tim ala
                Agile. Semua biar yang kamu pelajari,{" "}
                <span className="text-primary font-medium">langsung kepake</span>, bukan cuma numpuk di
                catatan.
              </p>
              <p>
                Jadi, kalau kamu capek sama tugas yang hasilnya cuma jadi arsip, Sant.Ai adalah tempatmu
                berkembang.{" "}
                <span className="font-semibold text-text">Dari kampus ke industri, dari ide ke dampak,</span>{" "}
                kamu yang bikin jalanmu sendiri. Gabung, bikin karya, terus tunjukin ke dunia bahwa mahasiswa
                juga bisa bikin teknologi yang berdampak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
