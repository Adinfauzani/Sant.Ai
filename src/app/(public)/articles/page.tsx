import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { articles } from "@/data/articles";

const categoryMeta: Record<string, { accent: string; gradient: string }> = {
  "Data Science": {
    accent: "from-blue-500/30 to-cyan-400/10",
    gradient: "from-blue-600 to-cyan-500",
  },
  Career: {
    accent: "from-emerald-500/30 to-teal-400/10",
    gradient: "from-emerald-600 to-teal-500",
  },
  IoT: {
    accent: "from-purple-500/30 to-violet-400/10",
    gradient: "from-purple-600 to-violet-500",
  },
  Cloud: {
    accent: "from-amber-500/30 to-orange-400/10",
    gradient: "from-amber-600 to-orange-500",
  },
  Backend: {
    accent: "from-sky-500/30 to-blue-400/10",
    gradient: "from-sky-600 to-blue-500",
  },
  Design: {
    accent: "from-pink-500/30 to-rose-400/10",
    gradient: "from-pink-600 to-rose-500",
  },
};

export default function ArticlesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main section-padding">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Blog
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">
              Articles
            </h1>
            <p className="mt-3 text-sm text-muted">
              Artikel dan panduan seputar teknologi, programming, dan karir digital untuk mahasiswa
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const cat = categoryMeta[article.category];
              return (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group relative"
                >
                  {/* gradient glow */}
                  <div className="pointer-events-none absolute -inset-px rounded-[24px] bg-gradient-to-br from-primary/30 via-primary/10 to-accent/30 opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:blur-md" />

                  <div className="relative overflow-hidden rounded-[24px] border border-border bg-surface/80 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:border-transparent group-hover:shadow-primary/5">
                    {/* inner gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-primary/8 via-transparent to-accent/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* cover */}
                    <div className={`relative flex h-40 items-end bg-gradient-to-br ${cat?.accent ?? "from-primary/20 to-accent/10"} overflow-hidden md:h-44`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat?.gradient ?? "from-primary to-accent"} opacity-10`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      <div className="relative z-10 p-4">
                        <span className="inline-block rounded-full bg-black/30 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* body */}
                    <div className="p-5">
                      <h2 className="font-heading text-base font-bold leading-snug text-text transition-colors duration-300 group-hover:text-primary">
                        {article.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                        {article.excerpt}
                      </p>

                      {/* meta row */}
                      <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-[10px] text-muted">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.author.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-primary transition-all group-hover:gap-1.5">
                        Read Article
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
