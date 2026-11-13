import { createAuth } from "@santai/shared";
import type { AuthUser, AuthSession } from "@santai/shared";
import { env } from "@/env";

export async function getAuthSession(headers: Headers): Promise<AuthSession | null> {
  try {
    return (await auth.api.getSession({ headers })) as AuthSession | null;
  } catch {
    return null;
  }
}

export const auth = createAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  siteURL: env.NEXT_PUBLIC_BASE_URL,
});

export type { AuthUser, AuthSession };
