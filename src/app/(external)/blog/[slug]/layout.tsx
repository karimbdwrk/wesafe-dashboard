import { cache } from "react";

import type { Metadata } from "next";

import { supabase } from "@/lib/supabase/supabaseClient";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const getArticle = cache(async (slug: string) => {
  const { data } = await supabase
    .from("articles")
    .select("title, excerpt, cover_image, author, published_at, category")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article introuvable" };
  }

  const title = article.title;
  const description = article.excerpt ?? `Article du blog WeSafe : ${article.title}.`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      siteName: "WeSafe",
      locale: "fr_FR",
      type: "article",
      publishedTime: article.published_at ?? undefined,
      authors: article.author ? [article.author] : undefined,
      images: article.cover_image ? [{ url: article.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default async function BlogArticleLayout({ children, params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return children;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.cover_image ?? undefined,
    author: article.author ? { "@type": "Person", name: article.author } : { "@type": "Organization", name: "WeSafe" },
    publisher: {
      "@type": "Organization",
      name: "WeSafe",
      logo: { "@type": "ImageObject", url: "https://wesafeapp.fr/wesafe-recruitment-logo.svg" },
    },
    datePublished: article.published_at ?? undefined,
    mainEntityOfPage: `https://wesafeapp.fr/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD généré à partir de données publiées, pas de HTML injecté
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
