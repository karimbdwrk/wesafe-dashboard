import type { Metadata } from "next";

const TITLE = "Contact";
const DESCRIPTION =
  "Une question sur WeSafe ? Notre équipe vous répond dans les meilleurs délais, généralement sous 24h.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contact",
    siteName: "WeSafe",
    locale: "fr_FR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
