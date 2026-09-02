import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { AiChat } from "@/components/ai/aiChat";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAuthSession(await headers());
  if (session?.user?.id) {
    const chat = await prisma.aiMuChat.create({
      data: { userId: session.user.id, title: "Percakapan baru" },
    });
    redirect(`/chat/${chat.id}`);
  }

  const params = await searchParams;
  const isDemo = params.coba === "1";
  if (!isDemo) redirect("/ai");

  return <AiChat guest />;
}