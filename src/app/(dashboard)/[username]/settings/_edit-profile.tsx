"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions";
import { isValidUsername } from "@/lib/reserved";

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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUsername(form.username)) {
      toast.error("Username must be 2-30 characters, letters/numbers/hyphens/underscores only.");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text">Avatar URL</label>
        <input
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50"
        />
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
