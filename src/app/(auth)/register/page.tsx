"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Github, Mail, Loader2, Check, X, ChevronLeft,
  ArrowRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthBranding } from "@/components/auth/auth-branding";
import { registerUser } from "@/lib/actions";

/* ─── Study programs ────────────────────────────────── */
const studyPrograms = [
  { value: "SD", label: "Sains Data (SD)" },
  { value: "TI", label: "Teknik Informatika (TI)" },
  { value: "SI", label: "Sistem Informasi (SI)" },
];

/* ─── Password rules ────────────────────────────────── */
const rules = [
  { label: "Minimum 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

/* ─── Success Modal ─────────────────────────────────── */
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md rounded-[24px] border border-border/50 bg-surface/90 p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/20">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-bold text-text">
          Welcome to SANTET
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your account is ready. Start collaborating, building projects, and
          contributing to the Sains &amp; Technology ecosystem.
        </p>
        <div className="mt-3 flex justify-center gap-1.5">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] text-blue-400">SD</span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">TI</span>
          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] text-purple-400">SI</span>
        </div>
        <Button className="mt-6 w-full gap-2" onClick={onClose}>
          Go To Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Register Page ─────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studyProgram, setStudyProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const passwordErrors = useMemo(
    () => rules.map((r) => ({ label: r.label, pass: r.test(password) })),
    [password],
  );
  const passwordOk = passwordErrors.every((r) => r.pass);
  const confirmOk = confirm.length === 0 || password === confirm;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passwordOk || !agreed) return;

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.set("name", name);
      form.set("email", email);
      form.set("studyProgram", studyProgram);
      form.set("semester", semester);
      form.set("password", password);

      await registerUser(form);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function handleOAuth(provider: string) {
    setOauthLoading(provider);
    await signIn(provider, { redirectTo: "/profile/me" });
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile branding */}
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

      {/* Left: Branding */}
      <div className="hidden w-full border-r border-border bg-surface/30 lg:flex lg:w-1/2">
        <AuthBranding />
      </div>

      {/* Right: Register card */}
      <div className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-[24px] border border-border/50 bg-surface/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-text">
                Create Account
              </h1>
              <p className="mt-1 text-sm text-muted">
                Join the Sains &amp; Technology ecosystem.
              </p>
            </div>

            {/* OAuth */}
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
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-text">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                />
              </div>

              {/* Email */}
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

              {/* Study Program + Semester */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="studyProgram" className="block text-xs font-medium text-text">
                    Study Program
                  </label>
                  <select
                    id="studyProgram"
                    value={studyProgram}
                    onChange={(e) => setStudyProgram(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-all duration-200 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                  >
                    <option value="">Select</option>
                    {studyPrograms.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="semester" className="block text-xs font-medium text-text">
                    Semester
                  </label>
                  <input
                    id="semester"
                    type="number"
                    min={1}
                    max={14}
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                    placeholder="1"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-text">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a strong password"
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

                {/* Password rules */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 space-y-1"
                  >
                    {passwordErrors.map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center gap-1.5 text-[11px]"
                      >
                        {r.pass ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <X className="h-3 w-3 text-muted" />
                        )}
                        <span className={r.pass ? "text-emerald-400" : "text-muted"}>
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-text">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                />
                {confirm.length > 0 && !confirmOk && (
                  <p className="mt-1 text-[11px] text-red-400">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Agreement */}
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border bg-background text-primary accent-primary"
                />
                <span className="text-[11px] leading-relaxed text-muted">
                  I agree to the SANTET{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Community Guidelines
                  </Link>
                  ,{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  , and Academic Collaboration Policy.
                </span>
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
                disabled={loading || !passwordOk || !agreed}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition-colors hover:text-accent"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {success && (
          <SuccessModal
            onClose={() => {
              setSuccess(false);
              router.push("/profile/me");
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
