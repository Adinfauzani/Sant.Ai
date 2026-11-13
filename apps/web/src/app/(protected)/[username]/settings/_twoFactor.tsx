"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/authClient";
import { toast } from "sonner";
import { Shield, ShieldCheck, Copy, Check } from "lucide-react";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import { Button } from "@santai/ui/button";

interface Props {
  twoFactorEnabled: boolean;
  hasPassword: boolean;
}

export default function TwoFactorSection({ twoFactorEnabled, hasPassword }: Props) {
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGetTotpUri = async () => {
    setEnabling(true);
    try {
      const res = await authClient.twoFactor.getTotpUri({
        password: hasPassword ? "" : undefined,
      });
      if (res.error) {
        toast.error(res.error.message || "Gagal mendapatkan TOTP URI");
        setEnabling(false);
        return;
      }
      setTotpUri(res.data?.totpURI || null);
    } catch {
      toast.error("Gagal mengaktifkan two-factor authentication");
    } finally {
      setEnabling(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Kode harus 6 digit");
      return;
    }
    setVerifying(true);
    try {
      const res = await authClient.twoFactor.verifyTotp({ code: verificationCode });
      if (res.error) {
        toast.error(res.error.message || "Kode tidak valid");
        setVerifying(false);
        return;
      }

      const bc = await authClient.twoFactor.generateBackupCodes({
        password: hasPassword ? "" : undefined,
      });
      if (bc.data?.backupCodes) {
        setBackupCodes(bc.data.backupCodes);
      }
      toast.success("Two-factor authentication aktif");
    } catch {
      toast.error("Gagal memverifikasi kode");
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable = async () => {
    setDisabling(true);
    try {
      const res = await authClient.twoFactor.disable({
        password: hasPassword ? "" : undefined,
      });
      if (res.error) {
        toast.error(res.error.message || "Gagal menonaktifkan");
        setDisabling(false);
        return;
      }
      setTotpUri(null);
      setBackupCodes(null);
      toast.success("Two-factor authentication dinonaktifkan");
    } catch {
      toast.error("Gagal menonaktifkan two-factor authentication");
    } finally {
      setDisabling(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    const bc = await authClient.twoFactor.generateBackupCodes({
      password: hasPassword ? "" : undefined,
    });
    if (bc.data?.backupCodes) {
      setBackupCodes(bc.data.backupCodes);
    }
  };

  const copyBackupCodes = () => {
    if (!backupCodes) return;
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── 2FA enabled, already has backup codes ── */
  if (twoFactorEnabled && !totpUri) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success dark:text-success" />
            <div>
              <p className="text-xs font-medium text-text">Two-Factor Authentication</p>
              <p className="text-[11px] text-success dark:text-success">Aktif</p>
            </div>
          </div>
          <Button
            onClick={handleDisable}
            disabled={disabling}
            variant="ghost"
            size="sm"
            className="gap-2 text-[11px] text-destructive dark:text-destructive"
          >
            {disabling && <TwinOrbit className="size-3" />}
            Nonaktifkan
          </Button>
        </div>
        <Button onClick={handleGenerateBackupCodes} variant="ghost" size="sm" className="text-[11px]">
          Lihat kode cadangan
        </Button>
      </div>
    );
  }

  /* ── Show backup codes ── */
  if (backupCodes && !totpUri) {
    return (
      <div className="space-y-4">
        {twoFactorEnabled && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success dark:text-success" />
            <p className="text-xs font-medium text-text">Two-Factor Authentication Aktif</p>
          </div>
        )}
        <div className="rounded-lg border border-border bg-surface/10 p-3">
          <p className="mb-2 text-[11px] font-medium text-text">Kode Cadangan</p>
          <p className="mb-2 text-[10px] text-muted">
            Simpan kode-kode ini di tempat aman. Setiap kode bisa dipakai sekali untuk login kalau kamu kehilangan akses ke aplikasi authenticator-mu.
          </p>
          <div className="mb-3 grid grid-cols-2 gap-1 font-mono text-[11px] text-text">
            {backupCodes.map((code, i) => (
              <span key={i}>{code}</span>
            ))}
          </div>          <div className="flex gap-2">
            <Button onClick={copyBackupCodes} size="sm" variant="ghost" className="gap-2 text-[11px]">
              {copied ? <Check className="h-3 w-3 text-success dark:text-success" /> : <Copy className="h-3 w-3" />}
              {copied ? "Tersalin" : "Salin"}
            </Button>
            <Button onClick={() => setBackupCodes(null)} size="sm" variant="ghost" className="text-[11px]">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Setup step: scan QR + verify ── */
  if (totpUri) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted" />
          <p className="text-xs font-medium text-text">Atur Two-Factor Authentication</p>
        </div>
        <p className="text-[11px] text-muted">
          Pindai kode QR pakai aplikasi authenticator-mu, lalu masukkan kode 6 digit.
        </p>
        <div className="flex justify-center">
          <div className="rounded-lg border border-border bg-surface p-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpUri)}`}
              alt="Kode QR TOTP"
              className="h-48 w-48"
            />
          </div>
        </div>
        <div className="text-center">
          <span
            className="cursor-pointer text-[10px] text-muted underline"
            onClick={() => navigator.clipboard.writeText(totpUri)}
          >
            Salin kunci pengaturan
          </span>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text">Kode Verifikasi</label>
          <div className="flex gap-2">
            <input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="flex-1 rounded border border-border bg-surface/10 px-3 py-2 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              placeholder="000000"
              inputMode="numeric"
              autoFocus
            />
            <Button onClick={handleVerify} disabled={verifying} size="sm" className="gap-2 text-xs">
              {verifying && <TwinOrbit className="size-3" />}
              Verifikasi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Default: not enabled ── */
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted" />
        <div>
          <p className="text-xs font-medium text-text">Two-Factor Authentication</p>
          <p className="text-[11px] text-muted">Lapisan keamanan ekstra buat akunmu</p>
        </div>
      </div>
      <Button onClick={handleGetTotpUri} disabled={enabling} size="sm" className="gap-2 text-xs">
        {enabling && <TwinOrbit className="size-3" />}
        {enabling ? "Mengatur..." : "Aktifkan"}
      </Button>
    </div>
  );
}
