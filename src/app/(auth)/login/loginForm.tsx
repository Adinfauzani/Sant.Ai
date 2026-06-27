"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/authClient";
import { Github, Loader2, Mail } from "lucide-react";
import VerifyOTP from "@/components/shared/verifyOtp";

export default function LoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [mode, setMode] = useState<"password" | "otp" | "verify">("password");

  useEffect(() => {
    const user = session?.user as { username?: string; emailVerified?: boolean } | undefined;
    if (!user) return;
    if (user.emailVerified && user.username) {
      router.push(`/${user.username}`);
    }
  }, [session, router]);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await authClient.signIn.email({ email, password });
    if (err) {
      const status = (err as any)?.status;
      if (status === 403) {
        await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" } as any);
        setMode("verify");
        setLoading(false);
        return;
      }
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  async function handleSendOTP() {
    setLoading(true);
    setError("");
    const { error: err } = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
    if (err) { setError(err.message || "Failed to send OTP"); setLoading(false); return; }
    setLoading(false);
    setMode("verify");
  }

  async function handleOAuth(provider: string) {
    setOauthLoading(provider);
    await authClient.signIn.social({ provider: provider as "google" | "github" });
    setOauthLoading(null);
  }

  function handleVerified() {
    const username = (session?.user as { username?: string } | undefined)?.username;
    router.push(username ? `/${username}` : "/profile");
  }

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

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text">Masuk</h2>
              <p className="mt-2 text-sm text-muted">Masuk ke akun Sant.Ai Anda.</p>
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
              <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted">Atau lanjutkan dengan</span></div>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-md border border-border p-0.5 text-xs">
              <button type="button" onClick={() => { setMode("password"); setError(""); }}
                className={`flex-1 rounded px-3 py-1.5 font-medium transition-colors cursor-pointer ${mode === "password" ? "bg-text text-background" : "text-muted hover:text-text"}`}>
                Sandi
              </button>
              <button type="button" onClick={() => { setMode("otp"); setError(""); }}
                className={`flex-1 rounded px-3 py-1.5 font-medium transition-colors cursor-pointer ${mode === "otp" || mode === "verify" ? "bg-text text-background" : "text-muted hover:text-text"}`}>
                <Mail className="mr-1 inline h-3 w-3" />
                OTP
              </button>
            </div>

            {/* Password mode */}
            {mode === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-text">Alamat email</label>
                  <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label htmlFor="login-pass" className="block text-sm font-medium text-text">Kata sandi</label>
                  <input id="login-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-text accent-text" />
                    <span className="text-xs text-muted">Ingatlah aku</span>
                  </label>
                  <Link href="/forgot-password" className="text-xs font-medium text-text hover:underline">Lupa kata sandi?</Link>
                </div>
                {error && <div className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2"><p className="text-xs text-red-500">{error}</p></div>}
                <button type="submit" disabled={loading || !remember}
                  className="flex w-full items-center justify-center rounded-md bg-text px-4 py-2.5 text-sm font-semibold text-background shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
                  {loading ? "Memasuki..." : "Masuk"}
                </button>
              </form>
            )}

            {/* OTP mode */}
            {mode === "otp" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="otp-email" className="block text-sm font-medium text-text">Alamat email</label>
                  <input id="otp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                {error && <div className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2"><p className="text-xs text-red-500">{error}</p></div>}
                <button onClick={handleSendOTP} disabled={loading || !email}
                  className="flex w-full items-center justify-center rounded-md bg-text px-4 py-2.5 text-sm font-semibold text-background shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
                  {loading ? "Mengirim..." : "Kirim OTP"}
                </button>
                <p className="text-center text-xs text-muted">Pengguna baru akan terdaftar secara otomatis.</p>
              </div>
            )}

            {/* Verify mode */}
            {mode === "verify" && (
              <VerifyOTP email={email} onVerified={handleVerified} type={session ? "email-verification" : "sign-in"} />
            )}

            <p className="text-center text-xs text-muted">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-text hover:underline">Daftar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
