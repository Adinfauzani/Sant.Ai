import { LegalLayout } from "@/components/legal/legalLayout";
import { LegalCard } from "@/components/legal/legalCard";

export default function LegalPage() {
  return (
    <LegalLayout>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Pusat Kepercayaan Sant.Ai</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-text md:text-4xl">
            Pusat Legal
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
            Transparansi, privasi, dan kolaborasi yang bertanggung jawab. Lihat bagaimana Sant.Ai melindungi
            privasi pengguna, menjaga standar komunitas, dan memanfaatkan informasi publik untuk pendidikan
            dan riset.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LegalCard
            href="/legal/terms"
            title="Ketentuan Layanan"
            description="Aturan dan tanggung jawab dalam menggunakan ekosistem Sant.Ai."
          />
          <LegalCard
            href="/legal/privacy"
            title="Kebijakan Privasi"
            description="Bagaimana Sant.Ai mengumpulkan, menyimpan, dan melindungi informasi pengguna."
          />
          <LegalCard
            href="/legal/guidelines"
            title="Pedoman Komunitas"
            description="Standar untuk menjaga komunitas yang saling menghargai, kolaboratif, dan inovatif."
          />
          <LegalCard
            href="/legal/data"
            title="Kebijakan Data"
            description="Bagaimana Sant.Ai mengumpulkan, mengelola, dan memanfaatkan informasi publik untuk riset dan analitik."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-base font-bold text-text">Cakupan Kebijakan</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pusat Legal menjelaskan aturan penggunaan, privasi pengguna, standar komunitas, dan kebijakan data publik yang digunakan untuk pembelajaran serta riset.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-base font-bold text-text">Kepercayaan Pengguna</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Sant.Ai berkomitmen menyediakan ekosistem digital yang transparan, aman, kolaboratif, dan bertanggung jawab bagi mahasiswa.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-base font-bold text-text">Inovasi Bertanggung Jawab</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Data dan fitur analitik digunakan untuk mendukung pendidikan, penelitian, monitoring teknologi, dan pengembangan proyek mahasiswa.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { title: "Privasi Dulu", description: "Melindungi informasi pengguna lewat autentikasi aman dan penanganan data yang bertanggung jawab." },
            { title: "Platform Aman", description: "Autentikasi modern, komunikasi terenkripsi, dan perlindungan akun." },
            { title: "Standar Komunitas", description: "Membangun ekosistem teknologi yang saling menghargai dan kolaboratif." },
            { title: "Pemakaian Data yang Etis", description: "Memakai informasi publik secara etis untuk tujuan pendidikan dan riset." },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-bold text-text">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </LegalLayout>
  );
}
