"use client";

import { motion } from "framer-motion";
import { Building2, Clock, Star, Users } from "lucide-react";

const stats = [
  { icon: Users, value: "12K+", label: "Agents inscrits" },
  { icon: Building2, value: "850+", label: "Entreprises partenaires" },
  { icon: Star, value: "98%", label: "Satisfaction utilisateurs" },
  { icon: Clock, value: "<30s", label: "Génération de contrat" },
];

export function StatsSection() {
  return (
    <section className="relative border-border/60 border-y bg-secondary/40 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 text-center md:flex-row md:items-center md:gap-3 md:text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-(family-name:--font-heading) font-bold text-2xl text-foreground">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
