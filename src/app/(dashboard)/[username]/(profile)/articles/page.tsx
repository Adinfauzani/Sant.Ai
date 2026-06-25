import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfileArticlesPage({ params }: Props) {
  const { username } = await params;
  if (isReservedUsername(username)) notFound();

  const user = await prisma.user.findFirst({
    where: { username },
    select: { id: true },
  });

  if (!user) notFound();

  // Articles are fetched from external sources (RSS/GNews), not user-authored.
  // This tab is a placeholder for future user-published articles.

  return (
    <div className="rounded-lg border border-border bg-surface/5 p-10 text-center">
      <FileText className="mx-auto h-6 w-6 text-muted" />
      <p className="mt-2 text-sm text-muted">
        No articles yet. User-published articles will appear here.
      </p>
    </div>
  );
}
