export interface ShowcaseDetail {
  slug: string;
  title: string;
  description: string;
  problemStatement: string;
  solution: string;
  impactSummary: string;
  technologies: string[];
  teamMembers: { name: string; program: string; role: string }[];
  programs: string[];
  status: string;
  views: number;
  likes: number;
  impact: number;
  githubUrl?: string;
  demoUrl?: string;
  cover: string;
  color: string;
  screenshots: string[];
}

export const showcaseProjects: ShowcaseDetail[] = [
  {
    slug: "smart-campus-parking-system",
    title: "Smart Campus Parking System",
    description: "IoT-based parking management system using computer vision and real-time sensor data.",
    problemStatement: "Kampus mengalami masalah parkir yang tidak teratur, mahasiswa kesulitan menemukan slot parkir kosong, dan sering terjadi antrean panjang di jam sibuk. Sistem parkir masih manual tanpa monitoring real-time.",
    solution: "Mengembangkan sistem parkir pintar menggunakan sensor ultrasonik dan kamera computer vision untuk mendeteksi ketersediaan slot parkir secara real-time. Data ditampilkan melalui aplikasi web dan mobile.",
    impactSummary: "Mengurangi waktu pencarian parkir hingga 60%. Implementasi di 3 titik parkir kampus dengan 200+ slot terpantau real-time.",
    technologies: ["IoT", "Computer Vision", "React", "Python", "TensorFlow", "ESP32", "MQTT"],
    teamMembers: [
      { name: "Dimas Ardiansyah", program: "TI", role: "Project Lead & Backend" },
      { name: "Bunga Citra", program: "SD", role: "Data Analyst" },
      { name: "Eka Putri", program: "TI", role: "Frontend Developer" },
      { name: "Fajar Nugroho", program: "TI", role: "IoT Engineer" },
    ],
    programs: ["TI", "SD"],
    status: "Completed",
    views: 1240,
    likes: 89,
    impact: 320,
    githubUrl: "https://github.com/sant-ai/smart-parking",
    demoUrl: "https://smartparking.sant-ai.id",
    cover: "from-blue-600/30 to-cyan-400/10",
    color: "from-blue-600 to-cyan-500",
    screenshots: ["/showcase/smart-parking-1", "/showcase/smart-parking-2"],
  },
  {
    slug: "analisis-sentimen-media-sosial",
    title: "Analisis Sentimen Media Sosial",
    description: "Machine learning model untuk menganalisis sentimen publik terhadap layanan kampus.",
    problemStatement: "Manajemen kampus kesulitan mengukur kepuasan mahasiswa terhadap layanan akademik karena feedback tersebar di berbagai platform media sosial.",
    solution: "Membangun model NLP yang secara otomatis mengklasifikasikan sentimen positif, negatif, dan netral dari data Twitter dan Instagram tentang layanan kampus.",
    impactSummary: "Akurasi model mencapai 87%. Membantu manajemen kampus mengidentifikasi 15 area perbaikan layanan prioritas.",
    technologies: ["Machine Learning", "NLP", "Python", "TensorFlow", "Flask", "PostgreSQL"],
    teamMembers: [
      { name: "Bunga Citra", program: "SD", role: "Project Lead & ML Engineer" },
      { name: "Aulia Rahman", program: "TI", role: "Data Engineer" },
      { name: "Sari Dewi", program: "SI", role: "Business Analyst" },
    ],
    programs: ["SD", "SI"],
    status: "Completed",
    views: 980,
    likes: 72,
    impact: 280,
    githubUrl: "https://github.com/sant-ai/sentiment-analysis",
    cover: "from-purple-600/30 to-violet-400/10",
    color: "from-purple-600 to-violet-500",
    screenshots: ["/showcase/sentiment-1"],
  },
  {
    slug: "e-learning-platform-ai-tutor",
    title: "E-Learning Platform with AI Tutor",
    description: "Adaptive learning platform with AI-powered tutor and personalized study paths.",
    problemStatement: "Pembelajaran online masih bersifat satu arah dan tidak adaptif. Mahasiswa dengan kemampuan berbeda mendapat materi yang sama, menyebabkan kesenjangan pemahaman.",
    solution: "Platform e-learning yang menggunakan AI untuk menganalisis gaya belajar mahasiswa dan merekomendasikan materi, soal, dan jalur belajar yang dipersonalisasi secara real-time.",
    impactSummary: "Digunakan oleh 350+ mahasiswa. Peningkatan rata-rata nilai ujian sebesar 22%. Tingkat retensi mahasiswa meningkat 35%.",
    technologies: ["AI", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Docker"],
    teamMembers: [
      { name: "Aulia Rahman", program: "TI", role: "Project Lead & Fullstack" },
      { name: "Dimas Ardiansyah", program: "SI", role: "Backend Developer" },
      { name: "Bunga Citra", program: "SD", role: "ML Engineer" },
      { name: "Eka Putri", program: "TI", role: "Frontend Developer" },
      { name: "Fajar Nugroho", program: "SI", role: "UI/UX Designer" },
    ],
    programs: ["TI", "SD", "SI"],
    status: "Active",
    views: 1560,
    likes: 112,
    impact: 450,
    demoUrl: "https://elearning.sant-ai.id",
    cover: "from-emerald-600/30 to-teal-400/10",
    color: "from-emerald-600 to-teal-500",
    screenshots: ["/showcase/elearning-1", "/showcase/elearning-2"],
  },
];
