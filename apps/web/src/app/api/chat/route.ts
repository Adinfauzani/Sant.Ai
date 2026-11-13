import { APICallError, streamText, convertToModelMessages } from "ai";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { chatModel } from "@/lib/ai/openrouter";

export const runtime = "nodejs";


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
  let trigger = "submit-message";
  let messageId: string | undefined;

  try {
    const body = await request.json();
    chatId = body?.chatId;
    messages = Array.isArray(body?.messages) ? (body.messages as UiMessage[]) : [];
    if (typeof body?.trigger === "string") trigger = body.trigger;
    if (typeof body?.messageId === "string") messageId = body.messageId;
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

      if (trigger === "regenerate-message") {
        // Regenerasi memakai ulang pesan pengguna yang sama, jadi tidak perlu
        // menyimpan ulang baris user. Balasan lama digantikan oleh yang baru.
        const target = messageId
          ? await prisma.aiMuChatMessage.findFirst({
              where: { id: messageId, chatId },
              select: { id: true, createdAt: true },
            })
          : null;
        if (target) {
          // Balasan yang digenerasi ulang dan semua pesan setelahnya dibuang.
          await prisma.aiMuChatMessage.deleteMany({
            where: {
              chatId,
              OR: [
                { createdAt: { gt: target.createdAt } },
                // Beberapa baris bisa berbagi timestamp, id jadi pemutus.
                { createdAt: target.createdAt, id: { gte: target.id } },
              ],
            },
          });
        } else {
          const lastUserRow = await prisma.aiMuChatMessage.findFirst({
            where: { chatId, role: "user" },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          });
          if (lastUserRow) {
            await prisma.aiMuChatMessage.deleteMany({
              where: {
                chatId,
                role: "assistant",
                createdAt: { gt: lastUserRow.createdAt },
              },
            });
          }
        }
      } else if (userText || userFiles.length > 0) {
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
      model: chatModel as never,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(modelMessages as never),
      maxOutputTokens: 1024,
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

    return result.toUIMessageStreamResponse({
      onError: (error) => toSafeStreamError(error),
    });
  } catch (error) {
    return toSafeResponseError(error);
  }
}

function isAbortError(error: unknown) {
  return (
    (error instanceof Error && error.name === "AbortError") ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name?: string }).name === "AbortError")
  );
}

function classifyProviderError(error: unknown) {
  if (isAbortError(error)) {
    return {
      status: 499,
      log: "AI MU chat request aborted",
      message: "Permintaan dibatalkan sebelum AI MU selesai merespons.",
    };
  }

  if (APICallError.isInstance(error)) {
    const code = error.statusCode;
    if (code === 401 || code === 403) {
      return {
        status: 503,
        log: `AI MU provider auth/config error (${code})`,
        message:
          "AI MU sedang tidak dapat terhubung ke layanan AI karena konfigurasi akses bermasalah. Silakan coba lagi nanti.",
      };
    }
    if (code === 402) {
      return {
        status: 503,
        log: "AI MU provider error: payment/credit required",
        message:
          "AI MU sedang tidak dapat menghasilkan respons karena layanan AI mengalami kendala kredit atau pembayaran. Silakan coba lagi nanti.",
      };
    }
    if (code === 429) {
      return {
        status: 429,
        log: "AI MU provider rate limited",
        message:
          "AI MU sedang menerima terlalu banyak permintaan. Silakan tunggu sebentar lalu coba lagi.",
      };
    }
    if (code === 404) {
      return {
        status: 503,
        log: "AI MU provider model unavailable",
        message:
          "Model AI MU sedang tidak tersedia. Silakan coba lagi nanti.",
      };
    }
    if (code === 408) {
      return {
        status: 504,
        log: "AI MU provider timeout",
        message:
          "Respons AI MU membutuhkan waktu terlalu lama. Silakan coba lagi.",
      };
    }
    if (typeof code === "number" && code >= 500) {
      return {
        status: 503,
        log: `AI MU provider unavailable (${code})`,
        message:
          "Layanan AI MU sedang tidak tersedia untuk sementara. Silakan coba beberapa saat lagi.",
      };
    }
  }

  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("timeout") || message.includes("timed out")) {
    return {
      status: 504,
      log: "AI MU provider timeout",
      message: "Respons AI MU membutuhkan waktu terlalu lama. Silakan coba lagi.",
    };
  }
  if (
    message.includes("network") ||
    message.includes("fetch failed") ||
    message.includes("econn") ||
    message.includes("socket")
  ) {
    return {
      status: 503,
      log: "AI MU provider network error",
      message:
        "AI MU tidak dapat terhubung ke layanan AI saat ini. Silakan coba lagi.",
    };
  }

  return {
    status: 500,
    log: "AI MU chat error",
    message:
      "AI MU sedang tidak dapat menghasilkan respons karena layanan AI mengalami kendala. Silakan coba kembali beberapa saat lagi.",
  };
}

function toSafeStreamError(error: unknown) {
  const classified = classifyProviderError(error);
  console.error(classified.log, {
    name: error instanceof Error ? error.name : undefined,
    status: APICallError.isInstance(error) ? error.statusCode : undefined,
  });
  return classified.message;
}

function toSafeResponseError(error: unknown) {
  const classified = classifyProviderError(error);
  console.error(classified.log, {
    name: error instanceof Error ? error.name : undefined,
    status: APICallError.isInstance(error) ? error.statusCode : undefined,
  });
  if (classified.status === 499) {
    return new Response(null, { status: 499 });
  }
  return Response.json({ error: classified.message }, { status: classified.status });
}