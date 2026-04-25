"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { Check, CheckCircle2, Eye, EyeOff, FileText, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/supabaseClient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSiret(value) {
  if (!value) return value;
  const cleaned = value.toString().replace(/\s/g, "");
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,5})$/);
  if (match) return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  return value;
}

function fr(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR");
  } catch {
    return "—";
  }
}

function fmt2(n) {
  if (n == null) return "—";
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const DAY_FR = {
  Lundi: "Lundi",
  Mardi: "Mardi",
  Mercredi: "Mercredi",
  Jeudi: "Jeudi",
  Vendredi: "Vendredi",
  Samedi: "Samedi",
  Dimanche: "Dimanche",
};

// ─── Components ───────────────────────────────────────────────────────────────

function Section({ number, title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b bg-muted/50 px-5 py-3">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
          {number}
        </div>
        <p className="font-bold text-foreground text-xs uppercase tracking-widest">{title}</p>
      </div>
      <div className="space-y-2.5 px-5 py-4">{children}</div>
    </div>
  );
}

function DataRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-4 border-border/50 border-b py-1.5 last:border-0">
      <span className="w-2/5 shrink-0 text-muted-foreground text-xs leading-snug">{label}</span>
      <span className="font-medium text-sm leading-snug">{value}</span>
    </div>
  );
}

function LegalText({ children }) {
  return <p className="text-justify text-muted-foreground text-sm leading-relaxed">{children}</p>;
}

