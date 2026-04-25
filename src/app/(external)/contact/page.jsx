"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/supabaseClient";

// Table Supabase attendue : contact_messages
// Colonnes : id, name, email, subject, message, created_at

const SUBJECTS = [
  "Question générale",
  "Support technique",
  "Partenariat entreprise",
  "Candidature / recrutement",
  "Presse & médias",
  "Autre",
];

const FormSchema = z.object({
  name: z.string().min(2, { message: "Veuillez entrer votre nom complet." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  subject: z.string().min(1, { message: "Veuillez choisir un sujet." }),
  message: z.string().min(10, {
    message: "Votre message doit contenir au moins 10 caractères.",
  }),
});

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data) => {
    const { error } = await supabase.from("contact_messages").insert([data]);

    if (error) {
      toast.error("Erreur lors de l'envoi", {
        description: "Veuillez réessayer ou nous contacter par email.",
      });
      return;
    }

    setSent(true);
  };

  return (
    <div className="mt-14 min-h-screen bg-background">
      {/* Hero */}
      <section className="border-border border-b bg-card/50 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-medium text-primary text-sm uppercase tracking-widest">Contact</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] font-bold text-4xl text-foreground md:text-5xl">
            Une question ? Écrivez-nous
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Notre équipe vous répond dans les meilleurs délais, généralement sous 24h.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-3">
        {/* Infos de contact */}
        <aside className="space-y-8">
          <div>
            <h2 className="mb-6 font-semibold text-foreground text-lg">Nos coordonnées</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Email</p>
                  <a
                    href="mailto:contact@wesafe.fr"
                    className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  >
                    contact@wesafe.fr
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Téléphone</p>
                  <a
                    href="tel:+33100000000"
                    className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  >
                    +33 1 00 00 00 00
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Adresse</p>
                  <p className="text-muted-foreground text-sm">Paris, France</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-card p-5">
            <p className="font-medium text-foreground text-sm">⏱ Temps de réponse</p>
            <p className="text-muted-foreground text-sm">
              Nous répondons généralement sous <strong className="text-foreground">24h</strong> en jours ouvrés.
            </p>
          </div>
        </aside>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-12 text-center">
              <CheckCircle className="h-12 w-12 text-primary" />
              <h2 className="font-semibold text-foreground text-xl">Message envoyé !</h2>
              <p className="max-w-sm text-muted-foreground">
                Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false);
                  form.reset();
                }}
              >
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="mb-6 font-semibold text-foreground text-lg">Envoyer un message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean Dupont" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jean@exemple.fr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sujet</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="">Choisir un sujet…</option>
                            {SUBJECTS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={5}
                            placeholder="Décrivez votre demande…"
                            className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2" disabled={form.formState.isSubmitting}>
                    <Send className="h-4 w-4" />
                    {form.formState.isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
