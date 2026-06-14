"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../../_components";

const allArticles = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  title: [
    "Transformasi Digital Pendidikan di Indonesia 2026",
    "Ancaman Keamanan Siber pada Sektor Perbankan",
    "Literasi Digital Masyarakat Pedesaan Meningkat",
    "Peran AI dalam Deteksi Dini Penyakit",
    "Fenomena Deepfake Mengancam Demokrasi",
    "Startup EdTech Raih Pendanaan Seri A",
    "Panduan Aman Menggunakan WiFi Publik",
    "Dampak Media Sosial pada Remaja",
    "Digitalisasi UMKM Dorong Pertumbuhan Ekonomi",
    "Revisi UU ITE dan Dampaknya pada Masyarakat",
    "Teknologi Blockchain untuk Transparansi Publik",
    "Smart City: Masa Depan Perkotaan Indonesia",
  ][i % 12],
  source: ["Kompas", "Detik", "Antara", "CNN Indonesia", "Tempo", "Tech in Asia", "SiberKu", "Tirto"][i % 8],
  category: ["Pendidikan", "Teknologi", "Sosial", "Kesehatan", "Politik", "Ekonomi", "Teknologi", "Sosial"][i % 8],
  date: ["2026-06-14", "2026-06-13", "2026-06-12", "2026-06-11", "2026-06-10", "2026-06-09", "2026-06-08", "2026-06-07"][i % 8],
  readTime: `${Math.floor(Math.random() * 8) + 2} min`,
}));

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = allArticles
    .filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "all" && a.category !== category) return false;
      return true;
    })
    .sort((a, b) => sort === "newest" ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Articles</h1>
        <p className="mt-0.5 text-xs text-muted">Manage and explore all articles ({allArticles.length} total)</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface/30 px-3 py-1.5 min-w-[200px]">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search articles..."
            className="flex-1 bg-transparent text-xs text-text outline-none placeholder:text-muted"
          />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-surface/30 px-2.5 py-1.5 text-[10px] text-muted outline-none">
          <option value="all">All Categories</option>
          <option value="Pendidikan">Pendidikan</option>
          <option value="Teknologi">Teknologi</option>
          <option value="Kesehatan">Kesehatan</option>
          <option value="Ekonomi">Ekonomi</option>
          <option value="Sosial">Sosial</option>
          <option value="Politik">Politik</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-border bg-surface/30 px-2.5 py-1.5 text-[10px] text-muted outline-none">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Read</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id} className="border-b border-border/50 transition-colors hover:bg-surface/20">
                  <td className="py-2.5 pr-3">
                    <p className="line-clamp-1 text-xs font-medium text-text">{a.title}</p>
                  </td>
                  <td className="py-2.5 pr-3 text-muted">{a.source}</td>
                  <td className="py-2.5 pr-3">
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] text-primary">{a.category}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-muted">{a.date}</td>
                  <td className="py-2.5 text-muted">
                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{a.readTime}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-surface disabled:opacity-30">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] text-muted">{page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-surface disabled:opacity-30">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
