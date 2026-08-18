"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import { CheckCircle2, Eye, EyeOff, FileText, Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { logActivity } from "@/lib/supabase/activity";
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

function fmtH(n) {
  if (n == null) return "—";
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function calcAmplitude(start, end) {
  try {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const diff = eh * 60 + em - (sh * 60 + sm);
    if (!Number.isNaN(diff) && diff > 0)
      return `${Math.floor(diff / 60)}h${diff % 60 > 0 ? String(diff % 60).padStart(2, "0") : ""}`;
  } catch {
    /* invalid time format — fall through */
  }
  return "—";
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
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B3A6B] font-bold text-white text-xs">
          {number}
        </div>
        <p className="font-bold text-foreground text-xs uppercase tracking-widest">{title}</p>
      </div>
      <div className="space-y-3 px-5 py-4">{children}</div>
    </div>
  );
}

function DataRow({ label, value }) {
  if (value == null || value === "") return null;
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
  if (variant === "danger")
    return <div className={`${base} border-destructive/20 bg-destructive/5 text-destructive/80`}>{children}</div>;
  if (variant === "warning")
    return (
      <div
        className={`${base} border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300`}
      >
        {children}
      </div>
    );
  return <div className={`${base} border-border bg-muted/50`}>{children}</div>;
}

function PartyCard({ role, name, rows, accent }) {
  return (
    <div
      className={`rounded-xl border bg-card p-4 ${accent ? "border-t-[3px] border-t-[#1B3A6B]" : "border-t-[3px] border-t-amber-500"}`}
    >
      <p className="mb-3 font-semibold text-muted-foreground text-[10px] uppercase tracking-widest">{role}</p>
      <p className="mb-3 font-bold text-base">{name}</p>
      <div className="space-y-0">{rows}</div>
    </div>
  );
}

function SigBlock({ role, name, sub, signed, signedAt, sigUrl, stampUrl, mention }) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <p className="font-semibold text-muted-foreground text-[10px] uppercase tracking-widest">{role}</p>
      <p className="font-bold text-sm">{name}</p>
      {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
      <div className="relative flex min-h-[72px] items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/20">
        {stampUrl && (
          <Image
            src={stampUrl}
            alt="Tampon"
            width={64}
            height={64}
            className="absolute inset-0 m-auto h-16 w-16 object-contain opacity-20 pointer-events-none"
          />
        )}
        {sigUrl ? (
          <Image
            src={sigUrl}
            alt="Signature"
            width={160}
            height={56}
            className="relative z-10 max-h-14 max-w-40 object-contain"
          />
        ) : signed ? (
          <div className="space-y-1 text-center">
            <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
            <p className="font-medium text-green-600 text-xs">Signé numériquement</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-xs italic">Signature à apposer</p>
        )}
      </div>
      {signed && signedAt && <p className="text-green-600 text-xs">✓ Signé le {fr(signedAt)}</p>}
      {!signed && <p className="text-muted-foreground text-xs italic">Date et lieu : ________________________</p>}
      {mention && <p className="text-muted-foreground text-[10px] italic">{mention}</p>}
    </div>
  );
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

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
        logActivity(uid, "login", { context: "contract_view" });
        logActivity(uid, "contract_view", { contractId: contractData.id });
        onSuccess(authData.user);
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
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B3A6B]/10">
            <Lock className="h-5 w-5 text-[#1B3A6B]" />
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
          <Button type="submit" className="w-full bg-[#1B3A6B] hover:bg-[#1B3A6B]/90" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Signature (pro) dialog ────────────────────────────────────────────────────

