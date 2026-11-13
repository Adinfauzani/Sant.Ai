"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth/authClient";
import {
  archiveAimChat,
  createAimChat,
  deleteAimChat,
  deleteAimMessagesFrom,
  listAimChats,
  renameAimChat,
  restoreAimChat,
  setAimChatPinned,
  setAimChatProject,
  type AimChatSummary,
} from "@/lib/ai/aimuActions";
import { AimuHoloSphere } from "@/components/ai/aimuHoloSphere";
import { AiChatSidebar } from "@/components/ai/aiChatSidebar";
import { ChatComposer, type PickedFile } from "@/components/ai/chatComposer";
import { ChatHeader } from "@/components/ai/chatHeader";
import { Typing } from "@/components/loading-ui/typing";
import {
  Chat,
  ChatMessages,
  ChatEmptyState,
  ChatFooter,
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  ChatMessageRow,
  UserBubble,
  AssistantText,
  AiMessageActions,
  UserMessageActions,
  shareText,
  type MessageFeedback,
  SuggestionList,
  MessageTrace,
  type TracePhase,
  MessageSources,
  extractSources,
  CodeBlock,
  InlineCode,
} from "@/components/ai/elements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@santai/ui/dialog";
import { SidebarProvider } from "@santai/ui/sidebar";
import { useIsMobile } from "@santai/ui/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@santai/ui/sheet";

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
  const re = new RegExp(
    `\\n${FILE_MARK}FILE\\u0000([^\\u0000]+)\\u0000([^\\u0000]+)\\u0000([^\\u0000]+)`,
    "g",
  );
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
  return text.replace(
    new RegExp(
      `\\n${FILE_MARK}FILE\\u0000[^\\u0000]+\\u0000[^\\u0000]+\\u0000[^\\u0000]+`,
      "g",
    ),
    "",
  );
}

function messageFiles(
  parts: Array<{ type: string; text?: string }>,
): Array<AttachedFile> {
  return parseFileMarkers(messageText(parts)).map(({ raw, ...f }) => ({
    name: f.name,
    mime: f.mime,
    base64: f.base64,
  }));
}

function buildFilePayload(
  text: string,
  files: Array<{ name: string; mime: string; base64: string }>,
): string {
  return files.reduce(
    (acc, f) =>
      `${acc}\n${FILE_MARK}FILE\u0000${f.name}\u0000${f.mime}\u0000${f.base64}`,
    text,
  );
}

const suggestions = [
  "Jelaskan konsep OOP dengan contoh",
  "Tulis contoh kode React singkat",
  "Rangkum cara kerja REST API",
  "Ide topik skripsi IT simple",
];

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

/** Key penyimpanan lokal untuk tanda suka/tidak suka pada respons AI. */
const FEEDBACK_KEY = "ai-mu:feedback";

function titleFromMessage(text: string, fileCount: number): string {
  const clean = stripFileMarkers(text).replace(/\s+/g, " ").trim();
  if (!clean) return fileCount > 0 ? "Lampiran" : "Percakapan baru";
  return clean.length > 48 ? `${clean.slice(0, 48).trim()}…` : clean;
}

const mdComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 marker:text-muted last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 marker:text-muted last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="pl-0.5">{children}</li>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-text">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic text-text-secondary">{children}</em>
  ),
  del: ({ children }: { children?: ReactNode }) => (
    <del className="text-muted">{children}</del>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words text-primary underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({
    className,
    children,
  }: {
    className?: string;
    children?: ReactNode;
  }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return <code className={cn("font-mono text-xs", className)}>{children}</code>;
    }
    return <InlineCode className={className}>{children}</InlineCode>;
  },
  pre: ({ children }: { children?: ReactNode }) => {
    const child = Array.isArray(children) ? children[0] : children;
    const props = (child && typeof child === "object" && "props" in (child as object))
      ? ((child as { props?: { className?: string; children?: ReactNode } }).props ?? {})
      : {};
    const language = /language-([\w-]+)/.exec(props.className ?? "")?.[1];
    const code = typeof props.children === "string" ? props.children : undefined;
    return (
      <div className="mb-2 last:mb-0">
        <CodeBlock language={language} code={code}>{children}</CodeBlock>
      </div>
    );
  },
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mb-2 text-base font-semibold text-text last:mb-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mb-2 text-[15px] font-semibold text-text last:mb-0">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mb-2 text-sm font-semibold text-text last:mb-0">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: ReactNode }) => (
    <h4 className="mb-1.5 text-sm font-semibold text-text last:mb-0">
      {children}
    </h4>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="mb-2 border-l-2 border-border pl-3 text-text-secondary last:mb-0 [&>p]:mb-0">
      {children}
    </blockquote>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="mb-2 max-w-full overflow-x-auto rounded-lg border border-border last:mb-0">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-b border-border bg-surface/60 px-2 py-1.5 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-b border-border px-2 py-1.5 align-top">{children}</td>
  ),
  img: ({ src, alt }: { src?: string | Blob; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      className="mb-2 max-w-full rounded-lg border border-border last:mb-0"
    />
  ),
  input: ({ checked, type }: { checked?: boolean; type?: string }) => (
    <input
      type={type ?? "checkbox"}
      checked={checked}
      readOnly
      className="mr-1 size-3.5 accent-primary align-middle"
    />
  ),
  hr: () => <hr className="my-3 border-border" />,
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
  chats?: AimChatSummary[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const isMobile = useIsMobile();
  const userInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "U";
  const firstName = session?.user?.name?.trim().split(/\s+/)[0];
  const profileHref = session?.user
    ? `/${(session.user as { username?: string }).username ?? ""}`
    : "/ai";

  const [input, setInput] = useState("");
  const [chats, setChats] = useState<AimChatSummary[] | undefined>(
    initialChats,
  );
  const [activeChatId, setActiveChatId] = useState<string | undefined>(chatId);
  const [pickedFiles, setPickedFiles] = useState<PickedFile[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Status ciut/lebar sidebar disimpan supaya tidak berubah tiap muat ulang.
  useEffect(() => {
    try {
      if (window.localStorage.getItem("aimu:sidebar-collapsed") === "1") {
        setCollapsed(true);
      }
    } catch {
      /* localStorage bisa diblokir */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "aimu:sidebar-collapsed",
        collapsed ? "1" : "0",
      );
    } catch {
      /* abaikan */
    }
  }, [collapsed]);
  /** Pesan pengguna yang sedang diedit: id, isi lama, dan posisinya. */
  const [editing, setEditing] = useState<{
    id: string;
    text: string;
    index: number;
  } | null>(null);
  /** Balasan yang menunggu konfirmasi penghapusan. */
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    text: string;
    index: number;
  } | null>(null);
  const [feedback, setFeedback] = useState<
    Record<string, MessageFeedback | undefined>
  >({});
  const sidebarCollapsed = collapsed && !isMobile;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatIdRef = useRef<string | undefined>(chatId);
  /** Ref elemen markdown tiap respons AI, untuk menyalin teks hasil render. */
  const bodyRefs = useRef(new Map<string, HTMLDivElement>());

  const initialUiMessages = (
    initialMessages.length > 0
      ? initialMessages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: [{ type: "text" as const, text: m.content }],
        }))
      : []
  ) as UIMessage[];

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => (chatIdRef.current ? { chatId: chatIdRef.current } : {}),
      }),
    [],
  );

  const { messages, sendMessage, regenerate, stop, status, error, setMessages } =
    useChat({
      id: chatId,
      messages: initialUiMessages as never,
      transport: transport as never,
    });



  const isBusy = status === "submitted" || status === "streaming";
  const activeChatTitle = guest
    ? "Percakapan tamu"
    : (chats?.find((chat) => chat.id === activeChatId)?.title ??
      "Percakapan baru");

  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const guestLocked = guest && userMsgCount >= 1;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FEEDBACK_KEY);
      if (!raw) return;
      setFeedback(JSON.parse(raw) as Record<string, MessageFeedback>);
    } catch {
      // localStorage tidak tersedia: feedback hanya hidup di memori.
    }
  }, []);

  const updateFeedback = (id: string, value: MessageFeedback) => {
    setFeedback((prev) => {
      const next = { ...prev, [id]: prev[id] === value ? undefined : value };
      try {
        window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next));
      } catch {
        // abaikan kegagalan penyimpanan lokal
      }
      return next;
    });
  };

  /** Teks hasil render respons (innerText), atau teks mentah bila belum dirender. */
  const renderedText = (m: UIMessage) =>
    bodyRefs.current.get(m.id)?.innerText?.trim() || messageText(m.parts);

  const startEdit = (id: string, text: string, index: number) => {
    setEditing({ id, text, index });
    setInput(text);
    setPickedFiles([]);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setInput("");
  };

  /** Memotong percakapan dari satu pesan dan menyinkronkan transkrip server. */
  const truncateFrom = async (target: {
    id: string;
    text: string;
    index: number;
  }) => {
    setMessages((prev) => prev.slice(0, target.index));
    const id = chatIdRef.current;
    if (!id || guest) return;
    try {
      await deleteAimMessagesFrom(id, target.id, target.text);
    } catch {
      // Transkrip server tidak tersinkron, tampilan tetap dipotong.
    }
  };

  const retryFrom = async (target: {
    id: string;
    text: string;
    index: number;
  }) => {
    if (isBusy) return;
    await truncateFrom(target);
    void sendMessage({ text: target.text });
  };

  const deleteFrom = async (target: {
    id: string;
    text: string;
    index: number;
  }) => {
    setPendingDelete(null);
    await truncateFrom(target);
    toast.success("Pesan dihapus.");
  };

  /** Mengisi composer dengan prompt sebelumnya supaya bisa dikirim ulang. */
  const editPrompt = (index: number) => {
    for (let i = index - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role !== "user") continue;
      startEdit(m.id, stripFileMarkers(messageText(m.parts)), i);
      return;
    }
  };

  const handleNewChat = () => {
    setInput("");
    setPickedFiles([]);
    setEditing(null);
    setPendingDelete(null);
    setMessages([]);
    chatIdRef.current = undefined;
    setActiveChatId(undefined);
    window.history.replaceState(null, "", "/chat");
  };

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
      handleNewChat();
      return true;
    }
    if (cmd === "/clear") {
      setMessages([]);
      return true;
    }
    return false;
  };

  /**
   * Percakapan hanya dibuat setelah pesan pertama dikirim. Judulnya diambil
   * dari isi pesan pertama, jadi tidak pernah "Percakapan baru" yang kosong.
   */
  const ensureChat = async (text: string, fileCount: number) => {
    if (chatIdRef.current || guest) return;
    const res = await createAimChat(titleFromMessage(text, fileCount));
    chatIdRef.current = res.id;
    setActiveChatId(res.id);
    window.history.replaceState(null, "", `/chat/${res.id}`);
    await refreshChats();
  };

  /** Kirim prompt siap pakai (mis. saran di layar sambutan) + simpan chat. */
  const sendPrompt = async (text: string) => {
    if (isBusy || guestLocked) return;
    setInput("");
    try {
      await ensureChat(text, 0);
    } catch {
      // Gagal membuat percakapan: jawaban tetap dikirim tanpa disimpan.
    }
    void sendMessage({ text });
  };

  const onSubmit = async () => {
    const text = input.trim();
    if (guestLocked) return;
    if (!text && pickedFiles.length === 0) return;
    if (isBusy) return;
    if (text.startsWith("/") && handleCommand(text)) return;
    const payload = buildFilePayload(text, pickedFiles);
    const fileCount = pickedFiles.length;
    setPickedFiles([]);
    setInput("");

    if (editing) {
      // Pesan yang diedit menggantikan pesan lama beserta balasan berikutnya.
      const target = editing;
      setEditing(null);
      await truncateFrom(target);
      void sendMessage({ text: payload });
      return;
    }

    try {
      await ensureChat(payload, fileCount);
    } catch {
      // Gagal membuat percakapan: jawaban tetap dikirim tanpa disimpan.
    }
    void sendMessage({ text: payload });
  };

  const refreshChats = async () => {
    try {
      setChats(await listAimChats());
    } catch {
      /* ignore */
    }
  };

  /** Kembali ke layar /chat kosong tanpa membuat baris percakapan baru. */
  const resetToChat = () => {
    chatIdRef.current = undefined;
    setActiveChatId(undefined);
    setMessages([]);
    window.history.replaceState(null, "", "/chat");
  };

  const handleRename = async (id: string, title: string) => {
    try {
      await renameAimChat(id, title);
      await refreshChats();
    } catch {
      toast.error("Gagal mengganti nama percakapan.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAimChat(id);
    } catch {
      toast.error("Gagal menghapus percakapan.");
      return;
    }
    if (id === activeChatId) resetToChat();
    await refreshChats();
  };

  const handleTogglePin = async (id: string, pinned: boolean) => {
    try {
      await setAimChatPinned(id, pinned);
      await refreshChats();
    } catch {
      toast.error("Gagal memperbarui sematan percakapan.");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveAimChat(id);
      if (id === activeChatId) resetToChat();
      await refreshChats();
      toast.success("Percakapan diarsipkan.");
    } catch {
      toast.error("Gagal mengarsipkan percakapan.");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreAimChat(id);
      await refreshChats();
      toast.success("Percakapan dipulihkan.");
    } catch {
      toast.error("Gagal memulihkan percakapan.");
    }
  };

  const handleMoveToProject = async (id: string, projectId: string | null) => {
    try {
      await setAimChatProject(id, projectId);
      await refreshChats();
      toast.success(
        projectId
          ? "Percakapan ditautkan ke proyek."
          : "Percakapan dilepas dari proyek.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memindahkan percakapan.",
      );
    }
  };

  /** Tombol + di sidebar: buat baris percakapan lalu buka percakapan itu. */
  const handleCreateConversation = async () => {
    if (guest) {
      router.push("/login?next=/chat");
      return;
    }
    if (isBusy) stop();
    try {
      const created = await createAimChat();
      await refreshChats();
      setDrawerOpen(false);
      router.push(`/chat/${created.id}`);
    } catch {
      toast.error("Gagal membuat percakapan baru.");
    }
  };

  const sidebar = (onNavigate?: () => void) => (
    <AiChatSidebar
      chats={chats ?? []}
      activeChatId={activeChatId}
      collapsed={sidebarCollapsed}
      onToggleCollapsed={() => setCollapsed((c) => !c)}
      onCreateChat={handleCreateConversation}
      onRename={handleRename}
      onDelete={handleDelete}
      onTogglePin={handleTogglePin}
      onArchive={handleArchive}
      onRestore={handleRestore}
      onMoveToProject={handleMoveToProject}
      onNavigate={onNavigate}
    />
  );

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex h-dvh w-full overflow-hidden bg-background">
        <SidebarProvider
          open={!sidebarCollapsed}
          onOpenChange={(open) => setCollapsed(!open)}
          className="flex h-full min-h-0 w-full"
        >
          <aside
            className={cn(
              "group hidden shrink-0 flex-col border-r border-aimu-border bg-aimu-bg transition-[width] duration-200 ease-out md:flex",
              sidebarCollapsed ? "w-[68px]" : "w-[280px]",
            )}
            data-collapsible={sidebarCollapsed ? "icon" : ""}
          >
            {sidebar()}
          </aside>

          <Chat className="min-w-0 flex-1 bg-background">
            <ChatHeader
              title={activeChatTitle}
              busy={isBusy}
              hasError={Boolean(error)}
              guest={guest}
              onOpenDrawer={() => setDrawerOpen(true)}
              onNewChat={handleCreateConversation}
              closeHref={profileHref}
            />

            <ChatMessages className="relative min-h-0 flex-1">
              {messages.length === 0 ? (
                <div className="relative z-10 flex h-full flex-col overflow-y-auto pb-40 md:pb-44">
                  <ChatEmptyState
                    className="flex-1 px-6"
                    icon={<AimuHoloSphere size={88} className="mx-auto" />}
                    title={
                      firstName
                        ? `${greetingFor(new Date())}, ${firstName}`
                        : "Halo, Sahabat Santai"
                    }
                    description="Mulai percakapan dengan AI MU. Tanyakan ide, analisis, atau bantuan penulisan dan kode."
                    actions={
                      <SuggestionList
                        items={suggestions}
                        onSelect={(s) => void sendPrompt(s)}
                        disabled={isBusy || guestLocked}
                      />
                    }
                  />
                </div>
              ) : (
                <MessageScroller className="absolute inset-0 z-10">
                  <MessageScrollerContent>
                    {messages.map((m, index) => {
                      const isUser = m.role === "user";
                      const files = isUser ? messageFiles(m.parts) : [];
                      const userText = isUser ? stripFileMarkers(messageText(m.parts)) : "";
                      const assistantText = isUser ? "" : messageText(m.parts);
                      const isLatest = index === messages.length - 1;
                      const streamingThis = !isUser && isBusy && isLatest;
                      const phase: TracePhase = streamingThis
                        ? (assistantText.length > 0 ? "streaming" : "waiting")
                        : "done";
                      let priorUserFiles: Array<{ name?: string }> = [];
                      if (!isUser) {
                        for (let i = index - 1; i >= 0; i--) {
                          if (messages[i].role === "user") {
                            priorUserFiles = messageFiles(messages[i].parts);
                            break;
                          }
                        }
                      }
                      const sources = !isUser && !streamingThis ? extractSources(assistantText) : [];

                      return (
                        <MessageScrollerItem key={m.id} messageId={m.id}>
                          <ChatMessageRow
                            role={isUser ? "user" : "assistant"}
                          >
                            {!isUser && (streamingThis || isLatest) ? (
                              <MessageTrace
                                files={priorUserFiles}
                                phase={phase}
                                failed={Boolean(error) && isLatest}
                              />
                            ) : null}

                            {isUser ? (
                              <UserBubble text={userText} />
                            ) : (
                              <AssistantText>
                                <div
                                  ref={(el) => {
                                    if (el) bodyRefs.current.set(m.id, el);
                                    else bodyRefs.current.delete(m.id);
                                  }}
                                  className="w-full min-w-0 break-words"
                                >
                                  {assistantText ? (
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
                                      components={mdComponents}
                                    >
                                      {assistantText}
                                    </ReactMarkdown>
                                  ) : null}
                                </div>
                              </AssistantText>
                            )}

                            {!isUser && sources.length > 0 ? (
                              <MessageSources sources={sources} />
                            ) : null}

                            {files.length > 0 ? (
                              <div className="flex flex-wrap justify-end gap-1.5 self-end">
                                {files.map((f, i) => (
                                  <a
                                    key={`${m.id}-file-${i}`}
                                    href={`data:${f.mime ?? "application/octet-stream"};base64,${f.base64 ?? ""}`}
                                    download={f.name}
                                    className="max-w-[220px] truncate rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-text-secondary hover:text-text"
                                  >
                                    {f.name ?? "Lampiran"}
                                  </a>
                                ))}
                              </div>
                            ) : null}

                            {isUser ? (
                              <div className="self-end">
                                <UserMessageActions
                                  text={userText}
                                  disabled={isBusy}
                                  onEdit={() => startEdit(m.id, userText, index)}
                                  onShare={() => void shareText(userText, "Pesan AI MU")}
                                  onRetry={() => void retryFrom({ id: m.id, text: userText, index })}
                                  onDelete={() => setPendingDelete({ id: m.id, text: userText, index })}
                                />
                              </div>
                            ) : !streamingThis ? (
                              <div className="self-start">
                                <AiMessageActions
                                  text={renderedText(m)}
                                  markdown={messageText(m.parts)}
                                  feedback={feedback[m.id]}
                                  busy={isBusy}
                                  onFeedback={(value) => updateFeedback(m.id, value)}
                                  onShare={() => void shareText(renderedText(m), "Respons AI MU")}
                                  onRegenerate={() => {
                                    if (isBusy) return;
                                    void regenerate({ messageId: m.id });
                                  }}
                                  onEditPrompt={() => editPrompt(index)}
                                />
                              </div>
                            ) : null}
                          </ChatMessageRow>
                        </MessageScrollerItem>
                      );
                    })}

                    {isBusy &&
                      (() => {
                        const last = messages[messages.length - 1];
                        const lastIsAi = last && last.role !== "user";
                        const lastHasText = last && messageText(last.parts).length > 0;
                        if (lastIsAi && !lastHasText) return null;
                        return (
                          <MessageScrollerItem messageId="typing">
                            <ChatMessageRow role="assistant">
                              <AssistantText>
                                <Typing className="h-2 w-12 text-primary" />
                              </AssistantText>
                            </ChatMessageRow>
                          </MessageScrollerItem>
                        );
                      })()}
                  </MessageScrollerContent>
                  <MessageScrollerButton />
                </MessageScroller>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-8 md:px-6 md:pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="pointer-events-auto mx-auto w-full max-w-3xl">
                  <ChatComposer
                    input={input}
                    onInputChange={setInput}
                    files={pickedFiles}
                    onFilesChange={setPickedFiles}
                    editing={editing !== null}
                    onCancelEdit={cancelEdit}
                    onSubmit={() => void onSubmit()}
                    isBusy={isBusy}
                    onStop={() => stop()}
                    guest={guest}
                    guestLocked={guestLocked}
                    error={error}
                    textareaRef={textareaRef}
                  />
                  <p className="mt-2 text-center text-[11px] text-muted">
                    AI MU dapat membuat kesalahan. Verifikasi informasi penting.
                  </p>
                </div>
              </div>
            </ChatMessages>
          </Chat>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent side="left" className="w-[288px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigasi AI MU</SheetTitle>
                <SheetDescription>Navigasi dan riwayat percakapan AI MU.</SheetDescription>
              </SheetHeader>
              {sidebar(() => setDrawerOpen(false))}
            </SheetContent>
          </Sheet>

          <Dialog open={pendingDelete !== null} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Hapus pesan?</DialogTitle>
                <DialogDescription>
                  Pesan ini dan semua balasan setelahnya akan dihapus dari percakapan. Tindakan ini tidak bisa dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <button type="button" onClick={() => setPendingDelete(null)} className="rounded-lg border border-border px-3 py-2 text-sm text-text transition-colors hover:bg-surface">Batal</button>
                <button type="button" onClick={() => { if (pendingDelete) void deleteFrom(pendingDelete); }} className="rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90">Hapus</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarProvider>
      </div>
    </div>
  );
}
