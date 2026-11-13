"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getStorage, setStorage } from "@/lib/storage";
import type { ReactNode } from "react";

const SESSION_TIMEOUT = 60 * 60 * 1000;

function SessionTimeoutManager() {
  const router = useRouter();

  useEffect(() => {
    const updateLastActive = () => {
      setStorage("last-active", String(Date.now()));
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, updateLastActive));

    const interval = window.setInterval(() => {
      const lastActive = Number(getStorage("last-active") || Date.now());
      if (lastActive && Date.now() - lastActive >= SESSION_TIMEOUT) {
        setStorage("last-active", "");
        import("@/lib/auth/authClient").then(({ signOut }) => {
          signOut().then(() => {
            toast.error("Sesi telah habis. Silakan login kembali.");
            router.push("/login");
          });
        });
      }
    }, 60 * 1000);

    updateLastActive();

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateLastActive));
      window.clearInterval(interval);
    };
  }, [router]);

  return null;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionTimeoutManager />
      {children}
    </>
  );
}
