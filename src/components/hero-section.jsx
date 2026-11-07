import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { AmbientBackground } from "@/components/ambient-background";
import { Press } from "@/components/landing/motion/press";
import { Reveal } from "@/components/landing/motion/reveal";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <AmbientBackground variant="hero" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Titre visible dès le premier rendu (LCP) : seul le déplacement s'anime */}
            <Reveal fade={false} y={12}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-1.5 font-medium text-[0.8125rem] text-muted-foreground tracking-[0.005em] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Disponible sur App Store & Play Store
              </div>

              <h1 className="text-display text-foreground">
                Le recrutement en
                <span className="bg-linear-to-r from-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
                  {" "}
                  sécurité
                </span>
                , réinventé.
              </h1>
            </Reveal>

            <Reveal index={1}>
              <p className="mt-6 max-w-xl text-body-lg text-muted-foreground lg:max-w-lg">
                Trouvez les meilleurs agents de sécurité ou décrochez votre prochain poste en quelques clics. Offres
                classiques, missions last minute et contrats générés automatiquement.
              </p>
            </Reveal>

            <Reveal index={2} className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Press lift={2}>
                <Button
                  asChild
                  className="h-[52px] gap-2 rounded-[16px] bg-linear-to-r from-primary to-brand-secondary px-8 font-semibold text-base text-primary-foreground tracking-[-0.01em] shadow-[0_8px_30px_-8px_var(--brand-glow)] transition-[box-shadow,filter] hover:shadow-[0_12px_36px_-6px_var(--brand-glow)] hover:brightness-110"
                >
                  <Link href="/auth/register">
                    Commencer gratuitement
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Press>
              <Press lift={2}>
                <Button
                  asChild
                  variant="outline"
                  className="h-[52px] rounded-[16px] border-border bg-background/50 px-8 font-semibold text-base text-foreground tracking-[-0.01em] backdrop-blur-md hover:bg-secondary"
                >
                  <Link href="#comment-ca-marche">Comment ça marche</Link>
                </Button>
              </Press>
            </Reveal>

            {/* Stats — désactivés : chiffres à rétablir une fois la vraie traction disponible.
            <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
              <div>
                <p className="font-(family-name:--font-heading) font-bold text-2xl text-foreground">12K+</p>
                <p className="text-muted-foreground text-sm">Agents inscrits</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="font-(family-name:--font-heading) font-bold text-2xl text-foreground">850+</p>
                <p className="text-muted-foreground text-sm">Entreprises</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="font-(family-name:--font-heading) font-bold text-2xl text-foreground">98%</p>
                <p className="text-muted-foreground text-sm">Satisfaction</p>
              </div>
            </div>
            */}
          </div>

          {/* Right - mockup image : monte et se pose, comme les autres visuels */}
          <Reveal fade={false} y={32} scale={0.96} className="relative flex-shrink-0">
            <div className="relative mx-auto w-[420px] sm:w-140">
              <Image
                src="https://hzvbylhdptwgblpdondm.supabase.co/storage/v1/object/public/dashboard-assets/mockup-hero-wesafe.png"
                alt="Aperçu de l'application WeSafe sur MacBook et iPhone"
                width={1200}
                height={900}
                priority
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
