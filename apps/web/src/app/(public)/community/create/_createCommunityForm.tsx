"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, ChevronRight, ChevronLeft, Check, Camera, X,
  ImagePlus, UserPlus, ShoppingBag, ListTodo, FileText, Sparkles,
} from "lucide-react";
import { createCommunity, type InviteeInput } from "@/lib/communityActions";
import { cn } from "@/lib/utils";
import InviteInput from "./_inviteInput";
import ListEditor from "./_listEditor";

const COMMUNITY_CATEGORIES = [
  "AI & Machine Learning",
  "Web Development",
  "Data Science",
];

const STEPS = ["Informasi", "Cover", "Anggota", "Kebutuhan", "Todo", "Review"];

function slugPreview(name: string): string {
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "komunitas";
  return `/community/${slug}`;
}

const NEED_SUGGESTIONS = ["Laptop", "Visual Studio", "Jaringan internet stabil", "Dataset", "Akun GitHub"];

export default function CreateCommunityForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("AI & Machine Learning");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [invites, setInvites] = useState<InviteeInput[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [todos, setTodos] = useState<string[]>([]);

  function canNext(): boolean {
    if (step === 0) return name.trim().length >= 2 && description.trim().length > 0;
    return true;
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    const res = await createCommunity({ name, description, category, coverImage: coverImage ?? undefined, needs, todos, invites });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Gagal membuat komunitas.");
      return;
    }
    router.push(`/community/${res.slug}`);
    router.refresh();
  }

  function handleCoverFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => setCoverImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {/* Stepper */}
      <ol className="flex items-center gap-1.5">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                  done && "bg-emerald-500/15 text-emerald-500",
                  active && "bg-primary text-white",
                  !done && !active && "bg-surface text-muted",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </button>
              <span className={cn("text-[9px] font-medium", active ? "text-text" : "text-muted")}>{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-xs font-medium text-text">Judul komunitas</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Android Development Club"
                minLength={2}
                maxLength={60}
                className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text outline-none placeholder:text-muted/50 focus:border-primary/30"
              />
              {name.trim().length >= 2 && (
                <p className="mt-1 text-[10px] text-muted">
                  URL: <span className="font-mono text-primary">{slugPreview(name)}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-xs font-medium text-text">Deskripsi singkat</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Topik yang dibahas, siapa yang cocok bergabung, dan tujuan komunitas."
                maxLength={300}
                className="w-full resize-none rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text outline-none placeholder:text-muted/50 focus:border-primary/30"
              />
              <p className="mt-1 text-right text-[10px] text-muted">{description.length}/300</p>
            </div>

            <div>
              <label htmlFor="category" className="mb-1 block text-xs font-medium text-text">Kategori</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text outline-none focus:border-primary/30"
              >
                {[...COMMUNITY_CATEGORIES, "Umum"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="mb-1 block text-xs font-medium text-text">Cover komunitas (opsional)</label>
            <div className="flex flex-col gap-3">
              <div className="relative h-40 overflow-hidden rounded-xl border border-dashed border-border bg-surface/40 md:h-48">
                {coverImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImage} alt="Cover preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white transition-colors hover:bg-black/70"
                      aria-label="Hapus cover"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-muted transition-colors hover:text-text">
                    <Camera className="h-6 w-6" />
                    <span className="text-xs">Pilih gambar cover (jpg/png, maks 2MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverFile(file);
                      }}
                    />
                  </label>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text">…atau pakai URL gambar</label>
                <div className="flex gap-2">
                  <input
                    value={coverImage?.startsWith("http") ? coverImage : ""}
                    onChange={(e) => setCoverImage(e.target.value.trim() || null)}
                    placeholder="https://…/cover.jpg"
                    className="flex-1 rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text outline-none placeholder:text-muted/50 focus:border-primary/30"
                  />
                  {coverImage?.startsWith("http") && (
                    <button type="button" onClick={() => setCoverImage(null)} className="rounded-lg bg-surface px-3 text-xs font-medium text-muted hover:text-text">
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <label className="text-xs font-medium text-text">Undang rekan (opsional)</label>
            </div>
            <p className="mt-1 text-[10px] text-muted">
              Cari berdasarkan <span className="font-mono text-primary">@username</span> atau email. Mereka akan mendapat notifikasi undangan.
            </p>
            <div className="mt-3">
              <InviteInput selected={invites} onChange={setInvites} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <label className="text-xs font-medium text-text">List kebutuhan (opsional)</label>
            </div>
            <p className="mt-1 text-[10px] text-muted">Perlengkapan/tools yang dibutuhkan anggota untuk berpartisipasi.</p>
            <div className="mt-3">
              <ListEditor items={needs} onChange={setNeeds} placeholder="cth: Laptop, Visual Studio, internet stabil…" max={30} />
            </div>
            {needs.length === 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {NEED_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => !needs.includes(s) && setNeeds([...needs, s])}
                    className="rounded-lg border border-dashed border-border px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-primary" />
              <label className="text-xs font-medium text-text">Todo / rencana komunitas (opsional)</label>
            </div>
            <p className="mt-1 text-[10px] text-muted">
              Rencana seperti onboarding anggota, studi group, atau event pertama. Todo bisa dicentang oleh lead.
            </p>
            <div className="mt-3">
              <ListEditor items={todos} onChange={setTodos} placeholder="cth: Adakan sesi onboarding anggota" max={20} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-text">Review komunitasmu</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500" />
              {coverImage && (
                <div className="h-28 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-bold text-text">{name}</h3>
                  <span className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] text-primary">{category}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-muted">{description}</p>
                <p className="mt-2 font-mono text-[10px] text-primary">{slugPreview(name)}</p>

                <div className="mt-4 grid gap-3 text-[11px] text-text sm:grid-cols-3">
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Undangan</p>
                    {invites.length === 0 ? (
                      <p className="mt-1 text-muted">Tidak ada</p>
                    ) : (
                      <p className="mt-1 flex flex-wrap gap-1">
                        {invites.map((i) => (
                          <span key={i.id} className="font-mono text-primary">@{i.username}</span>
                        ))}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Kebutuhan</p>
                    {needs.length === 0 ? (
                      <p className="mt-1 text-muted">Tidak ada</p>
                    ) : (
                      <p className="mt-1 line-clamp-3">{needs.join(", ")}</p>
                    )}
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Todo</p>
                    {todos.length === 0 ? (
                      <p className="mt-1 text-muted">Tidak ada</p>
                    ) : (
                      <p className="mt-1 line-clamp-3">{todos.join(" · ")}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-text px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {saving ? "Membuat komunitas…" : "Buat Komunitas"}
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-text transition-colors hover:bg-surface"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Kembali
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Lanjut <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}