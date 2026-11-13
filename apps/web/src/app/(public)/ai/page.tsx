"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import {
  Sparkles, Search, ArrowRight,
  Bot, Check, Timer, Users, FileText, Book, CheckSquare, FolderKanban,
  Globe, ChevronDown,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { Button } from "@santai/ui/button";
import { TwinOrbit } from "@santai/ui/twinOrbit";

const features = [
  {
    id: "ai-chat",
    badge: "AI Chat",
    title: "Percakapan yang memahami konteks",
    description:
      "Percakapan alami yang ditenagai Sant.Ai Intelligence. Didesain untuk membantu mahasiswa, developer, dan peneliti memecahkan masalah, menghasilkan ide, dan menjawab pertanyaan kompleks.",
    highlights: ["Kesadaran Konteks", "Generasi Kode", "Multibahasa", "Memori Cerdas"],
    mockup: <ChatMockup />,
  },
  {
    id: "ai-workspace",
    badge: "AI Workspace",
    title: "Semua bekerja dalam satu ruang",
    description:
      "Lingkungan kolaboratif tempat proyek, berkas, percakapan, catatan, dan AI bekerja bersama dalam satu ruang yang terhubung.",
    highlights: ["Organisasi Proyek", "Konteks AI", "Kolaborasi Tim", "Manajemen Berkas"],
    mockup: <WorkspaceMockup />,
  },
  {
    id: "ai-learning",
    badge: "AI Learning Companion",
    title: "Beradaptasi dengan cara kamu belajar",
    description:
      "Mentor akademik cerdas yang menyesuaikan gaya belajar setiap mahasiswa dengan bimbingan personal dan kuis interaktif.",
    highlights: ["Pembelajaran Personal", "Tutor AI", "Kuis Interaktif", "Pelacakan Progres"],
    mockup: <LearningMockup />,
  },
  {
    id: "ai-research",
    badge: "AI Research Assistant",
    title: "Percepat risetmu",
    description:
      "Percepat riset akademik dengan analisis makalah, generator kutipan, ekstraksi pengetahuan, dan ringkasan dokumen berbasis AI.",
    highlights: ["Analisis Makalah", "Generator Kutipan", "Peringkas AI", "Graf Pengetahuan"],
    mockup: <ResearchMockup />,
  },
  {
    id: "ai-search",
    badge: "AI Search",
    title: "Temukan yang penting",
    description:
      "Pencarian semantik lintas makalah riset, sumber daya kampus, dokumentasi, diskusi, dan basis pengetahuan terkurasi.",
    highlights: ["Pencarian Semantik", "Makalah Riset", "Pengetahuan Komunitas", "Penemuan Cerdas"],
    mockup: <SearchMockup />,
  },
];

function ChatMockup() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Bot className="size-3.5" />
          </div>
          <div className="max-w-[80%] rounded-lg bg-surface/60 px-3.5 py-2.5 text-xs leading-relaxed text-text">
            Halo! Saya AI MU. Bisa bantu riset, ngoding, belajar, dan banyak lagi. Mau eksplorasi apa
            hari ini?
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Ringkas makalah", "Tulis kode", "Jelaskan konsep"].map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-border bg-card px-2 py-0.5 text-[10px] text-muted"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-start justify-end gap-2.5">
          <div className="max-w-[75%] rounded-lg bg-primary/10 px-3.5 py-2.5 text-xs leading-relaxed text-text">
            Bisa bantu saya memahami cara kerja transformer neural network?
          </div>
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-surface text-[10px] font-medium text-text">
            K
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Bot className="size-3.5" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-surface/60 px-4 py-3">
            <TwinOrbit className="size-3.5 text-primary" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-surface/20 px-3 py-2">
        <input
          disabled
          className="flex-1 bg-transparent text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted"
          placeholder="Tanya AI MU apa saja..."
        />
        <div className="flex size-6 items-center justify-center rounded-sm bg-primary text-primary-foreground">
          <ArrowRight className="size-3" />
        </div>
      </div>
    </div>
  );
}

