"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { AmbientBackground } from "@/components/ambient-background";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <AmbientBackground variant="hero" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-12">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-1.5 text-muted-foreground text-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Disponible sur App Store & Play Store
            </div>

            <h1 className="text-balance font-(family-name:--font-heading) font-bold text-4xl text-foreground leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Le recrutement en
              <span className="bg-linear-to-r from-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
                {" "}
                sécurité
              </span>
              , réinventé.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed lg:max-w-lg">
              Trouvez les meilleurs agents de sécurité ou décrochez votre prochain poste en quelques clics. Offres
              classiques, missions last minute et contrats générés automatiquement.
            </p>

            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                asChild
                className="h-[52px] gap-2 rounded-[16px] bg-linear-to-r from-primary to-brand-secondary px-8 text-base text-primary-foreground shadow-[0_8px_30px_-8px_var(--brand-glow)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-6px_var(--brand-glow)] hover:brightness-110"
              >
                <Link href="/auth/register">
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-[52px] rounded-[16px] border-border bg-background/50 px-8 text-base text-foreground backdrop-blur-sm hover:bg-secondary"
              >
                <Link href="#comment-ca-marche">Comment ça marche</Link>
              </Button>
            </div>

            {/* Stats */}
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
          </motion.div>

          {/* Right - mockup image */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: 0.15,
            }}
            className="relative flex-shrink-0"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
