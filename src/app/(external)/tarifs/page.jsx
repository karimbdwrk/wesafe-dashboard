import Link from "next/link";

import { ArrowRight, Building2, CheckCircle2, Info, Megaphone, Star, UserCheck, XCircle, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

const PLANS = [
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
];

const ADD_ONS = [
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
];

const FAQ = [
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
];

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="mt-14 border-border border-b bg-primary py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 font-medium text-primary-foreground/60 text-sm uppercase tracking-widest">Tarifs</p>
          <h1 className="font-(family-name:--font-heading) mb-5 font-bold text-4xl text-primary-foreground md:text-5xl">
            Simple, transparent, adapté aux pros
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/75 leading-relaxed">
            Les entreprises choisissent leur formule. Les candidats accèdent à toutes les fonctionnalités{" "}
            <strong className="text-primary-foreground">gratuitement</strong>, sans conditions.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-6 py-16">
        {/* Candidats vs Entreprises */}
        <section aria-label="Accès selon le profil" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <UserCheck className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-(family-name:--font-heading) mb-1 font-bold text-foreground text-xl">Candidats</h2>
              <p className="mb-2 font-bold text-3xl text-primary">100 % gratuit</p>
              <p className="text-muted-foreground text-sm leading-6">
                WeSafe est entièrement gratuit pour les agents et professionnels de la sécurité. Créez votre profil,
                déposez vos documents, postulez aux offres et signez vos contrats — sans jamais payer.
              </p>
            </div>
            <ul className="mt-2 space-y-2" aria-label="Fonctionnalités incluses">
              {[
                "Inscription & profil complet",
                "Consultation de toutes les offres",
                "Candidatures illimitées",
                "Messagerie avec les entreprises",
                "Signature électronique de contrats",
                "Gestion des documents (CNAPS, SSIAP…)",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-muted-foreground text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full gap-2">
                  Créer mon profil candidat
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-(family-name:--font-heading) mb-1 font-bold text-foreground text-xl">Entreprises</h2>
              <p className="mb-2 font-bold text-3xl text-primary">À partir de 0 €</p>
              <p className="text-muted-foreground text-sm leading-6">
                Les entreprises bénéficient d'un accès de base gratuit et peuvent upgrader pour accéder aux outils
                avancés : annonces Last Minute, génération de contrats, statistiques et support dédié.
              </p>
            </div>
            <ul className="mt-2 space-y-2" aria-label="Fonctionnalités incluses">
              {[
                "Plan Standard gratuit, sans engagement",
                "Plans payants dès 19 €/mois",
                "Annonces Last Minute en option",
                "Sponsoring d'annonces disponible",
                "Facturation sécurisée par Stripe",
                "Résiliation à tout moment (mensuel)",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-muted-foreground text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/auth/login">
                <Button className="w-full gap-2">
                  Créer mon compte entreprise
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Grille tarifaire entreprises */}
        <section aria-labelledby="plans-heading">
          <div className="mb-10 text-center">
            <h2
              id="plans-heading"
              className="font-(family-name:--font-heading) mb-2 font-bold text-3xl text-foreground"
            >
              Formules Entreprises
            </h2>
            <p className="text-muted-foreground">Tous les prix sont TTC. Paiement sécurisé par Stripe.</p>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col gap-5 rounded-2xl p-7 ${
                  plan.highlight ? "border-2 border-primary bg-card shadow-lg" : "border border-border bg-card"
                }`}
              >
                {plan.badge && (
                  <div className="-top-3 -translate-x-1/2 absolute left-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 font-bold text-primary-foreground text-xs">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div>
                  <p className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    {plan.name}
                  </p>
                  <div className="mb-1 flex items-end gap-1">
                    <span className="font-(family-name:--font-heading) font-bold text-4xl text-foreground">
                      {plan.price}
                    </span>
                    <span className="mb-1.5 text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{plan.sub}</p>
                </div>

                <ul className="flex-1 space-y-2.5" aria-label={`Fonctionnalités du plan ${plan.name}`}>
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2 text-sm">
                      {f.ok ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-border" aria-hidden="true" />
                      )}
                      <span className={f.ok ? "text-muted-foreground" : "text-muted-foreground/50"}>
                        {!f.ok && <span className="sr-only">Non inclus : </span>}
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.ctaHref}>
                  <Button
                    variant={plan.ctaVariant}
                    className={`w-full ${plan.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Options supplémentaires */}
        <section aria-labelledby="addons-heading">
          <div className="mb-8 text-center">
            <h2
              id="addons-heading"
              className="font-(family-name:--font-heading) mb-2 font-bold text-2xl text-foreground"
            >
              Options supplémentaires
            </h2>
            <p className="text-muted-foreground text-sm">Disponibles en complément de votre abonnement</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {ADD_ONS.map((addon) => (
              <div key={addon.name} className="flex gap-4 rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <addon.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{addon.name}</h3>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-foreground text-sm">{addon.price}</p>
                      <p className="text-muted-foreground text-xs">{addon.detail}</p>
                    </div>
                  </div>
                  <p className="mb-2 text-muted-foreground text-sm">{addon.desc}</p>
                  <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground text-xs">
                    {addon.req}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bandeau CGV */}
        <section
          role="note"
          aria-label="Conditions tarifaires"
          className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-muted px-8 py-6 sm:flex-row sm:items-center"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted-foreground/10">
            <Info className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="mb-0.5 font-semibold text-foreground">Conditions tarifaires complètes</p>
            <p className="text-muted-foreground text-sm leading-6">
              Les prix affichés sur cette page sont donnés à titre indicatif et susceptibles d&apos;évoluer. Les
              conditions contractuelles précises (TVA, modalités de paiement, remboursement, résiliation) sont définies
              dans nos{" "}
              <Link
                href="/conditions-generales-de-vente"
                className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-muted-foreground"
              >
                Conditions Générales de Vente
              </Link>
              .
            </p>
          </div>
          <Link href="/conditions-generales-de-vente" className="shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              Lire les CGV
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <div className="mb-8 text-center">
            <h2 id="faq-heading" className="font-(family-name:--font-heading) font-bold text-2xl text-foreground">
              Questions fréquentes
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-card p-5">
                <p className="mb-2 font-semibold text-foreground text-sm">{item.q}</p>
                <p className="text-muted-foreground text-sm leading-6">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="rounded-2xl border border-border bg-card p-10 text-center">
          <h2 className="font-(family-name:--font-heading) mb-3 font-bold text-2xl text-foreground">
            Prêt à démarrer ?
          </h2>
          <p className="mx-auto mb-7 max-w-md text-muted-foreground text-sm leading-6">
            Créez votre compte gratuitement et accédez immédiatement à la plateforme. Aucune carte bancaire requise pour
            commencer.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/auth/login">
              <Button size="lg" className="gap-2">
                Créer un compte gratuit
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contacter l&apos;équipe commerciale
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
