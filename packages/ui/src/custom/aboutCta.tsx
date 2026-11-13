"use client";

import { Button } from "../button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AboutCta() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-text section-padding">
      {/* canvas shapes inside the inverted band */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background/10" />
        <div className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background/10" />
        <div className="absolute left-1/4 top-6 size-2.5 rounded-full bg-background/30" />
        <div className="absolute right-1/4 bottom-8 size-3 rounded-full bg-background/20" />
      </div>

      <div className="container-main relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label text-background/60">Mulai dari sini</p>
          <h2 className="editorial-lg text-background">From campus to industry</h2>
          <p className="section-desc mx-auto mt-4 text-background/70">
            Dari kampus ke industri, dari ide ke dampak. Giliran kamu bangun karya yang beneran kepake.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/register">
                Gabung sekarang <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-background/40 bg-transparent text-background hover:bg-background/10"
              asChild
            >
              <Link href="/community">Jelajahi komunitas</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
