"use client";

import { useTransition } from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import { togglePinProject } from "@/lib/projects/actions";
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

export default function ProfileProjectCard({ project, isPinned, isOwner }: Props) {
  const [pending, startTransition] = useTransition();

  function handlePin() {
    startTransition(async () => {
      try {
        await togglePinProject(project.id);
        toast.success(isPinned ? "Sematan proyek dilepas" : "Proyek disematkan");
      } catch (e: any) {
        toast.error(e.message || "Gagal memperbarui sematan");
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
          title={isPinned ? "Lepas sematan" : "Sematkan ke profil"}
        >
          {pending ? (
            <TwinOrbit className="size-3.5 text-primary" />
          ) : (
            <Pin
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isPinned ? "fill-primary text-primary" : "text-muted",
              )}
            />
          )}
        </button>
      )}
    </div>
  );
}
