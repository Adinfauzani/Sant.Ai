import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProfileMePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  redirect(`/profile/${session.user.id}`);
}
