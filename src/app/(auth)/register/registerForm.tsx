"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/authClient";
import { Github, Loader2, Check, X } from "lucide-react";
import { isValidUsername, isReservedUsername } from "@/lib/reserved";
import { cn } from "@/lib/utils";
import VerifyOTP from "@/components/shared/verifyOtp";

const studyPrograms = [
  { value: "SD", label: "Sains Data" },
  { value: "TI", label: "Teknik Informatika" },
  { value: "SI", label: "Sistem Informasi" },
];

const passwordRules = [
  { label: "min 8 characters", test: (v: string) => v.length >= 8 },
  { label: "uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "number", test: (v: string) => /[0-9]/.test(v) },
  { label: "special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
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

  const [profile, setProfile] = useState({ username: "", studyProgram: "TI", semester: "1" });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const passwordErrors = useMemo(() => passwordRules.map((r) => ({ label: r.label, pass: r.test(password) })), [password]);
  const passwordOk = passwordErrors.every((r) => r.pass);
  const confirmOk = confirm.length === 0 || password === confirm;

  // redirect returning users / show profile step for new OAuth users
  useEffect(() => {
    const u = (session?.user as { username?: string } | undefined)?.username;
    if (!u || step !== "oauth") return;
    if (/-[a-z0-9]{6}$/.test(u)) {
      setProfile((f) => ({ ...f, username: u }));
      setStep("profile");
    } else {
      router.push(`/${u}`);
    }
  }, [session, step, router]);

  // username availability check
  useEffect(() => {
    const u = profile.username;
    if (!u || !session?.user) { setUsernameAvailable(null); setCheckingUsername(false); return; }
    const same = u === (session.user as any).username;
    if (same || !isValidUsername(u) || isReservedUsername(u)) { setUsernameAvailable(same ? null : false); setCheckingUsername(false); return; }
    setCheckingUsername(true);
    const t = setTimeout(async () => {
      const res = await fetch("/api/auth/is-username-available", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: u }) });
      const data = await res.json();
      setUsernameAvailable(data?.data?.available ?? data?.available ?? false);
      setCheckingUsername(false);
    }, 400);
    return () => clearTimeout(t);
  }, [profile.username, session]);

  async function handleOAuth(provider: string) {
    setOauthLoading(provider);
    await authClient.signIn.social({ provider: provider as "google" | "github" });
    setOauthLoading(null);
  }

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordOk || !agree) return;
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setSaving(true);
    setError("");

    const { error: err } = await authClient.signUp.email({
      name, email, password,
      username: autoUsername(name),
      studyProgram: "TI",
      semester: 1,
    } as any);

    setSaving(false);
    if (err) { setError(err.message || "Registration failed"); return; }
    setStep("otp");
  }

  function handleVerified() {
    setStep("profile");
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUsername(profile.username)) { setError("Username 2-30 chars, letters/numbers/hyphens/underscores only."); return; }
    if (usernameAvailable === false) { setError("Username is already taken."); return; }
    setSaving(true); setError("");

    const { error: err } = await authClient.updateUser({
      username: profile.username,
      studyProgram: profile.studyProgram,
      semester: parseInt(profile.semester) || 1,
    } as any);

    if (err) { setError(err.message || "Failed to save profile"); setSaving(false); return; }
    router.push(`/${profile.username}`);
  }

  const usernameTaken = profile.username !== (session?.user as any)?.username && usernameAvailable === false;
  const usernameOk = profile.username !== (session?.user as any)?.username && usernameAvailable === true;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop: left panel branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-600/15 via-transparent to-transparent" />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-white">S</div>
            <span className="text-lg font-bold text-white">Sant<span className="text-primary">.Ai</span></span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium text-white">
              &ldquo;Tim yang solid bukan tentang individu terbaik, tapi tentang bagaimana keahlian yang berbeda bisa saling melengkapi untuk menciptakan sesuatu yang lebih besar.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">— Sant.Ai, Ekosistem Kolaborasi</footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-white">S</div>
            <span className="text-lg font-bold text-text">Sant<span className="text-primary">.Ai</span></span>
          </Link>

          {step === "oauth" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-text">Create your account</h2>
                <p className="mt-2 text-sm text-muted">Choose your preferred way to join.</p>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleOAuth("github")} disabled={oauthLoading !== null}
                  className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium text-text shadow-sm hover:bg-surface transition-colors disabled:opacity-50 cursor-pointer">
                  {oauthLoading === "github" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                  GitHub
                </button>
                <button onClick={() => handleOAuth("google")} disabled={oauthLoading !== null}
                  className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium text-text shadow-sm hover:bg-surface transition-colors disabled:opacity-50 cursor-pointer">
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted">or</span></div>
              </div>

              {/* Email/Password form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text">Full name</label>
                  <input id="name" value={name} onChange={(e) => setName(e.target.value)} required
                    className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text">Password</label>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  {password.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {passwordErrors.map((r) => (
                        <li key={r.label} className={cn("text-xs", r.pass ? "text-emerald-500" : "text-muted")}>{r.pass ? "✓" : "○"} {r.label}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-text">Confirm password</label>
                  <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                    className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  {confirm.length > 0 && !confirmOk && <p className="mt-1 text-xs text-red-500">Passwords do not match</p>}
                </div>

                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-text accent-text" />
                  <span className="text-xs text-muted leading-tight">I agree to the <Link href="/legal/terms" className="font-medium text-text hover:underline">Terms</Link> and <Link href="/legal/guidelines" className="font-medium text-text hover:underline">Guidelines</Link>.</span>
                </label>

                {error && <div className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2"><p className="text-xs text-red-500">{error}</p></div>}

                <button type="submit" disabled={saving || !passwordOk || !agree}
                  className="flex w-full items-center justify-center rounded-md bg-text px-4 py-2.5 text-sm font-semibold text-background shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                </button>
              </form>

              <p className="text-center text-xs text-muted">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-text hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {step === "otp" && (
            <VerifyOTP email={email} onVerified={handleVerified} type="email-verification" />
          )}

          {step === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-text">Complete your profile</h2>
                <p className="mt-2 text-sm text-muted">Choose a username and tell us your program.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text">Username</label>
                  <div className="relative mt-1">
                    <input id="username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} required placeholder="your-username"
                      className={cn("block w-full rounded-md border px-3 py-2 pr-8 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20", usernameTaken ? "border-red-500" : usernameOk ? "border-emerald-500" : "border-border")} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingUsername ? <Loader2 className="h-4 w-4 animate-spin text-muted" /> : usernameTaken ? <X className="h-4 w-4 text-red-500" /> : usernameOk ? <Check className="h-4 w-4 text-emerald-500" /> : null}
                    </span>
                  </div>
                  {usernameTaken && <p className="mt-1 text-xs text-red-500">Username is already taken</p>}
                  {usernameOk && <p className="mt-1 text-xs text-emerald-500">Username is available</p>}
                </div>

                <div>
                  <label htmlFor="sp" className="block text-sm font-medium text-text">Program</label>
                  <select id="sp" value={profile.studyProgram} onChange={(e) => setProfile({ ...profile, studyProgram: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Pick</option>
                    {studyPrograms.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sem" className="block text-sm font-medium text-text">Semester</label>
                  <input id="sem" type="number" min={1} max={14} value={profile.semester} onChange={(e) => setProfile({ ...profile, semester: e.target.value })} required
                    className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                {error && <div className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2"><p className="text-xs text-red-500">{error}</p></div>}

                <button type="submit" disabled={saving || !isValidUsername(profile.username) || usernameAvailable === false}
                  className="flex w-full items-center justify-center rounded-md bg-text px-4 py-2.5 text-sm font-semibold text-background shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
