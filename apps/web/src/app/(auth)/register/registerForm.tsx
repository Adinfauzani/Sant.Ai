"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth/authClient";
import { Github, Check, X } from "lucide-react";
import { Button } from "@santai/ui/button";
import { Input } from "@santai/ui/input";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import { isValidUsername, isReservedUsername } from "@/lib/reserved";
import { cn } from "@/lib/utils";
import VerifyOTP from "@/components/shared/verifyOtp";

const studyPrograms = [
  { value: "SD", label: "Sains Data" },
  { value: "TI", label: "Teknik Informatika" },
  { value: "SI", label: "Sistem Informasi" },
];

const passwordRules = [
  { label: "minimal 8 karakter", test: (v: string) => v.length >= 8 },
  { label: "huruf besar", test: (v: string) => /[A-Z]/.test(v) },
  { label: "huruf kecil", test: (v: string) => /[a-z]/.test(v) },
  { label: "angka", test: (v: string) => /[0-9]/.test(v) },
  { label: "karakter khusus", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function autoUsername(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);
  return `${base}-${Math.random().toString(36).substring(2, 8)}`;
}

export default function RegisterForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [step, setStep] = useState<"oauth" | "otp" | "profile">("oauth");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [profile, setProfile] = useState({
    username: "",
    studyProgram: "TI",
    semester: "1",
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const passwordErrors = useMemo(
    () => passwordRules.map((r) => ({ label: r.label, pass: r.test(password) })),
    [password],
  );
  const passwordOk = passwordErrors.every((r) => r.pass);
  const confirmOk = confirm.length === 0 || password === confirm;

  // redirect returning users / show profile step for new OAuth users
  useEffect(() => {
    const u = (session?.user as { username?: string } | undefined)?.username;
    if (!u || step !== "oauth") return;
    if (/-[a-z0-9]{4}$/.test(u)) {
      setProfile((f) => ({ ...f, username: u }));
      setStep("profile");
    } else {
      router.push(`/${u}`);
    }
  }, [session, step, router]);

  // username availability check
  useEffect(() => {
    const u = profile.username;
    if (!u || !session?.user) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
      return;
    }
    const same = u === (session.user as any).username;
    if (same || !isValidUsername(u) || isReservedUsername(u)) {
      setUsernameAvailable(same ? null : false);
      setCheckingUsername(false);
      return;
    }
    setCheckingUsername(true);
    const t = setTimeout(async () => {
      const res = await fetch("/api/auth/is-username-available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });
      const data = await res.json();
      setUsernameAvailable(data?.data?.available ?? data?.available ?? false);
      setCheckingUsername(false);
    }, 400);
    return () => clearTimeout(t);
  }, [profile.username, session]);

  async function handleOAuth(provider: string) {
    setOauthLoading(provider);
    setError("");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await authClient.signIn.social({
      provider: provider as "google" | "github",
      callbackURL: `${origin}/profile`,
      errorCallbackURL: `${origin}/register`,
    });
    if (error) {
      setError(error.message || "Gagal mendaftar dengan akun tersebut");
      setOauthLoading(null);
    }
  }

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordOk || !agree) return;
    if (password !== confirm) {
      setError("Kata sandi tidak sama");
      return;
    }
    setSaving(true);
    setError("");

    const { error: err } = await authClient.signUp.email({
      name,
      email,
      password,
      username: autoUsername(name),
      studyProgram: "TI",
      semester: 1,
    } as any);

    setSaving(false);
    if (err) {
      setError(err.message || "Pendaftaran gagal");
      return;
    }
    setStep("otp");
  }

  async function handleVerified() {
    // OTP email-verification hanya memverifikasi email — login agar sesi dibuat.
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      setError(error.message || "Gagal masuk setelah verifikasi. Silakan coba masuk.");
      setStep("oauth");
      return;
    }
    setStep("profile");
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUsername(profile.username)) {
      setError("Username 2-30 karakter, hanya huruf/angka/strip/underscore.");
      return;
    }
    if (usernameAvailable === false) {
      setError("Username sudah dipakai.");
      return;
    }
    setSaving(true);
    setError("");

    const { error: err } = await authClient.updateUser({
      username: profile.username,
      studyProgram: profile.studyProgram,
      semester: parseInt(profile.semester) || 1,
    } as any);

    if (err) {
      setError(err.message || "Gagal menyimpan profil");
      setSaving(false);
      return;
    }
    router.push(`/${profile.username}`);
  }

  const usernameTaken =
    profile.username !== (session?.user as any)?.username && usernameAvailable === false;
  const usernameOk =
    profile.username !== (session?.user as any)?.username && usernameAvailable === true;

  const errorBox = (
    <div
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2"
    >
      <p className="text-xs text-destructive">{error}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop: left panel branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-border bg-surface p-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/12 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-brand/12 via-transparent to-transparent" />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">
              S
            </div>
            <span className="text-lg font-bold text-text">
              Sant<span className="text-primary">.Ai</span>
            </span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium text-text">
              &ldquo;Tim yang solid bukan tentang individu terbaik, tapi tentang bagaimana
              keahlian yang berbeda bisa saling melengkapi untuk menciptakan sesuatu yang
              lebih besar.&rdquo;
            </p>
            <footer className="text-sm text-muted">
              — Sant.Ai, Ekosistem Kolaborasi
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">
              S
            </div>
            <span className="text-lg font-bold text-text">
              Sant<span className="text-primary">.Ai</span>
            </span>
          </Link>

          {step === "oauth" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-text">
                  Buat akun kamu
                </h2>
                <p className="mt-2 text-sm text-muted">Pilih cara join yang kamu sukai.</p>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuth("github")}
                  disabled={oauthLoading !== null}
                  className="flex items-center justify-center gap-2 rounded-md border border-input bg-card px-3 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  {oauthLoading === "github" ? (
                    <TwinOrbit className="size-4" />
                  ) : (
                    <Github className="size-4" />
                  )}
                  GitHub
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  disabled={oauthLoading !== null}
                  className="flex items-center justify-center gap-2 rounded-md border border-input bg-card px-3 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  {oauthLoading === "google" ? (
                    <TwinOrbit className="size-4" />
                  ) : (
                    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Google
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted">atau</span>
                </div>
              </div>

              {/* Email/Password form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text">
                    Nama lengkap
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="mt-1 h-10"
                    placeholder="Nama lengkap kamu"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="mt-1 h-10"
                    placeholder="nama@kampus.id"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text">
                    Kata sandi
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="mt-1 h-10"
                    placeholder="••••••••"
                  />
                  {password.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {passwordErrors.map((r) => (
                        <li
                          key={r.label}
                          className={cn("text-xs", r.pass ? "text-success" : "text-muted")}
                        >
                          {r.pass ? "✓" : "○"} {r.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-text">
                    Ulangi kata sandi
                  </label>
                  <Input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="mt-1 h-10"
                    placeholder="••••••••"
                  />
                  {confirm.length > 0 && !confirmOk && (
                    <p className="mt-1 text-xs text-destructive">Kata sandi tidak sama</p>
                  )}
                </div>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-border accent-primary"
                  />
                  <span className="text-xs leading-tight text-muted">
                    Saya setuju dengan{" "}
                    <Link
                      href="/legal/terms"
                      className="font-medium text-text transition-colors hover:text-primary"
                    >
                      Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link
                      href="/legal/guidelines"
                      className="font-medium text-text transition-colors hover:text-primary"
                    >
                      Panduan Komunitas
                    </Link>
                    .
                  </span>
                </label>

                {error && errorBox}

                <Button
                  type="submit"
                  disabled={saving || !passwordOk || !agree}
                  className="w-full"
                >
                  {saving ? <TwinOrbit className="size-4" /> : "Buat akun"}
                </Button>
              </form>

              <p className="text-center text-xs text-muted">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-semibold text-text hover:text-primary">
                  Masuk
                </Link>
              </p>
            </div>
          )}

          {step === "otp" && (
            <VerifyOTP
              email={email}
              onVerified={handleVerified}
              type="email-verification"
            />
          )}

          {step === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-text">
                  Lengkapi profilmu
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Pilih username dan program studimu.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text">
                    Username
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) =>
                        setProfile({ ...profile, username: e.target.value })
                      }
                      required
                      placeholder="username-kamu"
                      className={cn(
                        "h-10 pr-8",
                        usernameTaken
                          ? "border-destructive"
                          : usernameOk
                            ? "border-success"
                            : "",
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingUsername ? (
                        <TwinOrbit className="size-4 text-muted" />
                      ) : usernameTaken ? (
                        <X className="size-4 text-destructive" />
                      ) : usernameOk ? (
                        <Check className="size-4 text-success" />
                      ) : null}
                    </span>
                  </div>
                  {usernameTaken && (
                    <p className="mt-1 text-xs text-destructive">Username sudah dipakai</p>
                  )}
                  {usernameOk && (
                    <p className="mt-1 text-xs text-success">Username tersedia</p>
                  )}
                </div>

                <div>
                  <label htmlFor="sp" className="block text-sm font-medium text-text">
                    Program studi
                  </label>
                  <select
                    id="sp"
                    value={profile.studyProgram}
                    onChange={(e) =>
                      setProfile({ ...profile, studyProgram: e.target.value })
                    }
                    className="mt-1 block h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Pilih</option>
                    {studyPrograms.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sem" className="block text-sm font-medium text-text">
                    Semester
                  </label>
                  <Input
                    id="sem"
                    type="number"
                    min={1}
                    max={14}
                    value={profile.semester}
                    onChange={(e) =>
                      setProfile({ ...profile, semester: e.target.value })
                    }
                    required
                    className="mt-1 h-10"
                  />
                </div>

                {error && errorBox}

                <Button
                  type="submit"
                  disabled={
                    saving || !isValidUsername(profile.username) || usernameAvailable === false
                  }
                  className="w-full"
                >
                  {saving ? <TwinOrbit className="size-4" /> : "Lanjutkan"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
