"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/supabaseClient";

// Table Supabase attendue : articles
// Colonnes : id, slug, title, excerpt, cover_image, content (HTML), author,
//            published_at, category, reading_time, published

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-72 rounded-xl bg-muted" />
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-8 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-muted" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    if (!slug) return;

    supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setNotFoundState(true);
          setLoading(false);
          return;
        }
        setArticle(data);

        // Articles liés (même catégorie, exclure l'actuel)
        if (data.category) {
          supabase
            .from("articles")
            .select("id, slug, title, cover_image, published_at, reading_time")
            .eq("published", true)
            .eq("category", data.category)
            .neq("slug", slug)
            .order("published_at", { ascending: false })
            .limit(3)
            .then(({ data: rel }) => setRelated(rel ?? []));
        }

        setLoading(false);
      });
  }, [slug]);

  if (notFoundState) {
    return (
      <div className="mt-14 flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-5xl">📭</p>
        <h1 className="font-semibold text-foreground text-xl">Article introuvable</h1>
        <Link href="/blog" className="flex items-center gap-1.5 text-primary text-sm hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-14 min-h-screen bg-background">
      {loading ? (
        <div className="mx-auto max-w-4xl px-6 py-12">
          <ArticleSkeleton />
        </div>
      ) : (
        <>
          {/* Image de couverture */}
          {article.cover_image && (
            <div className="h-72 w-full overflow-hidden md:h-96">
              <img src={article.cover_image} alt={article.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="mx-auto max-w-3xl px-6 py-10">
            {/* Bouton retour */}
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au blog
            </Link>

            {/* Catégorie */}
            {article.category && (
              <Badge variant="secondary" className="mb-4">
                {article.category}
              </Badge>
            )}

            {/* Titre */}
            <h1 className="mb-4 font-[family-name:var(--font-heading)] font-bold text-3xl text-foreground leading-tight md:text-4xl">
              {article.title}
            </h1>

            {/* Méta */}
            <div className="mb-8 flex flex-wrap items-center gap-4 border-border border-b pb-8 text-muted-foreground text-sm">
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {article.author}
                </span>
              )}
              {article.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.published_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {article.reading_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {article.reading_time} min de lecture
                </span>
              )}
            </div>

            {/* Contenu HTML */}
            {article.content ? (
              <div
                className="text-base text-foreground leading-7 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 [&_blockquote]:my-4 [&_blockquote]:border-primary/40 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_em]:italic [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:font-[family-name:var(--font-heading)] [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:leading-tight [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-[family-name:var(--font-heading)] [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:leading-tight [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-[family-name:var(--font-heading)] [&_h3]:font-semibold [&_h3]:text-xl [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:font-semibold [&_h4]:text-lg [&_hr]:my-8 [&_hr]:border-border [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-lg [&_li]:leading-7 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ol]:text-muted-foreground [&_p]:my-4 [&_p]:text-muted-foreground [&_p]:leading-7 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:text-muted-foreground"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: contenu contrôlé côté admin
                dangerouslySetInnerHTML={{
                  __html: article.content,
                }}
              />
            ) : (
              article.excerpt && <p className="text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>
            )}
          </div>

          {/* Articles liés */}
          {related.length > 0 && (
            <section className="mt-8 border-border border-t bg-card/50 py-12">
              <div className="mx-auto max-w-4xl px-6">
                <h2 className="mb-6 font-semibold text-foreground text-xl">Articles similaires</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="h-32 overflow-hidden bg-muted">
                        {rel.cover_image ? (
                          <img
                            src={rel.cover_image}
                            alt={rel.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <span className="text-2xl">📰</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5 p-4">
                        <p className="line-clamp-2 font-semibold text-foreground text-sm transition-colors group-hover:text-primary">
                          {rel.title}
                        </p>
                        {rel.published_at && (
                          <p className="text-muted-foreground text-xs">
                            {new Date(rel.published_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
