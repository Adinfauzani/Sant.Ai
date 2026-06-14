import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { Plan, UserRole } from "@/generated/prisma/client";
import { prisma } from "./db";

const sudoGithubUsername = process.env.AUTH_SUDO_GITHUB_USERNAME || "Adinfauzani";

const providers: NonNullable<NextAuthConfig["providers"]> = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user?.password) return null;

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.password,
      );

      if (!isValid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.avatar || null,
        role: user.role,
        plan: user.plan,
      };
    },
  }),
];

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  );
}

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  );
}

function getGithubUsername(profile: unknown) {
  const profileRecord = profile as { login?: string } | undefined;
  return typeof profileRecord?.login === "string" ? profileRecord.login : "";
}

function getRoleForGithubUser(existingRole?: UserRole | null, githubUsername = "") {
  if (githubUsername.toLowerCase() === sudoGithubUsername.toLowerCase()) {
    return UserRole.Sudo;
  }

  return existingRole || UserRole.User;
}

function getPlanForRole() {
  return Plan.Free;
}

const authConfig: NextAuthConfig = {
  providers,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.type !== "oauth") return true;

      const email = typeof user.email === "string"
        ? user.email
        : typeof profile?.email === "string"
          ? profile.email
          : "";

      if (!email) return false;

      const githubUsername = account.provider === "github"
        ? getGithubUsername(profile)
        : "";
      const role = getRoleForGithubUser(undefined, githubUsername);
      const plan = getPlanForRole();

      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (!existing) {
        await prisma.user.create({
          data: {
            name: user.name || email.split("@")[0],
            email,
            password: "",
            studyProgram: "TI",
            semester: 1,
            avatar: user.image || "",
            role,
            plan,
          },
        });
      } else if (githubUsername) {
        await prisma.user.update({
          where: { email },
          data: {
            role,
            plan,
          },
        });
      }

      const dbUser = existing || await prisma.user.findUnique({
        where: { email },
      });

      if (!dbUser) return false;

      user.id = dbUser.id;
      user.email = dbUser.email;
      user.name = dbUser.name;
      user.image = dbUser.avatar || undefined;

      return true;
    },
    async jwt({ token, user }) {
      const authUser = user as { id?: string; role?: UserRole; plan?: Plan; image?: string | null } | undefined;

      if (authUser?.id) {
        token.id = authUser.id;
      }
      if (authUser?.role) {
        token.role = authUser.role;
      }
      if (authUser?.plan) {
        token.plan = authUser.plan;
      }
      if (authUser?.image) {
        token.image = authUser.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.plan = token.plan as Plan;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
