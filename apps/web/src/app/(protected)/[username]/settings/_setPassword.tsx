"use client";

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import { Button } from "@santai/ui/button";

export default function SetPasswordForm() {
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password tidak sama");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/account/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Gagal menyetel password");
        return;
      }
      toast.success("Password berhasil disimpan");
      setShowForm(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Gagal menyetel password");
    } finally {
      setSaving(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface/10 px-3 py-2.5 text-xs text-text transition-colors hover:bg-surface"
      >
        <KeyRound className="h-3.5 w-3.5" />
        Atur Password
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-text">Password Baru</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted"
          placeholder="Min. 8 karakter"
          autoFocus
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text">Konfirmasi Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted"
          placeholder="Ulangi password"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving} size="sm" className="gap-2 text-xs">
          {saving && <TwinOrbit className="size-3" />}
          {saving ? "Menyimpan..." : "Simpan Password"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => { setShowForm(false); setNewPassword(""); setConfirmPassword(""); }}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
