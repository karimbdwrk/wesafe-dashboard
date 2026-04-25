import Link from "next/link";

import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="border-border border-t bg-card/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-[family-name:var(--font-heading)] font-bold text-foreground text-xl">WeSafe</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              La plateforme de recrutement dédiée aux professionnels de la sécurité privée.
            </p>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-sm">Produit</h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/tarifs" className="text-muted-foreground text-sm transition-colors hover:text-foreground">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-muted-foreground text-sm transition-colors hover:text-foreground">
                  Offres d'emploi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-sm">Entreprise</h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/a-propos"
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground text-sm transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground text-sm transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-sm">Légal</h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions-generales-d-utilisation"
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                  Conditions générales d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions-generales-de-vente"
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                  Conditions générales de vente
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-border border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} WeSafe. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
