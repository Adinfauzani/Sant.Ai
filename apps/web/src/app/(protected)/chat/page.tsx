import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { AiChat } from "@/components/ai/aiChat";
import { listAimChats } from "@/lib/ai/aimuActions";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAuthSession(await headers());
  const params = await searchParams;
  const isDemo = params.coba === "1";

  if (!session?.user?.id) {
    if (!isDemo) redirect("/ai");
    return <AiChat guest />;
  }

  // Tidak ada percakapan yang dibuat di sini: chat baru hanya dibuat
  // setelah pengguna mengirim pesan pertama.
  const chats = await listAimChats();

  return <AiChat chats={chats} />;
}
