"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, Users, Mic, Trophy, MapPin, Clock, ArrowRight,
  ChevronRight, BookOpen, Video, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

/* ─── Data ──────────────────────────────────────────── */

const stats = [
  { value: "24", label: "Upcoming Events", icon: Calendar },
  { value: "560+", label: "Registered Participants", icon: Users },
  { value: "18", label: "Speakers", icon: Mic },
  { value: "8", label: "Competitions", icon: Trophy },
];

const categories = [
  "All Events", "Workshop", "Seminar", "Hackathon",
  "Competition", "Community Meetup", "Research Session", "Guest Lecture",
];

const events = [
  {
    slug: "hackathon-sains-tech-2026", title: "Hackathon Sains & Tech 2026",
    tagline: "Build innovative solutions for campus sustainability",
    date: "July 15-17, 2026", time: "09:00 - 17:00 WIB",
    location: "Gedung Serbaguna Kampus A", category: "Hackathon",
    participants: 56, status: "Open",
    organizer: "BEM Fakultas Ilmu Komputer",
    cover: "from-blue-600/30 to-cyan-400/10", color: "from-blue-600 to-cyan-500",
  },
  {
    slug: "workshop-intro-machine-learning", title: "Workshop: Intro to Machine Learning",
    tagline: "Learn ML fundamentals with Python and scikit-learn",
    date: "June 28, 2026", time: "13:00 - 16:00 WIB",
    location: "Lab Komputer Lantai 3", category: "Workshop",
    participants: 32, status: "Open",
    organizer: "AI Research Club",
    cover: "from-purple-600/30 to-violet-400/10", color: "from-purple-600 to-violet-500",
  },
  {
    slug: "seminar-karir-di-era-ai", title: "Seminar: Karir di Era AI",
    tagline: "Insight dari praktisi industri tentang masa depan teknologi",
    date: "July 5, 2026", time: "09:00 - 12:00 WIB",
    location: "Auditorium Utama", category: "Seminar",
    participants: 120, status: "Limited Seats",
    organizer: "Himpunan Mahasiswa TI",
    cover: "from-emerald-600/30 to-teal-400/10", color: "from-emerald-600 to-teal-500",
  },
  {
    slug: "competition-ui-ux-design-challenge", title: "Competition: UI/UX Design Challenge",
    tagline: "Design a mobile app for campus digital services",
    date: "August 2, 2026", time: "08:00 - 16:00 WIB",
    location: "Online", category: "Competition",
    participants: 28, status: "Open",
    organizer: "UI/UX Design Guild",
    cover: "from-pink-600/30 to-rose-400/10", color: "from-pink-600 to-rose-500",
  },
  {
    slug: "community-meetup-tech-talks-4", title: "Community Meetup: Tech Talks #4",
    tagline: "Sharing session proyek-proyek teknologi mahasiswa",
    date: "July 10, 2026", time: "15:00 - 17:30 WIB",
    location: "Ruang Diskusi FIF", category: "Community Meetup",
    participants: 18, status: "Open",
    organizer: "SANTET Community",
    cover: "from-amber-600/30 to-orange-400/10", color: "from-amber-600 to-orange-500",
  },
  {
    slug: "research-session-big-data-analytics", title: "Research Session: Big Data Analytics",
    tagline: "Presentasi penelitian big data untuk analisis akademik",
    date: "July 8, 2026", time: "10:00 - 12:00 WIB",
    location: "Ruang Seminar Lt. 2", category: "Research Session",
    participants: 15, status: "Limited Seats",
    organizer: "Data Science Lab",
    cover: "from-sky-600/30 to-blue-400/10", color: "from-sky-600 to-blue-500",
  },
  {
    slug: "guest-lecture-cybersecurity-trends", title: "Guest Lecture: Cybersecurity Trends",
    tagline: "Kuliah tamu dari praktisi keamanan siber nasional",
    date: "August 10, 2026", time: "09:00 - 11:00 WIB",
    location: "Aula Lt. 3", category: "Guest Lecture",
    participants: 85, status: "Closed",
    organizer: "Cyber Security Circle",
    cover: "from-red-600/30 to-rose-400/10", color: "from-red-600 to-rose-500",
  },
  {
    slug: "workshop-flutter-mobile-development", title: "Workshop: Flutter Mobile Development",
    tagline: "Bangun aplikasi mobile cross-platform dengan Flutter",
    date: "July 22, 2026", time: "13:00 - 16:00 WIB",
    location: "Lab Komputer Lt. 2", category: "Workshop",
    participants: 40, status: "Limited Seats",
    organizer: "Mobile Dev Community",
    cover: "from-indigo-600/30 to-blue-400/10", color: "from-indigo-600 to-blue-500",
  },
];

