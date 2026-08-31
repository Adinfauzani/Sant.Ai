"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ScientificBackground } from "@/components/shared/scientificBackground";
import {
  GraduationCap,
  Rocket,
  Users,
  Lightbulb,
  Code2,
  Waypoints,
  GitCommit,
  GitPullRequest,
  Bug,
  IterationCcw,
  Boxes,
  ShieldCheck,
  Globe,
  Landmark,
  Building2,
  Map,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Layers,
  Library,
  Microscope,
  Heart,
  Briefcase,
  PenTool,
  Workflow,
  Sparkles,
  Tag,
  Calendar,
} from "lucide-react";

function TypeCommand({ text, delay }: { text: string; delay: number }) {
  const [len, setLen] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const type = (i: number) => {
      if (cancelled) return;
      setLen(Math.min(i, text.length));
      if (i < text.length) timer = setTimeout(() => type(i + 1), 45);
    };

    setLen(0);
    timer = setTimeout(() => type(0), delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <span>
      {text.slice(0, len)}
      <span className="terminal-cursor" />
    </span>
  );
}

const painPoints = [
  {
    title: "Tugas berakhir pas dinilai",
    text: "Mayoritas tugas kuliah cuma jadi arsip setelah masuk nilai. Ilmu yang udah dipelajari susah payah jarang pernah dipakai lagi, jadi kerasa sia-sia dan nggak nambah kompetensi.",
  },
  {
    title: "Skill gap sama industri",
    text: "Yang diajarin di kelas sering jauh dari yang diminta dunia kerja. Lulus dengan teori yang kuat, tapi belum terbiasa dipakai ngoding di tim, kelola deadline, dan mikir kayak engineer beneran.",
  },
  {
    title: "Belum punya portofolio nyata",
    text: "Nyari kerja atau magang tanpa portofolio itu berat banget. CV yang cuma berisi IPK dan daftar mata kuliah susah bersaing dibanding kandidat yang bisa buktiin karyanya.",
  },
  {
    title: "Belum terbiasa kerja taraf profesional",
    text: "Version control, code review, testing, sampai dokumentasi jarang dikenalin di kelas. Padahal ini rutinitas harian yang pasti ketemu pas masuk perusahaan teknologi.",
  },
  {
    title: "Nggak ada wadah yang berkelanjutan",
    text: "Belajar berhenti tiap semester selesai. Nggak ada ekosistem yang nampung kamu terus berkembang dari semester ke semester, padahal skill teknologi butuh asupan terus-menerus.",
  },
];

const solutions = [
  {
    title: "Real Project Based Learning",
    text: "Sant.Ai mengadopsi pendekatan real project. Kamu nggak cuma nerima teori, tapi merancang, membangun, sampai mengoperasikan solusi digital yang beneran dipakai orang, bukan tugas simulasi.",
  },
  {
    title: "Standar kerja industri",
    text: "Kamu dilatih pakai version control, code review, dokumentasi teknis, pengujian perangkat lunak, sampai metodologi Agile dan Scrum. Persis alur kerja tim profesional, bahkan dibagi ke dalam sprint.",
  },
  {
    title: "Portofolio profesional",
    text: "Proyek yang selesai bukan cuma nilai, tapi bagian portofoliomu. Dilengkapi riwayat kontribusi dan peran di tim, jadi bukti konkret pas ngelamar kerja atau magang.",
  },
  {
    title: "Tim lintas peran kayak startup",
    text: "Setiap proyek dikerjain tim yang perannya lengkap: pengembang, insinyur AI, desainer produk, sampai manajer proyek. Kamu belajar memahami perspektif kolega lintas disiplin secara langsung.",
  },
  {
    title: "Riset, publikasi, dan open source",
    text: "Dilatih budaya riset: bertanya, bereksperimen, dokumentasikan hasil, sampai berkontribusi ke proyek open source. Pemikiranmu jadi aset kolektif yang bisa dipakai anggota lain.",
  },
];

const ecosystems = [
  {
    icon: Sparkles,
    title: "AI MU",
    text: "Ekosistem kecerdasan buatan yang jadi ujung tombak transformasi digital Muhammadiyah. Kamu ikut membangun solusi AI: asisten virtual, otomasi layanan, sampai chatbot yang beneran dipakai lembaga dan masyarakat.",
  },
  {
    icon: Library,
    title: "Learning Ecosystem",
    text: "Belajar bareng mahasiswa senior, mentor, dan praktisi industri. Proses nggak berhenti di satu semester, terus berkembang seiring makin kompleksnya proyek yang kamu kerjain.",
  },
  {
    icon: Cpu,
    title: "Technology Ecosystem",
    text: "Jelajah berbagai domain: web, mobile, cloud, IoT, keamanan siber, sampai AI. Semua dikelola terstruktur biar tiap proyek pakai praktik terbaik industri.",
  },
  {
    icon: Microscope,
    title: "Research Ecosystem",
    text: "Lebih dari bikin produk. Kamu didorong riset, bikin prototipe inovatif, publikasi, sampai berkontribusi ke proyek open source.",
  },
];

