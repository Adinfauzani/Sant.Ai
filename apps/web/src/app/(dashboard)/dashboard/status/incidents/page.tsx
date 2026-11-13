import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, AlertTriangle, CheckCircle, Search, Clock } from "lucide-react";

const ALLOWED_ROLES = new Set(["sudo"]);

const statusColors: Record<string, string> = {
  Investigating: "text-warning",
  Identified: "text-warning",
  Monitoring: "text-primary",
  Resolved: "text-success",
};

const severityColors: Record<string, string> = {
  minor: "bg-warning/10 text-warning border-border dark:border-border",
  major: "bg-warning/10 text-warning border-border dark:border-border",
  critical: "bg-destructive/10 text-destructive border-border dark:border-border",
};

export default async function InsidenPage() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");
  if (!ALLOWED_ROLES.has(session.user.role?.toLowerCase() ?? "")) redirect("/unauthorized");

  const incidents = await prisma.incident.findMany({
    include: { updates: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Insiden</h1>
          <p className="text-xs text-muted">Lacak dan kelola insiden layanan.</p>
        </div>
        <Link
          href="/dashboard/status/incidents/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> New Incident
        </Link>
      </div>

      <div className="space-y-3">
        {incidents.map((inc) => {
          const latestUpdate = inc.updates[0];
          return (
            <div key={inc.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {inc.status === "Resolved" ? (
                    <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${statusColors[inc.status]}`} />
                  ) : (
                    <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${statusColors[inc.status] || "text-warning"}`} />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-text">{inc.title}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${severityColors[inc.severity] || ""}`}>
                        {inc.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{inc.description}</p>
                    {latestUpdate && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-surface p-3">
                        <Clock className="mt-0.5 h-3 w-3 shrink-0 text-muted" />
                        <div>
                          <p className="text-[11px] font-medium text-text" style={{ color: statusColors[latestUpdate.status] }}>
                            {latestUpdate.status}
                          </p>
                          <p className="text-[10px] text-muted">{latestUpdate.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-[10px] text-muted">
                  {new Date(inc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          );
        })}
        {incidents.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12">
            <CheckCircle className="h-8 w-8 text-success" />
            <p className="mt-3 text-sm font-medium text-text">Semua Aman</p>
            <p className="mt-1 text-xs text-muted">Belum ada insiden terlapor. Layanan beroperasi penuh.</p>
          </div>
        )}
      </div>
    </div>
  );
}
