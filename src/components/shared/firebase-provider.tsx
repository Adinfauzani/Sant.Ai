"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void getFirebaseAnalytics();
  }, []);

  return <>{children}</>;
}
