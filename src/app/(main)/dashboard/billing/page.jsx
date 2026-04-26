"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { CheckCircle2, CreditCard, ExternalLink, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/supabaseClient";

const PLANS = {
  standard: {
    label: "Standard",
    price: 49,
    color: "border-border",
    badgeClass: "bg-muted text-muted-foreground",
    features: ["Jusqu'à 5 offres actives", "Accès aux candidatures", "Support email"],
  },
  standard_plus: {
    label: "Standard Plus",
    price: 99,
    color: "border-blue-400 dark:border-blue-600",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    features: ["Jusqu'à 20 offres actives", "5 crédits Last Minute / mois", "Support prioritaire"],
    highlight: true,
  },
  premium: {
    label: "Premium",
    price: 199,
    color: "border-amber-400 dark:border-amber-600",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    features: ["Offres illimitées", "Crédits Last Minute illimités", "Account manager dédié", "Accès API"],
  },
};

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [creditsLoading, setCreditsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Abonnement activé ! Bienvenue sur WeSafe.");
      router.replace("/dashboard/billing");
    }
    if (searchParams.get("credits_success") === "true") {
      toast.success("10 crédits Last Minute ajoutés à votre compte !");
      router.replace("/dashboard/billing");
    }
    if (searchParams.get("cancelled") === "true") {
      toast.info("Paiement annulé.");
      router.replace("/dashboard/billing");
    }
  }, [searchParams, router]);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);
      const { data } = await supabase
        .from("companies")
        .select("id, name, subscription_status, stripe_customer_id, last_minute_credits")
        .eq("id", user.id)
        .maybeSingle();
      setCompany(data);
      setLoading(false);
    }
    init();
  }, []);

  async function handleCheckout(planKey) {
    if (!company?.id) return;
    setCheckoutLoading(planKey);
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: company.id, planKey }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error(data.error ?? "Erreur lors de la création de la session.");
      setCheckoutLoading(null);
    }
  }

  async function handleBuyCredits() {
    if (!company?.id) return;
    setCreditsLoading(true);
    const res = await fetch("/api/stripe/buy-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: company.id }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error(data.error ?? "Erreur lors de la création de la session.");
      setCreditsLoading(false);
    }
  }

  async function handlePortal() {
    if (!company?.id) return;
    setPortalLoading(true);
    const res = await fetch("/api/stripe/create-portal-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: company.id }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error(data.error ?? "Erreur lors de l'ouverture du portail.");
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const currentPlan = company?.subscription_status ?? "standard";
  const hasStripeCustomer = !!company?.stripe_customer_id;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Facturation</h1>
          <p className="text-muted-foreground text-sm">Gérez votre abonnement et vos paiements.</p>
        </div>
        {hasStripeCustomer && (
          <Button variant="outline" size="sm" onClick={handlePortal} disabled={portalLoading}>
            {portalLoading ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <ExternalLink className="mr-1.5 size-3.5" />
            )}
            Gérer l'abonnement
          </Button>
        )}
      </div>

      {/* Plan actuel */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-muted-foreground text-xs">Plan actuel</p>
            <p className="font-bold text-lg">{PLANS[currentPlan]?.label ?? currentPlan}</p>
          </div>
          <Badge variant="outline" className={`px-3 py-1 ${PLANS[currentPlan]?.badgeClass ?? ""}`}>
            Actif
          </Badge>
        </div>
        {currentPlan !== "standard" && (
          <>
            <Separator className="my-4" />
            <p className="text-muted-foreground text-sm">
              Pour modifier, annuler ou mettre à jour votre abonnement, utilisez le portail de facturation.
            </p>
          </>
        )}
      </div>

      {/* Plans */}
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Choisir un plan</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(PLANS).map(([key, plan]) => {
            const isCurrent = key === currentPlan;
            const isLoading = checkoutLoading === key;

            return (
              <div
                key={key}
                className={`relative flex flex-col gap-4 rounded-xl border-2 bg-card p-5 transition-shadow ${
                  plan.highlight ? plan.color : isCurrent ? "border-primary" : "border-border"
                } ${plan.highlight && !isCurrent ? "shadow-md" : ""}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-0.5 font-semibold text-white text-xs">
                    Populaire
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-base">{plan.label}</p>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-bold text-foreground text-xl">{plan.price}€</span> / mois
                    </p>
                  </div>
                  {isCurrent && (
                    <Badge variant="outline" className={plan.badgeClass}>
                      Actuel
                    </Badge>
                  )}
                </div>

                <ul className="flex flex-col gap-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plan actuel
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                      disabled={isLoading || !!checkoutLoading}
                      onClick={() => handleCheckout(key)}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                      ) : (
                        <CreditCard className="mr-1.5 size-3.5" />
                      )}
                      {key === "standard" ? "Rétrograder" : "Souscrire"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Crédits Last Minute */}
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Crédits Last Minute</h2>
        <div className="rounded-xl border bg-card p-5">
          {/* Balance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Zap className="size-5 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold">Solde actuel</p>
                <p className="text-muted-foreground text-sm">
                  Utilisés pour mettre en avant une offre pendant 48h avec badge urgence.
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl tabular-nums">{company?.last_minute_credits ?? 0}</p>
              <p className="text-muted-foreground text-xs">
                crédit{(company?.last_minute_credits ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Pack purchase */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-base">Pack 10 crédits</p>
                <Badge className="bg-green-100 font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  -40%
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-2xl">30€</span>
                <span className="text-muted-foreground text-sm line-through">50€</span>
                <span className="text-muted-foreground text-xs">(au lieu de 5€/crédit)</span>
              </div>
              <p className="text-muted-foreground text-xs">Économisez 20€ par rapport au tarif unitaire</p>
            </div>
            <Button
              className="shrink-0 bg-amber-500 text-white hover:bg-amber-600"
              disabled={creditsLoading}
              onClick={handleBuyCredits}
            >
              {creditsLoading ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : (
                <Zap className="mr-1.5 size-3.5" />
              )}
              Acheter le pack
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
