"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
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

import { contractTypeLabel, getLocation, getSalaryDisplay, JobCard } from "@/components/job-card";
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

import appstoreImg from "../../../../media/appstore.png";
import playstoreImg from "../../../../media/playstore.png";

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
            className="mb-6 flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour aux offres
          </button>
        )}

        {/* Header entreprise */}
        <div className="mb-6 flex items-center gap-4">
          {company?.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-xl border object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="font-medium text-muted-foreground text-sm">{company?.name || "Entreprise"}</p>
            <h1 className="flex flex-wrap items-center gap-2 font-bold text-xl leading-tight">
              {job.title}
              {job.isLastMinute && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary text-xs">
                  <Zap className="h-3 w-3" aria-hidden="true" />
                  Last Minute
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6 flex flex-wrap gap-2">
          {location && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {location}
            </Badge>
          )}
          {job.contract_type && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              {contractTypeLabel[job.contract_type] ?? job.contract_type.toUpperCase()}
            </Badge>
          )}
          {job.category && <Badge variant="secondary">{getCatLabel(job.category)}</Badge>}
          {job.work_schedule && workScheduleLabel[job.work_schedule] && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              {job.work_schedule === "nightly" ? (
                <Moon className="h-3.5 w-3.5" aria-hidden="true" />
              ) : job.work_schedule === "daily" ? (
                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {workScheduleLabel[job.work_schedule]}
            </Badge>
          )}
          {job.work_time && workTimeLabel[job.work_time] && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              {workTimeLabel[job.work_time]}
            </Badge>
          )}
          {salary && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Euro className="h-3.5 w-3.5" aria-hidden="true" />
              {salary}
            </Badge>
          )}
          {job.start_date_asap ? (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Dès que possible
            </Badge>
          ) : job.start_date ? (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Début {formatDate(job.start_date)}
            </Badge>
          ) : null}
          {job.end_date && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Fin {formatDate(job.end_date)}
            </Badge>
          )}
        </div>

        <hr className="mb-6" />

        {/* Description */}
        {job.description?.trim() ? (
          <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">{job.description.trim()}</p>
        ) : (
          <p className="text-muted-foreground text-sm">Aucune description disponible.</p>
        )}

        {/* Missions */}
        {(() => {
          const items = parseListField(job.missions);
          if (!items) return null;
          return (
            <div className="mt-8">
              <h2 className="mb-2 font-semibold text-sm">Missions</h2>
              {Array.isArray(items) ? (
                <ul className="list-inside list-disc space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-foreground text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">{items}</p>
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
              <h2 className="mb-2 font-semibold text-sm">Profil recherché</h2>
              {Array.isArray(items) ? (
                <ul className="list-inside list-disc space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-foreground text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">{items}</p>
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
              <h2 className="mb-2 font-semibold text-sm">Qualifications requises</h2>
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
            <h2 className="mb-3 font-semibold text-sm">Avantages</h2>
            <div className="flex flex-wrap gap-2">
              {job.accommodations && <Badge variant="secondary">Logement</Badge>}
              {job.packed_lunch && <Badge variant="secondary">Panier repas</Badge>}
              {job.reimbursements && <Badge variant="secondary">Remboursements</Badge>}
              {job.vacations && <Badge variant="secondary">Congés payés</Badge>}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <p className="text-muted-foreground text-xs">Publiée le {formatDate(job.created_at)}</p>
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
            className="absolute top-3 right-3 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </button>
          <AlertDialogHeader className="items-center">
            <div className="mb-2 text-4xl">📱</div>
            <AlertDialogTitle className="text-xl">Postulez depuis l'application</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
              Pour postuler à cette offre et suivre vos candidatures en temps réel, téléchargez l'application mobile
              WeSafe. Disponible gratuitement sur iOS et Android.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row items-center justify-center gap-3">
            <a
              href={APPSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image src={appstoreImg} alt="Télécharger sur l'App Store" height={44} />
            </a>
            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image src={playstoreImg} alt="Disponible sur Google Play" height={44} />
            </a>
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
    <div className="mt-16 flex h-dvh flex-col overflow-hidden bg-background">
      {/* ── Barre de recherche ── */}
      <div className="border-border border-b bg-card/50 px-4 py-5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-muted-foreground"
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
                className="w-full rounded-lg border border-border bg-background py-2.5 pr-4 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button
              variant="outline"
              aria-expanded={showFilters}
              aria-controls="filter-panel"
              onClick={() => setShowFilters((v) => !v)}
              className="flex shrink-0 items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div id="filter-panel" className="mt-3 flex flex-col gap-3 sm:flex-row">
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
                  className="flex items-center gap-1 text-muted-foreground"
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
      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden" style={{ height: "calc(100dvh - 112px)" }}>
        {/* ─ Colonne gauche (liste) ─ */}
        <div className="flex w-full shrink-0 flex-col border-border border-r bg-background lg:w-95 xl:w-105">
          {/* Compteur */}
          <div className="shrink-0 border-border border-b px-4 py-3">
            <p className="text-muted-foreground text-xs">
              {loading ? "Chargement…" : `${filtered.length} offre${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Liste scrollable */}
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : paginated.length === 0 ? (
              <output className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-2xl" aria-hidden="true">
                  🔍
                </p>
                <p className="font-medium text-sm">Aucune offre trouvée</p>
                <p className="text-muted-foreground text-xs">Modifiez vos critères de recherche.</p>
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
            <div className="flex shrink-0 items-center justify-between gap-2 border-border border-t px-4 py-3">
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
              <span className="text-muted-foreground text-xs" aria-live="polite">
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
        <div className="hidden flex-1 overflow-y-auto lg:block">
          {selectedJob ? (
            <JobDetail job={selectedJob} onClose={null} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
              <p className="font-medium text-muted-foreground text-sm">
                Sélectionnez une offre pour afficher son détail
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
