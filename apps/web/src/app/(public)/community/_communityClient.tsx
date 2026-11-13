"use client";

import { useState } from "react";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import {
  Search, SlidersHorizontal, X, Users, MessageSquare, Heart, Share2,
  Calendar, ArrowRight, UserPlus, ChevronRight,
} from "lucide-react";
import { Badge } from "@santai/ui/badge";
import { Button } from "@santai/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@santai/ui/input-group";
import { programColor } from "@/lib/community/communityPalette";
import type {
  CommunityData,
  CommunityCardData,
  CommunityFeedPost,
} from "@/lib/community/community";
import { useSession } from "@/lib/auth/authClient";
import { togglePostLike } from "@/lib/community/communityActions";

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={`flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ${className ?? ""}`}
    >
      {name}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} mnt lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hr lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { month: "short", day: "numeric" });
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CommunityCard({ c, index }: { c: CommunityCardData; index: number }) {
  return (
    <Link
      href={`/community/${c.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-colors duration-150 hover:border-border-strong"
    >
      <div className={programColor(index)} aria-hidden="true" />
      <div className="p-4">
        <h3 className="font-heading text-base font-bold text-text transition-colors group-hover:text-primary">
          {c.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
          {c.description}
        </p>
        <div className="mt-3 flex items-center gap-3 text-[10px] text-muted">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {c.memberCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3" />
            {c.discussionCount}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="secondary" className="text-[10px]">
            {c.category}
          </Badge>
          <span className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[10px] font-medium text-primary transition-colors group-hover:bg-primary/10">
            Jelajahi
            <ChevronRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeedCard({ post, index }: { post: CommunityFeedPost; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [pending, setPending] = useState(false);

  async function handleLike() {
    if (pending) return;
    setPending(true);
    const res = await togglePostLike(post.id);
    if (res.ok) {
      setLiked(res.liked ?? !liked);
      setLikes((n) => n + (res.liked ? 1 : -1));
    }
    setPending(false);
  }

  return (
    <article className="rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
      <div className="flex items-start gap-3">
        <Avatar name={initials(post.authorName)} className="size-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-text">{post.authorName}</span>
            {post.program && (
              <Badge variant="outline" className="font-mono text-[9px]">
                {post.program}
              </Badge>
            )}
            <span className="text-[10px] text-muted">{timeAgo(post.createdAt)}</span>
          </div>
          <Link
            href={`/community/${post.communitySlug}`}
            className="mt-0.5 inline-block text-[10px] font-medium text-primary transition-colors hover:text-primary/80"
          >
            di {post.communityName}
          </Link>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{post.content}</p>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-muted">
            <button
              type="button"
              onClick={handleLike}
              disabled={pending}
              aria-pressed={liked}
              aria-label={liked ? "Batalkan suka" : "Sukai post ini"}
              className={`flex items-center gap-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                liked ? "text-primary" : ""
              }`}
            >
              <Heart className={`size-3 ${liked ? "fill-primary" : ""}`} />
              {likes}
            </button>
            <span className="flex items-center gap-1">
              <Share2 className="size-3" />
              Bagikan
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CommunityClient({ data }: { data: CommunityData }) {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(data.communities.map((c) => c.category)))];

  const filtered = data.communities.filter((c) => {
    if (filter !== "All" && c.category !== filter) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="space-y-3">
          <InputGroup className="rounded-lg">
            <InputGroupAddon>
              <Search className="size-4 text-muted" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari komunitas, topik, atau anggota..."
              aria-label="Cari komunitas"
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
                {filter !== "All" ? filter : "Kategori"}
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

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm font-semibold text-text">Komunitas tidak ditemukan</p>
            <p className="mt-1 text-xs text-muted">Coba kata kunci atau kategori lain.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((c, i) => (
              <CommunityCard key={c.id} c={c} index={i} />
            ))}
          </div>
        )}

        <div>
          <h2 className="mb-4 font-heading text-lg font-bold text-text">Aktivitas Komunitas</h2>
          {data.feedPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
              <p className="text-sm font-semibold text-text">Belum ada post</p>
              <p className="mt-1 text-xs text-muted">
                Masuk ke komunitas dan bagikan ide, pertanyaan, atau update proyekmu.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.feedPosts.map((post) => (
                <FeedCard key={post.id} post={post} index={0} />
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-heading text-sm font-bold text-text">Kontributor Teratas</h3>
          {data.contributors.length === 0 ? (
            <p className="text-xs text-muted">Belum ada kontributor.</p>
          ) : (
            <div className="space-y-2.5">
              {data.contributors.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/${c.username}`}
                  className="flex items-center gap-3 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="w-4 font-mono text-[10px] font-bold text-muted">
                    #{i + 1}
                  </span>
                  <Avatar name={initials(c.name)} className="size-7 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-text">{c.name}</p>
                    {c.program && (
                      <Badge variant="outline" className="mt-0.5 font-mono text-[8px]">
                        {c.program}
                      </Badge>
                    )}
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-primary">
                    {c.reputationPoints}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-heading text-sm font-bold text-text">Event Mendatang</h3>
          {data.upcomingEvents.length === 0 ? (
            <p className="text-xs text-muted">Belum ada event mendatang.</p>
          ) : (
            <div className="space-y-3">
              {data.upcomingEvents.map((e) => (
                <Link
                  key={e.id}
                  href={`/events/${e.slug}`}
                  className="flex gap-3 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-text">{e.title}</p>
                    <p className="text-[10px] text-muted">
                      {e.dateLabel} &middot; {e.registered} terdaftar
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Button variant="secondary" size="sm" className="mt-3 w-full gap-1" asChild>
            <Link href="/events">
              Lihat Semua Event
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </section>

        {session?.user && (
          <section className="rounded-xl border border-border bg-card p-4 text-center">
            <UserPlus className="mx-auto size-5 text-primary" />
            <h3 className="mt-2 font-heading text-sm font-bold text-text">Mulai Komunitas Baru</h3>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              Tidak menemukan komunitas yang cocok? Buat komunitas untuk program studimu.
            </p>
            <Button variant="secondary" size="sm" className="mt-3 w-full gap-1" asChild>
              <Link href="/community/create">
                Buat Komunitas
                <ChevronRight className="size-3" />
              </Link>
            </Button>
          </section>
        )}
      </aside>
    </div>
  );
}
