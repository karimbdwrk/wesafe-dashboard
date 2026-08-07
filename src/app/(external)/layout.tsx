import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WeSafe",
  url: "https://wesafeapp.fr",
  logo: "https://wesafeapp.fr/wesafe-recruitment-logo.svg",
  description: "Plateforme de recrutement dédiée au secteur de la sécurité privée.",
  email: "contact@wesafe.fr",
};

export default function ExternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD statique, aucune donnée utilisateur
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
