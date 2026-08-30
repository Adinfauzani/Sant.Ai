import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ScientificBackground } from "@/components/shared/scientificBackground";
import { getCommunityData } from "@/lib/community";
import CommunityClient from "./_communityClient";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const data = await getCommunityData();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden section-padding">
          <ScientificBackground variant="knowledge" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-1 editorial-label">Community</p>
              <h1 className="editorial-xl text-text">Community Hub</h1>
              <p className="mt-3 editorial-body mx-auto text-muted">
                Terhubung dengan mahasiswa dari Sains Data, Teknik Informatika, dan Sistem Informasi untuk berkolaborasi dan berinovasi.
              </p>
            </div>
          </div>
        </section>

        <div className="container-main pb-16">
          <CommunityClient data={data} />
        </div>
      </main>
      <Footer />
    </div>
  );
}