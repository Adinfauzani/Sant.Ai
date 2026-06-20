"use client";

import Link from "next/link";
import { ArrowRight, Globe, Instagram, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const platformLinks = [
  { label: "Showcase", href: "/showcase" },
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "Data Intelligence", href: "/intelligence" },
];

const resourceLinks = [
  { label: "Documentation", href: "#", soon: true },
  { label: "Blog", href: "/articles" },
  { label: "API Reference", href: "#", soon: true },
];

const communityLinks = [
  { label: "GitHub", href: "#" },
  { label: "Discord", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

const socialLinks = [
  { label: "GitHub", href: "#", icon: Globe },
  { label: "Discord", href: "#", icon: Globe },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "YouTube", href: "#", icon: Youtube },
];

function SocialIcon({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:bg-surface hover:text-text transition-colors"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-main py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white">
                SA
              </div>
              <div>
                <span className="block text-sm font-bold leading-tight text-text">Sant.Ai</span>
                <span className="block text-[9px] font-medium tracking-wider text-muted">Science, Technology &amp; Artificial Intelligence</span>
              </div>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Building a collaborative technology ecosystem for students of
              Data Science, Information Systems, and Informatics Engineering
              through real-world projects and innovation.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map((s) => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </div>
            <p className="mt-4 text-[10px] text-muted">
              Universitas Saintek Muhammadiyah · Fakultas Ilmu Komputer
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold text-text">Platform</h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-muted hover:text-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold text-text">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group inline-flex items-center gap-1 text-xs text-muted hover:text-text transition-colors">
                    {link.label}
                    {link.soon && (
                      <span className="rounded bg-primary/10 px-1 py-0.5 text-[8px] font-medium text-primary">Soon</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold text-text">Community</h4>
            <ul className="space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-text">Stay Updated</h3>
            <p className="mt-1 text-xs text-muted">
              Get updates about projects, events, collaborations, and campus innovations.
            </p>
          </div>
          <form
            className="flex w-full shrink-0 gap-2 md:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-1 items-center gap-2 rounded-md border border-border px-3 py-2 transition-colors focus-within:border-primary md:w-64">
              <Send className="h-4 w-4 text-muted" />
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent text-xs text-text outline-none placeholder:text-muted"
              />
            </div>
            <Button size="sm" className="h-10 shrink-0 gap-1.5 text-xs">
              Subscribe <ArrowRight className="h-3 w-3" />
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-main flex flex-col items-center justify-between gap-3 py-5 md:flex-row">
          <p className="text-[10px] text-muted">
            &copy; {new Date().getFullYear()} Sant.Ai - Universitas Saintek Muhammadiyah
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-muted">
            <Link href="/legal/terms" className="hover:text-text transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-text transition-colors">Privacy</Link>
            <Link href="/legal/guidelines" className="hover:text-text transition-colors">Guidelines</Link>
            <Link href="/legal/data" className="hover:text-text transition-colors">Data</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
