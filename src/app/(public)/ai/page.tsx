"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Brain,
  FileSearch,
  BookOpenText,
  Search,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const features = [
  {
    title: "AI Workspace",
    description:
      "Collaborative environment for building and deploying AI models with integrated tools and real-time team sync.",
    icon: Brain,
  },
  {
    title: "AI Research Assistant",
    description:
      "Intelligent research companion that helps analyze papers, extract insights, and generate citations.",
    icon: FileSearch,
  },
  {
    title: "AI Summarizer",
    description:
      "Condense long articles, papers, and documents into concise, actionable summaries.",
    icon: BookOpenText,
  },
  {
    title: "AI Learning Companion",
    description:
      "Personalized tutor that adapts to your learning style and helps master complex topics.",
    icon: Sparkles,
  },
  {
    title: "AI Search",
    description:
      "Semantic search across research papers, community discussions, and curated knowledge bases.",
    icon: Search,
  },
];

export default function AIPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // TODO: integrate waitlist API
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="section-padding">
          <div className="container-main">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Coming Soon
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-text md:text-5xl">
                Sant.Ai{" "}
                <span className="text-primary">Intelligence</span>
              </h1>
              <p className="mt-3 text-sm text-muted md:text-base">
                Science &middot; Technology &middot; Artificial Intelligence
              </p>
              <p className="mx-auto mt-4 max-w-lg text-xs text-muted/80 md:text-sm">
                The future of collaborative intelligence is being built.
                Sant.Ai Intelligence will empower researchers, students, and
              innovators with cutting-edge AI tools designed for the
                academic ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container-main">
          <div className="border-t border-border/50" />
        </div>

        {/* Features */}
        <section className="section-padding">
          <div className="container-main">
            <div className="mx-auto max-w-3xl space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group flex items-start gap-4 rounded-xl border border-border/50 bg-surface/30 p-4 transition-all hover:border-primary/20 hover:bg-surface/50 md:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-text md:text-base">
                        {feature.title}
                      </h3>
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                        Coming Soon
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted md:text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted/40 transition-colors group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container-main">
          <div className="border-t border-border/50" />
        </div>

        {/* Waitlist */}
        <section className="section-padding">
          <div className="container-main">
            <div className="mx-auto max-w-md text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-text">
                Join the Waitlist
              </h2>
              <p className="mt-2 text-sm text-muted">
                Be the first to experience the future of Sant.Ai
                Intelligence.
              </p>

              {submitted ? (
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    You&apos;re on the list! We&apos;ll notify you when
                    we launch.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 rounded-lg border border-border bg-surface/50 px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Notify Me"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Roadmap preview */}
        <section className="pb-24">
          <div className="container-main">
            <div className="mx-auto max-w-lg rounded-2xl border border-border/50 bg-surface/20 p-6 text-center">
              <h3 className="text-sm font-semibold text-text">
                Product Roadmap Preview
              </h3>
              <div className="mt-4 space-y-3 text-left">
                {[
                  { phase: "Q3 2026", label: "AI Search & Research Assistant Beta" },
                  { phase: "Q4 2026", label: "AI Workspace & Summarizer" },
                  { phase: "Q1 2027", label: "AI Learning Companion & Full Launch" },
                ].map((item) => (
                  <div
                    key={item.phase}
                    className="flex items-center gap-3 rounded-lg border border-border/30 bg-surface/30 px-3 py-2"
                  >
                    <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {item.phase}
                    </span>
                    <span className="text-xs text-text">{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-muted">
                Timeline subject to change as we refine and expand the
                Intelligence ecosystem.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
