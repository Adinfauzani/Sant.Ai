"use client";

import { Users, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  memberCount: number;
  logo?: string;
  role: string;
}

interface Props {
  communities: Community[];
}

export default function CommunityCard({ communities }: Props) {
  if (communities.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted">Communities</h3>
      <div className="space-y-2">
        {communities.map((community) => (
          <Link
            key={community.id}
            href={`/communities/${community.slug}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface/30 p-3 transition-all hover:border-primary/20 hover:bg-primary-soft"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-heading text-sm font-bold">
              {community.logo || community.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text truncate">{community.name}</p>
              <div className="flex items-center gap-2 text-[10px] text-muted">
                <Users className="h-2.5 w-2.5" />
                <span>{community.memberCount} members</span>
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">{community.role}</span>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
