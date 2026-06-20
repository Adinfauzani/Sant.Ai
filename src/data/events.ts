export interface EventDetail {
  slug: string;
  title: string;
  tagline: string;
  date: string;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  status: "Open" | "Limited Seats" | "Closed";
  organizer: string;
  cover: string;
  color: string;
  description: string;
  agenda: { time: string; activity: string; speaker?: string }[];
  speakers: { name: string; role: string; topic: string }[];
  requirements: string[];
  benefits: string[];
  contact: string;
}

export const events: EventDetail[] = [
  {
    slug: "hackathon-sains-tech-2026",
    title: "Hackathon Sains & Tech 2026",
    tagline: "Build innovative solutions for campus sustainability",
    date: "July 15-17, 2026",
    time: "09:00 - 17:00 WIB",
    location: "Gedung Serbaguna Kampus A",
    category: "Hackathon",
    participants: 56,
    maxParticipants: 100,
    status: "Open",
    organizer: "BEM Fakultas Ilmu Komputer",
    cover: "from-blue-600/30 to-cyan-400/10",
    color: "from-blue-600 to-cyan-500",
    description:
      "Hackathon Sains & Tech 2026 adalah kompetisi programming 3 hari dimana peserta akan membangun solusi inovatif untuk tantangan keberlanjutan kampus. Mulai dari manajemen energi, pengelolaan sampah, transportasi kampus, hingga sistem informasi akademik.",
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
    contact: "BEM Fasilkom — bem.fasilkom@usm.ac.id",
  },
  {
    slug: "workshop-intro-machine-learning",
    title: "Workshop: Intro to Machine Learning",
    tagline: "Learn ML fundamentals with Python and scikit-learn",
    date: "June 28, 2026",
    time: "13:00 - 16:00 WIB",
    location: "Lab Komputer Lantai 3",
    category: "Workshop",
    participants: 32,
    maxParticipants: 40,
    status: "Open",
    organizer: "AI Research Club",
    cover: "from-purple-600/30 to-violet-400/10",
    color: "from-purple-600 to-violet-500",
    description:
      "Workshop ini dirancang untuk memperkenalkan konsep dasar Machine Learning menggunakan Python dan scikit-learn. Peserta akan belajar dari teori hingga praktik langsung membangun model ML sederhana.",
    agenda: [
      { time: "13:00 - 13:30", activity: "Pengantar Machine Learning", speaker: "Aulia Rahman" },
      { time: "13:30 - 14:30", activity: "Hands-on: Data Preparation & Visualization" },
      { time: "14:30 - 15:30", activity: "Hands-on: Building Classification Model" },
      { time: "15:30 - 16:00", activity: "Q&A dan Diskusi" },
    ],
    speakers: [
      { name: "Aulia Rahman", role: "AI Research Club Lead", topic: "ML Fundamentals" },
    ],
    requirements: ["Dasar Python", "Laptop dengan Python dan Jupyter Notebook terinstall"],
    benefits: ["Modul workshop", "Sertifikat", "Akses repositori kode"],
    contact: "AI Research Club — ai.club@usm.ac.id",
  },
  {
    slug: "seminar-karir-di-era-ai",
    title: "Seminar: Karir di Era AI",
    tagline: "Insight dari praktisi industri tentang masa depan teknologi",
    date: "July 5, 2026",
    time: "09:00 - 12:00 WIB",
    location: "Auditorium Utama",
    category: "Seminar",
    participants: 120,
    maxParticipants: 200,
    status: "Limited Seats",
    organizer: "Himpunan Mahasiswa TI",
    cover: "from-emerald-600/30 to-teal-400/10",
    color: "from-emerald-600 to-teal-500",
    description:
      "Seminar ini menghadirkan praktisi industri untuk berbagi wawasan tentang perkembangan karir di era Artificial Intelligence. Cocok untuk mahasiswa yang ingin mempersiapkan diri memasuki dunia kerja.",
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
    contact: "HMTI — hmti@usm.ac.id",
  },
];
