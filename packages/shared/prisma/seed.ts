import { config } from "dotenv";
import { resolve } from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: resolve(process.cwd(), "../../apps/server/.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const sources = [
  // API sources
  { name: "GNews", type: "news", url: "https://gnews.io", rssUrl: "", status: "active" },
  { name: "YouTube", type: "video", url: "https://youtube.com", rssUrl: "", status: "active" },

  // Working RSS feeds
  { name: "Tempo.co", type: "news", url: "https://tempo.co", rssUrl: "https://rss.tempo.co", status: "active" },
  { name: "Antara News", type: "news", url: "https://antaranews.com", rssUrl: "https://www.antaranews.com/rss/terkini.xml", status: "active" },
  { name: "Republika", type: "news", url: "https://republika.co.id", rssUrl: "https://www.republika.co.id/rss", status: "active" },
  { name: "Tribunnews", type: "news", url: "https://tribunnews.com", rssUrl: "https://www.tribunnews.com/rss", status: "active" },
  { name: "Bisnis Indonesia", type: "news", url: "https://bisnis.com", rssUrl: "https://rss.bisnis.com", status: "active" },
  { name: "BBC Indonesia", type: "news", url: "https://bbc.com/indonesia", rssUrl: "https://feeds.bbci.co.uk/indonesia/rss.xml", status: "active" },
  { name: "Muhammadiyah", type: "news", url: "https://muhammadiyah.or.id", rssUrl: "https://muhammadiyah.or.id/feed", status: "active" },
  { name: "UMSIDA", type: "news", url: "https://umsida.ac.id", rssUrl: "https://umsida.ac.id/feed", status: "active" },

  // Non-RSS portals (mark as inactive for now)
  { name: "Kompas.com", type: "news", url: "https://kompas.com", rssUrl: "", status: "inactive" },
  { name: "Detik.com", type: "news", url: "https://detik.com", rssUrl: "", status: "inactive" },
  { name: "CNN Indonesia", type: "news", url: "https://cnnindonesia.com", rssUrl: "", status: "inactive" },
  { name: "CNBC Indonesia", type: "news", url: "https://cnbcindonesia.com", rssUrl: "", status: "inactive" },
  { name: "Liputan6", type: "news", url: "https://liputan6.com", rssUrl: "", status: "inactive" },
  { name: "Okezone", type: "news", url: "https://okezone.com", rssUrl: "", status: "inactive" },
  { name: "Sindo News", type: "news", url: "https://sindonews.com", rssUrl: "", status: "inactive" },
  { name: "Kontan", type: "news", url: "https://kontan.co.id", rssUrl: "", status: "inactive" },
  { name: "Media Indonesia", type: "news", url: "https://mediaindonesia.com", rssUrl: "", status: "inactive" },
  { name: "Kumparan", type: "news", url: "https://kumparan.com", rssUrl: "", status: "inactive" },
  { name: "IDN Times", type: "news", url: "https://idntimes.com", rssUrl: "", status: "inactive" },
  { name: "Mongabay Indonesia", type: "news", url: "https://mongabay.co.id", rssUrl: "", status: "inactive" },
  { name: "VOA Indonesia", type: "news", url: "https://voaindonesia.com", rssUrl: "", status: "inactive" },
  { name: "Al Jazeera Indonesia", type: "news", url: "https://aljazeera.com", rssUrl: "", status: "inactive" },
  { name: "Viva", type: "news", url: "https://viva.co.id", rssUrl: "", status: "inactive" },
  { name: "Merdeka", type: "news", url: "https://merdeka.com", rssUrl: "", status: "inactive" },
  { name: "Suara", type: "news", url: "https://suara.com", rssUrl: "", status: "inactive" },
  { name: "Suara Muhammadiyah", type: "news", url: "https://suaramuhammadiyah.id", rssUrl: "", status: "inactive" },
  { name: "PWMU", type: "news", url: "https://pwmu.co", rssUrl: "", status: "inactive" },
  { name: "UMM", type: "news", url: "https://umm.ac.id", rssUrl: "", status: "inactive" },
];

