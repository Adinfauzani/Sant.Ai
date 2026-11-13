import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@santai/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Unauthorized } from "./_components/unauthorized";
import { prisma } from "@/lib/db";

const ALLOWED_ROLES = new Set(["sudo", "admin", "moderator"]);

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");

  const role = session.user.role?.toLowerCase() ?? "";

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || !ALLOWED_ROLES.has(user.role.toLowerCase())) return <Unauthorized />;
  } catch {
    if (!ALLOWED_ROLES.has(role)) return <Unauthorized />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar
        user={{
          name: session.user.name ?? "User",
          email: session.user.email ?? "",
          image: session.user.image,
        }}
        role={session.user.role ?? ""}
      />
      <SidebarInset>
        <DashboardHeader user={session.user} role={session.user.role ?? ""} />
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-8 py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
