import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { ScientificBackground } from "@santai/ui/scientificBackground";
import { getEventsData } from "@/lib/events";
import EventsClient from "./_eventsClient";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const data = await getEventsData();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden section-padding">
          <ScientificBackground variant="timeline" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-1 editorial-label">Events</p>
              <h1 className="editorial-xl text-text">Events &amp; Activities</h1>
              <p className="mt-3 editorial-body mx-auto text-muted">
                Workshop, kompetisi, hackathon, dan kegiatan teknologi dalam ekosistem Science, Technology &amp; Artificial Intelligence.
              </p>
            </div>
          </div>
        </section>

        <div className="container-main pb-16 space-y-10">
          <EventsClient data={data} />
        </div>
      </main>
      <Footer />
    </div>
  );
}