const keywords = [
  { keyword: "Artificial Intelligence", category: "Literasi Digital" },
  { keyword: "Digital Literacy", category: "Literasi Digital" },
  { keyword: "Media Sosial", category: "Literasi Digital" },
  { keyword: "Hoaks", category: "Literasi Digital" },
  { keyword: "Digital Education", category: "Literasi Digital" },
  { keyword: "Generative AI", category: "Literasi Digital" },
  { keyword: "E-Learning", category: "Literasi Digital" },
  { keyword: "EdTech Indonesia", category: "Literasi Digital" },
  { keyword: "Belajar Online", category: "Literasi Digital" },
  { keyword: "Kreativitas Digital", category: "Literasi Digital" },
  { keyword: "Cyber Security", category: "Keamanan Digital" },
  { keyword: "Malware", category: "Keamanan Digital" },
  { keyword: "Ransomware", category: "Keamanan Digital" },
  { keyword: "Phishing", category: "Keamanan Digital" },
  { keyword: "Data Breach", category: "Keamanan Digital" },
  { keyword: "Cyber Crime", category: "Keamanan Digital" },
  { keyword: "Keamanan Data", category: "Keamanan Digital" },
  { keyword: "Enkripsi", category: "Keamanan Digital" },
  { keyword: "Serangan Siber", category: "Keamanan Digital" },
  { keyword: "Privasi Data", category: "Keamanan Digital" },
  { keyword: "Pendidikan Indonesia", category: "Pendidikan" },
  { keyword: "Merdeka Belajar", category: "Pendidikan" },
  { keyword: "Mahasiswa", category: "Pendidikan" },
  { keyword: "Teknologi Digital", category: "Teknologi" },
  { keyword: "Startup Indonesia", category: "Teknologi" },
  { keyword: "Inovasi Teknologi", category: "Teknologi" },
  { keyword: "Ekonomi Digital", category: "Ekonomi" },
  { keyword: "UMKM Digital", category: "Ekonomi" },
  { keyword: "Fintech", category: "Ekonomi" },
  { keyword: "Kesehatan Mental", category: "Kesehatan" },
  { keyword: "Vaksinasi", category: "Kesehatan" },
  { keyword: "Transformasi Kesehatan", category: "Kesehatan" },
  { keyword: "Komunitas Digital", category: "Sosial" },
  { keyword: "Inklusi Digital", category: "Sosial" },
  { keyword: "Budaya Digital", category: "Sosial" },
  { keyword: "Lingkungan Hidup", category: "Lingkungan" },
  { keyword: "Energi Terbarukan", category: "Lingkungan" },
  { keyword: "Perubahan Iklim", category: "Lingkungan" },
  { keyword: "Kebijakan Digital", category: "Politik" },
  { keyword: "Pilkada", category: "Politik" },
  { keyword: "UU ITE", category: "Politik" },
];

