import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { Badge } from "@santai/ui/badge";
import { articles, type Article } from "@/data/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-150 hover:border-border-strong"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface/60 px-3 py-2">
        <span className="truncate font-mono text-[9px] font-semibold uppercase tracking-wider text-muted">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="font-heading text-xs font-semibold leading-snug text-text transition-colors group-hover:text-primary">
          {article.title}
        </p>
        <span className="mt-auto flex items-center gap-1 pt-2 text-[10px] text-muted">
          <Calendar className="size-2.5" />
          {article.date}
        </span>
      </div>
    </Link>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = slug ? articles.find((a) => a.slug === slug) : undefined;
  if (!article) notFound();

  const related = articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <article>
          {/* Header */}
          <div className="border-b border-border bg-surface/60">
            <div className="container-main py-10 md:py-14">
              <div className="mx-auto max-w-3xl">
                <Badge variant="default" className="font-mono text-[10px] uppercase tracking-wider">
                  {article.category}
                </Badge>

                <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-text md:text-4xl">
                  {article.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <User className="size-3.5" />
                    {article.author.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container-main section-padding">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/articles"
                className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="size-3.5" />
                Kembali ke daftar artikel
              </Link>

              <div
                className="article-content mt-8 space-y-5"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Author card */}
              <div className="mt-12 flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {article.author.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text">{article.author.name}</p>
                  <p className="text-xs text-muted">{article.author.role}</p>
                </div>
                <Link
                  href="/articles"
                  className="hidden items-center gap-1 text-[10px] font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
                >
                  Semua Artikel
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="section-padding border-t border-border">
            <div className="container-main">
              <div className="mx-auto max-w-3xl">
                <h2 className="font-heading text-xl font-bold tracking-tight text-text">
                  Artikel Terkait
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {related.map((a) => (
                    <RelatedCard key={a.slug} article={a} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
