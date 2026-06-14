"use client";

import Link from "next/link";
import { ArrowRight, Github, Globe, Instagram, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const platformLinks = [
  { label: "Home", href: "/" },
  { label: "Showcase", href: "/showcase" },
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "Data Intelligence", href: "/intelligence" },
];

const resourceLinks = [
  { label: "Documentation", href: "#" },
  { label: "Guidelines", href: "#" },
  { label: "Project Handbook", href: "#" },
  { label: "Community Rules", href: "#" },
  { label: "FAQ", href: "#" },
];

const socialLinks = [
  { label: "GitHub", href: "#", icon: Github },
  { label: "Discord", href: "#", icon: Globe },
  { label: "LinkedIn", href: "#", icon: Globe },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "YouTube", href: "#", icon: Youtube },
];

const stats = [
  { value: "45+", label: "Projects Created" },
  { value: "180+", label: "Active Members" },
  { value: "32", label: "Completed Projects" },
  { value: "6", label: "Data Insights" },
];

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-surface/50 p-4 text-center backdrop-blur-sm transition-all hover:border-primary/20">
      <p className="font-heading text-2xl font-bold text-text">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted">{label}</p>
    </div>
  );
}

function SocialIcon({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/50 text-muted shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-lg hover:shadow-primary/10"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/30">
      <div className="border-b border-border/50">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>

      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <span className="text-base font-bold text-white">S</span>
              </div>
              <div>
                <span className="block text-base font-bold leading-tight text-text">
                  SANTET
                </span>
                <span className="block text-[9px] font-medium tracking-[0.15em] text-muted">
                  Sains &amp; Technology
                </span>
              </div>
            </Link>

            <p className="mt-5 text-xs leading-relaxed text-muted">
              Building a collaborative technology ecosystem for students of
              Data Science, Information Systems, and Informatics Engineering
              through real-world projects and innovation.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-mono text-[10px] font-semibold text-blue-400">
                SD
              </span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-semibold text-emerald-400">
                TI
              </span>
              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 font-mono text-[10px] font-semibold text-purple-400">
                SI
              </span>
            </div>

            <p className="mt-3 text-[10px] text-muted">
              Universitas Saintek Muhammadiyah · Fakultas Ilmu Komputer
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((s) => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-text">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {platformLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted transition-colors hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-text">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted transition-colors hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-text">
                Stay Updated
              </h3>
              <p className="mt-1 text-xs text-muted">
                Get updates about projects, events, collaborations, and campus innovations.
              </p>
            </div>
            <form
              className="flex w-full shrink-0 gap-2 md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface/50 px-3 py-2 transition-colors focus-within:border-primary/30 md:w-64">
                <Send className="h-4 w-4 text-muted" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent text-xs text-text outline-none placeholder:text-muted"
                />
              </div>
              <Button size="sm" className="h-10 shrink-0 gap-1.5 text-xs">
                Subscribe
                <ArrowRight className="h-3 w-3" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="container-main flex flex-col items-center justify-between gap-3 py-5 md:flex-row">
          <p className="text-[10px] text-muted">
            &copy; {new Date().getFullYear()} SANTET - Universitas Saintek Muhammadiyah
          </p>
          <p className="text-[10px] text-muted">
            Fakultas Ilmu Komputer ·{" "}
            <span className="text-blue-400">SD</span> ·{" "}
            <span className="text-emerald-400">TI</span> ·{" "}
            <span className="text-purple-400">SI</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] text-muted">
            <Link href="/legal/terms" className="transition-colors hover:text-text">Terms of Service</Link>
            <Link href="/legal/privacy" className="transition-colors hover:text-text">Privacy Policy</Link>
            <Link href="/legal/guidelines" className="transition-colors hover:text-text">Community Guidelines</Link>
            <Link href="/legal/data" className="transition-colors hover:text-text">Data Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
