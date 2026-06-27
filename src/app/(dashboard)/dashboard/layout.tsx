import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "./_components/dashboardShell";
import { Unauthorized } from "./_components/unauthorized";

const ALLOWED_ROLES = new Set(["Sudo", "Admin"]);

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");
  if (!ALLOWED_ROLES.has(session.user.role)) return <Unauthorized />;

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
