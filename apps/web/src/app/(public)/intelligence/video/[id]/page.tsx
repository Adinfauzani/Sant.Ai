"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";
import Link from "next/link";
import { fetchArticles, type ArticleItem } from "@/lib/data/data";
import { cn } from "@/lib/utils";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";

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
    <>
      <Navbar />
      <div className="container-main flex flex-1 flex-col items-center justify-center py-24 text-center">
        <TwinOrbit className="size-7 text-primary" />
        <p className="mt-4 text-sm text-muted">Lagi muat videonya…</p>
      </div>
      <Footer />
    </>
  );

  if (!video) return (
    <>
      <Navbar />
      <div className="container-main flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted">Videonya nggak ketemu.</p>
        <Link
          href="/intelligence"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-primary transition-colors hover:border-border-strong"
        >
          <ArrowLeft className="size-3.5" /> Kembali ke Data Intelligence
        </Link>
      </div>
      <Footer />
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-10">
          <Link
            href="/intelligence"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <ArrowLeft className="size-3.5" /> Kembali ke Data Intelligence
          </Link>

          <div className="mx-auto max-w-5xl">
            {/* Pemutar video */}
            <div className="overflow-hidden rounded-xl border border-border bg-black">
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`}
                  title={video.title}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Info video */}
            <div className="mt-6">
              <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                {video.category}
              </span>
              <h1 className="mt-3 font-heading text-xl font-bold text-text md:text-2xl">{video.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5" /> {video.channelName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="size-3.5" /> {video.views.toLocaleString()}x ditonton
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {new Date(video.publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              {video.description && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{video.description}</p>
              )}
            </div>

            {/* Artikel terkait */}
            {related.length > 0 && (
              <div className="mt-10">
                <p className="editorial-label">Artikel Terkait</p>
                <h2 className="mt-2 font-heading text-lg font-bold text-text">
                  Kategori <span className="text-primary">{video.category}</span>
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {related.map((art) => (
                    <a
                      key={art.id}
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group rounded-xl border border-border bg-card p-4 transition-colors duration-150",
                        "hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      {art.image && (
                        <img src={art.image} alt="" className="mb-3 h-32 w-full rounded-lg object-cover" />
                      )}
                      <p className="line-clamp-2 text-xs font-medium text-text group-hover:text-primary">{art.title}</p>
                      <p className="mt-1 line-clamp-2 text-[10px] text-muted">{art.description?.replace(/<[^>]*>/g, "")}</p>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[10px]">
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
      </main>
      <Footer />
    </div>
  );
}
