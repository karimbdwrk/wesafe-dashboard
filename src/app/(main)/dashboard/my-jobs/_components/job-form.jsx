"use client";

import { useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CATEGORY } from "@/constants/categories";
import { CERTIFICATIONS } from "@/constants/certifications";
import { CNAPS_CARDS } from "@/constants/cnapscards";
import { departements } from "@/constants/departements";
import { DIPLOMAS } from "@/constants/diplomas";
import { DRIVING_LICENSES } from "@/constants/drivinglicences";
import { languages as LANGUAGES } from "@/constants/languages";
import { regions } from "@/constants/regions";
import { supabase } from "@/lib/supabase/supabaseClient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "boolean") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cleanArray(arr) {
  if (!arr || arr.length === 0) return null;
  return JSON.stringify(arr);
}

function getRegionFromDeptCode(code) {
  const dept = departements.find((d) => d.code === code);
  if (!dept) return { region: "", region_code: "" };
  const region = regions.find((r) => r.code === dept.codeRegion);
  return { region: region?.nom ?? "", region_code: dept.codeRegion };
}

const CATEGORY_GROUP_LABELS = {
  surveillance_humaine: "Surveillance humaine",
  securite_incendie: "Sécurité Incendie",
  cynophile: "Cynophile",
  protection_rapprochee: "Protection Rapprochée",
  transport_fonds: "Transport de Fonds",
  videosurveillance: "Vidéosurveillance",
  surete_aeroportuaire: "Sûreté Aéroportuaire",
  encadrement: "Encadrement",
  specialisation: "Spécialisations",
};

const DIPLOMA_GROUP_LABELS = {
  surveillance_humaine: "Surveillance humaine",
  cynophile: "Cynophile",
  protection_rapprochee: "Protection rapprochée",
  videoprotection: "Vidéoprotection",
  securite_incendie: "Sécurité Incendie",
};

const CERTIF_GROUP_LABELS = {
  secourisme: "Secourisme",
  habilitation: "Habilitation",
  evenementiel: "Événementiel",
  protection_rapprochee: "Protection rapprochée",
  surete_aeroportuaire: "Sûreté aéroportuaire",
  securite_incendie: "Sécurité Incendie",
  cynophile: "Cynophile",
};

const DL_GROUP_LABELS = {
  moto: "Moto",
  vehicule_leger: "Véhicule léger",
  poids_lourd: "Poids lourd",
  transport_personnes: "Transport de personnes",
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <div className="border-b pb-2">
      <p className="font-semibold text-sm">{children}</p>
    </div>
  );
}

