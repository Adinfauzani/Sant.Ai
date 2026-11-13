import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, MessageSquare, CheckCircle2, Tag, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { Badge } from "@santai/ui/badge";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getCommunityDetail, type CommunityPostData } from "@/lib/community/community";
import MembershipButton from "./_membershipButton";
import PostComposer from "./_postComposer";
import LikeButton from "./_likeButton";
import TodoList from "./_todoList";

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={`flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ${className ?? ""}`}
    >
      {name}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} mnt lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hr lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { month: "short", day: "numeric" });
}

function DiscussionCard({ post }: { post: CommunityPostData }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-border-strong">
      <div className="flex items-start gap-3">
        <Avatar name={initials(post.authorName)} className="h-8 w-8 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-text">{post.authorName}</span>
            {post.program && (
              <Badge variant="outline" className="font-mono text-[9px]">
                {post.program}
              </Badge>
            )}
            <span className="text-[10px] text-muted">{timeAgo(post.createdAt)}</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{post.content}</p>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-muted">
            <LikeButton postId={post.id} initialLikes={post.likes} initialLiked={post.likedByMe} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function CommunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getAuthSession(await headers());
  const viewerId = session?.user?.id;

  const community = await getCommunityDetail(slug, viewerId);
  if (!community) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div
          className={
            community.coverImage
              ? "relative flex h-52 items-end bg-background md:h-64"
              : "relative flex h-52 items-end bg-gradient-to-br from-primary/25 to-primary/5 md:h-64"
          }
        >
          {community.coverImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={community.coverImage}
                alt={`Cover ${community.name}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </>
          )}
          <div className="container-main relative z-10 pb-8">
            <div className="mx-auto max-w-4xl">
              <Badge variant="default" className="font-mono text-[10px] uppercase tracking-wider">
                {community.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container-main section-padding">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/community"
              className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke daftar komunitas
            </Link>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-3xl font-bold leading-tight text-text md:text-4xl">
                    {community.name}
                  </h1>
                </div>
                <p className="mt-2 text-sm text-muted">{community.description}</p>
                {community.lead && (
                  <p className="mt-2 text-[11px] text-muted">
                    Dipimpin oleh <span className="font-medium text-text">{community.lead.name}</span>
                    {community.lead.program ? ` (${community.lead.program})` : ""}
                  </p>
                )}
              </div>
              <MembershipButton communitySlug={community.slug} initialMember={community.isMember} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Users, text: `${community.memberCount} anggota` },
                { icon: MessageSquare, text: `${community.discussionCount} diskusi` },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[10px] text-muted">
                  <m.icon className="h-3.5 w-3.5 text-primary" />
                  {m.text}
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="font-heading text-xl font-bold tracking-tight text-text">Tentang Komunitas</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{community.fullDescription}</p>
            </div>

            {community.topics.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-lg font-bold tracking-tight text-text">Topik</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {community.topics.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary">
                      <Tag className="h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {community.rules.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-lg font-bold tracking-tight text-text">Aturan Komunitas</h3>
                <div className="mt-3 space-y-2">
                  {community.rules.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      <span className="text-[11px] text-muted">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {community.needs.length > 0 && (
              <div className="mt-8">
                <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-text">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  Kebutuhan Anggota
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {community.needs.map((need) => (
                    <span key={need} className="rounded-lg bg-surface px-3 py-1.5 text-[11px] font-medium text-muted">
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <TodoList communityId={community.id} initial={community.todos} isLead={community.isLead} />

            <div className="mt-10 grid gap-8 md:grid-cols-5">
              <div className="md:col-span-2">
                <h3 className="font-heading text-lg font-bold tracking-tight text-text">Anggota</h3>
                {community.members.length === 0 ? (
                  <p className="mt-3 text-xs text-muted">Belum ada anggota. Jadilah yang pertama bergabung!</p>
                ) : (
                  <div className="mt-3 space-y-2.5">
                    {community.members.map((m) => (
                      <Link key={m.id} href={`/${m.username}`} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 transition-all hover:border-border-strong">
                        <Avatar name={initials(m.name)} className="h-8 w-8 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text truncate">{m.name}</p>
                          <p className="text-[9px] text-muted">{m.role}</p>
                        </div>
                        {m.program && (
                          <Badge variant="outline" className="shrink-0 font-mono text-[8px]">
                            {m.program}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {community.isLead && community.pendingInvites.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-heading text-sm font-bold text-text">
                      Undangan Tertunda ({community.pendingInvites.length})
                    </h4>
                    <p className="mt-1 text-[10px] text-muted">Mereka belum bergabung, tetapi telah diundang.</p>
                    <div className="mt-2 space-y-2">
                      {community.pendingInvites.map((inv) => (
                        <Link key={inv.id} href={`/${inv.username}`} className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-4 py-2.5 transition-all hover:border-border-strong">
                          <Avatar name={initials(inv.name)} className="h-8 w-8 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{inv.name}</p>
                            <p className="font-mono text-[9px] text-primary">@{inv.username}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold tracking-tight text-text">Diskusi</h3>
                </div>
                <div className="mt-3 space-y-3">
                  {community.isMember && <PostComposer communityId={community.id} />}
                  {community.posts.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-6 text-center text-xs text-muted">
                      Belum ada diskusi. Post pertama untuk membuka percakapan!
                    </p>
                  ) : (
                    community.posts.map((post) => (
                      <DiscussionCard key={post.id} post={post} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}