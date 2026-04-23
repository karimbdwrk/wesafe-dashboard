"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { Briefcase, Building2, Calendar, Clock, Euro, MapPin, Moon, Sun, Timer, X, Zap } from "lucide-react";

import { getLocation, getSalaryDisplay } from "@/components/job-card";
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
import { supabase } from "@/lib/supabase/supabaseClient";

const APPSTORE_URL = "https://apps.apple.com/app/wesafe";
const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.wesafe";

// Mapping complet des types de contrat (inclut formats legacy Supabase)
const contractTypeLabel = {
  cdi: "CDI",
  cdd: "CDD",
  freelance: "Freelance",
  stage: "Stage",
  alternance: "Alternance",
  full_time: "CDI",
  part_time: "CDD",
  internship: "Stage",
  apprentice: "Alternance",
};

const workScheduleLabel = {
  daily: "Journée",
  nightly: "Nuit",
  mixed: "Mixte",
  variable: "Variable",
};
const workTimeLabel = { fulltime: "Temps plein", parttime: "Temps partiel" };

function getCatLabel(id) {
  const cat = CATEGORY.find((c) => c.id === id);
  return cat ? `${cat.acronym} — ${cat.name}` : (id ?? "");
}

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

export default function JobPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("jobs")
      .select("*, companies(name, logo_url)")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) setNotFound(true);
        else setJob(data);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-4xl" aria-hidden="true">
          🔍
        </p>
        <h1 className="text-xl font-semibold">Offre introuvable</h1>
        <p className="text-sm text-muted-foreground">Cette offre n&apos;existe pas ou a été supprimée.</p>
      </div>
    );
  }

  const company = job.companies;
  const salary = getSalaryDisplay(job) ?? "Selon profil";
  const location = getLocation(job);

  return (
    <div className="min-h-dvh bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
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

        {/* Badges rapides */}
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

        {/* Séparateur */}
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

        {/* Qualifications requises */}
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

        {/* Bouton postuler */}
        <div className="mt-10">
          <Button size="lg" className="w-full" onClick={() => setApplyOpen(true)}>
            Postuler à cette offre
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t text-xs text-muted-foreground">Publiée le {formatDate(job.created_at)}</div>
      </div>

      {/* AlertDialog téléchargement */}
      <AlertDialog open={applyOpen} onOpenChange={setApplyOpen}>
        <AlertDialogContent className="max-w-sm text-center">
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setApplyOpen(false)}
            className="absolute top-3 right-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <AlertDialogHeader className="items-center">
            <div className="text-4xl mb-2" aria-hidden="true">
              📱
            </div>
            <AlertDialogTitle className="text-xl">Postulez depuis l&apos;application</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Pour postuler à cette offre et suivre vos candidatures en temps réel, téléchargez l&apos;application
              mobile WeSafe. Disponible gratuitement sur iOS et Android.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <Button asChild className="w-full bg-black hover:bg-zinc-800 text-white gap-2">
              <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04l-.06.18zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Télécharger sur l&apos;App Store
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
    </div>
  );
}
