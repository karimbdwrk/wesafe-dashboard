import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
  typescript: true,
});

export const PLANS = {
  standard: {
    label: "Standard",
    priceId: process.env.STRIPE_PRICE_STANDARD ?? "",
    price: 49,
    interval: "mois",
    features: ["Jusqu'à 5 offres actives", "Accès aux candidatures", "Support email"],
  },
  standard_plus: {
    label: "Standard Plus",
    priceId: process.env.STRIPE_PRICE_STANDARD_PLUS ?? "",
    price: 99,
    interval: "mois",
    features: ["Jusqu'à 20 offres actives", "Offres Last Minute (5 crédits/mois)", "Support prioritaire"],
  },
  premium: {
    label: "Premium",
    priceId: process.env.STRIPE_PRICE_PREMIUM ?? "",
    price: 199,
    interval: "mois",
    features: ["Offres illimitées", "Offres Last Minute illimitées", "Account manager dédié", "Accès API"],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
