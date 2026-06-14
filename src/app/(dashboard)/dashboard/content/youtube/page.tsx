"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Play, Film } from "lucide-react";
import { Card } from "../../_components";
import { fetchYouTube, type YouTubeItem } from "@/lib/data";
import { YouTubeEmbed } from "@/components/shared/youtube-embed";
import { usePolling } from "@/lib/use-polling";

function fmtDate(d: string) {
  return d ? new Date(d).toLocaleDateString("id-ID") : "";
}

export default function YoutubePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<{ videoId: string; title: string } | null>(null);
  const perPage = 10;

  const load = useCallback(() => {
    fetchYouTube({ limit: 100 }).then((res) => {
      setVideos(res.items);
      setTotal(res.total);
    });
  }, []);

  usePolling(load, 60000);
  useEffect(load, [load]);

  const filtered = videos.filter(
    (v) => !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.channelName.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">YouTube</h1>
        <p className="mt-0.5 text-xs text-muted">Manage and explore all videos ({total} total)</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface/30 px-3 py-1.5 min-w-[200px]">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search videos..."
            className="flex-1 bg-transparent text-xs text-text outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Channel</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Views</th>
                <th className="pb-2 font-medium">Published</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">No videos found.</td>
                </tr>
              ) : paged.map((v) => (
                <tr key={v.id} className="border-b border-border/50 transition-colors hover:bg-surface/20">
                  <td className="py-2.5 pr-3">
                    <button onClick={() => setPlayingVideo({ videoId: v.videoId, title: v.title })}
                      className="flex items-center gap-2 text-left transition-colors hover:text-primary">
                      <Play className="h-3 w-3 flex-shrink-0 text-red-500" />
                      <span className="line-clamp-1 text-xs font-medium text-text">{v.title}</span>
                    </button>
                  </td>
                  <td className="py-2.5 pr-3 text-muted">{v.channelName}</td>
                  <td className="py-2.5 pr-3">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">{v.category}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-muted">{v.views.toLocaleString()}</td>
                  <td className="py-2.5 text-muted">{fmtDate(v.publishedAt)}</td>
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

      {playingVideo && (
        <YouTubeEmbed videoId={playingVideo.videoId} title={playingVideo.title} onClose={() => setPlayingVideo(null)} />
      )}
    </div>
  );
}
