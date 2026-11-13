import Link from "next/link";
import { ArrowRight, BarChart3, Code, Database, Users } from "lucide-react";
import { Button } from "@santai/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { ScientificBackground } from "@santai/ui/scientificBackground";
import GuideCarousel from "@santai/ui/guideCarousel";
import ProgramCarousel from "@santai/ui/programCarousel";
import HeroLabel from "@/components/shared/heroLabel";

const heroProjects = [
  {
    title: "Sains Data",
    tag: "SG",
    icon: BarChart3,
    desc: "Model prediksi stunting berbasis ML",
    meta: "12 kontributor · 78% selesai",
    bar: "w-[78%]",
  },
  {
    title: "Teknik Informatika",
    tag: "TI",
    icon: Code,
    desc: "Platform kolaborasi riset kampus",
    meta: "24 kontributor · 64% selesai",
    bar: "w-[64%]",
  },
  {
    title: "Sistem Informasi",
    tag: "SI",
    icon: Database,
    desc: "Sistem ERP untuk UMKM lokal",
    meta: "9 kontributor · 41% selesai",
    bar: "w-[41%]",
  },
];

const featuredProjects = [
  {
    title: "AI MU, Asisten Virtual Lembaga",
    status: "Active",
    statusDot: "bg-success",
    desc: "Asisten AI yang dipakai lembaga Muhammadiyah untuk layanan otomatis dan informasi ke masyarakat.",
    tags: ["AI", "Chatbot", "Otomasi"],
  },
  {
    title: "Model Prediksi Stunting",
    status: "Research",
    statusDot: "bg-primary",
    desc: "Riset machine learning untuk mendeteksi risiko stunting lebih dini dari data kesehatan dasar.",
    tags: ["Python", "ML", "Data"],
  },
  {
    title: "Digitalisasi Amal Usaha",
    status: "In Progress",
    statusDot: "bg-warning",
    desc: "Transformasi digital untuk amal usaha Muhammadiyah lewat otomasi layanan dan pengelolaan data.",
    tags: ["Web", "Otomasi", "Umkm"],
  },
  {
    title: "Platform Kolaborasi Riset",
    status: "Featured",
    statusDot: "bg-primary",
    desc: "Ruang bersama mahasiswa lintas proyek: riset, kode, dan dokumentasi yang berdampak nyata.",
    tags: ["Software", "Kolaborasi"],
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero — split: narasi kiri, proyek kanan */}
        <section className="relative overflow-hidden section-padding">
          <ScientificBackground variant="neural" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
          </ScientificBackground>

          {/* Kartu proyek — mobile: sebagai backdrop blur; desktop: kolom kanan */}
          <div className="pointer-events-none absolute inset-0 lg:pointer-events-auto lg:static">
            <div className="absolute inset-0 lg:hidden">
              <div className="relative h-full w-full opacity-70 blur-[2px]">
                {heroProjects.map((p, i) => (
                  <div
                    key={p.tag}
                    className={`absolute -right-1 flex w-44 items-center gap-2.5 rounded-lg border border-border bg-card p-3 ${
                      i === 0
                        ? "top-[30%] -rotate-2"
                        : i === 1
                        ? "top-[42%] -mr-8 rotate-1"
                        : "top-[54%] -mr-16 -rotate-1"
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                      <p.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-text">{p.title}</p>
                      <p className="truncate text-[10px] text-muted">{p.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="container-main relative">
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="max-w-lg">
                <p className="mb-4">
                  <HeroLabel />
                </p>
                <h1 className="editorial-xl text-text">Tumbuh, bangun, berkarya</h1>
                <p className="mt-6 editorial-body text-muted">
                  Kolaborasi bagi mahasiswa, peneliti, dan developer. Eksplorasi riset,
                  tulis kode, dan kembangkan solusi AI yang berdampak.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/showcase">
                    <Button size="lg" className="gap-2">
                      Lihat Karya <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="lg">
                      Bergabung
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Kolom kanan — kartu proyek menumpuk (desktop) */}
              <div className="relative mx-auto hidden w-full max-w-md lg:mt-1 lg:block">
                {heroProjects.map((p, i) => (
                  <Link
                    key={p.tag}
                    href="/showcase"
                    className={`group block rounded-lg border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong hover:bg-surface ${
                      i === 0
                        ? "relative z-30"
                        : i === 1
                        ? "relative z-20 -mt-3 lg:-ml-4"
                        : "relative z-10 -mt-3 lg:-ml-8"
                    }`}
                  >
                    <span className="sr-only">Lihat karya {p.title} di showcase</span>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                          <p.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-text group-hover:text-primary">
                            {p.title}
                          </p>
                          <p className="text-xs text-muted">{p.desc}</p>
                        </div>
                      </div>
                      <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">
                        {p.tag}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-muted">
                      <Users className="h-3 w-3" />
                      <span>{p.meta}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                      <div className={`h-full rounded-full bg-primary ${p.bar}`} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured projects */}
        <section className="border-t border-border section-padding" id="featured">
          <div className="container-main">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="section-header mb-0">
                <p className="section-label">Featured</p>
                <h2 className="editorial-md text-text">Karya mahasiswa yang dikerjakan beneran</h2>
                <p className="section-desc">
                  Bukan sekadar tugas. Proyek nyata yang dibangun, diuji, dan berdampak.
                </p>
              </div>
              <Link
                href="/showcase"
                className="mb-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Lihat semua karya <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProjects.map((p) => (
                <Link
                  key={p.title}
                  href="/showcase"
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-150 hover:border-border-strong"
                >
                  <div className="relative h-16 border-b border-border bg-surface">
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-muted">
                      <span className={`h-1.5 w-1.5 rounded-full ${p.statusDot}`} />
                      {p.status}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-base font-semibold tracking-tight text-text transition-colors group-hover:text-primary">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{p.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Programs — Engineering grid */}
        <section className="relative border-t border-border section-padding" id="programs">
          <ScientificBackground variant="grid" className="absolute inset-0">
            <div className="absolute inset-0 bg-background/90" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="section-header">
              <p className="section-label">Programs</p>
              <h2 className="editorial-md text-text">Tiga program, satu ekosistem</h2>
              <p className="section-desc">
                Setiap program membawa perspektif unik. Bersama, mereka membentuk tim teknologi yang lengkap.
              </p>
            </div>
            <ProgramCarousel />
          </div>
        </section>

        {/* How It Works — Timeline */}
        <section className="border-t border-border section-padding">
          <div className="container-main">
            <div className="section-header">
              <p className="section-label">Cara kerja</p>
              <h2 className="editorial-md text-text">Dari ide menjadi dampak</h2>
              <p className="section-desc">
                Alur kerja sederhana yang mengubah ide proyek menjadi dampak nyata.
              </p>
            </div>
            <GuideCarousel />
          </div>
        </section>

        {/* Community / CTA — Knowledge graph */}
        <section className="relative border-t border-border section-padding">
          <ScientificBackground variant="knowledge" className="absolute inset-0">
            <div className="absolute inset-0 bg-background/90" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="mx-auto max-w-3xl text-center">
              <p className="editorial-label">Community</p>
              <h2 className="editorial-lg text-text mt-4">Bergabung dengan ekosistem</h2>
              <p className="section-desc mx-auto mt-4">
                Jadilah bagian dari komunitas pembangun, kreator, dan inovator yang terus berkembang.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Mulai <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg">
                    Jelajahi komunitas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
