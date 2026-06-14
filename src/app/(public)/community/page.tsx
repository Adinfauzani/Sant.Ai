"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Users, MessageSquare, Heart, Share2, Calendar,
  ArrowRight, UserPlus, Sparkles, ChevronRight, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

/* ─── Data ──────────────────────────────────────────── */

const stats = [
  { value: "180+", label: "Active Members", icon: Users },
  { value: "45+", label: "Active Projects", icon: Sparkles },
  { value: "320+", label: "Discussions", icon: MessageSquare },
  { value: "25", label: "Top Contributors", icon: Users },
];

const categories = [
  "All", "Data Science", "Programming", "Web Development",
  "Mobile Development", "AI & Machine Learning", "UI/UX Design",
  "Research", "Cyber Security",
];

const communities = [
  {
    slug: "ai-research-club", name: "AI Research Club",
    desc: "Explore artificial intelligence, machine learning, and deep learning through collaborative research projects.",
    members: 42, discussions: 128, category: "AI & Machine Learning",
    color: "from-blue-600 to-cyan-500",
  },
  {
    slug: "web-development-society", name: "Web Development Society",
    desc: "Build modern web applications with the latest frameworks and technologies. From frontend to backend.",
    members: 56, discussions: 203, category: "Web Development",
    color: "from-emerald-600 to-teal-500",
  },
  {
    slug: "data-science-lab", name: "Data Science Lab",
    desc: "Hands-on data analysis, visualization, and machine learning projects using real-world datasets.",
    members: 38, discussions: 95, category: "Data Science",
    color: "from-purple-600 to-violet-500",
  },
  {
    slug: "mobile-development-community", name: "Mobile Development Community",
    desc: "Create cross-platform and native mobile applications. Share knowledge on Flutter, React Native, and Kotlin.",
    members: 31, discussions: 76, category: "Mobile Development",
    color: "from-amber-600 to-orange-500",
  },
  {
    slug: "cyber-security-circle", name: "Cyber Security Circle",
    desc: "Learn ethical hacking, network security, cryptography, and security best practices through hands-on labs.",
    members: 27, discussions: 64, category: "Cyber Security",
    color: "from-red-600 to-rose-500",
  },
  {
    slug: "ui-ux-design-guild", name: "UI/UX Design Guild",
    desc: "Design intuitive and beautiful user experiences. Master Figma, design systems, and user research.",
    members: 22, discussions: 58, category: "UI/UX Design",
    color: "from-pink-600 to-rose-500",
  },
];

const feedPosts = [
  {
    author: "Aulia Rahman", program: "TI", avatar: "AR",
    content: "Anyone interested in joining a Computer Vision project for campus smart parking? We need 2 more backend developers!",
    likes: 24, comments: 8, time: "2 hours ago",
  },
  {
    author: "Bunga Citra", program: "SD", avatar: "BC",
    content: "Just published my first data analysis project on SANTET! Analyzed campus enrollment trends using Python and visualized with Tableau. Check it out!",
    likes: 42, comments: 15, time: "5 hours ago",
  },
  {
    author: "Dimas Ardiansyah", program: "SI", avatar: "DA",
    content: "Looking for UI/UX designers to collaborate on an ERP system redesign for our final project. DM me if interested!",
    likes: 18, comments: 12, time: "1 day ago",
  },
];

const contributors = [
  { name: "Aulia Rahman", program: "TI", score: 2450, avatar: "AR" },
  { name: "Bunga Citra", program: "SD", score: 2180, avatar: "BC" },
  { name: "Dimas Ardiansyah", program: "SI", score: 1920, avatar: "DA" },
  { name: "Eka Putri", program: "SD", score: 1750, avatar: "EP" },
  { name: "Fajar Nugroho", program: "TI", score: 1630, avatar: "FN" },
];

const upcomingEvents = [
  { title: "Hackathon Sains & Tech 2026", date: "July 15-17", participants: 56, color: "from-blue-600 to-cyan-500" },
  { title: "Workshop: Introduction to Machine Learning", date: "June 28", participants: 32, color: "from-purple-600 to-violet-500" },
];

