"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowDown, Bot, MessageSquareText, Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/authClient";
import {
  createAimChat,
  deleteAimChat,
  listAimChats,
  renameAimChat,
} from "@/lib/aimuActions";

export interface AiChatInitialMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Array<{ name?: string; mime?: string; base64?: string }>;
}

const FILE_MARK = "\u241F"; // ␟

function messageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

type AttachedFile = { name?: string; mime?: string; base64?: string };

function parseFileMarkers(text: string): Array<AttachedFile & { raw: string }> {
  const files: Array<AttachedFile & { raw: string }> = [];
  const re = new RegExp(`\\n${FILE_MARK}FILE\\u0000([^\\u0000]+)\\u0000([^\\u0000]+)\\u0000([^\\u0000]+)`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    files.push({
      name: m[1],
      mime: m[2],
      base64: m[3],
      raw: m[0],
    });
  }
  return files;
}

function stripFileMarkers(text: string): string {
  return text.replace(new RegExp(`\\n${FILE_MARK}FILE\\u0000[^\\u0000]+\\u0000[^\\u0000]+\\u0000[^\\u0000]+`, "g"), "");
}

function messageFiles(parts: Array<{ type: string; text?: string }>): Array<AttachedFile> {
  return parseFileMarkers(messageText(parts)).map(({ raw, ...f }) => ({ name: f.name, mime: f.mime, base64: f.base64 }));
}

function buildFilePayload(text: string, files: Array<{ name: string; mime: string; base64: string }>): string {
  return files.reduce(
    (acc, f) => `${acc}\n${FILE_MARK}FILE\u0000${f.name}\u0000${f.mime}\u0000${f.base64}`,
    text,
  );
}

const suggestions = [
  "Jelaskan konsep OOP dengan contoh",
  "Tulis contoh kode React singkat",
  "Rangkum cara kerja REST API",
  "Ide topik skripsi IT simple",
];

const mdComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => <em>{children}</em>,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-border/50 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-surface/80 p-3 text-xs leading-relaxed last:mb-0">
      {children}
    </pre>
  ),
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mb-2 text-base font-semibold last:mb-0">{children}</h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mb-2 text-[15px] font-semibold last:mb-0">{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mb-2 text-sm font-semibold last:mb-0">{children}</h3>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border border-border bg-surface/60 px-2 py-1.5 text-left font-semibold">{children}</th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border border-border px-2 py-1.5">{children}</td>
  ),
  hr: () => <hr className="my-2 border-border" />,
};

