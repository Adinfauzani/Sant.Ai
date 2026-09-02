"use client";

import { Button } from "../button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";



export function AboutCta() {
  return (
    <section className="relative overflow-hidden border-t border-border section-padding" style={{ backgroundColor: "var(--blue-9)" }}>
      {/* canvas shapes inside the solid color */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-10 top-10 h-24 w-24 rotate-12 rounded-2xl border-2 border-white/20" />
        <div className="absolute right-12 top-8 h-16 w-16 rounded-full bg-white/10" />
        <div className="absolute bottom-12 left-16 h-14 w-14 rotate-45 rounded-lg border-2 border-white/20" />
        <div className="absolute bottom-10 right-14 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute left-1/4 top-6 h-2.5 w-2.5 rounded-full bg-white/40" />
        <div className="absolute right-1/4 bottom-8 h-3 w-3 rounded-full bg-white/30" />
        <div className="absolute left-8 bottom-1/2 h-2 w-2 rounded-full bg-white/40" />
        <div className="absolute right-8 top-1/2 h-3 w-3 rounded-full bg-white/30" />
      </div>
      <div className="container-main relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label text-white/70">Mulai dari sini</p>
          <h2 className="editorial-lg text-white">From campus to industry</h2>
          <p className="section-desc mx-auto mt-4 text-white/80">
            Dari kampus ke industri, dari ide ke dampak. Giliran kamu bangun karya yang beneran kepake.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                Gabung sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" size="lg" className="border-2 border-white bg-black/25 font-medium text-white hover:bg-black/40">
                Jelajahi komunitas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
