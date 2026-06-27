"use client";

import { Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";

interface Props {
  user: {
    name: string;
    username: string | null;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    coverImage: string;
    reputationPoints: number;
    level: string;
    createdAt: Date;
    studyProgram: string;
    semester: number;
  };
  isOwner: boolean;
}

export default function ProfileHeader({ user, isOwner }: Props) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-primary/5 to-surface/30">
      {/* Cover image */}
      {user.coverImage && (
        <div className="h-32 w-full overflow-hidden md:h-40">
          <img src={user.coverImage} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-heading text-lg font-bold text-text">{user.name}</h1>
            <p className="text-xs text-muted">@{user.username}</p>
          </div>
        </div>

        {isOwner && (
          <Link href={`/${user.username}/settings`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
