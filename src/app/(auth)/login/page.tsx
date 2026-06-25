import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.username) redirect(`/${session.user.username}`);
  return <LoginForm />;
}