const workflow = [
  { icon: Waypoints, title: "Discovery", text: "Riset kebutuhan user & masalah nyata, lalu tentukan masalah mana yang paling penting dipecahin." },
  { icon: Boxes, title: "Planning", text: "Breakdown scope jadi tugas kecil, tentukan peran tiap anggota, dan sepakati tenggat." },
  { icon: PenTool, title: "Design", text: "Rancang alur & antarmuka biar solusinya enak dipakai user sejak awal proyek." },
  { icon: Code2, title: "Development", text: "Tulis kode terstruktur, kolaborasi di tim dengan code review di tiap perubahan." },
  { icon: Bug, title: "Testing", text: "Uji unit, integrasi, dan fungsional biar bug ketangkep sebelum sampai ke user." },
  { icon: Rocket, title: "Deploy & iterate", text: "Rilis versi pertama, pantau performa, lalu perbaiki terus sesuai feedback user." },
] as const;

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    text: "Berani eksplorasi ide baru, coba pendekatan yang belum umum, dan nggak takut gagal. Kami lihat inovasi sebagai proses berkelanjutan, bukan hasil sekali jadi. Setiap eksperimen, baik berhasil maupun gagal, selalu jadi bahan pembelajaran buat tim-tim berikutnya.",
    accent: { border: "border-l-cyan-400", text: "text-cyan-500 dark:text-cyan-300", bg: "bg-cyan-400/10" },
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    text: "Jujur dalam pelaporan progres, jaga orisinalitas karya, dan bertanggung jawab penuh atas kualitas kode yang kamu hasilkan. Integritas jadi fondasi tiap kerja, dari transparansi di log proyek sampai menepati komitmen ke pengguna dan rekan tim.",
    accent: { border: "border-l-primary", text: "text-primary", bg: "bg-primary/10" },
  },
  {
    icon: Users,
    title: "Collaboration",
    text: "Karya besar lahir dari kerja sama, bukan kerja sendirian. Di Sant.Ai kamu saling dukung, berbagi ilmu, dan menghargai kontribusi tiap orang lintas peran. Tim berdiri karena tiap suara, review, dan ide dihargai setara.",
    accent: { border: "border-l-amber-400", text: "text-amber-500 dark:text-amber-300", bg: "bg-amber-400/10" },
  },
  {
    icon: Briefcase,
    title: "Professionalism",
    text: "Dari komunikasi, dokumentasi, sampai manajemen tenggat, semua dikerjakan dengan standar profesional setara lingkungan kerja industri. Kamu terbiasa lapor progres yang jelas, review kode rapi, dan meninggalkan jejak kerja yang mudah dipahami orang lain.",
    accent: { border: "border-l-emerald-400", text: "text-emerald-500 dark:text-emerald-300", bg: "bg-emerald-400/10" },
  },
  {
    icon: IterationCcw,
    title: "Continuous Learning",
    text: "Teknologi terus bergerak, dan kami sadar dunia nggak berhenti. Karena itu belajar dijaga sepanjang waktu lewat proyek nyata, riset, diskusi teknis, dan eksplorasi mandiri. Setiap pengetahuan baru yang didapat selalu dibagikan jadi aset bersama tim.",
    accent: { border: "border-l-indigo-400", text: "text-indigo-500 dark:text-indigo-300", bg: "bg-indigo-400/10" },
  },
  {
    icon: Heart,
    title: "Impact",
    text: "Setiap karya diarahkan buat kasih manfaat nyata, baik buat pengguna, industri, Muhammadiyah, maupun masyarakat luas. Solusi yang kami bangun diukur dari seberapa besar ia mempermudah hidup orang, bukan sekadar dari canggihnya teknologi.",
    accent: { border: "border-l-rose-400", text: "text-rose-500 dark:text-rose-300", bg: "bg-rose-400/10" },
  },
];

