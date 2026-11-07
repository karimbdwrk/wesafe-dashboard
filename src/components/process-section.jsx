import { Briefcase, FileCheck, Search, UserPlus } from "lucide-react";

import { Reveal } from "@/components/landing/motion/reveal";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Créez votre profil",
    description:
      "Inscrivez-vous en quelques minutes. Renseignez vos certifications, votre expérience et vos disponibilités.",
  },
  {
    icon: Search,
    step: "02",
    title: "Explorez les offres",
    description:
      "Parcourez les offres classiques ou les missions last minute selon vos compétences et votre localisation.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Postulez en un clic",
    description: "Envoyez votre candidature directement depuis l'application. Suivez l'avancement en temps réel.",
  },
  {
    icon: Briefcase,
    step: "04",
    title: "Signez et travaillez",
    description: "Contrat généré automatiquement, signature électronique et vous êtes prêt a prendre votre poste.",
  },
];

export function ProcessSection() {
  return (
    <section id="comment-ca-marche" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-primary">Comment ça marche</p>
          <h2 className="mt-4 text-title text-foreground">Du profil au poste en 4 étapes</h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Un processus simplifié pour un recrutement efficace et rapide.
          </p>
        </Reveal>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute top-16 right-0 left-0 hidden h-px bg-border lg:block" />

          {/* Mobile : rail horizontal natif (suivi 1:1, inertie système) ; grille dès sm */}
          <Reveal className="snap-rail -mx-6 gap-4 px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 sm:mask-none lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.step} className="relative w-[78%] pt-2 text-center sm:w-auto">
                <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <step.icon className="h-6 w-6 text-primary" />
                  <span className="-top-2 -right-2 absolute flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-primary to-brand-secondary font-bold text-[0.6875rem] text-primary-foreground tabular-nums">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-headline text-foreground">{step.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
