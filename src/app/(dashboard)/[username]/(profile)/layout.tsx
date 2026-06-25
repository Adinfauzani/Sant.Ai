import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileTabs from "@/components/profile/profile-tabs";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";

interface Props {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
}

export default async function ProfileLayout({ params, children }: Props) {
  const { username } = await params;
  if (isReservedUsername(username)) notFound();

  const [user, session] = await Promise.all([
    prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        coverImage: true,
        reputationPoints: true,
        level: true,
        createdAt: true,
        studyProgram: true,
        semester: true,
      },
    }),
    getAuthSession(await headers()),
  ]);

  if (!user) notFound();

  const isOwner = session?.user?.id === user.id;

  return (
    <>
      <ProfileHeader user={user} isOwner={isOwner} />
      <ProfileTabs username={username} />
      <div className="mt-6">{children}</div>
    </>
  );
}
