import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Mail, Shield, Trophy, User, Award } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "../_components";

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-surface/30 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] text-muted">{label}</span>
      </div>
      <span className="text-xs font-semibold text-text">{value}</span>
    </div>
  );
}

export default async function AccountPage() {
  const session = await getAuthSession(await headers());

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      plan: true,
      studyProgram: true,
      semester: true,
      reputationPoints: true,
      level: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Dashboard</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-text md:text-3xl">Akun</h1>
        <p className="mt-2 text-sm text-muted">Kelola informasi akun dashboard Sant.Ai Anda.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Informasi Akun">
          <div className="space-y-3">
            <InfoRow icon={User} label="Nama" value={user.name} />
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={Shield} label="Role" value={user.role} />
            <InfoRow icon={Award} label="Plan" value={user.plan} />
          </div>
        </Card>

        <Card title="Profil Kampus">
          <div className="space-y-3">
            <InfoRow icon={Trophy} label="Reputasi" value={String(user.reputationPoints)} />
            <InfoRow icon={User} label="Level" value={user.level} />
            <InfoRow icon={Award} label="Study Program" value={user.studyProgram || "Belum diisi"} />
            <InfoRow icon={Shield} label="Semester" value={String(user.semester)} />
          </div>
        </Card>
      </div>

      <Card title="Catatan">
        <p className="text-sm leading-relaxed text-muted">
          Fitur manajemen pengguna dan pengaturan berbayar belum diaktifkan. Semua pengguna saat ini menggunakan akses gratis dan hanya dapat melihat menu yang tersedia sesuai kebutuhan dashboard.
        </p>
      </Card>
    </div>
  );
}
