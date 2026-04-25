import { CtaSection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { OffersSection } from "@/components/offers-section";
import { ProcessSection } from "@/components/process-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <CtaSection />
      <OffersSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
