import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Mail, Slack, MessageCircle, Globe, Webhook, ToggleLeft, ToggleRight } from "lucide-react";

const ALLOWED_ROLES = new Set(["sudo"]);

const providerIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  slack: <Slack className="h-4 w-4" />,
  discord: <MessageCircle className="h-4 w-4" />,
  telegram: <MessageCircle className="h-4 w-4" />,
  webhook: <Webhook className="h-4 w-4" />,
};

export default async function NotifikasiPage() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");
  if (!ALLOWED_ROLES.has(session.user.role?.toLowerCase() ?? "")) redirect("/unauthorized");

  const providers = await prisma.notificationProvider.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Notifikasi</h1>
          <p className="text-xs text-muted">Atur kanal notifikasi untuk peringatan insiden.</p>
        </div>
        <Link
          href="/dashboard/status/notifications/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> Add Channel
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_120px_100px_80px] gap-4 border-b border-border px-5 py-3 text-[10px] font-semibold text-muted">
          <span>Nama</span>
          <span>Jenis</span>
          <span>Status</span>
          <span className="text-right">Aktif</span>
        </div>
        <div className="divide-y divide-border">
          {providers.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_120px_100px_80px] gap-4 px-5 py-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted">{providerIcons[p.type] || <Globe className="h-4 w-4" />}</span>
                <span className="font-medium text-text">{p.name}</span>
              </div>
              <span className="self-center text-muted capitalize">{p.type}</span>
              <span className={`self-center font-medium ${p.enabled ? "text-success" : "text-muted"}`}>
                {p.enabled ? "Active" : "Disabled"}
              </span>
              <div className="flex items-center justify-end self-center">
                {p.enabled ? <ToggleRight className="h-5 w-5 text-success" /> : <ToggleLeft className="h-5 w-5 text-muted" />}
              </div>
            </div>
          ))}
          {providers.length === 0 && (
            <p className="px-5 py-8 text-center text-xs text-muted">Belum ada kanal notifikasi.</p>
          )}
        </div>
      </div>
    </div>
  );
}
