import { LegalLayout } from "@/components/legal/legal-layout";
import { LegalCard } from "@/components/legal/legal-card";

export default function LegalPage() {
  return (
    <LegalLayout>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface/35 p-6 backdrop-blur-xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">SANTET Trust Center</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-text md:text-4xl">
            Legal Center
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
            Transparency, Privacy, and Responsible Collaboration. Learn how SANTET protects user privacy,
            maintains community standards, and responsibly utilizes public information for education and research.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LegalCard
            href="/legal/terms"
            title="Terms of Service"
            description="Rules and responsibilities for using the SANTET ecosystem."
          />
          <LegalCard
            href="/legal/privacy"
            title="Privacy Policy"
            description="How SANTET collects, stores, and protects user information."
          />
          <LegalCard
            href="/legal/guidelines"
            title="Community Guidelines"
            description="Standards for maintaining a respectful, collaborative, and innovative community."
          />
          <LegalCard
            href="/legal/data"
            title="Data Policy"
            description="How SANTET collects, organizes, and utilizes public information for research and analytics."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface/35 p-5 backdrop-blur-xl">
            <h3 className="font-heading text-base font-bold text-text">Policy Coverage</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Legal Center menjelaskan aturan penggunaan, privasi pengguna, standar komunitas, dan kebijakan data publik yang digunakan untuk pembelajaran serta riset.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface/35 p-5 backdrop-blur-xl">
            <h3 className="font-heading text-base font-bold text-text">User Trust</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              SANTET berkomitmen menyediakan ekosistem digital yang transparan, aman, kolaboratif, dan bertanggung jawab bagi mahasiswa.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface/35 p-5 backdrop-blur-xl">
            <h3 className="font-heading text-base font-bold text-text">Responsible Innovation</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Data dan fitur analitik digunakan untuk mendukung pendidikan, penelitian, monitoring teknologi, dan pengembangan proyek mahasiswa.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { title: "Privacy First", description: "Protecting user information through secure authentication and responsible data handling." },
            { title: "Secure Platform", description: "Modern authentication, encrypted communication, and account protection." },
            { title: "Community Standards", description: "Building a respectful and collaborative technology ecosystem." },
            { title: "Responsible Data Usage", description: "Using public information ethically for educational and research purposes." },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-border bg-surface/35 p-5 backdrop-blur-xl">
              <h3 className="font-heading text-base font-bold text-text">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </LegalLayout>
  );
}
