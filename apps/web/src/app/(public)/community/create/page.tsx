import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CreateCommunityForm from "./_createCommunityForm";

export const dynamic = "force-dynamic";

export default async function CreateCommunityPage() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main section-padding">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/community"
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Komunitas
            </Link>

            <div className="mt-4 rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h1 className="font-heading text-2xl font-bold text-text">Buat Komunitas Baru</h1>
              </div>
              <p className="mt-1.5 text-sm text-muted">
                Halo, {user?.name ?? "teman"}! Bangun ruang diskusi dan kolaborasi untuk prodi, minat, atau topikmu.
                Kamu akan otomatis menjadi lead dan anggota pertama.
              </p>

              <div className="mt-6">
                <CreateCommunityForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}