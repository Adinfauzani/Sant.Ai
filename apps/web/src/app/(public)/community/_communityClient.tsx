"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Popover from "@radix-ui/react-popover";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Users, MessageSquare, Heart, Share2, Calendar,
  ArrowRight, UserPlus, ChevronRight,
} from "lucide-react";
import { programColor } from "@/lib/communityPalette";
import type {
  CommunityData,
  CommunityCardData,
  CommunityFeedPost,
} from "@/lib/community";
import { useSession } from "@/lib/authClient";
import { togglePostLike } from "@/lib/communityActions";

const programColors: Record<string, string> = {
  SD: "bg-blue-500/15 text-blue-400",
  TI: "bg-emerald-500/15 text-emerald-400",
  SI: "bg-purple-500/15 text-purple-400",
};

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white ${className ?? "h-8 w-8"}`}>
      {name}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/community/${c.slug}`} className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className={`h-2 bg-gradient-to-r ${programColor(index)}`} />
        <div className="p-4">
          <h3 className="font-heading text-base font-bold text-text transition-colors group-hover:text-primary">{c.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{c.description}</p>
          <div className="mt-3 flex items-center gap-3 text-[10px] text-muted">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.memberCount}</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{c.discussionCount}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-md bg-primary/5 px-2 py-0.5 text-[10px] text-primary">{c.category}</span>
            <span className="h-7 inline-flex items-center gap-1 px-2 rounded-lg text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors">
              Explore <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/20"
    >
      <div className="flex items-start gap-3">
        <Avatar name={initials(post.authorName)} className="h-9 w-9 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-text">{post.authorName}</span>
            {post.program && (
              <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold ${programColors[post.program]}`}>{post.program}</span>
            )}
            <span className="text-[10px] text-muted">{timeAgo(post.createdAt)}</span>
          </div>
          <Link href={`/community/${post.communitySlug}`} className="mt-0.5 inline-block text-[10px] font-medium text-primary hover:text-primary/80">
            in {post.communityName}
          </Link>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{post.content}</p>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-muted">
            <button onClick={handleLike} className={`flex items-center gap-1 transition-colors hover:text-primary ${liked ? "text-primary" : ""}`}>
              <Heart className={`h-3 w-3 ${liked ? "fill-primary" : ""}`} />{likes}
            </button>
            <button className="flex items-center gap-1 transition-colors hover:text-primary"><Share2 className="h-3 w-3" />Share</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CommunityClient({ data }: { data: CommunityData }) {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(data.communities.map((c) => c.category)))];

  const filtered = data.communities.filter((c) => {
    if (filter !== "All" && c.category !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/50 px-4 py-2.5 transition-colors focus-within:border-primary/30">
            <Search className="h-4 w-4 shrink-0 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities, topics, or members..."
              className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
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
                  {filter !== "All" ? filter : "Category"}
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

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm font-semibold text-text">No communities found</p>
            <p className="mt-1 text-xs text-muted">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((c, i) => (
              <CommunityCard key={c.id} c={c} index={i} />
            ))}
          </div>
        )}

        <div>
          <h2 className="mb-4 font-heading text-lg font-bold text-text">Community Feed</h2>
          {data.feedPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
              <p className="text-sm font-semibold text-text">Belum ada post</p>
              <p className="mt-1 text-xs text-muted">
                Masuk ke komunitas dan bagikan ide, pertanyaan, atau update proyekmu.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.feedPosts.map((post, i) => (
                <FeedCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-3 font-heading text-sm font-bold text-text">Top Contributors</h3>
          {data.contributors.length === 0 ? (
            <p className="text-xs text-muted">Belum ada kontributor.</p>
          ) : (
            <div className="space-y-2.5">
              {data.contributors.map((c, i) => (
                <Link key={c.id} href={`/${c.username}`} className="flex items-center gap-3 transition-colors hover:opacity-80">
                  <span className="w-4 text-[10px] font-bold text-muted">#{i + 1}</span>
                  <Avatar name={initials(c.name)} className="h-7 w-7 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{c.name}</p>
                    {c.program && (
                      <span className={`inline-block rounded px-1 py-0.5 font-mono text-[8px] font-semibold ${programColors[c.program] || ""}`}>{c.program}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-primary">{c.reputationPoints}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-3 font-heading text-sm font-bold text-text">Upcoming Events</h3>
          {data.upcomingEvents.length === 0 ? (
            <p className="text-xs text-muted">Belum ada event mendatang.</p>
          ) : (
            <div className="space-y-3">
              {data.upcomingEvents.map((e, i) => (
                <Link key={e.id} href={`/events/${e.slug}`} className="flex gap-3 transition-colors hover:opacity-80">
                  <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${programColor(i)} flex items-center justify-center`}>
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{e.title}</p>
                    <p className="text-[10px] text-muted">{e.dateLabel} &middot; {e.registered} registered</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/events" className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-primary/10 py-2 text-[10px] font-medium text-primary transition-colors hover:bg-primary/20">
            View All Events <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {session?.user && (
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <UserPlus className="mx-auto h-5 w-5 text-primary" />
            <h3 className="mt-2 font-heading text-sm font-bold text-text">Mulai Komunitas Baru</h3>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              Tidak menemukan komunitas yang cocok? Buat komunitas untuk program studimu.
            </p>
            <Link href="/community/create" className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-primary/10 py-2 text-[10px] font-medium text-primary transition-colors hover:bg-primary/20">
              Buat Komunitas <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}