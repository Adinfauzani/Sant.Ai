"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@santai/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </div>

      <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        Terjadi kesalahan
      </p>
      <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-text">
        Ada yang tidak beres
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Halaman ini gagal dimuat. Coba lagi, atau kembali ke beranda kalau masalahnya
        masih berlanjut.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" className="gap-2" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
          Coba lagi
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg">
            Kembali ke beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
