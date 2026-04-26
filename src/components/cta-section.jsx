import Image from "next/image";

import { ArrowRight } from "lucide-react";

import appstoreImg from "../../media/appstore.png";
import playstoreImg from "../../media/playstore.png";

export function CtaSection() {
  return (
    <section id="telecharger" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-[family-name:var(--font-heading)] font-bold text-3xl text-foreground md:text-4xl">
              Pret a transformer votre recrutement ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Rejoignez des milliers de professionnels de la securite qui font deja confiance a SecuRecruit. Telechargez
              l&apos;application gratuitement.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#" className="transition-opacity hover:opacity-80">
                <Image src={appstoreImg} alt="Télécharger sur l'App Store" height={48} />
              </a>
              <a href="#" className="transition-opacity hover:opacity-80">
                <Image src={playstoreImg} alt="Disponible sur Google Play" height={48} />
              </a>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <ArrowRight className="h-4 w-4 text-primary" />
              Inscription gratuite, sans engagement
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
