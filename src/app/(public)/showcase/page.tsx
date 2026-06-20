"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye, Heart, Users, Star, ArrowRight, Award, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard, { ProjectCardGrid } from "@/components/project/ProjectCard";
import type { ProjectCardData } from "@/components/project/ProjectCard";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const categories = [
  "All", "AI", "Machine Learning", "Data Analytics", "Web Application",
  "Mobile Application", "Research", "Information System", "IoT", "Cyber Security",
];

const sortOptions = ["Most Popular", "Most Viewed", "Newest", "Highest Rated"];

const showcaseProjects = [
  {
    slug: "smart-campus-parking-system", title: "Smart Campus Parking System",
    desc: "IoT-based parking management system using computer vision and real-time sensor data.",
    tags: ["IoT", "Computer Vision", "React", "Python"],
    team: 4, views: 1240, likes: 89, status: "Completed", impact: 320,
    programs: ["TI", "SD"],
    cover: "from-blue-600/30 to-cyan-400/10",
  },
  {
    slug: "analisis-sentimen-media-sosial", title: "Analisis Sentimen Media Sosial",
    desc: "Machine learning model untuk menganalisis sentimen publik terhadap layanan kampus.",
    tags: ["Machine Learning", "NLP", "Python", "TensorFlow"],
    team: 3, views: 980, likes: 72, status: "Completed", impact: 280,
    programs: ["SD", "SI"],
    cover: "from-purple-600/30 to-violet-400/10",
  },
  {
    slug: "e-learning-platform-ai-tutor", title: "E-Learning Platform with AI Tutor",
    desc: "Adaptive learning platform with AI-powered tutor and personalized study paths.",
    tags: ["AI", "Web Dev", "React", "Node.js"],
    team: 5, views: 1560, likes: 112, status: "Active", impact: 450,
    programs: ["TI", "SD", "SI"],
    cover: "from-emerald-600/30 to-teal-400/10",
  },
  {
    slug: "sistem-informasi-manajemen-aset", title: "Sistem Informasi Manajemen Aset",
    desc: "Web-based asset management system for university IT infrastructure.",
    tags: ["Information System", "Web Dev", "Laravel", "MySQL"],
    team: 3, views: 720, likes: 45, status: "Completed", impact: 190,
    programs: ["SI", "TI"],
    cover: "from-amber-600/30 to-orange-400/10",
  },
  {
    slug: "sistem-deteksi-intrusi-jaringan", title: "Sistem Deteksi Intrusi Jaringan",
    desc: "Network intrusion detection system using deep learning and packet analysis.",
    tags: ["Cyber Security", "Deep Learning", "Python", "Docker"],
    team: 2, views: 890, likes: 67, status: "Review", impact: 210,
    programs: ["TI"],
    cover: "from-red-600/30 to-rose-400/10",
  },
  {
    slug: "smart-watering-system-iot", title: "Smart Watering System IoT",
    desc: "Automated plant watering system with soil moisture monitoring and weather API.",
    tags: ["IoT", "Embedded Systems", "C++", "MQTT"],
    team: 3, views: 540, likes: 38, status: "Completed", impact: 150,
    programs: ["TI", "SD"],
    cover: "from-sky-600/30 to-blue-400/10",
  },
  {
    slug: "analisis-data-akademik-mahasiswa", title: "Analisis Data Akademik Mahasiswa",
    desc: "Predictive analytics untuk memprediksi performa akademik mahasiswa.",
    tags: ["Data Analytics", "Python", "Tableau", "SQL"],
    team: 2, views: 670, likes: 52, status: "Completed", impact: 175,
    programs: ["SD"],
    cover: "from-pink-600/30 to-rose-400/10",
  },
  {
    slug: "mobile-app-peminjaman-lab", title: "Mobile App Peminjaman Lab",
    desc: "Cross-platform mobile application for laboratory equipment booking.",
    tags: ["Mobile Dev", "Flutter", "Firebase"],
    team: 4, views: 820, likes: 61, status: "Active", impact: 230,
    programs: ["TI", "SI"],
    cover: "from-indigo-600/30 to-blue-400/10",
  },
];

const programColors: Record<string, string> = {
  SD: "bg-blue-500/15 text-blue-400", TI: "bg-emerald-500/15 text-emerald-400", SI: "bg-purple-500/15 text-purple-400",
};

function statusProgress(status: string) {
  if (status === "Completed") return 100;
  if (status === "Active") return 65;
  if (status === "Review") return 85;
  return 40;
}