const engineering = [
  { icon: GitCommit, title: "Git & Version Control", cmd: "git branch -a", text: "Jejak perubahan kerjaan rapi dan bisa ditarik kapan aja." },
  { icon: GitPullRequest, title: "Code Review", cmd: "git push origin dev", text: "Saling review biar kualitas naik dan ilmu kebagi-bagi." },
  { icon: Bug, title: "Testing", cmd: "pnpm test", text: "Pastiin yang dibangun beneran jalan, bukan asal jadi." },
  { icon: Workflow, title: "Agile & Scrum", cmd: "sprint start", text: "Kerja iteratif, respon cepat, prioritas jelas." },
  { icon: Layers, title: "Clean Architecture", cmd: "make modules", text: "Kode terstruktur biar gampang dirawat dan dikembangin." },
  { icon: IterationCcw, title: "CI/CD", cmd: "ci/cd run", text: "Proses rilis otomatis, feedback cepet, deploy lancar." },
] as const;

const roadmap = [
  {
    year: "2026",
    title: "Fondasi",
    text: "Bentuk struktur, onboarding anggota, standarisasi alur kerja, dan mulai proyek pertama.",
  },
  {
    year: "2027",
    title: "Penguatan Ekosistem",
    text: "Perluas tim, jalin kemitraan awal, mulai riset terstruktur, dan rancang arsitektur AI MU.",
  },
  {
    year: "2028",
    title: "Ekspansi Kolaborasi",
    text: "Perluas kemitraan industri, buka program magang, dorong publikasi dan open source.",
  },
  {
    year: "2029",
    title: "Skalabilitas",
    text: "Tangani proyek yang lebih besar, terapkan standar kualitas, perluas AI MU, bangun jejaring alumni.",
  },
  {
    year: "2030",
    title: "Ekosistem Matang",
    text: "Jadi ekosistem inovasi yang berkelanjutan, berdampak ke teknologi Indonesia, dan AI MU jadi pilar digital Muhammadiyah.",
  },
];

const impact = [
  { icon: GraduationCap, title: "Mahasiswa", text: "Pengalaman kerja nyata, portofolio profesional, dan skill yang relevan sejak masih kuliah." },
  { icon: Landmark, title: "Universitas", text: "Lulusan yang lebih siap kerja, reputasi akademik kuat, dan contoh model pembelajaran berbasis proyek." },
  { icon: Building2, title: "Industri", text: "Akses ke talenta digital yang terbiasa kerja profesional, plus peluang kolaborasi riset." },
  { icon: Heart, title: "Muhammadiyah", text: "Dukungan teknologi lewat AI MU untuk percepat transformasi digital di berbagai lini." },
  { icon: Globe, title: "Masyarakat", text: "Solusi digital yang kasih manfaat langsung, layanan lebih efisien, informasi makin terjangkau." },
  { icon: Map, title: "Indonesia", text: "Sedikit-sedikit, ikut memperkuat ekosistem talenta digital dan inovasi nasional." },
];

