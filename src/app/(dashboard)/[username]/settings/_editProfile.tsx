"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Check, X, Camera, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { updateProfile } from "@/lib/actions";
import { isValidUsername, isReservedUsername } from "@/lib/reserved";
import { cn } from "@/lib/utils";
import MarkdownEditor from "./_markdownEditor";

interface Props {
  user: {
    name: string;
    username: string | null;
    email: string;
    bio: string;
    avatar: string;
    website: string;
    location: string;
    studyProgram: string;
    semester: number;
    readme: string;
  };
}

export default function EditProfileForm({ user }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    username: user.username || "",
    bio: user.bio,
    avatar: user.avatar,
    website: user.website,
    location: user.location,
    readme: user.readme,
  });

  const [readmeOpen, setReadmeOpen] = useState(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUsername(form.username)) {
      toast.error("Username must be 2-30 characters, letters/numbers/hyphens/underscores only.");
      return;
    }

    if (usernameAvailable === false) {
      toast.error("Username is already taken.");
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
      toast.success("Profile updated");
      if (form.username !== user.username) {
        router.push(`/${form.username}/settings`);
      } else {
        router.refresh();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const usernameTaken = form.username !== user.username && usernameAvailable === false;
  const usernameOk = form.username !== user.username && usernameAvailable === true;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
            <label className="mb-1 block text-xs font-medium text-text">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text">Username</label>
            <div className="relative">
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className={cn(
                  "w-full rounded border bg-surface/10 px-3 py-2 pr-8 text-xs text-text outline-none placeholder:text-muted/50",
                  usernameTaken ? "border-red-500" : usernameOk ? "border-emerald-500" : "border-border",
                )}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {checkingUsername ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />
                ) : usernameTaken ? (
                  <X className="h-3.5 w-3.5 text-red-500" />
                ) : usernameOk ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : null}
              </span>
            </div>
            {usernameTaken && (
              <p className="mt-1 text-[10px] text-red-500">Username is already taken</p>
            )}
            {usernameOk && (
              <p className="mt-1 text-[10px] text-emerald-500">Username is available</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50 resize-none"
        />
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={() => setReadmeOpen(!readmeOpen)}
          className="mb-2 flex items-center gap-2 text-xs font-medium text-text"
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", readmeOpen && "rotate-0", !readmeOpen && "-rotate-90")} />
          Profile README
        </button>
        {readmeOpen && (
          <MarkdownEditor
            value={form.readme}
            onChange={(value) => setForm({ ...form, readme: value })}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Website</label>
          <input
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50"
          />
        </div>
      </div>

      <div className="text-[10px] text-muted">
        Email: {user.email} &middot; {user.studyProgram} &middot; Semester {user.semester}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} size="sm" className="gap-2 text-xs">
          {saving && <Loader2 className="h-3 w-3 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
