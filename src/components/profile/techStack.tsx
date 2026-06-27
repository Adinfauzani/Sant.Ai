"use client";

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface Props {
  technologies: string[];
}

const TECH_LOGOS: Record<string, string> = {
  "Next.js": "N",
  React: "⚛",
  TypeScript: "TS",
  JavaScript: "JS",
  Go: "Go",
  Rust: "Rs",
  Python: "Py",
  Flutter: "Fl",
  Docker: "D",
  PostgreSQL: "PG",
  Prisma: "P",
  MySQL: "MY",
  MongoDB: "M",
  Redis: "R",
  GraphQL: "GQL",
  "Tailwind CSS": "TW",
  "Node.js": "NJ",
  "Cloudflare": "CF",
  Vercel: "V",
  "GitHub": "GH",
  Git: "Git",
};

export default function TechStack({ technologies }: Props) {
  if (technologies.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1.5">
        {technologies.map((tech) => {
          const logo = TECH_LOGOS[tech] || tech.slice(0, 2);
          return (
            <Tooltip key={tech}>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-medium text-muted transition-all hover:border-primary/30 hover:text-primary hover:bg-primary-soft cursor-default">
                  <span className="flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-primary">
                    {logo}
                  </span>
                  {tech}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{tech}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
