import Link from "next/link";
import { prisma } from "@/lib/db";
import { CheckCircle, AlertTriangle, XCircle, Clock, Wrench } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  Operational: {
    icon: <CheckCircle className="size-4" />,
    color: "text-success",
    label: "Semua sistem normal",
  },
  DegradedPerformance: {
    icon: <AlertTriangle className="size-4" />,
    color: "text-warning",
    label: "Performa menurun",
  },
  PartialOutage: {
    icon: <AlertTriangle className="size-4" />,
    color: "text-warning",
    label: "Gangguan sebagian",
  },
  MajorOutage: {
    icon: <XCircle className="size-4" />,
    color: "text-destructive",
    label: "Gangguan besar",
  },
  UnderMaintenance: {
    icon: <Wrench className="size-4" />,
    color: "text-primary",
    label: "Dalam pemeliharaan",
  },
};

const statusOrder = ["Operational", "DegradedPerformance", "PartialOutage", "MajorOutage", "UnderMaintenance"];

const severityColors: Record<string, string> = {
  minor: "border-l-warning",
  major: "border-l-warning",
  critical: "border-l-destructive",
};

const severityLabels: Record<string, string> = {
  minor: "Ringan",
  major: "Sedang",
  critical: "Kritis",
};

export const dynamic = "force-dynamic";

export default async function PublicStatusPage() {
  const [services, activeIncidents, scheduledMaintenance] = await Promise.all([
    prisma.statusService.findMany({ orderBy: { order: "asc" } }),
    prisma.incident.findMany({
      where: { status: { not: "Resolved" } },
      include: { services: { include: { service: true } }, updates: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.maintenance.findMany({
      where: { status: { in: ["scheduled", "in_progress"] } },
      include: { services: { include: { service: true } } },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  const allOperational = services.length > 0 && services.every((s) => s.status === "Operational");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-4 py-16">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="mb-3 editorial-label">Status</p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-text">Sant.Ai Status</h1>
            <p className="mt-2 text-sm text-muted">
              {allOperational
                ? "Semua layanan kami lagi jalan normal."
                : "Ada layanan yang lagi gangguan. Santai, lagi kami benerin."}
            </p>
            <span
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                allOperational ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}
            >
              {allOperational ? (
                <CheckCircle className="size-4" />
              ) : (
                <AlertTriangle className="size-4" />
              )}
              {allOperational ? "Semua sistem normal" : "Performa menurun"}
            </span>
            <p className="mt-3 text-xs text-muted">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Services */}
          <div className="space-y-2">
            {services.map((svc) => {
              const cfg = statusConfig[svc.status];
              return (
                <div
                  key={svc.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={cfg?.color || "text-muted"}>{cfg?.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">{svc.name}</p>
                      {svc.description && <p className="truncate text-xs text-muted">{svc.description}</p>}
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium ${cfg?.color || "text-muted"}`}>
                    {cfg?.label || svc.status}
                  </span>
                </div>
              );
            })}
            {services.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">Belum ada layanan yang dikonfigurasi.</p>
            )}
          </div>

          {/* Active Incidents */}
          {activeIncidents.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 font-heading text-sm font-semibold text-text">Insiden Aktif</h2>
              <div className="space-y-3">
                {activeIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={`rounded-xl border border-border bg-card p-5 border-l-4 ${
                      severityColors[inc.severity] || "border-l-warning"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive uppercase">
                            {severityLabels[inc.severity] || inc.severity}
                          </span>
                          <h3 className="text-sm font-semibold text-text">{inc.title}</h3>
                        </div>
                        <p className="mt-1 text-xs text-muted">{inc.description}</p>
                        {inc.services.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {inc.services.map((s) => (
                              <span
                                key={s.serviceId}
                                className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted"
                              >
                                {s.service.name}
                              </span>
                            ))}
                          </div>
                        )}
                        {inc.updates[0] && (
                          <div className="mt-3 rounded-lg border border-border bg-surface/50 p-3">
                            <p className="text-[11px] font-medium text-text">{inc.updates[0].status}</p>
                            <p className="mt-0.5 text-[10px] text-muted">{inc.updates[0].message}</p>
                          </div>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] text-muted">
                        {new Date(inc.createdAt).toLocaleDateString("id-ID", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Maintenance */}
          {scheduledMaintenance.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 font-heading text-sm font-semibold text-text">Pemeliharaan Terjadwal</h2>
              <div className="space-y-3">
                {scheduledMaintenance.map((m) => (
                  <div key={m.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div>
                        <h3 className="text-sm font-semibold text-text">{m.title}</h3>
                        <p className="mt-1 text-xs text-muted">{m.description}</p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-muted">
                          <Clock className="size-3" />
                          {new Date(m.scheduledAt).toLocaleDateString("id-ID", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {m.services.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {m.services.map((s) => (
                              <span
                                key={s.serviceId}
                                className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted"
                              >
                                {s.service.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 border-t border-border pt-6 text-center">
            <p className="text-xs text-muted">
              Dicek terakhir:{" "}
              {new Date().toLocaleString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="mt-1 text-xs text-muted">
              Dikelola oleh <span className="font-medium text-text">tim Sant.Ai</span>
            </p>
            <Link
              href="/"
              className="mt-3 inline-block text-xs text-primary hover:underline"
            >
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
