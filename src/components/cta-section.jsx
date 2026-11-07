import Image from "next/image";

import { ArrowRight } from "lucide-react";

import { AmbientBackground } from "@/components/ambient-background";
import { Press } from "@/components/landing/motion/press";
import { Reveal } from "@/components/landing/motion/reveal";

import appstoreImg from "../../media/appstore.png";
import playstoreImg from "../../media/playstore.png";

export function CtaSection() {
  return (
    <section id="telecharger" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal
          y={32}
          scale={0.98}
          className="relative overflow-hidden rounded-[24px] border border-border/70 bg-card p-10 md:p-16"
        >
          <AmbientBackground />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-title text-foreground">Prêt à transformer votre recrutement ?</h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              Rejoignez des milliers de professionnels de la sécurité qui font déjà confiance à WeSafe. Téléchargez
              l&apos;application gratuitement.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Press scale={0.95} lift={2}>
                <a
                  href="https://apps.apple.com/fr/app/wesafe-recruitment/id6737527469"
                  target="_blank"
                  className="block"
                  rel="noopener"
                >
                  <Image src={appstoreImg} alt="Télécharger sur l'App Store" height={48} />
                </a>
              </Press>
              <Press scale={0.95} lift={2}>
                <a
                  href="https://play.google.com/store/apps/details?id=com.aizensecu.wesafe"
                  target="_blank"
                  className="block"
                  rel="noopener"
                >
                  <Image src={playstoreImg} alt="Disponible sur Google Play" height={48} />
                </a>
              </Press>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <ArrowRight className="h-4 w-4 text-primary" />
              Inscription gratuite, sans engagement
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