const programColors: Record<string, string> = {
  SD: "bg-blue-500/15 text-blue-400", TI: "bg-emerald-500/15 text-emerald-400", SI: "bg-purple-500/15 text-purple-400",
};

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border border-border/50 bg-surface/50 p-4 text-center backdrop-blur-sm transition-all hover:border-primary/20">
      <Icon className="mx-auto h-5 w-5 text-primary" />
      <p className="mt-1.5 font-heading text-xl font-bold text-text">{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white ${className ?? "h-8 w-8"}`}>
      {name}
    </div>
  );
}

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = communities.filter((c) => {
    if (filter !== "All" && c.category !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="section-padding">
          <div className="container-main">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Community</p>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">Community Hub</h1>
              <p className="mt-3 text-sm text-muted">
                Connect with students from Sains Data, Teknik Informatika, and Sistem Informasi to collaborate, innovate, and build impactful projects.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>
          </div>
        </section>

        <div className="container-main pb-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── Main content ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Search & Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/50 px-4 py-2.5 transition-colors focus-within:border-primary/30">
                  <Search className="h-4 w-4 text-muted" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search communities, topics, or members..."
                    className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilter(c)}
                      className={`rounded-full px-3 py-1 text-[10px] font-medium transition-all ${
                        filter === c ? "bg-primary text-white shadow-sm" : "bg-surface/50 text-muted border border-border/50 hover:border-primary/30 hover:text-text"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Communities */}
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/community/${c.slug}`} className="group relative block overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                      <div className={`h-2 bg-gradient-to-r ${c.color}`} />
                      <div className="p-4">
                        <h3 className="font-heading text-base font-bold text-text transition-colors group-hover:text-primary">{c.name}</h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{c.desc}</p>
                        <div className="mt-3 flex items-center gap-3 text-[10px] text-muted">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.members}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{c.discussions}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="rounded-md bg-primary/5 px-2 py-0.5 text-[10px] text-primary">{c.category}</span>
                          <span className="h-7 inline-flex items-center gap-1 px-2 rounded-lg text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors">
                            Join <UserPlus className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Feed */}
              <div>
                <h2 className="mb-4 font-heading text-lg font-bold text-text">Community Feed</h2>
                <div className="space-y-3">
                  {feedPosts.map((post, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="rounded-2xl border border-border bg-surface/50 p-4 backdrop-blur-sm transition-all hover:border-primary/20"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar name={post.avatar} className="h-9 w-9 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-text">{post.author}</span>
                            <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold ${programColors[post.program]}`}>{post.program}</span>
                            <span className="text-[10px] text-muted">{post.time}</span>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted">{post.content}</p>
                          <div className="mt-3 flex items-center gap-4 text-[10px] text-muted">
                            <button className="flex items-center gap-1 transition-colors hover:text-primary"><Heart className="h-3 w-3" />{post.likes}</button>
                            <button className="flex items-center gap-1 transition-colors hover:text-primary"><MessageSquare className="h-3 w-3" />{post.comments}</button>
                            <button className="flex items-center gap-1 transition-colors hover:text-primary"><Share2 className="h-3 w-3" />Share</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              {/* Top Contributors */}
              <div className="rounded-2xl border border-border bg-surface/50 p-4 backdrop-blur-sm">
                <h3 className="mb-3 font-heading text-sm font-bold text-text">Top Contributors</h3>
                <div className="space-y-2.5">
                  {contributors.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="w-4 text-[10px] font-bold text-muted">#{i + 1}</span>
                      <Avatar name={c.avatar} className="h-7 w-7 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text truncate">{c.name}</p>
                        <span className={`inline-block rounded px-1 py-0.5 font-mono text-[8px] font-semibold ${programColors[c.program]}`}>{c.program}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-primary">{c.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="rounded-2xl border border-border bg-surface/50 p-4 backdrop-blur-sm">
                <h3 className="mb-3 font-heading text-sm font-bold text-text">Upcoming Events</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((e) => (
                    <div key={e.title} className="flex gap-3">
                      <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center`}>
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text truncate">{e.title}</p>
                        <p className="text-[10px] text-muted">{e.date} &middot; {e.participants} registered</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/events" className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-primary/10 py-2 text-[10px] font-medium text-primary transition-colors hover:bg-primary/20">
                  View All Events <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
