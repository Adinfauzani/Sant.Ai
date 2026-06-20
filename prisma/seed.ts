import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

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

  console.log(`\nDone: ${sources.length} sources, ${keywords.length} keywords`);
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
