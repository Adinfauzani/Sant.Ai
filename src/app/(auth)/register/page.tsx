import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user?.username) redirect(`/${session.user.username}`);
  return <RegisterForm />;
}