function Field({ label, error, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-medium text-sm">
        {label}
        {required && " *"}
      </Label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

function TextareaInput({ className = "", ...props }) {
  return (
    <textarea
      className={`flex min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

function TypeButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md border-2 py-2 font-semibold text-sm transition-colors ${
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:border-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function TagChip({ acronym, name, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={name}
      className={`rounded px-2 py-0.5 font-bold text-xs transition-colors ${
        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
      }`}
    >
      {acronym}
    </button>
  );
}

function ArrayInput({ placeholder, items, onAdd, onRemove }) {
  const [current, setCurrent] = useState("");

  function handleAdd() {
    const trimmed = current.trim();
    if (trimmed) {
      onAdd(trimmed);
      setCurrent("");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <TextInput
          placeholder={placeholder}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" size="sm" onClick={handleAdd} className="shrink-0">
          <Plus className="size-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-col gap-1">
          {items.map((item, i) => (
            <div key={`${item}-${i}`} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5 text-sm">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
              <span className="flex-1">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────────────────────────

export function JobForm({ companyId, initialData, onSaved, onCancel }) {
  const isEdit = !!initialData;
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    category: initialData?.category ?? "",
    description: initialData?.description ?? "",
    isLastMinute: initialData?.isLastMinute ?? false,
    // Localisation
    city: initialData?.city ?? "",
    postcode: initialData?.postcode ?? "",
    department_code: initialData?.department_code ?? "",
    // Contrat
    contract_type: initialData?.contract_type ?? "cdi",
    work_time: initialData?.work_time ?? "fulltime",
    work_schedule: initialData?.work_schedule ?? "",
    start_date: initialData?.start_date ?? "",
    end_date: initialData?.end_date ?? "",
    start_date_asap: initialData?.start_date_asap ?? false,
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
    date_mode: initialData?.date_mode ?? "dates",
    vacations: parseList(initialData?.vacations),
    // Rémunération
    salary_type: initialData?.salary_type ?? "selon_profil",
    salary_hourly: initialData?.salary_hourly ?? "",
    salary_monthly_fixed: initialData?.salary_monthly_fixed ?? "",
    salary_annual_fixed: initialData?.salary_annual_fixed ?? "",
    salary_monthly_min: initialData?.salary_monthly_min ?? "",
    salary_monthly_max: initialData?.salary_monthly_max ?? "",
    salary_annual_min: initialData?.salary_annual_min ?? "",
    salary_annual_max: initialData?.salary_annual_max ?? "",
    weekly_hours: initialData?.weekly_hours ?? "",
    daily_hours: initialData?.daily_hours ?? "",
    work_hours_type: initialData?.work_hours_type ?? "semaine",
    // Listes
    missions: parseList(initialData?.missions),
    searched_profile: parseList(initialData?.searched_profile),
    diplomas_required: parseList(initialData?.diplomas_required),
    certifications_required: parseList(initialData?.certifications_required),
    cnaps_required: parseList(initialData?.cnaps_required),
    driving_licenses: parseList(initialData?.driving_licenses),
    languages: parseList(initialData?.languages),
    reimbursements: parseList(initialData?.reimbursements),
    packed_lunch: initialData?.packed_lunch ?? false,
    accommodations: initialData?.accommodations ?? false,
    // Statut
    status: initialData?.status ?? "published",
  });

  const [newVacation, setNewVacation] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });

  function update(field, value) {
    setForm((prev) => {
      if (field === "contract_type" && value === "cdi") {
        return {
          ...prev,
          [field]: value,
          date_mode: "dates",
          vacations: [],
          end_date: "",
        };
      }
      if (field === "date_mode" && value === "vacations") {
        return {
          ...prev,
          date_mode: value,
          salary_type: "hourly",
          work_hours_type: "jour",
          weekly_hours: "",
        };
      }
      if (field === "date_mode" && value === "dates") {
        return { ...prev, date_mode: value, vacations: [] };
      }
      if (field === "work_hours_type") {
        return {
          ...prev,
          [field]: value,
          weekly_hours: "",
          daily_hours: "",
        };
      }
      return { ...prev, [field]: value };
    });
  }

  function toggleArrayItem(field, acronym) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(acronym) ? prev[field].filter((v) => v !== acronym) : [...prev[field], acronym],
    }));
  }

  function addToList(field, value) {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value] }));
  }

  function removeFromList(field, index) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  function addVacation() {
    if (!newVacation.date || !newVacation.start_time || !newVacation.end_time) return;
    if (form.vacations.length >= 7) return;
    setForm((prev) => ({
      ...prev,
      vacations: [...prev.vacations, { ...newVacation }].sort((a, b) => new Date(a.date) - new Date(b.date)),
    }));
    setNewVacation({ date: "", start_time: "", end_time: "" });
  }

  function validate() {
    const errs = {};
    if (!form.title.trim() || form.title.length < 3) errs.title = "Titre requis (min. 3 caractères)";
    if (!form.category) errs.category = "Catégorie requise";
    if (!form.city.trim()) errs.city = "Ville requise";
    if (!form.department_code) errs.department_code = "Département requis";
    const isVac = form.contract_type === "cdd" && form.date_mode === "vacations";
    if (!isVac && !form.start_date && !form.start_date_asap) errs.start_date = "Date de début requise";
    if (form.contract_type === "cdd" && form.date_mode === "dates" && !form.end_date)
      errs.end_date = "Date de fin requise pour un CDD";
    if (isVac && form.vacations.length === 0) errs.vacations = "Ajoutez au moins une vacation";
    if (form.salary_type === "hourly" && !form.salary_hourly) errs.salary_hourly = "Taux horaire requis";
    if (form.salary_type === "monthly_fixed" && !form.salary_monthly_fixed)
      errs.salary_monthly_fixed = "Salaire mensuel requis";
    if (form.salary_type === "annual_fixed" && !form.salary_annual_fixed)
      errs.salary_annual_fixed = "Salaire annuel requis";
    if (form.salary_type === "monthly_range" && (!form.salary_monthly_min || !form.salary_monthly_max))
      errs.salary_range = "Fourchette min. et max. requises";
    if (form.salary_type === "annual_range" && (!form.salary_annual_min || !form.salary_annual_max))
      errs.salary_range = "Fourchette min. et max. requises";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const { region, region_code } = getRegionFromDeptCode(form.department_code);
    const dept = departements.find((d) => d.code === form.department_code);
    const isVacMode = form.contract_type === "cdd" && form.date_mode === "vacations";

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description || null,
      isLastMinute: form.isLastMinute,
      city: form.city,
      postcode: form.postcode || null,
      department_code: form.department_code,
      department: dept?.nom ?? "",
      region,
      region_code,
      contract_type: form.contract_type,
      work_time: form.work_time || null,
      work_schedule: form.work_schedule || null,
      start_date: isVacMode ? null : form.start_date || null,
      end_date: isVacMode ? null : form.end_date || null,
      start_date_asap: form.start_date_asap,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      date_mode: form.date_mode,
      vacations: isVacMode ? cleanArray(form.vacations) : null,
      salary_type: form.salary_type || null,
      salary_hourly: form.salary_hourly === "" ? null : Number(form.salary_hourly),
      salary_monthly_fixed: form.salary_monthly_fixed === "" ? null : Number(form.salary_monthly_fixed),
      salary_annual_fixed: form.salary_annual_fixed === "" ? null : Number(form.salary_annual_fixed),
      salary_monthly_min: form.salary_monthly_min === "" ? null : Number(form.salary_monthly_min),
      salary_monthly_max: form.salary_monthly_max === "" ? null : Number(form.salary_monthly_max),
      salary_annual_min: form.salary_annual_min === "" ? null : Number(form.salary_annual_min),
      salary_annual_max: form.salary_annual_max === "" ? null : Number(form.salary_annual_max),
      weekly_hours: form.weekly_hours === "" ? null : Number(form.weekly_hours),
      daily_hours: form.daily_hours === "" ? null : Number(form.daily_hours),
      work_hours_type: form.work_hours_type || null,
      missions: cleanArray(form.missions),
      searched_profile: cleanArray(form.searched_profile),
      diplomas_required: cleanArray(form.diplomas_required),
      certifications_required: cleanArray(form.certifications_required),
      cnaps_required: cleanArray(form.cnaps_required),
      driving_licenses: cleanArray(form.driving_licenses),
      languages: cleanArray(form.languages),
      reimbursements: cleanArray(form.reimbursements),
      packed_lunch: form.packed_lunch,
      accommodations: form.accommodations,
      company_id: companyId,
      status: form.status,
    };

    let result;
    if (isEdit) {
      const { data, error } = await supabase
        .from("jobs")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", initialData.id)
        .select("*")
        .single();
      result = { data, error };
    } else {
      const { data, error } = await supabase.from("jobs").insert(payload).select("*").single();
      result = { data, error };
    }

    setSaving(false);
    if (!result.error && result.data) {
      onSaved(result.data, !isEdit);
    }
  }

  // Grouped data
  const groupedCategories = CATEGORY.reduce((acc, cat) => {
    if (!acc[cat.category]) acc[cat.category] = [];
    acc[cat.category].push(cat);
    return acc;
  }, {});

  const groupedDiplomas = Object.entries(DIPLOMAS).reduce((acc, [key, d]) => {
    if (!acc[d.category]) acc[d.category] = [];
    acc[d.category].push({ key, ...d });
    return acc;
  }, {});

  const groupedCertifs = Object.entries(CERTIFICATIONS).reduce((acc, [key, c]) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push({ key, ...c });
    return acc;
  }, {});

  const groupedDL = Object.entries(DRIVING_LICENSES).reduce((acc, [key, dl]) => {
    if (!acc[dl.category]) acc[dl.category] = [];
    acc[dl.category].push({ key, ...dl });
    return acc;
  }, {});

  const isVacationsMode = form.contract_type === "cdd" && form.date_mode === "vacations";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 pb-8">
      {/* ── Dernière minute ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-md border px-4 py-3">
        <div>
          <p className="font-semibold text-sm">Offre dernière minute</p>
          <p className="text-muted-foreground text-xs">Visible avec un badge urgence</p>
        </div>
        <Switch checked={form.isLastMinute} onCheckedChange={(v) => update("isLastMinute", v)} />
      </div>

      {/* ── Informations principales ──────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Informations principales</SectionTitle>

        <Field label="Titre du poste" required error={errors.title}>
          <TextInput
            placeholder="Ex : Agent de sécurité APS"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </Field>

        <Field label="Catégorie" required error={errors.category}>
          <Select value={form.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedCategories).map(([groupKey, items]) => (
                <div key={groupKey}>
                  <p className="px-2 pt-2 pb-1 font-bold text-[11px] text-muted-foreground uppercase tracking-wide">
                    {CATEGORY_GROUP_LABELS[groupKey] ?? groupKey}
                  </p>
                  {items.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="font-bold">{cat.acronym}</span> — {cat.name}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Description du poste" error={errors.description}>
          <TextareaInput
            placeholder="Décrivez le poste, les responsabilités..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>
      </div>

      {/* ── Missions ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Missions principales</SectionTitle>
        <ArrayInput
          placeholder="Ajouter une mission..."
          items={form.missions}
          onAdd={(v) => addToList("missions", v)}
          onRemove={(i) => removeFromList("missions", i)}
        />
      </div>

      {/* ── Profil recherché ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Profil recherché</SectionTitle>
        <ArrayInput
          placeholder="Ajouter une compétence..."
          items={form.searched_profile}
          onAdd={(v) => addToList("searched_profile", v)}
          onRemove={(i) => removeFromList("searched_profile", i)}
        />
      </div>

      {/* ── Diplômes requis ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Diplômes requis</SectionTitle>
        {Object.entries(groupedDiplomas).map(([groupKey, items]) => (
          <div key={groupKey} className="flex flex-col gap-1.5">
            <p className="font-bold text-[11px] text-muted-foreground uppercase tracking-wide">
              {DIPLOMA_GROUP_LABELS[groupKey] ?? groupKey}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((d) => (
                <TagChip
                  key={d.key}
                  acronym={d.acronym}
                  name={d.name}
                  selected={form.diplomas_required.includes(d.acronym)}
                  onToggle={() => toggleArrayItem("diplomas_required", d.acronym)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Certifications requises ───────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Certifications requises</SectionTitle>
        {Object.entries(groupedCertifs).map(([groupKey, items]) => (
          <div key={groupKey} className="flex flex-col gap-1.5">
            <p className="font-bold text-[11px] text-muted-foreground uppercase tracking-wide">
              {CERTIF_GROUP_LABELS[groupKey] ?? groupKey}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((c) => (
                <TagChip
                  key={c.key}
                  acronym={c.acronym}
                  name={c.name}
                  selected={form.certifications_required.includes(c.acronym)}
                  onToggle={() => toggleArrayItem("certifications_required", c.acronym)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Cartes CNAPS requises ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Cartes CNAPS requises</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(CNAPS_CARDS).map(([key, card]) => (
            <TagChip
              key={key}
              acronym={card.acronym}
              name={card.name}
              selected={form.cnaps_required.includes(card.acronym)}
              onToggle={() => toggleArrayItem("cnaps_required", card.acronym)}
            />
          ))}
        </div>
      </div>

      {/* ── Localisation ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Localisation</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ville" required error={errors.city}>
            <TextInput placeholder="Paris" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </Field>
          <Field label="Code postal" error={errors.postcode}>
            <TextInput
              placeholder="75000"
              maxLength={5}
              value={form.postcode}
              onChange={(e) => update("postcode", e.target.value.replace(/\D/g, "").slice(0, 5))}
            />
          </Field>
        </div>
        <Field label="Département" required error={errors.department_code}>
          <Select value={form.department_code} onValueChange={(v) => update("department_code", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              {departements.map((d) => (
                <SelectItem key={d.code} value={d.code}>
                  {d.code} — {d.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* ── Contrat & Dates ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Contrat & Dates</SectionTitle>

        <Field label="Type de contrat" required>
          <div className="flex gap-2">
            <TypeButton active={form.contract_type === "cdi"} onClick={() => update("contract_type", "cdi")}>
              CDI
            </TypeButton>
            <TypeButton active={form.contract_type === "cdd"} onClick={() => update("contract_type", "cdd")}>
              CDD
            </TypeButton>
          </div>
        </Field>

        {/* Mode planification — CDD uniquement */}
        {form.contract_type === "cdd" && (
          <Field label="Mode de planification" required>
            <div className="flex gap-2">
              <TypeButton active={form.date_mode === "dates"} onClick={() => update("date_mode", "dates")}>
                Dates début / fin
              </TypeButton>
              <TypeButton active={form.date_mode === "vacations"} onClick={() => update("date_mode", "vacations")}>
                Vacations
              </TypeButton>
            </div>
          </Field>
        )}

        {/* Dates normales */}
        {!isVacationsMode && (
          <>
            <Field label={form.contract_type === "cdi" ? "Date de début" : "Date de début *"} error={errors.start_date}>
              {form.contract_type === "cdi" && (
                <div className="mb-1.5 flex items-center gap-3">
                  <Switch
                    checked={form.start_date_asap}
                    onCheckedChange={(v) => {
                      update("start_date_asap", v);
                      if (v) update("start_date", "");
                    }}
                  />
                  <Label
                    className="cursor-pointer text-muted-foreground text-sm"
                    onClick={() => update("start_date_asap", !form.start_date_asap)}
                  >
                    Dès que possible
                  </Label>
                </div>
              )}
              {!form.start_date_asap && (
                <TextInput type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} />
              )}
            </Field>

            {form.contract_type === "cdd" && (
              <Field label="Date de fin *" error={errors.end_date}>
                <TextInput type="date" value={form.end_date} onChange={(e) => update("end_date", e.target.value)} />
              </Field>
            )}
          </>
        )}

        {/* Mode vacations */}
        {isVacationsMode && (
          <div className="flex flex-col gap-3">
            {errors.vacations && <p className="text-destructive text-xs">{errors.vacations}</p>}
            <p className="text-muted-foreground text-xs">Vacations ({form.vacations.length}/7)</p>

            {form.vacations.length < 7 && (
              <div className="flex flex-col gap-2 rounded-md border p-3">
                <p className="font-medium text-muted-foreground text-xs">Nouvelle vacation</p>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Date *">
                    <TextInput
                      type="date"
                      value={newVacation.date}
                      onChange={(e) =>
                        setNewVacation((p) => ({
                          ...p,
                          date: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Début *">
                    <TextInput
                      placeholder="HH:MM"
                      maxLength={5}
                      value={newVacation.start_time}
                      onChange={(e) =>
                        setNewVacation((p) => ({
                          ...p,
                          start_time: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Fin *">
                    <TextInput
                      placeholder="HH:MM"
                      maxLength={5}
                      value={newVacation.end_time}
                      onChange={(e) =>
                        setNewVacation((p) => ({
                          ...p,
                          end_time: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={addVacation}
                  disabled={!newVacation.date || !newVacation.start_time || !newVacation.end_time}
                >
                  <Plus className="mr-1 size-3.5" /> Ajouter
                </Button>
              </div>
            )}

            {form.vacations.length > 0 && (
              <div className="flex flex-col gap-1">
                {form.vacations.map((v, i) => (
                  <div key={`${v.date}-${i}`} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <span className="font-semibold text-primary">{v.date}</span>
                    <span className="text-muted-foreground">
                      {v.start_time} → {v.end_time}
                    </span>
                    <button
                      type="button"
                      className="ml-auto text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          vacations: p.vacations.filter((_, j) => j !== i),
                        }))
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Temps de travail — masqué en mode vacations */}
        {!isVacationsMode && (
          <Field label="Temps de travail">
            <div className="flex gap-2">
              <TypeButton active={form.work_time === "fulltime"} onClick={() => update("work_time", "fulltime")}>
                Temps plein
              </TypeButton>
              <TypeButton active={form.work_time === "parttime"} onClick={() => update("work_time", "parttime")}>
                Temps partiel
              </TypeButton>
            </div>
          </Field>
        )}

        {/* Horaires de travail — masqué en mode vacations */}
        {!isVacationsMode && (
          <div className="flex flex-col gap-3">
            <Field label="Horaires de travail">
              <div className="flex gap-2">
                {[
                  { value: "", label: "—" },
                  { value: "daily", label: "Jour" },
                  { value: "nightly", label: "Nuit" },
                  { value: "variable", label: "Variable" },
                ].map((o) => (
                  <TypeButton
                    key={o.value}
                    active={form.work_schedule === o.value}
                    onClick={() => update("work_schedule", o.value)}
                  >
                    {o.label}
                  </TypeButton>
                ))}
              </div>
            </Field>

            {(form.work_schedule === "daily" || form.work_schedule === "nightly") && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Heure début">
                  <TextInput
                    placeholder="HH:MM"
                    maxLength={5}
                    value={form.start_time}
                    onChange={(e) => update("start_time", e.target.value)}
                  />
                </Field>
                <Field label="Heure fin">
                  <TextInput
                    placeholder="HH:MM"
                    maxLength={5}
                    value={form.end_time}
                    onChange={(e) => update("end_time", e.target.value)}
                  />
                </Field>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Rémunération ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Rémunération</SectionTitle>

        <Field label="Type de rémunération" required>
          <Select value={form.salary_type} onValueChange={(v) => update("salary_type", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {!isVacationsMode && <SelectItem value="selon_profil">Selon profil</SelectItem>}
              <SelectItem value="hourly">Taux horaire</SelectItem>
              {!isVacationsMode && <SelectItem value="monthly_fixed">Salaire mensuel fixe</SelectItem>}
              {!isVacationsMode && <SelectItem value="annual_fixed">Salaire annuel fixe</SelectItem>}
              {!isVacationsMode && <SelectItem value="monthly_range">Fourchette mensuelle</SelectItem>}
              {!isVacationsMode && <SelectItem value="annual_range">Fourchette annuelle</SelectItem>}
            </SelectContent>
          </Select>
        </Field>

        {form.salary_type === "selon_profil" && (
          <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-center text-primary text-sm">
            💡 Le salaire sera déterminé selon le profil du candidat
          </div>
        )}

        {form.salary_type === "hourly" && (
          <>
            <Field label="Taux horaire (€) *" error={errors.salary_hourly}>
              <TextInput
                type="number"
                placeholder="Ex: 15.50"
                step="0.01"
                min="0"
                value={form.salary_hourly}
                onChange={(e) => update("salary_hourly", e.target.value)}
              />
            </Field>

            {!isVacationsMode && (
              <Field label="Période de travail">
                <div className="flex gap-2">
                  <TypeButton
                    active={form.work_hours_type === "semaine"}
                    onClick={() => update("work_hours_type", "semaine")}
                  >
                    Par semaine
                  </TypeButton>
                  <TypeButton
                    active={form.work_hours_type === "jour"}
                    onClick={() => update("work_hours_type", "jour")}
                  >
                    Par jour
                  </TypeButton>
                </div>
              </Field>
            )}

            {!isVacationsMode && form.work_hours_type === "semaine" && (
              <Field label="Heures / semaine">
                <TextInput
                  type="number"
                  placeholder="35"
                  min="1"
                  max="60"
                  value={form.weekly_hours}
                  onChange={(e) => update("weekly_hours", e.target.value)}
                />
              </Field>
            )}

            {!isVacationsMode && form.work_hours_type === "jour" && (
              <Field label="Heures / jour">
                <TextInput
                  type="number"
                  placeholder="7"
                  min="1"
                  max="24"
                  value={form.daily_hours}
                  onChange={(e) => update("daily_hours", e.target.value)}
                />
              </Field>
            )}
          </>
        )}

        {form.salary_type === "monthly_fixed" && (
          <Field label="Salaire mensuel brut (€) *" error={errors.salary_monthly_fixed}>
            <TextInput
              type="number"
              placeholder="2500"
              value={form.salary_monthly_fixed}
              onChange={(e) => update("salary_monthly_fixed", e.target.value)}
            />
          </Field>
        )}

        {form.salary_type === "annual_fixed" && (
          <Field label="Salaire annuel brut (€) *" error={errors.salary_annual_fixed}>
            <TextInput
              type="number"
              placeholder="35000"
              value={form.salary_annual_fixed}
              onChange={(e) => update("salary_annual_fixed", e.target.value)}
            />
          </Field>
        )}

        {form.salary_type === "monthly_range" && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min. mensuel (€) *" error={errors.salary_range}>
              <TextInput
                type="number"
                placeholder="2000"
                value={form.salary_monthly_min}
                onChange={(e) => update("salary_monthly_min", e.target.value)}
              />
            </Field>
            <Field label="Max. mensuel (€) *">
              <TextInput
                type="number"
                placeholder="2800"
                value={form.salary_monthly_max}
                onChange={(e) => update("salary_monthly_max", e.target.value)}
              />
            </Field>
          </div>
        )}

        {form.salary_type === "annual_range" && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min. annuel (€) *" error={errors.salary_range}>
              <TextInput
                type="number"
                placeholder="30000"
                value={form.salary_annual_min}
                onChange={(e) => update("salary_annual_min", e.target.value)}
              />
            </Field>
            <Field label="Max. annuel (€) *">
              <TextInput
                type="number"
                placeholder="40000"
                value={form.salary_annual_max}
                onChange={(e) => update("salary_annual_max", e.target.value)}
              />
            </Field>
          </div>
        )}
      </div>

      {/* ── Permis de conduire ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Permis de conduire</SectionTitle>
        {Object.entries(groupedDL).map(([groupKey, items]) => (
          <div key={groupKey} className="flex flex-col gap-1.5">
            <p className="font-bold text-[11px] text-muted-foreground uppercase tracking-wide">
              {DL_GROUP_LABELS[groupKey] ?? groupKey}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((dl) => (
                <TagChip
                  key={dl.key}
                  acronym={dl.acronym}
                  name={dl.name}
                  selected={form.driving_licenses.includes(dl.acronym)}
                  onToggle={() => toggleArrayItem("driving_licenses", dl.acronym)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Langues demandées ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Langues demandées</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map((lang) => (
            <TagChip
              key={lang.code}
              acronym={lang.code}
              name={lang.name}
              selected={form.languages.includes(lang.code)}
              onToggle={() => toggleArrayItem("languages", lang.code)}
            />
          ))}
        </div>
      </div>

      {/* ── Remboursements & Avantages ────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionTitle>Remboursements & Avantages</SectionTitle>
        <ArrayInput
          placeholder="Ex: Frais de transport..."
          items={form.reimbursements}
          onAdd={(v) => addToList("reimbursements", v)}
          onRemove={(i) => removeFromList("reimbursements", i)}
        />
        <div className="flex flex-col gap-3 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Panier repas</p>
              <p className="text-muted-foreground text-xs">Panier repas fourni</p>
            </div>
            <Switch checked={form.packed_lunch} onCheckedChange={(v) => update("packed_lunch", v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Hébergement</p>
              <p className="text-muted-foreground text-xs">Hébergement fourni</p>
            </div>
            <Switch checked={form.accommodations} onCheckedChange={(v) => update("accommodations", v)} />
          </div>
        </div>
      </div>

      {/* ── Statut ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <Label className="font-medium text-sm">Statut de publication</Label>
        <Select value={form.status} onValueChange={(v) => update("status", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Publier maintenant</SelectItem>
            <SelectItem value="draft">Sauvegarder en brouillon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Annuler
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : isEdit ? "Sauvegarder" : "Publier l'offre"}
        </Button>
      </div>
    </form>
  );
}
