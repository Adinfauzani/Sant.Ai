import Link from "next/link";
import { GitBranch, ExternalLink } from "lucide-react";

interface Props {
  id: string;
  title: string;
  description: string;
  status: string;
  techStack: string;
  demoLink?: string;
  githubUrl?: string;
}

export default function ProjectCard({ id, title, description, status, techStack, demoLink, githubUrl }: Props) {
  return (
    <Link href={`/projects/${id}`} className="block rounded-lg border border-border bg-surface/5 p-4 hover:bg-surface/10">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-text">{title}</h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted">{description}</p>
        </div>
        <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">{status}</span>
      </div>
      {techStack && (
        <div className="mt-3 flex flex-wrap gap-1">
          {techStack.split(",").map((t) => (
            <span key={t.trim()} className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted">{t.trim()}</span>
          ))}
        </div>
      )}
      {(demoLink || githubUrl) && (
        <div className="mt-3 flex gap-3">
          {demoLink && (
            <span className="flex items-center gap-1 text-[10px] text-muted hover:text-primary">
              <ExternalLink className="h-3 w-3" /> Demo
            </span>
          )}
          {githubUrl && (
            <span className="flex items-center gap-1 text-[10px] text-muted hover:text-primary">
              <GitBranch className="h-3 w-3" /> Source
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
