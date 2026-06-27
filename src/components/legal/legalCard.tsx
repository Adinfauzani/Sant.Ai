import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LegalHomeButton() {
  return (
    <Button asChild variant="secondary" size="sm" className="gap-1.5 px-2.5 text-[11px]">
      <Link href="/">
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
    </Button>
  );
}

export function LegalBackButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="gap-2 text-xs">
      <Link href="/legal">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Legal Center
      </Link>
    </Button>
  );
}

export function LegalCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/[0.04] hover:shadow-lg hover:shadow-primary/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
        <span className="text-sm font-bold">→</span>
      </div>
      <h3 className="mt-5 font-heading text-lg font-bold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <p className="mt-5 text-xs font-semibold text-primary transition-all group-hover:translate-x-1">Read policy</p>
    </Link>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface/35 p-5 backdrop-blur-xl md:p-7">
      <h2 className="font-heading text-2xl font-bold text-text">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}
