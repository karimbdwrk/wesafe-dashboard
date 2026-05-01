"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  Banknote,
  CalendarClock,
  CheckCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  FileText,
  MapPin,
  MessagesSquare,
  Plus,
  Send,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY } from "@/constants/categories";
import { departements } from "@/constants/departements";
import { regions } from "@/constants/regions";
import { formatSalary } from "@/constants/salary";
import { supabase } from "@/lib/supabase/supabaseClient";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  applied: {
    title: "Candidature envoyée",
    description: "Un candidat a postulé à cette annonce.",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    dotClass: "bg-blue-500",
    isFinal: false,
  },
  selected: {
    title: "Profil sélectionné",
    description: "Vous avez sélectionné ce candidat pour la suite.",
    badgeClass: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    dotClass: "bg-violet-500",
    isFinal: false,
  },
  contract_sent: {
    title: "Contrat envoyé",
    description: "Vous avez envoyé un contrat au candidat.",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    dotClass: "bg-amber-500",
    isFinal: false,
  },
  contract_signed_candidate: {
    title: "Contrat signé (candidat)",
    description: "Le candidat a signé le contrat.",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
    isFinal: false,
  },
  contract_signed_pro: {
    title: "Contrat finalisé",
    description: "Vous avez signé le contrat. La mission est confirmée.",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    dotClass: "bg-emerald-600",
    isFinal: true,
  },
  rejected: {
    title: "Candidature refusée",
    description: "Vous avez refusé cette candidature.",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    dotClass: "bg-red-500",
    isFinal: true,
  },
};

const STATUS_ORDER = ["applied", "selected", "contract_sent", "contract_signed_candidate", "contract_signed_pro"];

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "applied", label: "En attente" },
  { value: "selected", label: "Sélectionnés" },
  { value: "contract_sent", label: "Contrat envoyé" },
  { value: "contract_signed_candidate", label: "Signé (candidat)" },
  { value: "contract_signed_pro", label: "Finalisé" },
  { value: "rejected", label: "Refusés" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCatAcronym(id) {
  return CATEGORY.find((c) => c.id === id)?.acronym ?? id ?? "";
}

function _getCatLabel(id) {
  const cat = CATEGORY.find((c) => c.id === id);
  return cat ? `${cat.acronym} — ${cat.name}` : (id ?? "");
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDatetime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  );
}

function getInitials(firstname, lastname) {
  return `${(firstname ?? "").charAt(0)}${(lastname ?? "").charAt(0)}`.toUpperCase();
}

// ─── Timeline ────────────────────────────────────────────────────────────────

function buildTimelineSteps(events) {
  if (!events?.length) return [];
  const steps = [...events];
  const lastStatus = events[events.length - 1].status;
  const cfg = STATUS_CONFIG[lastStatus];
  if (cfg?.isFinal) return steps;
  const idx = STATUS_ORDER.indexOf(lastStatus);
  const next = STATUS_ORDER[idx + 1];
  if (next) steps.push({ status: next, isPending: true });
  return steps;
}

