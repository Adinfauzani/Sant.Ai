const reserved = new Set([
  "about",
  "account",
  "admin",
  "api",
  "articles",
  "community",
  "contact",
  "dashboard",
  "events",
  "intelligence",
  "legal",
  "login",
  "news",
  "privacy",
  "projects",
  "register",
  "research",
  "settings",
  "showcase",
  "terms",
]);

export function isReservedUsername(username: string): boolean {
  return reserved.has(username.toLowerCase());
}

export function isValidUsername(username: string): boolean {
  if (username.length < 2 || username.length > 30) return false;
  return /^[a-zA-Z0-9_-]+$/.test(username);
}

export function generateUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30) || `user-${Date.now().toString(36)}`;
}
