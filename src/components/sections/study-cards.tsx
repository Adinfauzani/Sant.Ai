"use client";

import { motion } from "framer-motion";
import {
  BarChart3, Code, Database, GraduationCap, Briefcase, ArrowRight,
} from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hoverCard";
import Link from "next/link";

interface ProgramCourse {
  semester: number;
  courses: string[];
}

interface Program {
  title: string;
  tag: string;
  color: string;
  icon: React.ReactNode;
  desc: string;
  topics: string[];
  careers: string[];
  curriculum: ProgramCourse[];
}

const programs: Program[] = [
  {
    title: "Sains Data",
    tag: "SD",
    color: "from-blue-600 to-blue-500",
    icon: <BarChart3 className="h-6 w-6" />,
    desc: "Data-driven insights, statistical modeling, and machine learning. Pelajari cara mengolah data skala besar menjadi keputusan strategis.",
    topics: ["Python", "Statistics", "Machine Learning", "Big Data", "Data Visualization"],
    careers: ["Data Scientist", "Data Analyst", "ML Engineer", "Business Intelligence"],
    curriculum: [
      { semester: 1, courses: ["Matematika Dasar", "Algoritma", "Pengantar Data Science", "Statistika"] },
      { semester: 3, courses: ["Machine Learning", "Visualisasi Data", "Big Data", "Database"] },
      { semester: 5, courses: ["Deep Learning", "NLP", "Time Series", "Cloud Computing"] },
    ],
  },
  {
    title: "Teknik Informatika",
    tag: "TI",
    color: "from-emerald-600 to-emerald-500",
    icon: <Code className="h-6 w-6" />,
    desc: "Software engineering, system architecture, dan pengembangan aplikasi. Bangun solusi teknologi dari nol hingga production.",
    topics: ["Algorithms", "Web Dev", "Mobile Dev", "Cloud", "Cyber Security"],
    careers: ["Software Engineer", "Fullstack Developer", "DevOps Engineer", "Security Analyst"],
    curriculum: [
      { semester: 1, courses: ["Pemrograman Dasar", "Matematika Diskrit", "Logika Informatika", "Arsitektur Komputer"] },
      { semester: 3, courses: ["Struktur Data", "Pemrograman Web", "Basis Data", "Jaringan Komputer"] },
      { semester: 5, courses: ["Rekayasa Perangkat Lunak", "Mobile Dev", "Cloud Computing", "Cyber Security"] },
    ],
  },
  {
    title: "Sistem Informasi",
    tag: "SI",
    color: "from-purple-600 to-purple-500",
    icon: <Database className="h-6 w-6" />,
    desc: "Bridging business processes with technology. Rancang sistem informasi yang efektif dan efisien untuk organisasi.",
    topics: ["Business Process", "Database Design", "ERP", "UI/UX", "Project Management"],
    careers: ["System Analyst", "IT Consultant", "Project Manager", "UI/UX Designer"],
    curriculum: [
      { semester: 1, courses: ["Pengantar Sistem Informasi", "Akuntansi Dasar", "Manajemen Bisnis", "Logika Pemrograman"] },
      { semester: 3, courses: ["Analisis Proses Bisnis", "Perancangan Basis Data", "UI/UX Design", "ERP"] },
      { semester: 5, courses: ["Manajemen Proyek SI", "Audit SI", "E-Business", "Data Warehouse"] },
    ],
  },
];

function PopupContent({ program }: { program: Program }) {
  return (
    <div className="w-80">
      <div className={`flex items-center gap-3 bg-gradient-to-br ${program.color} rounded-t-xl p-4 text-white`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
          {program.icon}
        </div>
        <div>
          <p className="font-heading font-bold">{program.title}</p>
          <span className="text-xs text-white/70">{program.tag}</span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
            <GraduationCap className="h-3 w-3" />
            Curriculum Highlights
          </p>
          {program.curriculum.map((sem) => (
            <div key={sem.semester} className="mb-2">
              <p className="mb-1 text-[11px] font-semibold text-text">Semester {sem.semester}</p>
              <div className="flex flex-wrap gap-1">
                {sem.courses.map((c) => (
                  <span key={c} className="rounded bg-primary/5 px-2 py-0.5 text-[10px] text-primary">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
            <Briefcase className="h-3 w-3" />
            Career Paths
          </p>
          <div className="flex flex-wrap gap-1.5">
            {program.careers.map((c) => (
              <span key={c} className="rounded-full border border-border px-2.5 py-0.5 text-[10px] text-muted">{c}</span>
            ))}
          </div>
        </div>

        <Link
          href={`/projects?program=${program.tag}`}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          Explore {program.tag} Projects
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function StudyCards() {
  return (
    <section className="section-padding">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 hidden text-center md:block"
        >
          <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Programs
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">
            Yang Dipelajari
          </h2>
          <p className="mt-3 text-sm text-muted">
            Tiga program studi dengan fokus keahlian yang berbeda, saling melengkapi dalam satu ekosistem
          </p>
        </motion.div>

        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {programs.map((p, i) => (
            <HoverCard key={p.title} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="cursor-default overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-primary/30"
                >
                  <div className={`flex items-center gap-3 bg-gradient-to-br ${p.color} p-5 text-white`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                      {p.icon}
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold">{p.title}</p>
                      <span className="text-xs text-white/70">{p.tag}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-relaxed text-muted">{p.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.topics.map((t) => (
                        <span key={t} className="rounded-md bg-primary/5 px-2.5 py-1 text-xs text-primary">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </HoverCardTrigger>
              <HoverCardContent side="right" className="hidden md:block">
                <PopupContent program={p} />
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
