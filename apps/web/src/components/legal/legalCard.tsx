import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@santai/ui/button";

export function LegalHomeButton() {
  return (
    <Button asChild variant="secondary" size="sm" className="gap-1.5 px-2.5 text-[11px]">
      <Link href="/">
        <Home className="size-3.5" />
        Beranda
      </Link>
    </Button>
  );
}

export function LegalBackButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="gap-2 text-xs">
      <Link href="/legal">
        <ArrowLeft className="size-3.5" />
        Kembali ke Pusat Legal
      </Link>
    </Button>
  );
}

export function LegalCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-5 transition-colors duration-150 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
        <span className="text-sm font-bold">→</span>
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <p className="mt-4 text-xs font-semibold text-primary transition-transform duration-150 group-hover:translate-x-1">
        Baca kebijakan
      </p>
    </Link>
  );
}
