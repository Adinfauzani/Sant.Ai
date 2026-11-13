import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";

const ALLOWED_ROLES = new Set(["sudo"]);

const statusStyles: Record<string, string> = {
  Operational: "bg-success/10 text-success dark:text-success border-border dark:border-border",
  DegradedPerformance: "bg-warning/10 text-warning dark:text-warning border-border dark:border-border",
  PartialOutage: "bg-warning/10 text-warning dark:text-warning border-border dark:border-border",
  MajorOutage: "bg-destructive/10 text-destructive dark:text-destructive border-border dark:border-border",
  UnderMaintenance: "bg-primary/10 text-primary dark:text-primary border-border dark:border-border",
};

export default async function StatusOverviewPage() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");
  if (!ALLOWED_ROLES.has(session.user.role?.toLowerCase() ?? "")) redirect("/unauthorized");

  const [services, incidents, maintenances] = await Promise.all([
    prisma.statusService.findMany({ orderBy: { order: "asc" } }),
    prisma.incident.findMany({ where: { status: { not: "Resolved" } }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.maintenance.findMany({ where: { status: { in: ["scheduled", "in_progress"] } }, orderBy: { scheduledAt: "asc" }, take: 5 }),
  ]);

  const totalServices = services.length;
  const operationalCount = services.filter((s) => s.status === "Operational").length;
  const uptimePercent = totalServices > 0 ? Math.round((operationalCount / totalServices) * 100) : 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Pusat Status</h1>
        <p className="text-xs text-muted">Pantau dan kelola layanan, insiden, serta pemeliharaanmu.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Total Layanan</p>
          <p className="mt-1 text-2xl font-bold text-text">{totalServices}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Insiden Aktif</p>
          <p className="mt-1 text-2xl font-bold text-text">{incidents.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Uptime</p>
          <p className="mt-1 text-2xl font-bold text-success">{uptimePercent}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Pemeliharaan Mendatang</p>
          <p className="mt-1 text-2xl font-bold text-text">{maintenances.length}</p>
        </div>
      </div>

      {/* Services List */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-text">Layanan</h2>
          <Link href="/dashboard/status/monitors" className="text-[10px] text-primary hover:underline">Kelola Monitor</Link>
        </div>
        <div className="divide-y divide-border">
          {services.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-text">{svc.name}</p>
                {svc.description && <p className="text-[10px] text-muted">{svc.description}</p>}
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[svc.status] || ""}`}>
                {svc.status === "Operational" ? "✓" : "●"} {svc.status.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
          ))}
          {services.length === 0 && (
            <p className="px-5 py-8 text-center text-xs text-muted">Belum ada layanan yang diatur.</p>
          )}
        </div>
      </div>

      {/* Active Insiden & Pemeliharaan */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold text-text">Insiden Aktif</h2>
            <Link href="/dashboard/status/incidents" className="text-[10px] text-primary hover:underline">Lihat Semua</Link>
          </div>
          <div className="divide-y divide-border">
            {incidents.map((inc) => (
              <div key={inc.id} className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
                  <p className="text-xs font-medium text-text">{inc.title}</p>
                </div>
                <p className="mt-0.5 text-[10px] text-muted">{inc.status} · {new Date(inc.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {incidents.length === 0 && (
              <p className="px-5 py-8 text-center text-xs text-muted">Tidak ada insiden aktif. Semua layanan beroperasi normal.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold text-text">Pemeliharaan Mendatang</h2>
            <Link href="/dashboard/status/maintenance" className="text-[10px] text-primary hover:underline">Lihat Semua</Link>
          </div>
          <div className="divide-y divide-border">
            {maintenances.map((m) => (
              <div key={m.id} className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <p className="text-xs font-medium text-text">{m.title}</p>
                </div>
                <p className="mt-0.5 text-[10px] text-muted">{m.status} · {new Date(m.scheduledAt).toLocaleDateString()}</p>
              </div>
            ))}
            {maintenances.length === 0 && (
              <p className="px-5 py-8 text-center text-xs text-muted">Belum ada pemeliharaan terjadwal.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