function SignContractDialog({ open, onOpenChange, contract, dc, legalRepName, candidateName, currentUser, onSigned }) {
  const [step, setStep] = useState("confirm"); // "confirm" | "otp"
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStep("confirm");
    setOtp("");
    setError("");
  }

  async function handleSendOtp() {
    setError("");
    setSubmitting(true);
    try {
      const { error: fnError } = await supabase.functions.invoke("send-contract-otp", {
        body: {
          candidate_email: currentUser.email,
          candidate_name: legalRepName && legalRepName !== "—" ? legalRepName : (dc?.name ?? "vous"),
          company_name: dc?.name ?? "votre entreprise",
          contract_id: contract.id,
          role: "pro",
          job_title: contract.job_title ?? "",
          candidate_display_name: candidateName,
        },
      });
      if (fnError) throw fnError;
      setStep("otp");
    } catch {
      setError("Impossible d'envoyer le code. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setError("");
    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-contract-otp", {
        body: { contract_id: contract.id, otp },
      });
      if (fnError) throw fnError;
      if (!data?.success) {
        setError(data?.error ?? "Code invalide.");
        return;
      }
      const signedAt = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("contracts")
        .update({ isProSigned: true, signed_at_company: signedAt })
        .eq("id", contract.id);
      if (updateError) throw updateError;
      logActivity(currentUser.id, "contract_sign", { contractId: contract.id, role: "pro" });
      onSigned(signedAt);
      onOpenChange(false);
      reset();
    } catch {
      setError("Erreur lors de la vérification. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (submitting) return;
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B3A6B]/10">
                <ShieldCheck className="h-5 w-5 text-[#1B3A6B]" />
              </div>
              <DialogTitle className="text-center">Signer ce contrat</DialogTitle>
              <DialogDescription className="text-center">
                Un code de vérification à 6 chiffres va être envoyé à <strong>{currentUser?.email}</strong> pour
                confirmer la signature électronique et le tampon de {dc?.name ?? "votre entreprise"}.
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <Button onClick={handleSendOtp} className="w-full bg-[#1B3A6B] hover:bg-[#1B3A6B]/90" disabled={submitting}>
              {submitting ? "Envoi…" : "Recevoir le code"}
            </Button>
          </>
        )}
        {step === "otp" && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B3A6B]/10">
                <ShieldCheck className="h-5 w-5 text-[#1B3A6B]" />
              </div>
              <DialogTitle className="text-center">Code de signature</DialogTitle>
              <DialogDescription className="text-center">
                Entrez le code à 6 chiffres envoyé à {currentUser?.email}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyOtp} className="space-y-3 pt-1">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center font-mono text-xl tracking-[0.5em]"
                autoFocus
                required
              />
              {error && <p className="text-destructive text-xs">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-[#1B3A6B] hover:bg-[#1B3A6B]/90"
                disabled={submitting || otp.length !== 6}
              >
                {submitting ? "Vérification…" : "Confirmer la signature"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractPage() {
  const { uuid } = useParams();
  const [contract, setContract] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [authState, setAuthState] = useState("loading");
  const [currentUser, setCurrentUser] = useState(null);
  const [signDialogOpen, setSignDialogOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — only re-run when uuid changes
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
      if (allowed) {
        logActivity(user.id, "contract_view", { contractId: contractData.id });
        setCurrentUser({ id: user.id, email: user.email });
      }
      setAuthState(allowed ? "authorized" : "unauthorized");
    })();
  }, [uuid]);

  if (authState === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1B3A6B] border-t-transparent" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/30" />
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
  const isVacations = isCDD && vacs.length > 0;
  const wLocType = contract.work_location_type || "single";

  // Identité des parties
  const legalRepName =
    [dc?.legal_representative_firstname, dc?.legal_representative_lastname].filter(Boolean).join(" ") ||
    dc?.legal_representative ||
    "—";
  const legalRepRole = dc?.legal_representative_role || "Dirigeant";
  const compAddr =
    [dc?.street, [dc?.postcode, dc?.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || dc?.address || "—";
  const candAddr =
    [dd?.street, [dd?.postcode, dd?.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || dd?.address || "—";
  const candidateName = `${dd?.firstname || ""} ${dd?.lastname || ""}`.trim() || "—";
  const candidateBirthday = dd?.birthday || dd?.birth_date;

  // Rémunération
  const monthlyHours = contract.total_hours ? parseFloat(contract.total_hours) : 151.67;
  const hourlyRate = contract.hourly_rate ? parseFloat(contract.hourly_rate) : null;
  const monthlySalary = hourlyRate != null ? Math.round(monthlyHours * hourlyRate * 100) / 100 : null;

  // Vacations totals
  const vacTotals = (() => {
    let totalMin = 0;
    for (const v of vacs) {
      try {
        const [sh, sm] = v.start_time.split(":").map(Number);
        const [eh, em] = v.end_time.split(":").map(Number);
        const diff = eh * 60 + em - (sh * 60 + sm);
        if (!Number.isNaN(diff) && diff > 0) totalMin += diff;
      } catch {
        /* invalid time format — skip vacation */
      }
    }
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return { label: `${h}h${m > 0 ? String(m).padStart(2, "0") : ""}`, hours: h + m / 60 };
  })();

  // Contrat
  const collective = contract.collective_agreement || "CCN Sécurité privée — IDCC 1351";
  const ref = (contract.apply_id || contract.id || "").substring(0, 8).toUpperCase() || "—";

  // Signature status
  const sigStatus =
    contract.isSigned && contract.isProSigned
      ? "Signé par les deux parties"
      : contract.isSigned
        ? "Signé par le candidat"
        : contract.isProSigned
          ? "Signé par l'entreprise"
          : "En attente de signature";

  // Signature images — live records (not snapshot)
  const companySigUrl = contract.companies?.signature_url || dc?.signature_url;
  const companyStampUrl = contract.companies?.stamp_url || dc?.stamp_url;
  const candidateSigUrl = contract.profiles?.signature_url || dd?.signature_url;

  // Horaires
  const enabledDays = Object.entries(ws).filter(([, v]) => v?.enabled);

  // Majorations
  const hasBonuses = contract.is_night || contract.is_sunday || contract.is_holiday;

  // Article counter
  let n = 0;
  const nn = () => ++n;

  // Contract subtitle
  const contractSubtitle = isVacations
    ? "CDD Vacations – Contrat à durée déterminée"
    : isCDD
      ? "CDD – Contrat à durée déterminée"
      : "CDI – Contrat à durée indéterminée";

  return (
    <>
      <LoginDialog
        open={authState === "unauthenticated"}
        contractData={contract}
        onSuccess={(user) => {
          setCurrentUser({ id: user.id, email: user.email });
          setAuthState("authorized");
        }}
      />
      <SignContractDialog
        open={signDialogOpen}
        onOpenChange={setSignDialogOpen}
        contract={contract}
        dc={dc}
        legalRepName={legalRepName}
        candidateName={candidateName}
        currentUser={currentUser}
        onSigned={(signedAt) => setContract((c) => ({ ...c, isProSigned: true, signed_at_company: signedAt }))}
      />
      <div
        className={`min-h-dvh bg-muted/30 px-4 pt-20 pb-10 transition-[filter] duration-300 ${authState === "unauthenticated" ? "pointer-events-none select-none blur-sm" : ""}`}
      >
        <div className="mx-auto max-w-2xl space-y-5">
          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border shadow-sm">
            <div className="bg-[#1B3A6B] p-6 text-white">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="font-semibold text-white/60 text-[10px] uppercase tracking-widest">
                    {contractSubtitle}
                  </p>
                  <h1 className="font-bold text-2xl tracking-tight">Contrat de travail</h1>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-block rounded-full border border-white/25 bg-white/15 px-3 py-0.5 font-medium text-xs">
                      Réf. {ref}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 font-medium text-xs ${contract.isSigned && contract.isProSigned ? "bg-green-500/20 text-green-200" : "bg-white/10 text-white/70"}`}
                    >
                      {contract.isSigned && contract.isProSigned && <CheckCircle2 className="h-3 w-3" />}
                      {sigStatus}
                    </span>
                  </div>
                </div>
                <FileText className="h-10 w-10 shrink-0 text-white/25" />
              </div>
            </div>
            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              {[
                contract.start_date && { label: "Début", value: fr(contract.start_date) },
                isCDD && contract.end_date && { label: "Fin", value: fr(contract.end_date) },
                contract.total_hours && { label: "Heures / mois", value: `${fmtH(monthlyHours)} h` },
                contract.job_title && { label: "Poste", value: contract.job_title },
              ]
                .filter(Boolean)
                .map(({ label, value }) => (
                  <div key={label} className="bg-card px-4 py-3">
                    <p className="text-muted-foreground text-[10px]">{label}</p>
                    <p className="mt-0.5 truncate font-semibold text-sm">{value}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* ── Art – Parties ────────────────────────────────────────────── */}
          <Section number={nn()} title="Parties au contrat">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PartyCard
                name={dc?.name || "—"}
                accent
                rows={
                  <>
                    <DataRow label="Forme juridique" value={dc?.legal_form} />
                    <DataRow label="SIRET" value={dc?.siret ? formatSiret(dc.siret) : null} />
                    <DataRow label="Code NAF / APE" value={dc?.naf_code} />
                    <DataRow label="Siège social" value={compAddr} />
                    <DataRow label="Représentant légal" value={legalRepName} />
                    <DataRow label="Qualité" value={legalRepRole} />
                  </>
                }
              />
              <PartyCard
                name={candidateName}
                rows={
                  <>
                    <DataRow label="Date de naissance" value={candidateBirthday ? fr(candidateBirthday) : null} />
                    <DataRow label="Lieu de naissance" value={dd?.birth_place} />
                    <DataRow label="Nationalité" value={dd?.nationality} />
                    <DataRow label="N° Sécurité sociale" value={dd?.social_security_number} />
                    <DataRow label="Adresse" value={candAddr} />
                  </>
                }
              />
            </div>
          </Section>

          {/* ── Art – Engagement ─────────────────────────────────────────── */}
          <Section number={nn()} title="Engagement et nature du contrat">
            <DataRow
              label="Type de contrat"
              value={
                isVacations
                  ? "CDD Vacations"
                  : isCDD
                    ? "Contrat à Durée Déterminée (CDD)"
                    : "Contrat à Durée Indéterminée (CDI)"
              }
            />
            <DataRow label="Intitulé du poste" value={contract.job_title} />
            <DataRow label="Classification" value={contract.category} />
            <DataRow label="Convention collective" value={collective} />
            <DataRow label="Code IDCC" value="1351" />
            <DataRow label="Date de prise d'effet" value={fr(contract.start_date)} />
            {contract.cnaps_required && (
              <div className="flex items-center gap-2 rounded-lg border border-[#1B3A6B]/20 bg-[#1B3A6B]/5 px-3 py-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#1B3A6B]" />
                <span className="font-medium text-[#1B3A6B] text-xs">
                  Carte professionnelle CNAPS requise pour ce poste
                </span>
              </div>
            )}
            {contract.job_description && (
              <InfoBox>
                <p className="mb-1 font-medium text-muted-foreground text-xs">Description de la mission</p>
                {contract.job_description}
              </InfoBox>
            )}
            {isCDD && contract.contract_reason && (
              <InfoBox variant="danger">
                <p className="mb-1 font-medium text-xs">Motif de recours au CDD (art. L. 1242-2 C. trav.)</p>
                <p>{contract.contract_reason}</p>
                {contract.cdd_reason_code && (
                  <p className="mt-1 text-xs opacity-70">Code : {contract.cdd_reason_code}</p>
                )}
              </InfoBox>
            )}
            {isCDD && (
              <LegalText>
                {isVacations
                  ? "Le présent contrat est conclu sous la forme CDD Vacations pour l'accomplissement de missions ponctuelles. À l'issue, le salarié percevra une indemnité de fin de contrat égale à 10 % de la rémunération totale brute (art. L. 1243-8 C. trav.)."
                  : "À l'issue du présent contrat, le salarié percevra une indemnité de fin de contrat égale à 10 % de la rémunération totale brute (art. L. 1243-8 C. trav.), sauf renouvellement ou embauche en CDI."}
              </LegalText>
            )}
          </Section>

          {/* ── Art – Période d'essai (conditional) ─────────────────────── */}
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
                ? "Le salarié est amené à intervenir sur les différents sites listés ci-dessus. Ce déplacement ne constitue pas une modification du contrat de travail."
                : wLocType === "zone"
                  ? "Le salarié est susceptible d'exercer ses fonctions dans l'ensemble de la zone géographique définie ci-dessus."
                  : "Le lieu de travail habituel est défini ci-dessus. Toute modification substantielle nécessiterait l'accord du salarié."}
            </LegalText>
          </Section>

          {/* ── Art – Durée du travail ───────────────────────────────────── */}
          <Section number={nn()} title="Durée du travail et horaires">
            {isVacations ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Nb de vacations", value: String(vacs.length) },
                    { label: "Volume horaire total", value: vacTotals.label },
                    { label: "Première vacation", value: vacs.length > 0 ? fr(vacs[0].date) : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg border bg-muted/30 px-3 py-2.5 text-center">
                      <p className="font-bold text-base">{value}</p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-[#1B3A6B] text-white text-xs">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium">Date</th>
                        <th className="px-4 py-2.5 text-left font-medium">Début</th>
                        <th className="px-4 py-2.5 text-left font-medium">Fin</th>
                        <th className="px-4 py-2.5 text-left font-medium">Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vacs.map((v, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: no stable id
                        <tr key={i} className={i % 2 !== 0 ? "bg-muted/30" : ""}>
                          <td className="px-4 py-2">{fr(v.date)}</td>
                          <td className="px-4 py-2">{v.start_time}</td>
                          <td className="px-4 py-2">{v.end_time}</td>
                          <td className="px-4 py-2 text-muted-foreground">{calcAmplitude(v.start_time, v.end_time)}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#1B3A6B]/5 font-semibold text-[#1B3A6B]">
                        <td className="px-4 py-2 text-xs uppercase tracking-wide" colSpan={3}>
                          Total
                        </td>
                        <td className="px-4 py-2">{vacTotals.label}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <LegalText>
                  L&apos;employeur se réserve le droit de modifier les horaires de chaque vacation avec un délai de
                  prévenance raisonnable, dans le respect des dispositions légales.
                </LegalText>
              </>
            ) : schedKnown && enabledDays.length > 0 ? (
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
                    {enabledDays.map(([day, h], i) => (
                      <tr key={day} className={i % 2 !== 0 ? "bg-muted/30" : ""}>
                        <td className="px-4 py-2">{DAY_FR[day] || day}</td>
                        <td className="px-4 py-2">
                          {h.start || "—"} – {h.end || "—"}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{calcAmplitude(h.start || "", h.end || "")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <LegalText>
                La durée mensuelle de travail est fixée à <strong>{fmtH(monthlyHours)} heures / mois</strong>. Les
                horaires précis seront communiqués par l&apos;employeur. Toute heure effectuée au-delà de la durée
                légale de 35 h/semaine constitue une heure supplémentaire ouvrant droit à majoration (art. L. 3121-28 C.
                trav.).
              </LegalText>
            )}
            {hasBonuses && (
              <InfoBox>
                <p className="mb-2 font-medium text-xs">Majorations de salaire applicables</p>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                  {contract.is_night && contract.night_bonus != null && (
                    <div className="flex justify-between rounded bg-background px-2 py-1.5 text-xs">
                      <span className="text-muted-foreground">Nuit</span>
                      <span className="font-semibold">+{contract.night_bonus} €/h</span>
                    </div>
                  )}
                  {contract.is_sunday && contract.sunday_bonus != null && (
                    <div className="flex justify-between rounded bg-background px-2 py-1.5 text-xs">
                      <span className="text-muted-foreground">Dimanche</span>
                      <span className="font-semibold">+{contract.sunday_bonus} €/h</span>
                    </div>
                  )}
                  {contract.is_holiday && contract.holiday_bonus != null && (
                    <div className="flex justify-between rounded bg-background px-2 py-1.5 text-xs">
                      <span className="text-muted-foreground">Jours fériés</span>
                      <span className="font-semibold">+{contract.holiday_bonus} €/h</span>
                    </div>
                  )}
                </div>
              </InfoBox>
            )}
          </Section>

          {/* ── Art – Rémunération ───────────────────────────────────────── */}
          <Section number={nn()} title="Rémunération">
            {monthlySalary != null ? (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Taux horaire brut", value: `${fmt2(hourlyRate)} €/h` },
                  { label: "Heures mensuelles", value: `${fmtH(monthlyHours)} h` },
                  { label: "Salaire brut / mois", value: `${fmt2(monthlySalary)} €` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border-2 border-[#1B3A6B]/15 bg-[#1B3A6B]/5 px-3 py-3 text-center"
                  >
                    <p className="font-bold text-[#1B3A6B] text-base">{value}</p>
                    <p className="text-muted-foreground text-[10px] mt-1 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <DataRow
                  label="Taux horaire brut"
                  value={contract.hourly_rate ? `${contract.hourly_rate} €/h` : null}
                />
                <DataRow label="Volume horaire mensuel" value={`${fmtH(monthlyHours)} h / mois`} />
              </>
            )}
            {contract.overtime_rate && (
              <DataRow label="Heures supplémentaires" value={`${contract.overtime_rate} €/h`} />
            )}
            <LegalText>
              La rémunération versée est au moins égale au SMIC en vigueur (art. L. 3231-2 C. trav.) ou au salaire
              minimum conventionnel si plus favorable. Le bulletin de paie est remis mensuellement (art. L. 3243-2 C.
              trav.).
            </LegalText>
          </Section>

          {/* ── Art – Avantages (conditional) ───────────────────────────── */}
          {(contract.meal_bonus || contract.transport_bonus) && (
            <Section number={nn()} title="Avantages et primes">
              <div className="grid grid-cols-2 gap-2">
                {contract.meal_bonus && (
                  <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
                    <span className="text-muted-foreground text-xs">Prime de repas</span>
                    <span className="font-semibold text-sm">{contract.meal_bonus} €</span>
                  </div>
                )}
                {contract.transport_bonus && (
                  <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
                    <span className="text-muted-foreground text-xs">Prime de transport</span>
                    <span className="font-semibold text-sm">{contract.transport_bonus} €</span>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* ── Art – Congés payés ───────────────────────────────────────── */}
          <Section number={nn()} title="Congés payés">
            <LegalText>
              Le salarié bénéficie de 2,5 jours ouvrables de congés payés par mois de travail effectif, soit 30 jours
              ouvrables par année complète (art. L. 3141-3 C. trav.).{" "}
              {isCDD
                ? "À l'issue du contrat, une indemnité compensatrice de congés payés égale à 10 % de la rémunération totale brute sera versée (art. L. 3141-26 C. trav.)."
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
              prévues par la convention collective et les art. L. 1226-1 et suivants du Code du travail.
            </LegalText>
          </Section>

          {/* ── Art – Formation ──────────────────────────────────────────── */}
          <Section number={nn()} title="Formation professionnelle et CPF">
            <LegalText>
              Le salarié bénéficie du droit à la formation professionnelle continue conformément aux art. L. 6311-1 et
              suivants du Code du travail. Il dispose d&apos;un Compte Personnel de Formation (CPF) alimenté à raison de
              500 € par an (plafonné à 5 000 €) ou 800 € pour les salariés peu qualifiés (plafonné à 8 000 €).
            </LegalText>
          </Section>

          {/* ── Art – Obligations ────────────────────────────────────────── */}
          <Section number={nn()} title="Obligations du salarié – Loyauté, discrétion et confidentialité">
            <LegalText>
              Le salarié s&apos;engage à observer une obligation de loyauté envers l&apos;employeur, à exécuter de bonne
              foi les tâches confiées et à respecter les règles internes de l&apos;entreprise. Il est tenu à une
              obligation de discrétion concernant toutes les informations confidentielles auxquelles il aurait accès
              dans le cadre de ses fonctions, pendant et après l&apos;exécution du contrat.
            </LegalText>
          </Section>

          {/* ── Art – Rupture (CDI uniquement) ───────────────────────────── */}
          {!isCDD && (
            <Section number={nn()} title="Rupture du contrat de travail">
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Mode de rupture</th>
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Préavis</th>
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Référence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      ["Démission", "Selon convention collective", "Art. L. 1237-1"],
                      ["Licenciement", "Selon ancienneté et convention", "Art. L. 1234-1"],
                      ["Rupture conventionnelle", "15 jours (rétractation)", "Art. L. 1237-11"],
                    ].map(([mode, preavis, ref]) => (
                      <tr key={mode} className="odd:bg-muted/20">
                        <td className="px-3 py-2">{mode}</td>
                        <td className="px-3 py-2 text-muted-foreground">{preavis}</td>
                        <td className="px-3 py-2 text-muted-foreground">{ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <LegalText>
                En cas de licenciement sans faute grave, le salarié ayant au moins 8 mois d&apos;ancienneté bénéficiera
                d&apos;une indemnité légale conformément à l&apos;art. L. 1234-9 C. trav.
              </LegalText>
            </Section>
          )}

          {/* ── Art – CDD rupture anticipée ──────────────────────────────── */}
          {isCDD && (
            <Section number={nn()} title="Rupture anticipée du contrat">
              <InfoBox>
                Le présent CDD ne peut être rompu avant son terme qu&apos;en cas d&apos;accord amiable écrit, faute
                grave, force majeure, inaptitude constatée par le médecin du travail, ou embauche en CDI (art. L. 1243-1
                C. trav.).
              </InfoBox>
              <LegalText>
                Toute rupture anticipée en dehors de ces cas ouvre droit à des dommages-intérêts correspondant au
                minimum aux salaires restant dûs jusqu&apos;au terme.
              </LegalText>
            </Section>
          )}

          {/* ── Art – Équipements (conditional) ─────────────────────────── */}
          {contract.equipment_provided && (
            <Section number={nn()} title="Équipements fournis">
              <LegalText>
                L&apos;employeur met à la disposition du salarié les équipements de protection individuelle (EPI) et les
                équipements professionnels nécessaires à l&apos;exercice de ses fonctions (art. L. 4121-1 C. trav.). Ces
                équipements demeurent la propriété de l&apos;employeur et devront être restitués en fin de contrat.
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
              Le salarié déclare avoir pris connaissance du règlement intérieur de l&apos;entreprise et s&apos;engage à
              le respecter ainsi que les consignes de sécurité et les directives de l&apos;employeur.
            </LegalText>
          </Section>

          {/* ── Art – RGPD ───────────────────────────────────────────────── */}
          <Section number={nn()} title="Protection des données personnelles (RGPD)">
            <LegalText>
              Les données personnelles du salarié sont collectées et traitées conformément au Règlement (UE) 2016/679
              (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée. La durée de conservation est de 5 ans après la fin
              du contrat. Le salarié dispose d&apos;un droit d&apos;accès, de rectification et d&apos;effacement en
              contactant l&apos;employeur, et peut introduire une réclamation auprès de la CNIL.
            </LegalText>
          </Section>

          {/* ── Signatures ───────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/50 px-5 py-3">
              <p className="font-bold text-foreground text-xs uppercase tracking-widest">Signatures des parties</p>
            </div>
            <div className="px-5 py-4 space-y-4">
              <p className="text-muted-foreground text-xs">
                Fait en deux exemplaires originaux, à <strong>{dc?.city || "_______________"}</strong>, le{" "}
                <strong>{fr(contract.signed_at_candidate || contract.signed_at_company || contract.created_at)}</strong>
                . Chaque partie reconnaît avoir reçu un exemplaire et avoir pris connaissance de l&apos;intégralité du
                contrat.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <SigBlock
                  name={dc?.name || "—"}
                  sub={[legalRepName !== "—" && legalRepName, dc?.siret && `SIRET : ${formatSiret(dc.siret)}`]
                    .filter(Boolean)
                    .join(" · ")}
                  signed={!!contract.isProSigned}
                  signedAt={contract.signed_at_company}
                  sigUrl={companySigUrl}
                  stampUrl={companyStampUrl}
                />
                <SigBlock
                  name={candidateName}
                  sub={[
                    candidateBirthday && `Né(e) le ${fr(candidateBirthday)}`,
                    dd?.social_security_number && `N° SS : ${dd.social_security_number}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  signed={!!contract.isSigned}
                  signedAt={contract.signed_at_candidate}
                  sigUrl={candidateSigUrl}
                  mention="Mention manuscrite : « Lu et approuvé »"
                />
              </div>
              {currentUser?.id === contract.company_id && !contract.isProSigned && (
                <Button onClick={() => setSignDialogOpen(true)} className="w-full bg-[#1B3A6B] hover:bg-[#1B3A6B]/90">
                  Signer en tant qu&apos;entreprise
                </Button>
              )}
              {isCDD && (
                <InfoBox variant="warning">
                  <strong>Art. L. 1242-13 C. trav. :</strong> Le contrat doit être transmis au salarié dans les 2 jours
                  ouvrables suivant l&apos;embauche. L&apos;absence de signature dans ce délai peut entraîner la
                  requalification en CDI.
                </InfoBox>
              )}
            </div>
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
