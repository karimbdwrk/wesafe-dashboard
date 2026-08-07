import type { MetadataRoute } from "next";

import { supabase } from "@/lib/supabase/supabaseClient";

const BASE_URL = "https://wesafeapp.fr";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/tarifs", changeFrequency: "monthly", priority: 0.9 },
  { path: "/jobs", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.7 },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
  { path: "/politique-de-confidentialite", changeFrequency: "yearly", priority: 0.2 },
  { path: "/conditions-generales-d-utilisation", changeFrequency: "yearly", priority: 0.2 },
  { path: "/conditions-generales-de-vente", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [{ data: articles }, { data: jobs }] = await Promise.all([
    supabase.from("articles").select("slug, published_at").eq("published", true),
    supabase.from("jobs").select("id, created_at").eq("status", "published"),
  ]);

  const articleEntries: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: article.published_at ? new Date(article.published_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const jobEntries: MetadataRoute.Sitemap = (jobs ?? []).map((job) => ({
    url: `${BASE_URL}/jobs/${job.id}`,
    lastModified: job.created_at ? new Date(job.created_at) : undefined,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticEntries, ...articleEntries, ...jobEntries];
}
