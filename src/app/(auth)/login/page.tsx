import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./loginForm";

export default async function LoginPage() {
  const session = await getAuthSession(await headers());
  if (session?.user?.username) redirect(`/${session.user.username}`);
  return <LoginForm />;
}
