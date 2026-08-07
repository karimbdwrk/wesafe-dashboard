import { cache } from "react";

import type { Metadata } from "next";

import { getLocation } from "@/components/job-card";
import { supabase } from "@/lib/supabase/supabaseClient";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const EMPLOYMENT_TYPE: Record<string, string> = {
  cdi: "FULL_TIME",
  full_time: "FULL_TIME",
  cdd: "TEMPORARY",
  part_time: "TEMPORARY",
  freelance: "CONTRACTOR",
  stage: "INTERN",
  internship: "INTERN",
  alternance: "INTERN",
  apprentice: "INTERN",
};

function getCompany(job: { companies: unknown }): { name?: string; logo_url?: string } | null {
  const raw = job.companies;
  return Array.isArray(raw) ? (raw[0] ?? null) : ((raw as { name?: string; logo_url?: string } | null) ?? null);
}

const getJob = cache(async (id: string) => {
  const { data } = await supabase
    .from("jobs")
    .select(
      "title, description, created_at, contract_type, city, department, region, salary_type, salary_hourly, salary_monthly_min, salary_monthly_max, salary_monthly_fixed, salary_annual_min, salary_annual_max, salary_annual_fixed, salary_min, salary_max, salary_amount, companies(name, logo_url)",
    )
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return { title: "Offre introuvable" };
  }

  const company = getCompany(job);
  const companyName = company?.name ?? "une entreprise partenaire";
  const location = getLocation(job);
  const title = `${job.title}${location ? ` - ${location}` : ""}`;
  const description = job.description?.trim()
    ? job.description.trim().slice(0, 160)
    : `Offre d'emploi ${job.title} chez ${companyName}, publiée sur WeSafe.`;

  return {
    title,
    description,
    alternates: { canonical: `/jobs/${id}` },
    openGraph: {
      title,
      description,
      url: `/jobs/${id}`,
      siteName: "WeSafe",
      locale: "fr_FR",
      type: "website",
      images: company?.logo_url ? [{ url: company.logo_url }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function JobLayout({ children, params }: Props) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) return children;

  const location = getLocation(job);
  const company = getCompany(job);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description ?? job.title,
    datePosted: job.created_at ?? undefined,
    employmentType: job.contract_type ? (EMPLOYMENT_TYPE[job.contract_type] ?? "OTHER") : undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: company?.name ?? "WeSafe",
      logo: company?.logo_url ?? undefined,
    },
    jobLocation: location
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city ?? undefined,
            addressRegion: job.region ?? undefined,
            addressCountry: "FR",
          },
        }
      : undefined,
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
