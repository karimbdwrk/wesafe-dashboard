"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, Briefcase, Eye, EyeOff, Loader2, Shield, Smartphone, Star, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/supabaseClient";

const APPSTORE_URL = "https://apps.apple.com/app/wesafe";
const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.wesafe";

// ─── Sélection du rôle ────────────────────────────────────────────────────────

function RoleSelection({ onSelect }) {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-3xl tracking-tight">Créer un compte</h1>
        <p className="text-muted-foreground">Vous êtes...</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelect("pro")}
          className="group flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Briefcase className="size-7" />
          </div>
          <div className="text-center">
            <p className="font-semibold">Professionnel</p>
            <p className="mt-0.5 text-muted-foreground text-xs">Entreprise, agence de sécurité</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect("candidate")}
          className="group flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Shield className="size-7" />
          </div>
          <div className="text-center">
            <p className="font-semibold">Candidat</p>
            <p className="mt-0.5 text-muted-foreground text-xs">Agent de sécurité, SSIAP…</p>
          </div>
        </button>
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Déjà un compte ?{" "}
        <Link prefetch={false} href="login" className="font-medium text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

// ─── Inscription Pro (3 étapes) ───────────────────────────────────────────────

function ProRegistration({ onBack }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email) return;
    setEmailError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-signup-otp", {
        body: { email },
      });
      if (error?.context?.status === 409 || data?.error?.includes("existe déjà")) {
        setEmailError("Un compte existe déjà avec cet email.");
        return;
      }
      if (error) throw error;
      toast.success("Code envoyé ! Vérifiez votre boîte mail.");
      setStep(2);
    } catch {
      toast.error("Impossible d'envoyer le code. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-signup-otp", {
        body: { email, otp },
      });
      if (error) throw error;
      if (!data?.success) {
        const msg =
          data?.attemptsLeft !== undefined
            ? `Code incorrect — ${data.attemptsLeft} tentative${data.attemptsLeft > 1 ? "s" : ""} restante${data.attemptsLeft > 1 ? "s" : ""}.`
            : (data?.error ?? "Code invalide.");
        toast.error(msg);
        return;
      }
      setStep(3);
    } catch {
      toast.error("Erreur lors de la vérification. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { company_name: companyName, role: "company" },
        },
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (userId) {
        const { error: companyError } = await supabase.from("companies").insert({
          id: userId,
          name: companyName,
          email,
          updated_at: new Date().toISOString(),
          subscription_status: "standard",
          company_status: "pending",
          last_minute_credits: 0,
        });
        if (companyError) throw companyError;
      }

      toast.success("Compte créé avec succès !");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err?.message ?? "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={step === 1 ? onBack : () => setStep((s) => s - 1)}
        className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour
      </button>

      {/* Étape 1 — Email */}
      {step === 1 && (
        <>
          <div className="space-y-1">
            <h1 className="font-bold text-2xl tracking-tight">Votre adresse e-mail</h1>
            <p className="text-muted-foreground text-sm">Nous vous enverrons un code de vérification à 6 chiffres.</p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@votre-entreprise.fr"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
                required
              />
              {emailError && (
                <p className="text-destructive text-xs">
                  {emailError}{" "}
                  <Link href="/auth/login" className="underline">
                    Se connecter
                  </Link>
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Envoyer le code
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm">
            Déjà un compte ?{" "}
            <Link prefetch={false} href="login" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </>
      )}

      {/* Étape 2 — OTP */}
      {step === 2 && (
        <>
          <div className="space-y-1">
            <h1 className="font-bold text-2xl tracking-tight">Vérification de l'e-mail</h1>
            <p className="text-muted-foreground text-sm">
              Entrez le code à 6 chiffres envoyé à <span className="font-medium text-foreground">{email}</span>.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="otp">Code de vérification</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center font-mono text-xl tracking-[0.5em]"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Vérifier le code
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm">
            Code non reçu ?{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => {
                setOtp("");
                setStep(1);
              }}
            >
              Renvoyer
            </button>
          </p>
        </>
      )}

      {/* Étape 3 — Mot de passe */}
      {step === 3 && (
        <>
          <div className="space-y-1">
            <h1 className="font-bold text-2xl tracking-tight">Créer votre compte</h1>
            <p className="text-muted-foreground text-sm">Plus qu'une étape pour rejoindre WeSafe.</p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="company">Nom de l'entreprise</Label>
              <Input
                id="company"
                type="text"
                placeholder="Sécurité Pro SAS"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8 caractères minimum"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Créer mon compte
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

// ─── Message candidat ─────────────────────────────────────────────────────────

function CandidateMessage({ onBack }) {
  return (
    <div className="w-full max-w-md space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour
      </button>

      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Smartphone className="size-8 text-primary" />
        </div>
        <h1 className="font-bold text-2xl tracking-tight">WeSafe, votre carrière dans la sécurité</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          L'application pensée pour les agents de sécurité. Trouvez des missions, gérez vos contrats et boostez votre
          carrière — tout depuis votre smartphone.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            icon: TrendingUp,
            title: "Des missions qui correspondent à votre profil",
            desc: "Algorithme de matching intelligent selon vos qualifications, disponibilités et localisation.",
          },
          {
            icon: Star,
            title: "Les meilleures entreprises de sécurité",
            desc: "Accédez à des centaines d'offres vérifiées d'agences et d'établissements partout en France.",
          },
          {
            icon: Users,
            title: "Gestion simplifiée de vos contrats",
            desc: "Signez vos contrats en ligne, consultez vos plannings et suivez vos paiements en temps réel.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-3 rounded-xl border bg-card p-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{title}</p>
              <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-center font-medium text-sm">Téléchargez l'application gratuitement</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1 gap-2 bg-black text-white hover:bg-zinc-800">
            <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1 gap-2">
            <a href={PLAYSTORE_URL} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M3.18 23.76c.3.17.64.22.99.14l.11-.06 12.44-7.18-2.7-2.71zM.44 2.08A1.55 1.55 0 0 0 0 3.19v17.62c0 .43.16.83.44 1.11l.06.06 9.87-9.87v-.23zM20.13 10.4l-2.65-1.53-3 3 3 3 2.67-1.54c.76-.44.76-1.49-.02-1.93zM3.18.24l10.84 10.86 2.7-2.7L3.29.1A1.16 1.16 0 0 0 3.18.24z" />
              </svg>
              Google Play
            </a>
          </Button>
        </div>
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Déjà un compte ?{" "}
        <Link prefetch={false} href="login" className="font-medium text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [role, setRole] = useState(null);

  return (
    <div className="flex h-dvh">
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md py-12 lg:py-20">
          {role === null && <RoleSelection onSelect={setRole} />}
          {role === "pro" && <ProRegistration onBack={() => setRole(null)} />}
          {role === "candidate" && <CandidateMessage onBack={() => setRole(null)} />}
        </div>
      </div>

      <div className="hidden bg-primary lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Shield className="mx-auto size-12 text-primary-foreground" />
            <div className="space-y-2">
              <h1 className="font-light text-5xl text-primary-foreground">WeSafe</h1>
              <p className="text-primary-foreground/80 text-xl">La sécurité, réinventée.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
