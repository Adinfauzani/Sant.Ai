"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/" })}
      className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-[11px] text-red-500 transition-colors hover:bg-red-500/10"
    >
      <LogOut className="h-3 w-3" />
      Logout
    </button>
  );
}