const pastEvents = [
  {
    title: "Workshop React.js & Tailwind CSS",
    summary: "Peserta belajar membangun modern web apps dengan React dan Tailwind CSS.",
    date: "May 20, 2026", attendees: 45,
    cover: "from-blue-600/30 to-cyan-400/10",
  },
  {
    title: "Seminar: Startup Building 101",
    summary: "Pembahasan strategi membangun startup dari ide hingga pendanaan.",
    date: "May 12, 2026", attendees: 78,
    cover: "from-purple-600/30 to-violet-400/10",
  },
  {
    title: "Campus Coding Competition 2026",
    summary: "Kompetisi coding antar mahasiswa se-Universitas Saintek Muhammadiyah.",
    date: "April 28, 2026", attendees: 52,
    cover: "from-emerald-600/30 to-teal-400/10",
  },
];

const statusColors: Record<string, string> = {
  Open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Limited Seats": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Closed: "bg-red-500/10 text-red-400 border-red-500/20",
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

export default function EventsPage() {
  const [filter, setFilter] = useState("All Events");
  const [search, setSearch] = useState("");

  const filtered = events.filter((e) => {
    if (filter !== "All Events" && e.category !== filter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.tagline.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featured = events[0];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="section-padding">
          <div className="container-main">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Events</p>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">Events &amp; Activities</h1>
              <p className="mt-3 text-sm text-muted">
                Discover workshops, competitions, hackathons, and technology events within the Sains &amp; Technology ecosystem.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>
          </div>
        </section>

        <div className="container-main pb-16 space-y-10">
          {/* ── Search & Filters ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/50 px-4 py-2.5 transition-colors focus-within:border-primary/30">
              <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`rounded-full px-3 py-1 text-[10px] font-medium transition-all ${
                    filter === c ? "bg-primary text-white shadow-sm" : "bg-surface/50 text-muted border border-border/50 hover:border-primary/30 hover:text-text"
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          {/* ── Featured Event ── */}
          <Link href={`/events/${featured.slug}`} className="group relative block overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className={`absolute inset-0 bg-gradient-to-br ${featured.cover} opacity-30`} />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
            <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">Featured Event</span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-semibold ${statusColors[featured.status]}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      featured.status === "Open" ? "bg-emerald-500" : featured.status === "Limited Seats" ? "bg-amber-500" : "bg-red-500"
                    }`} />
                    {featured.status}
                  </span>
                </div>
                <h2 className="mt-3 font-heading text-2xl font-bold text-text md:text-3xl">{featured.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{featured.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{featured.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{featured.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{featured.location}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" />{featured.participants} registered</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="lg" className="gap-2">Register Now <ArrowRight className="h-4 w-4" /></Button>
                <Button size="lg" variant="outline">View Details</Button>
              </div>
            </div>
          </Link>

          {/* ── Event Grid ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link href={`/events/${e.slug}`} className="group relative block overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className={`flex h-28 items-end bg-gradient-to-br ${e.cover}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${e.color} opacity-10`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="relative z-10 p-3">
                      <span className="rounded-full bg-black/30 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">{e.category}</span>
                    </div>
                    <span className={`absolute right-3 top-3 z-10 rounded-full border px-2 py-0.5 font-mono text-[8px] font-semibold ${statusColors[e.status]}`}>{e.status}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-sm font-bold text-text transition-colors group-hover:text-primary">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted">{e.tagline}</p>
                    <div className="mt-3 space-y-1.5 text-[10px] text-muted">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{e.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{e.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{e.location}</span>
                      <span className="flex items-center gap-1.5"><Users className="h-3 w-3" />{e.participants} participants</span>
                    </div>
                    <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" className="flex-1 h-7 text-[10px] gap-1">Register <ArrowRight className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="flex-1 h-7 text-[10px]">Details</Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ── Past Events ── */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Archive</p>
                <h2 className="font-heading text-xl font-bold text-text">Past Events</h2>
              </div>
              <Link href="#" className="flex items-center gap-1 text-[10px] font-medium text-primary transition-all hover:gap-1.5">
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {pastEvents.map((e) => (
                <div key={e.title} className="group rounded-2xl border border-border bg-surface/50 overflow-hidden backdrop-blur-sm transition-all hover:border-primary/20">
                  <div className={`h-2 bg-gradient-to-r ${e.cover}`} />
                  <div className="p-4">
                    <h3 className="font-heading text-sm font-semibold text-text transition-colors group-hover:text-primary">{e.title}</h3>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted">{e.summary}</p>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-muted">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.date}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{e.attendees} attendees</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="ghost" className="flex-1 h-7 text-[10px] gap-1"><Video className="h-3 w-3" />Recording</Button>
                      <Button size="sm" variant="ghost" className="flex-1 h-7 text-[10px] gap-1"><Download className="h-3 w-3" />Certificate</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
