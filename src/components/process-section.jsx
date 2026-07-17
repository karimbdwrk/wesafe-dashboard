"use client";

import { motion } from "framer-motion";
import { Briefcase, FileCheck, Search, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Creez votre profil",
    description:
      "Inscrivez-vous en quelques minutes. Renseignez vos certifications, votre experience et vos disponibilites.",
  },
  {
    icon: Search,
    step: "02",
    title: "Explorez les offres",
    description:
      "Parcourez les offres classiques ou les missions last minute selon vos competences et votre localisation.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Postulez en un clic",
    description: "Envoyez votre candidature directement depuis l'application. Suivez l'avancement en temps reel.",
  },
  {
    icon: Briefcase,
    step: "04",
    title: "Signez et travaillez",
    description: "Contrat genere automatiquement, signature electronique et vous etes pret a prendre votre poste.",
  },
];

export function ProcessSection() {
  return (
    <section id="comment-ca-marche" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-medium text-primary text-sm uppercase tracking-widest">Comment ca marche</p>
          <h2 className="mt-4 text-balance font-(family-name:--font-heading) font-bold text-3xl text-foreground md:text-4xl">
            Du profil au poste en 4 etapes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Un processus simplifie pour un recrutement efficace et rapide.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute top-16 right-0 left-0 hidden h-px bg-border lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <step.icon className="h-6 w-6 text-primary" />
                  <span className="-top-2 -right-2 absolute flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-primary to-brand-secondary font-bold text-primary-foreground text-xs">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-(family-name:--font-heading) font-semibold text-foreground text-lg">
                  {step.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
