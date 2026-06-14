export const LITERASI_KEYWORDS = [
  "artificial intelligence", "ai", "machine learning", "deep learning",
  "digital literacy", "literasi digital", "media sosial", "social media",
  "hoaks", "hoax", "misinformation", "misinformasi",
  "digital education", "pendidikan digital", "generative ai", "ai generatif",
  "e-learning", "online learning", "belajar online", "edtech",
  "digital skill", "keterampilan digital", "digital native",
  "content creator", "digital marketing", "pemasaran digital",
];

export const KEAMANAN_KEYWORDS = [
  "cyber security", "keamanan siber", "keamanan digital",
  "malware", "ransomware", "phishing",
  "data breach", "kebocoran data", "hacking", "peretasan",
  "cyber crime", "cyber attack", "serangan siber",
  "encryption", "enkripsi", "firewall",
  "cyber bullying", "perundungan digital",
  "identity theft", "pencurian identitas",
  "social engineering", "ddos",
  "vpn", "antivirus", "password security", "password",
  "siber", "cyber", "peretas", "bocor data", "bocor",
  "pengamanan", "sandi", "otentikasi", "enkripsi",
  "keamanan data", "privasi", "privacy",
  "penipuan", "scam", "fraud",
  "brute force", "sql injection", "xss", "zero day",
  "security", "cybersecurity",
  "kebocoran", "kebobolan",
];

export const ISU_PUBLIK_KEYWORDS: Record<string, string[]> = {
  Pendidikan: [
    "pendidikan", "sekolah", "universitas", "mahasiswa", "dosen",
    "kurikulum", "merdeka belajar", "ppdb", "snmptn", "snbt",
    "beasiswa", "buku", "perpustakaan", "guru", "belajar",
    "ujian", "nilai", "kelulusan", "akreditasi",
  ],
  Teknologi: [
    "teknologi", "digital", "internet", "software", "hardware",
    "ai", "cloud", "blockchain", "iot", "big data",
    "startup", "aplikasi", "platform", "5g", "robot",
    "cyber", "data", "komputer", "programming", "coding",
  ],
  Ekonomi: [
    "ekonomi", "keuangan", "bank", "investasi", "saham",
    "umkm", "inflasi", "pajak", "neraca", "ekspor impor",
    "gaji", "upah", "bpjs", "asuransi", "kredit",
    "fintech", "cryptocurrency", "reksadana", "pasar modal",
  ],
  Kesehatan: [
    "kesehatan", "rumah sakit", "dokter", "obat", "vaksin",
    "bpjs", "covid", "stunting", "gizi", "mental health",
    "kesehatan mental", "imunisasi", "rumah sakit", "puskesmas",
    "penyakit", "pandemi", "rs", "apotek",
  ],
  Sosial: [
    "sosial", "masyarakat", "budaya", "kemiskinan", "kesenjangan",
    "hoaks", "media sosial", "komunitas", "organisasi",
    "kemanusiaan", "donasi", "relawan", "panti asuhan",
    "difabel", "inklusi", "toleransi", "keberagaman",
  ],
  Lingkungan: [
    "lingkungan", "polusi", "sampah", "hutan", "iklim",
    "green", "daur ulang", "energi terbarukan", "karbon",
    "bencana alam", "banjir", "gempa", "tsunami", "ekosistem",
    "reboisasi", "net zero", "emisi", "climate change",
  ],
  Politik: [
    "politik", "pemilu", "pilkada", "presiden", "parlemen",
    "partai", "demokrasi", "kebijakan", "undang-undang",
    "uu", "pemerintah", "kabinet", "menteri", "dpd", "dpr",
    "konstitusi", "otonomi daerah", "korupsi", "kpk",
  ],
};

const ALL_SUBCATEGORIES = Object.values(ISU_PUBLIK_KEYWORDS).flat();

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function countMatches(text: string, keywords: string[]): number {
  const lower = normalize(text);
  return keywords.filter((k) => lower.includes(normalize(k))).length;
}

export type DetectedCategory = {
  primary: string; // "Literasi Digital" | "Keamanan Digital" | "Isu Publik Indonesia"
  sub?: string;    // "Pendidikan", "Teknologi", etc.
};

export function classifyArticle(title: string, description: string): DetectedCategory {
  const text = `${title} ${description}`;

  const literacyScore = countMatches(text, LITERASI_KEYWORDS);
  const securityScore = countMatches(text, KEAMANAN_KEYWORDS);

  if (literacyScore > securityScore && literacyScore > 0) {
    return { primary: "Literasi Digital" };
  }

  if (securityScore > 0) {
    return { primary: "Keamanan Digital" };
  }

  if (literacyScore > 0) {
    return { primary: "Literasi Digital" };
  }

  // Check Isu Publik sub-categories
  let bestSub = "";
  let bestScore = 0;
  for (const [sub, keywords] of Object.entries(ISU_PUBLIK_KEYWORDS)) {
    const score = countMatches(text, keywords);
    if (score > bestScore) {
      bestScore = score;
      bestSub = sub;
    }
  }

  if (bestSub) {
    return { primary: "Isu Publik Indonesia", sub: bestSub };
  }

  return { primary: "Isu Publik Indonesia", sub: "Teknologi" };
}

export function detectSentiment(text: string): "positive" | "negative" | "neutral" {
  const lower = normalize(text);
  const positiveWords = ["baik", "bagus", "positif", "meningkat", "berhasil", "sukses", "maju", "sehat", "cerdas",
    "inovatif", "bermanfaat", "membantu", "memudahkan", "efektif", "efisien", "hebat", "luar biasa"];
  const negativeWords = ["buruk", "jelek", "negatif", "menurun", "gagal", "ancam", "krisis", "korupsi",
    "celaka", "rugi", "salah", "darurat", "bahaya", "ancaman", "serangan", "bencana", "pelanggaran"];

  const posScore = positiveWords.filter((w) => lower.includes(w)).length;
  const negScore = negativeWords.filter((w) => lower.includes(w)).length;

  if (posScore > negScore) return "positive";
  if (negScore > posScore) return "negative";
  return "neutral";
}
