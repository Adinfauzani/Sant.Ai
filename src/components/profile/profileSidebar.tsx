"use client";

import { MapPin, Link2, Calendar, Users, UserPlus, Award, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import OrgBadge from "./orgBadge";
import ProfileReputation from "./profileReputation";
import TechStack from "./techStack";
import ProfileBadges from "./profileBadges";

interface Props {
  user: {
    name: string;
    username: string | null;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    reputationPoints: number;
    level: string;
    createdAt: Date;
    studyProgram: string;
    semester: number;
  };
  stats: {
    followers: number;
    following: number;
  };
  badges: { earned: boolean; label: string; desc: string; icon: React.ReactNode }[];
  techStack: string[];
  isOwner: boolean;
}

export default function ProfileSidebar({ user, stats, badges, techStack, isOwner }: Props) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <aside className="space-y-5">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <Avatar className="mb-4 size-24 md:size-56 lg:size-72 ring-1 ring-border shadow-sm">
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback className="text-lg font-heading">{initial}</AvatarFallback>
        </Avatar>
        <h1 className="font-heading text-xl font-bold tracking-tight text-text">{user.name}</h1>
        <p className="text-sm text-muted">@{user.username}</p>
        {user.bio && (
          <p className="mt-2 text-xs leading-relaxed text-muted">{user.bio}</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="flex justify-center gap-4 md:justify-start">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Users className="h-3.5 w-3.5" />
          <span><strong className="text-text">{stats.followers}</strong> followers</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <UserPlus className="h-3.5 w-3.5" />
          <span><strong className="text-text">{stats.following}</strong> following</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 md:justify-start">
        {user.location && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{user.location}</span>
          </div>
        )}
        {user.website && (
          <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-primary hover:underline">
            <Link2 className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-32">{user.website.replace(/^https?:\/\//, "")}</span>
          </a>
        )}
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        </div>
      </div>

      <Separator />

      {/* Org Badge */}
      <OrgBadge studyProgram={user.studyProgram} semester={user.semester} />

      <Separator />

      {/* Reputation */}
      <ProfileReputation points={user.reputationPoints} level={user.level} />

      {/* Badges */}
      {badges.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted">Achievements</h3>
            <ProfileBadges badges={badges} />
          </div>
        </>
      )}

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted">Tech Stack</h3>
            <TechStack technologies={techStack} />
          </div>
        </>
      )}
    </aside>
  );
}
