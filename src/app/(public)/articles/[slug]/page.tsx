import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { articles, type Article } from "@/data/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

const categoryMeta: Record<string, { gradient: string }> = {
  "Data Science": { gradient: "from-blue-600 to-cyan-500" },
  Career: { gradient: "from-emerald-600 to-teal-500" },
  IoT: { gradient: "from-purple-600 to-violet-500" },
  Cloud: { gradient: "from-amber-600 to-orange-500" },
  Backend: { gradient: "from-sky-600 to-blue-500" },
  Design: { gradient: "from-pink-600 to-rose-500" },
};

function RelatedCard({ article }: { article: Article }) {
  const cat = categoryMeta[article.category];
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group relative"
    >
      <div className="pointer-events-none absolute -inset-px rounded-[16px] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:blur-sm" />
      <div className="relative overflow-hidden rounded-[16px] border border-border bg-surface/80 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:border-transparent group-hover:shadow-primary/5">
        <div className={`flex h-24 items-end bg-gradient-to-br ${article.cover}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${cat?.gradient ?? "from-primary to-accent"} opacity-10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="relative z-10 p-3">
            <span className="rounded-full bg-black/30 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {article.category}
            </span>
          </div>
        </div>
        <div className="p-3">
          <p className="font-heading text-xs font-semibold leading-snug text-text transition-colors group-hover:text-primary">
            {article.title}
          </p>
          <span className="mt-1.5 flex items-center gap-1 text-[10px] text-muted">
            <Calendar className="h-2.5 w-2.5" />
            {article.date}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = slug ? articles.find((a) => a.slug === slug) : undefined;
  if (!article) notFound();

  const related = articles.filter(
    (a) => a.slug !== article.slug && a.category === article.category,
  ).slice(0, 3);

  const cat = categoryMeta[article.category];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <article>
          {/* Cover hero */}
          <div className={`relative flex h-56 items-end bg-gradient-to-br ${article.cover} md:h-72`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${cat?.gradient ?? "from-primary to-accent"} opacity-15`} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="container-main relative z-10 pb-8">
              <div className="mx-auto max-w-3xl">
                <span className="inline-block rounded-full bg-black/30 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {article.category}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container-main section-padding">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/articles"
                className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Articles
              </Link>

              <h1 className="font-heading text-3xl font-bold leading-tight text-text md:text-4xl">
                {article.title}
              </h1>

              {/* Meta bar */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {article.author.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime}
                </span>
              </div>

              {/* Article body */}
              <div
                className="article-content mt-8 space-y-5"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Author card */}
              <div className="mt-12 rounded-2xl border border-border bg-surface/80 p-5 backdrop-blur-sm transition-all hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/20">
                    {article.author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text">{article.author.name}</p>
                    <p className="text-xs text-muted">{article.author.role}</p>
                  </div>
                  <Link
                    href="/articles"
                    className="hidden items-center gap-1 text-[10px] font-medium text-primary transition-all hover:gap-1.5 sm:flex"
                  >
                    All Articles
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="section-padding border-t border-border">
            <div className="container-main">
              <div className="mx-auto max-w-3xl">
                <h2 className="font-heading text-xl font-bold text-text">
                  Related Articles
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
