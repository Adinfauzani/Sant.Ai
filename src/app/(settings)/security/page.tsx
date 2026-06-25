import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Shield, Github, Mail } from "lucide-react";
import LinkedAccounts from "./_linked-accounts";

export default async function AccountSecurityPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [accounts, user] = await Promise.all([
    prisma.account.findMany({
      where: { userId: session.user.id },
      select: { id: true, provider: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    }),
  ]);

  const linkedProviders = accounts.map((a) => a.provider);
  const hasPassword = !!(user?.password && user.password !== "");
  const allMethods = [...linkedProviders, ...(hasPassword ? ["credentials" as const] : [])];

  return (
    <div className="max-w-lg space-y-6">
      <div className="rounded-lg border border-border bg-surface/5 p-4">
        <LinkedAccounts
          linkedProviders={linkedProviders}
          hasPassword={hasPassword}
          allMethods={allMethods}
          username={session.user.username}
        />
      </div>

      <div className="rounded-lg border border-border bg-surface/5 p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted" />
          <h3 className="text-sm font-medium text-text">Two-Factor Authentication</h3>
        </div>
        <p className="mt-1 text-[11px] text-muted">Two-factor authentication coming soon.</p>
      </div>
    </div>
  );
}
