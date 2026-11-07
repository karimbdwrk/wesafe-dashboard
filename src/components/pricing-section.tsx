import Link from "next/link";

import { ArrowRight, CheckCircle2, Star, XCircle } from "lucide-react";

import { Press } from "@/components/landing/motion/press";
import { Reveal } from "@/components/landing/motion/reveal";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/pricing-data";

export function PricingSection() {
  return (
    <section id="tarifs" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-primary">Tarifs</p>
          <h2 className="mt-4 text-title text-foreground">Simple, transparent, adapté aux pros</h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Gratuit à vie pour les candidats. Les entreprises choisissent leur formule.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal
              key={plan.name}
              index={i}
              className={`relative flex flex-col gap-5 rounded-[24px] p-7 ${
                plan.highlight
                  ? "border-2 border-primary bg-card shadow-[0_20px_50px_-20px_var(--brand-glow)]"
                  : "border border-border/70 bg-card"
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
                <p className="mb-2 text-eyebrow text-muted-foreground">{plan.name}</p>
                <div className="mb-1 flex items-end gap-1">
                  <span className="font-(family-name:--font-heading) font-bold text-[2.5rem] text-foreground leading-none tracking-[-0.03em] tabular-nums">
                    {plan.price}
                  </span>
                  <span className="mb-0.5 text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="mt-2 text-muted-foreground text-xs tracking-[0.005em]">{plan.sub}</p>
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

              <Press className="flex w-full">
                <Link href={plan.ctaHref} className="w-full">
                  <Button
                    variant={plan.ctaVariant}
                    className={`h-11 w-full rounded-[16px] font-semibold tracking-[-0.01em] ${
                      plan.highlight ? "bg-linear-to-r from-primary to-brand-secondary text-primary-foreground" : ""
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Press>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Press>
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Voir le détail complet des formules et options
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Press>
        </div>
      </div>
    </section>
  );
}
