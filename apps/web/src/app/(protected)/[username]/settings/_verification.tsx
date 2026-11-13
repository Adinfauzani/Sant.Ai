"use client";

import { useState } from "react";
import { BadgeCheck, Mail, AlertCircle, Pencil } from "lucide-react";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  emailVerified: boolean;
  email: string;
}

export default function VerificationSection({ emailVerified, email }: Props) {
  const [sending, setSending] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Gagal mengirim email verifikasi");
        return;
      }
      toast.success("Email verifikasi terkirim! Cek kotak masukmu.");
    } catch {
      toast.error("Gagal mengirim email verifikasi");
    } finally {
      setSending(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Masukkan alamat email yang valid");
      return;
    }
    setEmailLoading(true);
    try {
      const res = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Gagal mengganti email");
        return;
      }
      toast.success("Verifikasi terkirim ke email baru. Cek kotak masukmu.");
      setNewEmail("");
      setChangingEmail(false);
    } catch {
      toast.error("Gagal mengganti email");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {emailVerified ? (
          <BadgeCheck className="h-4 w-4 text-success" />
        ) : (
          <AlertCircle className="h-4 w-4 text-warning" />
        )}
        <h2 className="text-sm font-semibold text-text">Verifikasi Email</h2>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text">{email}</p>
          <p className={cn("text-[11px]", emailVerified ? "text-success" : "text-warning")}>
            {emailVerified ? "Terverifikasi" : "Belum terverifikasi"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChangingEmail(!changingEmail)}
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[11px] text-text transition-colors hover:bg-surface"
          >
            <Pencil className="h-3 w-3" />
            Ubah
          </button>
          {!emailVerified && (
            <button
              onClick={handleResend}
              disabled={sending}
              className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[11px] text-text transition-colors hover:bg-surface disabled:opacity-50"
            >
              {sending ? (
                <TwinOrbit className="size-3" />
              ) : (
                <Mail className="h-3 w-3" />
              )}
              Kirim ulang
            </button>
          )}
        </div>
      </div>

      {changingEmail && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[10px] text-muted">Alamat email baru</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@email.com"
                className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted"
              />
            </div>
            <button
              onClick={handleChangeEmail}
              disabled={emailLoading}
              className="flex items-center gap-1.5 rounded border border-text bg-text px-3 py-2 text-[11px] font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {emailLoading ? <TwinOrbit className="size-3" /> : "Kirim"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
