"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import wesafeLogo from "@/assets/wesafe-logo-inline.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function DeleteAccountPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestDeletion(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("request-account-deletion", {
        body: { email },
      });
      if (error) {
        const message =
          error?.context?.status === 404
            ? "Aucun compte associé à cet email."
            : error?.context?.status === 409
              ? "Ce compte est déjà en cours de suppression."
              : (data?.error ?? "Impossible d'envoyer le code. Réessayez.");
        toast.error(message);
        return;
      }
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
      const { data, error } = await supabase.functions.invoke("verify-account-deletion", {
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

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-24">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image src={wesafeLogo} alt="WeSafe" width={116} height={39} className="h-8 w-auto" priority />
          </Link>
        </div>

        {step === 1 && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <h1 className="mb-1 font-semibold text-lg">Supprimer mon compte</h1>
            <p className="mb-6 text-muted-foreground text-sm">
              Entrez l&apos;email associé à votre compte WeSafe. Nous vous enverrons un code pour confirmer la
              suppression.
            </p>

            <Alert variant="destructive" className="mb-6">
              <AlertTriangle />
              <AlertTitle>Ce que ça implique</AlertTitle>
              <AlertDescription>
                <p>
                  Votre compte sera désactivé immédiatement, puis vos données définitivement supprimées sous 30 jours.
                  Vous pouvez annuler la suppression en contactant le support avant cette échéance.
                </p>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleRequestDeletion} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" variant="destructive" disabled={loading} className="mt-1 w-full">
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Recevoir le code de suppression
              </Button>
            </form>

            <p className="mt-4 text-center text-muted-foreground text-xs">
              Besoin d&apos;aide plutôt qu&apos;une suppression ?{" "}
              <a href="mailto:dpo@wesafeapp.fr" className="text-primary underline-offset-2 hover:underline">
                Contactez le support
              </a>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h1 className="mb-1 font-semibold text-lg">Vérification</h1>
            <p className="mb-6 text-muted-foreground text-sm">
              Entrez le code à 6 chiffres envoyé à <span className="font-medium text-foreground">{email}</span>.
            </p>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="otp">Code de suppression</Label>
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
                  autoFocus
                />
              </div>
              <Button type="submit" variant="destructive" disabled={loading || otp.length !== 6} className="w-full">
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Confirmer la suppression
              </Button>
              <Button type="button" variant="ghost" onClick={() => setStep(1)} className="w-full">
                Retour
              </Button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <Trash2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Suppression confirmée</h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Votre compte est désactivé. Un email de confirmation vient de vous être envoyé, avec la date à laquelle
                vos données seront définitivement effacées.
              </p>
            </div>
            <Link href="/" className="text-primary text-sm underline-offset-2 hover:underline">
              Retour à l&apos;accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
