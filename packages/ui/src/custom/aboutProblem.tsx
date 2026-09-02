"use client";

import { CheckCircle2 } from "lucide-react";

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

export function AboutProblem() {
  return (
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
  );
}
