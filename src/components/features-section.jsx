"use client";

import { motion } from "framer-motion";
import { Clock, FileText, Search, Shield, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Processus de recrutement",
    description:
      "Un parcours de recrutement structure et transparent, du depot de candidature a l'embauche, entierement digitalise.",
  },
  {
    icon: FileText,
    title: "Generation de contrats",
    description:
      "Generez vos contrats de travail en quelques clics grace a nos modeles pre-remplis et conformes a la legislation.",
  },
  {
    icon: Clock,
    title: "Offres Last Minute",
    description: "Besoin urgent d'un agent ? Publiez une offre last minute et recevez des candidatures en temps reel.",
  },
  {
    icon: Shield,
    title: "Profils verifies",
    description: "Chaque agent est verifie : diplomes, certifications CNAPS, experience. Recrutez en toute confiance.",
  },
  {
    icon: Zap,
    title: "Matching intelligent",
    description:
      "Notre algorithme vous propose les candidats les plus pertinents selon vos criteres et votre localisation.",
  },
  {
    icon: Users,
    title: "Gestion d'equipe",
    description:
      "Planifiez vos equipes, gerez les plannings et suivez la disponibilite de vos agents depuis l'application.",
  },
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-medium text-primary text-sm uppercase tracking-widest">Fonctionnalites</p>
          <h2 className="mt-4 text-balance font-(family-name:--font-heading) font-bold text-3xl text-foreground md:text-4xl">
            Tout ce dont vous avez besoin pour recruter dans la securite
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une plateforme complete pensee pour les professionnels de la securite privee.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut", delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
              className="group rounded-[24px] border border-border/70 bg-card/60 p-8 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:shadow-[0_12px_40px_-16px_var(--brand-glow)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-brand-accent/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-(family-name:--font-heading) font-semibold text-foreground text-lg">
                {feature.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
