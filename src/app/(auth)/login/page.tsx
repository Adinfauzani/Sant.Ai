"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Github, Mail, Loader2, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthBranding } from "@/components/auth/auth-branding";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleOAuth(provider: string) {
    setOauthLoading(provider);
    await signIn(provider, { redirectTo: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* ── Mobile branding toggle ── */}
      <details className="group border-b border-border lg:hidden">
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-muted transition-colors hover:text-text">
          <span className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="text-[10px] font-bold text-white">S</span>
            </div>
            <span className="font-heading text-sm font-bold text-text">SANTET</span>
          </span>
          <ChevronLeft className="h-4 w-4 transition-transform group-open:-rotate-90" />
        </summary>
        <div className="border-t border-border bg-surface/50">
          <AuthBranding />
        </div>
      </details>

      {/* ── Left: Branding (desktop) ── */}
      <div className="hidden w-full border-r border-border bg-surface/30 lg:flex lg:w-1/2">
        <AuthBranding />
      </div>

      {/* ── Right: Auth card ── */}
      <div className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-[24px] border border-border/50 bg-surface/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-text">
                Welcome Back
              </h1>
              <p className="mt-1 text-sm text-muted">
                Continue your journey in the Sains &amp; Technology ecosystem.
              </p>
            </div>

            {/* OAuth buttons */}
            <div className="mt-6 space-y-2.5">
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2.5"
                disabled={oauthLoading !== null}
                onClick={() => handleOAuth("github")}
              >
                {oauthLoading === "github" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                Continue with GitHub
              </Button>
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2.5"
                disabled={oauthLoading !== null}
                onClick={() => handleOAuth("google")}
              >
                {oauthLoading === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Continue with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface/70 px-3 text-muted">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-text">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@univ.ac.id"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-medium text-text">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[11px] text-muted transition-colors hover:text-text"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-10 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-text"
                    tabIndex={-1}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-primary accent-primary"
                />
                <span className="text-xs text-muted">Remember me</span>
              </label>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary transition-colors hover:text-accent"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
