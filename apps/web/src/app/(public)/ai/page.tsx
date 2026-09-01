"use client";

import { useRef } from "react";
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

const features = [
  {
    id: "ai-chat",
    badge: "AI Chat",
    title: "Percakapan yang memahami konteks",
    description:
      "Percakapan alami yang ditenagai Sant.Ai Intelligence. Didesain untuk membantu mahasiswa, developer, dan peneliti memecahkan masalah, menghasilkan ide, dan menjawab pertanyaan kompleks.",
    highlights: ["Kesadaran Konteks", "Generasi Kode", "Multibahasa", "Memori Cerdas"],
    accent: "text-blue-500",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    mockup: <ChatMockup />,
  },
  {
    id: "ai-workspace",
    badge: "AI Workspace",
    title: "Semua bekerja dalam satu ruang",
    description:
      "Lingkungan kolaboratif tempat proyek, berkas, percakapan, catatan, dan AI bekerja bersama dalam satu ruang yang terhubung.",
    highlights: ["Organisasi Proyek", "Konteks AI", "Kolaborasi Tim", "Manajemen Berkas"],
    accent: "text-purple-500",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    mockup: <WorkspaceMockup />,
  },
  {
    id: "ai-learning",
    badge: "AI Learning Companion",
    title: "Beradaptasi dengan cara kamu belajar",
    description:
      "Mentor akademik cerdas yang menyesuaikan gaya belajar setiap mahasiswa dengan bimbingan personal dan kuis interaktif.",
    highlights: ["Pembelajaran Personal", "Tutor AI", "Kuis Interaktif", "Pelacakan Progres"],
    accent: "text-emerald-500",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    mockup: <LearningMockup />,
  },
  {
    id: "ai-research",
    badge: "AI Research Assistant",
    title: "Percepat risetmu",
    description:
      "Percepat riset akademik dengan analisis makalah, generator kutipan, ekstraksi pengetahuan, dan ringkasan dokumen berbasis AI.",
    highlights: ["Analisis Makalah", "Generator Kutipan", "Peringkas AI", "Graf Pengetahuan"],
    accent: "text-amber-500",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    mockup: <ResearchMockup />,
  },
  {
    id: "ai-search",
    badge: "AI Search",
    title: "Temukan yang penting",
    description:
      "Pencarian semantik lintas makalah riset, sumber daya kampus, dokumentasi, diskusi, dan basis pengetahuan terkurasi.",
    highlights: ["Pencarian Semantik", "Makalah Riset", "Pengetahuan Komunitas", "Penemuan Cerdas"],
    accent: "text-indigo-500",
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    mockup: <SearchMockup />,
  },
];

function ChatMockup() {
  return (
    <div className="flex flex-col h-full">
      <div className="space-y-3 flex-1">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-surface/60 px-3.5 py-2.5 text-xs leading-relaxed text-text max-w-[80%]">
            Halo! Saya AI MU. Bisa bantu riset, ngoding, belajar, dan banyak lagi.
            Mau eksplorasi apa hari ini?
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Ringkas makalah", "Tulis kode", "Jelaskan konsep"].map((p) => (
                <span key={p} className="rounded-md border border-border/40 bg-card px-2 py-0.5 text-[10px] text-muted">{p}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-primary/10 px-3.5 py-2.5 text-xs leading-relaxed text-text max-w-[75%]">
            Bisa bantu saya memahami cara kerja transformer neural network?
          </div>
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-[10px] font-medium text-text">K</div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Bot className="h-3.5 w-3.5" /></div>
          <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface/60 px-4 py-3">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/40 bg-surface/20 px-3 py-2">
        <input disabled className="flex-1 bg-transparent text-xs text-text outline-none placeholder:text-muted/40" placeholder="Tanya AI MU apa saja..." />
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white"><ArrowRight className="h-3 w-3" /></div>
      </div>
    </div>
  );
}

