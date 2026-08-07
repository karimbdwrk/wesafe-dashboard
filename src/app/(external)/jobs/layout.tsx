import type { Metadata } from "next";

const TITLE = "Offres d'emploi en sécurité privée";
const DESCRIPTION =
  "Consultez les offres d'emploi en sécurité privée : CDI, CDD, missions last minute. Postulez en quelques clics avec WeSafe.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/jobs",
    siteName: "WeSafe",
    locale: "fr_FR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
