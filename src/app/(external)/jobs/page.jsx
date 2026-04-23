"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Euro,
  MapPin,
  Moon,
  Search,
  SlidersHorizontal,
  Sun,
  Timer,
  X,
  Zap,
} from "lucide-react";

import {
  contractTypeLabel,
  formatRelativeDate,
  getCatAcronym,
  getLocation,
  getSalaryDisplay,
  JobCard,
  JobCardSkeleton,
} from "@/components/job-card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY } from "@/constants/categories";
import { regions } from "@/constants/regions";
import { supabase } from "@/lib/supabase/supabaseClient";

// ─── Constantes ────────────────────────────────────────────────────────────────

const JOBS_PER_PAGE = 10;

const APPSTORE_URL = "https://apps.apple.com/app/wesafe";
const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.wesafe";

const workScheduleLabel = {
  daily: "Journée",
  nightly: "Nuit",
  mixed: "Mixte",
  variable: "Variable",
};

const workTimeLabel = { fulltime: "Temps plein", parttime: "Temps partiel" };

const CONTRACT_OPTIONS = [
  { value: "", label: "Tous contrats" },
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "Toutes catégories" },
  ...CATEGORY.map((c) => ({
    value: c.id,
    label: `${c.acronym} — ${c.name}`,
  })),
];

const REGION_OPTIONS = [
  { value: "", label: "Toutes régions" },
  ...regions.map((r) => ({ value: r.nom, label: r.nom })),
];

function getCatLabel(id) {
  const found = CATEGORY.find((c) => c.id === id);
  return found ? `${found.acronym} — ${found.name}` : (id ?? "");
}

// ─── Utilitaires locaux ────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function parseListField(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value.length > 0 ? value : null;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch {
      return value.trim() ? value : null;
    }
  }
  return null;
}

// ─── Panneau détail (colonne droite) ───────────────────────────────────────────

