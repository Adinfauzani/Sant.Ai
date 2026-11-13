"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Camera, ChevronDown } from "lucide-react";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import { updateProfile, updateProfileSettings } from "@/lib/projects/actions";
import { authClient } from "@/lib/auth/authClient";
import { isValidUsername, isReservedUsername } from "@/lib/reserved";
import { cn } from "@/lib/utils";
import MarkdownEditor from "./_markdownEditor";

interface Props {
  user: {
    name: string;
    username: string | null;
    email: string;
    bio: string;
    image: string | null;
    website: string | null;
    location: string | null;
    phone: string | null;
    readme: string;
  };
}

export default function SectionBasicInfo({ user }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    username: user.username || "",
    bio: user.bio,
    avatar: user.image || "",
    website: user.website || "",
    location: user.location || "",
    phone: user.phone || "",
    readme: user.readme,
  });

  const [readmeOpen, setReadmeOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const avatarPreview = form.avatar.startsWith("data:") || form.avatar.startsWith("http")
    ? form.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=2563eb&color=fff`;

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const u = form.username;
    if (!u || u === user.username) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
      return;
    }
    if (!isValidUsername(u) || isReservedUsername(u)) {
      setUsernameAvailable(false);
      setCheckingUsername(false);
      return;
    }

    setCheckingUsername(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/auth/is-username-available`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });
      const data = await res.json();
      setUsernameAvailable(data?.data?.available ?? data?.available ?? false);
      setCheckingUsername(false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.username, user.username]);

  const handleSave = async () => {
    if (!isValidUsername(form.username)) {
      toast.error("Username harus 2-30 karakter: huruf, angka, tanda hubung, atau garis bawah saja.");
      return;
    }
    if (usernameAvailable === false) {
      toast.error("Username sudah dipakai.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("name", form.name);
      fd.set("username", form.username);
      fd.set("bio", form.bio);
      fd.set("avatar", form.avatar);
      fd.set("website", form.website);
      fd.set("location", form.location);
      fd.set("readme", form.readme);
      await updateProfile(fd);

      await updateProfileSettings({ phone: form.phone });

      toast.success("Info dasar tersimpan");
      if (form.username !== user.username) {
        await authClient.getSession();
        router.push(`/${form.username}/settings`);
      } else {
        router.refresh();
      }
    } catch (e: any) {
      toast.error(e.message || "Gagal memperbarui");
    } finally {
      setSaving(false);
    }
  };

  const usernameTaken = form.username !== user.username && usernameAvailable === false;
  const usernameOk = form.username !== user.username && usernameAvailable === true;

  const hasChanges =
    form.name !== user.name ||
    form.username !== (user.username || "") ||
    form.bio !== user.bio ||
    form.avatar !== (user.image || "") ||
    form.website !== (user.website || "") ||
    form.location !== (user.location || "") ||
    form.phone !== (user.phone || "") ||
    form.readme !== user.readme;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Informasi Dasar</h3>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-md bg-text px-3 py-1.5 text-[11px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving && <TwinOrbit className="size-3" />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Avatar + Name + Username */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative shrink-0"
          >
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-16 w-16 rounded-full object-cover ring-1 ring-border"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setForm({ ...form, avatar: reader.result as string });
              reader.readAsDataURL(file);
            }}
          />
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted">Nama</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Username</label>
              <div className="relative">
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={cn(
                    "w-full rounded-lg border bg-surface/50 px-3 py-2 pr-8 text-sm text-text focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    usernameTaken ? "border-destructive" : usernameOk ? "border-success" : "border-border",
                  )}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  {checkingUsername ? (
                    <TwinOrbit className="size-3.5 text-muted" />
                  ) : usernameTaken ? (
                    <X className="h-3.5 w-3.5 text-destructive" />
                  ) : usernameOk ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : null}
                </span>
              </div>
              {usernameTaken && (
                <p className="mt-1 text-[10px] text-destructive">Username sudah dipakai</p>
              )}
              {usernameOk && (
                <p className="mt-1 text-[10px] text-success">Username tersedia</p>
              )}
            </div>
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-surface/50 p-3">
            <p className="text-[11px] text-muted">Email</p>
            <p className="text-sm text-text">{user.email}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Telepon</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+62 xxx-xxxx-xxxx"
              className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="mb-1 block text-xs text-muted">Biodata</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            placeholder="Ceritakan sedikit tentang dirimu"
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary resize-none"
          />
        </div>

        {/* Website + Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted">Website</label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://"
              className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Lokasi</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Kota, Negara"
              className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
            />
          </div>
        </div>

        {/* Profile README */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setReadmeOpen(!readmeOpen)}
            className="flex items-center gap-2 text-xs font-medium text-text"
          >
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", readmeOpen && "rotate-0", !readmeOpen && "-rotate-90")} />
            README Profil
          </button>
          {readmeOpen && (
            <div className="mt-2">
              <MarkdownEditor
                value={form.readme}
                onChange={(value) => setForm({ ...form, readme: value })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
