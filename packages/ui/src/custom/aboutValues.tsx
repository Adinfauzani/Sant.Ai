"use client";

import { Lightbulb, ShieldCheck, Users, Briefcase, IterationCcw, Heart } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    text: "Berani eksplorasi ide baru, coba pendekatan yang belum umum, dan nggak takut gagal. Kami lihat inovasi sebagai proses berkelanjutan, bukan hasil sekali jadi. Setiap eksperimen, baik berhasil maupun gagal, selalu jadi bahan pembelajaran buat tim-tim berikutnya.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    text: "Jujur dalam pelaporan progres, jaga orisinalitas karya, dan bertanggung jawab penuh atas kualitas kode yang kamu hasilkan. Integritas jadi fondasi tiap kerja, dari transparansi di log proyek sampai menepati komitmen ke pengguna dan rekan tim.",
  },
  {
    icon: Users,
    title: "Collaboration",
    text: "Karya besar lahir dari kerja sama, bukan kerja sendirian. Di Sant.Ai kamu saling dukung, berbagi ilmu, dan menghargai kontribusi tiap orang lintas peran. Tim berdiri karena tiap suara, review, dan ide dihargai setara.",
  },
  {
    icon: Briefcase,
    title: "Professionalism",
    text: "Dari komunikasi, dokumentasi, sampai manajemen tenggat, semua dikerjakan dengan standar profesional setara lingkungan kerja industri. Kamu terbiasa lapor progres yang jelas, review kode rapi, dan meninggalkan jejak kerja yang mudah dipahami orang lain.",
  },
  {
    icon: IterationCcw,
    title: "Continuous Learning",
    text: "Teknologi terus bergerak, dan kami sadar dunia nggak berhenti. Karena itu belajar dijaga sepanjang waktu lewat proyek nyata, riset, diskusi teknis, dan eksplorasi mandiri. Setiap pengetahuan baru yang didapat selalu dibagikan jadi aset bersama tim.",
  },
  {
    icon: Heart,
    title: "Impact",
    text: "Setiap karya diarahkan buat kasih manfaat nyata, baik buat pengguna, industri, Muhammadiyah, maupun masyarakat luas. Solusi yang kami bangun diukur dari seberapa besar ia mempermudah hidup orang, bukan sekadar dari canggihnya teknologi.",
  },
];

export function AboutValues() {
  return (
    <section className="relative overflow-hidden border-t border-border section-padding">
      {/* single-accent canvas shape */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-16 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="container-main relative">
        <div className="section-header text-center">
          <p className="section-label">Nilai inti</p>
          <h2 className="editorial-md text-text">Prinsip yang selalu kami pegang</h2>
          <p className="section-desc mx-auto">
            Enam hal yang nempelin di tiap proyek dan keputusan yang kita buat.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-xl border border-border sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="flex flex-col border-b border-r border-border bg-card p-7 transition-colors duration-150 hover:bg-surface/60 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0 sm:[&:nth-last-child(2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-3xl font-bold text-primary">0{i + 1}</span>
                  <span className="grid size-10 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-5" />
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
