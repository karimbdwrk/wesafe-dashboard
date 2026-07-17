"use client";

import { motion } from "framer-motion";
import { BarChart3, FileText, LayoutGrid, Search, Sparkles, Users } from "lucide-react";

import { MacbookFrame } from "@/components/macbook-frame";

const callouts = [
  {
    icon: Sparkles,
    title: "Matching intelligent",
    description: "Les candidats les plus pertinents remontent automatiquement selon vos critères et la localisation.",
  },
  {
    icon: FileText,
    title: "Contrats générés automatiquement",
    description: "Modèles pré-remplis et conformes à la législation, prêts à signer en quelques clics.",
  },
  {
    icon: BarChart3,
    title: "Statistiques avancées",
    description: "Suivez vos publications, candidatures et taux de conversion depuis un seul tableau de bord.",
  },
];

const rows = [
  { name: "Agent SSIAP 1", city: "Paris", status: "Actif" },
  { name: "Agent cynophile", city: "Lyon", status: "En attente" },
  { name: "Rondier de nuit", city: "Marseille", status: "Actif" },
  { name: "Chef de poste", city: "Toulouse", status: "Actif" },
];

const bars = [40, 65, 50, 80, 60, 90, 70];

function DashboardScreen() {
  return (
    <div className="flex h-full w-full bg-card text-left">
      <div className="hidden w-14 flex-col items-center gap-5 border-border/60 border-r bg-secondary/60 py-5 sm:flex">
        <div className="h-6 w-6 rounded-lg bg-linear-to-br from-primary to-brand-accent" />
        {[
          { Icon: LayoutGrid, name: "grid" },
          { Icon: Search, name: "search" },
          { Icon: Users, name: "users" },
          { Icon: FileText, name: "files" },
        ].map(({ Icon, name }, i) => (
          <div key={name} className={`rounded-lg p-2 ${i === 0 ? "bg-primary/15" : "bg-background/50"}`}>
            <Icon className={`h-3.5 w-3.5 ${i === 0 ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        ))}
      </div>
      <div className="flex-1 space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-2.5 w-28 rounded-full bg-foreground/15" />
            <div className="mt-1.5 h-2 w-20 rounded-full bg-foreground/8" />
          </div>
          <div className="h-7 w-7 rounded-full bg-linear-to-br from-primary to-brand-accent" />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Offres actives", value: "24" },
            { label: "Candidatures", value: "312" },
            { label: "Taux réponse", value: "91%" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border/60 bg-background/60 p-2.5">
              <p className="font-semibold text-foreground text-xs">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-1.5 rounded-xl border border-border/50 bg-background/40 p-3">
          {bars.map((h) => (
            <div
              key={h}
              className="flex-1 rounded-sm bg-linear-to-t from-primary/70 to-brand-accent/60"
              style={{ height: `${h * 0.4}px` }}
            />
          ))}
        </div>

        <div className="space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-2.5 py-1.5"
            >
              <span className="text-[9px] text-foreground/80">
                {row.name} · {row.city}
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[7px] ${
                  row.status === "Actif" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                }`}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPreviewSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <MacbookFrame tilt={false} className="mx-auto w-full max-w-xl">
              <DashboardScreen />
            </MacbookFrame>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <p className="font-medium text-primary text-sm uppercase tracking-widest">Dashboard entreprise</p>
            <h2 className="mt-4 text-balance font-(family-name:--font-heading) font-bold text-3xl text-foreground md:text-4xl">
              Pilotez votre recrutement depuis un seul écran
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Offres, candidatures, contrats et statistiques : tout est centralisé pour vous faire gagner un temps
              précieux.
            </p>

            <div className="mt-10 space-y-6">
              {callouts.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
