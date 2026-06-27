import Link from "next/link";
import { ExternalLink, Pin } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  techStack: string;
  demoLink?: string;
}

interface Props {
  projects: Project[];
}

export default function PinnedProjects({ projects }: Props) {

  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5">
        <Pin className="h-3.5 w-3.5 text-muted" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Pinned</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="block rounded-lg border border-border bg-surface/5 p-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-text">{p.title}</h4>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{p.description}</p>
              </div>
              <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">{p.status}</span>
            </div>
            {p.techStack && (
              <div className="mt-3 flex flex-wrap gap-1">
                {p.techStack.split(",").map((t) => (
                  <span key={t.trim()} className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted">{t.trim()}</span>
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-3">
              {p.demoLink && (
                <span className="flex items-center gap-1 text-[10px] text-muted hover:text-primary">
                  <ExternalLink className="h-3 w-3" /> Demo
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
