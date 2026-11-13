"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/authClient";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@santai/ui/button";
import { Input } from "@santai/ui/input";
import { Textarea } from "@santai/ui/textarea";
import { Label } from "@santai/ui/label";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { createProject } from "@/lib/projects/actions";

export default function CreateProjectPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <GraduationCap className="mb-4 size-10 text-primary" />
        <h1 className="font-heading text-xl font-bold text-text">Butuh login dulu</h1>
        <p className="mt-1 text-sm text-muted">Login biar bisa bikin proyek baru.</p>
        <Button asChild className="mt-4">
          <Link href="/login?next=/projects/create">Masuk</Link>
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData(e.currentTarget);
      await createProject(form);
      // redirect happens in the server action
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat proyek");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Showcase
          </Link>

          <div className="mx-auto mt-6 max-w-xl">
            <p className="editorial-label">Proyek Baru</p>
            <h1 className="mt-2 font-heading text-2xl font-bold text-text">Buat Proyek</h1>
            <p className="mt-1 text-sm text-muted">
              Mulai proyek kolaboratif bareng mahasiswa lain.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title">Judul Proyek</Label>
                <Input id="title" name="title" type="text" required placeholder="Mis. Deteksi Dini Bakteri pada Daun" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="Jelasin proyeknya secara singkat — lagi ngapain, buat siapa, dan kenapa penting."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="problemStatement">Masalah yang Diselesaikan <span className="font-normal text-muted">(opsional)</span></Label>
                <Textarea
                  id="problemStatement"
                  name="problemStatement"
                  rows={3}
                  placeholder="Masalah apa yang lagi kamu obati dengan proyek ini?"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="techStack">Tech Stack <span className="font-normal text-muted">(pisah pakai koma)</span></Label>
                <Input
                  id="techStack"
                  name="techStack"
                  type="text"
                  placeholder="React, Python, TensorFlow"
                />
              </div>

              <div className="rounded-xl border border-border bg-surface/40 p-4">
                <p className="text-sm font-medium text-text">Kebutuhan Tim</p>
                <p className="mt-0.5 text-xs text-muted">
                  Butuh berapa orang dari tiap program studi?
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="sd" className="text-xs text-muted">Sains Data (SD)</Label>
                    <Input id="sd" name="sd" type="number" min={0} max={10} defaultValue={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ti" className="text-xs text-muted">Teknik Informatika (TI)</Label>
                    <Input id="ti" name="ti" type="number" min={0} max={10} defaultValue={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="si" className="text-xs text-muted">Sistem Informasi (SI)</Label>
                    <Input id="si" name="si" type="number" min={0} max={10} defaultValue={0} />
                  </div>
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <TwinOrbit className="size-4 text-current" />}
                {loading ? "Lagi bikin…" : "Buat Proyek"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
