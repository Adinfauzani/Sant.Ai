import { createAuthClient } from "better-auth/react";
import { twoFactorClient, emailOTPClient, multiSessionClient, usernameClient, adminClient } from "better-auth/client/plugins";
import { ssoClient } from "@better-auth/sso/client";

const apiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
const baseURL =
  apiUrl ||
  (typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL || "");

export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    twoFactorClient(),
    emailOTPClient(),
    multiSessionClient(),
    usernameClient(),
    adminClient(),
    ssoClient(),
  ],
});

export const { signIn, signOut, useSession } = authClient;
