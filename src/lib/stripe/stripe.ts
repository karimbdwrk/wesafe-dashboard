import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

export const PLANS = {
  standard: {
    label: "Standard",
    priceId: { monthly: "", yearly: "" },
    price: { monthly: 0, yearly: 0 },
    free: true,
    features: ["Jusqu'à 5 offres actives", "Accès aux candidatures", "Support email"],
  },
  standard_plus: {
    label: "Standard+",
    priceId: {
      monthly: process.env.STRIPE_PRICE_STANDARD_PLUS_MONTHLY ?? "",
      yearly: process.env.STRIPE_PRICE_STANDARD_PLUS_YEARLY ?? "",
    },
    price: { monthly: 19, yearly: 199 },
    highlight: true,
    features: ["Jusqu'à 20 offres actives", "5 crédits Last Minute / mois", "Support prioritaire"],
  },
  premium: {
    label: "Premium",
    priceId: {
      monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? "",
      yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY ?? "",
    },
    price: { monthly: 25, yearly: 249 },
    features: ["Offres illimitées", "Crédits Last Minute illimités", "Account manager dédié", "Accès API"],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingCycle = "monthly" | "yearly";
