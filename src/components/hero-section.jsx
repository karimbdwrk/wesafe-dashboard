import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Zap } from "lucide-react";

import iphonemockup from "@/assets/iphonemockup.png";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="-translate-x-1/2 absolute top-1/4 left-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-muted-foreground text-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Disponible sur App Store & Play Store
            </div>

            <h1 className="text-balance font-[family-name:var(--font-heading)] font-bold text-4xl text-foreground leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Le recrutement en
              <span className="text-primary"> sécurité</span>, réinventé.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed lg:max-w-lg">
              Trouvez les meilleurs agents de sécurité ou décrochez votre prochain poste en quelques clics. Offres
              classiques, missions last minute et contrats générés automatiquement.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                <Link href="/auth/register">
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {/* <Button
								variant='outline'
								size='lg'
								className='border-border text-foreground hover:bg-secondary gap-2 px-8'>
								Voir la demo
							</Button> */}
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
              <div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-foreground">12K+</p>
                <p className="text-muted-foreground text-sm">Agents inscrits</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-foreground">850+</p>
                <p className="text-muted-foreground text-sm">Entreprises</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-foreground">98%</p>
                <p className="text-muted-foreground text-sm">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right - iPhone mockup */}
          <div className="relative flex-shrink-0">
            <div className="relative mx-auto w-xl">
              {/* Phone frame */}
              <div className="relative overflow-hidden">
                <Image
                  src={iphonemockup}
                  alt="SecuRecruit application mobile"
                  width={800}
                  height={720}
                  className="w-full"
                  priority
                />
              </div>
              {/* Floating badge */}
              <div className="-right-6 absolute top-12 rounded-xl border border-border bg-card px-4 py-3 shadow-xl">
                <p className="text-muted-foreground text-xs">Nouvelle mission</p>
                <p className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-sm">
                  Agent SSIAP 1
                </p>
                <div className="mt-1 flex items-center">
                  <Zap className="mr-1 inline-block h-3 w-3 text-primary" />
                  <p className="text-primary text-xs">Last Minute</p>
                </div>
              </div>
              {/* Floating badge bottom */}
              <div className="-left-0 absolute bottom-32 rounded-xl border border-border bg-card px-4 py-3 shadow-xl">
                <p className="text-muted-foreground text-xs">Contrat généré</p>
                <p className="font-[family-name:var(--font-heading)] font-semibold text-primary text-sm">
                  En 30 secondes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
