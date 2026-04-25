"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/supabaseClient";

const FormSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  remember: z.boolean().optional(),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { email, password } = data;
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !authData.user) {
      toast.error("Échec de la connexion", { description: authError?.message || "Identifiants invalides." });
      return;
    }

    const userId = authData.user.id;

    // 1. Candidat → table profiles
    const { data: profileData } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (profileData) {
      toast.success("Connexion réussie", { description: "Bienvenue !" });
      router.push("/jobs");
      return;
    }

    // 2. Super admin → table admins (role super_admin)
    const { data: adminData } = await supabase.from("admins").select("role").eq("id", userId).maybeSingle();
    if (adminData?.role === "super_admin") {
      toast.success("Connexion réussie", { description: "Bienvenue, super admin !" });
      router.push("/dashboard/users");
      return;
    }

    // 3. Entreprise → table companies
    const { data: companyData } = await supabase.from("companies").select("id").eq("id", userId).maybeSingle();
    if (companyData) {
      toast.success("Connexion réussie", { description: "Bienvenue !" });
      router.push("/dashboard/my-jobs");
      return;
    }

    // 4. Admin simple
    if (adminData?.role === "admin") {
      toast.success("Connexion réussie", { description: "Bienvenue, admin !" });
      router.push("/dashboard/users");
      return;
    }

    // Aucun rôle reconnu
    await supabase.auth.signOut();
    toast.error("Accès refusé", { description: "Aucun compte associé à cet identifiant." });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse email</FormLabel>
              <FormControl>
                <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox
                  id="login-remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="size-4"
                />
              </FormControl>
              <FormLabel htmlFor="login-remember" className="ml-1 font-medium text-muted-foreground text-sm">
                Se souvenir de moi pendant 30 jours
              </FormLabel>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Se connecter
        </Button>
      </form>
    </Form>
  );
}
