import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./loginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAuthSession(await headers());
  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : null;
  if (session?.user?.username) redirect(next ?? `/${session.user.username}`);
  return <LoginForm next={next} />;
}
