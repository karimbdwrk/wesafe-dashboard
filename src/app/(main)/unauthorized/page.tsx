"use client";

import { Suspense } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Building2, ShieldOff, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const roleConfig = {
  candidate: {
    icon: UserRound,
    badge: "Candidat",
    title: "Espace réservé aux administrateurs",
    description:
      "Votre compte est enregistré en tant que candidat sur WeSafe. Cet espace de gestion est exclusivement réservé aux équipes internes.",
    hint: "Pour accéder à votre espace candidat, utilisez l'application mobile WeSafe.",
  },
  company: {
    icon: Building2,
    badge: "Professionnel",
    title: "Espace réservé aux administrateurs",
    description:
      "Votre compte est enregistré en tant que professionnel (entreprise) sur WeSafe. Cet espace de gestion est exclusivement réservé aux équipes internes.",
    hint: "Pour accéder à votre espace entreprise, rendez-vous sur l'application WeSafe Pro.",
  },
  default: {
    icon: ShieldOff,
    badge: "Accès refusé",
    title: "Accès non autorisé",
    description: "Votre compte ne dispose pas des permissions nécessaires pour accéder à cet espace administrateur.",
    hint: "Contactez l'administrateur si vous pensez qu'il s'agit d'une erreur.",
  },
};

function UnauthorizedContent() {
  const params = useSearchParams();
  const role = params.get("role") as keyof typeof roleConfig | null;
  const config = roleConfig[role as keyof typeof roleConfig] ?? roleConfig.default;
  const Icon = config.icon;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-muted">
          <Icon className="size-8 text-primary" />
        </div>

        {/* Badge */}
        <Badge variant="secondary" className="mx-auto text-sm px-3 py-1">
          {config.badge}
        </Badge>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-bold text-2xl tracking-tight">{config.title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{config.description}</p>
        </div>

        {/* Hint card */}
        <div className="rounded-xl border bg-muted/50 px-5 py-4 text-left">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">💡 Note — </span>
            {config.hint}
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/dashboard/default"
          prefetch={false}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense>
      <UnauthorizedContent />
    </Suspense>
  );
}
