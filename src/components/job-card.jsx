import Link from "next/link";

import { Banknote, Building2, Clock, MapPin, Star, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CATEGORY } from "@/constants/categories";

// ─── Constantes partagées ──────────────────────────────────────────────────────

export const contractTypeLabel = { cdi: "CDI", cdd: "CDD" };

// ─── Utilitaires partagés ──────────────────────────────────────────────────────

export function getCatAcronym(id) {
  return CATEGORY.find((c) => c.id === id)?.acronym ?? id?.toUpperCase() ?? "";
}

export function getCatLabel(id) {
  const cat = CATEGORY.find((c) => c.id === id);
  if (!cat) return id?.toUpperCase() ?? "";
  return `${cat.acronym} - ${cat.name}`.toUpperCase();
}

export function getSalaryDisplay(job) {
  if (job.salary_type === "selon_profil") return "Selon profil";
  if (job.salary_hourly) return `${job.salary_hourly} €/h`;
  if (job.salary_monthly_min && job.salary_monthly_max)
    return `${job.salary_monthly_min} – ${job.salary_monthly_max} €/mois`;
  if (job.salary_monthly_fixed) return `${job.salary_monthly_fixed} €/mois`;
  if (job.salary_annual_min && job.salary_annual_max) return `${job.salary_annual_min} – ${job.salary_annual_max} €/an`;
  if (job.salary_annual_fixed) return `${job.salary_annual_fixed} €/an`;
  if (job.salary_min && job.salary_max) return `${job.salary_min} – ${job.salary_max} €`;
  if (job.salary_amount) return `${job.salary_amount} €`;
  return null;
}

export function getLocation(job) {
  return [job.city, job.department !== job.city ? job.department : null, job.region].filter(Boolean).join(", ");
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

export function JobCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2 pr-16">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="mt-2 flex gap-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-12 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Styles partagés ───────────────────────────────────────────────────────────

const cardBase = "group relative rounded-xl border p-4 transition-[border-color,box-shadow]";
const cardIdle = "border-border bg-card hover:border-primary/40 hover:shadow-sm";
const cardSelected = "border-primary bg-primary/5 shadow-sm";

// ─── Contenu interne partagé ───────────────────────────────────────────────────

function JobCardContent({ job, salary, location, relativeDate }) {
  const company = job.companies;
  const isSponsored = job.sponsorship_date && new Date(job.sponsorship_date) > new Date();
  const hasBadge = job.isLastMinute || isSponsored;

  return (
    <>
      {hasBadge && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {isSponsored && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
              <Star className="h-2.5 w-2.5" aria-hidden="true" />
              Sponsorisé
            </div>
          )}
          {job.isLastMinute && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[10px] text-primary">
              <Zap className="h-2.5 w-2.5" aria-hidden="true" />
              Last Minute
            </div>
          )}
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Logo entreprise */}
        <div className="shrink-0">
          {company?.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              loading="lazy"
              className="h-10 w-10 rounded-lg border border-border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted">
              <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Métadonnées */}
        <div className={`min-w-0 flex-1 ${hasBadge ? "pr-16" : ""}`}>
          <p className="truncate font-medium text-muted-foreground text-xs">{company?.name ?? "Entreprise"}</p>
          <p className="mt-0.5 line-clamp-2 font-semibold text-foreground text-sm leading-snug">{job.title}</p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {location && (
              <span className="flex items-center gap-1 text-muted-foreground text-xs">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="max-w-30 truncate">{location}</span>
              </span>
            )}
            {job.category && (
              <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                {getCatAcronym(job.category)}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            {job.contract_type && (
              <span className="rounded border border-border px-1.5 py-0.5 font-medium text-[11px] text-foreground">
                {contractTypeLabel[job.contract_type] ?? job.contract_type.toUpperCase()}
              </span>
            )}
            {salary && (
              <span className="flex items-center gap-1 font-semibold text-foreground text-xs">
                <Banknote className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                {salary}
              </span>
            )}
            {relativeDate && (
              <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {relativeDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
//
// Deux modes :
//   - Mode lien   : passer `href` → pattern stretched-link, bouton "Postuler"
//                   visible si `onApply` est fourni (z-index au-dessus du lien)
//   - Mode bouton : passer `onClick` → carte cliquable, `selected` la surligne
//
// Props :
//   job       {object}   Objet job avec companies join
//   href      {string?}  Lien de la page détail (active le mode lien)
//   onClick   {fn?}      Handler de clic (active le mode bouton)
//   selected  {bool?}    Surligne la carte (mode bouton uniquement)
//   onApply   {fn?}      Affiche le bouton "Postuler" (mode lien uniquement)

export function JobCard({ job, href, onClick, selected = false, onApply }) {
  const salary = getSalaryDisplay(job);
  const location = getLocation(job);
  const relativeDate = formatRelativeDate(job.created_at);
  const contentProps = { job, salary, location, relativeDate };

  // Mode lien : stretched-link pour éviter les éléments interactifs imbriqués.
  // Le <Link> couvre toute la carte via position:absolute. Le bouton Postuler
  // est positionné au-dessus via z-index.
  if (href) {
    return (
      <article className={`${cardBase} ${cardIdle}`}>
        <JobCardContent {...contentProps} />
        <Link
          href={href}
          className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          <span className="sr-only">
            Voir l&apos;offre&nbsp;: {job.title}
            {job.companies?.name ? ` – ${job.companies.name}` : ""}
          </span>
        </Link>
        {onApply && (
          <div className="relative z-10 mt-3 border-border border-t pt-3">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onApply();
              }}
            >
              Postuler
            </Button>
          </div>
        )}
      </article>
    );
  }

  // Mode bouton : carte entière est un <button>, état sélectionné géré par
  // aria-pressed pour les lecteurs d'écran.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left ${cardBase} ${
        selected ? cardSelected : cardIdle
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1`}
    >
      <JobCardContent {...contentProps} />
    </button>
  );
}
