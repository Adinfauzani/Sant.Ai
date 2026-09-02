import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { listAimChats } from "@/lib/aimuActions";
import { AiChat, type AiChatInitialMessage } from "@/components/ai/aiChat";

const FILE_MARK = "\u241F";

function withFileMarkers(content: string, attachments: Array<{ name?: string; mime?: string; base64?: string }>): string {
  return attachments.reduce(
    (acc, f) => `${acc}\n${FILE_MARK}FILE\u0000${f.name ?? ""}\u0000${f.mime ?? ""}\u0000${f.base64 ?? ""}`,
    content,
  );
}

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/chat?coba=1");

  const { id } = await params;
  const chat = await prisma.aiMuChat.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat || chat.userId !== session.user.id) notFound();

  const initialMessages: AiChatInitialMessage[] = chat.messages.map((m) => {
    let attachments: Array<{ name?: string; mime?: string; base64?: string }> = [];
    if (m.attachments) {
      try {
        const parsed = JSON.parse(m.attachments);
        if (Array.isArray(parsed)) attachments = parsed;
      } catch {
        attachments = [];
      }
    }
    return {
      id: m.id,
      role: m.role === "user" ? "user" : "assistant",
      content: m.role === "user" ? withFileMarkers(m.content, attachments) : m.content,
    };
  });

  const chats = await listAimChats();

  return <AiChat chatId={chat.id} initialMessages={initialMessages} chats={chats} />;
}