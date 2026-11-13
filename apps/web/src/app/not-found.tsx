import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@santai/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface text-primary">
        <Compass className="h-5 w-5" aria-hidden="true" />
      </div>

      <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        Error 404
      </p>
      <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-text">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Alamat yang kamu buka sudah berubah atau tidak pernah ada. Coba kembali ke
        beranda atau jelajahi karya mahasiswa di showcase.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button size="lg" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke beranda
          </Button>
        </Link>
        <Link href="/showcase">
          <Button variant="outline" size="lg">
            Lihat showcase
          </Button>
        </Link>
      </div>
    </div>
  );
}