export function AiChat({
  chatId,
  initialMessages = [],
  guest = false,
  chats: initialChats,
}: {
  chatId?: string;
  initialMessages?: AiChatInitialMessage[];
  guest?: boolean;
  chats?: Array<{ id: string; title: string; updatedAt: Date }>;
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { data: session } = useSession();
  const userInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "U";
  const [chats, setChats] = useState<Array<{ id: string; title: string; updatedAt: Date }> | undefined>(initialChats);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [pickedFiles, setPickedFiles] = useState<Array<{ name: string; mime: string; base64: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialUiMessages: UIMessage[] =
    initialMessages.length > 0
      ? initialMessages.map<UIMessage>((m) => ({
          id: m.id,
          role: m.role,
          parts: [{ type: "text", text: m.content }],
        }))
      : [];

  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: chatId,
    messages: initialUiMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: chatId ? { chatId } : undefined,
    }),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [withinBottom, setWithinBottom] = useState(true);

  useEffect(() => {
    if (!withinBottom || !containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, status, withinBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setWithinBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setWithinBottom(true);
  };

  const isBusy = status === "submitted" || status === "streaming";

  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const guestLocked = guest && userMsgCount >= 1;

  const handleCommand = (text: string): boolean => {
    const cmd = text.trim().toLowerCase();
    if (cmd === "/help") {
      setMessages([
        {
          id: "cmd-help",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Berikut perintah yang bisa kamu pakai:\n• /help, daftar perintah\n• /new, mulai percakapan baru\n• /clear, bersihkan percakapan saat ini",
            },
          ],
        },
      ]);
      return true;
    }
    if (cmd === "/new") {
      void handleNewChat();
      return true;
    }
    if (cmd === "/clear") {
      setMessages([]);
      return true;
    }
    return false;
  };

  const onSubmit = () => {
    const text = input.trim();
    if (guestLocked) return;
    if (!text && pickedFiles.length === 0) return;
    if (isBusy) return;
    if (text.startsWith("/") && handleCommand(text)) return;
    const payload = buildFilePayload(text, pickedFiles);
    setPickedFiles([]);
    setInput("");
    setWithinBottom(true);
    void sendMessage({ text: payload });
  };

const handleNewChat = async () => {
    try {
      const res = await createAimChat();
      setInput("");
      router.push(`/chat/${res.id}`);
    } catch {
      router.push("/chat?coba=1");
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    if (list.length === 0) return;
    void (async () => {
      const results: Array<{ name: string; mime: string; base64: string }> = [];
      for (const f of list) {
        const buf = await f.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
        }
        results.push({ name: f.name, mime: f.type || "application/octet-stream", base64: btoa(binary) });
      }
      setPickedFiles((prev) => [...prev, ...results]);
    })();
    e.target.value = "";
  };

  const refreshChats = async () => {
    try {
      setChats(await listAimChats());
    } catch {
      /* ignore */
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    await renameAimChat(id, renameValue);
    setRenamingId(null);
    await refreshChats();
  };

  const handleDelete = async (id: string) => {
    await deleteAimChat(id);
    if (id === chatId) {
      router.replace("/chat");
    } else {
      await refreshChats();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-full overflow-hidden bg-card">
      {chats && (
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface/30">
          <div className="p-3">
            <button
              type="button"
              onClick={handleNewChat}
              disabled={isBusy}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text transition-colors hover:bg-surface disabled:opacity-40"
            >
              <MessageSquareText className="h-3.5 w-3.5" />
              + Percakapan baru
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {chats.length === 0 && (
              <p className="px-2 py-4 text-center text-[11px] text-muted">Belum ada percakapan</p>
            )}
            {chats.map((c) => {
              const isActive = c.id === chatId;
              const isRenaming = renamingId === c.id;
              return (
                <div
                  key={c.id}
                  className={cn(
                    "group relative mb-1 rounded-lg transition-colors",
                    isActive ? "bg-primary/10" : "hover:bg-surface",
                  )}
                >
                  {isRenaming ? (
                    <form
                      className="flex items-center gap-1 px-2 py-1.5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void handleRename(c.id);
                      }}
                    >
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        className="min-w-0 flex-1 rounded border border-border bg-card px-1.5 py-0.5 text-xs text-text outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-white"
                      >
                        OK
                      </button>
                    </form>
                  ) : (
                    <>
                      <Link
                        href={`/chat/${c.id}`}
                        title={c.title}
                        className="block px-3 py-2 text-left text-xs"
                      >
                        <span className={cn("line-clamp-2", isActive ? "text-text" : "text-muted")}>
                          {c.title}
                        </span>
                      </Link>
                      <div className="absolute right-1 top-1 hidden gap-0.5 group-hover:flex">
                        <button
                          type="button"
                          aria-label="Rename"
                          onClick={() => {
                            setRenamingId(c.id);
                            setRenameValue(c.title);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-border"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                        </button>
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => void handleDelete(c.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-border hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text">AI MU</p>
          <p className="text-[11px] text-muted">Asisten Sant.Ai · in-house</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-surface/50 px-2 py-1 text-[10px] font-medium text-muted">
          {isBusy ? (
            <span className="flex items-center gap-[3px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary typing-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="font-mono">{error ? "gagal" : "siap"}</span>
            </>
          )}
        </span>
        {!guest && (
          <button
            type="button"
            onClick={handleNewChat}
            disabled={isBusy}
            className="hidden rounded-lg border border-border bg-surface/50 px-3 py-1.5 text-xs text-muted transition-colors hover:text-text sm:block disabled:opacity-40"
          >
            + Percakapan baru
          </button>
        )}
        <Link
          href={session?.user ? `/${(session.user as any)?.username ?? ""}` : "/ai"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/50 text-muted transition-colors hover:text-text"
          aria-label="Tutup dan kembali"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative flex-1">
        <div ref={containerRef} onScroll={handleScroll} className="absolute inset-0 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">Halo, saya AI MU!</p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted">
                  Tanya apa saja: bantu tugas, jelaskan konsep, atau diskusi ide.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setInput("");
                      setWithinBottom(true);
                      void sendMessage({ text: s });
                    }}
                    disabled={isBusy || guestLocked}
                    className="rounded-full border border-border bg-surface/40 px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-text disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? "justify-end" : ""}`}>
                {!isUser && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className="max-w-[70%] sm:max-w-[75%]">
                  {!isUser && (
                    <p className="mb-1 ml-0.5 text-[11px] font-medium text-muted">AI MU</p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed text-text ${
                      isUser ? "rounded-tr-sm bg-primary/10" : "rounded-tl-sm bg-surface/60"
                    }`}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{stripFileMarkers(messageText(m.parts))}</div>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {messageText(m.parts)}
                      </ReactMarkdown>
                    )}
                    {isUser && messageFiles(m.parts).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {messageFiles(m.parts).map((f, i) => (
                          <a
                            key={i}
                            href={`data:${f.mime ?? "application/octet-stream"};base64,${f.base64 ?? ""}`}
                            download={f.name}
                            className="flex max-w-[200px] items-center gap-1.5 rounded-lg border border-border bg-background/50 px-2 py-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <span className="truncate text-[11px] text-muted">{f.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {isUser && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {userInitial}
                  </div>
                )}
              </div>
            );
          })}

          {isBusy && (() => {
            const last = messages[messages.length - 1];
            const lastIsAi = last && last.role !== "user";
            const lastHasText = last && messageText(last.parts).length > 0;
            if (lastIsAi && !lastHasText) return null;
            return (
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-surface/60 px-4 py-3">
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-medium text-muted">
                    <span className="text-primary">AI MU</span>
                    <span>sedang mengetik</span>
                  </p>
                  <span className="flex items-center gap-[4px]">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-primary typing-dot"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {!withinBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-text shadow-md transition-colors hover:bg-surface"
            aria-label="Gulir ke bawah"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {guestLocked ? (
        <div className="border-t border-border bg-surface/50 p-4">
          <p className="mb-3 text-center text-xs text-muted">
            Penasaran lebih dalam? Login untuk lanjut menyimpan percakapanmu.
          </p>
          <Link
            href="/login?next=/chat"
            className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Login untuk lanjut chat
          </Link>
        </div>
      ) : (
        <form
          className="border-t border-border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {pickedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {pickedFiles.map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/40 px-2 py-1">
                  <span className="truncate max-w-[160px] text-[11px] text-text">{f.name}</span>
                  <button
                    type="button"
                    aria-label="Hapus lampiran"
                    onClick={() => setPickedFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="text-muted hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFiles} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Lampirkan file"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface/20 text-muted transition-colors hover:text-text"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder={guest ? "Coba 1 pertanyaan tanpa login..." : "Tanya AI MU apa saja... (/help untuk perintah)"}
              rows={1}
              className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-surface/20 px-4 py-3 text-sm text-text outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
            />
            <button
              type="submit"
              disabled={isBusy || (!input.trim() && pickedFiles.length === 0)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              aria-label="Kirim"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error.message}</p>}
        </form>
      )}
      </div>
    </div>
  );
}