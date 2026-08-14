"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { ChevronDown, Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { AmbientBackground } from "@/components/ambient-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/supabaseClient";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailValid = EMAIL_REGEX.test(email.trim());
  const showEmailError = emailTouched && email !== "" && !emailValid;
  const canSubmit = emailValid && role !== "" && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim().toLowerCase(), role });
    setLoading(false);
    if (error && error.code !== "23505") {
      toast.error("Une erreur est survenue. Réessayez plus tard.");
    } else {
      toast.success("Inscription confirmée ! Merci 🎉");
      setEmail("");
      setRole("");
      setEmailTouched(false);
    }
  };

  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[24px] border border-border/70 bg-card p-10 md:p-16"
        >
          <AmbientBackground />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h2 className="mb-2 font-(family-name:--font-heading) font-bold text-2xl text-foreground md:text-3xl">
              Restez informé
            </h2>
            <p className="mx-auto mb-8 max-w-md text-muted-foreground text-sm leading-relaxed">
              Recevez les dernières offres, actualités du secteur et conseils directement dans votre boîte mail. Pas de
              spam.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col items-start gap-3 sm:flex-row">
              <div className="w-full flex-1">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  className={`h-11 w-full rounded-[16px] ${showEmailError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {showEmailError && (
                  <p className="mt-1 text-left text-destructive text-xs">
                    Adresse email invalide (ex : nom@domaine.fr)
                  </p>
                )}
              </div>
              <div className="relative sm:w-44">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="h-11 w-full appearance-none rounded-[16px] border border-input bg-background px-3 pr-8 text-foreground text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>
                    Je suis…
                  </option>
                  <option value="candidat">Candidat</option>
                  <option value="company">Entreprise</option>
                </select>
                <ChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 text-muted-foreground opacity-50" />
              </div>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="h-11 gap-2 rounded-[16px] bg-linear-to-r from-primary to-brand-secondary text-primary-foreground"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                S&apos;inscrire
              </Button>
            </form>

            <p className="mt-4 text-muted-foreground text-xs">
              En vous inscrivant, vous acceptez notre{" "}
              <a
                href="/politique-de-confidentialite"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                politique de confidentialité
              </a>
              . Désinscription à tout moment.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
