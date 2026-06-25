"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Link2, Link2Off, Loader2, Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  linkedProviders: string[];
  hasPassword: boolean;
  allMethods: string[];
  username: string | null | undefined;
}

const providerMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  google: { label: "Google", icon: Mail, color: "text-blue-500" },
  github: { label: "GitHub", icon: Github, color: "text-text" },
  credentials: { label: "Password", icon: Mail, color: "text-emerald-500" },
};

export default function LinkedAccountsSection({ linkedProviders, hasPassword, allMethods, username }: Props) {
  const router = useRouter();
  const [linking, setLinking] = useState<string | null>(null);
  const [unlinking, setUnlinking] = useState<string | null>(null);

  const handleLink = async (provider: string) => {
    setLinking(provider);
    try {
      const res = await fetch(`/api/account/link/${provider}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to link");
        setLinking(null);
        return;
      }
      await signIn(provider, { redirectTo: `/${username || "settings"}` });
    } catch {
      toast.error("Failed to link account");
      setLinking(null);
    }
  };

  const handleUnlink = async (provider: string) => {
    setUnlinking(provider);
    try {
      const res = await fetch(`/api/account/unlink/${provider}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to unlink");
        setUnlinking(null);
        return;
      }
      toast.success(`${providerMeta[provider]?.label || provider} disconnected`);
      router.refresh();
    } catch {
      toast.error("Failed to unlink account");
    } finally {
      setUnlinking(null);
    }
  };

  const providers = ["google", "github", "credentials"] as const;

  return (
    <section className="rounded-lg border border-border bg-surface/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Link2 className="h-4 w-4 text-muted" />
        <h2 className="text-sm font-semibold text-text">Linked Accounts</h2>
      </div>
      <p className="mb-4 text-[11px] text-muted">
        Connect your Google or GitHub accounts for easy sign-in.
      </p>

      <div className="space-y-2">
        {providers.map((provider) => {
          const meta = providerMeta[provider];
          const isLinked = linkedProviders.includes(provider) || (provider === "credentials" && hasPassword);
          const isLoading = linking === provider || unlinking === provider;
          const canUnlink = provider !== "credentials" && isLinked && allMethods.length > 1;

          return (
            <div
              key={provider}
              className="flex items-center justify-between rounded-lg border border-border bg-surface/10 px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded", isLinked ? "bg-primary/10" : "bg-surface/20")}>
                  <meta.icon className={cn("h-3.5 w-3.5", meta.color)} />
                </div>
                <div>
                  <p className="text-xs font-medium text-text">{meta.label}</p>
                  <p className="text-[10px] text-muted">
                    {isLinked ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>

              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />
              ) : isLinked ? (
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {canUnlink && (
                    <button
                      onClick={() => handleUnlink(provider)}
                      className="ml-2 rounded px-2 py-1 text-[10px] text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <Link2Off className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : provider !== "credentials" ? (
                <button
                  onClick={() => handleLink(provider)}
                  className="rounded border border-border px-2.5 py-1 text-[10px] text-text transition-colors hover:bg-surface"
                >
                  Connect
                </button>
              ) : (
                <span className="text-[10px] text-muted">Set password</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
