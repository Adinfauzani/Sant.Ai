"use client";

import { signOut } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/");
      }}
      className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-[11px] text-red-500 transition-colors hover:bg-red-500/10"
    >
      <LogOut className="h-3 w-3" />
      Logout
    </button>
  );
}
