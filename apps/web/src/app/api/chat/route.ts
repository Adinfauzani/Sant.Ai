import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

const openai = createOpenAI({
  baseURL: process.env.AI_BASE_URL ?? "http://127.0.0.1:11434/v1",
  apiKey: process.env.AI_API_KEY ?? "ollama",
});

const chatModel = openai.chat(process.env.AI_MODEL ?? "qwen2.5:7b");

const SYSTEM_PROMPT = `Kamu adalah AI MU, asisten kecerdasan buatan milik Sant.Ai yang ramah dan santai.
Gaya bicara: bahasa Indonesia yang sederhana, langsung ke poin, dan tidak bertele-tele.
Jawab dalam 1-5 kalimat saja, hindari tabel markdown kecuali diminta.
Jika tidak tahu, cukup katakan "Maaf, saya belum tahu tentang itu."
Jangan menyebut model atau teknologi dasar yang digunakan.`;

function messageText(parts: Array<{ type?: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

const FILE_MARK = "\u241F";

function parseFileMarkers(text: string): Array<{ name?: string; mime?: string; base64?: string }> {
  const files: Array<{ name?: string; mime?: string; base64?: string }> = [];
  const re = new RegExp(`\\n${FILE_MARK}FILE\\u0000([^\\u0000]+)\\u0000([^\\u0000]+)\\u0000([^\\u0000]+)`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    files.push({ name: m[1], mime: m[2], base64: m[3] });
  }
  return files;
}

function stripFileMarkers(text: string): string {
  return text.replace(new RegExp(`\\n${FILE_MARK}FILE\\u0000[^\\u0000]+\\u0000[^\\u0000]+\\u0000[^\\u0000]+`, "g"), "");
}

function messageFiles(parts: Array<{ type?: string; text?: string }>): Array<{ name?: string; mime?: string; base64?: string }> {
  return parseFileMarkers(messageText(parts));
}

interface UiMessage {
  role: string;
  parts: Array<{ type: string; text?: string }>;
}

export async function POST(request: Request) {
  let chatId: string | undefined;
  let messages: UiMessage[] = [];

  try {
    const body = await request.json();
    chatId = body?.chatId;
    messages = Array.isArray(body?.messages) ? (body.messages as UiMessage[]) : [];
  } catch {
    return Response.json({ error: "Format request tidak valid." }, { status: 400 });
  }

  const session = await getAuthSession(await headers());
  const userId = session?.user?.id;

  try {
    const lastUser = [...messages].reverse().find((m) => m?.role === "user");
    const rawUserText = messageText(lastUser?.parts ?? []).trim();
    const userFiles = messageFiles(lastUser?.parts ?? []).filter((f) => f.base64);
    const userText = stripFileMarkers(rawUserText).trim();

    if (chatId) {
      if (!userId) {
        return Response.json({ error: "Anda harus login untuk menyimpan percakapan." }, { status: 401 });
      }
      const chat = await prisma.aiMuChat.findUnique({ where: { id: chatId } });
      if (!chat || chat.userId !== userId) {
        return Response.json({ error: "Percakapan tidak ditemukan." }, { status: 404 });
      }

      if (userText || userFiles.length > 0) {
        if (chat.title === "Percakapan baru") {
          const titleText = userText.slice(0, 48).trim() || "Percakapan baru";
          await prisma.aiMuChat.update({
            where: { id: chatId },
            data: { title: titleText },
          });
        }
        await prisma.aiMuChatMessage.create({
          data: {
            chatId,
            role: "user",
            content: userText,
            attachments: userFiles.length > 0 ? JSON.stringify(userFiles) : null,
          },
        });
      }
    }

    const modelMessages = messages.map((m) => {
      const text = messageText(m.parts ?? []);
      const files = parseFileMarkers(text);
      const cleanText = stripFileMarkers(text);
      if (files.length === 0) return m;
      const note =
        files.length > 0
          ? `[Pengguna melampirkan ${files.length} lampiran: ${files.map((f) => f.name ?? "file").join(", ")}]`
          : "";
      return { role: m.role, parts: [{ type: "text", text: `${cleanText}${cleanText ? "\n" : ""}${note}` }] };
    });

    const result = streamText({
      model: chatModel,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(modelMessages as never),
    });

    if (chatId) {
      result.text
        .then(async (text) => {
          const trimmed = (text ?? "").trim();
          if (!trimmed) return;
          await prisma.aiMuChatMessage.create({
            data: { chatId: chatId!, role: "assistant", content: trimmed },
          });
        })
        .then(
          () => {},
          (err) => console.error("AI MU persist error:", err),
        );
    }

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI MU chat error:", error);
    return Response.json(
      { error: "AI MU sedang tidak dapat menjawab saat ini. Silakan tunggu sebentar atau tanya ulang." },
      { status: 500 },
    );
  }
}