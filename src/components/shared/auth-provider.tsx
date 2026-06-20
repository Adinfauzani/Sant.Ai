"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getStorage, setStorage } from "@/lib/storage";
import type { ReactNode } from "react";

const SESSION_TIMEOUT = 60 * 60 * 1000;

function SessionTimeoutManager() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      setStorage("last-active", "");
      return;
    }

    const updateLastActive = () => {
      setStorage("last-active", String(Date.now()));
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, updateLastActive));

    const interval = window.setInterval(() => {
      const lastActive = Number(getStorage("last-active") || Date.now());

      if (Date.now() - lastActive >= SESSION_TIMEOUT) {
        setStorage("last-active", "");
        signOut({ redirect: false }).then(() => {
          toast.error("Sesi telah habis. Silakan login kembali.");
          router.push("/login");
        });
      }
    }, 60 * 1000);

    updateLastActive();

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateLastActive));
      window.clearInterval(interval);
    };
  }, [router, status]);

  return null;
}

function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAccepted(getStorage("cookie-consent") === "accepted");
  }, []);

  const accept = () => {
    setStorage("cookie-consent", "accepted");
    setAccepted(true);
  };

  if (!mounted || accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[80] rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl md:left-auto md:w-[420px]">
      <p className="text-sm font-semibold text-text">Cookie Notice</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Kami menggunakan cookie untuk menyimpan preferensi, sesi login, dan meningkatkan pengalaman penggunaan Sant.Ai.
        Baca{" "}
        <Link href="/legal/privacy" className="font-semibold text-primary hover:text-primary/80">Privacy Policy</Link>
        {" "}dan{" "}
        <Link href="/legal/terms" className="font-semibold text-primary hover:text-primary/80">Terms of Service</Link>.
      </p>
      <div className="mt-4 flex justify-end">
        <Button size="sm" className="h-9 px-4 text-xs" onClick={accept}>
          Terima
        </Button>
      </div>
    </div>
  );
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionTimeoutManager />
      <CookieConsent />
      {children}
    </SessionProvider>
  );
}
