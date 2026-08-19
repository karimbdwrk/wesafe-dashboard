import { CtaSection } from "@/components/cta-section";
import { DashboardPreviewSection } from "@/components/dashboard-preview-section";
import { FaqSection } from "@/components/faq-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { MobilePreviewSection } from "@/components/mobile-preview-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { OffersSection } from "@/components/offers-section";
import { PricingSection } from "@/components/pricing-section";
import { ProcessSection } from "@/components/process-section";

// import { StatsSection } from "@/components/stats-section"; // désactivé : chiffres faux/trop faibles, à rétablir plus tard

const TITLE = "WeSafe - Recrutement en sécurité privée : agents & entreprises";
const DESCRIPTION =
  "Trouvez les meilleurs agents de sécurité ou décrochez votre prochain poste en quelques clics. Offres classiques, missions last minute et contrats générés automatiquement.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "WeSafe",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      {/* <StatsSection /> désactivé : chiffres faux/trop faibles, à rétablir plus tard */}
      <FeaturesSection />
      <DashboardPreviewSection />
      <MobilePreviewSection />
      <ProcessSection />
      <OffersSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
