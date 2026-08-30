import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle2, Gift, Phone } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { getEventDetail, type EventDetailData } from "@/lib/events";
import RegisterButton from "./_registerButton";

const statusColors: Record<string, string> = {
  Open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Limited Seats": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Closed: "bg-red-500/10 text-red-400 border-red-500/20",
};

function SpeakerCard({ speaker }: { speaker: EventDetailData["speakers"][number] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/20">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
          {speaker.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text truncate">{speaker.name}</p>
          <p className="text-[10px] text-muted">{speaker.role}</p>
        </div>
      </div>
      {speaker.topic && <p className="mt-2 text-[11px] text-muted leading-relaxed">Topic: <span className="text-text">{speaker.topic}</span></p>}
    </div>
  );
}

function AgendaItem({ time, activity, speaker }: { time: string; activity: string; speaker?: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="mt-1 h-full w-px bg-border" />
      </div>
      <div className="pb-5">
        <p className="font-mono text-[10px] font-semibold text-primary">{time}</p>
        <p className="mt-0.5 text-sm font-medium text-text">{activity}</p>
        {speaker && <p className="text-[10px] text-muted">by {speaker}</p>}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getAuthSession(await headers());
  const viewerId = session?.user?.id;

  const event = await getEventDetail(slug, viewerId);
  if (!event) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className={`relative flex h-56 items-end bg-gradient-to-br ${event.cover} md:h-72`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-15`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="container-main relative z-10 pb-8">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/30 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {event.category}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-semibold backdrop-blur-sm ${statusColors[event.status] || statusColors.Open}`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container-main section-padding">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/events"
              className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Events
            </Link>

            <h1 className="font-heading text-3xl font-bold leading-tight text-text md:text-4xl">
              {event.title}
            </h1>
            <p className="mt-2 text-sm text-muted">{event.tagline}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Calendar, text: event.dateLabel },
                { icon: Clock, text: event.timeLabel },
                { icon: MapPin, text: event.location },
                { icon: Users, text: `${event.registered}${event.maxParticipants > 0 ? ` / ${event.maxParticipants}` : ""} registered` },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[10px] text-muted">
                  <m.icon className="h-3.5 w-3.5 text-primary" />
                  {m.text}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <RegisterButton
                eventSlug={event.slug}
                status={event.status}
                maxParticipants={event.maxParticipants}
                registeredCount={event.registered}
                initialRegistered={event.registeredByMe}
              />
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-text">
                Diselenggarakan oleh {event.organizer}
              </span>
            </div>

            <div className="mt-10">
              <h2 className="font-heading text-xl font-bold text-text">About This Event</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{event.description}</p>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-5">
              <div className="md:col-span-3">
                <h2 className="font-heading text-xl font-bold text-text">Agenda</h2>
                {event.agenda.length === 0 ? (
                  <p className="mt-4 text-xs text-muted">Agenda akan diumumkan mendekati hari-H.</p>
                ) : (
                  <div className="mt-4">
                    {event.agenda.map((a, i) => (
                      <AgendaItem key={i} {...a} />
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-6">
                {event.speakers.length > 0 && (
                  <div>
                    <h3 className="font-heading text-lg font-bold text-text">Speakers</h3>
                    <div className="mt-3 space-y-3">
                      {event.speakers.map((s, i) => (
                        <SpeakerCard key={i} speaker={s} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-border bg-card p-4">
                  <h3 className="mb-3 font-heading text-sm font-bold text-text">Requirements</h3>
                  {event.requirements.length === 0 ? (
                    <p className="text-[11px] italic text-muted">No specific requirements</p>
                  ) : (
                    <ul className="space-y-2">
                      {event.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {event.benefits.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h3 className="mb-3 font-heading text-sm font-bold text-text">Benefits</h3>
                    <ul className="space-y-2">
                      {event.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                          <Gift className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.contact && (
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {event.contact}
                    </div>
                  </div>
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