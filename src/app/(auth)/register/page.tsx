import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const session = await getAuthSession(await headers());
  if (session?.user?.username) redirect(`/${session.user.username}`);
  return <RegisterForm />;
}