"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { togglePostLike } from "@/lib/communityActions";

export default function LikeButton({
  postId,
  initialLikes,
  initialLiked,
}: {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [pending, setPending] = useState(false);

  async function handle() {
    if (pending) return;
    setPending(true);
    try {
      const res = await togglePostLike(postId);
      if (res.ok) {
        setLiked(res.liked ?? !liked);
        setLikes((n) => n + (res.liked ? 1 : -1));
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={pending}
      className={`flex items-center gap-1 transition-colors hover:text-primary disabled:opacity-60 ${
        liked ? "text-primary" : ""
      }`}
    >
      <Heart className={`h-3 w-3 ${liked ? "fill-primary" : ""}`} />{likes}
    </button>
  );
}