"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LegalHomeButton } from "@/components/legal/legal-card";

const legalNav = [
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Community Guidelines", href: "/legal/guidelines" },
  { label: "Data Policy", href: "/legal/data" },
];

export function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_30%)]" />
        <div className="container-main relative py-12 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Legal Center
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-text md:text-6xl">
              Trust, Privacy, and Responsible Collaboration
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Transparansi kebijakan, privasi, standar komunitas, dan pemanfaatan data publik untuk ekosistem SANTET.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-muted">
              <span className="rounded-full border border-border bg-surface/50 px-3 py-1.5">Last Updated: 14 Jun 2026</span>
              <span className="rounded-full border border-border bg-surface/50 px-3 py-1.5">Version 0.1.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main pb-20">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface/40 p-3 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 pb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Legal Navigation
                </p>
                <LegalHomeButton />
              </div>
              <nav className="space-y-0.5">
                {legalNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-3 py-2 text-sm transition-all",
                        active
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-muted hover:bg-surface hover:text-text",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
