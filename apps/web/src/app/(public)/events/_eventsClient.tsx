"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Popover from "@radix-ui/react-popover";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Calendar, Users, MapPin, Clock, ArrowRight,
} from "lucide-react";
import type { EventCardData, EventsData } from "@/lib/events";

const statusColors: Record<string, string> = {
  Open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Limited Seats": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Closed: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function EventsClient({ data }: { data: EventsData }) {
  const [filter, setFilter] = useState("All Events");
  const [search, setSearch] = useState("");
  const [activePastEventIndex, setActivePastEventIndex] = useState(0);
  const pastEventsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<(dir: -1 | 1) => void>(() => {});

  const categories = ["All Events", ...Array.from(new Set(data.upcoming.map((e) => e.category)))];

  function scrollToPastEvent(index: number) {
    const el = pastEventsRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-past-event-card]"));
    const target = cards[index] ?? cards[0];
    if (!target) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    } else {
      el.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    }
    setActivePastEventIndex(index);
  }

  function scrollPastEvents(direction: -1 | 1) {
    const len = data.past.length;
    let nextIndex = activePastEventIndex + direction;
    if (nextIndex >= len) nextIndex = 0;
    if (nextIndex < 0) nextIndex = len - 1;
    scrollToPastEvent(nextIndex);
  }

  useEffect(() => {
    scrollRef.current = scrollPastEvents;
  });

  useEffect(() => {
    if (data.past.length <= 1) return;
    const id = window.setInterval(() => {
      scrollRef.current(1);
    }, 10000);
    return () => window.clearInterval(id);
  }, [data.past.length]);

  const featured = data.featured;
  const gridEvents = featured
    ? data.upcoming.filter((e) => e.id !== featured.id)
    : data.upcoming;

  const filtered = gridEvents.filter((e) => {
    if (filter !== "All Events" && e.category !== filter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.tagline.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function EventBadge({ e }: { e: EventCardData }) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-semibold ${statusColors[e.status] || statusColors.Open}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${
          e.status === "Open" ? "bg-emerald-500" : e.status === "Limited Seats" ? "bg-amber-500" : "bg-red-500"
        }`} />
        {e.status}
      </span>
    );
  }

  function EventMeta({ e }: { e: EventCardData }) {
    return (
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-secondary">
        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{e.dateLabel}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{e.timeLabel}</span>
        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{e.location}</span>
        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" />{e.registered} {e.maxParticipants > 0 ? `/ ${e.maxParticipants}` : ""} registered</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/50 px-4 py-2.5 transition-colors focus-within:border-primary/30">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted" />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted hover:text-text">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-text shadow-sm hover:bg-surface transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                {filter !== "All Events" ? filter : "Category"}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={8}
                align="start"
                className="w-56 rounded-xl border border-border bg-card p-3 shadow-lg will-change-[transform,opacity]"
              >
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-xs font-semibold text-text">Filter by Category</p>
                  <Popover.Close className="rounded-md p-0.5 text-muted hover:bg-surface hover:text-text transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </Popover.Close>
                </div>
                <div className="flex flex-col gap-0.5">
                  {categories.map((c) => (
                    <Popover.Close asChild key={c}>
                      <button
                        onClick={() => setFilter(c)}
                        className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                          filter === c ? "bg-primary text-white" : "text-muted hover:bg-surface hover:text-text"
                        }`}
                      >
                        {c}
                      </button>
                    </Popover.Close>
                  ))}
                </div>
                <Popover.Arrow fill="var(--color-card)" width={10} height={5} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {featured ? (
        <Link href={`/events/${featured.slug}`} className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <div className={`absolute inset-0 bg-gradient-to-br ${featured.cover} opacity-30`} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">Featured Event</span>
                <EventBadge e={featured} />
              </div>
              <h2 className="mt-3 font-heading text-2xl font-bold text-text md:text-3xl">{featured.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary">{featured.tagline}</p>
              <EventMeta e={featured} />
            </div>
            <div className="flex shrink-0 gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-primary/90">
                View Details <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <p className="text-sm font-semibold text-text">Belum ada event mendatang</p>
          <p className="mt-1 text-xs text-muted">Pantau terus, event berikutnya bakal diumumkan di sini.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm font-semibold text-text">No events found</p>
            <p className="mt-1 text-xs text-muted">Try a different search or category.</p>
          </div>
        ) : (
          filtered.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/events/${e.slug}`} className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className={`relative flex h-28 items-end bg-gradient-to-br ${e.cover}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${e.color} opacity-10`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="relative z-10 p-3">
                    <span className="rounded-full bg-black/30 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">{e.category}</span>
                  </div>
                  <span className={`absolute right-3 top-3 z-10 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${statusColors[e.status] || statusColors.Open}`}>{e.status}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-sm font-bold text-text transition-colors group-hover:text-primary">{e.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-secondary">{e.tagline}</p>
                  <div className="mt-3 space-y-1.5 text-xs text-secondary">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{e.dateLabel}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{e.timeLabel}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{e.location}</span>
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" />{e.registered} {e.maxParticipants > 0 ? `/ ${e.maxParticipants}` : ""} participants</span>
                  </div>
                  <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="flex-1 rounded-lg bg-primary/10 p-1.5 text-center text-xs font-medium text-primary transition-colors group-hover:bg-primary/20">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {data.past.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Archive</p>
              <h2 className="font-heading text-xl font-bold text-text">Past Events</h2>
            </div>
            <div className="flex items-center gap-1.5">
              {data.past.map((e, index) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => scrollToPastEvent(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activePastEventIndex ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-primary/60"
                  }`}
                  aria-label={`Go to past event ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div
            ref={pastEventsRef}
            className="overflow-x-auto snap-x pr-2 md:max-h-[520px] md:overflow-y-auto md:pr-0 md:snap-y [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60"
          >
            <div className="flex gap-4 md:grid md:grid-cols-2 md:gap-4">
              {data.past.map((e) => (
                <Link key={e.id} href={`/events/${e.slug}`} data-past-event-card className="min-w-[86vw] snap-start md:min-w-0 group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20">
                  <div className={`h-2 bg-gradient-to-r ${e.color}`} />
                  <div className="p-4">
                    <h3 className="font-heading text-sm font-semibold text-text transition-colors group-hover:text-primary">{e.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-secondary">{e.tagline}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-secondary">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-primary" />{e.dateLabel}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" />{e.registered} attendees</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <span className="flex-1 rounded-lg bg-primary/10 p-1.5 text-center text-xs font-medium text-primary transition-colors group-hover:bg-primary/20">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}