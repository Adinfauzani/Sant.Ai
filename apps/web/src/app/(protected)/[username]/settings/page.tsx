import { getAuthSession, auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { isReservedUsername } from "@/lib/reserved";
import SettingsClient from "./_settingsClient";

interface Props {
  params: Promise<{ username: string }>;
}

interface AccountInfo {
  id: string;
  providerId: string;
  accountId: string;
}

export default async function SettingsPage({ params }: Props) {
  const { username } = await params;
  if (isReservedUsername(username) && username !== "settings") notFound();

  const session = await getAuthSession(await headers());
  if (!session?.user) redirect("/login");
  if (session.user.username !== username) redirect(`/${session.user.username}/settings`);

  const headersObj = await headers();
  const [accounts, user] = await Promise.all([
    auth.api.listUserAccounts({ headers: headersObj }) as Promise<AccountInfo[]>,
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        studyProgram: true,
        semester: true,
        readme: true,
        readmeType: true,
        phone: true,
        university: true,
        faculty: true,
        degreeLevel: true,
        studentId: true,
        enrollmentYear: true,
        interests: true,
        skills: true,
        aiPreferences: true,
        researchProfile: true,
        socialLinks: true,
        privacySettings: true,
      },
    }),
  ]);

  const linkedProviders = accounts.map((a) => a.providerId);
  const providerAccounts = accounts.filter((a) => a.providerId !== "credential");
  const hasPassword = linkedProviders.includes("credential");
  const allMethods = [...linkedProviders];

  if (!user) notFound();

  return (
    <div>
      <h1 className="mb-8 text-xl font-bold text-text md:text-2xl">Pengaturan</h1>
      <SettingsClient
        emailVerified={session.user.emailVerified}
        email={session.user.email}
        linkedProviders={linkedProviders}
        providerAccounts={providerAccounts}
        hasPassword={hasPassword}
        allMethods={allMethods}
        username={session.user.username}
        user={user}
        twoFactorEnabled={(session.user as any).twoFactorEnabled ?? false}
      />
    </div>
  );
}
