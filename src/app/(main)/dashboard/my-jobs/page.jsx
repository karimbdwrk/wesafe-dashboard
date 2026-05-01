"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Briefcase, CalendarDays, ChevronLeft, ChevronRight, MapPin, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CATEGORY } from "@/constants/categories";
import { supabase } from "@/lib/supabase/supabaseClient";

import { JobForm } from "./_components/job-form";

const JOBS_PER_PAGE = 20;
const CONTRACT_LABEL = { cdi: "CDI", cdd: "CDD" };
const STATUS_CONFIG = {
  published: {
    label: "Publiée",
    className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  draft: {
    label: "Brouillon",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  archived: {
    label: "Archivée",
    className: "bg-muted text-muted-foreground",
  },
};

function getCatLabel(id) {
  const cat = CATEGORY.find((c) => c.id === id);
  return cat ? `${cat.acronym} — ${cat.name}` : id;
}

function getCatAcronym(id) {
  return CATEGORY.find((c) => c.id === id)?.acronym ?? id;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const WORK_SCHEDULE_LABEL = {
  variable: "Horaires variables",
  daily: "Journée",
  nightly: "Nuit",
  mixed: "Mixte",
};
const WORK_TIME_LABEL = { fulltime: "Temps plein", parttime: "Temps partiel" };

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getSalaryDisplay(job) {
  if (job.salary_type === "selon_profil") return "Selon profil";
  if (job.salary_hourly) return `${Number(job.salary_hourly).toFixed(2)} €/h`;
  if (job.salary_monthly_fixed) return `${job.salary_monthly_fixed} €/mois`;
  if (job.salary_annual_fixed) return `${job.salary_annual_fixed} €/an`;
  if (job.salary_monthly_min && job.salary_monthly_max)
    return `${job.salary_monthly_min} – ${job.salary_monthly_max} €/mois`;
  if (job.salary_annual_min && job.salary_annual_max) return `${job.salary_annual_min} – ${job.salary_annual_max} €/an`;
  if (job.salary_min && job.salary_max) return `${job.salary_min} – ${job.salary_max} €`;
  if (job.salary_amount) return `${job.salary_amount} €`;
  return null;
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-sm">{title}</p>
      {children}
    </div>
  );
}

function InfoGrid({ items }) {
  const visible = items.filter(Boolean);
  if (!visible.length) return null;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      {visible.map(([label, value]) => (
        <div key={label}>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      ))}
    </div>
  );
}

function TagList({ items }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item, id) => (
        <li key={item.uuid ?? id} className="flex gap-2 text-muted-foreground text-sm">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function JobDetail({ job, onEdit, onToggleStatus, onDelete }) {
  const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.draft;
  const salary = getSalaryDisplay(job);
  const missions = parseList(job.missions);
  const searchedProfile = parseList(job.searched_profile);
  const diplomas = parseList(job.diplomas_required);
  const certifications = parseList(job.certifications_required);
  const drivingLicenses = parseList(job.driving_licenses);
  const languages = parseList(job.languages);

  const avantages = [
    job.packed_lunch && "Panier repas",
    job.accommodations && "Hébergement",
    job.reimbursements && "Remboursements",
    job.vacations && "Congés payés",
    job.sponsorship_date && "Parrainage",
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-bold text-xl">{job.title}</h2>
          <Badge variant="secondary" className={`h-5 px-1.5 font-medium text-[11px] ${statusCfg.className}`}>
            {statusCfg.label}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
          {job.category && (
            <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-[11px]">{getCatLabel(job.category)}</span>
          )}
          {job.contract_type && (
            <Badge variant="outline" className="h-5 px-1.5 text-[11px]">
              {CONTRACT_LABEL[job.contract_type] ?? job.contract_type.toUpperCase()}
            </Badge>
          )}
          {job.city && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {job.city}
              {job.department_code && ` (${job.department_code})`}
              {job.region && ` — ${job.region}`}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={() => onEdit(job)}>
            <Pencil className="mr-1.5 size-3.5" />
            Modifier
          </Button>
          <Button size="sm" variant="outline" disabled={job.status === "archived"} onClick={() => onToggleStatus(job)}>
            {job.status === "published" ? "Archiver" : "Archivée"}
          </Button>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Infos contrat & planning */}
      <Section title="Contrat & Planning">
        <InfoGrid
          items={[
            job.work_time && ["Temps de travail", WORK_TIME_LABEL[job.work_time] ?? job.work_time],
            job.work_schedule && ["Planning", WORK_SCHEDULE_LABEL[job.work_schedule] ?? job.work_schedule],
            job.weekly_hours && ["Heures / semaine", `${job.weekly_hours}h`],
            job.daily_hours && ["Heures / jour", `${job.daily_hours}h`],
            job.start_time && ["Heure de début", job.start_time],
            job.end_time && ["Heure de fin", job.end_time],
            job.start_date && ["Date de début", formatDate(job.start_date)],
            job.end_date && ["Date de fin", formatDate(job.end_date)],
            salary && ["Rémunération", salary],
            job.cnaps_required && ["CNAPS", "Requis"],
          ]}
        />
      </Section>

      {/* Description */}
      {job.description && (
        <>
          <div className="h-px bg-border" />
          <Section title="Description du poste">
            <p className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">{job.description}</p>
          </Section>
        </>
      )}

      {/* Missions */}
      {missions.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <Section title="Missions">
            <BulletList items={missions} />
          </Section>
        </>
      )}

      {/* Profil recherché */}
      {searchedProfile.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <Section title="Profil recherché">
            <BulletList items={searchedProfile} />
          </Section>
        </>
      )}

      {/* Qualifications */}
      {(diplomas.length > 0 || certifications.length > 0 || drivingLicenses.length > 0 || languages.length > 0) && (
        <>
          <div className="h-px bg-border" />
          <Section title="Qualifications requises">
            {diplomas.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs">Diplômes</p>
                <TagList items={diplomas} />
              </div>
            )}
            {certifications.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs">Certifications</p>
                <TagList items={certifications} />
              </div>
            )}
            {drivingLicenses.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs">Permis de conduire</p>
                <TagList items={drivingLicenses} />
              </div>
            )}
            {languages.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs">Langues</p>
                <TagList items={languages} />
              </div>
            )}
          </Section>
        </>
      )}

      {/* Avantages */}
      {avantages.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <Section title="Avantages">
            <TagList items={avantages} />
          </Section>
        </>
      )}

      <div className="h-px bg-border" />
      <p className="text-muted-foreground text-xs">
        Créée le {formatDate(job.created_at)}
        {job.updated_at && job.updated_at !== job.created_at && ` · Modifiée le ${formatDate(job.updated_at)}`}
      </p>
    </div>
  );
}

