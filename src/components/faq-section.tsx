import { FaqAccordion } from "@/components/landing/faq-accordion";
import { Reveal } from "@/components/landing/motion/reveal";
import { FAQ } from "@/lib/pricing-data";

export function FaqSection() {
  return (
    <section id="faq" className="relative border-border/60 border-t bg-secondary/30 py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-primary">FAQ</p>
          <h2 className="mt-4 text-title text-foreground">Questions fréquentes</h2>
        </Reveal>

        <Reveal index={1} className="mt-12 rounded-[24px] border border-border/70 bg-card px-6 md:px-8">
          <FaqAccordion items={FAQ} />
        </Reveal>
      </div>
    </section>
  );
}