const orbitPos = [
  { x: 50, y: 10 },
  { x: 88, y: 37.6 },
  { x: 73.6, y: 82.4 },
  { x: 26.4, y: 82.4 },
  { x: 12, y: 37.6 },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero — problem-led */}
        <section className="relative overflow-hidden section-padding">
          <ScientificBackground variant="neural" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 editorial-label">About Sant.Ai</p>
              <h1 className="editorial-xl text-text">
                Kuliah itu penting. Tapi nggak cukup.
              </h1>
              <p className="mt-6 editorial-body mx-auto text-muted">
                Sant.Ai hadir biar ilmu yang kamu pelajari di kelas beneran kepake.
                Bangun proyek nyata, kerja tim ala industri, dan pulang kuliah dengan portofolio, bukan cuma nilai.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Gabung sekarang <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/showcase">
                  <Button variant="outline" size="lg">
                    Lihat karya mahasiswa
                  </Button>
                </Link>
              </div>
            </div>

            {/* Apa itu Sant.Ai */}
            <div className="relative mx-auto mt-20 max-w-4xl">
              {/* canvas shapes */}
              <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
              <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/20" />
              <div aria-hidden="true" className="pointer-events-none absolute right-8 top-10 h-6 w-6 rounded-full bg-primary/40" />
              <div aria-hidden="true" className="pointer-events-none absolute bottom-8 left-10 h-3 w-3 rounded-full bg-cyan-500/50" />

              <div className="relative rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-sm sm:p-10">
                <p className="editorial-label">Apa itu Sant.Ai?</p>
                <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-text sm:text-base">
                  <p>
                    Sant.Ai adalah <span className="font-bold text-primary">Innovation & Technology Hub</span> di bawah
                    Fakultas Ilmu Komputer Universitas Saintek Muhammadiyah. Bukan komunitas biasa yang sekedar kumpul
                    dan nongkrong. Ini wadah tempat <span className="font-semibold">ide, talenta, dan kebutuhan nyata</span> bisa
                    ketemu di satu titik, lalu beneran dikerjain sampai jadi produk yang dipakai orang.
                  </p>
                  <p>
                    Di sini kamu nggak cuma diajarin teori. Kamu <span className="font-semibold">langsung dicemplungin ke
                    proyek nyata</span> dengan standar kerja industri, mulai dari version control, code review, testing,
                    sampai cara kerja tim ala Agile. Semua biar yang kamu pelajari, <span className="text-primary font-medium">langsung
                    kepake</span>, bukan cuma numpuk di catatan.
                  </p>
                  <p>
                    Jadi, kalau kamu capek sama tugas yang hasilnya cuma jadi arsip, Sant.Ai adalah tempatmu
                    berkembang. <span className="font-semibold text-text">Dari kampus ke industri, dari ide ke dampak,</span> kamu yang
                    bikin jalanmu sendiri. Gabung, bikin karya, terus tunjukin ke dunia bahwa mahasiswa juga bisa
                    bikin teknologi yang berdampak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Masalah -> Solusi */}
        <section className="relative border-t border-border section-padding">
          <div className="container-main">
            <div className="section-header text-center">
              <p className="section-label">Kenapa Sant.Ai</p>
              <h2 className="editorial-md text-text">
                Karena sistem pendidikan kita belum siap sama dunia kerja
              </h2>
              <p className="section-desc mx-auto">
                Semua ini nggak kami ciptain tiba-tiba. Ada akar masalah yang terus kami dengar dari mahasiswa
                tahun ke tahun, dan Sant.Ai lahir buat jawab itu.
              </p>
            </div>

            {/* Narasi kenapa */}
            <div className="relative mx-auto max-w-4xl">
              <div aria-hidden="true" className="pointer-events-none absolute -left-14 top-4 h-32 w-32 rounded-full bg-red-500/5 blur-2xl" />
              <div aria-hidden="true" className="pointer-events-none absolute -right-14 bottom-4 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative grid gap-6 rounded-3xl border border-border bg-card/70 p-6 backdrop-blur-sm sm:grid-cols-2 sm:p-10">
                <div>
                  <p className="editorial-label">Akar masalahnya</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-text sm:text-base">
                    Gap antara <span className="font-bold text-red-500">apa yang diajarin di kelas</span> dan
                    <span className="font-bold"> apa yang beneran diminta industri</span> makin lebar tiap tahun.
                    Mahasiswa lulus dengan teori kuat, tapi kurang pengalaman ngoding di tim, ngurus deadline,
                    dan mikir kayak engineer beneran.
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
                    Route kerjanya pun sering nggak jelas. CV kosong, nggak punya portofolio, dan nggak tau harus
                    mulai dari mana biar bisa bersaing. Ini yang bikin banyak fresh graduate ngerasa
                    <span className="font-medium text-text">"kagok" pas masuk dunia profesional.</span>
                  </p>
                </div>
                <div>
                  <p className="editorial-label text-primary">Jawaban Sant.Ai</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-text sm:text-base">
                    Kami percaya jawabannya bukan nambah teori, tapi{" "}
                    <span className="font-bold text-primary">nambah pengalaman nyata</span>. Sant.Ai bikin ruang
                    di mana kamu belajar sambil bikin produk yang beneran dipakai, kerja pakai standar industri,
                    dan dapat bimbingan dari yang udah lebih dulu jalan.
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
                    Hasilnya simpel, kamu lulus dengan{" "}
                    <span className="font-semibold text-primary">portofolio, jejaring, dan kepercayaan diri</span>{" "}
                    untuk ngelamar kerja atau malah bikin usaha sendiri. Kuliah nggak sia-sia, dan skill-mu nggak
                    berhenti di atas kertas.
                  </p>
                </div>
              </div>

            {/* pohon / garis cabang melengkung */}
            <div className="mx-auto max-w-md">
              <div aria-hidden="true" className="relative mt-6 hidden h-14 w-full lg:block">
                {/* tengah berakar -> bercabang ke dua arah */}
                <svg viewBox="0 0 100 14" preserveAspectRatio="xMidYMax meet" className="h-14 w-full">
                  <path d="M50 0 C50 5, 16 5, 6 14" fill="none" stroke="var(--border-base)" strokeWidth="2" strokeDasharray="5 5" />
                  <path d="M50 0 C50 5, 84 5, 94 14" fill="none" stroke="var(--border-base)" strokeWidth="2" strokeDasharray="5 5" />
                  <circle cx="50" cy="0" r="0.9" fill="var(--primary-base)" />
                  <circle cx="6" cy="14" r="1.4" fill="var(--red-400, #f87171)" />
                  <circle cx="94" cy="14" r="1.4" fill="var(--primary-base)" />
                </svg>
              </div>
            </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="mb-4 text-sm font-bold text-text">Masalah yang sering dialami mahasiswa</p>
                <div className="space-y-5">
                  {painPoints.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-md bg-red-500/10 px-2 py-1 text-xs font-bold text-red-600 dark:text-red-400">x</span>
                      <div>
                        <p className="text-sm font-semibold text-text">{item.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6">
                <p className="mb-4 text-sm font-bold text-text">Cara Sant.Ai menjawabnya</p>
                <div className="space-y-5">
                  {solutions.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-md bg-primary p-1 text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text">{item.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Empat ekosistem */}
        <section className="relative border-t border-border section-padding">
          <ScientificBackground variant="circuit" className="absolute inset-0">
            <div className="absolute inset-0 bg-background/80" />
          </ScientificBackground>
          {/* canvas shapes */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 top-10 h-72 w-72 rounded-[3rem] bg-primary/15" />
            <div className="absolute -left-20 bottom-16 h-64 w-64 rotate-12 rounded-3xl border-2 border-primary/20" />
            <div className="absolute right-1/3 top-1/2 h-4 w-4 rounded-full bg-cyan-400/50" />
            <div className="absolute left-1/4 bottom-8 h-3 w-3 rounded-full bg-primary/60" />
            <div className="absolute left-10 top-24 h-2 w-2 rounded-full bg-red-400/40" />
          </div>
          <div className="container-main relative">
            <div className="section-header text-center">
              <p className="section-label">Ekosistem</p>
              <h2 className="editorial-md text-text">Empat ekosistem, satu perjalanan</h2>
              <p className="section-desc mx-auto">
                Kamu nggak cuma belajar, tapi sekalian riset, bikin teknologi, dan jadi bagian dari solusi AI. Semuanya saling nyambung.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
              {ecosystems.map((e, i) => {
                const Icon = e.icon;
                const isAI = e.title === "AI MU";
                if (isAI) {
                  return (
                    <div
                      key={e.title}
                      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-card to-card p-8 lg:col-span-1 lg:row-span-2"
                    >
                      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-primary/15" />
                      <div className="relative flex flex-1 flex-col justify-between">
                        <div>
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary text-white">
                            <Icon className="h-6 w-6" />
                          </div>
                          <p className="text-xs font-bold tracking-widest text-primary uppercase">Ujung tombak AI</p>
                          <h3 className="mt-2 font-heading text-2xl font-bold text-text lg:text-3xl">AI MU</h3>
                        </div>
                        <p className="mt-6 text-[15px] leading-relaxed text-text lg:text-base">
                          Ekosistem kecerdasan buatan yang jadi <span className="font-bold text-primary">ujung tombak transformasi digital Muhammadiyah</span>.
                          Kamu ikut membangun solusi AI yang beneran dipakai lembaga dan masyarakat: dari asisten virtual, otomasi layanan,
                          sampai chatbot cerdas di berbagai amal usaha. Bukan cuma belajar AI, kamu bikin AI yang kegunaannya langsung kerasa.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-2">
                          {["AI Assistant", "Automation", "Chatbot"].map((tag) => (
                            <span key={tag} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={e.title} className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 lg:col-span-1 lg:row-span-1 ${i === 3 ? "lg:col-start-2" : ""}`}>
                    <span aria-hidden="true" className={`pointer-events-none absolute -right-3 -top-3 h-14 w-14 rounded-full ${i % 2 === 0 ? "border-2 border-cyan-400/20" : "bg-amber-400/10"}`} />
                    <span aria-hidden="true" className={`pointer-events-none absolute -bottom-4 -left-4 h-9 w-9 rotate-12 rounded-lg border-2 ${i % 2 === 0 ? "border-emerald-400/20" : "border-indigo-400/20"}`} />
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-base font-bold text-text">{e.title}</h3>
                    </div>
                    <p className="relative mt-2 text-sm leading-relaxed text-muted">{e.text}</p>
                  </div>
                );
              })}
              <div className="flex h-full flex-col items-start justify-between overflow-hidden rounded-2xl border border-dashed border-primary/40 p-6">
                <p className="font-heading text-base font-bold text-text">Mulai di Sant.Ai</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Semua ekosistem ini berjalan berdampingan. Pilih jalurmu dan ikut bangun kolaborasi.
                </p>
                <Link
                  href="/community"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Tata cara gabung <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Project based learning */}
        <section className="relative overflow-hidden border-t border-border section-padding">
          {/* canvas shapes */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-16 bottom-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute right-1/4 top-12 h-4 w-4 rounded-full bg-primary/40" />
            <div className="absolute left-8 bottom-16 h-3 w-3 rounded-full bg-amber-400/50" />
          </div>
          <div className="container-main relative">
            <div className="section-header text-center">
              <p className="section-label">Cara kerja</p>
              <h2 className="editorial-md text-text">Belajar lewat proyek yang beneran</h2>
              <p className="section-desc mx-auto">
                Bukan tugas yang berakhir di nilai. Kamu jalani siklus nyata dari ide sampai produk dipakai.
              </p>
            </div>
            <div className="relative mt-16">
              {/* spine melengkung zigzag */}
              <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/60 via-border to-border lg:block" />

              <div className="space-y-0">
                {workflow.map((step, i) => {
                  const Icon = step.icon;
                  const left = i % 2 === 0;
                  const phase = i < 2 ? "primary" : i < 4 ? "cyan" : "amber";
                  const accent =
                    phase === "primary"
                      ? "border-primary/40 bg-primary text-white"
                      : phase === "cyan"
                        ? "border-cyan-500/40 bg-cyan-400 text-cyan-500 dark:text-cyan-300"
                        : "border-amber-500/40 bg-amber-400 text-amber-500 dark:text-amber-300";
                  const numColor =
                    phase === "primary"
                      ? "text-primary"
                      : phase === "cyan"
                        ? "text-cyan-500 dark:text-cyan-300"
                        : "text-amber-500 dark:text-amber-300";

                  return (
                    <div key={step.title} className="relative lg:flex lg:h-auto lg:items-center lg:py-2">
                      {/* card (kiri/kanan bergantian) */}
                      <div className={`relative z-10 lg:w-1/2 ${left ? "lg:pr-14 lg:text-right" : "lg:order-2 lg:pl-14"}`}>
                        <div className="relative inline-block w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
                          <span aria-hidden="true" className={`pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full ${phase === "cyan" ? "bg-cyan-400/10" : phase === "amber" ? "border-2 border-amber-400/20" : "border-2 border-primary/15"}`} />
                          <span aria-hidden="true" className={`pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 ${phase === "cyan" ? "rotate-45 border-2 border-cyan-400/20" : phase === "amber" ? "bg-amber-400/10" : "rounded-full bg-primary/5"}`} />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`font-mono text-3xl font-bold ${numColor}`}>0{i + 1}</span>
                            <span className={`grid h-10 w-10 place-items-center rounded-xl border ${accent}`}>
                              <Icon className="h-5 w-5" />
                            </span>
                          </div>
                          <h3 className="mt-4 font-heading text-base font-bold text-text">{step.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
                        </div>
                      </div>

                      {/* spacer */}
                      <div aria-hidden="true" className="hidden lg:block lg:w-1/2" />

                      {/* spine dot */}
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 z-10 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-border bg-background lg:grid"
                      >
                        <span className={`h-2 w-2 rounded-full ${phase === "primary" ? "bg-primary" : phase === "cyan" ? "bg-cyan-400" : "bg-amber-400"}`} />
                      </span>

                      {/* kurva dari card ke spine */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 100 40"
                        preserveAspectRatio="none"
                        className={`absolute top-1/2 hidden h-10 w-28 -translate-y-1/2 lg:block ${left ? "right-1/2" : "left-1/2 -scale-x-100"}`}
                      >
                        <path
                          d="M100 20 C 62 4, 30 36, 18 20"
                          fill="none"
                          stroke="var(--border-base)"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Nilai inti */}
        <section className="relative overflow-hidden border-t border-border section-padding">
          {/* canvas shapes */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -left-16 bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute left-1/3 top-16 h-2 w-2 rounded-full bg-cyan-400/60" />
            <div className="absolute right-10 bottom-24 h-3 w-3 rounded-full bg-amber-400/50" />
          </div>
          <div className="container-main relative">
            <div className="section-header text-center">
              <p className="section-label">Nilai inti</p>
              <h2 className="editorial-md text-text">Prinsip yang selalu kami pegang</h2>
              <p className="section-desc mx-auto">
                Enam hal yang nempelin di tiap proyek dan keputusan yang kita buat.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-3xl border border-border sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className={`relative overflow-hidden border-l-4 ${v.accent.border} flex flex-col border-b border-r border-border bg-card p-7 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0 sm:[&:nth-last-child(2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0`}
                  >
                    <span aria-hidden="true" className={`pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full ${i % 2 === 0 ? "border-2 border-cyan-400/20" : "bg-amber-400/10"}`} />
                    <span aria-hidden="true" className={`pointer-events-none absolute -bottom-3 -left-2 h-7 w-7 rotate-12 rounded-md border-2 ${i % 2 === 0 ? "border-emerald-400/20" : "border-rose-400/20"}`} />
                    <div className="flex items-start justify-between">
                      <span className={`font-mono text-3xl font-bold ${v.accent.text}`}>0{i + 1}</span>
                      <span className={`grid h-10 w-10 place-items-center rounded-xl ${v.accent.bg} ${v.accent.text}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-base font-bold text-text">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Engineering culture */}
        <section className="relative border-t border-border section-padding">
          <ScientificBackground variant="blueprint" className="absolute inset-0">
            <div className="absolute inset-0 bg-background/90" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="section-header text-center">
              <p className="section-label">Budaya engineering</p>
              <h2 className="editorial-md text-text">Kerja kayak di perusahaan teknologi</h2>
              <p className="section-desc mx-auto">
                Sejak hari pertama, kamu dibiasain sama praktik yang dipakai industri nyata.
              </p>
            </div>
            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-[#0b1120] shadow-2xl shadow-black/20">
              {/* terminal title bar */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-slate-400">santai --culture --dev</span>
              </div>
              {/* terminal body */}
              <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
                {engineering.map((e, i) => {
                  const Icon = e.icon;
                  return (
                    <div key={e.title} className="group relative overflow-hidden bg-[#0b1120] p-5 transition-colors duration-200 hover:bg-white/[0.03]">
                      <span aria-hidden="true" className={`pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full ${i % 2 === 0 ? "border border-cyan-400/20" : "bg-white/[0.03]"}`} />
                      <span aria-hidden="true" className={`pointer-events-none absolute -bottom-4 -left-4 h-8 w-8 rotate-12 rounded-md border ${i % 2 === 0 ? "border-slate-500/20" : "border-amber-400/15"}`} />
                      <div className="flex min-h-5 items-center gap-2 font-mono text-[13px] text-emerald-400">
                        <span className="select-none text-slate-500">$</span>
                        <TypeCommand text={e.cmd} delay={i * 380} />
                      </div>
                      <div className="mt-3 flex items-center gap-2.5">
                        <span className="group-hover:border-cyan-400/40 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-cyan-400/10 bg-cyan-400/10 text-cyan-300 transition-colors">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-100">{e.title}</h3>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">{e.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="relative overflow-hidden border-t border-border section-padding">
          {/* canvas shapes */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -right-16 bottom-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute right-1/4 top-14 h-2 w-2 rounded-full bg-cyan-400/60" />
            <div className="absolute left-10 bottom-20 h-3 w-3 rounded-full bg-indigo-400/60" />
          </div>
          <div className="container-main relative">
            <div className="section-header text-center">
              <p className="section-label">Roadmap</p>
              <h2 className="editorial-md text-text">Perjalanan 2026 sampai 2030</h2>
              <p className="section-desc mx-auto">
                Dari fondasi kecil sampai jadi ekosistem yang matang. Satu langkah tiap tahun.
              </p>
            </div>
            <div className="mx-auto max-w-3xl">
              {roadmap.map((item, i) => {
                const tag = [
                  "border-emerald-500/50 text-emerald-500 dark:text-emerald-300",
                  "border-primary/50 text-primary",
                  "border-amber-500/50 text-amber-500 dark:text-amber-300",
                  "border-cyan-500/50 text-cyan-500 dark:text-cyan-300",
                  "border-indigo-500/50 text-indigo-500 dark:text-indigo-300",
                ][i % 5];
                return (
                  <div key={item.year} className="relative flex gap-5 pb-10 last:pb-0">
                    {/* git node + spine */}
                    <div className="relative flex flex-col items-center">
                      <span className={`z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 bg-background ${tag}`}>
                        <GitCommit className="h-4 w-4" />
                      </span>
                      {i < roadmap.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
                    </div>

                    {/* konten */}
                    <div className="min-w-0 pt-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold ${tag}`}>
                          <Tag className="h-3 w-3" />
                          v{i + 1}.0
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
                          <Calendar className="h-3 w-3" />
                          {item.year}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-[11px] text-muted/80">
                        git tag -a v{i + 1}.0 -m "{item.title.toLowerCase()}"
                      </p>
                      <h3 className="mt-2 font-heading text-lg font-bold text-text">{item.title}</h3>
                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dampak */}
        <section className="relative overflow-hidden border-t border-border section-padding">
          {/* canvas shapes */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute left-0 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border border-primary/10" />
            <div className="absolute right-0 top-1/2 h-14 w-14 -translate-y-1/2 rotate-12 rounded-2xl border-2 border-primary/10" />
            <div className="absolute left-1/3 top-10 h-2 w-2 rounded-full bg-cyan-400/60" />
            <div className="absolute right-1/3 bottom-12 h-3 w-3 rounded-full bg-primary/50" />
          </div>
          <div className="container-main relative">
            <div className="section-header text-center">
              <p className="section-label">Dampak</p>
              <h2 className="editorial-md text-text">Buat siapa semua ini?</h2>
              <p className="section-desc mx-auto">
                Dampaknya nggak berhenti di mahasiswa. Dari kampus, ikut menyentuh banyak pihak.
              </p>
            </div>
            {/* mobile / tablet: grid kompak */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {impact.map((d, i) => {
                const Icon = d.icon;
                return (
                  <div key={d.title} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
                    <span aria-hidden="true" className={`pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full ${i % 2 === 0 ? "border-2 border-cyan-400/20" : "bg-primary/5"}`} />
                    <span aria-hidden="true" className={`pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 rotate-12 rounded-md border-2 ${i % 2 === 0 ? "border-amber-400/20" : "border-emerald-400/20"}`} />
                    <div className="mb-3 flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="text-sm font-bold text-text">{d.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-muted">{d.text}</p>
                  </div>
                );
              })}
            </div>

            {/* desktop: orbit konsentris */}
            <div className="relative mx-auto hidden aspect-square w-full max-w-2xl lg:block">
              {/* SVG orbit : cincin + garis radial */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-base)" strokeOpacity="0.45" strokeWidth="0.35" />
                <circle cx="50" cy="50" r="24" fill="none" stroke="var(--border-base)" strokeOpacity="0.18" strokeWidth="0.3" />
                {orbitPos.map((p, i) => {
                  const dx = p.x - 50;
                  const dy = p.y - 50;
                  const dist = Math.hypot(dx, dy) || 1;
                  const ix = p.x - (dx / dist) * 14;
                  const iy = p.y - (dy / dist) * 14;
                  const sway = i % 2 === 0 ? -1 : 1;
                  return (
                    <path
                      key={i}
                      d={`M50 50 C ${50 + dx * 0.32} ${50 + dy * 0.32 - 10 * sway}, ${ix - dx * 0.2} ${iy - dy * 0.2 + 10 * sway}, ${ix} ${iy}`}
                      fill="none"
                      stroke="var(--border-base)"
                      strokeOpacity="0.3"
                      strokeWidth="0.32"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="1.1" fill="var(--primary-base)" />
              </svg>

              {/* inti : Mahasiswa */}
              <div className="absolute left-1/2 top-1/2 z-20 w-44 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center rounded-3xl border border-primary/40 bg-primary/10 p-5 text-center shadow-lg shadow-primary/5 backdrop-blur-sm">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">Inti</p>
                  <h3 className="mt-0.5 font-heading text-lg font-bold text-text">Mahasiswa</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{impact[0].text}</p>
                </div>
              </div>

              {/* orbit sekeliling */}
              {orbitPos.map((p, i) => {
                const d = impact[i + 1];
                const Icon = d.icon;
                return (
                  <div
                    key={d.title}
                    className="absolute z-10 w-32 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  >
                    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="mt-1.5 text-xs font-bold text-text">{d.title}</h3>
                      <p className="mt-1 text-[10px] leading-relaxed text-muted">{d.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-border section-padding" style={{ backgroundColor: "var(--blue-9)" }}>
          {/* canvas shapes inside the solid color */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-10 top-10 h-24 w-24 rotate-12 rounded-2xl border-2 border-white/20" />
            <div className="absolute right-12 top-8 h-16 w-16 rounded-full bg-white/10" />
            <div className="absolute bottom-12 left-16 h-14 w-14 rotate-45 rounded-lg border-2 border-white/20" />
            <div className="absolute bottom-10 right-14 h-20 w-20 rounded-full bg-white/10" />
            <div className="absolute left-1/4 top-6 h-2.5 w-2.5 rounded-full bg-white/40" />
            <div className="absolute right-1/4 bottom-8 h-3 w-3 rounded-full bg-white/30" />
            <div className="absolute left-8 bottom-1/2 h-2 w-2 rounded-full bg-white/40" />
            <div className="absolute right-8 top-1/2 h-3 w-3 rounded-full bg-white/30" />
          </div>
          <div className="container-main relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-label text-white/70">Mulai dari sini</p>
              <h2 className="editorial-lg text-white">From campus to industry</h2>
              <p className="section-desc mx-auto mt-4 text-white/80">
                Dari kampus ke industri, dari ide ke dampak. Giliran kamu bangun karya yang beneran kepake.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                    Gabung sekarang <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg" className="border-2 border-white bg-black/25 font-medium text-white hover:bg-black/40">
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
