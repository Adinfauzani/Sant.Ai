import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { env } from "@/env";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  analyticsPromise ??= isSupported().then((supported) =>
    supported ? getAnalytics(firebaseApp) : null,
  );

  return analyticsPromise;
}