function Timeline({ events }) {
  const steps = buildTimelineSteps(events);
  if (!steps.length) return <p className="text-muted-foreground text-sm">Aucun événement pour l'instant.</p>;

  return (
    <div className="flex flex-col">
      {steps.map((step, idx) => {
        const cfg = STATUS_CONFIG[step.status];
        if (!cfg) return null;
        const isPending = !!step.isPending;
        const isLast = idx === steps.length - 1;
        return (
          <div key={`${step.status}-${idx}`} className="flex gap-4">
            {/* dot + line */}
            <div className="flex flex-col items-center">
              <div className={`mt-1 size-2.5 shrink-0 rounded-full ${isPending ? "bg-border" : cfg.dotClass}`} />
              {!isLast && <div className="mt-1 mb-0 min-h-8 w-px flex-1 bg-border" />}
            </div>
            {/* content */}
            <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
              <p className={`font-medium text-sm ${isPending ? "text-muted-foreground" : ""}`}>{cfg.title}</p>
              <p className={`mt-0.5 text-xs ${isPending ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                {isPending ? "En attente…" : cfg.description}
              </p>
              {!isPending && step.created_at && (
                <div className="mt-1 flex items-center gap-1">
                  <CalendarClock className="size-3 text-muted-foreground/50" />
                  <span className="text-[11px] text-muted-foreground/50">{formatDatetime(step.created_at)}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Contract Sheet ───────────────────────────────────────────────────────────

const CONTRACT_STEPS = ["Informations", "Poste & Lieu", "Rémunération", "Clauses", "Récapitulatif"];
const CONTRACT_TYPES = ["CDD", "CDI"];
const WEEK_DAYS_LIST = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const INITIAL_CONTRACT_FORM = {
  contract_type: "",
  contract_reason: "",
  start_date: null,
  end_date: null,
  total_hours: "",
  schedule_known: false,
  week_schedule: {
    Lundi: { enabled: false, start: "", end: "" },
    Mardi: { enabled: false, start: "", end: "" },
    Mercredi: { enabled: false, start: "", end: "" },
    Jeudi: { enabled: false, start: "", end: "" },
    Vendredi: { enabled: false, start: "", end: "" },
    Samedi: { enabled: false, start: "", end: "" },
    Dimanche: { enabled: false, start: "", end: "" },
  },
  vacations: [],
  work_location_name: "",
  work_location: "",
  work_location_type: "single",
  work_locations: [""],
  job_title: "",
  job_description: "",
  hourly_rate: "",
  meal_bonus: "",
  transport_bonus: "",
  night_bonus: "",
  sunday_bonus: "",
  holiday_bonus: "",
  overtime_rate: "",
  is_night: false,
  is_sunday: false,
  is_holiday: false,
  equipment_provided: false,
  equipment_details: "",
  trial_period: "",
  custom_clauses: "",
};

function ContractSheet({ open, onClose, application, companyId, onContractSaved }) {
  const [step, setStep] = useState(1);
  const [existingContractId, setExistingContractId] = useState(null);
  const [existingContractStatus, setExistingContractStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(INITIAL_CONTRACT_FORM);
  const [formError, setFormError] = useState("");

  const [singleAddressQuery, setSingleAddressQuery] = useState("");
  const [singleAddressResults, setSingleAddressResults] = useState([]);
  const [multiAddressQueries, setMultiAddressQueries] = useState([""]);
  const [multiAddressResults, setMultiAddressResults] = useState([[]]);
  const [zoneQuery, setZoneQuery] = useState("");
  const [zoneResults, setZoneResults] = useState([]);

  const contentRef = useRef(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset and load when open changes
  useEffect(() => {
    if (!open || !application) return;

    setStep(1);
    setFormError("");
    setExistingContractId(null);
    setExistingContractStatus(null);
    setSingleAddressQuery("");
    setSingleAddressResults([]);
    setMultiAddressQueries([""]);
    setMultiAddressResults([[]]);
    setZoneQuery("");
    setZoneResults([]);

    async function load() {
      const isoToDate = (iso) => (iso ? new Date(iso) : null);
      const parseVacations = (raw) => {
        if (!raw || !Array.isArray(raw)) return [];
        return raw.map((v) => ({
          date: v.date ? new Date(v.date) : null,
          start_time: v.start_time || "",
          end_time: v.end_time || "",
        }));
      };

      const { data: existing } = await supabase
        .from("contracts")
        .select("*")
        .eq("apply_id", application.id)
        .in("status", ["draft", "published"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        setExistingContractId(existing.id);
        setExistingContractStatus(existing.status);
        const c = existing;
        const schedule = c.schedule || {};
        const wLocType = c.work_location_type || "single";
        let wLocs = [""];
        if (wLocType === "multiple") {
          try {
            wLocs = JSON.parse(c.work_location) || [""];
          } catch {
            wLocs = [""];
          }
        }
        setForm((prev) => ({
          ...prev,
          contract_type: c.contract_type || "",
          contract_reason: c.contract_reason || "",
          start_date: isoToDate(c.start_date),
          end_date: isoToDate(c.end_date),
          total_hours: c.total_hours != null ? String(c.total_hours) : "",
          schedule_known: schedule.schedule_known ?? false,
          week_schedule: schedule.week_schedule ?? prev.week_schedule,
          vacations: parseVacations(schedule.vacations),
          work_location: wLocType !== "multiple" ? c.work_location || "" : "",
          work_location_name: c.work_location_name || "",
          work_location_type: wLocType,
          work_locations: wLocs,
          job_title: c.job_title || "",
          job_description: c.job_description || "",
          hourly_rate: c.hourly_rate != null ? String(c.hourly_rate) : "",
          meal_bonus: c.meal_bonus != null ? String(c.meal_bonus) : "",
          transport_bonus: c.transport_bonus != null ? String(c.transport_bonus) : "",
          night_bonus: c.night_bonus != null ? String(c.night_bonus) : "",
          sunday_bonus: c.sunday_bonus != null ? String(c.sunday_bonus) : "",
          holiday_bonus: c.holiday_bonus != null ? String(c.holiday_bonus) : "",
          overtime_rate: c.overtime_rate != null ? String(c.overtime_rate) : "",
          is_night: c.is_night ?? false,
          is_sunday: c.is_sunday ?? false,
          is_holiday: c.is_holiday ?? false,
          equipment_provided: c.equipment_provided ?? false,
          equipment_details: c.equipment_details || "",
          trial_period: c.trial_period || "",
          custom_clauses: c.custom_clauses || "",
        }));
        if (wLocType === "multiple" && wLocs.length > 0) {
          setMultiAddressQueries(wLocs);
          setMultiAddressResults(wLocs.map(() => []));
        }
        if (wLocType === "zone" && c.work_location) setZoneQuery(c.work_location);
        if (wLocType === "single" && c.work_location) setSingleAddressQuery(c.work_location);
        return;
      }

      const job = application.jobs;
      if (!job) {
        setForm(INITIAL_CONTRACT_FORM);
        return;
      }
      const contractType = (() => {
        if (!job.contract_type) return "";
        const u = job.contract_type.toUpperCase();
        return u === "CDI" || u === "CDD" ? u : "";
      })();
      const vacations = parseVacations(job.vacations);
      setForm({
        ...INITIAL_CONTRACT_FORM,
        contract_type: contractType,
        start_date: isoToDate(job.start_date),
        end_date: isoToDate(job.end_date),
        job_title: job.title || "",
        hourly_rate: job.salary_hourly ? String(job.salary_hourly) : "",
        vacations,
        schedule_known: vacations.length > 0,
      });
    }
    load();
  }, [open, application]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateWeekDay = (day, field, value) =>
    setForm((prev) => ({
      ...prev,
      week_schedule: {
        ...prev.week_schedule,
        [day]: { ...prev.week_schedule[day], [field]: value },
      },
    }));

  const addVacation = () =>
    setForm((prev) => ({
      ...prev,
      vacations: [...prev.vacations, { date: null, start_time: "", end_time: "" }],
    }));

  const removeVacation = (i) =>
    setForm((prev) => ({
      ...prev,
      vacations: prev.vacations.filter((_, idx) => idx !== i),
    }));

  const updateVacation = (i, field, value) =>
    setForm((prev) => {
      const next = [...prev.vacations];
      next[i] = { ...next[i], [field]: value };
      return { ...prev, vacations: next };
    });

  async function searchAddress(query, callback) {
    if (!query || query.length < 3) {
      callback([]);
      return;
    }
    try {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      callback(
        (data.features || []).map((f) => ({
          label: f.properties.label,
        })),
      );
    } catch {
      callback([]);
    }
  }

  function searchZone(query) {
    if (!query || query.length < 2) {
      setZoneResults([]);
      return;
    }
    const q = query.toLowerCase();
    const deps = departements
      .filter((d) => d.nom.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
      .slice(0, 4)
      .map((d) => ({ label: `${d.nom} (${d.code})`, type: "dep" }));
    const regs = regions
      .filter((r) => r.nom.toLowerCase().includes(q))
      .slice(0, 3)
      .map((r) => ({ label: `Région ${r.nom}`, type: "reg" }));
    setZoneResults([...deps, ...regs].slice(0, 6));
  }

  function validateStep() {
    if (step === 1) {
      if (!form.contract_type) return "Choisissez un type de contrat.";
      if (!form.start_date) return "La date de début est obligatoire.";
      if (form.contract_type === "CDD" && !form.end_date) return "La date de fin est obligatoire pour un CDD.";
      if (form.contract_type === "CDD" && !form.contract_reason?.trim())
        return "Le motif de recours est obligatoire pour un CDD.";
      if (!form.total_hours?.trim()) return "Le nombre d'heures est obligatoire.";
    }
    if (step === 2) {
      if (!form.job_title.trim()) return "L'intitulé du poste est obligatoire.";
      if (form.work_location_type === "multiple") {
        if (form.work_locations.every((a) => !a.trim())) return "Saisissez au moins une adresse.";
      } else if (!form.work_location.trim()) {
        return "Le lieu de travail est obligatoire.";
      }
      if (!form.job_description?.trim()) return "La description des missions est obligatoire.";
    }
    if (step === 3) {
      if (!form.hourly_rate) return "Le taux horaire est obligatoire.";
    }
    return null;
  }

  function nextStep() {
    const err = validateStep();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError("");
    setStep((s) => s + 1);
    setTimeout(() => {
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, 50);
  }

  function prevStep() {
    setFormError("");
    setStep((s) => s - 1);
    setTimeout(() => {
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, 50);
  }

  async function handleSubmit(status) {
    setSubmitting(true);
    try {
      const formatDateISO = (d) => (d ? d.toISOString().split("T")[0] : null);
      const payload = {
        contract_type: form.contract_type,
        contract_reason: form.contract_reason || null,
        start_date: formatDateISO(form.start_date),
        end_date: formatDateISO(form.end_date),
        total_hours: form.total_hours ? parseFloat(form.total_hours) : null,
        schedule: {
          schedule_known: form.schedule_known,
          week_schedule: form.week_schedule,
          vacations: form.vacations,
        },
        work_location:
          form.work_location_type === "multiple"
            ? JSON.stringify(form.work_locations.filter((a) => a.trim()))
            : form.work_location,
        work_location_type: form.work_location_type,
        work_location_name: form.work_location_name || null,
        job_title: form.job_title,
        job_description: form.job_description || null,
        hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
        overtime_rate: form.overtime_rate ? parseFloat(form.overtime_rate) : null,
        meal_bonus: form.meal_bonus ? parseFloat(form.meal_bonus) : null,
        transport_bonus: form.transport_bonus ? parseFloat(form.transport_bonus) : null,
        night_bonus: form.night_bonus ? parseFloat(form.night_bonus) : null,
        sunday_bonus: form.sunday_bonus ? parseFloat(form.sunday_bonus) : null,
        holiday_bonus: form.holiday_bonus ? parseFloat(form.holiday_bonus) : null,
        is_night: form.is_night,
        is_sunday: form.is_sunday,
        is_holiday: form.is_holiday,
        equipment_provided: form.equipment_provided,
        equipment_details: form.equipment_details || null,
        trial_period: form.trial_period || null,
        custom_clauses: form.custom_clauses || null,
        status,
      };

      let error;
      if (existingContractId) {
        ({ error } = await supabase
          .from("contracts")
          .update({
            ...payload,
            company_snapshot: application?.companies ?? null,
            candidate_snapshot: application?.profiles ?? null,
          })
          .eq("id", existingContractId));
      } else {
        ({ error } = await supabase.from("contracts").insert({
          ...payload,
          apply_id: application.id,
          job_id: application.jobs?.id ?? null,
          company_id: companyId,
          candidate_id: application.profiles?.id ?? null,
          company_snapshot: application?.companies ?? null,
          candidate_snapshot: application?.profiles ?? null,
          generated_at: new Date().toISOString(),
          isSigned: false,
          isProSigned: false,
        }));
      }
      if (error) throw error;

      if (status === "published" && existingContractStatus !== "published") {
        const { error: evtError } = await supabase.from("application_status_events").insert({
          application_id: application.id,
          status: "contract_sent",
          updated_by: "company",
        });
        if (evtError) console.error("[ContractSheet] status event:", evtError);

        const { error: appError } = await supabase
          .from("applications")
          .update({
            current_status: "contract_sent",
            updated_at: new Date().toISOString(),
          })
          .eq("id", application.id);
        if (appError) console.error("[ContractSheet] application update:", appError);

        const candidateId = application.profiles?.id;
        if (candidateId) {
          await supabase.from("notifications").insert({
            actor_id: companyId,
            recipient_id: candidateId,
            type: "contract",
            title: application.jobs?.title ?? "Contrat de mission",
            entity_type: "contract",
            entity_id: application.id,
            body: "Un contrat de mission vous a été envoyé.",
            is_read: false,
          });
        }
        onContractSaved?.("contract_sent", application.id);
      } else if (status === "draft") {
        onContractSaved?.(null, application.id);
      }

      toast.success(status === "published" ? "Contrat envoyé au candidat" : "Brouillon enregistré");
      onClose();
    } catch (err) {
      console.error("[ContractSheet] handleSubmit:", err);
      toast.error("Erreur lors de l'enregistrement du contrat");
    } finally {
      setSubmitting(false);
    }
  }

  function renderStep1() {
    return (
      <>
        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">Type de contrat *</p>
          <div className="flex flex-wrap gap-2">
            {CONTRACT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => update("contract_type", type)}
                className={`rounded-full border-2 px-5 py-2 font-semibold text-sm transition-colors ${
                  form.contract_type === type
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {form.contract_type === "CDD" && (
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">Motif de recours *</p>
            <Textarea
              placeholder="Ex : Remplacement d'un salarié absent, accroissement temporaire d'activité..."
              value={form.contract_reason}
              onChange={(e) => update("contract_reason", e.target.value)}
              rows={3}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">Date de début *</p>
          <DatePicker value={form.start_date} onChange={(d) => update("start_date", d)} />
        </div>

        {form.contract_type !== "CDI" && (
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              Date de fin
              {form.contract_type === "CDD" ? " *" : ""}
            </p>
            <DatePicker value={form.end_date} onChange={(d) => update("end_date", d)} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">
            {form.contract_type === "CDI" ? "Heures mensuelles *" : "Heures totales *"}
          </p>
          <Input
            placeholder="Ex : 151.67"
            value={form.total_hours}
            onChange={(e) => update("total_hours", e.target.value)}
            type="number"
            step="0.01"
          />
        </div>

        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Planning connu ?</p>
            <Switch checked={form.schedule_known} onCheckedChange={(v) => update("schedule_known", v)} />
          </div>

          {form.schedule_known && form.contract_type === "CDI" && (
            <div className="mt-1 flex flex-col gap-3">
              {WEEK_DAYS_LIST.map((day) => (
                <div key={day} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="w-24 font-medium text-sm">{day}</span>
                    <Switch
                      checked={form.week_schedule[day].enabled}
                      onCheckedChange={(v) => updateWeekDay(day, "enabled", v)}
                    />
                  </div>
                  {form.week_schedule[day].enabled && (
                    <div className="ml-4 flex items-center gap-2">
                      <Input
                        type="time"
                        value={form.week_schedule[day].start}
                        onChange={(e) => updateWeekDay(day, "start", e.target.value)}
                        className="flex-1"
                      />
                      <span className="shrink-0 text-muted-foreground text-sm">→</span>
                      <Input
                        type="time"
                        value={form.week_schedule[day].end}
                        onChange={(e) => updateWeekDay(day, "end", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {form.schedule_known && form.contract_type !== "CDI" && (
            <div className="mt-1 flex flex-col gap-3">
              {form.vacations.map((vac, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: vacation list has no stable id
                <div key={i} className="flex flex-col gap-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground text-xs">Vacation {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVacation(i)}
                      className="text-destructive hover:opacity-70"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <DatePicker value={vac.date} onChange={(d) => updateVacation(i, "date", d)} />
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={vac.start_time}
                      onChange={(e) => updateVacation(i, "start_time", e.target.value)}
                      className="flex-1"
                    />
                    <span className="shrink-0 text-muted-foreground text-sm">→</span>
                    <Input
                      type="time"
                      value={vac.end_time}
                      onChange={(e) => updateVacation(i, "end_time", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addVacation}
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed py-2.5 text-muted-foreground text-sm transition-colors hover:bg-muted/50"
              >
                <Plus className="size-4" />
                Ajouter une vacation
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  function renderStep2() {
    return (
      <>
        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">Intitulé du poste *</p>
          <Input
            placeholder="Ex : Agent de sécurité SSIAP 1"
            value={form.job_title}
            onChange={(e) => update("job_title", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">Nom du lieu (optionnel)</p>
          <Input
            placeholder="Ex : Centre Commercial Qwartz..."
            value={form.work_location_name}
            onChange={(e) => update("work_location_name", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">Type de lieu *</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "single", label: "Adresse unique" },
              { value: "multiple", label: "Plusieurs adresses" },
              { value: "zone", label: "Zone / Région" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  update("work_location_type", value);
                  update("work_location", "");
                  update("work_locations", [""]);
                  setSingleAddressQuery("");
                  setSingleAddressResults([]);
                  setMultiAddressQueries([""]);
                  setMultiAddressResults([[]]);
                  setZoneQuery("");
                  setZoneResults([]);
                }}
                className={`rounded-full border-2 px-3 py-1.5 font-semibold text-xs transition-colors ${
                  form.work_location_type === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {form.work_location_type === "single" && (
            <div className="mt-1 flex flex-col gap-1.5">
              <Input
                placeholder="Rechercher une adresse..."
                value={singleAddressQuery}
                onChange={(e) => {
                  setSingleAddressQuery(e.target.value);
                  update("work_location", e.target.value);
                  setSingleAddressResults([]);
                  searchAddress(e.target.value, setSingleAddressResults);
                }}
              />
              {singleAddressResults.length > 0 && (
                <div className="overflow-hidden rounded-lg border">
                  {singleAddressResults.map((r, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: address results have no id
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        update("work_location", r.label);
                        setSingleAddressQuery(r.label);
                        setSingleAddressResults([]);
                      }}
                      className="w-full border-b px-3 py-2 text-left text-sm transition-colors last:border-0 hover:bg-muted"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
              {form.work_location && singleAddressResults.length === 0 && singleAddressQuery && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary text-sm">
                  <MapPin className="size-4 shrink-0" />
                  {form.work_location}
                </div>
              )}
            </div>
          )}

          {form.work_location_type === "multiple" && (
            <div className="mt-1 flex flex-col gap-2">
              {form.work_locations.map((_addr, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: location list has no stable id
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Adresse ${i + 1}...`}
                      value={multiAddressQueries[i] ?? ""}
                      onChange={(e) => {
                        const uq = [...multiAddressQueries];
                        uq[i] = e.target.value;
                        setMultiAddressQueries(uq);
                        const ul = [...form.work_locations];
                        ul[i] = e.target.value;
                        update("work_locations", ul);
                        searchAddress(e.target.value, (results) => {
                          const ur = [...multiAddressResults];
                          ur[i] = results;
                          setMultiAddressResults(ur);
                        });
                      }}
                      className="flex-1"
                    />
                    {form.work_locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          update(
                            "work_locations",
                            form.work_locations.filter((_, idx) => idx !== i),
                          );
                          setMultiAddressQueries(multiAddressQueries.filter((_, idx) => idx !== i));
                          setMultiAddressResults(multiAddressResults.filter((_, idx) => idx !== i));
                        }}
                        className="shrink-0 text-destructive hover:opacity-70"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  {(multiAddressResults[i] || []).length > 0 && (
                    <div className="overflow-hidden rounded-lg border">
                      {(multiAddressResults[i] || []).map((r, j) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: address results have no id
                        <button
                          key={j}
                          type="button"
                          onClick={() => {
                            const ul = [...form.work_locations];
                            ul[i] = r.label;
                            update("work_locations", ul);
                            const uq = [...multiAddressQueries];
                            uq[i] = r.label;
                            setMultiAddressQueries(uq);
                            const ur = [...multiAddressResults];
                            ur[i] = [];
                            setMultiAddressResults(ur);
                          }}
                          className="w-full border-b px-3 py-2 text-left text-sm transition-colors last:border-0 hover:bg-muted"
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  update("work_locations", [...form.work_locations, ""]);
                  setMultiAddressQueries([...multiAddressQueries, ""]);
                  setMultiAddressResults([...multiAddressResults, []]);
                }}
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed py-2.5 text-muted-foreground text-sm transition-colors hover:bg-muted/50"
              >
                <Plus className="size-4" />
                Ajouter une adresse
              </button>
            </div>
          )}

          {form.work_location_type === "zone" && (
            <div className="mt-1 flex flex-col gap-1.5">
              <Input
                placeholder="Rechercher un département ou une région..."
                value={zoneQuery}
                onChange={(e) => {
                  setZoneQuery(e.target.value);
                  update("work_location", e.target.value);
                  setZoneResults([]);
                  searchZone(e.target.value);
                }}
              />
              {zoneResults.length > 0 && (
                <div className="overflow-hidden rounded-lg border">
                  {zoneResults.map((r, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: zone results have no id
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        update("work_location", r.label);
                        setZoneQuery(r.label);
                        setZoneResults([]);
                      }}
                      className="flex w-full items-center gap-2 border-b px-3 py-2 text-left text-sm transition-colors last:border-0 hover:bg-muted"
                    >
                      <span
                        className={`rounded px-1.5 py-0.5 font-bold text-[10px] ${
                          r.type === "reg"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        }`}
                      >
                        {r.type === "reg" ? "RÉG" : "DEP"}
                      </span>
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">Description des missions *</p>
          <Textarea
            placeholder="Détaillez les missions et responsabilités du poste..."
            value={form.job_description}
            onChange={(e) => update("job_description", e.target.value)}
            rows={5}
          />
        </div>
      </>
    );
  }

  function renderStep3() {
    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">Taux horaire brut (€) *</p>
            <Input
              placeholder="12.50"
              value={form.hourly_rate}
              onChange={(e) => update("hourly_rate", e.target.value)}
              type="number"
              step="0.01"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">Taux H. sup. (€/h)</p>
            <Input
              placeholder="15.63"
              value={form.overtime_rate}
              onChange={(e) => update("overtime_rate", e.target.value)}
              type="number"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">Panier repas (€/j)</p>
            <Input
              placeholder="6.50"
              value={form.meal_bonus}
              onChange={(e) => update("meal_bonus", e.target.value)}
              type="number"
              step="0.01"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">Transport (€/j)</p>
            <Input
              placeholder="2.00"
              value={form.transport_bonus}
              onChange={(e) => update("transport_bonus", e.target.value)}
              type="number"
              step="0.01"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Travail de nuit</p>
            <Switch checked={form.is_night} onCheckedChange={(v) => update("is_night", v)} />
          </div>
          {form.is_night && (
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs">Majoration nuit (€/h)</p>
              <Input
                placeholder="2.00"
                value={form.night_bonus}
                onChange={(e) => update("night_bonus", e.target.value)}
                type="number"
                step="0.01"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Travail le dimanche</p>
            <Switch checked={form.is_sunday} onCheckedChange={(v) => update("is_sunday", v)} />
          </div>
          {form.is_sunday && (
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs">Majoration dimanche (€/h)</p>
              <Input
                placeholder="2.00"
                value={form.sunday_bonus}
                onChange={(e) => update("sunday_bonus", e.target.value)}
                type="number"
                step="0.01"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Jours fériés</p>
            <Switch checked={form.is_holiday} onCheckedChange={(v) => update("is_holiday", v)} />
          </div>
          {form.is_holiday && (
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs">Majoration fériés (€/h)</p>
              <Input
                placeholder="2.00"
                value={form.holiday_bonus}
                onChange={(e) => update("holiday_bonus", e.target.value)}
                type="number"
                step="0.01"
              />
            </div>
          )}
        </div>
      </>
    );
  }

  function renderStep4() {
    return (
      <>
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Équipement fourni</p>
            <Switch checked={form.equipment_provided} onCheckedChange={(v) => update("equipment_provided", v)} />
          </div>
          {form.equipment_provided && (
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs">Détails de l'équipement</p>
              <Textarea
                placeholder="Ex : Tenue de travail, badge, équipements de protection..."
                value={form.equipment_details}
                onChange={(e) => update("equipment_details", e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">Période d'essai</p>
          <Input
            placeholder="Ex : 1 mois renouvelable, 2 semaines..."
            value={form.trial_period}
            onChange={(e) => update("trial_period", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">Clauses particulières</p>
          <Textarea
            placeholder="Ajoutez ici toute clause spécifique au contrat..."
            value={form.custom_clauses}
            onChange={(e) => update("custom_clauses", e.target.value)}
            rows={5}
          />
        </div>
      </>
    );
  }

  function renderStep5() {
    const candidate = application?.profiles;
    const job = application?.jobs;
    const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

    function SummaryRow({ label, value }) {
      return (
        <div className="flex justify-between gap-3 border-b py-1.5 text-sm last:border-0">
          <span className="shrink-0 text-muted-foreground">{label}</span>
          <span className="text-right font-medium">{value || "—"}</span>
        </div>
      );
    }

    function SummarySection({ title, children }) {
      return (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">{title}</p>
          <div className="rounded-lg border bg-card px-4">{children}</div>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/50 px-4 py-3">
          <p className="font-semibold text-sm">
            {`${candidate?.firstname ?? ""} ${candidate?.lastname ?? ""}`.trim() || "Candidat"}
          </p>
          <p className="text-muted-foreground text-xs">{job?.title ?? "—"}</p>
        </div>

        <SummarySection title="Contrat">
          <SummaryRow label="Type" value={form.contract_type} />
          {form.contract_reason && <SummaryRow label="Motif" value={form.contract_reason} />}
          <SummaryRow label="Début" value={fmtDate(form.start_date)} />
          {form.contract_type !== "CDI" && <SummaryRow label="Fin" value={fmtDate(form.end_date)} />}
          <SummaryRow label="Heures" value={form.total_hours ? `${form.total_hours}h` : null} />
        </SummarySection>

        <SummarySection title="Poste & Lieu">
          <SummaryRow label="Intitulé" value={form.job_title} />
          {form.work_location_name && <SummaryRow label="Lieu" value={form.work_location_name} />}
          <SummaryRow
            label="Adresse"
            value={
              form.work_location_type === "multiple"
                ? form.work_locations.filter(Boolean).join(" / ")
                : form.work_location
            }
          />
        </SummarySection>

        <SummarySection title="Rémunération">
          <SummaryRow label="Taux horaire" value={form.hourly_rate ? `${form.hourly_rate} €/h` : null} />
          {form.overtime_rate && <SummaryRow label="H. supp." value={`${form.overtime_rate} €/h`} />}
          {form.meal_bonus && <SummaryRow label="Panier repas" value={`${form.meal_bonus} €/j`} />}
          {form.transport_bonus && <SummaryRow label="Transport" value={`${form.transport_bonus} €/j`} />}
          {form.is_night && <SummaryRow label="Nuit" value={form.night_bonus ? `${form.night_bonus} €/h` : "Oui"} />}
          {form.is_sunday && (
            <SummaryRow label="Dimanche" value={form.sunday_bonus ? `${form.sunday_bonus} €/h` : "Oui"} />
          )}
          {form.is_holiday && (
            <SummaryRow label="Jours fériés" value={form.holiday_bonus ? `${form.holiday_bonus} €/h` : "Oui"} />
          )}
        </SummarySection>

        {(form.equipment_provided || form.trial_period || form.custom_clauses) && (
          <SummarySection title="Clauses">
            {form.equipment_provided && <SummaryRow label="Équipement" value={form.equipment_details || "Fourni"} />}
            {form.trial_period && <SummaryRow label="Période d'essai" value={form.trial_period} />}
            {form.custom_clauses && <SummaryRow label="Clauses" value={form.custom_clauses} />}
          </SummarySection>
        )}

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300">
          En cliquant sur <strong>Envoyer au candidat</strong>, le candidat sera notifié et le statut de la candidature
          passera à <strong>Contrat envoyé</strong>.
        </div>
      </>
    );
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="flex w-full max-w-2xl flex-col gap-0 p-0">
        <SheetHeader className="shrink-0 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">
              {existingContractId ? "Modifier le contrat" : "Générer un contrat"}
            </SheetTitle>
            <span className="text-muted-foreground text-xs">
              {step}/{CONTRACT_STEPS.length}
            </span>
          </div>
          <p className="font-normal text-muted-foreground text-sm">{CONTRACT_STEPS[step - 1]}</p>
          <div className="h-1 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${(step / CONTRACT_STEPS.length) * 100}%`,
              }}
            />
          </div>
        </SheetHeader>

        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 p-6">
            {formError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive text-sm">
                {formError}
              </div>
            )}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t px-6 py-4">
          <Button variant="ghost" size="sm" onClick={step === 1 ? onClose : prevStep} disabled={submitting}>
            <ChevronLeft className="mr-1 size-4" />
            {step === 1 ? "Annuler" : "Précédent"}
          </Button>

          {step < CONTRACT_STEPS.length ? (
            <Button size="sm" onClick={nextStep}>
              Suivant
              <ChevronRight className="ml-1 size-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleSubmit("draft")} disabled={submitting}>
                {submitting ? "…" : "Enregistrer brouillon"}
              </Button>
              <Button size="sm" onClick={() => handleSubmit("published")} disabled={submitting}>
                {submitting ? "…" : "Envoyer au candidat"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Messaging Sheet ─────────────────────────────────────────────────────────

function MessagingSheet({ open, onClose, application, companyId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef(null);
  const pendingOptimisticRef = useRef(null);
  const _presenceChannelRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  const presenceIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);

  const applyId = application?.id;
  const candidateId = application?.profiles?.id ?? application?.candidate_id ?? null;
  const candidateName = `${application?.profiles?.firstname ?? ""} ${application?.profiles?.lastname ?? ""}`.trim();

  // ── Scroll to bottom helper ───────────────────────────────────────────────
  function scrollToBottom(animated = true) {
    setTimeout(
      () => {
        const el = scrollContainerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      },
      animated ? 50 : 0,
    );
  }

  // ── Présence : upsert toutes les 3s + cleanup à la fermeture ─────────────
  useEffect(() => {
    if (!open || !applyId || !companyId) return;

    const upsertPresence = () =>
      supabase.from("user_presence").upsert({
        user_id: companyId,
        apply_id: applyId,
        last_seen: new Date().toISOString(),
      });

    upsertPresence();
    presenceIntervalRef.current = setInterval(upsertPresence, 3000);

    return () => {
      clearInterval(presenceIntervalRef.current);
      supabase
        .from("user_presence")
        .delete()
        .eq("user_id", companyId)
        .eq("apply_id", applyId)
        .then(() => undefined);
    };
  }, [open, applyId, companyId]);

  // ── Broadcast channel : typing / online / offline ─────────────────────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollToBottom is stable
  useEffect(() => {
    if (!open || !applyId || !companyId) return;

    const broadcastChannel = supabase
      .channel(`conv-${applyId}`)
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload?.sender_id === companyId) return;
        setIsTyping(true);
        if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = setTimeout(async () => {
          setIsTyping(false);
          // Timeout dépassé → fetch immédiat au cas où le stop n'est pas arrivé
          const { data } = await supabase
            .from("messages")
            .select("*")
            .eq("apply_id", applyId)
            .order("created_at", { ascending: true });
          if (!data) return;
          setMessages((prev) => {
            if (data.length <= prev.filter((m) => !String(m.id).startsWith("temp_")).length) return prev;
            scrollToBottom();
            return data;
          });
        }, 3500);
      })
      .on("broadcast", { event: "typing_stop" }, (payload) => {
        if (payload.payload?.sender_id === companyId) return;
        if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
        setIsTyping(false);

        // Le mobile envoie typing_stop AVANT l'INSERT → on poll en rafale
        // jusqu'à trouver un nouveau message (max 3s)
        let attempts = 0;
        const delays = [200, 400, 700, 1200, 2000];
        let knownCount = 0;
        setMessages((prev) => {
          knownCount = prev.filter((m) => !String(m.id).startsWith("temp_")).length;
          return prev;
        });

        const tryFetch = async () => {
          if (attempts >= delays.length) return;
          const delay = delays[attempts++];
          await new Promise((r) => setTimeout(r, delay));

          const { data } = await supabase
            .from("messages")
            .select("*")
            .eq("apply_id", applyId)
            .order("created_at", { ascending: true });

          if (!data) return;

          if (data.length > knownCount) {
            // Nouveau message trouvé
            const unread = data.filter((m) => m.sender_id !== companyId && !m.is_read);
            if (unread.length > 0) {
              supabase
                .from("messages")
                .update({ is_read: true })
                .in(
                  "id",
                  unread.map((m) => m.id),
                )
                .then(() => undefined);
            }
            setMessages(data);
            scrollToBottom();
          } else {
            // Pas encore arrivé → retry
            tryFetch();
          }
        };
        tryFetch();
      })
      .on("broadcast", { event: "new_message" }, (payload) => {
        if (payload.payload?.message?.sender_id === companyId) return;
        const incomingMsg = payload.payload?.message;
        if (!incomingMsg) return;
        setIsTyping(false);
        if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
        setMessages((prev) => {
          if (prev.some((m) => m.id === incomingMsg.id)) return prev;
          return [...prev, { ...incomingMsg, is_read: true }];
        });
        scrollToBottom();
        // Marquer comme lu
        supabase
          .from("messages")
          .update({ is_read: true })
          .eq("id", incomingMsg.id)
          .then(() => undefined);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          broadcastChannelRef.current = broadcastChannel;
          broadcastChannel.send({
            type: "broadcast",
            event: "online",
            payload: { sender_id: companyId },
          });
        }
      });

    return () => {
      broadcastChannelRef.current?.send({
        type: "broadcast",
        event: "offline",
        payload: { sender_id: companyId },
      });
      broadcastChannelRef.current = null;
      if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
      supabase.removeChannel(broadcastChannel);
    };
  }, [open, applyId, companyId]);

  // ── Chargement initial + realtime (INSERT + UPDATE) ───────────────────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollToBottom is stable
  useEffect(() => {
    if (!open || !applyId || !companyId) return;

    async function loadMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("apply_id", applyId)
        .order("created_at", { ascending: true });

      const msgs = data ?? [];
      setMessages(msgs);
      scrollToBottom(false);

      // Marquer les messages du candidat comme lus
      const unread = msgs.filter((m) => m.sender_id !== companyId && !m.is_read);
      if (unread.length > 0) {
        supabase
          .from("messages")
          .update({ is_read: true })
          .in(
            "id",
            unread.map((m) => m.id),
          )
          .then(() => undefined);
      }

      // Marquer les notifications de cette conversation comme lues
      supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("recipient_id", companyId)
        .eq("entity_type", "message")
        .eq("entity_id", applyId)
        .or("is_read.is.false,is_read.is.null")
        .then(() => undefined);
    }

    loadMessages();

    const channel = supabase
      .channel(`messages:${applyId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `apply_id=eq.${applyId}`,
        },
        async (payload) => {
          const newMsg = payload.new;

          // Si message du candidat → désactiver indicateur + marquer lu
          if (newMsg.sender_id !== companyId) {
            setIsTyping(false);
            if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);

            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMsg.id)
              .then(() => undefined);

            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, { ...newMsg, is_read: true }];
            });
          } else {
            // Mon propre message : remplacer l'optimiste temporaire
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              const tempIdx = prev.findIndex((m) => typeof m.id === "string" && m.id.startsWith("temp_"));
              if (tempIdx !== -1) {
                const next = [...prev];
                next[tempIdx] = newMsg;
                pendingOptimisticRef.current = null;
                return next;
              }
              return [...prev, newMsg];
            });
          }
          scrollToBottom();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `apply_id=eq.${applyId}`,
        },
        (payload) => {
          setMessages((prev) => prev.map((m) => (m.id === payload.new.id ? payload.new : m)));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, applyId, companyId]);

  // ── Polling de secours (si postgres_changes ne reçoit pas) ───────────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollToBottom is stable
  useEffect(() => {
    if (!open || !applyId || !companyId) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("apply_id", applyId)
        .order("created_at", { ascending: true });

      if (!data) return;

      setMessages((prev) => {
        // Pas de nouveaux messages
        if (data.length <= prev.filter((m) => !String(m.id).startsWith("temp_")).length) return prev;

        // Marquer les messages reçus comme lus
        const unread = data.filter((m) => m.sender_id !== companyId && !m.is_read);
        if (unread.length > 0) {
          supabase
            .from("messages")
            .update({ is_read: true })
            .in(
              "id",
              unread.map((m) => m.id),
            )
            .then(() => undefined);
        }

        setTimeout(() => scrollToBottom(), 50);
        // Fusionner en conservant les messages optimistes en attente
        const confirmed = data;
        const pending = prev.filter((m) => String(m.id).startsWith("temp_") && pendingOptimisticRef.current === m.id);
        return [...confirmed, ...pending];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [open, applyId, companyId]);

  // ── Envoi de message ──────────────────────────────────────────────────────
  async function sendMessage() {
    if (!newMsg.trim() || !companyId || !applyId) return;

    const content = newMsg.trim();
    const tempId = `temp_${Date.now()}`;

    // Optimistic update
    pendingOptimisticRef.current = tempId;
    setNewMsg("");
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        apply_id: applyId,
        sender_id: companyId,
        content,
        created_at: new Date().toISOString(),
        is_read: false,
      },
    ]);
    scrollToBottom();

    // Arrêter l'indicateur de saisie
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    broadcastChannelRef.current?.send({
      type: "broadcast",
      event: "typing_stop",
      payload: { sender_id: companyId },
    });

    setSending(true);
    try {
      const { data: insertedMsg, error } = await supabase
        .from("messages")
        .insert({
          apply_id: applyId,
          sender_id: companyId,
          content,
          is_read: false,
        })
        .select()
        .single();

      if (error || !insertedMsg) {
        // Rollback
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        pendingOptimisticRef.current = null;
        setNewMsg(content);
        return;
      }

      // Remplacer l'optimiste si le realtime ne l'a pas déjà fait
      setMessages((prev) => prev.map((m) => (m.id === tempId ? insertedMsg : m)));
      pendingOptimisticRef.current = null;

      // Broadcaster pour que le candidat reçoive immédiatement
      broadcastChannelRef.current?.send({
        type: "broadcast",
        event: "new_message",
        payload: { message: insertedMsg },
      });

      // ── Notification groupée pour le candidat ───────────────────────
      if (!candidateId) return;

      // Vérifier si le candidat est actif sur cette conversation
      const { data: presenceData } = await supabase
        .from("user_presence")
        .select("apply_id")
        .eq("user_id", candidateId)
        .eq("apply_id", applyId)
        .gte("last_seen", new Date(Date.now() - 5000).toISOString())
        .single();

      if (presenceData) return; // Candidat actif → pas de notif

      // Supprimer les anciennes notifications de cette conversation
      await supabase.rpc("delete_conversation_notifications", {
        p_recipient_id: candidateId,
        p_apply_id: applyId,
      });

      // Compter les messages non lus de l'entreprise vers le candidat
      const { data: unreadMsgs } = await supabase
        .from("messages")
        .select("id")
        .eq("apply_id", applyId)
        .eq("sender_id", companyId)
        .or("is_read.is.false,is_read.is.null");

      const msgCount = unreadMsgs?.length ?? 1;
      const body = msgCount > 1 ? `${msgCount} nouveaux messages` : "Nouveau message";

      await supabase.from("notifications").insert({
        actor_id: companyId,
        recipient_id: candidateId,
        type: "message",
        title: application?.jobs?.title ?? "Nouveau message",
        entity_type: "message",
        entity_id: applyId,
        body,
        is_read: false,
      });
    } finally {
      setSending(false);
    }
  }

  // ── Indicateur de saisie ──────────────────────────────────────────────────
  function handleTyping(e) {
    const text = e.target.value;
    setNewMsg(text);

    if (text.length > 0) {
      broadcastChannelRef.current?.send({
        type: "broadcast",
        event: "typing",
        payload: { sender_id: companyId },
      });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        broadcastChannelRef.current?.send({
          type: "broadcast",
          event: "typing_stop",
          payload: { sender_id: companyId },
        });
        typingTimeoutRef.current = null;
      }, 3000);
    } else {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      broadcastChannelRef.current?.send({
        type: "broadcast",
        event: "typing_stop",
        payload: { sender_id: companyId },
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-0 p-0">
        <SheetHeader className="shrink-0 border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage src={application?.profiles?.avatar_url} />
              <AvatarFallback>
                {getInitials(application?.profiles?.firstname, application?.profiles?.lastname)}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="font-semibold text-sm leading-tight">{candidateName || "Candidat"}</SheetTitle>
              <p className="font-normal text-muted-foreground text-xs">{application?.jobs?.title}</p>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="py-8 text-center text-muted-foreground text-sm">Aucun message pour l'instant.</p>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender_id === companyId;
              return (
                <div key={msg.id} className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                      isMe
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground"
                    }`}
                  >
                    <p className="leading-snug">{msg.content}</p>
                  </div>
                  <div className="flex items-center gap-0.5 px-1">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && (
                      <CheckCheck className={`size-3 ${msg.is_read ? "text-green-500" : "text-muted-foreground/50"}`} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Indicateur de saisie du candidat */}
            {isTyping && (
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="flex shrink-0 gap-2 border-t px-4 py-3">
          <Input
            value={newMsg}
            onChange={handleTyping}
            placeholder="Écrire un message…"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            className="flex-1"
          />
          <Button size="icon" onClick={sendMessage} disabled={sending || !newMsg.trim()}>
            <Send className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">{title}</p>
      {children}
    </div>
  );
}

// ─── Application detail panel ─────────────────────────────────────────────────

function ApplicationDetail({
  application,
  statusEvents,
  companyId,
  onSelect,
  onReject,
  onGenerateContract,
  draftRefreshKey,
}) {
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [contractId, setContractId] = useState(null);

  const status = application.current_status;
  const statusCfg = STATUS_CONFIG[status];
  const job = application.jobs;
  const profile = application.profiles;
  const salary = job ? formatSalary(job) : null;
  const hasContract = ["contract_sent", "contract_signed_candidate", "contract_signed_pro"].includes(status);

  const candidateName = `${profile?.firstname ?? ""} ${profile?.lastname ?? ""}`.trim();

  // biome-ignore lint/correctness/useExhaustiveDependencies: draftRefreshKey is an intentional refresh trigger
  useEffect(() => {
    if (status !== "selected") {
      setHasDraft(false);
      return;
    }
    supabase
      .from("contracts")
      .select("id")
      .eq("apply_id", application.id)
      .in("status", ["draft", "published"])
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setHasDraft(!!data));
  }, [application.id, status, draftRefreshKey]);

  useEffect(() => {
    if (!hasContract) {
      setContractId(null);
      return;
    }
    supabase
      .from("contracts")
      .select("id")
      .eq("apply_id", application.id)
      .eq("status", "published")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setContractId(data?.id ?? null));
  }, [application.id, hasContract]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-6 p-6">
        {/* Candidate header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 border text-lg">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{getInitials(profile?.firstname, profile?.lastname)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-xl">{candidateName || "Candidat"}</h2>
              <p className="text-muted-foreground text-sm">Candidature reçue le {formatDate(application.created_at)}</p>
            </div>
          </div>
          {statusCfg && (
            <Badge className={`h-6 shrink-0 px-2 font-medium text-[11px] ${statusCfg.badgeClass}`}>
              {statusCfg.title}
            </Badge>
          )}
        </div>

        <div className="h-px bg-border" />

        {/* Job info */}
        {job && (
          <Section title="Offre concernée">
            <div className="flex flex-col gap-2.5 rounded-xl border bg-muted/30 p-4">
              <p className="font-semibold">{job.title}</p>
              <div className="flex flex-wrap gap-2">
                {job.category && (
                  <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-[11px]">
                    {getCatAcronym(job.category)}
                  </span>
                )}
                {job.contract_type && (
                  <Badge variant="outline" className="h-5 px-1.5 text-[11px]">
                    {job.contract_type.toUpperCase()}
                  </Badge>
                )}
                {job.city && (
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <MapPin className="size-3" />
                    {job.city}
                    {job.department_code && ` (${job.department_code})`}
                  </span>
                )}
                {salary && salary !== "Non spécifié" && (
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Banknote className="size-3" />
                    {salary}
                  </span>
                )}
                {job.work_time && (
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="size-3" />
                    {job.work_time === "fulltime" ? "Temps plein" : "Temps partiel"}
                  </span>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* Timeline */}
        <Section title="Suivi de la candidature">
          <Timeline events={statusEvents} />
        </Section>

        {/* Messaging button — hidden if applied or rejected */}
        {status !== "applied" && status !== "rejected" && (
          <>
            <div className="h-px bg-border" />
            <Button onClick={() => setMessagingOpen(true)} className="w-full gap-2">
              <MessagesSquare className="size-4" />
              Messagerie
            </Button>
          </>
        )}

        {/* Contract */}
        {hasContract && (
          <>
            <div className="h-px bg-border" />
            <Section title="Contrat de mission">
              <Link
                href={contractId ? `/contracts/${contractId}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">Contrat de mission</p>
                  <p className="text-muted-foreground text-xs">
                    {status === "contract_signed_pro" ? "Voir le contrat" : "Voir & finaliser le contrat"}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </Section>
          </>
        )}

        {/* Actions */}
        {(status === "applied" || status === "selected") && (
          <>
            <div className="h-px bg-border" />
            <Section title="Actions">
              {status === "applied" && (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => onSelect(application)}
                    variant="outline"
                    className="w-full border-violet-500 text-violet-600 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-950"
                  >
                    <CheckCircle className="mr-2 size-4" />
                    Sélectionner le candidat
                  </Button>
                  <Button
                    onClick={() => onReject(application)}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive/5"
                  >
                    <XCircle className="mr-2 size-4" />
                    Refuser la candidature
                  </Button>
                </div>
              )}
              {status === "selected" && (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => onGenerateContract(application)}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    {hasDraft ? (
                      <>
                        <FileText className="mr-2 size-4" />
                        Modifier le brouillon
                      </>
                    ) : (
                      <>
                        <FileCheck className="mr-2 size-4" />
                        Générer le contrat
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => onReject(application)}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive/5"
                  >
                    <XCircle className="mr-2 size-4" />
                    Refuser la candidature
                  </Button>
                </div>
              )}
            </Section>
          </>
        )}

        {status === "rejected" && <p className="text-muted-foreground text-sm">Cette candidature a été refusée.</p>}
        {status === "contract_signed_pro" && (
          <p className="text-muted-foreground text-sm">La mission est confirmée. Aucune action requise.</p>
        )}
      </div>

      <MessagingSheet
        open={messagingOpen}
        onClose={() => setMessagingOpen(false)}
        application={application}
        companyId={companyId}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyApplicationsPage() {
  const [companyId, setCompanyId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusEvents, setStatusEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // Confirmation dialogs
  const [selectTarget, setSelectTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [contractSheetApp, setContractSheetApp] = useState(null);
  const [draftRefreshKey, setDraftRefreshKey] = useState(0);

  // Init
  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchApplications is defined after this effect
  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setCompanyId(user.id);
      await fetchApplications(user.id);
    }
    init();
  }, []);

  async function fetchApplications(cid) {
    setLoading(true);
    const { data } = await supabase
      .from("applications")
      .select("*, jobs(*), profiles(*)")
      .eq("company_id", cid)
      .order("created_at", { ascending: false });
    const apps = data ?? [];
    setApplications(apps);
    if (apps.length) {
      setSelectedApp(apps[0]);
      await loadStatusEvents(apps[0].id);
    }
    setLoading(false);
  }

  async function loadStatusEvents(applyId) {
    const { data } = await supabase
      .from("application_status_events")
      .select("*")
      .eq("application_id", applyId)
      .order("created_at", { ascending: true });
    setStatusEvents(data ?? []);
  }

  async function handleSelectApp(app) {
    setSelectedApp(app);
    await loadStatusEvents(app.id);
  }

  async function updateStatus(applyId, newStatus) {
    await supabase.from("application_status_events").insert({
      application_id: applyId,
      status: newStatus,
      updated_by: "company",
    });
    await supabase
      .from("applications")
      .update({
        current_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applyId);

    setApplications((prev) => prev.map((a) => (a.id === applyId ? { ...a, current_status: newStatus } : a)));
    if (selectedApp?.id === applyId) {
      setSelectedApp((prev) => ({
        ...prev,
        current_status: newStatus,
      }));
      await loadStatusEvents(applyId);
    }
  }

  async function confirmSelect() {
    if (!selectTarget) return;
    await updateStatus(selectTarget.id, "selected");
    setSelectTarget(null);
  }

  async function confirmReject() {
    if (!rejectTarget) return;
    await updateStatus(rejectTarget.id, "rejected");
    setRejectTarget(null);
  }

  function handleContractSaved(newStatus, appId) {
    setDraftRefreshKey((k) => k + 1);
    if (!appId) return;
    if (newStatus) {
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, current_status: newStatus } : a)));
      setSelectedApp((prev) => (prev?.id === appId ? { ...prev, current_status: newStatus } : prev));
      loadStatusEvents(appId);
    }
  }

  // Filtered list
  const filtered = applications.filter((app) => {
    const matchStatus = !statusFilter || app.current_status === statusFilter;
    const name = `${app.profiles?.firstname ?? ""} ${app.profiles?.lastname ?? ""}`.toLowerCase();
    const matchSearch =
      !search || name.includes(search.toLowerCase()) || app.jobs?.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Stats
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.current_status === "applied").length,
    selected: applications.filter((a) => a.current_status === "selected").length,
    finalized: applications.filter((a) =>
      ["contract_sent", "contract_signed_candidate", "contract_signed_pro"].includes(a.current_status),
    ).length,
  };

  return (
    <div className="flex flex-col gap-6" style={{ height: "calc(100dvh - 96px)" }}>
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Candidatures</h1>
        <p className="text-muted-foreground text-sm">
          {applications.length} candidature
          {applications.length !== 1 ? "s" : ""} reçue
          {applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="font-bold text-2xl">{stats.total}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-muted-foreground text-sm">En attente</p>
          <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">{stats.applied}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-muted-foreground text-sm">Sélectionnés</p>
          <p className="font-bold text-2xl text-violet-600 dark:text-violet-400">{stats.selected}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-muted-foreground text-sm">Contrats</p>
          <p className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">{stats.finalized}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Rechercher un candidat ou une offre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 shrink-0"
        />
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={statusFilter === opt.value ? "default" : "outline"}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <Users className="size-10 text-muted-foreground/40" />
            <p className="font-medium">Aucune candidature pour l'instant</p>
            <p className="text-muted-foreground text-sm">Les candidatures reçues sur vos offres apparaîtront ici.</p>
          </div>
        ) : (
          <div className="flex h-full gap-4">
            {/* Left : list */}
            <div className="flex w-full flex-col gap-2 overflow-y-auto lg:w-96 lg:shrink-0 xl:w-105">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground text-sm">Aucune candidature pour ce filtre.</p>
              ) : (
                filtered.map((app) => {
                  const cfg = STATUS_CONFIG[app.current_status];
                  const isActive = selectedApp?.id === app.id;
                  const name = `${app.profiles?.firstname ?? ""} ${app.profiles?.lastname ?? ""}`.trim();
                  return (
                    <button
                      type="button"
                      key={app.id}
                      onClick={() => handleSelectApp(app)}
                      className={`group w-full rounded-xl border bg-card p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isActive ? "border-primary shadow-sm bg-primary/3" : "hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="mt-0.5 size-9 shrink-0">
                          <AvatarImage src={app.profiles?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {getInitials(app.profiles?.firstname, app.profiles?.lastname)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="truncate font-semibold text-sm">{name || "Candidat"}</span>
                            {cfg && (
                              <Badge className={`h-5 shrink-0 px-1.5 font-medium text-[10px] ${cfg.badgeClass}`}>
                                {cfg.title}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-muted-foreground text-xs">{app.jobs?.title ?? "—"}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground/60">{formatDate(app.created_at)}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right : detail */}
            <div className="hidden min-h-0 flex-1 overflow-hidden rounded-xl border bg-card lg:flex">
              {selectedApp ? (
                <ApplicationDetail
                  application={selectedApp}
                  statusEvents={statusEvents}
                  companyId={companyId}
                  onSelect={(app) => setSelectTarget(app)}
                  onReject={(app) => setRejectTarget(app)}
                  onGenerateContract={(app) => setContractSheetApp(app)}
                  draftRefreshKey={draftRefreshKey}
                />
              ) : (
                <div className="flex w-full items-center justify-center text-muted-foreground text-sm">
                  Sélectionnez une candidature
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dialog — sélectionner */}
      <AlertDialog open={!!selectTarget} onOpenChange={(v) => !v && setSelectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la sélection</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir sélectionner ce candidat pour la suite du processus de recrutement ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSelect}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog — refuser */}
      <AlertDialog open={!!rejectTarget} onOpenChange={(v) => !v && setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le refus</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir refuser cette candidature ? Cette action est définitive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Refuser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ContractSheet
        open={!!contractSheetApp}
        onClose={() => setContractSheetApp(null)}
        application={contractSheetApp}
        companyId={companyId}
        onContractSaved={handleContractSaved}
      />
    </div>
  );
}
