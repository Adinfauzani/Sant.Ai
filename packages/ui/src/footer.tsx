"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Youtube, Send, Github, Linkedin } from "lucide-react";
import { Button } from "./button";
import { ScientificBackground } from "./scientificBackground";

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

const helpLinks = [
  { label: "Support", href: "#" },
  { label: "Troubleshooting", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Status", href: "/status" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "GitHub", href: "https://github.com/Adinfauzani/Sant.Ai", icon: Github },
  { label: "LinkedIn", href: "#", icon: Linkedin },
];

function SocialIcon({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-border-strong hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3.5 font-heading text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
      {children}
    </h4>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <ScientificBackground variant="dot-matrix" className="absolute inset-0 opacity-25" />
      <div className="container-main relative py-14 md:py-16">
        <div className="grid grid-cols-2 items-start gap-x-8 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-y-6">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Image
                src="/assets/Sant.ai.png"
                alt=""
                width={26}
                height={26}
                className="h-[26px] w-[26px] rounded-md"
              />
              <div>
                <span className="block font-heading text-sm font-semibold leading-tight tracking-tight text-text">
                  Sant.Ai
                </span>
                <span className="block font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-muted">
                  Science · Tech · AI
                </span>
              </div>
            </Link>
            <p className="mt-3.5 max-w-xs text-xs leading-relaxed text-muted">
              Membangun ekosistem teknologi kolaboratif untuk mahasiswa Data Science,
              Sistem Informasi, dan Teknik Informatika lewat proyek nyata dan
              inovasi.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((s) => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </div>
            <p className="mt-5 font-mono text-[10px] text-muted/80">
              Universitas Saintek Muhammadiyah · Fakultas Ilmu Komputer
            </p>
          </div>

          <div>
            <FooterHeading>Platform</FooterHeading>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Resources</FooterHeading>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                    {link.soon && (
                      <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-muted">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <FooterHeading>Help</FooterHeading>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-text"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted transition-colors hover:text-text"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-tight text-text">
              Tetap update
            </h3>
            <p className="mt-1 text-xs text-muted">
              Kabari proyek, event, kolaborasi, dan inovasi kampus.
            </p>
          </div>
          <form
            className="flex w-full shrink-0 flex-col gap-2 sm:flex-row md:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="footer-email">
              Alamat email
            </label>
            <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring md:w-64">
              <Send className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
              <input
                id="footer-email"
                type="email"
                placeholder="nama@email.com"
                className="flex-1 bg-transparent py-2 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted"
              />
            </div>
            <Button size="sm" className="h-9 shrink-0 gap-1.5 text-xs">
              Subscribe <ArrowRight className="h-3 w-3" />
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-main flex flex-col items-center justify-between gap-3 py-5 md:flex-row">
          <p className="font-mono text-[10px] text-muted">
            &copy; {new Date().getFullYear()} Sant.Ai — Universitas Saintek Muhammadiyah
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {[
              { label: "Terms", href: "/legal/terms" },
              { label: "Privacy", href: "/legal/privacy" },
              { label: "Guidelines", href: "/legal/guidelines" },
              { label: "Data", href: "/legal/data" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[11px] text-muted transition-colors hover:text-text"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
