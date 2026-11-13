import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { ScientificBackground } from "@santai/ui/scientificBackground";
import { getShowcaseProjects } from "@/lib/data/showcase";
import ShowcaseClient from "./_showcaseClient";

export const dynamic = "force-dynamic";

export default async function ShowcasePage() {
  const projects = await getShowcaseProjects();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden section-padding">
          <ScientificBackground variant="blueprint" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-1 editorial-label">Showcase</p>
              <h1 className="editorial-xl text-text">Showcase Karya</h1>
              <p className="mt-3 editorial-body mx-auto text-muted">
                Eksplorasi proyek inovatif yang dibuat oleh mahasiswa Fakultas Ilmu Komputer, Universitas Saintek Muhammadiyah.
              </p>
            </div>
          </div>
        </section>

        <div className="container-main pb-16">
          <ShowcaseClient projects={projects} />
        </div>
      </main>
      <Footer />
    </div>
  );
}