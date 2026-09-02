import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { Session as BaseSession } from "better-auth";
import { twoFactor, emailOTP, multiSession, username, admin } from "better-auth/plugins";
import { sso } from "@better-auth/sso";
import { dash, sentinel } from "@better-auth/infra";
import { prisma } from "./db";
import { sendVerificationEmail, sendPasswordResetEmail, sendOTP } from "./email";
import { isReservedUsername } from "./reserved";

export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  username: string;
  role: string;
  banned: boolean;
  bio: string;
  createdAt: Date;
}

export type AuthSession = BaseSession & { user: AuthUser };

export interface CreateAuthOptions {
  secret: string;
  /** Origin where this auth instance's HTTP routes live. */
  baseURL: string;
  /** Public site origin used for URLs embedded in emails (defaults to baseURL). */
  siteURL?: string;
  basePath?: string;
  /** Additional origins allowed to make authenticated cross-origin requests. */
  trustedOrigins?: string[];
}

const SUDO_ACCOUNTS = [
  { provider: "github", id: "adinfauzani" },
  { provider: "google", id: "104172627992970621169" },
];

export function createAuth({
  secret,
  baseURL,
  siteURL = baseURL,
  basePath = "/api/auth",
  trustedOrigins = [],
}: CreateAuthOptions) {
  const toSiteURL = (url: string) => {
    try {
      const parsed = new URL(url);
      const site = new URL(siteURL);
      return new URL(parsed.pathname + parsed.search, site).toString();
    } catch {
      return url;
    }
  };

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),

    secret,
    baseURL,
    basePath,
    trustedOrigins: [baseURL, siteURL, ...trustedOrigins],

    advanced: {
      ipAddress: {
        ipAddressHeaders: ["x-vercel-forwarded-for", "x-forwarded-for"],
      },
    },

    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
      async sendResetPassword(data) {
        await sendPasswordResetEmail(data.user.email, toSiteURL(data.url));
      },
    },

    socialProviders: {
      google: {
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      },
      github: {
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
      },
    },

    session: {
      expiresIn: 3600,
      updateAge: 600,
      cookieCache: {
        enabled: false,
      },
    },

    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github"],
      },
    },

    user: {
      additionalFields: {
        bio: { type: "string", required: false, defaultValue: "" },
        studyProgram: { type: "string", required: false, defaultValue: "" },
        semester: { type: "number", required: false },
      },
      modelName: "user",
      changeEmail: {
        enabled: true,
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const base = (user.name || "user")
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "")
              .slice(0, 24) || "user";

            let username = base;
            let attempts = 0;
            while (attempts < 20) {
              const exists = await prisma.user.findUnique({ where: { username } });
              if (!exists && !isReservedUsername(username)) break;
              username = `${base}-${Math.random().toString(36).slice(2, 6)}`;
              attempts++;
            }
            return { data: { ...user, username } } as any;
          },
        },
      },
      account: {
        create: {
          after: async (account: any) => {
            const match = SUDO_ACCOUNTS.some(
              (s) => s.provider === account.providerId && s.id === account.accountId?.toString(),
            );
            if (match) {
              await prisma.user.update({
                where: { id: account.userId },
                data: { role: "sudo" },
              });
            }
          },
        },
      },
    },

    plugins: [
      admin(),
      multiSession({ maximumSessions: 2 }),
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          await sendOTP(email, otp, type);
        },
        otpLength: 6,
        expiresIn: 600,
        allowedAttempts: 5,
        rateLimit: { window: 60, max: 1 },
        sendVerificationOnSignUp: true,
        overrideDefaultEmailVerification: true,
      }),
      username({
        minUsernameLength: 2,
        maxUsernameLength: 30,
        usernameValidator: (u) => !isReservedUsername(u),
      }),
      twoFactor({
        issuer: "Sant.Ai",
        totpOptions: {
          digits: 6,
          period: 30,
          backupCodes: {
            amount: 10,
            length: 10,
          },
        },
      }),
      sso(),
      ...(process.env.BETTER_AUTH_API_URL ? [dash()] : []),
      ...(process.env.BETTER_AUTH_IDENTIFY_URL ? [sentinel()] : []),
    ],
  });
}
