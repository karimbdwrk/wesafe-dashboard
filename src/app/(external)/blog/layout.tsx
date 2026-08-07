import type { Metadata } from "next";

const TITLE = "Blog";
const DESCRIPTION = "Actualités et conseils sur la sécurité privée, les métiers du secteur et les nouveautés WeSafe.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blog",
    siteName: "WeSafe",
    locale: "fr_FR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
