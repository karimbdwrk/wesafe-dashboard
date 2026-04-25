"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { Check, CheckCircle2, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {number}
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</p>
      </div>
      <div className="px-5 py-4 space-y-2.5">{children}</div>
    </div>
  );
}

function DataRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-4 py-1.5 border-b border-border/50 last:border-0">
      <span className="w-2/5 shrink-0 text-xs text-muted-foreground leading-snug">{label}</span>
      <span className="text-sm font-medium leading-snug">{value}</span>
    </div>
  );
}

function LegalText({ children }) {
  return <p className="text-sm text-muted-foreground leading-relaxed text-justify">{children}</p>;
}

function InfoBox({ children, variant }) {
  const base = "rounded-lg border px-4 py-3 text-sm leading-relaxed";
  if (variant === "danger") return <div className={`${base} bg-destructive/5 border-destructive/20`}>{children}</div>;
  return <div className={`${base} bg-muted/50`}>{children}</div>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractPage() {
  const { uuid } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    supabase
      .from("contracts")
      .select("*, companies(*), profiles(*)")
      .eq("id", uuid)
      .single()
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) {
          setNotFound(true);
          return;
        }
        setContract(data);
      });
  }, [uuid]);

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
        <p className="text-4xl">📄</p>
        <h1 className="text-xl font-semibold">Contrat introuvable</h1>
        <p className="text-sm text-muted-foreground">Ce contrat n&apos;existe pas ou a été supprimé.</p>
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
    <div className="min-h-dvh bg-muted/30 pb-10 px-4 pt-24">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* ── Document header ──────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden border shadow-sm">
          <div className="bg-[#1B3A6B] text-white p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <p className="text-xs text-white/60 uppercase tracking-widest font-medium">
                  {isCDD ? "CDD – Contrat à durée déterminée" : "CDI – Contrat à durée indéterminée"}
                </p>
                <h1 className="text-2xl font-bold tracking-tight">Contrat de travail</h1>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-block bg-white/15 border border-white/25 rounded-full px-3 py-0.5 text-xs">
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
              <FileText className="h-10 w-10 text-white/30 shrink-0" />
            </div>
          </div>
          {/* Quick facts */}
          <div className="bg-card p-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {contract.start_date && (
              <div>
                <p className="text-xs text-muted-foreground">Début</p>
                <p className="text-sm font-semibold">{fr(contract.start_date)}</p>
              </div>
            )}
            {isCDD && contract.end_date && (
              <div>
                <p className="text-xs text-muted-foreground">Fin</p>
                <p className="text-sm font-semibold">{fr(contract.end_date)}</p>
              </div>
            )}
            {contract.total_hours && (
              <div>
                <p className="text-xs text-muted-foreground">Heures / mois</p>
                <p className="text-sm font-semibold">{fmt2(monthlyHours)} h</p>
              </div>
            )}
            {contract.job_title && (
              <div>
                <p className="text-xs text-muted-foreground">Poste</p>
                <p className="text-sm font-semibold truncate">{contract.job_title}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Art 1 – Parties ──────────────────────────────────────────── */}
        <Section number={nn()} title="Parties au contrat">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1.5 mb-2">
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
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1.5 mb-2">
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
              <p className="text-xs text-muted-foreground font-medium mb-1">Description de la mission</p>
              {contract.job_description}
            </InfoBox>
          )}
          {isCDD && contract.contract_reason && (
            <InfoBox variant="danger">
              <p className="text-xs text-muted-foreground font-medium mb-1">
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
              renouvelable une fois par accord exprès des parties, dans la limite autorisée par la convention collective
              et l&apos;art. L.&nbsp;1221-19 du Code du travail.
            </p>
          </Section>
        )}

        {/* ── Art – Lieu de travail ────────────────────────────────────── */}
        <Section number={nn()} title="Lieu de travail">
          {contract.work_location_name && <p className="text-sm font-semibold">{contract.work_location_name}</p>}
          {wLocType === "multiple" && contract.work_location ? (
            <InfoBox>
              <ul className="list-disc list-inside space-y-0.5">
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
                    <th className="text-left px-4 py-2.5 font-medium w-1/3">Jour</th>
                    <th className="text-left px-4 py-2.5 font-medium w-1/3">Horaires</th>
                    <th className="text-left px-4 py-2.5 font-medium w-1/3">Amplitude</th>
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
                          className="px-4 py-2 text-xs font-semibold text-[#1B3A6B] uppercase tracking-wide"
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
              Le volume horaire mensuel de travail est fixé à {fmt2(monthlyHours)} heures par mois, réparties selon les
              horaires en vigueur dans l&apos;entreprise. Les horaires précis seront communiqués par l&apos;employeur.
              Toute heure effectuée au-delà de la durée légale de 35 h/semaine constitue une heure supplémentaire
              ouvrant droit à majoration ou compensation (art. L. 3121-28 C. trav.).
            </LegalText>
          )}
          {(contract.is_night || contract.is_sunday || contract.is_holiday) && (
            <InfoBox>
              <p className="text-xs font-medium mb-2">Majorations de salaire applicables</p>
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
            <div className="rounded-lg border-2 border-[#1B3A6B]/20 bg-[#1B3A6B]/5 px-4 py-4 mt-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1B3A6B] mb-3">
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
                <div className="flex justify-between pt-2 border-t font-bold text-[#1B3A6B]">
                  <span>Salaire brut mensuel</span>
                  <span>{fmt2(monthlySalary)} € brut</span>
                </div>
              </div>
            </div>
          )}
          <LegalText>
            La rémunération versée est au moins égale au SMIC en vigueur (art. L. 3231-2 C. trav.) ou au salaire minimum
            conventionnel si plus favorable. Le bulletin de paie est remis mensuellement (art. L. 3243-2 C. trav.).
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
            Le salarié bénéficie du régime collectif et obligatoire de frais de santé en vigueur dans l&apos;entreprise,
            conformément à la loi n° 2013-504 du 14 juin 2013. La cotisation patronale représente au minimum 50 % du
            montant de la cotisation totale. Un régime de prévoyance collective (incapacité, invalidité, décès) est
            également applicable selon les dispositions conventionnelles en vigueur.
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
            obligation de discrétion concernant toutes les informations confidentielles auxquelles il aurait accès dans
            le cadre de ses fonctions, pendant et après l&apos;exécution du contrat.
          </LegalText>
        </Section>

        {/* ── Art – Rupture (CDI only) ─────────────────────────────────── */}
        {!isCDD && (
          <Section number={nn()} title="Rupture du contrat de travail">
            <LegalText>
              Le présent contrat à durée indéterminée peut être rompu à l&apos;initiative de l&apos;une ou l&apos;autre
              des parties dans le respect des dispositions légales et conventionnelles : démission (art. L. 1237-1),
              licenciement (art. L. 1234-1), ou rupture conventionnelle homologuée (art. L. 1237-11 C. trav.). En cas de
              licenciement sans faute grave, le salarié ayant au moins 8 mois d&apos;ancienneté bénéficiera d&apos;une
              indemnité légale conformément à l&apos;art. L. 1234-9 C. trav.
            </LegalText>
          </Section>
        )}

        {/* ── Art – Équipements (conditional) ─────────────────────────── */}
        {contract.equipment_provided && (
          <Section number={nn()} title="Équipements fournis">
            <LegalText>
              L&apos;employeur met à la disposition du salarié les équipements de protection individuelle (EPI) et les
              équipements professionnels nécessaires à l&apos;exercice de ses fonctions, conformément aux art. L. 4121-1
              et suivants du Code du travail. Ces équipements demeurent la propriété de l&apos;employeur et devront être
              restitués en bon état à la fin du contrat.
            </LegalText>
            {contract.equipment_details && (
              <InfoBox>
                <p className="text-xs font-medium mb-1">Équipements fournis</p>
                {contract.equipment_details}
              </InfoBox>
            )}
          </Section>
        )}

        {/* ── Art – Clauses particulières (conditional) ────────────────── */}
        {contract.custom_clauses && (
          <Section number={nn()} title="Clauses particulières">
            <p className="text-sm leading-relaxed text-justify">{contract.custom_clauses}</p>
          </Section>
        )}

        {/* ── Art – Convention collective ──────────────────────────────── */}
        <Section number={nn()} title="Convention collective applicable">
          <LegalText>
            Le présent contrat est régi par la{" "}
            <strong>Convention collective nationale des entreprises de sécurité privée</strong> (IDCC 1351, Brochure JO
            n° 3196), applicable à l&apos;ensemble du personnel. En cas de dispositions plus favorables au salarié,
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
            Les données personnelles du salarié sont collectées et traitées par l&apos;employeur aux fins exclusives de
            la gestion de la relation contractuelle de travail, conformément au RGPD (UE) 2016/679 et à la loi n° 78-17
            du 6 janvier 1978. La durée de conservation est de 5 ans après la fin du contrat. Le salarié dispose
            d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de portabilité auprès de
            l&apos;employeur ou de la CNIL.
          </LegalText>
        </Section>

        {/* ── Signatures ───────────────────────────────────────────────── */}
        <div className="rounded-2xl border bg-card shadow-sm p-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
            <Check className="h-3.5 w-3.5" />
            Signatures des parties
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Fait en deux exemplaires originaux, à <strong>{dc?.city || "_______________"}</strong>, le{" "}
            <strong>{fr(contract.signed_at_candidate || contract.signed_at_company || contract.created_at)}</strong>.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* Employer */}
            <div className="rounded-xl border p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">L&apos;Employeur</p>
              <p className="text-sm font-semibold">{dc?.name || "—"}</p>
              {dc?.legal_representative && <p className="text-xs text-muted-foreground">{dc.legal_representative}</p>}
              <div className="min-h-[64px] rounded-lg border border-dashed flex items-center justify-center">
                {contract.isProSigned ? (
                  <div className="text-center space-y-1">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    <p className="text-xs text-green-600 font-medium">Signé le {fr(contract.signed_at_company)}</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Signature en attente</p>
                )}
              </div>
            </div>
            {/* Candidate */}
            <div className="rounded-xl border p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Le Salarié</p>
              <p className="text-sm font-semibold">{candidateName}</p>
              {dd?.birth_date && <p className="text-xs text-muted-foreground">Né(e) le {fr(dd.birth_date)}</p>}
              <div className="min-h-[64px] rounded-lg border border-dashed flex items-center justify-center">
                {contract.isSigned ? (
                  <div className="text-center space-y-1">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    <p className="text-xs text-green-600 font-medium">Signé le {fr(contract.signed_at_candidate)}</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Signature en attente</p>
                )}
              </div>
            </div>
          </div>
          {isCDD && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Art. L. 1242-13 C. trav. :</strong> Le contrat doit être transmis au salarié dans les 2 jours
              ouvrables suivant l&apos;embauche. L&apos;absence de signature dans ce délai peut entraîner la
              requalification en CDI.
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Document généré via WeSafe · Réf. {ref} · {fr(contract.created_at || new Date().toISOString())}
        </p>
      </div>
    </div>
  );
}
