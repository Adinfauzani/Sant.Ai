import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Globe, Lock, Palette, Eye } from "lucide-react";

const ALLOWED_ROLES = new Set(["sudo"]);

export default async function StatusSettingsPage() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");
  if (!ALLOWED_ROLES.has(session.user.role?.toLowerCase() ?? "")) redirect("/unauthorized");

  const settings = await prisma.statusPageSettings.findUnique({ where: { id: "default" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Pengaturan Halaman Status</h1>
        <p className="text-xs text-muted">Atur tampilan dan perilaku halaman status publikmu.</p>
      </div>

      {settings ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-text">Umum</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Judul</p>
                <p className="mt-1 text-sm text-text">{settings.title}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Domain Kustom</p>
                <p className="mt-1 text-sm text-text">{settings.customDomain || "Not set"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Deskripsi</p>
                <p className="mt-1 text-sm text-text">{settings.description || "Not set"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-text">Tampilan</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Tema</p>
                <p className="mt-1 text-sm text-text capitalize">{settings.theme}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Warna Brand</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: settings.brandColor }} />
                  <span className="text-sm text-text">{settings.brandColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-text">Opsi Tampilan</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                <p className="text-xs text-text">Tampilkan Uptime</p>
                <span className={`text-xs font-medium ${settings.showUptime ? "text-success" : "text-muted"}`}>
                  {settings.showUptime ? "On" : "Off"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                <p className="text-xs text-text">Tampilkan Waktu Respons</p>
                <span className={`text-xs font-medium ${settings.showResponseTime ? "text-success" : "text-muted"}`}>
                  {settings.showResponseTime ? "On" : "Off"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                <p className="text-xs text-text">Tampilkan Riwayat</p>
                <span className={`text-xs font-medium ${settings.showHistory ? "text-success" : "text-muted"}`}>
                  {settings.showHistory ? "On" : "Off"}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Riwayat (Hari)</p>
              <p className="mt-1 text-sm text-text">{settings.historyDays} days</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-text">Akses</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                <p className="text-xs text-text">Akses API Publik</p>
                <span className={`text-xs font-medium ${settings.publicApiAccess ? "text-success" : "text-muted"}`}>
                  {settings.publicApiAccess ? "On" : "Off"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                <p className="text-xs text-text">Dilindungi Kata Sandi</p>
                <span className={`text-xs font-medium ${settings.password ? "text-success" : "text-muted"}`}>
                  {settings.password ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12">
          <Globe className="h-8 w-8 text-muted" />
          <p className="mt-3 text-sm font-medium text-text">Belum Ada Pengaturan</p>
          <p className="mt-1 text-xs text-muted">Pengaturan bawaan akan dipakai untuk halaman status publik.</p>
        </div>
      )}
    </div>
  );
}
