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
import { StatsSection } from "@/components/stats-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
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
