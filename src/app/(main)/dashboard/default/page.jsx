"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  BarChart2,
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  MessageSquare,
  Plus,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/supabaseClient";

// ─── Quick links par rôle ─────────────────────────────────────────────────────

const COMPANY_LINKS = [
  {
    label: "Mes offres d'emploi",
    description: "Gérez et suivez toutes vos offres",
    href: "/dashboard/my-jobs",
    icon: Briefcase,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Publier une offre",
    description: "Créer une nouvelle annonce",
    href: "/dashboard/my-jobs?new=true",
    icon: Plus,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    label: "Messagerie",
    description: "Vos échanges avec les candidats",
    href: "/dashboard/messages",
    icon: MessageSquare,
    color: "bg-violet-500/10 text-violet-500",
  },
];

const ADMIN_LINKS = [
  {
    label: "Utilisateurs",
    description: "Gérer tous les comptes",
    href: "/dashboard/users",
    icon: Users,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Offres d'emploi",
    description: "Toutes les annonces publiées",
    href: "/dashboard/jobs",
    icon: Briefcase,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    label: "Messagerie",
    description: "Conversations en cours",
    href: "/dashboard/messages",
    icon: MessageSquare,
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    label: "Finance",
    description: "Suivi des paiements",
    href: "/dashboard/finance",
    icon: BarChart2,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    label: "Contrats",
    description: "Contrats actifs et archivés",
    href: "/dashboard/contracts",
    icon: FileText,
    color: "bg-rose-500/10 text-rose-500",
  },
];

const CANDIDATE_LINKS = [
  {
    label: "Mes candidatures",
    description: "Suivez l'avancement de vos dossiers",
    href: "/dashboard/my-applications",
    icon: ClipboardList,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Offres disponibles",
    description: "Explorez les annonces du moment",
    href: "/dashboard/jobs",
    icon: Briefcase,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    label: "Mes contrats",
    description: "Contrats en attente de signature",
    href: "/dashboard/contracts",
    icon: FileText,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    label: "Mon profil",
    description: "Complétez et mettez à jour votre profil",
    href: "/dashboard/profile",
    icon: UserCircle,
    color: "bg-violet-500/10 text-violet-500",
  },
];

// ─── Skeleton card ─────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="flex items-start gap-4 p-5">
        <Skeleton className="size-11 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Quick link card ───────────────────────────────────────────────────────────

function QuickLinkCard({ label, description, href, icon: Icon, color }) {
  return (
    <Link href={href}>
      <Card className="group hover:-translate-y-0.5 h-full cursor-pointer transition-all duration-200 hover:shadow-md">
        <CardContent className="flex items-start gap-4 p-5">
          <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground text-sm">{label}</p>
            <p className="mt-0.5 truncate text-muted-foreground text-xs">{description}</p>
          </div>
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DefaultPage() {
  const [role, setRole] = useState(null); // "company" | "admin" | "super_admin" | "candidate"
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectRole() {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        setLoading(false);
        return;
      }

      // Detect role by table lookup
      const { data: company } = await supabase.from("companies").select("id, name").eq("id", user.id).maybeSingle();

      if (company) {
        setUserName(company.name || null);
        setRole("company");
        setLoading(false);
        return;
      }

      const { data: admin } = await supabase.from("admins").select("role").eq("id", user.id).maybeSingle();

      if (admin) {
        const meta = user.user_metadata;
        setUserName(meta?.full_name || meta?.name || null);
        setRole(admin.role === "super_admin" ? "super_admin" : "admin");
        setLoading(false);
        return;
      }

      // Candidat : chercher dans profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("firstname, lastname")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setUserName(`${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim() || null);
        setRole("candidate");
      }

      setLoading(false);
    }
    detectRole();
  }, []);

  const isCompany = role === "company";
  const isCandidate = role === "candidate";
  const links = isCompany ? COMPANY_LINKS : isCandidate ? CANDIDATE_LINKS : ADMIN_LINKS;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  })();

  const roleLabel = isCompany
    ? "Entreprise"
    : isCandidate
      ? "Candidat"
      : role === "super_admin"
        ? "Super Admin"
        : "Admin";

  const roleBadgeClass = isCompany
    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
    : isCandidate
      ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
      : "bg-amber-500/10 text-amber-600 border-amber-500/20";

  const roleIcon = isCompany ? (
    <Building2 className="size-3.5" />
  ) : isCandidate ? (
    <UserCircle className="size-3.5" />
  ) : (
    <ShieldCheck className="size-3.5" />
  );

  const subtitle = loading
    ? "Chargement de votre espace…"
    : isCompany
      ? "Bienvenue sur votre espace entreprise WeSafe."
      : isCandidate
        ? "Bienvenue sur votre espace candidat WeSafe."
        : "Bienvenue sur le panneau d'administration WeSafe.";

  return (
    <div className="relative">
      {/* Contenu flouté pour les candidats */}
      <div
        className={`mx-auto max-w-4xl space-y-8 py-2 transition-all duration-300 ${
          isCandidate ? "pointer-events-none select-none blur-sm" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">
              {greeting}
              {userName ? `, ${userName}` : ""} 👋
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
          </div>
          {!loading && (
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-medium text-xs ${roleBadgeClass}`}
            >
              {roleIcon}
              {roleLabel}
            </div>
          )}
        </div>

        {/* Quick links */}
        <section>
          <h2 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wider">Accès rapides</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
              : links.map((link) => <QuickLinkCard key={link.href} {...link} />)}
          </div>
        </section>

        {/* CTA company */}
        {!loading && isCompany && (
          <section>
            <Card className="border-dashed bg-muted/30">
              <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-medium">Prêt à recruter ?</p>
                  <p className="mt-0.5 text-muted-foreground text-sm">
                    Publiez une offre en quelques minutes et trouvez le bon profil.
                  </p>
                </div>
                <Button asChild className="shrink-0">
                  <Link href="/dashboard/my-jobs?new=true">
                    <Plus className="mr-2 size-4" />
                    Nouvelle offre
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* CTA candidat (dans la zone floutée) */}
        {!loading && isCandidate && (
          <section>
            <Card className="border-dashed bg-muted/30">
              <CardContent className="p-6">
                <p className="font-medium">Trouvez votre prochaine mission</p>
                <p className="mt-0.5 text-muted-foreground text-sm">
                  Parcourez les offres disponibles et postulez en quelques secondes.
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* CTA admin */}
        {!loading && !isCompany && !isCandidate && (
          <section>
            <Card className="border-dashed bg-muted/30">
              <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-medium">Plateforme WeSafe</p>
                  <p className="mt-0.5 text-muted-foreground text-sm">
                    Vous avez accès à l'ensemble des outils d'administration.
                  </p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <Link href="/dashboard/users">
                    <Users className="mr-2 size-4" />
                    Voir les utilisateurs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Overlay candidat */}
      {isCandidate && !loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="mx-4 w-full max-w-md space-y-4 rounded-2xl border bg-background/80 p-8 text-center shadow-xl backdrop-blur-none">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-violet-500/10">
              <UserCircle className="size-7 text-violet-500" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Espace non disponible sur web</h2>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                Le dashboard web est réservé aux entreprises et administrateurs. Pour accéder à vos candidatures,
                contrats et offres d'emploi, utilisez l'application mobile WeSafe.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/jobs">
                <Briefcase className="mr-2 size-4" />
                Voir les offres disponibles
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
