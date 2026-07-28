import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="relative border-border/60 border-t bg-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <Image
                src="https://hzvbylhdptwgblpdondm.supabase.co/storage/v1/object/public/dashboard-assets/wesafe-logo-inline.svg"
                alt="WeSafe"
                width={116}
                height={39}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              La plateforme de recrutement dédiée aux professionnels de la sécurité privée.
            </p>
          </div>

          <div>
            <h4 className="font-(family-name:--font-heading) font-semibold text-foreground text-sm">Produit</h4>
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
            <h4 className="font-(family-name:--font-heading) font-semibold text-foreground text-sm">Entreprise</h4>
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
            <h4 className="font-(family-name:--font-heading) font-semibold text-foreground text-sm">Légal</h4>
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

        <div className="mt-12 border-border/60 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} WeSafe. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
