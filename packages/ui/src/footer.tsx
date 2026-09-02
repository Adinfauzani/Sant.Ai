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
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:bg-surface hover:text-text transition-colors"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-border">
      <ScientificBackground variant="dot-matrix" className="absolute inset-0 opacity-30" />
      <div className="container-main relative py-12 md:py-16">
        <div className="grid grid-cols-2 items-start gap-x-8 gap-y-10 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-y-6">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/assets/Sant.ai.png" alt="Sant.Ai" width={28} height={28} className="h-7 w-7 rounded-md" />
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
            <h4 className="mb-4 text-sm font-semibold text-text">Platform</h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group inline-flex items-center gap-1 text-sm text-muted hover:text-text transition-colors">
                    {link.label}
                    {link.soon && (
                      <span className="rounded bg-primary/10 px-1 py-0.5 text-[9px] font-medium text-primary">Soon</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="mb-4 text-sm font-semibold text-text">Help</h4>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className="text-sm text-muted hover:text-text transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-text transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
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
