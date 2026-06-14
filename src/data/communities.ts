export interface CommunityDetail {
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  memberCount: number;
  discussions: number;
  projectsCount: number;
  category: string;
  color: string;
  cover: string;
  lead: { name: string; program: string; avatar: string };
  rules: string[];
  topics: string[];
  members: { name: string; program: string; avatar: string; role: string }[];
  recentDiscussions: { title: string; author: string; replies: number; time: string }[];
}

export const communities: CommunityDetail[] = [
  {
    slug: "ai-research-club",
    name: "AI Research Club",
    description: "Explore artificial intelligence, machine learning, and deep learning through collaborative research projects.",
    fullDescription:
      "AI Research Club adalah komunitas mahasiswa yang fokus pada pengembangan dan riset di bidang Artificial Intelligence. Mulai dari machine learning, deep learning, computer vision, hingga natural language processing. Kami mengadakan workshop rutin, study group, dan proyek riset kolaboratif setiap semester.",
    memberCount: 42,
    discussions: 128,
    projectsCount: 8,
    category: "AI & Machine Learning",
    color: "from-blue-600 to-cyan-500",
    cover: "from-blue-600/30 to-cyan-400/10",
    lead: { name: "Aulia Rahman", program: "TI", avatar: "AR" },
    rules: [
      "Wajib aktif dalam minimal 1 proyek per semester",
      "Menjaga suasana akademik yang kondusif",
      "Sharing pengetahuan dan sumber daya",
      "Menghargai perbedaan latar belakang prodi",
    ],
    topics: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Reinforcement Learning"],
    members: [
      { name: "Aulia Rahman", program: "TI", avatar: "AR", role: "Lead" },
      { name: "Bunga Citra", program: "SD", avatar: "BC", role: "Co-Lead" },
      { name: "Dimas Ardiansyah", program: "SI", avatar: "DA", role: "Member" },
      { name: "Eka Putri", program: "TI", avatar: "EP", role: "Member" },
    ],
    recentDiscussions: [
      { title: "Rekomendasi dataset untuk proyek Computer Vision", author: "Dimas Ardiansyah", replies: 12, time: "3 hours ago" },
      { title: "Diskusi: Paper Week — Transformer Architecture", author: "Aulia Rahman", replies: 8, time: "1 day ago" },
      { title: "Open project: Sentiment Analysis for Campus", author: "Bunga Citra", replies: 15, time: "2 days ago" },
    ],
  },
  {
    slug: "web-development-society",
    name: "Web Development Society",
    description: "Build modern web applications with the latest frameworks and technologies.",
    fullDescription:
      "Web Development Society adalah komunitas bagi mahasiswa yang tertarik dengan pengembangan web. Dari frontend hingga backend, dari HTML/CSS hingga framework modern seperti React, Next.js, dan Laravel. Kami mengadakan coding session, hackathon internal, dan proyek kolaboratif.",
    memberCount: 56,
    discussions: 203,
    projectsCount: 12,
    category: "Web Development",
    color: "from-emerald-600 to-teal-500",
    cover: "from-emerald-600/30 to-teal-400/10",
    lead: { name: "Dimas Ardiansyah", program: "SI", avatar: "DA" },
    rules: [
      "Mengikuti standar kode yang disepakati",
      "Code review sebelum merge",
      "Dokumentasi wajib untuk setiap proyek",
      "Partisipasi dalam minimal 1 proyek",
    ],
    topics: ["React", "Next.js", "Vue.js", "Laravel", "Node.js", "Tailwind CSS"],
    members: [
      { name: "Dimas Ardiansyah", program: "SI", avatar: "DA", role: "Lead" },
      { name: "Fajar Nugroho", program: "TI", avatar: "FN", role: "Co-Lead" },
      { name: "Sari Dewi", program: "SI", avatar: "SD", role: "Member" },
    ],
    recentDiscussions: [
      { title: "Best practices Next.js App Router 2026", author: "Dimas Ardiansyah", replies: 18, time: "5 hours ago" },
      { title: "Project proposal: Sistem Informasi Alumni", author: "Fajar Nugroho", replies: 7, time: "1 day ago" },
      { title: "Tips optimalisasi performa React", author: "Sari Dewi", replies: 11, time: "3 days ago" },
    ],
  },
  {
    slug: "data-science-lab",
    name: "Data Science Lab",
    description: "Hands-on data analysis, visualization, and machine learning projects using real-world datasets.",
    fullDescription:
      "Data Science Lab adalah komunitas untuk mahasiswa yang tertarik dengan data science. Kami mengerjakan proyek analisis data menggunakan dataset nyata, belajar visualisasi data, statistical modeling, dan machine learning. Cocok untuk mahasiswa SD dan siapa pun yang tertarik dengan data.",
    memberCount: 38,
    discussions: 95,
    projectsCount: 6,
    category: "Data Science",
    color: "from-purple-600 to-violet-500",
    cover: "from-purple-600/30 to-violet-400/10",
    lead: { name: "Bunga Citra", program: "SD", avatar: "BC" },
    rules: [
      "Membawa dataset sendiri untuk setiap sesi",
      "Mempresentasikan hasil analisis secara bergiliran",
      "Mencantumkan sumber data yang digunakan",
      "Bersedia membantu anggota lain",
    ],
    topics: ["Python", "Pandas", "Data Visualization", "Statistical Analysis", "Big Data"],
    members: [
      { name: "Bunga Citra", program: "SD", avatar: "BC", role: "Lead" },
      { name: "Aulia Rahman", program: "TI", avatar: "AR", role: "Member" },
    ],
    recentDiscussions: [
      { title: "Dataset: Analisis Tren Akademik 5 Tahun", author: "Bunga Citra", replies: 9, time: "1 day ago" },
      { title: "Tutorial: EDA dengan Python", author: "Aulia Rahman", replies: 6, time: "4 days ago" },
    ],
  },
];