function InfoBox({ children, variant }) {
  const base = "rounded-lg border px-4 py-3 text-sm leading-relaxed";
  if (variant === "danger") return <div className={`${base} border-destructive/20 bg-destructive/5`}>{children}</div>;
  return <div className={`${base} bg-muted/50`}>{children}</div>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Helpers auth ─────────────────────────────────────────────────────────────

async function isSuperAdmin(uid) {
  const { data } = await supabase.from("admins").select("role").eq("id", uid).maybeSingle();
  return data?.role === "super_admin" || data?.role === "admin";
}

function isContractParty(uid, contractData) {
  return uid === contractData.company_id || uid === contractData.candidate_id;
}

// ─── Login dialog ─────────────────────────────────────────────────────────────

function LoginDialog({ open, contractData, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError || !authData.user) {
        setError("Identifiants invalides. Vérifiez votre email et mot de passe.");
        return;
      }
      const uid = authData.user.id;
      if (isContractParty(uid, contractData) || (await isSuperAdmin(uid))) {
        onSuccess();
      } else {
        await supabase.auth.signOut();
        setError("Ce contrat ne vous appartient pas. Connectez-vous avec le bon compte.");
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-center">Accès restreint</DialogTitle>
          <DialogDescription className="text-center">
            Ce contrat est confidentiel. Connectez-vous avec le compte entreprise ou candidat concerné.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <label className="font-medium text-sm" htmlFor="login-email">
              Adresse email
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-medium text-sm" htmlFor="login-password">
              Mot de passe
            </label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-destructive text-xs">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// authState: "loading" | "unauthenticated" | "unauthorized" | "authorized"

export default function ContractPage() {
  const { uuid } = useParams();
  const [contract, setContract] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [authState, setAuthState] = useState("loading");

  // biome-ignore lint/correctness/useExhaustiveDependencies: uuid is the only meaningful dependency here
  useEffect(() => {
    if (!uuid) return;

    (async () => {
      const [{ data: contractData, error: contractError }, { data: authData }] = await Promise.all([
        supabase.from("contracts").select("*, companies(*), profiles(*)").eq("id", uuid).single(),
        supabase.auth.getUser(),
      ]);

      if (contractError || !contractData) {
        setNotFound(true);
        setAuthState("authorized");
        return;
      }
      setContract(contractData);

      const user = authData?.user;
      if (!user) {
        setAuthState("unauthenticated");
        return;
      }

      const allowed = isContractParty(user.id, contractData) || (await isSuperAdmin(user.id));
      setAuthState(allowed ? "authorized" : "unauthorized");
    })();
  }, [uuid]);

  if (authState === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-4xl">📄</p>
        <h1 className="font-semibold text-xl">Contrat introuvable</h1>
        <p className="text-muted-foreground text-sm">Ce contrat n&apos;existe pas ou a été supprimé.</p>
      </div>
    );
  }

  if (authState === "unauthorized") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <Lock className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="font-semibold text-xl">Accès refusé</h1>
        <p className="max-w-xs text-muted-foreground text-sm">
          Vous n&apos;êtes pas autorisé à consulter ce contrat. Seuls l&apos;entreprise et le candidat concernés peuvent
          y accéder.
        </p>
      </div>
    );
  }

  // ── Derived data ─────────────────────────────────────────────────────────────

  const dc = contract.company_snapshot || contract.companies;
  const dd = contract.candidate_snapshot || contract.profiles;
  const sched = contract.schedule || {};
  const ws = sched.week_schedule || {};
  const vacs = sched.vacations || [];
  const schedKnown = sched.schedule_known || false;
  const isCDD = contract.contract_type === "CDD";
  const wLocType = contract.work_location_type || "single";

  const monthlyHours = contract.total_hours ? parseFloat(contract.total_hours) : 151.67;
  const hourlyRate = contract.hourly_rate ? parseFloat(contract.hourly_rate) : null;
  const monthlySalary = hourlyRate != null ? Math.round(monthlyHours * hourlyRate * 100) / 100 : null;
  const ref = (contract.apply_id || contract.id || "").substring(0, 8).toUpperCase() || "—";
  const candidateName = `${dd?.firstname || ""} ${dd?.lastname || ""}`.trim() || "—";

  const enabledDays = Object.entries(ws).filter(([, v]) => v?.enabled);

  const sigStatus =
    contract.isSigned && contract.isProSigned
      ? "Signé par les deux parties"
      : contract.isSigned
        ? "Signé par le candidat"
        : contract.isProSigned
          ? "Signé par l'entreprise"
          : "En attente de signature";

  // Dynamic article counter — incremented only when a section is rendered
  let n = 0;
  const nn = () => ++n;

  return (
    <>
      <LoginDialog
        open={authState === "unauthenticated"}
        contractData={contract}
        onSuccess={() => setAuthState("authorized")}
      />
      <div
        className={`min-h-dvh bg-muted/30 px-4 pt-24 pb-10 transition-[filter] duration-300 ${authState === "unauthenticated" ? "pointer-events-none select-none blur-sm" : ""}`}
      >
        <div className="mx-auto max-w-2xl space-y-5">
          {/* ── Document header ──────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border shadow-sm">
            <div className="bg-[#1B3A6B] p-6 text-white">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="font-medium text-white/60 text-xs uppercase tracking-widest">
                    {isCDD ? "CDD – Contrat à durée déterminée" : "CDI – Contrat à durée indéterminée"}
                  </p>
                  <h1 className="font-bold text-2xl tracking-tight">Contrat de travail</h1>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-block rounded-full border border-white/25 bg-white/15 px-3 py-0.5 text-xs">
                      Réf. {ref}
                    </span>
                    <Badge
                      variant={contract.isSigned && contract.isProSigned ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {sigStatus}
                    </Badge>
                  </div>
                </div>
                <FileText className="h-10 w-10 shrink-0 text-white/30" />
              </div>
            </div>
            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-3 bg-card p-4 sm:grid-cols-4">
              {contract.start_date && (
                <div>
                  <p className="text-muted-foreground text-xs">Début</p>
                  <p className="font-semibold text-sm">{fr(contract.start_date)}</p>
                </div>
              )}
              {isCDD && contract.end_date && (
                <div>
                  <p className="text-muted-foreground text-xs">Fin</p>
                  <p className="font-semibold text-sm">{fr(contract.end_date)}</p>
                </div>
              )}
              {contract.total_hours && (
                <div>
                  <p className="text-muted-foreground text-xs">Heures / mois</p>
                  <p className="font-semibold text-sm">{fmt2(monthlyHours)} h</p>
                </div>
              )}
              {contract.job_title && (
                <div>
                  <p className="text-muted-foreground text-xs">Poste</p>
                  <p className="truncate font-semibold text-sm">{contract.job_title}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Art 1 – Parties ──────────────────────────────────────────── */}
          <Section number={nn()} title="Parties au contrat">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="mb-2 border-b pb-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  L&apos;Employeur
                </p>
                <DataRow label="Raison sociale" value={dc?.name} />
                <DataRow label="SIRET" value={dc?.siret ? formatSiret(dc.siret) : null} />
                <DataRow
                  label="Adresse"
                  value={
                    dc?.street || dc?.postcode || dc?.city
                      ? [dc.street, dc.postcode, dc.city].filter(Boolean).join(", ")
                      : dc?.address || null
                  }
                />
                <DataRow label="Représentant légal" value={dc?.legal_representative} />
                <DataRow label="Qualité" value={dc?.legal_representative_role} />
                <DataRow label="Code NAF" value={dc?.naf_code} />
              </div>
              <div className="space-y-1">
                <p className="mb-2 border-b pb-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Le Salarié
                </p>
                <DataRow label="Nom et prénom" value={candidateName} />
                <DataRow label="Date de naissance" value={dd?.birth_date ? fr(dd.birth_date) : null} />
                <DataRow label="Lieu de naissance" value={dd?.birth_place} />
                <DataRow label="Nationalité" value={dd?.nationality} />
                <DataRow label="N° Sécurité sociale" value={dd?.social_security_number} />
                <DataRow label="Adresse" value={dd?.address} />
              </div>
            </div>
          </Section>

          {/* ── Art 2 – Engagement ───────────────────────────────────────── */}
          <Section number={nn()} title="Engagement et nature du poste">
            <DataRow
              label="Type de contrat"
              value={isCDD ? "Contrat à Durée Déterminée (CDD)" : "Contrat à Durée Indéterminée (CDI)"}
            />
            <DataRow label="Intitulé du poste" value={contract.job_title} />
            <DataRow label="Classification" value={contract.category} />
            {contract.job_description && (
              <InfoBox>
                <p className="mb-1 font-medium text-muted-foreground text-xs">Description de la mission</p>
                {contract.job_description}
              </InfoBox>
            )}
            {isCDD && contract.contract_reason && (
              <InfoBox variant="danger">
                <p className="mb-1 font-medium text-muted-foreground text-xs">
                  Motif de recours au CDD (art. L. 1242-2 C. trav.)
                </p>
                {contract.contract_reason}
              </InfoBox>
            )}
          </Section>

          {/* ── Art 3 – Durée ────────────────────────────────────────────── */}
          <Section number={nn()} title="Durée et date de prise de poste">
            <DataRow label="Date de début" value={fr(contract.start_date)} />
            {isCDD && (
              <DataRow label="Date de fin" value={contract.end_date ? fr(contract.end_date) : "Sans terme précis"} />
            )}
            <DataRow label="Volume horaire mensuel" value={`${fmt2(monthlyHours)} h / mois`} />
            <LegalText>
              {isCDD
                ? "À l'issue du présent contrat, le salarié percevra une indemnité de fin de contrat égale à 10 % de la rémunération totale brute (art. L. 1243-8 C. trav.), sauf renouvellement ou embauche en CDI."
                : "Le présent contrat est conclu pour une durée indéterminée. Il pourra être rompu dans les conditions prévues par le Code du travail (démission, licenciement, rupture conventionnelle)."}
            </LegalText>
          </Section>

          {/* ── Art 4 – Période d'essai (conditional) ───────────────────── */}
          {contract.trial_period && (
            <Section number={nn()} title="Période d'essai">
              <p className="text-sm leading-relaxed">
                Le présent contrat est soumis à une <strong>période d&apos;essai de {contract.trial_period}</strong>,
                renouvelable une fois par accord exprès des parties, dans la limite autorisée par la convention
                collective et l&apos;art. L.&nbsp;1221-19 du Code du travail.
              </p>
            </Section>
          )}

          {/* ── Art – Lieu de travail ────────────────────────────────────── */}
          <Section number={nn()} title="Lieu de travail">
            {contract.work_location_name && <p className="font-semibold text-sm">{contract.work_location_name}</p>}
            {wLocType === "multiple" && contract.work_location ? (
              <InfoBox>
                <ul className="list-inside list-disc space-y-0.5">
                  {(() => {
                    try {
                      const locs = JSON.parse(contract.work_location);
                      return (Array.isArray(locs) ? locs : []).map((l) => <li key={l}>{l}</li>);
                    } catch {
                      return <li>{contract.work_location}</li>;
                    }
                  })()}
                </ul>
              </InfoBox>
            ) : (
              <InfoBox>{contract.work_location || "—"}</InfoBox>
            )}
            <LegalText>
              {wLocType === "multiple"
                ? "Le salarié est amené à intervenir sur les différents sites listés ci-dessus. Ce déplacement entre sites ne constitue pas une modification du contrat de travail."
                : wLocType === "zone"
                  ? "Le salarié est susceptible d'exercer ses fonctions dans l'ensemble de la zone géographique définie ci-dessus."
                  : "Le lieu de travail habituel est défini ci-dessus. Toute modification substantielle de ce lieu constituerait une modification du contrat de travail nécessitant l'accord du salarié."}
            </LegalText>
          </Section>

          {/* ── Art – Horaires ───────────────────────────────────────────── */}
          <Section number={nn()} title="Durée du travail et horaires">
            {schedKnown && (enabledDays.length > 0 || vacs.length > 0) ? (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-[#1B3A6B] text-white text-xs">
                    <tr>
                      <th className="w-1/3 px-4 py-2.5 text-left font-medium">Jour</th>
                      <th className="w-1/3 px-4 py-2.5 text-left font-medium">Horaires</th>
                      <th className="w-1/3 px-4 py-2.5 text-left font-medium">Amplitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enabledDays.map(([day, h], i) => {
                      const start = h.start || "—";
                      const end = h.end || "—";
                      let amplitude = "—";
                      try {
                        const [sh, sm] = start.split(":").map(Number);
                        const [eh, em] = end.split(":").map(Number);
                        const diff = eh * 60 + em - (sh * 60 + sm);
                        if (!Number.isNaN(diff) && diff > 0) {
                          amplitude = `${Math.floor(diff / 60)}h${diff % 60 > 0 ? String(diff % 60).padStart(2, "0") : ""}`;
                        }
                      } catch {
                        // ignore
                      }
                      return (
                        <tr key={day} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                          <td className="px-4 py-2">{DAY_FR[day] || day}</td>
                          <td className="px-4 py-2">
                            {start} – {end}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{amplitude}</td>
                        </tr>
                      );
                    })}
                    {vacs.length > 0 && (
                      <>
                        <tr className="bg-muted/60">
                          <td
                            colSpan={3}
                            className="px-4 py-2 font-semibold text-[#1B3A6B] text-xs uppercase tracking-wide"
                          >
                            Vacations ponctuelles
                          </td>
                        </tr>
                        {vacs.map((v, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: vacation list has no stable id
                          <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                            <td className="px-4 py-2">{fr(v.date)}</td>
                            <td className="px-4 py-2">
                              {v.start_time} – {v.end_time}
                            </td>
                            <td className="px-4 py-2 text-muted-foreground">—</td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <LegalText>
                Le volume horaire mensuel de travail est fixé à {fmt2(monthlyHours)} heures par mois, réparties selon
                les horaires en vigueur dans l&apos;entreprise. Les horaires précis seront communiqués par
                l&apos;employeur. Toute heure effectuée au-delà de la durée légale de 35 h/semaine constitue une heure
                supplémentaire ouvrant droit à majoration ou compensation (art. L. 3121-28 C. trav.).
              </LegalText>
            )}
            {(contract.is_night || contract.is_sunday || contract.is_holiday) && (
              <InfoBox>
                <p className="mb-2 font-medium text-xs">Majorations de salaire applicables</p>
                {contract.is_night && contract.night_bonus != null && (
                  <p>· Travail de nuit : +{contract.night_bonus} €/h</p>
                )}
                {contract.is_sunday && contract.sunday_bonus != null && (
                  <p>· Travail du dimanche : +{contract.sunday_bonus} €/h</p>
                )}
                {contract.is_holiday && contract.holiday_bonus != null && (
                  <p>· Jours fériés : +{contract.holiday_bonus} €/h</p>
                )}
              </InfoBox>
            )}
          </Section>

          {/* ── Art – Rémunération ───────────────────────────────────────── */}
          <Section number={nn()} title="Rémunération">
            <DataRow label="Taux horaire brut" value={contract.hourly_rate ? `${contract.hourly_rate} €/h` : null} />
            <DataRow
              label="Heures supplémentaires"
              value={contract.overtime_rate ? `${contract.overtime_rate} €/h` : null}
            />
            <DataRow label="Prime de repas" value={contract.meal_bonus ? `${contract.meal_bonus} €` : null} />
            <DataRow
              label="Prime de transport"
              value={contract.transport_bonus ? `${contract.transport_bonus} €` : null}
            />
            {monthlySalary != null && (
              <div className="mt-1 rounded-lg border-2 border-[#1B3A6B]/20 bg-[#1B3A6B]/5 px-4 py-4">
                <p className="mb-3 font-bold text-[#1B3A6B] text-xs uppercase tracking-widest">
                  Salaire brut mensuel de base
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taux horaire</span>
                    <span className="font-medium">{fmt2(hourlyRate)} €/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heures mensuelles</span>
                    <span className="font-medium">{fmt2(monthlyHours)} h</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-[#1B3A6B]">
                    <span>Salaire brut mensuel</span>
                    <span>{fmt2(monthlySalary)} € brut</span>
                  </div>
                </div>
              </div>
            )}
            <LegalText>
              La rémunération versée est au moins égale au SMIC en vigueur (art. L. 3231-2 C. trav.) ou au salaire
              minimum conventionnel si plus favorable. Le bulletin de paie est remis mensuellement (art. L. 3243-2 C.
              trav.).
            </LegalText>
          </Section>

          {/* ── Art – Congés payés ───────────────────────────────────────── */}
          <Section number={nn()} title="Congés payés">
            <LegalText>
              Le salarié bénéficie de 2,5 jours ouvrables de congés payés par mois de travail effectif, soit 30 jours
              ouvrables par année complète (art. L. 3141-3 C. trav.).{" "}
              {isCDD
                ? "À l'issue du contrat, une indemnité compensatrice de congés payés égale à 10 % de la rémunération totale brute sera versée (art. L. 3141-26 C. trav.), sauf si le salarié a pu prendre ses congés."
                : "Les dates de congés sont fixées par l'employeur après consultation du salarié, en respectant un délai de prévenance d'un mois."}
            </LegalText>
          </Section>

          {/* ── Art – Mutuelle ───────────────────────────────────────────── */}
          <Section number={nn()} title="Mutuelle et prévoyance collective">
            <LegalText>
              Le salarié bénéficie du régime collectif et obligatoire de frais de santé en vigueur dans
              l&apos;entreprise, conformément à la loi n° 2013-504 du 14 juin 2013. La cotisation patronale représente
              au minimum 50 % du montant de la cotisation totale. Un régime de prévoyance collective (incapacité,
              invalidité, décès) est également applicable selon les dispositions conventionnelles en vigueur.
            </LegalText>
          </Section>

          {/* ── Art – Maladie ────────────────────────────────────────────── */}
          <Section number={nn()} title="Maladie, accident du travail et maintien de salaire">
            <LegalText>
              En cas d&apos;absence pour maladie ou accident dûment justifié par un certificat médical transmis dans les
              48 heures, le salarié bénéficiera du maintien de tout ou partie de sa rémunération dans les conditions
              prévues par la convention collective et les art. L. 1226-1 et suivants du Code du travail, sous réserve
              d&apos;ouverture des droits aux indemnités journalières de la Sécurité sociale.
            </LegalText>
          </Section>

          {/* ── Art – Formation ──────────────────────────────────────────── */}
          <Section number={nn()} title="Formation professionnelle et compte personnel de formation">
            <LegalText>
              Le salarié bénéficie du droit à la formation professionnelle continue conformément aux art. L. 6311-1 et
              suivants du Code du travail. Il dispose d&apos;un Compte Personnel de Formation (CPF) alimenté à raison de
              500 € par an (plafonné à 5 000 €) ou 800 € pour les salariés peu qualifiés (plafonné à 8 000 €).
            </LegalText>
          </Section>

          {/* ── Art – Obligations ────────────────────────────────────────── */}
          <Section number={nn()} title="Obligations du salarié – Loyauté et discrétion">
            <LegalText>
              Le salarié s&apos;engage à observer une obligation de loyauté envers l&apos;employeur, à exécuter de bonne
              foi les tâches confiées et à respecter les règles internes de l&apos;entreprise. Il est tenu à une
              obligation de discrétion concernant toutes les informations confidentielles auxquelles il aurait accès
              dans le cadre de ses fonctions, pendant et après l&apos;exécution du contrat.
            </LegalText>
          </Section>

          {/* ── Art – Rupture (CDI only) ─────────────────────────────────── */}
          {!isCDD && (
            <Section number={nn()} title="Rupture du contrat de travail">
              <LegalText>
                Le présent contrat à durée indéterminée peut être rompu à l&apos;initiative de l&apos;une ou
                l&apos;autre des parties dans le respect des dispositions légales et conventionnelles : démission (art.
                L. 1237-1), licenciement (art. L. 1234-1), ou rupture conventionnelle homologuée (art. L. 1237-11 C.
                trav.). En cas de licenciement sans faute grave, le salarié ayant au moins 8 mois d&apos;ancienneté
                bénéficiera d&apos;une indemnité légale conformément à l&apos;art. L. 1234-9 C. trav.
              </LegalText>
            </Section>
          )}

          {/* ── Art – Équipements (conditional) ─────────────────────────── */}
          {contract.equipment_provided && (
            <Section number={nn()} title="Équipements fournis">
              <LegalText>
                L&apos;employeur met à la disposition du salarié les équipements de protection individuelle (EPI) et les
                équipements professionnels nécessaires à l&apos;exercice de ses fonctions, conformément aux art. L.
                4121-1 et suivants du Code du travail. Ces équipements demeurent la propriété de l&apos;employeur et
                devront être restitués en bon état à la fin du contrat.
              </LegalText>
              {contract.equipment_details && (
                <InfoBox>
                  <p className="mb-1 font-medium text-xs">Équipements fournis</p>
                  {contract.equipment_details}
                </InfoBox>
              )}
            </Section>
          )}

          {/* ── Art – Clauses particulières (conditional) ────────────────── */}
          {contract.custom_clauses && (
            <Section number={nn()} title="Clauses particulières">
              <p className="text-justify text-sm leading-relaxed">{contract.custom_clauses}</p>
            </Section>
          )}

          {/* ── Art – Convention collective ──────────────────────────────── */}
          <Section number={nn()} title="Convention collective applicable">
            <LegalText>
              Le présent contrat est régi par la{" "}
              <strong>Convention collective nationale des entreprises de sécurité privée</strong> (IDCC 1351, Brochure
              JO n° 3196), applicable à l&apos;ensemble du personnel. En cas de dispositions plus favorables au salarié,
              celles-ci priment sur les dispositions légales. Le texte intégral est consultable sur{" "}
              <em>legifrance.gouv.fr</em>.
            </LegalText>
          </Section>

          {/* ── Art – Règlement intérieur ────────────────────────────────── */}
          <Section number={nn()} title="Règlement intérieur et règles applicables">
            <LegalText>
              Le salarié déclare avoir pris connaissance du règlement intérieur de l&apos;entreprise, disponible à
              l&apos;accueil et affiché dans les locaux, et s&apos;engage à le respecter ainsi que les consignes de
              sécurité et les directives de l&apos;employeur.
            </LegalText>
          </Section>

          {/* ── Art – RGPD ───────────────────────────────────────────────── */}
          <Section number={nn()} title="Protection des données personnelles (RGPD)">
            <LegalText>
              Les données personnelles du salarié sont collectées et traitées par l&apos;employeur aux fins exclusives
              de la gestion de la relation contractuelle de travail, conformément au RGPD (UE) 2016/679 et à la loi n°
              78-17 du 6 janvier 1978. La durée de conservation est de 5 ans après la fin du contrat. Le salarié dispose
              d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de portabilité auprès de
              l&apos;employeur ou de la CNIL.
            </LegalText>
          </Section>

          {/* ── Signatures ───────────────────────────────────────────────── */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="mb-5 flex items-center gap-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              <Check className="h-3.5 w-3.5" />
              Signatures des parties
            </p>
            <p className="mb-4 text-muted-foreground text-xs">
              Fait en deux exemplaires originaux, à <strong>{dc?.city || "_______________"}</strong>, le{" "}
              <strong>{fr(contract.signed_at_candidate || contract.signed_at_company || contract.created_at)}</strong>.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Employer */}
              <div className="space-y-3 rounded-xl border p-4">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">L&apos;Employeur</p>
                <p className="font-semibold text-sm">{dc?.name || "—"}</p>
                {dc?.legal_representative && <p className="text-muted-foreground text-xs">{dc.legal_representative}</p>}
                <div className="flex min-h-[64px] items-center justify-center rounded-lg border border-dashed">
                  {contract.isProSigned ? (
                    <div className="space-y-1 text-center">
                      <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
                      <p className="font-medium text-green-600 text-xs">Signé le {fr(contract.signed_at_company)}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">Signature en attente</p>
                  )}
                </div>
              </div>
              {/* Candidate */}
              <div className="space-y-3 rounded-xl border p-4">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Le Salarié</p>
                <p className="font-semibold text-sm">{candidateName}</p>
                {dd?.birth_date && <p className="text-muted-foreground text-xs">Né(e) le {fr(dd.birth_date)}</p>}
                <div className="flex min-h-[64px] items-center justify-center rounded-lg border border-dashed">
                  {contract.isSigned ? (
                    <div className="space-y-1 text-center">
                      <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
                      <p className="font-medium text-green-600 text-xs">Signé le {fr(contract.signed_at_candidate)}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">Signature en attente</p>
                  )}
                </div>
              </div>
            </div>
            {isCDD && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-xs leading-relaxed dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                <strong>Art. L. 1242-13 C. trav. :</strong> Le contrat doit être transmis au salarié dans les 2 jours
                ouvrables suivant l&apos;embauche. L&apos;absence de signature dans ce délai peut entraîner la
                requalification en CDI.
              </div>
            )}
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <p className="pb-4 text-center text-muted-foreground text-xs">
            Document généré via WeSafe · Réf. {ref} · {fr(contract.created_at || new Date().toISOString())}
          </p>
        </div>
      </div>
    </>
  );
}
