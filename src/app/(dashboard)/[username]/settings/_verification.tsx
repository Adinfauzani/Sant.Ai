"use client";

import { useState } from "react";
import { BadgeCheck, Mail, Loader2, AlertCircle, Pencil } from "lucide-react";
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
        toast.error(data.error || "Failed to send verification email");
        return;
      }
      toast.success("Verification email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send verification email");
    } finally {
      setSending(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Enter a valid email address");
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
        toast.error(data.error || "Failed to change email");
        return;
      }
      toast.success("Verification sent to new email. Check your inbox.");
      setNewEmail("");
      setChangingEmail(false);
    } catch {
      toast.error("Failed to change email");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {emailVerified ? (
          <BadgeCheck className="h-4 w-4 text-emerald-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        )}
        <h2 className="text-sm font-semibold text-text">Email Verification</h2>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text">{email}</p>
          <p className={cn("text-[11px]", emailVerified ? "text-emerald-500" : "text-amber-500")}>
            {emailVerified ? "Verified" : "Not verified"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChangingEmail(!changingEmail)}
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[11px] text-text transition-colors hover:bg-surface"
          >
            <Pencil className="h-3 w-3" />
            Change
          </button>
          {!emailVerified && (
            <button
              onClick={handleResend}
              disabled={sending}
              className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[11px] text-text transition-colors hover:bg-surface disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Mail className="h-3 w-3" />
              )}
              Resend
            </button>
          )}
        </div>
      </div>

      {changingEmail && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[10px] text-muted">New email address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@email.com"
                className="w-full rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50"
              />
            </div>
            <button
              onClick={handleChangeEmail}
              disabled={emailLoading}
              className="flex items-center gap-1.5 rounded border border-text bg-text px-3 py-2 text-[11px] font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {emailLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
