export interface CookieCategories {
  essential: boolean;
  analytics: boolean;
  performance: boolean;
  functional: boolean;
  aiPersonalization: boolean;
}

export type CookieCategory = keyof CookieCategories;

const STORAGE_KEY = "sant-ai:cookie-consent";

export const CATEGORY_LABELS: Record<CookieCategory, { label: string; description: string }> = {
  essential: {
    label: "Essential",
    description: "Required for the platform to function. Includes authentication, session management, and security.",
  },
  analytics: {
    label: "Analytics",
    description: "Help us understand how you use the platform so we can improve features and performance.",
  },
  performance: {
    label: "Performance",
    description: "Cache and load optimization data to provide a faster experience.",
  },
  functional: {
    label: "Functional",
    description: "Remember your preferences, settings, and personalized configurations.",
  },
  aiPersonalization: {
    label: "AI Personalization",
    description: "Enable AI features to learn from your activity and provide tailored recommendations.",
  },
};

export const DEFAULT_CATEGORIES: CookieCategories = {
  essential: true,
  analytics: false,
  performance: false,
  functional: false,
  aiPersonalization: false,
};

export function loadPreferences(): CookieCategories | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieCategories;
  } catch {
    return null;
  }
}

export function savePreferences(categories: CookieCategories): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function hasConsented(): boolean {
  return loadPreferences() !== null;
}

export function acceptAll(): CookieCategories {
  const categories: CookieCategories = {
    essential: true,
    analytics: true,
    performance: true,
    functional: true,
    aiPersonalization: true,
  };
  savePreferences(categories);
  return categories;
}

export function rejectNonEssential(): CookieCategories {
  savePreferences(DEFAULT_CATEGORIES);
  return { ...DEFAULT_CATEGORIES };
}
