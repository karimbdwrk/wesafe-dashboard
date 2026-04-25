import Link from "next/link";

import { ArrowLeft } from "lucide-react";

const SECTIONS = [
  { id: "editeur", label: "1. Éditeur" },
  { id: "hebergement", label: "2. Hébergement" },
  { id: "responsable", label: "3. Responsable de publication" },
  { id: "propriete", label: "4. Propriété intellectuelle" },
  { id: "donnees", label: "5. Données personnelles" },
  { id: "cookies", label: "6. Cookies & stockage local" },
  { id: "liens", label: "7. Liens hypertextes" },
  { id: "cnaps", label: "8. Sécurité privée & CNAPS" },
  { id: "responsabilite", label: "9. Limitation de responsabilité" },
  { id: "droit", label: "10. Droit applicable" },
];

function Placeholder({ children }) {
  return <mark className="rounded bg-amber-100 px-1 font-semibold text-amber-800 not-italic">{children}</mark>;
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="mt-14 border-border border-b bg-primary py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-primary-foreground/70 text-sm transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
          <p className="mb-2 font-medium text-primary-foreground/60 text-sm uppercase tracking-widest">
            Informations légales
          </p>
          <h1 className="font-(family-name:--font-heading) mb-3 font-bold text-3xl text-primary-foreground md:text-4xl">
            Mentions légales
          </h1>
          <p className="text-primary-foreground/70 text-sm">
            Applicables au site internet et à l&apos;application mobile{" "}
            <strong className="text-primary-foreground">WeSafe</strong> — Dernière mise à jour :{" "}
            <strong className="text-primary-foreground">20 avril 2026</strong>
          </p>
        </div>
      </section>

      {/* Layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-[220px_1fr]">
        {/* Sommaire sticky */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-4">
            <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Sommaire</p>
            <nav className="space-y-0.5 text-sm">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="min-w-0 space-y-2 rounded-xl border border-border bg-card p-8">
          {/* Note de configuration */}
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
            <strong>⚠️ Note :</strong> Les éléments{" "}
            <mark className="rounded bg-amber-100 px-1 font-semibold text-amber-800">surlignés</mark> doivent être
            complétés avant toute publication.
          </div>

          {/* ── 1. Éditeur ── */}
          <section id="editeur" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">1. Éditeur</h2>
            <p className="mb-4 text-muted-foreground leading-7">
              Conformément aux dispositions de l&apos;article 6-III-1 de la loi n° 2004-575 du 21 juin 2004 pour la
              Confiance dans l&apos;Économie Numérique (LCEN), le présent site internet et l&apos;application mobile{" "}
              <strong>WeSafe</strong> sont édités par :
            </p>
            <div className="mb-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {[
                    ["Raison sociale", <Placeholder key="rs">[NOM DE LA SOCIÉTÉ]</Placeholder>],
                    ["Forme juridique", <Placeholder key="fj">[SAS / SASU / SARL / EURL]</Placeholder>],
                    [
                      "Capital social",
                      <>
                        <Placeholder key="cs">[MONTANT]</Placeholder> €
                      </>,
                    ],
                    ["Siège social", <Placeholder key="ss">[ADRESSE COMPLÈTE, CODE POSTAL, VILLE]</Placeholder>],
                    ["SIRET", <Placeholder key="si">[14 CHIFFRES]</Placeholder>],
                    ["RCS", <Placeholder key="rc">[VILLE + NUMÉRO]</Placeholder>],
                    ["N° TVA intracommunautaire", <Placeholder key="tv">[FR + 11 CHIFFRES]</Placeholder>],
                    ["Téléphone", <Placeholder key="tel">[+33 X XX XX XX XX]</Placeholder>],
                    ["Adresse e-mail", <Placeholder key="em">[contact@wesafe.fr]</Placeholder>],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-border border-b last:border-0">
                      <td className="w-56 py-2.5 pr-4 align-top font-medium text-foreground">{label}</td>
                      <td className="py-2.5 text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── 2. Hébergement ── */}
          <section id="hebergement" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              2. Hébergement
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              Le site, l&apos;application mobile et les données associées sont hébergés par les prestataires suivants :
            </p>

            <h3 className="mt-5 mb-2 font-semibold text-base text-foreground">
              Base de données, authentification et stockage de fichiers
            </h3>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong>Supabase, Inc.</strong> – 970 Trestle Glen Rd, Oakland, CA 94610, États-Unis
              </li>
              <li>
                Site web :{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  supabase.com
                </a>
              </li>
              <li>
                Les données des utilisateurs résidant dans l&apos;EEE sont hébergées dans la région{" "}
                <strong>EU West (Frankfurt, Allemagne)</strong>, conformément au RGPD.
              </li>
              <li>
                Un contrat de traitement des données (DPA) est en vigueur entre la société éditrice et Supabase, Inc.
              </li>
            </ul>

            <h3 className="mt-5 mb-2 font-semibold text-base text-foreground">
              Traitement d&apos;images (tampons d&apos;entreprise)
            </h3>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong>Railway Corp.</strong> – Infrastructure cloud (États-Unis)
              </li>
              <li>
                Site web :{" "}
                <a
                  href="https://railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  railway.app
                </a>
              </li>
              <li>Utilisé exclusivement pour le traitement automatisé des images de tampons d&apos;entreprise.</li>
            </ul>

            <h3 className="mt-5 mb-2 font-semibold text-base text-foreground">Notifications push (Android)</h3>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong>Google Firebase (Google LLC)</strong> – 1600 Amphitheatre Parkway, Mountain View, CA 94043,
                États-Unis
              </li>
              <li>Utilisé uniquement pour l&apos;envoi de notifications push sur les appareils Android.</li>
            </ul>
          </section>

          {/* ── 3. Responsable ── */}
          <section id="responsable" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              3. Responsable de la publication
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              Le directeur de la publication du site et de l&apos;application WeSafe est :{" "}
              <strong>
                <Placeholder>[NOM ET PRÉNOM DU DIRIGEANT]</Placeholder>
              </strong>
              , en qualité de <Placeholder>[Gérant / Président / Directeur général]</Placeholder> de la société{" "}
              <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder>.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Pour toute question ou réclamation concernant le contenu éditorial, vous pouvez le contacter à
              l&apos;adresse :{" "}
              <a href="mailto:contact@wesafe.fr" className="text-primary underline-offset-2 hover:underline">
                <Placeholder>[contact@wesafe.fr]</Placeholder>
              </a>
            </p>
          </section>

          {/* ── 4. Propriété intellectuelle ── */}
          <section id="propriete" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              4. Propriété intellectuelle
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              L&apos;ensemble des éléments constitutifs du site internet et de l&apos;application mobile WeSafe (marque,
              logo, textes, graphismes, interfaces, icônes, sons, vidéos, logiciels, base de données, code source) sont
              la propriété exclusive de <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder> ou font l&apos;objet d&apos;une
              autorisation expresse de leurs auteurs ou ayants droit.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Ces éléments sont protégés par les lois françaises et internationales relatives à la propriété
              intellectuelle et notamment par le Code de la propriété intellectuelle (CPI).
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Toute reproduction, représentation, modification, publication, transmission, dénaturation, adaptation ou
              exploitation, totale ou partielle, de ces éléments, par quelque procédé et sur quelque support que ce
              soit, sans l&apos;autorisation écrite préalable de <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder>, est
              strictement interdite et constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants du
              CPI.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Les contenus (textes, photos, CV, documents professionnels) déposés par les utilisateurs sur la plateforme
              restent la propriété exclusive de leurs auteurs. En les publiant sur WeSafe, l&apos;utilisateur accorde à{" "}
              <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder> une licence non exclusive, mondiale et gratuite aux seules
              fins du fonctionnement du service.
            </p>
          </section>

          {/* ── 5. Données personnelles ── */}
          <section id="donnees" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              5. Protection des données personnelles
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder> attache la plus grande importance à la protection des
              données personnelles de ses utilisateurs. Le traitement des données collectées via l&apos;application et
              le site WeSafe est régi par le Règlement (UE) 2016/679 du 27 avril 2016 (RGPD) ainsi que par la loi n°
              78-17 du 6 janvier 1978 modifiée (loi Informatique et Libertés).
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Les informations détaillées relatives aux traitements, aux bases légales, aux durées de conservation, aux
              droits des personnes et aux mesures de sécurité sont décrites dans les{" "}
              <Link href="/cgu#donnees" className="text-primary underline-offset-2 hover:underline">
                Conditions Générales d&apos;Utilisation — Section 9
              </Link>
              .
            </p>

            <h3 className="mt-5 mb-2 font-semibold text-base text-foreground">
              Délégué à la Protection des Données (DPO)
            </h3>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                Nom : <Placeholder>[NOM DU DPO ou &quot;Responsable du traitement&quot;]</Placeholder>
              </li>
              <li>
                Email :{" "}
                <a href="mailto:dpo@wesafe.fr" className="text-primary underline-offset-2 hover:underline">
                  <Placeholder>[dpo@wesafe.fr]</Placeholder>
                </a>
              </li>
              <li>
                Adresse : <Placeholder>[ADRESSE POSTALE]</Placeholder>
              </li>
            </ul>
            <p className="mb-4 text-muted-foreground leading-7">
              Vous pouvez exercer vos droits (accès, rectification, effacement, opposition, portabilité, limitation) en
              contactant le DPO ou par courrier recommandé au siège social. En cas de litige non résolu, vous avez le
              droit d&apos;introduire une réclamation auprès de la <strong>CNIL</strong> :{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                www.cnil.fr
              </a>{" "}
              — 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.
            </p>
          </section>

          {/* ── 6. Cookies ── */}
          <section id="cookies" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              6. Cookies &amp; stockage local
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              <strong>Application mobile :</strong> WeSafe n&apos;utilise pas de cookies au sens strict du terme. Des
              mécanismes de stockage local (<code className="rounded bg-muted px-1 text-sm">expo-secure-store</code>,{" "}
              <code className="rounded bg-muted px-1 text-sm">AsyncStorage</code>) sont utilisés sur l&apos;appareil de
              l&apos;utilisateur aux seules fins techniques nécessaires au fonctionnement de l&apos;application
              (conservation de la session d&apos;authentification).
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              <strong>Site internet :</strong> WeSafe peut utiliser des cookies strictement nécessaires à son
              fonctionnement (session, préférences d&apos;affichage). Aucun cookie publicitaire ou de traçage tiers
              n&apos;est déposé sans consentement préalable, conformément aux recommandations de la CNIL.
            </p>
          </section>

          {/* ── 7. Liens ── */}
          <section id="liens" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              7. Liens hypertextes
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              L&apos;application et le site WeSafe peuvent contenir des liens vers des sites tiers (notamment{" "}
              <em>restcountries.com</em>, <em>geo.api.gouv.fr</em>
              ). Ces liens sont fournis à titre informatif uniquement. <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder>{" "}
              n&apos;assume aucune responsabilité quant au contenu ou aux pratiques en matière de données personnelles
              de ces sites tiers.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Tout lien hypertexte pointant vers le site WeSafe doit faire l&apos;objet d&apos;une autorisation
              préalable écrite de <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder>.
            </p>
          </section>

          {/* ── 8. CNAPS ── */}
          <section id="cnaps" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              8. Secteur de la sécurité privée &amp; CNAPS
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              WeSafe est une plateforme numérique de mise en relation entre des professionnels de la sécurité privée et
              des entreprises du secteur. À ce titre :
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                WeSafe <strong>n&apos;est pas</strong> une entreprise de sécurité privée et ne dispose pas d&apos;une
                autorisation d&apos;exercice délivrée par le CNAPS (Conseil National des Activités Privées de Sécurité).
              </li>
              <li>
                WeSafe <strong>ne sélectionne pas</strong> les candidats pour le compte des entreprises : la décision de
                recrutement appartient exclusivement à l&apos;entreprise utilisatrice.
              </li>
              <li>
                La vérification des cartes professionnelles CNAPS, diplômes (SSIAP, TFP APS, etc.) et autorisations
                réglementaires est effectuée à titre de service d&apos;assistance documentaire et{" "}
                <strong>ne constitue pas</strong> une certification officielle par WeSafe.
              </li>
              <li>
                Les utilisateurs (candidats et entreprises) sont seuls responsables du respect de la réglementation
                applicable au secteur de la sécurité privée (livre VI du Code de la sécurité intérieure, arrêtés CNAPS).
              </li>
            </ul>
          </section>

          {/* ── 9. Responsabilité ── */}
          <section id="responsabilite" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              9. Limitation de responsabilité
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder> s&apos;efforce de maintenir l&apos;application WeSafe
              accessible et fonctionnelle. Toutefois, la responsabilité de l&apos;éditeur ne saurait être engagée en cas
              de :
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Interruption ou indisponibilité du service pour maintenance ou cas de force majeure ;</li>
              <li>Perte ou altération de données résultant d&apos;une défaillance technique ;</li>
              <li>Utilisation frauduleuse ou abusive de la plateforme par des tiers ;</li>
              <li>Inexactitude des informations ou documents fournis par les utilisateurs ;</li>
              <li>Préjudices indirects découlant de l&apos;utilisation du service.</li>
            </ul>
            <p className="mb-4 text-muted-foreground leading-7">
              Les contrats de travail générés par l&apos;application sont des modèles indicatifs. L&apos;éditeur
              recommande aux utilisateurs de consulter un conseil juridique compétent avant toute signature.
            </p>
          </section>

          {/* ── 10. Droit applicable ── */}
          <section id="droit" className="scroll-mt-20">
            <h2 className="mt-8 mb-4 border-border border-b pb-2 font-semibold text-foreground text-xl">
              10. Droit applicable et juridiction compétente
            </h2>
            <p className="mb-4 text-muted-foreground leading-7">
              Les présentes mentions légales sont régies par le droit français. En cas de litige relatif à
              l&apos;interprétation ou à l&apos;exécution des présentes, et à défaut de résolution amiable, les parties
              se soumettent à la compétence exclusive des tribunaux de{" "}
              <strong>
                <Placeholder>[VILLE DU SIÈGE SOCIAL]</Placeholder>
              </strong>
              .
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Pour les litiges avec des consommateurs (particuliers), la juridiction compétente sera déterminée
              conformément aux dispositions du Code de la consommation et, le cas échéant, du règlement (UE) n°
              1215/2012 (Bruxelles I bis).
            </p>
          </section>

          {/* Liens docs légaux */}
          <div className="mt-10 flex flex-wrap gap-3 border-border border-t pt-8">
            <Link
              href="/mentions-legales"
              className="rounded-lg border border-primary bg-primary/5 px-4 py-2 font-medium text-primary text-sm"
            >
              Mentions légales
            </Link>
            <Link
              href="/conditions-generales-d-utilisation"
              className="rounded-lg border border-border px-4 py-2 text-muted-foreground text-sm transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Conditions générales d'utilisation
            </Link>
            <Link
              href="/conditions-generales-de-vente"
              className="rounded-lg border border-border px-4 py-2 text-muted-foreground text-sm transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Conditions générales de vente
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="rounded-lg border border-border px-4 py-2 text-muted-foreground text-sm transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Politique de confidentialité
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
