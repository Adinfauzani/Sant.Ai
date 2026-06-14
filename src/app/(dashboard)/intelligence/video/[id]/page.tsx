"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Eye, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import { fetchArticles, type ArticleItem } from "@/lib/data";
import { cn } from "@/lib/utils";

interface VideoDetail {
  id: string; videoId: string; title: string; description: string;
  channelName: string; thumbnail: string; views: number;
  category: string; language: string; country: string; publishedAt: string;
}

export default function VideoPage() {
  const params = useParams();
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [related, setRelated] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/data/youtube/${params.id}`)
      .then((r) => r.json())
      .then((v: VideoDetail) => {
        setVideo(v);
        return v.category;
      })
      .then((cat) => fetchArticles({ category: cat, limit: 6 }))
      .then((res) => setRelated(res.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="section-padding container-main py-16 text-center">
      <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-primary/20" />
      <p className="mt-4 text-sm text-muted">Loading video...</p>
    </div>
  );

  if (!video) return (
    <div className="section-padding container-main py-16 text-center">
      <p className="text-sm text-muted">Video not found</p>
      <Link href="/intelligence" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">
        <ArrowLeft className="h-3 w-3" /> Back to Intelligence
      </Link>
    </div>
  );

  return (
    <div className="section-padding container-main py-10">
      <Link href="/intelligence" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Intelligence
      </Link>

      <div className="mx-auto max-w-5xl">
        {/* Video Player */}
        <div className="overflow-hidden rounded-2xl bg-black">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-6">
          <h1 className="font-heading text-xl font-bold text-text md:text-2xl">{video.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> {video.channelName}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {video.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(video.publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[9px] font-medium",
              "bg-primary/10 text-primary"
            )}>
              {video.category}
            </span>
          </div>
          {video.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{video.description}</p>
          )}
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-heading text-lg font-bold text-text">
              Related Articles — <span className="text-primary">{video.category}</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((art) => (
                <a key={art.id} href={art.url} target="_blank" rel="noopener noreferrer"
                  className="group rounded-2xl border border-border bg-gradient-to-br from-surface/30 to-surface/10 p-4 transition-all hover:border-primary/30 hover:bg-surface/30">
                  {art.image && (
                    <img src={art.image} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" />
                  )}
                  <p className="line-clamp-2 text-xs font-medium text-text group-hover:text-primary">{art.title}</p>
                  <p className="mt-1 line-clamp-2 text-[10px] text-muted">{art.description?.replace(/<[^>]*>/g, "")}</p>
                  <div className="mt-2 flex items-center gap-2 text-[9px]">
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary">{art.category}</span>
                    <span className="text-muted">{new Date(art.publishedAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
