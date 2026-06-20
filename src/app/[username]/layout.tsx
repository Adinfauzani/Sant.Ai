import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileTabs from "@/components/profile/profile-tabs";
import EditProfileModal from "@/components/profile/edit-profile-modal";
import { auth } from "@/lib/auth";
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
    auth(),
  ]);

  if (!user) notFound();

  const isOwner = session?.user?.id === user.id;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          <ProfileHeader user={user} isOwner={isOwner} />
          {isOwner && <EditProfileModal user={user} />}
          <ProfileTabs username={username} />
          <div className="mt-6">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