function JobDetail({ job, onClose }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const company = job.companies;
  const salary = getSalaryDisplay(job);
  const location = getLocation(job);

  return (
    <>
      <div className="h-full overflow-y-auto px-6 py-8">
        {/* Bouton retour (mobile) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour aux offres
          </button>
        )}

        {/* Header entreprise */}
        <div className="flex items-center gap-4 mb-6">
          {company?.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              loading="lazy"
              className="h-14 w-14 rounded-xl object-cover border shrink-0"
            />
          ) : (
            <div className="h-14 w-14 rounded-xl bg-muted border flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground font-medium">{company?.name || "Entreprise"}</p>
            <h1 className="text-xl font-bold leading-tight flex items-center gap-2 flex-wrap">
              {job.title}
              {job.isLastMinute && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                  <Zap className="w-3 h-3" aria-hidden="true" />
                  Last Minute
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {location && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {location}
            </Badge>
          )}
          {job.contract_type && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
              {contractTypeLabel[job.contract_type] ?? job.contract_type.toUpperCase()}
            </Badge>
          )}
          {job.category && <Badge variant="secondary">{getCatLabel(job.category)}</Badge>}
          {job.work_schedule && workScheduleLabel[job.work_schedule] && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              {job.work_schedule === "nightly" ? (
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
              ) : job.work_schedule === "daily" ? (
                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Timer className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {workScheduleLabel[job.work_schedule]}
            </Badge>
          )}
          {job.work_time && workTimeLabel[job.work_time] && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" aria-hidden="true" />
              {workTimeLabel[job.work_time]}
            </Badge>
          )}
          {salary && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Euro className="w-3.5 h-3.5" aria-hidden="true" />
              {salary}
            </Badge>
          )}
          {job.start_date_asap ? (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              Dès que possible
            </Badge>
          ) : job.start_date ? (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              Début {formatDate(job.start_date)}
            </Badge>
          ) : null}
          {job.end_date && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              Fin {formatDate(job.end_date)}
            </Badge>
          )}
        </div>

        <hr className="mb-6" />

        {/* Description */}
        {job.description?.trim() ? (
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{job.description.trim()}</p>
        ) : (
          <p className="text-muted-foreground text-sm">Aucune description disponible.</p>
        )}

        {/* Missions */}
        {(() => {
          const items = parseListField(job.missions);
          if (!items) return null;
          return (
            <div className="mt-8">
              <h2 className="text-sm font-semibold mb-2">Missions</h2>
              {Array.isArray(items) ? (
                <ul className="list-disc list-inside space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{items}</p>
              )}
            </div>
          );
        })()}

        {/* Profil recherché */}
        {(() => {
          const items = parseListField(job.searched_profile);
          if (!items) return null;
          return (
            <div className="mt-8">
              <h2 className="text-sm font-semibold mb-2">Profil recherché</h2>
              {Array.isArray(items) ? (
                <ul className="list-disc list-inside space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{items}</p>
              )}
            </div>
          );
        })()}

        {/* Diplômes / certifications */}
        {(() => {
          const diplomas = parseListField(job.diplomas_required);
          const certs = parseListField(job.certifications_required);
          if (!diplomas && !certs) return null;
          return (
            <div className="mt-8">
              <h2 className="text-sm font-semibold mb-2">Qualifications requises</h2>
              <div className="flex flex-wrap gap-2">
                {diplomas?.map?.((d, i) => (
                  <Badge key={i} variant="secondary">
                    {d}
                  </Badge>
                ))}
                {certs?.map?.((c, i) => (
                  <Badge key={i} variant="secondary">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Avantages */}
        {(job.accommodations || job.packed_lunch || job.reimbursements || job.vacations) && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold mb-3">Avantages</h2>
            <div className="flex flex-wrap gap-2">
              {job.accommodations && <Badge variant="secondary">Logement</Badge>}
              {job.packed_lunch && <Badge variant="secondary">Panier repas</Badge>}
              {job.reimbursements && <Badge variant="secondary">Remboursements</Badge>}
              {job.vacations && <Badge variant="secondary">Congés payés</Badge>}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 pt-6 border-t flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-muted-foreground">Publiée le {formatDate(job.created_at)}</p>
          <Button size="sm" onClick={() => setApplyOpen(true)}>
            Postuler à cette offre
          </Button>
        </div>
      </div>

      {/* AlertDialog téléchargement */}
      <AlertDialog open={applyOpen} onOpenChange={setApplyOpen}>
        <AlertDialogContent className="max-w-sm text-center">
          <button
            type="button"
            onClick={() => setApplyOpen(false)}
            className="absolute top-3 right-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </button>
          <AlertDialogHeader className="items-center">
            <div className="text-4xl mb-2">📱</div>
            <AlertDialogTitle className="text-xl">Postulez depuis l'application</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Pour postuler à cette offre et suivre vos candidatures en temps réel, téléchargez l'application mobile
              WeSafe. Disponible gratuitement sur iOS et Android.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <Button asChild className="w-full bg-black hover:bg-zinc-800 text-white gap-2">
              <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04l-.06.18zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Télécharger sur l'App Store
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full gap-2">
              <a href={PLAYSTORE_URL} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M3.18 23.76c.3.17.64.22.98.15l12.09-6.98-2.67-2.67-10.4 9.5zM.5 1.48C.19 1.82 0 2.33 0 3v18c0 .67.19 1.18.5 1.52l.08.08 10.08-10.08v-.24L.58 1.4l-.08.08zM20.27 10.43l-2.73-1.58-3 2.99 3 2.99 2.74-1.58c.78-.45.78-1.37-.01-1.82zM4.16.24L16.25 7.22l-2.67 2.67L3.18.39C3.48.32 3.86.07 4.16.24z" />
                </svg>
                Télécharger sur Google Play
              </a>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [contractFilter, setContractFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    supabase
      .from("jobs")
      .select("*, companies(name, logo_url)")
      .eq("status", "published")
      .neq("isLastMinute", true)
      .order("sponsorship_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const list = data ?? [];
        setJobs(list);
        setLoading(false);
        if (list.length > 0) setSelectedJob(list[0]);
      });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: deps are intentional triggers, not consumed in body
  useEffect(() => {
    setPage(1);
  }, [search, contractFilter, categoryFilter, regionFilter]);

  const filtered = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      job.title?.toLowerCase().includes(q) ||
      job.companies?.name?.toLowerCase().includes(q) ||
      job.city?.toLowerCase().includes(q) ||
      job.region?.toLowerCase().includes(q);
    const matchContract = !contractFilter || job.contract_type === contractFilter;
    const matchCategory = !categoryFilter || job.category === categoryFilter;
    const matchRegion = !regionFilter || job.region === regionFilter;
    return matchSearch && matchContract && matchCategory && matchRegion;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  const router = useRouter();

  const handleSelectJob = useCallback(
    (job) => {
      if (window.innerWidth < 1024) {
        router.push(`/jobs/${job.id}`);
      } else {
        setSelectedJob(job);
      }
    },
    [router],
  );

  const activeFiltersCount = [contractFilter, categoryFilter, regionFilter].filter(Boolean).length;

  return (
    <div className="h-dvh bg-background flex flex-col mt-16 overflow-hidden">
      {/* ── Barre de recherche ── */}
      <div className="border-b border-border bg-card/50 px-4 py-5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="job-search" className="sr-only">
                Rechercher un poste, une entreprise ou une ville
              </label>
              <input
                id="job-search"
                type="text"
                placeholder="Poste, entreprise, ville…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button
              variant="outline"
              aria-expanded={showFilters}
              aria-controls="filter-panel"
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div id="filter-panel" className="mt-3 flex flex-col sm:flex-row gap-3">
              <select
                aria-label="Filtrer par type de contrat"
                value={contractFilter}
                onChange={(e) => setContractFilter(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CONTRACT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filtrer par catégorie"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filtrer par région"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {REGION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setContractFilter("");
                    setCategoryFilter("");
                    setRegionFilter("");
                  }}
                  className="text-muted-foreground flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Réinitialiser
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Corps deux colonnes ── */}
      <div className="flex-1 mx-auto w-full max-w-7xl flex overflow-hidden" style={{ height: "calc(100dvh - 112px)" }}>
        {/* ─ Colonne gauche (liste) ─ */}
        <div className="flex flex-col border-r border-border bg-background w-full lg:w-95 xl:w-105 shrink-0">
          {/* Compteur */}
          <div className="px-4 py-3 border-b border-border shrink-0">
            <p className="text-xs text-muted-foreground">
              {loading ? "Chargement…" : `${filtered.length} offre${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Liste scrollable */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : paginated.length === 0 ? (
              <output className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                <p className="text-2xl" aria-hidden="true">
                  🔍
                </p>
                <p className="text-sm font-medium">Aucune offre trouvée</p>
                <p className="text-xs text-muted-foreground">Modifiez vos critères de recherche.</p>
              </output>
            ) : (
              paginated.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={selectedJob?.id === job.id}
                  onClick={() => handleSelectJob(job)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="shrink-0 border-t border-border px-4 py-3 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                aria-label="Page précédente"
                onClick={() => setPage((p) => p - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="text-xs text-muted-foreground" aria-live="polite">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                aria-label="Page suivante"
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>

        {/* ─ Colonne droite (détail) ─ */}
        <div className="flex-1 overflow-y-auto hidden lg:block">
          {selectedJob ? (
            <JobDetail job={selectedJob} onClose={null} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-8">
              <Briefcase className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
              <p className="text-sm font-medium text-muted-foreground">
                Sélectionnez une offre pour afficher son détail
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
