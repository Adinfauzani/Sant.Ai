import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle2, Gift, Phone,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { Badge } from "@santai/ui/badge";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getEventDetail, type EventDetailData } from "@/lib/community/events";
import RegisterButton from "./_registerButton";

const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
  Open: "success",
  "Limited Seats": "warning",
  Closed: "destructive",
};

function SpeakerCard({ speaker }: { speaker: EventDetailData["speakers"][number] }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {speaker.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">{speaker.name}</p>
        <p className="text-[10px] text-muted">{speaker.role}</p>
        {speaker.topic && (
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Topik: <span className="text-text">{speaker.topic}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function AgendaItem({
  time,
  activity,
  speaker,
}: {
  time: string;
  activity: string;
  speaker?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary/10">
          <Clock className="size-3.5 text-primary" />
        </div>
        <div className="mt-1 h-full w-px bg-border" />
      </div>
      <div className="pb-5">
        <p className="font-mono text-[10px] font-semibold text-primary">{time}</p>
        <p className="mt-0.5 text-sm font-medium text-text">{activity}</p>
        {speaker && <p className="text-[10px] text-muted">oleh {speaker}</p>}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getAuthSession(await headers());
  const viewerId = session?.user?.id;

  const event = await getEventDetail(slug, viewerId);
  if (!event) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="border-b border-border bg-surface/60">
          <div className="container-main py-10 md:py-14">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="font-mono text-[10px] uppercase tracking-wider">
                  {event.category}
                </Badge>
                <Badge
                  variant={statusVariant[event.status] ?? "success"}
                  className="font-mono text-[9px]"
                >
                  {event.status}
                </Badge>
              </div>

              <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-text md:text-4xl">
                {event.title}
              </h1>
              <p className="mt-2 text-sm text-muted">{event.tagline}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { icon: Calendar, text: event.dateLabel },
                  { icon: Clock, text: event.timeLabel },
                  { icon: MapPin, text: event.location },
                  {
                    icon: Users,
                    text: `${event.registered}${
                      event.maxParticipants > 0 ? ` / ${event.maxParticipants}` : ""
                    } terdaftar`,
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] text-muted"
                  >
                    <m.icon className="size-3.5 text-primary" />
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <RegisterButton
                  eventSlug={event.slug}
                  status={event.status}
                  maxParticipants={event.maxParticipants}
                  registeredCount={event.registered}
                  initialRegistered={event.registeredByMe}
                />
                <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-text">
                  Diselenggarakan oleh {event.organizer}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container-main section-padding">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/events"
              className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke daftar event
            </Link>

            <div className="mt-10">
              <h2 className="font-heading text-xl font-bold tracking-tight text-text">
                Tentang Event Ini
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{event.description}</p>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-5">
              <div className="md:col-span-3">
                <h2 className="font-heading text-xl font-bold tracking-tight text-text">Agenda</h2>
                {event.agenda.length === 0 ? (
                  <p className="mt-4 text-xs text-muted">
                    Agenda akan diumumkan mendekati hari-H.
                  </p>
                ) : (
                  <div className="mt-4">
                    {event.agenda.map((a, i) => (
                      <AgendaItem key={i} {...a} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6 md:col-span-2">
                {event.speakers.length > 0 && (
                  <div>
                    <h3 className="font-heading text-lg font-bold tracking-tight text-text">
                      Narator
                    </h3>
                    <div className="mt-3 space-y-3">
                      {event.speakers.map((s, i) => (
                        <SpeakerCard key={i} speaker={s} />
                      ))}
                    </div>
                  </div>
                )}

                <section className="rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-3 font-heading text-sm font-bold text-text">Syarat</h3>
                  {event.requirements.length === 0 ? (
                    <p className="text-[11px] italic text-muted">Tidak ada syarat khusus</p>
                  ) : (
                    <ul className="space-y-2">
                      {event.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {event.benefits.length > 0 && (
                  <section className="rounded-xl border border-border bg-card p-4">
                    <h3 className="mb-3 font-heading text-sm font-bold text-text">Manfaat</h3>
                    <ul className="space-y-2">
                      {event.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                          <Gift className="mt-0.5 size-3.5 shrink-0 text-primary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {event.contact && (
                  <section className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <Phone className="size-3.5 shrink-0 text-primary" />
                      {event.contact}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
