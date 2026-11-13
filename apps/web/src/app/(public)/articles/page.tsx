import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { Badge } from "@santai/ui/badge";
import { ScientificBackground } from "@santai/ui/scientificBackground";
import { articles } from "@/data/articles";

export default function ArticlesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden section-padding">
          <ScientificBackground variant="blueprint" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </ScientificBackground>
          <div className="container-main relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-1 editorial-label">Articles</p>
              <h1 className="editorial-xl text-text">Artikel &amp; Panduan</h1>
              <p className="mt-3 editorial-body mx-auto text-muted">
                Artikel dan panduan seputar teknologi, programming, dan karier digital untuk
                mahasiswa.
              </p>
            </div>
          </div>
        </section>

        <div className="container-main pb-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-150 hover:border-border-strong"
              >
                <div className="flex items-center justify-between gap-2 border-b border-border bg-surface/60 px-4 py-2.5">
                  <Badge variant="default" className="font-mono text-[10px] uppercase tracking-wider">
                    {article.category}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted">{article.readTime}</span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-heading text-base font-bold leading-snug text-text transition-colors duration-150 group-hover:text-primary">
                    {article.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto flex items-center gap-3 border-t border-border pt-3 text-[10px] text-muted">
                    <span className="flex min-w-0 items-center gap-1">
                      <User className="size-3 shrink-0" />
                      <span className="truncate">{article.author.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      <Calendar className="size-3" />
                      {article.date}
                    </span>
                  </div>

                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                    Baca Artikel
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
