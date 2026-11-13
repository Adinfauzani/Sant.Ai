"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Calendar, Users, MapPin, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@santai/ui/badge";
import { Button } from "@santai/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@santai/ui/input-group";
import type { EventCardData, EventsData } from "@/lib/community/events";

const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
  Open: "success",
  "Limited Seats": "warning",
  Closed: "destructive",
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
    if (
      search &&
      !e.title.toLowerCase().includes(search.toLowerCase()) &&
      !e.tagline.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  function EventBadge({ e }: { e: EventCardData }) {
    return (
      <Badge variant={statusVariant[e.status] ?? "success"} className="font-mono text-[9px]">
        {e.status}
      </Badge>
    );
  }

  function EventMeta({ e }: { e: EventCardData }) {
    return (
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-primary" />
          {e.dateLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-primary" />
          {e.timeLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-primary" />
          {e.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5 text-primary" />
          {e.registered} {e.maxParticipants > 0 ? `/ ${e.maxParticipants}` : ""} terdaftar
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <InputGroup className="rounded-lg">
          <InputGroupAddon>
            <Search className="size-4 text-muted" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari event..."
            aria-label="Cari event"
          />
          {search && (
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Bersihkan pencarian"
                className="rounded p-0.5 text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </button>
            </InputGroupAddon>
          )}
        </InputGroup>

        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-text transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              {filter !== "All Events" ? filter : "Kategori"}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={8}
              align="start"
              className="z-50 w-56 rounded-lg border border-border bg-popover p-1.5 shadow-lg will-change-[transform,opacity]"
            >
              <div className="mb-1.5 flex items-center justify-between px-2 pt-1">
                <p className="text-xs font-semibold text-text">Filter kategori</p>
                <Popover.Close className="rounded p-0.5 text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <X className="size-3.5" />
                </Popover.Close>
              </div>
              <div className="flex flex-col gap-0.5">
                {categories.map((c) => (
                  <Popover.Close asChild key={c}>
                    <button
                      type="button"
                      onClick={() => setFilter(c)}
                      className={`w-full rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        filter === c
                          ? "bg-primary text-primary-foreground"
                          : "text-muted hover:bg-surface hover:text-text"
                      }`}
                    >
                      {c}
                    </button>
                  </Popover.Close>
                ))}
              </div>
              <Popover.Arrow fill="var(--color-popover)" width={10} height={5} />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {featured ? (
        <Link
          href={`/events/${featured.slug}`}
          className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-colors duration-150 hover:border-border-strong"
        >
          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                  Featured Event
                </span>
                <EventBadge e={featured} />
              </div>
              <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-text md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{featured.tagline}</p>
              <EventMeta e={featured} />
            </div>
            <div className="shrink-0">
              <Button size="lg" className="gap-2">
                Lihat Detail
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <p className="text-sm font-semibold text-text">Belum ada event mendatang</p>
          <p className="mt-1 text-xs text-muted">
            Pantau terus, event berikutnya bakal diumumkan di sini.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm font-semibold text-text">Event tidak ditemukan</p>
            <p className="mt-1 text-xs text-muted">Coba kata kunci atau kategori lain.</p>
          </div>
        ) : (
          filtered.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-150 hover:border-border-strong"
            >
              <div className="flex items-center justify-between gap-2 border-b border-border bg-surface/60 px-3 py-2">
                <span className="truncate font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {e.category}
                </span>
                <EventBadge e={e} />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-heading text-sm font-bold text-text transition-colors group-hover:text-primary">
                  {e.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{e.tagline}</p>
                <div className="mt-3 space-y-1.5 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary" />
                    {e.dateLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    {e.timeLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    {e.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" />
                    {e.registered} {e.maxParticipants > 0 ? `/ ${e.maxParticipants}` : ""} peserta
                  </span>
                </div>
                <span className="mt-3 flex items-center justify-center gap-1 rounded-md bg-primary/10 p-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary/20">
                  Lihat Detail
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {data.past.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                Archive
              </p>
              <h2 className="font-heading text-xl font-bold text-text">Event Lampau</h2>
            </div>
            <div className="flex items-center gap-1.5">
              {data.past.map((e, index) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => scrollToPastEvent(index)}
                  className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    index === activePastEventIndex
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-border-strong hover:bg-primary/60"
                  }`}
                  aria-label={`Ke eventlampau ${index + 1}`}
                  aria-current={index === activePastEventIndex ? "true" : undefined}
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
                <Link
                  key={e.id}
                  href={`/events/${e.slug}`}
                  data-past-event-card
                  className="group min-w-[86vw] snap-start overflow-hidden rounded-xl border border-border bg-card transition-colors duration-150 hover:border-border-strong md:min-w-0"
                >
                  <div className="p-4">
                    <h3 className="font-heading text-sm font-semibold text-text transition-colors group-hover:text-primary">
                      {e.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{e.tagline}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-primary" />
                        {e.dateLabel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5 text-primary" />
                        {e.registered} peserta
                      </span>
                    </div>
                    <span className="mt-3 flex items-center justify-center gap-1 rounded-md bg-primary/10 p-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary/20">
                      Lihat Detail
                    </span>
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
