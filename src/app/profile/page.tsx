"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function ProfileRedirect() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    const u = (session?.user as { username?: string } | undefined)?.username;
    if (!u) {
      router.push("/login");
    } else {
      router.push(`/${u}`);
    }
  }, [isPending, session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted">Redirecting...</p>
    </div>
  );
}
