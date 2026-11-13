"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight, ChevronLeft, Check, Camera, X, UserPlus, ShoppingBag, ListTodo, FileText, Sparkles,
} from "lucide-react";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import { Button } from "@santai/ui/button";
import { Input } from "@santai/ui/input";
import { Textarea } from "@santai/ui/textarea";
import { Label } from "@santai/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@santai/ui/select";
import { createCommunity, type InviteeInput } from "@/lib/community/communityActions";
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
    const res = await createCommunity({
      name,
      description,
      category,
      coverImage: coverImage ?? undefined,
      needs,
      todos,
      invites,
    });
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
                aria-current={active ? "step" : undefined}
                aria-label={`Langkah ${i + 1}: ${label}`}
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  done && "bg-success/15 text-success",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "bg-surface text-muted",
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </button>
              <span className={cn("text-[9px] font-medium", active ? "text-text" : "text-muted")}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-1.5 block text-xs text-muted">
                Judul komunitas
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Android Development Club"
                minLength={2}
                maxLength={60}
              />
              {name.trim().length >= 2 && (
                <p className="mt-1 text-[10px] text-muted">
                  URL: <span className="font-mono text-primary">{slugPreview(name)}</span>
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="mb-1.5 block text-xs text-muted">
                Deskripsi singkat
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Topik yang dibahas, siapa yang cocok bergabung, dan tujuan komunitas."
                maxLength={300}
              />
              <p className="mt-1 text-right text-[10px] text-muted">{description.length}/300</p>
            </div>

            <div>
              <Label htmlFor="category" className="mb-1.5 block text-xs text-muted">
                Kategori
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {[...COMMUNITY_CATEGORIES, "Umum"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <Label className="mb-1.5 block text-xs text-muted">
              Cover komunitas (opsional)
            </Label>
            <div className="flex flex-col gap-3">
              <div className="relative h-40 overflow-hidden rounded-xl border border-dashed border-border bg-surface/40 md:h-48">
                {coverImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImage} alt="Pratinjau cover" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-lg bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Hapus cover"
                    >
                      <X className="size-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-muted transition-colors hover:text-text">
                    <Camera className="size-6" />
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
                <Label htmlFor="cover-url" className="mb-1.5 block text-xs text-muted">
                  …atau pakai URL gambar
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="cover-url"
                    value={coverImage?.startsWith("http") ? coverImage : ""}
                    onChange={(e) => setCoverImage(e.target.value.trim() || null)}
                    placeholder="https://…/cover.jpg"
                  />
                  {coverImage?.startsWith("http") && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setCoverImage(null)}>
                      Hapus
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2">
              <UserPlus className="size-4 text-primary" />
              <Label className="text-xs text-muted">Undang rekan (opsional)</Label>
            </div>
            <p className="mt-1 text-[10px] text-muted">
              Cari berdasarkan <span className="font-mono text-primary">@username</span> atau email. Mereka
              akan mendapat notifikasi undangan.
            </p>
            <div className="mt-3">
              <InviteInput selected={invites} onChange={setInvites} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4 text-primary" />
              <Label className="text-xs text-muted">List kebutuhan (opsional)</Label>
            </div>
            <p className="mt-1 text-[10px] text-muted">
              Perlengkapan/tools yang dibutuhkan anggota untuk berpartisipasi.
            </p>
            <div className="mt-3">
              <ListEditor
                items={needs}
                onChange={setNeeds}
                placeholder="cth: Laptop, Visual Studio, internet stabil…"
                max={30}
              />
            </div>
            {needs.length === 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {NEED_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => !needs.includes(s) && setNeeds([...needs, s])}
                    className="rounded-md border border-dashed border-border px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-border-strong hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <ListTodo className="size-4 text-primary" />
              <Label className="text-xs text-muted">Todo / rencana komunitas (opsional)</Label>
            </div>
            <p className="mt-1 text-[10px] text-muted">
              Rencana seperti onboarding anggota, studi group, atau event pertama. Todo bisa dicentang oleh
              lead.
            </p>
            <div className="mt-3">
              <ListEditor
                items={todos}
                onChange={setTodos}
                placeholder="cth: Adakan sesi onboarding anggota"
                max={20}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span className="text-xs font-semibold text-text">Review komunitasmu</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-1.5 bg-primary" />
              {coverImage && (
                <div className="h-28 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-bold text-text">{name}</h3>
                  <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                    {category}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-muted">{description}</p>
                <p className="mt-2 font-mono text-[10px] text-primary">{slugPreview(name)}</p>

                <div className="mt-4 grid gap-3 text-[11px] text-text sm:grid-cols-3">
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">Undangan</p>
                    {invites.length === 0 ? (
                      <p className="mt-1 text-muted">Tidak ada</p>
                    ) : (
                      <p className="mt-1 flex flex-wrap gap-1">
                        {invites.map((i) => (
                          <span key={i.id} className="font-mono text-primary">
                            @{i.username}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">Kebutuhan</p>
                    {needs.length === 0 ? (
                      <p className="mt-1 text-muted">Tidak ada</p>
                    ) : (
                      <p className="mt-1 line-clamp-3">{needs.join(", ")}</p>
                    )}
                  </div>
                  <div className="rounded-lg bg-surface/50 p-3">
                    <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">Todo</p>
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
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <Button type="button" onClick={handleSubmit} disabled={saving} className="w-full gap-2">
              {saving ? <TwinOrbit className="size-4" /> : <Sparkles className="size-4" />}
              {saving ? "Membuat komunitas…" : "Buat Komunitas"}
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="gap-1"
            >
              <ChevronLeft className="size-3.5" /> Kembali
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 && (
            <Button
              type="button"
              size="sm"
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="gap-1"
            >
              Lanjut <ChevronRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
