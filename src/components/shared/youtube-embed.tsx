"use client";

import { X } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  onClose?: () => void;
}

export function YouTubeEmbed({ videoId, title, onClose }: YouTubeEmbedProps) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black">
        <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="aspect-video w-full">
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
