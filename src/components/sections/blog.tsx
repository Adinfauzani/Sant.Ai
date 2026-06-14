"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";

function ArticleCover({ category, cover }: { category: string; cover: string }) {
  return (
    <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${cover}`}>
      <span className="font-heading text-xs font-semibold text-white/70">{category}</span>
    </div>
  );
}

export default function Blog() {
  return (
    <section className="section-padding">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Blog
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">
            Latest Articles
          </h2>
          <p className="mt-3 text-sm text-muted">
            Artikel dan panduan seputar teknologi, programming, dan karir digital
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.a
              key={article.slug}
              href={`/articles/${article.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary/30"
            >
              <ArticleCover category={article.category} cover={article.cover} />
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  {article.date}
                </div>
                <h3 className="font-heading text-sm font-semibold leading-snug text-text transition-colors group-hover:text-primary md:text-base">
                  {article.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {article.excerpt}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <Link href="/articles">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
