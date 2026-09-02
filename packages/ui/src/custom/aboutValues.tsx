"use client";

import { Lightbulb, ShieldCheck, Users, Briefcase, IterationCcw, Heart } from "lucide-react";

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

export function AboutValues() {
  return (
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
  );
}
