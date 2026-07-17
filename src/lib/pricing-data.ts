import { Megaphone, Zap } from "lucide-react";

export const PLANS = [
  {
    name: "Standard",
    price: "0 €",
    period: "/mois",
    sub: "Sans engagement · Gratuit pour toujours",
    highlight: false,
    badge: null,
    features: [
      { label: "Création de profil entreprise", ok: true },
      { label: "Publication d'annonces classiques", ok: true },
      { label: "Réception de candidatures", ok: true },
      { label: "Messagerie intégrée", ok: true },
      { label: "Annonces Last Minute", ok: false },
      { label: "Publications illimitées", ok: false },
      { label: "Statistiques avancées", ok: false },
      { label: "Badge entreprise vérifiée", ok: false },
      { label: "Génération de contrats", ok: false },
      { label: "Support prioritaire 7j/7", ok: false },
    ],
    cta: "Commencer gratuitement",
    ctaHref: "/auth/login",
    ctaVariant: "outline",
  },
  {
    name: "Standard+",
    price: "19 €",
    period: "/mois TTC",
    sub: "ou 199 € TTC/an — économisez 13 %",
    highlight: true,
    badge: "Populaire",
    features: [
      { label: "Tout ce qui est inclus dans Standard", ok: true },
      { label: "Annonces Last Minute", ok: true },
      { label: "Publications illimitées", ok: true },
      { label: "Statistiques avancées", ok: true },
      { label: "Badge entreprise vérifiée", ok: true },
      { label: "Génération de contrats", ok: true },
      { label: "Mise en avant des annonces", ok: false },
      { label: "Dashboard analytique complet", ok: false },
      { label: "Support prioritaire 7j/7", ok: false },
      { label: "Accès API WeSafe", ok: false },
    ],
    cta: "Choisir Standard+",
    ctaHref: "/auth/login",
    ctaVariant: "default",
  },
  {
    name: "Premium",
    price: "25 €",
    period: "/mois TTC",
    sub: "ou 249 € TTC/an — économisez 17 %",
    highlight: false,
    badge: null,
    features: [
      { label: "Tout ce qui est inclus dans Standard+", ok: true },
      { label: "Mise en avant des annonces", ok: true },
      { label: "Dashboard analytique complet", ok: true },
      { label: "Support prioritaire 7j/7", ok: true },
      { label: "Accès API WeSafe", ok: true },
      { label: "Annonces Last Minute", ok: true },
      { label: "Publications illimitées", ok: true },
      { label: "Statistiques avancées", ok: true },
      { label: "Badge entreprise vérifiée", ok: true },
      { label: "Génération de contrats", ok: true },
    ],
    cta: "Choisir Premium",
    ctaHref: "/auth/login",
    ctaVariant: "outline",
  },
] as const;

export const ADD_ONS = [
  {
    icon: Zap,
    name: "Pack Last Minute",
    desc: "10 crédits pour publier des annonces urgentes (délai < 7 jours). Valables 12 mois.",
    price: "30,00 € TTC",
    detail: "3,00 € / crédit",
    req: "Standard+ ou Premium requis",
  },
  {
    icon: Megaphone,
    name: "Sponsoring d'annonce",
    desc: "Mettez une annonce en avant dans les résultats de recherche et sur la page d'accueil.",
    price: "À partir de 9,99 € TTC",
    detail: "1 sem. · 2 sem. · 1 mois",
    req: "Disponible sur tous les plans",
  },
] as const;

export const FAQ = [
  {
    q: "Les candidats doivent-ils payer quoi que ce soit ?",
    a: "Non, jamais. L'inscription, la consultation des offres, les candidatures et la messagerie sont entièrement gratuits pour les candidats. Aucune carte bancaire n'est demandée.",
  },
  {
    q: "Comment fonctionnent les crédits Last Minute ?",
    a: "Un crédit est consommé à chaque publication d'une annonce Last Minute (délai de mission < 7 jours). Les crédits achetés sont valables 12 mois et non transférables. Les crédits non utilisés à expiration sont perdus sans remboursement.",
  },
  {
    q: "Puis-je changer de formule à tout moment ?",
    a: "Oui. Vous pouvez passer à une formule supérieure à tout moment (prise d'effet immédiate, facturation au prorata). La rétrogradation prend effet à la prochaine date de renouvellement.",
  },
  {
    q: "Quelles sont les conditions d'engagement ?",
    a: "Aucun engagement pour les abonnements mensuels. L'abonnement annuel est payé en une fois et non remboursable, sauf dans les 14 jours (droit de rétractation légal). Les détails complets sont dans nos CGV.",
  },
  {
    q: "Comment est géré le paiement ?",
    a: "Les paiements sont traités de manière sécurisée par Stripe (certifié PCI-DSS niveau 1). WeSafe ne stocke aucune donnée bancaire. Vous recevez une facture pour chaque transaction.",
  },
  {
    q: "Où trouver les détails complets sur les tarifs et conditions ?",
    a: "Toutes les conditions tarifaires, les modalités de paiement et les règles de remboursement sont détaillées dans nos Conditions Générales de Vente.",
  },
] as const;
