import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "./_components/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
