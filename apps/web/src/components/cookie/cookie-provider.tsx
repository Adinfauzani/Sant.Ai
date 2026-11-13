"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { CookieCategories } from "@/lib/consent/cookies";
import {
  loadPreferences,
  savePreferences,
  acceptAll as doAcceptAll,
  rejectNonEssential as doRejectNonEssential,
  DEFAULT_CATEGORIES,
} from "@/lib/consent/cookies";

interface CookieContextValue {
  preferences: CookieCategories;
  showBanner: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  saveCustom: (categories: CookieCategories) => void;
  openPreferences: () => void;
  isPreferencesOpen: boolean;
  setPreferencesOpen: (open: boolean) => void;
}

const NOOP = () => {};

const DEFAULT_VALUE: CookieContextValue = {
  preferences: DEFAULT_CATEGORIES,
  showBanner: false,
  acceptAll: NOOP,
  rejectNonEssential: NOOP,
  saveCustom: NOOP,
  openPreferences: NOOP,
  isPreferencesOpen: false,
  setPreferencesOpen: NOOP,
};

const CookieContext = createContext<CookieContextValue>(DEFAULT_VALUE);

export function CookieProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<CookieCategories>(DEFAULT_CATEGORIES);
  const [showBanner, setShowBanner] = useState(false);
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const saved = loadPreferences();
    if (saved) {
      setPreferences(saved);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const cats = doAcceptAll();
    setPreferences(cats);
    setShowBanner(false);
  }, []);

  const rejectNonEssential = useCallback(() => {
    const cats = doRejectNonEssential();
    setPreferences(cats);
    setShowBanner(false);
  }, []);

  const saveCustom = useCallback((categories: CookieCategories) => {
    savePreferences(categories);
    setPreferences(categories);
    setShowBanner(false);
    setPreferencesOpen(false);
  }, []);

  return (
    <CookieContext.Provider
      value={{
        preferences,
        showBanner,
        acceptAll,
        rejectNonEssential,
        saveCustom,
        openPreferences: () => setPreferencesOpen(true),
        isPreferencesOpen,
        setPreferencesOpen,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieConsent() {
  return useContext(CookieContext);
}