function WorkspaceMockup() {
  return (
    <div className="flex h-full gap-4">
      <div className="w-28 shrink-0 space-y-1.5">
        {[{ icon: FolderKanban, label: "Proyek" }, { icon: FileText, label: "Berkas" }, { icon: Book, label: "Catatan" }, { icon: CheckSquare, label: "Tugas" }].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[10px] ${i === 0 ? "bg-primary/10 font-medium text-primary" : "text-muted hover:bg-surface/30"}`}>
              <Icon className="h-3 w-3" />{s.label}
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
            <div key={p.title} className="rounded-lg bg-surface/30 p-2.5">
              <p className="text-[11px] font-medium text-text">{p.title}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[9px] text-muted">
                <span className="flex items-center gap-1"><FileText className="h-2.5 w-2.5" />{p.files}</span>
                <span className="flex items-center gap-1"><Users className="h-2.5 w-2.5" />{p.members}</span>
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
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-text">Pengantar Machine Learning</p>
          <p className="text-[10px] text-muted">Modul 4 dari 12 &middot; Supervised Learning</p>
        </div>
        <span className="shrink-0 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Sedang Berjalan</span>
      </div>
      <div className="h-2 w-full rounded-full bg-border/40"><div className="h-2 w-[35%] rounded-full bg-emerald-500 transition-all" /></div>
      <div className="rounded-xl border border-border/40 bg-surface/20 p-4">
        <p className="text-[11px] font-medium text-text">Pertanyaan 4 dari 10</p>
        <p className="mt-2 text-xs leading-relaxed text-text">Apa tujuan utama dari supervised learning?</p>
        <div className="mt-3 space-y-1.5">
          {[
            "Menemukan pola tersembunyi pada data tanpa label",
            "Mempelajari pemetaan dari input ke output menggunakan data berlabel",
            "Mengelompokkan titik data yang serupa",
          ].map((opt, i) => (
            <div key={i} className={`rounded-lg border px-3 py-2 text-[11px] ${i === 1 ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" : "border-border/40 text-text"}`}>
              {i === 1 && <Check className="mr-1.5 inline h-3 w-3 text-emerald-500" />}{opt}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted">
        <span><Check className="mr-1 inline h-3 w-3 text-emerald-400" />Skor: 75%</span>
        <span className="flex items-center gap-1"><Timer className="h-3 w-3" />12:34 tersisa</span>
      </div>
    </div>
  );
}

function ResearchMockup() {
  return (
    <div className="flex h-full gap-4">
      <div className="w-28 shrink-0 space-y-1.5">
        {["Abstrak", "Pendahuluan", "Metodologi", "Hasil", "Kutipan"].map((s, i) => (
          <div key={s} className={`rounded-md px-2.5 py-1.5 text-[10px] ${i === 0 ? "bg-amber-500/10 font-medium text-amber-600 dark:text-amber-400" : "text-muted hover:bg-surface/30"}`}>{s}</div>
        ))}
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-text">Attention Is All You Need</span>
          <span className="shrink-0 rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-medium text-amber-600 dark:text-amber-400">Dirangkum</span>
        </div>
        <p className="text-[11px] leading-relaxed text-text text-pretty">
          Model penerjemahan sekuens terbaik saat ini berbasis pada jaringan saraf berulang yang kompleks...
          Model terbaik menghubungkan encoder dan decoder melalui mekanisme attention.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["Ekstrak Poin Kunci", "Kutip Ini", "Temukan Serupa"].map((t) => (
            <span key={t} className="rounded-md border border-border/40 bg-card px-2 py-0.5 text-[9px] text-muted">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchMockup() {
  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-surface/20 px-3.5 py-2.5">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted" />
        <input disabled placeholder="Cari makalah riset, diskusi, dokumentasi..." className="flex-1 bg-transparent text-[11px] text-text outline-none" />
        <span className="shrink-0 rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-medium text-indigo-600 dark:text-indigo-400">Semantik</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {["Semua", "Makalah", "Komunitas", "Dokumen"].map((f, i) => (
          <span key={f} className={`rounded-md px-2 py-1 text-[9px] ${i === 0 ? "bg-indigo-500/10 font-medium text-indigo-600 dark:text-indigo-400" : "text-muted"}`}>{f}</span>
        ))}
      </div>
      <div className="space-y-2 flex-1">
        {[
          { title: "Transformer Models dalam NLP: Survei Komprehensif", source: "Makalah Riset \u00b7 2024" },
          { title: "Membangun Microservices Skalabel dengan Node.js", source: "Diskusi Komunitas \u00b7 15 balasan" },
          { title: "Pengantar Reinforcement Learning", source: "Materi Kursus \u00b7 Universitas Indonesia" },
        ].map((r) => (
          <div key={r.title} className="rounded-lg border border-border/30 bg-surface/10 p-2.5">
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
  { q: "Bisakah saya berkontribusi pada pengembangan AI MU?", a: "Tentu. AI MU dibangun dengan masukan langsung dari komunitas. Bergabung dengan waitlist untuk akses awal, ikut beta testing, dan beri masukan yang membentuk platform ini." },
  { q: "Apa yang membuat AI MU berbeda dari alat AI lain?", a: "AI MU dibangun khusus untuk ekosistem akademik. Terintegrasi dengan komunitas, proyek, dan basis pengetahuan Sant.Ai, memberikan bantuan AI kontekstual bagi mahasiswa, peneliti, dan developer." },
];

const roadmap = [
  { phase: "Q3 2026", label: "AI Search & Research Assistant Beta", status: "Dalam Pengembangan" },
  { phase: "Q4 2026", label: "AI Workspace & Summarizer", status: "Berikutnya" },
  { phase: "Q1 2027", label: "AI Learning Companion & Peluncuran Penuh", status: "Direncanakan" },
];

export default function AIPage() {
  const container = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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
                dot.style.backgroundColor = "var(--color-primary, #2563eb)";
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

  return (
    <ReactLenis root>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Hero */}
          <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
            <div className="relative z-10 mx-auto w-full max-w-4xl text-center py-24">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-xs text-muted">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Memperkenalkan AI MU
              </div>
              <h1 className="editorial-xl text-balance text-text">
                Kecerdasan untuk
                <span className="block text-primary">Ekosistem Akademik</span>
              </h1>
              <p className="editorial-body mt-6 mx-auto text-pretty text-muted">
                AI MU dibangun khusus untuk universitas, mahasiswa, dan peneliti.
                Chat, belajar, riset, dan berkolaborasi dengan AI yang memahami konteks akademikmu.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <span className="flex items-center gap-2 rounded-lg bg-surface/50 px-3 py-2 text-[11px] text-muted">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  Hadir Q3 2026
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce pb-8">
              <div className="h-10 w-6 rounded-full border-2 border-border flex items-start justify-center pt-2">
                <div className="h-2 w-1 rounded-full bg-muted animate-pulse" />
              </div>
            </div>
          </section>

          {/* Sticky Feature Panels */}
          <div ref={container} className="relative">
            <div className="relative h-[100svh] w-full overflow-hidden">
              {features.map((feature, i) => (
                <div
                  key={feature.id}
                  ref={(el) => { panelsRef.current[i] = el; }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
                    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
                      <div className="space-y-5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1 text-[11px] font-medium ${feature.accent}`}>
                          <Sparkles className="h-3 w-3" />
                          {feature.badge}
                        </span>
                        <h2 className="editorial-lg text-balance text-text">
                          {feature.title}
                        </h2>
                        <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {feature.highlights.map((h) => (
                            <span key={h} className="flex items-center gap-1 rounded-md bg-surface/50 px-2.5 py-1 text-xs text-text">
                              <Check className="h-3 w-3 text-primary" />
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <div className={`absolute -inset-6 rounded-[32px] opacity-30 bg-gradient-to-b ${feature.gradient} blur-2xl`} />
                        <div className="relative rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
                          {feature.mockup}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress indicators */}
            <div ref={dotsRef} className="pointer-events-none fixed bottom-8 right-8 z-50 flex gap-1.5">
              {features.map((_, i) => (
                <div key={i} className="dot h-1.5 w-1.5 rounded-full bg-border transition-all duration-300" />
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <section className="section-padding">
            <div className="mx-auto max-w-3xl px-4 md:px-8">
              <div className="text-center mb-10">
                <h2 className="editorial-md text-text">Roadmap</h2>
                <p className="mt-2 text-[0.9375rem] text-muted">Apa yang akan datang</p>
              </div>
              <div className="space-y-0">
                {roadmap.map((item, i) => (
                  <div key={i} className="relative flex items-start gap-6 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                        i === 0 ? "border-primary bg-primary/10 text-primary" :
                        i === 1 ? "border-purple-500 bg-purple-500/10 text-purple-500" :
                        "border-border bg-surface/50 text-muted"
                      }`}>{i + 1}</div>
                      {i < roadmap.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                    </div>
                    <div className="pt-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-primary">{item.phase}</p>
                      <p className="mt-1 text-sm font-medium text-text">{item.label}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        item.status === "Dalam Pengembangan" ? "bg-emerald-500/10 text-emerald-500" :
                        item.status === "Berikutnya" ? "bg-purple-500/10 text-purple-500" :
                        "bg-surface/50 text-muted"
                      }`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="section-padding border-t border-border">
            <div className="mx-auto max-w-3xl px-4 md:px-8">
              <div className="text-center mb-10">
                <h2 className="editorial-md text-text">FAQ</h2>
                <p className="mt-2 text-[0.9375rem] text-muted">Pertanyaan umum tentang AI MU</p>
              </div>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-border bg-surface/20 open:bg-surface/30 transition-colors">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-text list-none">
                      {faq.q}
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
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
                AI MU dibangun dengan masukan langsung dari komunitas.
                Bergabung dengan waitlist untuk akses awal dan bantu bentuk platform ini.
              </p>
              <a href="/waitlist" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
                Gabung Waitlist
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}