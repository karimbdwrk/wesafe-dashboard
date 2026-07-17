"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/pricing-data";

export function PricingSection() {
  return (
    <section id="tarifs" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-medium text-primary text-sm uppercase tracking-widest">Tarifs</p>
          <h2 className="mt-4 text-balance font-(family-name:--font-heading) font-bold text-3xl text-foreground md:text-4xl">
            Simple, transparent, adapté aux pros
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Gratuit à vie pour les candidats. Les entreprises choisissent leur formule.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.1 }}
              className={`relative flex flex-col gap-5 rounded-[24px] p-7 backdrop-blur-sm ${
                plan.highlight
                  ? "border-2 border-primary bg-card shadow-[0_20px_50px_-20px_var(--brand-glow)]"
                  : "border border-border/70 bg-card/60"
              }`}
            >
              {plan.badge && (
                <div className="-top-3 -translate-x-1/2 absolute left-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-primary to-brand-secondary px-3 py-0.5 font-bold text-primary-foreground text-xs">
                    <Star className="h-3 w-3" />
                    {plan.badge}
                  </span>
                </div>
              )}
              <div>
                <p className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wider">{plan.name}</p>
                <div className="mb-1 flex items-end gap-1">
                  <span className="font-(family-name:--font-heading) font-bold text-4xl text-foreground">
                    {plan.price}
                  </span>
                  <span className="mb-1.5 text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-xs">{plan.sub}</p>
              </div>

              <ul className="flex-1 space-y-2.5">
                {plan.features.slice(0, 6).map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-sm">
                    {f.ok ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-border" />
                    )}
                    <span className={f.ok ? "text-muted-foreground" : "text-muted-foreground/50"}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}>
                <Button
                  variant={plan.ctaVariant}
                  className={`w-full rounded-[16px] ${
                    plan.highlight ? "bg-linear-to-r from-primary to-brand-secondary text-primary-foreground" : ""
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/tarifs"
            className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Voir le détail complet des formules et options
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