export default function CompanyJobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const [lastMinuteCredits, setLastMinuteCredits] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (searchParams.get("lastminute_success") === "true") {
      toast.success("Offre Last Minute activée !");
      router.replace("/dashboard/my-jobs");
    }
    if (searchParams.get("sponsorship_success") === "true") {
      toast.success("Offre sponsorisée avec succès !");
      router.replace("/dashboard/my-jobs");
    }
    if (searchParams.get("cancelled") === "true") {
      toast.info("Paiement annulé.");
      router.replace("/dashboard/my-jobs");
    }
  }, [searchParams, router]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchJobs is defined below, stable init pattern
  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setCompanyId(user.id);

      const { data: company } = await supabase
        .from("companies")
        .select("name, last_minute_credits")
        .eq("id", user.id)
        .maybeSingle();
      if (company) {
        setCompanyName(company.name);
        setLastMinuteCredits(company.last_minute_credits ?? 0);
      }

      fetchJobs(user.id);
    }
    init();
  }, []);

  async function fetchJobs(cid) {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", cid)
      .order("created_at", { ascending: false });
    if (!error) {
      setJobs(data ?? []);
      setSelectedJob(data?.[0] ?? null);
    }
    setLoading(false);
  }

  function handleNew() {
    setEditingJob(null);
    setSheetOpen(true);
  }

  function handleEdit(job) {
    setEditingJob(job);
    setSheetOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from("jobs").delete().eq("id", target.id);
    if (error) {
      toast.error("Impossible de supprimer cette offre. Elle est peut-être liée à des candidatures.");
      return;
    }
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== target.id);
      const maxPage = Math.max(1, Math.ceil(next.length / JOBS_PER_PAGE));
      if (page > maxPage) setPage(maxPage);
      if (selectedJob?.id === target.id) setSelectedJob(next[0] ?? null);
      return next;
    });
    toast.success("Offre supprimée.");
  }

  async function handleToggleStatus(job) {
    const newStatus = job.status === "published" ? "archived" : "published";
    const updated = { ...job, status: newStatus };
    const { error } = await supabase.from("jobs").update({ status: newStatus }).eq("id", job.id);
    if (error) {
      toast.error("Impossible de modifier le statut de cette offre.");
      return;
    }
    setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
    if (selectedJob?.id === job.id) setSelectedJob(updated);
    toast.success(newStatus === "published" ? "Offre publiée." : "Offre archivée.");
  }

  function handleSaved(saved, isNew) {
    if (isNew) {
      setJobs((prev) => [saved, ...prev]);
      setPage(1);
      setSelectedJob(saved);
    } else {
      setJobs((prev) => prev.map((j) => (j.id === saved.id ? saved : j)));
      if (selectedJob?.id === saved.id) setSelectedJob(saved);
    }
    setSheetOpen(false);
  }

  const published = jobs.filter((j) => j.status === "published").length;
  const draft = jobs.filter((j) => j.status === "draft").length;
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE));
  const paginatedJobs = jobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6" style={{ height: "calc(100dvh - 96px)" }}>
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Mes offres d'emploi</h1>
          {companyName && <p className="text-muted-foreground text-sm">{companyName}</p>}
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" />
          Nouvelle offre
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="font-bold text-2xl">{jobs.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-muted-foreground text-sm">Publiées</p>
          <p className="font-bold text-2xl text-green-600 dark:text-green-400">{published}</p>
        </div>
        <div className="col-span-2 rounded-xl border bg-card p-4 sm:col-span-1">
          <p className="text-muted-foreground text-sm">Brouillons</p>
          <p className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">{draft}</p>
        </div>
      </div>

      {/* List + Detail : deux colonnes */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <Briefcase className="size-10 text-muted-foreground/40" />
            <p className="font-medium">Aucune offre pour l'instant</p>
            <p className="text-muted-foreground text-sm">
              Créez votre première offre d'emploi pour attirer des candidats.
            </p>
            <Button onClick={handleNew} variant="outline" size="sm">
              <Plus className="mr-2 size-4" />
              Créer une offre
            </Button>
          </div>
        ) : (
          <div className="flex h-full gap-4">
            {/* Colonne gauche : liste */}
            <div className="flex w-full flex-col gap-3 overflow-y-auto lg:w-96 lg:shrink-0 xl:w-105">
              {paginatedJobs.map((job) => {
                const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.draft;
                const isSelected = selectedJob?.id === job.id;
                return (
                  <button
                    type="button"
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`group w-full rounded-xl border bg-card p-4 text-left transition-all hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isSelected ? "border-primary ring-1 ring-primary" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{job.title}</span>
                        <Badge
                          variant="secondary"
                          className={`h-5 px-1.5 font-medium text-[11px] ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                        {job.category && (
                          <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-[11px]">
                            {getCatAcronym(job.category)}
                          </span>
                        )}
                        {job.contract_type && (
                          <Badge variant="outline" className="h-5 px-1.5 text-[11px]">
                            {CONTRACT_LABEL[job.contract_type] ?? job.contract_type.toUpperCase()}
                          </Badge>
                        )}
                        {job.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {job.city}
                            {job.department_code && ` (${job.department_code})`}
                          </span>
                        )}
                        {job.start_date && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {formatDate(job.start_date)}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">Créée le {formatDate(job.created_at)}</p>
                    </div>
                  </button>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                  <p className="text-muted-foreground text-sm">
                    Page {page} sur {totalPages} — {jobs.length} offre
                    {jobs.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="icon"
                        className="size-8 text-xs"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Colonne droite : détail (desktop uniquement) */}
            <div className="hidden flex-1 overflow-hidden lg:block">
              {selectedJob ? (
                <div className="h-full overflow-y-auto rounded-xl border bg-card">
                  <JobDetail
                    job={selectedJob}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                    onDelete={(job) => setDeleteTarget(job)}
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground text-sm">
                  Sélectionnez une offre pour voir les détails
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl p-4">
          <SheetHeader className="pb-4">
            <SheetTitle>{editingJob ? "Modifier l'offre" : "Nouvelle offre d'emploi"}</SheetTitle>
            <SheetDescription>
              {editingJob
                ? "Modifiez les informations de cette offre."
                : "Remplissez le formulaire pour publier une nouvelle offre."}
            </SheetDescription>
          </SheetHeader>
          <JobForm
            companyId={companyId}
            initialData={editingJob}
            lastMinuteCredits={lastMinuteCredits}
            onCreditsUsed={() => setLastMinuteCredits((c) => Math.max(0, c - 1))}
            onSaved={handleSaved}
            onCancel={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette offre ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'offre <strong>"{deleteTarget?.title}"</strong> sera définitivement supprimée. Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
