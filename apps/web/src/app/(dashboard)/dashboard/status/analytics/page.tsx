import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ALLOWED_ROLES = new Set(["sudo"]);

export default async function AnalyticsPage() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");
  if (!ALLOWED_ROLES.has(session.user.role?.toLowerCase() ?? "")) redirect("/unauthorized");

  const [services, history] = await Promise.all([
    prisma.statusService.findMany({ orderBy: { order: "asc" } }),
    prisma.statusHistory.findMany({ orderBy: { date: "desc" }, take: 100 }),
  ]);

  const totalServices = services.length;
  const operationalCount = services.filter((s) => s.status === "Operational").length;
  const overallUptime = totalServices > 0 ? Math.round((operationalCount / totalServices) * 100) : 100;
  const avgUptime = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + h.uptime, 0) / history.length)
    : 100;

  const byService = services.map((svc) => {
    const svcHistory = history.filter((h) => h.serviceId === svc.id);
    const avg = svcHistory.length > 0
      ? Math.round(svcHistory.reduce((s, h) => s + h.uptime, 0) / svcHistory.length)
      : 100;
    return { name: svc.name, uptime: avg, status: svc.status };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Analitik</h1>
        <p className="text-xs text-muted">Metrik uptime dan waktu respons.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Uptime Keseluruhan</p>
          <p className="mt-1 text-2xl font-bold text-success">{overallUptime}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Rata-rata Uptime Historis</p>
          <p className="mt-1 text-2xl font-bold text-text">{avgUptime}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Layanan</p>
          <p className="mt-1 text-2xl font-bold text-text">{totalServices}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Insiden Aktif</p>
          <p className="mt-1 text-2xl font-bold text-text">{services.filter((s) => s.status !== "Operational" && s.status !== "UnderMaintenance").length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-text">Uptime Layanan</h2>
        </div>
        <div className="divide-y divide-border">
          {byService.map((s) => (
            <div key={s.name} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text">{s.name}</span>
                {s.uptime >= 99.9 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : s.uptime >= 95 ? (
                  <Minus className="h-3.5 w-3.5 text-warning" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
              </div>
              <span className={`text-sm font-bold ${s.uptime >= 99.9 ? "text-success" : s.uptime >= 95 ? "text-warning" : "text-destructive"}`}>
                {s.uptime}%
              </span>
            </div>
          ))}
          {byService.length === 0 && (
            <p className="px-5 py-8 text-center text-xs text-muted">Belum ada data. Atur layanan dan monitor dulu.</p>
          )}
        </div>
      </div>
    </div>
  );
}
