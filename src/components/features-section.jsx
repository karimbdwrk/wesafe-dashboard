import { Clock, FileText, Search, Shield, Users, Zap } from "lucide-react";

import { Press } from "@/components/landing/motion/press";
import { Reveal } from "@/components/landing/motion/reveal";

const features = [
  {
    icon: Search,
    title: "Processus de recrutement",
    description:
      "Un parcours de recrutement structuré et transparent, du dépôt de candidature à l'embauche, entièrement digitalisé.",
  },
  {
    icon: FileText,
    title: "Génération de contrats",
    description:
      "Générez vos contrats de travail en quelques clics grâce à nos modèles pré-remplis et conformes à la législation.",
  },
  {
    icon: Clock,
    title: "Offres Last Minute",
    description: "Besoin urgent d'un agent ? Publiez une offre last minute et recevez des candidatures en temps réel.",
  },
  {
    icon: Shield,
    title: "Profils vérifiés",
    description: "Chaque agent est vérifié : diplômes, certifications CNAPS, expérience. Recrutez en toute confiance.",
  },
  {
    icon: Zap,
    title: "Matching intelligent",
    description:
      "Notre algorithme vous propose les candidats les plus pertinents selon vos critères et votre localisation.",
  },
  {
    icon: Users,
    title: "Gestion d'équipe",
    description:
      "Planifiez vos équipes, gérez les plannings et suivez la disponibilité de vos agents depuis l'application.",
  },
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-primary">Fonctionnalités</p>
          <h2 className="mt-4 text-title text-foreground">
            Tout ce dont vous avez besoin pour recruter dans la sécurité
          </h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Une plateforme complète pensée pour les professionnels de la sécurité privée.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} index={i % 3} className="flex">
              <Press lift={4} tap={false} className="flex w-full">
                <div className="w-full rounded-[24px] border border-border/70 bg-card p-8 shadow-sm transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-[0_12px_40px_-16px_var(--brand-glow)]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-brand-accent/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-headline text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Press>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
