import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { isReservedUsername } from "@/lib/reserved";
import LinkedAccountsSection from "./_linked-accounts";
import AppearanceSection from "./_appearance";
import EditProfileForm from "./_edit-profile";
import { User, Shield, Bell } from "lucide-react";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function SettingsPage({ params }: Props) {
  const { username } = await params;
  if (isReservedUsername(username) && username !== "settings") notFound();

  const session = await getAuthSession(await headers());
  if (!session?.user) redirect("/login");
  if (session.user.username !== username) redirect(`/${session.user.username}/settings`);

  const [bAccounts, user] = await Promise.all([
    prisma.$queryRaw<Array<{ providerId: string }>>`
      SELECT DISTINCT "providerId" FROM "auth"."account" WHERE "userId" = ${session.user.id}
    `,
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        studyProgram: true,
        semester: true,
      },
    }),
  ]);

  if (!user) notFound();

  const linkedProviders = bAccounts.map((a) => a.providerId);
  const hasPassword = false;
  const allMethods: string[] = [
    ...linkedProviders,
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-text md:text-2xl">Settings</h1>

      {/* Edit Profile */}
      <section className="rounded-lg border border-border bg-surface/5 p-4">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-semibold text-text">Profile</h2>
        </div>
        <EditProfileForm user={user} />
      </section>

      {/* Linked Accounts */}
      <LinkedAccountsSection
        linkedProviders={linkedProviders}
        hasPassword={hasPassword}
        allMethods={allMethods}
        username={session.user.username}
      />

      {/* Security */}
      <section className="rounded-lg border border-border bg-surface/5 p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-semibold text-text">Security</h2>
        </div>
        <p className="mt-1 text-[11px] text-muted">
          Two-factor authentication coming soon.
        </p>
      </section>

      {/* Appearance */}
      <AppearanceSection />

      {/* Notifications */}
      <section className="rounded-lg border border-border bg-surface/5 p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-semibold text-text">Notifications</h2>
        </div>
        <p className="mt-1 text-[11px] text-muted">
          Notification preferences coming soon.
        </p>
      </section>
    </div>
  );
}
