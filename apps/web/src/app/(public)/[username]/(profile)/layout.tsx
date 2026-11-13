import { notFound } from "next/navigation";
import ProfileHeader from "@/components/profile/profileHeader";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";
import { ProfileHeaderClient } from "./_profileHeaderClient";

interface Props {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
}

export default async function ProfileLayout({ params, children }: Props) {
  const { username } = await params;
  if (isReservedUsername(username)) notFound();

  const user = await prisma.user.findFirst({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      role: true,
      bio: true,
      university: true,
      faculty: true,
      studyProgram: true,
      semester: true,
      location: true,
      website: true,
      socialLinks: true,
      level: true,
      reputationPoints: true,
      coverImage: true,
      createdAt: true,
      _count: {
        select: {
          ownedProjects: true,
          ideas: true,
          contributions: true,
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center border-b px-6">
        <ProfileHeaderClient username={username} />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ProfileHeader user={{ coverImage: user.coverImage }} />
        {children}
      </div>
    </div>
  );
}
