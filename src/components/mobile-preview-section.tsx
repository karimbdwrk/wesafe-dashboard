"use client";

import { motion } from "framer-motion";
import { Bell, FileCheck, MousePointerClick, Zap } from "lucide-react";

import { IphoneFrame } from "@/components/iphone-frame";

const callouts = [
  {
    icon: MousePointerClick,
    title: "Postulez en un clic",
    description: "Envoyez votre candidature directement depuis l'application et suivez son avancement en temps réel.",
  },
  {
    icon: Zap,
    title: "Missions Last Minute",
    description: "Recevez une alerte dès qu'une mission urgente correspond à votre profil et votre localisation.",
  },
  {
    icon: Bell,
    title: "Notifications en temps réel",
    description: "Nouvelles offres, réponses des recruteurs, rappels de mission : tout arrive directement sur mobile.",
  },
];

const jobs = [
  { title: "Agent SSIAP 1", place: "Paris 8ème", tag: "Last Minute" },
  { title: "Agent de sécurité", place: "Boulogne", tag: null },
  { title: "Agent cynophile", place: "Créteil", tag: null },
];

function PhoneScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-card p-3.5 pt-9 text-left">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold text-[10px] text-foreground">Offres à proximité</p>
        <div className="h-5 w-5 rounded-full bg-linear-to-br from-primary to-brand-accent" />
      </div>

      <div className="space-y-2">
        {jobs.map((job) => (
          <div key={job.title} className="rounded-xl border border-border/50 bg-background/50 p-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-[10px] text-foreground">{job.title}</p>
                <p className="text-[8px] text-muted-foreground">{job.place}</p>
              </div>
              {job.tag && (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[7px] text-primary-foreground">
                  <Zap className="h-2 w-2" />
                  {job.tag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 p-2">
        <FileCheck className="h-3 w-3 text-success" />
        <span className="text-[8px] text-foreground/80">Candidature envoyée avec succès</span>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-1 pt-3">
        {["Accueil", "Offres", "Profil"].map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1 py-1">
            <div className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-primary" : "bg-muted-foreground/30"}`} />
            <span className="text-[7px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobilePreviewSection() {
  return (
    <section className="relative border-border/60 border-y bg-secondary/30 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <p className="font-medium text-primary text-sm uppercase tracking-widest">Application mobile</p>
            <h2 className="mt-4 text-balance font-(family-name:--font-heading) font-bold text-3xl text-foreground md:text-4xl">
              Toutes les missions dans votre poche
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              L&apos;application WeSafe suit les candidats partout : nouvelles offres, candidatures et contrats,
              accessibles en quelques secondes.
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="order-1 flex justify-center lg:order-2"
          >
            <IphoneFrame className="w-[260px]">
              <PhoneScreen />
            </IphoneFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