async function seed() {
  console.log("Seeding Sant.Ai Data Intelligence...\n");

  for (const s of sources) {
    await prisma.source.upsert({
      where: { name: s.name },
      update: { type: s.type, url: s.url, rssUrl: s.rssUrl, status: s.status },
      create: s,
    });
    console.log(`  Source: ${s.name} (${s.status})${s.rssUrl ? ' [RSS]' : ''}`);
  }

  for (const kw of keywords) {
    await prisma.keyword.upsert({
      where: { keyword: kw.keyword },
      update: { category: kw.category, active: true },
      create: { ...kw, active: true },
    });
  }
  console.log(`  Keywords: ${keywords.length} seeded`);

  console.log("\nSeeding Communities & Events...\n");

  const communities = [
    {
      slug: "ai-research-club",
      name: "AI Research Club",
      description: "Explore artificial intelligence, machine learning, and deep learning through collaborative research projects.",
      fullDescription:
        "AI Research Club adalah komunitas mahasiswa yang fokus pada pengembangan dan riset di bidang Artificial Intelligence. Mulai dari machine learning, deep learning, computer vision, hingga natural language processing. Kami mengadakan workshop rutin, study group, dan proyek riset kolaboratif setiap semester.",
      category: "AI & Machine Learning",
      topics: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Reinforcement Learning"],
      rules: [
        "Wajib aktif dalam minimal 1 proyek per semester",
        "Menjaga suasana akademik yang kondusif",
        "Sharing pengetahuan dan sumber daya",
        "Menghargai perbedaan latar belakang prodi",
      ],
    },
    {
      slug: "web-development-society",
      name: "Web Development Society",
      description: "Build modern web applications with the latest frameworks and technologies.",
      fullDescription:
        "Web Development Society adalah komunitas bagi mahasiswa yang tertarik dengan pengembangan web. Dari frontend hingga backend, dari HTML/CSS hingga framework modern seperti React, Next.js, dan Laravel. Kami mengadakan coding session, hackathon internal, dan proyek kolaboratif.",
      category: "Web Development",
      topics: ["React", "Next.js", "Vue.js", "Laravel", "Node.js", "Tailwind CSS"],
      rules: [
        "Mengikuti standar kode yang disepakati",
        "Code review sebelum merge",
        "Dokumentasi wajib untuk setiap proyek",
        "Partisipasi dalam minimal 1 proyek",
      ],
    },
    {
      slug: "data-science-lab",
      name: "Data Science Lab",
      description: "Hands-on data analysis, visualization, and machine learning projects using real-world datasets.",
      fullDescription:
        "Data Science Lab adalah komunitas untuk mahasiswa yang tertarik dengan data science. Kami mengerjakan proyek analisis data menggunakan dataset nyata, belajar visualisasi data, statistical modeling, dan machine learning. Cocok untuk mahasiswa SD dan siapa pun yang tertarik dengan data.",
      category: "Data Science",
      topics: ["Python", "Pandas", "Data Visualization", "Statistical Analysis", "Big Data"],
      rules: [
        "Membawa dataset sendiri untuk setiap sesi",
        "Mempresentasikan hasil analisis secara bergiliran",
        "Mencantumkan sumber data yang digunakan",
        "Bersedia membantu anggota lain",
      ],
    },
  ];

  for (const c of communities) {
    const { topics, rules, ...rest } = c;
    await prisma.community.upsert({
      where: { slug: c.slug },
      update: {
        ...rest,
        topics: JSON.stringify(topics),
        rules: JSON.stringify(rules),
      },
      create: {
        ...rest,
        topics: JSON.stringify(topics),
        rules: JSON.stringify(rules),
      },
    });
    console.log(`  Community: ${c.name}`);
  }

  const events = [
    {
      slug: "hackathon-sains-tech-2026",
      title: "Hackathon Sains & Tech 2026",
      tagline: "Build innovative solutions for campus sustainability",
      description:
        "Hackathon Sains & Tech 2026 adalah kompetisi programming 3 hari dimana peserta akan membangun solusi inovatif untuk tantangan keberlanjutan kampus. Mulai dari manajemen energi, pengelolaan sampah, transportasi kampus, hingga sistem informasi akademik.",
      location: "Gedung Serbaguna Kampus A",
      category: "Hackathon",
      status: "Open",
      organizer: "BEM Fakultas Ilmu Komputer",
      startAt: new Date("2026-10-14T02:00:00.000Z"),
      endAt: new Date("2026-10-16T10:00:00.000Z"),
      maxParticipants: 100,
      contact: "BEM Fasilkom — bem.fasilkom@usm.ac.id",
      agenda: [
        { time: "Day 1 — 09:00", activity: "Opening Ceremony & Keynote", speaker: "Rektor USM" },
        { time: "Day 1 — 10:30", activity: "Challenge Briefing & Team Formation" },
        { time: "Day 1 — 13:00", activity: "Hacking Begins" },
        { time: "Day 2 — 09:00", activity: "Mentoring Session", speaker: "Industry Mentors" },
        { time: "Day 2 — 19:00", activity: "Progress Checkpoint" },
        { time: "Day 3 — 08:00", activity: "Final Submission" },
        { time: "Day 3 — 13:00", activity: "Presentations & Judging" },
        { time: "Day 3 — 16:00", activity: "Award Ceremony" },
      ],
      speakers: [
        { name: "Dr. Andi Pratama", role: "Rektor USM", topic: "Keynote: Masa Depan Teknologi Kampus" },
        { name: "Rina Wijaya, M.T.", role: "Dosen TI", topic: "Technical Mentoring" },
        { name: "Fahmi Hakim", role: "CEO TechStartup", topic: "From Campus to Industry" },
      ],
      requirements: [
        "Mahasiswa aktif Fakultas Ilmu Komputer USM",
        "Membawa laptop sendiri",
        "Memiliki dasar pemrograman",
        "Tim maksimal 4 orang (boleh lintas prodi)",
      ],
      benefits: [
        "Sertifikat partisipasi",
        "Hadiah juara: IDR 5jt / 3jt / 2jt",
        "Mentoring dari praktisi industri",
        "Kesempatan magang di perusahaan partner",
        "Poin reputasi Sant.Ai",
      ],
    },
    {
      slug: "workshop-intro-machine-learning",
      title: "Workshop: Intro to Machine Learning",
      tagline: "Learn ML fundamentals with Python and scikit-learn",
      description:
        "Workshop ini dirancang untuk memperkenalkan konsep dasar Machine Learning menggunakan Python dan scikit-learn. Peserta akan belajar dari teori hingga praktik langsung membangun model ML sederhana.",
      location: "Lab Komputer Lantai 3",
      category: "Workshop",
      status: "Open",
      organizer: "AI Research Club",
      startAt: new Date("2026-09-24T06:00:00.000Z"),
      endAt: new Date("2026-09-24T09:00:00.000Z"),
      maxParticipants: 40,
      contact: "AI Research Club — ai.club@usm.ac.id",
      agenda: [
        { time: "13:00 - 13:30", activity: "Pengantar Machine Learning", speaker: "Aulia Rahman" },
        { time: "13:30 - 14:30", activity: "Hands-on: Data Preparation & Visualization" },
        { time: "14:30 - 15:30", activity: "Hands-on: Building Classification Model" },
        { time: "15:30 - 16:00", activity: "Q&A dan Diskusi" },
      ],
      speakers: [{ name: "Aulia Rahman", role: "AI Research Club Lead", topic: "ML Fundamentals" }],
      requirements: ["Dasar Python", "Laptop dengan Python dan Jupyter Notebook terinstall"],
      benefits: ["Modul workshop", "Sertifikat", "Akses repositori kode"],
    },
    {
      slug: "seminar-karir-di-era-ai",
      title: "Seminar: Karir di Era AI",
      tagline: "Insight dari praktisi industri tentang masa depan teknologi",
      description:
        "Seminar ini menghadirkan praktisi industri untuk berbagi wawasan tentang perkembangan karir di era Artificial Intelligence. Cocok untuk mahasiswa yang ingin mempersiapkan diri memasuki dunia kerja.",
      location: "Auditorium Utama",
      category: "Seminar",
      status: "Limited Seats",
      organizer: "Himpunan Mahasiswa TI",
      startAt: new Date("2026-09-30T02:00:00.000Z"),
      endAt: new Date("2026-09-30T05:00:00.000Z"),
      maxParticipants: 200,
      contact: "HMTI — hmti@usm.ac.id",
      agenda: [
        { time: "09:00 - 09:30", activity: "Registrasi" },
        { time: "09:30 - 10:30", activity: "Sesi 1: AI dan Masa Depan Pekerjaan", speaker: "Dian Permata, Ph.D" },
        { time: "10:30 - 11:30", activity: "Sesi 2: Skill yang Dibutuhkan di Era AI", speaker: "Praktisi Industri" },
        { time: "11:30 - 12:00", activity: "Diskusi & Tanya Jawab" },
      ],
      speakers: [
        { name: "Dian Permata, Ph.D", role: "AI Researcher", topic: "AI dan Masa Depan Pekerjaan" },
        { name: "Bambang Setiawan", role: "CTO TechCompany", topic: "Skill yang Dibutuhkan" },
      ],
      requirements: [],
      benefits: ["Sertifikat", "Networking dengan praktisi", "E-book seminar"],
    },
    {
      slug: "community-meetup-tech-talks-4",
      title: "Community Meetup: Tech Talks #4",
      tagline: "Sharing session proyek-proyek teknologi mahasiswa",
      description:
        "Tech Talks adalah ajang sharing session rutin antar komunitas untuk memamerkan dan mendiskusikan proyek-proyek teknologi yang sedang dikerjakan mahasiswa.",
      location: "Ruang Diskusi FIF",
      category: "Community Meetup",
      status: "Open",
      organizer: "Sant.Ai Community",
      startAt: new Date("2026-09-17T08:00:00.000Z"),
      endAt: new Date("2026-09-17T10:30:00.000Z"),
      maxParticipants: 50,
      contact: "Sant.Ai Community — community@santai.dev",
      agenda: [
        { time: "15:00 - 15:15", activity: "Pembukaan" },
        { time: "15:15 - 16:15", activity: "Sharing Session: 3 Proyek Mahasiswa" },
        { time: "16:15 - 17:00", activity: "Diskusi & Networking" },
      ],
      speakers: [],
      requirements: [],
      benefits: ["Networking", "Feedback untuk proyekmu"],
    },
    {
      slug: "guest-lecture-cybersecurity-trends",
      title: "Guest Lecture: Cybersecurity Trends",
      tagline: "Kuliah tamu dari praktisi keamanan siber nasional",
      description:
        "Kuliah tamu dari praktisi keamanan siber nasional tentang tren ancaman siber terkini dan karier di bidang keamanan informasi.",
      location: "Aula Lt. 3",
      category: "Guest Lecture",
      status: "Closed",
      organizer: "Cyber Security Circle",
      startAt: new Date("2026-08-10T02:00:00.000Z"),
      endAt: new Date("2026-08-10T04:00:00.000Z"),
      maxParticipants: 120,
      contact: "Cyber Security Circle — cyber@usm.ac.id",
      agenda: [{ time: "09:00 - 11:00", activity: "Guest Lecture & Diskusi" }],
      speakers: [{ name: "Ir. Hendra Gunawan", role: "Security Consultant", topic: "Threat Landscape 2026" }],
      requirements: [],
      benefits: ["Sertifikat", "Materi eksklusif"],
    },
    {
      slug: "workshop-flutter-mobile-development",
      title: "Workshop: Flutter Mobile Development",
      tagline: "Bangun aplikasi mobile cross-platform dengan Flutter",
      description:
        "Workshop praktis membangun aplikasi mobile cross-platform menggunakan Flutter, mulai dari setup hingga publish.",
      location: "Lab Komputer Lt. 2",
      category: "Workshop",
      status: "Closed",
      organizer: "Mobile Dev Community",
      startAt: new Date("2026-07-22T06:00:00.000Z"),
      endAt: new Date("2026-07-22T09:00:00.000Z"),
      maxParticipants: 50,
      contact: "Mobile Dev Community — mobile@usm.ac.id",
      agenda: [
        { time: "13:00 - 14:00", activity: "Pengenalan Flutter" },
        { time: "14:00 - 16:00", activity: "Hands-on: Widget & State" },
      ],
      speakers: [{ name: "Rian Saputra", role: "Flutter Developer", topic: "Dart & Flutter Basics" }],
      requirements: ["Dasar pemrograman Dart"],
      benefits: ["Sertifikat", "Repositori contoh kode"],
    },
  ];

  for (const e of events) {
    const { agenda, speakers, requirements, benefits, ...rest } = e;
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {
        ...rest,
        agenda: JSON.stringify(agenda),
        speakers: JSON.stringify(speakers),
        requirements: JSON.stringify(requirements),
        benefits: JSON.stringify(benefits),
      },
      create: {
        ...rest,
        agenda: JSON.stringify(agenda),
        speakers: JSON.stringify(speakers),
        requirements: JSON.stringify(requirements),
        benefits: JSON.stringify(benefits),
      },
    });
    console.log(`  Event: ${e.title}`);
  }

  console.log(`\nDone: ${sources.length} sources, ${keywords.length} keywords, ${communities.length} communities, ${events.length} events`);
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
