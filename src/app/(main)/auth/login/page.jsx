import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { WesafeLogo } from "@/components/wesafe-logo";

import { LoginForm } from "../_components/login-form";

export default function LoginV1() {
  return (
    <div className="flex h-dvh">
      {/* Bouton retour */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-sm text-white transition-colors hover:text-gray-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Accueil
      </Link>
      <div className="hidden bg-primary lg:flex lg:w-1/3 lg:flex-col lg:justify-between lg:p-12">
        <Image src="/W-fff.svg" alt="" aria-hidden="true" width={40} height={46} className="h-9 w-auto" />

        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="font-light text-4xl text-primary-foreground">Bon retour</h1>
            <p className="text-primary-foreground/80 text-lg">Connectez-vous pour continuer</p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-foreground" />
              <span className="text-primary-foreground/90 text-sm">
                Suivez vos candidatures et vos offres en temps réel
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-foreground" />
              <span className="text-primary-foreground/90 text-sm">
                Messagerie directe entre candidats et entreprises
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-foreground" />
              <span className="text-primary-foreground/90 text-sm">Contrats générés et signés électroniquement</span>
            </li>
          </ul>
        </div>

        <blockquote className="space-y-2">
          <p className="text-primary-foreground/90 text-lg italic leading-relaxed">
            « Chaque connexion rapproche une entreprise du bon profil, et un agent de sa prochaine mission. »
          </p>
          <footer className="text-primary-foreground/60 text-sm not-italic">— L&apos;équipe WeSafe</footer>
        </blockquote>
      </div>

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <Link href="/" className="inline-flex justify-center">
              <WesafeLogo width={116} height={39} className="h-8 w-auto" priority />
            </Link>
            <div className="font-medium tracking-tight">Connexion</div>
            <div className="mx-auto max-w-xl text-muted-foreground">
              Bienvenue sur WeSafe. Entrez vos identifiants pour accéder à votre espace.
            </div>
          </div>
          <div className="space-y-4">
            <LoginForm />
            <p className="text-center text-muted-foreground text-xs">
              Pas encore de compte ?{" "}
              <Link prefetch={false} href="register" className="text-primary hover:underline">
                Télécharger l&apos;application
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
