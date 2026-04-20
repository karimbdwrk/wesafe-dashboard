import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { ProcessSection } from "@/components/process-section";
import { OffersSection } from "@/components/offers-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
	return (
		<main className='min-h-screen bg-background'>
			<Header />
			<HeroSection />
			<FeaturesSection />
			<ProcessSection />
			<OffersSection />
			<CtaSection />
			<Footer />
		</main>
	);
}
