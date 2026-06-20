"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions";
import { isValidUsername } from "@/lib/reserved";

interface Props {
  user: {
    name: string;
    username: string | null;
    bio: string;
    avatar: string;
    website: string;
    location: string;
    studyProgram: string;
    semester: number;
  };
}

export default function EditProfileModal({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
      setOpen(false);
      const newUsername = form.username;
      if (newUsername && newUsername !== user.username) {
        router.push(`/${newUsername}`);
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
    <>
      <button
        id="edit-profile-trigger"
        onClick={() => setOpen(true)}
        className="hidden"
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-text">Edit Profile</h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-surface/20 hover:text-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                Study Program: {user.studyProgram} &middot; Semester {user.semester}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} size="sm" className="gap-2 text-xs">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
