"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ArrowRight, Calendar, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/supabaseClient";

// Table Supabase attendue : articles
// Colonnes : id, slug, title, excerpt, cover_image, author, published_at, category, reading_time, published

function ArticleCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-48 bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="mt-4 flex gap-3">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md"
    >
      {/* Image */}
      <div className="h-48 overflow-hidden bg-muted">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-4xl">📰</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="space-y-3 p-5">
        {article.category && (
          <Badge variant="secondary" className="text-xs">
            {article.category}
          </Badge>
        )}

        <h2 className="line-clamp-2 font-semibold text-foreground text-lg leading-snug transition-colors group-hover:text-primary">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">{article.excerpt}</p>
        )}

        <div className="flex items-center justify-between border-border border-t pt-2">
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(article.published_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            {article.reading_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.reading_time} min
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 font-medium text-primary text-xs">
            Lire
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id, slug, title, excerpt, cover_image, author, published_at, category, reading_time")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        const items = data ?? [];
        setArticles(items);
        // Extraire les catégories uniques
        const cats = [...new Set(items.map((a) => a.category).filter(Boolean))];
        setCategories(cats);
        setLoading(false);
      });
  }, []);

  const filtered = activeCategory ? articles.filter((a) => a.category === activeCategory) : articles;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="mt-14 border-border border-b bg-card/50 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-medium text-primary text-sm uppercase tracking-widest">Blog WeSafe</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] font-bold text-4xl text-foreground md:text-5xl">
            Actualités & conseils
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Retrouvez nos articles sur la sécurité privée, les métiers du secteur et les actualités WeSafe.
          </p>
        </div>
      </section>

      {/* Filtres catégories */}
      {categories.length > 0 && (
        <div className="sticky top-14 z-10 border-border border-b bg-background">
          <div className="scrollbar-none mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3">
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className={`shrink-0 rounded-full px-3 py-1 font-medium text-xs transition-colors ${
                activeCategory === ""
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-3 py-1 font-medium text-xs transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grille articles */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-4xl">📭</p>
            <p className="text-muted-foreground">Aucun article pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