function WorkspaceMockup() {
  return (
    <div className="flex h-full gap-4">
      <div className="w-28 shrink-0 space-y-1.5">
        {[
          { icon: FolderKanban, label: "Proyek" },
          { icon: FileText, label: "Berkas" },
          { icon: Book, label: "Catatan" },
          { icon: CheckSquare, label: "Tugas" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[10px] ${
                i === 0
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted hover:bg-surface/40"
              }`}
            >
              <Icon className="size-3" />
              {s.label}
            </div>
          );
        })}
      </div>
      <div className="flex-1 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          {[
            { title: "Analisis Neural Network", files: "12", members: "3" },
            { title: "Makalah Riset NLP", files: "8", members: "2" },
            { title: "Desain Data Pipeline", files: "15", members: "4" },
            { title: "Pelatihan Model ML", files: "6", members: "2" },
          ].map((p) => (
            <div key={p.title} className="rounded-md border border-border bg-surface/30 p-2.5">
              <p className="text-[11px] font-medium text-text">{p.title}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[9px] text-muted">
                <span className="flex items-center gap-1">
                  <FileText className="size-2.5" />
                  {p.files}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-2.5" />
                  {p.members}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LearningMockup() {
  return (
    <div className="flex h-full flex-col space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-text">Pengantar Machine Learning</p>
          <p className="text-[10px] text-muted">Modul 4 dari 12 &middot; Supervised Learning</p>
        </div>
        <span className="shrink-0 rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
          Sedang Berjalan
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-border">
        <div className="h-2 w-[35%] rounded-full bg-success" />
      </div>
      <div className="rounded-lg border border-border bg-surface/20 p-4">
        <p className="text-[11px] font-medium text-text">Pertanyaan 4 dari 10</p>
        <p className="mt-2 text-xs leading-relaxed text-text">
          Apa tujuan utama dari supervised learning?
        </p>
        <div className="mt-3 space-y-1.5">
          {[
            "Menemukan pola tersembunyi pada data tanpa label",
            "Mempelajari pemetaan dari input ke output menggunakan data berlabel",
            "Mengelompokkan titik data yang serupa",
          ].map((opt, i) => (
            <div
              key={i}
              className={`rounded-md border px-3 py-2 text-[11px] ${
                i === 1
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border text-text"
              }`}
            >
              {i === 1 && <Check className="mr-1.5 inline size-3" />}
              {opt}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted">
        <span>
          <Check className="mr-1 inline size-3 text-success" />
          Skor: 75%
        </span>
        <span className="flex items-center gap-1">
          <Timer className="size-3" />
          12:34 tersisa
        </span>
      </div>
    </div>
  );
}

function ResearchMockup() {
  return (
    <div className="flex h-full gap-4">
      <div className="w-28 shrink-0 space-y-1.5">
        {["Abstrak", "Pendahuluan", "Metodologi", "Hasil", "Kutipan"].map((s, i) => (
          <div
            key={s}
            className={`rounded-md px-2.5 py-1.5 text-[10px] ${
              i === 0
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted hover:bg-surface/40"
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-text">Attention Is All You Need</span>
          <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
            Dirangkum
          </span>
        </div>
        <p className="text-pretty text-[11px] leading-relaxed text-text">
          Model penerjemahan sekuens terbaik saat ini berbasis pada jaringan saraf berulang yang
          kompleks... Model terbaik menghubungkan encoder dan decoder melalui mekanisme attention.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["Ekstrak Poin Kunci", "Kutip Ini", "Temukan Serupa"].map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-card px-2 py-0.5 text-[9px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchMockup() {
  return (
    <div className="flex h-full flex-col space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface/20 px-3.5 py-2.5">
        <Search className="size-3.5 shrink-0 text-muted" />
        <input
          disabled
          placeholder="Cari makalah riset, diskusi, dokumentasi..."
          className="flex-1 bg-transparent text-[11px] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
          Semantik
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {["Semua", "Makalah", "Komunitas", "Dokumen"].map((f, i) => (
          <span
            key={f}
            className={`rounded-md px-2 py-1 text-[9px] ${
              i === 0 ? "bg-primary/10 font-medium text-primary" : "text-muted"
            }`}
          >
            {f}
          </span>
        ))}
      </div>
      <div className="flex-1 space-y-2">
        {[
          { title: "Transformer Models dalam NLP: Survei Komprehensif", source: "Makalah Riset · 2024" },
          { title: "Membangun Microservices Skalabel dengan Node.js", source: "Diskusi Komunitas · 15 balasan" },
          { title: "Pengantar Reinforcement Learning", source: "Materi Kursus · Universitas Indonesia" },
        ].map((r) => (
          <div key={r.title} className="rounded-md border border-border bg-surface/10 p-2.5">
            <p className="text-[11px] font-medium text-text">{r.title}</p>
            <p className="mt-0.5 text-[9px] text-muted">{r.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const faqs = [
  { q: "Apa itu AI MU?", a: "AI MU adalah platform AI unggulan Sant.Ai yang dirancang khusus untuk universitas, mahasiswa, developer, dan komunitas. Menyediakan alat cerdas untuk riset, belajar, kolaborasi, dan inovasi dalam ekosistem akademik." },
  { q: "Kapan AI MU diluncurkan?", a: "AI MU sedang dalam pengembangan aktif. Fitur diluncurkan bertahap: AI Search & Research Assistant pada Q3 2026, AI Workspace & Summarizer pada Q4 2026, dan peluncuran platform penuh pada Q1 2027." },
  { q: "Apakah AI MU gratis untuk mahasiswa?", a: "Ya. AI MU gratis untuk semua pengguna Sant.Ai, dengan tingkatan premium untuk fitur lanjutan. Mahasiswa dan dosen mendapat akses penuh sebagai bagian dari ekosistem universitas." },
  { q: "Bisakah saya berkontribusi pada pengembangan AI MU?", a: "Tentu. AI MU dibangun dengan masukan langsung dari komunitas. Bergabung dengan komunitas untuk akses awal, ikut beta testing, dan beri masukan yang membentuk platform ini." },
  { q: "Apa yang membuat AI MU berbeda dari alat AI lain?", a: "AI MU dibangun khusus untuk ekosistem akademik. Terintegrasi dengan komunitas, proyek, dan basis pengetahuan Sant.Ai, memberikan bantuan AI kontekstual bagi mahasiswa, peneliti, dan developer." },
];

const roadmap = [
  { phase: "Q3 2026", label: "AI Search & Research Assistant Beta", status: "Dalam Pengembangan" },
  { phase: "Q4 2026", label: "AI Workspace & Summarizer", status: "Berikutnya" },
  { phase: "Q1 2027", label: "AI Learning Companion & Peluncuran Penuh", status: "Direncanakan" },
];

function FeatureBody({ feature }: { feature: (typeof features)[number] }) {
  return (
    <>
      <div className="space-y-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
          <Sparkles className="size-3" />
          {feature.badge}
        </span>
        <h2 className="editorial-lg text-balance text-text">{feature.title}</h2>
        <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted">
          {feature.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {feature.highlights.map((h) => (
            <span
              key={h}
              className="flex items-center gap-1 rounded-md border border-border bg-surface/50 px-2.5 py-1 text-xs text-text"
            >
              <Check className="size-3 text-primary" />
              {h}
            </span>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="relative rounded-xl border border-border bg-card p-5">{feature.mockup}</div>
      </div>
    </>
  );
}

export default function AIPage() {
  const container = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  // Hormati preferensi pengguna: tanpa pinning GSAP & tanpa smooth-scroll.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Kalau preferensi berubah saat runtime, matikan scroll trigger yang aktif.
  useEffect(() => {
    if (!reduced) return;
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [reduced]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.registerPlugin(ScrollTrigger);

      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
      if (panels.length === 0) return;

      panels.forEach((panel, i) => {
        if (i === 0) {
          gsap.set(panel, { y: "0%", scale: 1, opacity: 1 });
        } else {
          gsap.set(panel, { y: "100%", scale: 0.7, opacity: 0 });
        }
      });

      const dots = dotsRef.current?.querySelectorAll<HTMLDivElement>(".dot");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${window.innerHeight * (panels.length * 3)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          onUpdate: (self) => {
            if (!dots || dots.length === 0) return;
            const idx = Math.min(Math.floor(self.progress * panels.length), panels.length - 1);
            dots.forEach((dot, i) => {
              if (i === idx) {
                dot.style.width = "1.5rem";
                dot.style.backgroundColor = "var(--color-primary)";
              } else {
                dot.style.width = "0.375rem";
                dot.style.backgroundColor = "";
              }
            });
          },
        },
      });

      for (let i = 0; i < panels.length - 1; i++) {
        const current = panels[i];
        const next = panels[i + 1];
        if (!current || !next) continue;

        tl.to(current, { scale: 0.7, opacity: 0, duration: 1, ease: "none" }, i);
        tl.to(next, { y: "0%", scale: 1, opacity: 1, duration: 1, ease: "none" }, i);
      }

      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      if (container.current) resizeObserver.observe(container.current);

      return () => {
        resizeObserver.disconnect();
        tl.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: container },
  );

  const page = (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
          <div className="relative z-10 mx-auto w-full max-w-4xl py-24 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-xs text-muted">
              <Sparkles className="size-3.5 text-primary" />
              Memperkenalkan AI MU
            </div>
            <h1 className="editorial-xl text-balance text-text">
              Kecerdasan untuk
              <span className="block text-primary">Ekosistem Akademik</span>
            </h1>
            <p className="editorial-body mx-auto mt-6 text-pretty text-muted">
              AI MU dibangun khusus untuk universitas, mahasiswa, dan peneliti. Chat, belajar, riset, dan
              berkolaborasi dengan AI yang memahami konteks akademikmu.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="flex items-center gap-2 rounded-md border border-border bg-surface/50 px-3 py-2 text-[11px] text-muted">
                <Globe className="size-3.5 text-primary" />
                Hadir Q3 2026
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-8">
            <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-border pt-2">
              <div className="h-2 w-1 rounded-full bg-border-strong" />
            </div>
          </div>
        </section>

        {/* Feature Panels — pinned (default) */}
        {!reduced && (
          <div ref={container} className="relative">
            <div className="relative h-[100svh] w-full overflow-hidden">
              {features.map((feature, i) => (
                <div
                  key={feature.id}
                  ref={(el) => {
                    panelsRef.current[i] = el;
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
                    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
                      <FeatureBody feature={feature} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress indicators */}
            <div
              ref={dotsRef}
              className="pointer-events-none fixed right-8 bottom-8 z-50 flex gap-1.5"
            >
              {features.map((_, i) => (
                <div key={i} className="dot h-1.5 w-1.5 rounded-full bg-border transition-all duration-300" />
              ))}
            </div>
          </div>
        )}

        {/* Feature Panels — statis (reduced motion) */}
        {reduced && (
          <section className="section-padding border-t border-border">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
              <div className="space-y-16">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16"
                  >
                    <FeatureBody feature={feature} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Roadmap */}
        <section className="section-padding">
          <div className="mx-auto max-w-3xl px-4 md:px-8">
            <div className="mb-10 text-center">
              <h2 className="editorial-md text-text">Roadmap</h2>
              <p className="mt-2 text-[0.9375rem] text-muted">Apa yang akan datang</p>
            </div>
            <div className="space-y-0">
              {roadmap.map((item, i) => (
                <div key={i} className="relative flex items-start gap-6 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                        i === 0
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface/50 text-muted"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < roadmap.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-[11px] font-medium tracking-wider text-primary uppercase">
                      {item.phase}
                    </p>
                    <p className="mt-1 text-sm font-medium text-text">{item.label}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        item.status === "Dalam Pengembangan"
                          ? "bg-success/10 text-success"
                          : "bg-surface/50 text-muted"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding border-t border-border">
          <div className="mx-auto max-w-3xl px-4 md:px-8">
            <div className="mb-10 text-center">
              <h2 className="editorial-md text-text">FAQ</h2>
              <p className="mt-2 text-[0.9375rem] text-muted">Pertanyaan umum tentang AI MU</p>
            </div>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-lg border border-border bg-surface/20 transition-colors open:bg-surface/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium text-text">
                    {faq.q}
                    <ChevronDown className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-4 text-[0.8125rem] leading-relaxed text-muted">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding border-t border-border">
          <div className="mx-auto max-w-2xl px-4 text-center md:px-8">
            <h2 className="editorial-md text-balance text-text">Jadilah bagian dari masa depan</h2>
            <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted">
              AI MU dibangun dengan masukan langsung dari komunitas. Bergabung sekarang untuk akses awal dan
              bantu bentuk platform ini.
            </p>
            <Button size="lg" className="mt-8 gap-2" asChild>
              <Link href="/register">
                Gabung Sekarang
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );

  if (reduced) return page;
  return <ReactLenis root>{page}</ReactLenis>;
}
