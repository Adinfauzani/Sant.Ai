"use client";

import { useTransition } from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { togglePinProject } from "@/lib/actions";
import ProjectCard from "@/components/profile/projectCard";
import { toast } from "sonner";

interface Props {
  project: {
    id: string;
    title: string;
    description: string;
    status: string;
    techStack: string;
    demoLink?: string;
  };
  isPinned: boolean;
  isOwner: boolean;
}

export default function PinnedCard({ project, isPinned, isOwner }: Props) {
  const [pending, startTransition] = useTransition();

  function handlePin() {
    startTransition(async () => {
      try {
        await togglePinProject(project.id);
        toast.success(isPinned ? "Unpinned project" : "Pinned project");
      } catch (e: any) {
        toast.error(e.message || "Failed to update pin");
      }
    });
  }

  return (
    <div className="group relative">
      <ProjectCard {...project} />
      {isOwner && (
        <button
          type="button"
          onClick={handlePin}
          disabled={pending}
          className={cn(
            "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded opacity-0 transition-all group-hover:opacity-100 hover:bg-surface",
            isPinned && "opacity-100",
          )}
          title={isPinned ? "Unpin project" : "Pin to profile"}
        >
          <Pin
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              isPinned ? "fill-primary text-primary" : "text-muted",
              pending && "animate-pulse",
            )}
          />
        </button>
      )}
    </div>
  );
}