function toShowcaseProjectCard(project: (typeof showcaseProjects)[number]): ProjectCardData {
  return {
    id: project.slug,
    title: project.title,
    description: project.desc,
    status: project.status as ProjectCardData["status"],
    techStack: project.tags,
    memberCount: project.team,
    maxMemberCount: project.team + 2,
    impact: project.impact,
    votes: project.likes,
    programs: project.programs,
    progress: statusProgress(project.status),
    openRoles: [],
  };
}

export default function ShowcasePage() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Most Popular");
  const [search, setSearch] = useState("");

  const filtered = showcaseProjects
    .filter((p) => {
      if (filter !== "All" && !p.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase())) && !p.title.toLowerCase().includes(filter.toLowerCase())) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.desc.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Most Popular") return b.likes - a.likes;
      if (sort === "Most Viewed") return b.views - a.views;
      if (sort === "Newest") return 0;
      if (sort === "Highest Rated") return b.impact - a.impact;
      return 0;
    });

  const featured = showcaseProjects[2]; // E-Learning Platform

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="section-padding">
          <div className="container-main">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Showcase</p>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">Project Showcase</h1>
              <p className="mt-3 text-sm text-muted">
                Explore innovative projects and solutions created by students of Fakultas Ilmu Komputer, Universitas Saintek Muhammadiyah.
              </p>
            </div>
          </div>
        </section>

        <div className="container-main pb-16 space-y-10">
          {/* ── Search & Filters ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/50 px-4 py-2.5 transition-colors focus-within:border-primary/30">
              <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button key={c} onClick={() => setFilter(c)}
                    className={`rounded-full px-3 py-1 text-[10px] font-medium transition-all ${
                      filter === c ? "bg-primary text-white shadow-sm" : "bg-surface/50 text-muted border border-border/50 hover:border-primary/30 hover:text-text"
                    }`}>{c}</button>
                ))}
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border bg-surface/50 px-3 py-1.5 text-[10px] text-muted outline-none">
                {sortOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Featured Project Banner ── */}
          <Link href={`/showcase/${featured.slug}`} className="group relative block overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className={`absolute inset-0 bg-gradient-to-br ${featured.cover} opacity-40`} />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
            <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
              <div className="flex-1">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">Featured Project</span>
                <h2 className="mt-3 font-heading text-2xl font-bold text-text md:text-3xl">{featured.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{featured.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.programs.map((p) => (
                    <span key={p} className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-semibold ${programColors[p]}`}>{p}</span>
                  ))}
                  {featured.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-primary/5 px-2 py-0.5 text-[10px] text-primary">{t}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-[10px] text-muted">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{featured.team} members</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{featured.views}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{featured.likes}</span>
                </div>
              </div>
              <Button size="lg" className="shrink-0 gap-2" asChild>
                <span>View Project <ArrowRight className="h-4 w-4" /></span>
              </Button>
            </div>
          </Link>

          {/* ── Showcase Grid ── */}
          <ProjectCardGrid className="mt-8 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ProjectCard
                  data={toShowcaseProjectCard(p)}
                  href={`/showcase/${p.slug}`}
                  accent={p.cover}
                  variant="showcase"
                  views={p.views}
                  likes={p.likes}
                />
              </motion.div>
            ))}
          </ProjectCardGrid>

          {/* ── Hall of Fame ── */}
          <section>
            <div className="mb-6 text-center">
              <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Hall of Fame</p>
              <h2 className="font-heading text-2xl font-bold text-text">Outstanding Achievements</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Best Innovation", project: "E-Learning Platform with AI Tutor", icon: Trophy, color: "from-amber-500 to-orange-500" },
                { title: "Most Impactful", project: "Smart Campus Parking System", icon: Award, color: "from-blue-500 to-cyan-500" },
                { title: "Community Favorite", project: "Analisis Sentimen Media Sosial", icon: Heart, color: "from-pink-500 to-rose-500" },
                { title: "Faculty Choice", project: "Sistem Informasi Manajemen Aset", icon: Star, color: "from-purple-500 to-violet-500" },
              ].map((h) => (
                <div key={h.title} className="rounded-2xl border border-border bg-surface/50 p-4 text-center backdrop-blur-sm transition-all hover:border-primary/20">
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${h.color}`}>
                    <h.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-text">{h.title}</p>
                  <p className="mt-1 text-[10px] text-muted">{h.project}</p>
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
