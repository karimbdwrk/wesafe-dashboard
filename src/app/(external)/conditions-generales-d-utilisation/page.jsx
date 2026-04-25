import Link from "next/link";

import { ArrowLeft } from "lucide-react";

const SECTIONS = [
  { id: "art1", label: "1. Objet" },
  { id: "art2", label: "2. Définitions" },
  { id: "art3", label: "3. Acceptation" },
  { id: "art4", label: "4. Accès & inscription" },
  { id: "art5", label: "5. Description du service" },
  { id: "art6", label: "6. Vérification documentaire" },
  { id: "art7", label: "7. Génération de contrats" },
  { id: "art8", label: "8. Messagerie" },
  { id: "art9", label: "9. Données personnelles" },
  { id: "art10", label: "10. Obligations utilisateurs" },
  { id: "art11", label: "11. Propriété intellectuelle" },
  { id: "art12", label: "12. Disponibilité du service" },
  { id: "art13", label: "13. Responsabilité" },
  { id: "art14", label: "14. Suspension & résiliation" },
  { id: "art15", label: "15. Modification des CGU" },
  { id: "art16", label: "16. Droit applicable" },
];

function Placeholder({ children }) {
  return <mark className="rounded bg-amber-100 px-1 font-semibold text-amber-800 not-italic">{children}</mark>;
}

function SectionTitle({ id, children }) {
  return (
    <h2 id={id} className="mt-8 mb-4 scroll-mt-20 border-border border-b pb-2 font-semibold text-foreground text-xl">
      {children}
    </h2>
  );
}

function SubTitle({ children }) {
  return <h3 className="mt-5 mb-2 font-semibold text-base text-foreground">{children}</h3>;
}

function CardInfo({ children }) {
  return (
    <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800 text-sm">{children}</div>
  );
}

function CardWarn({ children }) {
  return (
    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
      {children}
    </div>
  );
}

function CardRgpd({ children }) {
  return (
    <div className="mb-5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-purple-800 text-sm">
      {children}
    </div>
  );
}

function BadgeCandidat() {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 font-semibold text-blue-700 text-xs">
      Candidat
    </span>
  );
}

function BadgePro() {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-700 text-xs">
      Entreprise
    </span>
  );
}

export default function CGUPage() {
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
            Conditions contractuelles
          </p>
          <h1 className="font-(family-name:--font-heading) mb-3 font-bold text-3xl text-primary-foreground md:text-4xl">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-primary-foreground/70 text-sm">
            Applicables à compter du <strong className="text-primary-foreground">20 avril 2026</strong> — Dernière mise
            à jour : <strong className="text-primary-foreground">20 avril 2026</strong>
          </p>
        </div>
      </section>

      {/* Layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-[220px_1fr]">
        {/* Sommaire sticky */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-border bg-card p-4">
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
          <CardWarn>
            <strong>⚠️ À compléter :</strong> Les éléments{" "}
            <mark className="rounded bg-amber-100 px-1 font-semibold text-amber-800">surlignés en jaune</mark> doivent
            être remplacés par les informations exactes de la société avant publication.
          </CardWarn>

          {/* ── Art. 1 ── */}
          <section id="art1">
            <SectionTitle id="art1">Article 1 – Objet et champ d&apos;application</SectionTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») ont pour objet de définir les
              modalités et conditions d&apos;accès et d&apos;utilisation de la plateforme numérique{" "}
              <strong>WeSafe</strong>, accessible via l&apos;application mobile (iOS et Android) et le site internet{" "}
              <Placeholder>[URL DU SITE]</Placeholder> (ci-après « la Plateforme »), éditée par{" "}
              <strong>
                <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder>
              </strong>
              , <Placeholder>[FORME JURIDIQUE]</Placeholder> au capital de <Placeholder>[MONTANT]</Placeholder> €,
              immatriculée au RCS de <Placeholder>[VILLE]</Placeholder> sous le numéro{" "}
              <Placeholder>[SIRET]</Placeholder>, dont le siège social est situé <Placeholder>[ADRESSE]</Placeholder>{" "}
              (ci-après « l&apos;Éditeur »).
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              WeSafe est une plateforme de{" "}
              <strong>mise en relation entre des professionnels de la sécurité privée</strong> (agents, opérateurs) et
              des <strong>entreprises du secteur de la sécurité privée</strong> (sociétés de sécurité, structures de
              gardiennage, etc.). Elle offre des outils de gestion des candidatures, de vérification de documents
              réglementaires, de génération de contrats de travail et de communication interne.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Tout accès ou utilisation de la Plateforme implique l&apos;acceptation pleine et entière des présentes
              CGU.
            </p>
          </section>

          {/* ── Art. 2 ── */}
          <section id="art2">
            <SectionTitle id="art2">Article 2 – Définitions</SectionTitle>
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="w-40 border-border border-b px-3 py-2.5 text-left font-semibold text-foreground">
                      Terme
                    </th>
                    <th className="border-border border-b px-3 py-2.5 text-left font-semibold text-foreground">
                      Définition
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Plateforme", "L'application mobile WeSafe (iOS/Android) et le site internet associé."],
                    [
                      "Candidat",
                      "Toute personne physique professionnelle de la sécurité privée (agent, opérateur) créant un compte utilisateur de type « Candidat ».",
                    ],
                    [
                      "Entreprise",
                      "Toute personne morale (société de sécurité privée) créant un compte utilisateur de type « Entreprise/Pro ».",
                    ],
                    ["Utilisateur", "Désigne indifféremment un Candidat ou une Entreprise."],
                    [
                      "Compte",
                      "Espace personnel sécurisé créé lors de l'inscription, donnant accès aux fonctionnalités de la Plateforme.",
                    ],
                    ["Annonce", "Offre d'emploi ou de mission publiée par une Entreprise sur la Plateforme."],
                    [
                      "Last Minute",
                      "Annonce d'urgence publiée par une Entreprise avec un délai inférieur à 7 jours, consommant un Crédit.",
                    ],
                    [
                      "Crédit",
                      "Unité virtuelle acquise par une Entreprise permettant de publier des Annonces Last Minute.",
                    ],
                    [
                      "Abonnement",
                      "Formule commerciale souscrite par une Entreprise donnant accès à des fonctionnalités avancées.",
                    ],
                    ["CNAPS", "Conseil National des Activités Privées de Sécurité, autorité de régulation du secteur."],
                    [
                      "Données sensibles",
                      "Données particulières au sens de l'article 9 du RGPD et des articles 86 et suivants de la loi Informatique et Libertés.",
                    ],
                  ].map(([term, def]) => (
                    <tr key={term} className="border-border border-b last:border-0">
                      <td className="px-3 py-2.5 align-top font-medium text-foreground">{term}</td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">{def}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Art. 3 ── */}
          <section id="art3">
            <SectionTitle id="art3">Article 3 – Acceptation des CGU</SectionTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              L&apos;utilisation de la Plateforme est conditionnée à l&apos;acceptation préalable des présentes CGU.
              Cette acceptation est matérialisée lors de l&apos;inscription par la validation de la case à cocher
              dédiée. Elle vaut signature électronique et engagement contractuel.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              L&apos;Éditeur se réserve le droit de modifier les présentes CGU à tout moment. L&apos;Utilisateur sera
              informé de toute modification substantielle par notification in-app ou par email. La poursuite de
              l&apos;utilisation de la Plateforme après notification vaut acceptation des nouvelles CGU.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              En cas de désaccord avec les CGU en vigueur, l&apos;Utilisateur doit cesser d&apos;utiliser la Plateforme
              et peut demander la suppression de son compte.
            </p>
          </section>

          {/* ── Art. 4 ── */}
          <section id="art4">
            <SectionTitle id="art4">Article 4 – Accès et inscription</SectionTitle>
            <SubTitle>4.1 Conditions d&apos;éligibilité</SubTitle>
            <p className="mb-3 text-muted-foreground leading-7">L&apos;accès à la Plateforme est réservé :</p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                <BadgeCandidat />{" "}
                <span className="ml-1">
                  Toute personne physique âgée d&apos;au moins 18 ans, ressortissant d&apos;un État membre de l&apos;UE
                  ou titulaire d&apos;un droit de séjour et de travail en France, exerçant ou souhaitant exercer une
                  activité de sécurité privée réglementée par le CNAPS.
                </span>
              </li>
              <li>
                <BadgePro />{" "}
                <span className="ml-1">
                  Toute personne morale régulièrement immatriculée en France, titulaire d&apos;une autorisation
                  d&apos;exercice CNAPS valide pour les activités relevant des titres I et II du livre VI du Code de la
                  sécurité intérieure.
                </span>
              </li>
            </ul>
            <SubTitle>4.2 Création de compte Candidat</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Lors de l&apos;inscription, le Candidat fournit obligatoirement : adresse e-mail, mot de passe, prénom,
              nom, date de naissance, genre, code postal, ville, commune, département, région, taille et poids (dans le
              cadre des exigences physiques réglementaires du secteur).
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Des informations complémentaires peuvent être renseignées ultérieurement : langues parlées, catégories de
              permis de conduire, photo de profil, expériences professionnelles, cartes professionnelles CNAPS, diplômes
              SSIAP, numéro de sécurité sociale (NIR) et documents d&apos;identité (dans le cadre du processus de
              vérification documentaire — voir Article 6).
            </p>
            <SubTitle>4.3 Création de compte Entreprise</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Lors de l&apos;inscription, l&apos;Entreprise fournit : nom de la société, SIRET (14 chiffres), nom et
              prénom du représentant légal, adresse e-mail professionnelle, mot de passe.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              La vérification de l&apos;existence et de la validité de la société est effectuée via le document KBIS
              transmis lors du processus de vérification (voir Article 6).
            </p>
            <SubTitle>4.4 Sécurité du compte</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Chaque Utilisateur est responsable de la confidentialité de ses identifiants de connexion. En cas de
              suspicion de compromission, il doit immédiatement modifier son mot de passe et notifier l&apos;Éditeur à
              l&apos;adresse{" "}
              <a href="mailto:security@wesafe.fr" className="text-primary underline-offset-2 hover:underline">
                <Placeholder>[security@wesafe.fr]</Placeholder>
              </a>
              . L&apos;Éditeur ne pourra être tenu responsable des conséquences découlant d&apos;une utilisation non
              autorisée du compte d&apos;un Utilisateur.
            </p>
          </section>

          {/* ── Art. 5 ── */}
          <section id="art5">
            <SectionTitle id="art5">Article 5 – Description des services</SectionTitle>
            <SubTitle>5.1 Services accessibles aux Candidats (compte gratuit)</SubTitle>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              {[
                "Création et gestion d'un profil professionnel complet (CV numérique, compétences, certifications)",
                "Consultation des annonces d'emploi publiées par les Entreprises",
                "Candidature aux offres d'emploi et aux missions Last Minute",
                "Messagerie directe avec les Entreprises recrutant",
                "Génération d'une carte professionnelle numérique (ProCard) incluant un QR code de profil",
                "Réception et signature électronique des contrats de travail générés par les Entreprises",
                "Notifications en temps réel (statut des candidatures, messages, vérifications)",
                "Liste de souhaits d'annonces (wishlist)",
              ].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <SubTitle>5.2 Services accessibles aux Entreprises</SubTitle>
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border-border border-b px-3 py-2.5 text-left font-semibold text-foreground">
                      Fonctionnalité
                    </th>
                    <th className="border-border border-b px-3 py-2.5 text-center font-semibold text-foreground">
                      Standard (Gratuit)
                    </th>
                    <th className="border-border border-b px-3 py-2.5 text-center font-semibold text-foreground">
                      Standard+
                    </th>
                    <th className="border-border border-b px-3 py-2.5 text-center font-semibold text-foreground">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Publication d'annonces d'emploi", "✓", "✓ Illimité", "✓ Illimité"],
                    ["Réception de candidatures", "✓", "✓", "✓"],
                    ["Messagerie avec les candidats", "✓", "✓", "✓"],
                    ["Profil entreprise public", "✓", "✓", "✓"],
                    ["Annonces Last Minute (crédits)", "—", "✓", "✓"],
                    ["Statistiques avancées", "—", "✓", "✓"],
                    ["Badge entreprise vérifiée", "—", "✓", "✓"],
                    ["Génération & signature de contrats", "—", "✓", "✓"],
                    ["Mise en avant des annonces", "—", "—", "✓"],
                    ["Support 7j/7 prioritaire", "—", "—", "✓"],
                    ["Dashboard analytique complet", "—", "—", "✓"],
                  ].map(([feat, std, stdp, prem]) => (
                    <tr key={feat} className="border-border border-b last:border-0">
                      <td className="px-3 py-2.5 text-muted-foreground">{feat}</td>
                      <td
                        className={`px-3 py-2.5 text-center font-medium ${std === "—" ? "text-muted-foreground/40" : "text-green-600"}`}
                      >
                        {std}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-center font-medium ${stdp === "—" ? "text-muted-foreground/40" : "text-green-600"}`}
                      >
                        {stdp}
                      </td>
                      <td
                        className={`px-3 py-2.5 text-center font-medium ${prem === "—" ? "text-muted-foreground/40" : "text-green-600"}`}
                      >
                        {prem}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground text-sm">
              Les modalités tarifaires des abonnements et des crédits sont détaillées dans les{" "}
              <Link href="/cgv" className="text-primary underline-offset-2 hover:underline">
                Conditions Générales de Vente
              </Link>
              .
            </p>
          </section>

          {/* ── Art. 6 ── */}
          <section id="art6">
            <SectionTitle id="art6">Article 6 – Vérification documentaire</SectionTitle>
            <SubTitle>6.1 Principe et finalité</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              WeSafe propose un service de vérification documentaire permettant aux Candidats de faire attester la
              conformité de leurs documents professionnels et d&apos;identité, et aux Entreprises de faire vérifier leur
              statut légal. Cette vérification est effectuée manuellement par l&apos;équipe WeSafe selon un processus
              sécurisé.
            </p>
            <SubTitle>6.2 Documents soumis à vérification</SubTitle>
            <p className="mb-2 text-muted-foreground">
              <BadgeCandidat />
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong>Pièce d&apos;identité :</strong> carte nationale d&apos;identité (recto/verso) ou passeport —
                date de validité, nationalité
              </li>
              <li>
                <strong>Numéro de sécurité sociale (NIR) :</strong> 15 chiffres, utilisé pour la vérification
                d&apos;identité réglementaire
              </li>
              <li>
                <strong>Carte vitale ou attestation de sécurité sociale :</strong> photo du document
              </li>
              <li>
                <strong>Carte(s) professionnelle(s) CNAPS :</strong> numéro, catégorie (APS, ADS, SSIAP, etc.), date de
                validité, photo
              </li>
              <li>
                <strong>Diplôme(s) SSIAP</strong> (niveau 1, 2 ou 3)
              </li>
            </ul>
            <p className="mb-2 text-muted-foreground">
              <BadgePro />
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong>Extrait KBIS :</strong> document PDF daté de moins de 3 mois
              </li>
              <li>
                <strong>Tampon d&apos;entreprise :</strong> image traitée par API
              </li>
              <li>
                <strong>Signature du représentant légal :</strong> numérisée pour apposition sur les contrats générés
              </li>
            </ul>
            <SubTitle>6.3 Statuts de vérification</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Tout document soumis suit le cycle : <strong>En attente</strong> → <strong>Vérifié</strong> ou{" "}
              <strong>Refusé</strong>. L&apos;Utilisateur est notifié à chaque changement de statut. En cas de refus, le
              motif est communiqué.
            </p>
            <SubTitle>6.4 Limites de la vérification</SubTitle>
            <CardWarn>
              La vérification documentaire effectuée par WeSafe est un service d&apos;assistance. Elle ne constitue{" "}
              <strong>pas une certification officielle</strong> et ne remplace pas les contrôles réglementaires
              obligatoires imposés par le CNAPS aux employeurs. Chaque Entreprise reste seule responsable de la
              conformité réglementaire de ses recrutements.
            </CardWarn>
            <SubTitle>6.5 Conservation des documents</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Les documents transmis sont conservés dans des espaces de stockage sécurisés et chiffrés (buckets Supabase
              dédiés). La durée de conservation est définie à l&apos;Article 9.5.
            </p>
          </section>

          {/* ── Art. 7 ── */}
          <section id="art7">
            <SectionTitle id="art7">Article 7 – Génération et signature de contrats</SectionTitle>
            <SubTitle>7.1 Contrats générés</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Les Entreprises abonnées (Standard+ et Premium) peuvent générer des contrats de travail directement depuis
              la Plateforme. Les contrats générés sont des <strong>modèles pré-remplis</strong> à partir des données du
              profil du Candidat et des informations saisies par l&apos;Entreprise.
            </p>
            <SubTitle>7.2 Signature électronique</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              La signature électronique est réalisée via la capture d&apos;une signature manuscrite numérisée sur écran
              tactile, complétée par une validation par code OTP envoyé par email ou SMS. Ce processus vise à garantir
              un niveau d&apos;authentification renforcé conformément au Règlement (UE) n° 910/2014 (eIDAS).
            </p>
            <CardInfo>
              La signature électronique utilisée par WeSafe est de type « signature électronique avancée ».
              L&apos;Éditeur recommande aux parties de conserver une copie des contrats signés. WeSafe n&apos;est pas
              responsable de la validité juridique des contrats selon les spécificités de chaque relation de travail.
            </CardInfo>
            <SubTitle>7.3 Conservation des contrats</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Les contrats signés sont stockés dans un bucket sécurisé et accessibles aux deux parties (Candidat et
              Entreprise) depuis leur espace personnel. La durée de conservation est alignée sur les obligations légales
              en matière de droit du travail (5 ans minimum après la fin de la relation contractuelle).
            </p>
          </section>

          {/* ── Art. 8 ── */}
          <section id="art8">
            <SectionTitle id="art8">Article 8 – Messagerie</SectionTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              La Plateforme intègre un service de messagerie temps réel permettant aux Candidats et aux Entreprises de
              communiquer directement. Les messages échangés sont stockés dans la base de données Supabase avec
              chiffrement en transit (TLS 1.3).
            </p>
            <p className="mb-3 text-muted-foreground leading-7">
              L&apos;utilisation de la messagerie est soumise aux règles suivantes :
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                Il est interdit d&apos;envoyer tout contenu illicite, diffamatoire, discriminatoire ou contraire aux
                bonnes mœurs ;
              </li>
              <li>
                Il est interdit de solliciter des informations personnelles sensibles non nécessaires au recrutement ;
              </li>
              <li>
                Il est interdit d&apos;utiliser la messagerie à des fins de démarchage commercial non sollicité (spam) ;
              </li>
              <li>Les messages peuvent être consultés par l&apos;équipe WeSafe en cas de signalement ou de litige.</li>
            </ul>
            <p className="mb-4 text-muted-foreground leading-7">
              Tout manquement à ces règles peut entraîner la suspension immédiate du compte (voir Article 14).
            </p>
          </section>

          {/* ── Art. 9 ── */}
          <section id="art9">
            <SectionTitle id="art9">Article 9 – Données personnelles et RGPD</SectionTitle>

            <SubTitle>9.1 Responsable du traitement</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Le responsable du traitement des données personnelles est :{" "}
              <strong>
                <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder>
              </strong>
              , <Placeholder>[ADRESSE COMPLÈTE]</Placeholder> — Email DPO :{" "}
              <a href="mailto:dpo@wesafe.fr" className="text-primary underline-offset-2 hover:underline">
                <Placeholder>[dpo@wesafe.fr]</Placeholder>
              </a>
            </p>

            <SubTitle>9.2 Données collectées et finalités</SubTitle>
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted">
                    {["Catégorie de données", "Utilisateur concerné", "Finalité", "Base légale (RGPD)"].map((h) => (
                      <th
                        key={h}
                        className="border-border border-b px-3 py-2.5 text-left font-semibold text-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      data: "Email, mot de passe (haché), prénom, nom",
                      users: ["Candidat", "Entreprise"],
                      finalite: "Authentification, identification, communication",
                      base: "Art. 6.1.b – Exécution du contrat",
                    },
                    {
                      data: "Date de naissance, genre, taille, poids",
                      users: ["Candidat"],
                      finalite: "Vérification des conditions physiques réglementaires CNAPS",
                      base: "Art. 6.1.c – Obligation légale",
                    },
                    {
                      data: "Adresse postale (code postal, ville, commune, département, région)",
                      users: ["Candidat"],
                      finalite: "Géolocalisation des missions, mise en relation de proximité",
                      base: "Art. 6.1.b – Exécution du contrat",
                    },
                    {
                      data: "Photo de profil, logo",
                      users: ["Candidat", "Entreprise"],
                      finalite: "Personnalisation du profil public",
                      base: "Art. 6.1.a – Consentement",
                    },
                    {
                      data: "Expériences professionnelles, langues, permis",
                      users: ["Candidat"],
                      finalite: "Construction du CV professionnel, mise en relation",
                      base: "Art. 6.1.b – Exécution du contrat",
                    },
                    {
                      data: "Cartes CNAPS, diplômes SSIAP",
                      users: ["Candidat"],
                      finalite: "Vérification de la qualification professionnelle réglementaire",
                      base: "Art. 6.1.c – Obligation légale + Art. 6.1.b",
                    },
                    {
                      data: "Photo CNI / passeport (recto/verso), nationalité",
                      users: ["Candidat"],
                      finalite: "Vérification d'identité, droits au travail en France",
                      base: "Art. 6.1.c – Obligation légale (L. 8221-5 C. trav.)",
                    },
                    {
                      data: "Numéro de sécurité sociale (NIR)",
                      users: ["Candidat"],
                      finalite: "Identification, établissement des contrats de travail, DSN",
                      base: "Art. 6.1.c – Obligation légale + Autorisation spécifique (art. 87 LIL)",
                      bold: true,
                    },
                    {
                      data: "Photo carte vitale / attestation SS",
                      users: ["Candidat"],
                      finalite: "Vérification de l'affiliation à la sécurité sociale",
                      base: "Art. 6.1.c – Obligation légale",
                    },
                    {
                      data: "Signature manuscrite numérisée",
                      users: ["Candidat", "Entreprise"],
                      finalite: "Signature électronique des contrats de travail",
                      base: "Art. 6.1.b – Exécution du contrat",
                    },
                    {
                      data: "Tampon d'entreprise",
                      users: ["Entreprise"],
                      finalite: "Apposition sur les documents officiels générés",
                      base: "Art. 6.1.b – Exécution du contrat",
                    },
                    {
                      data: "SIRET, KBIS, représentant légal",
                      users: ["Entreprise"],
                      finalite: "Vérification de l'existence légale et de l'autorisation CNAPS",
                      base: "Art. 6.1.c – Obligation légale",
                    },
                    {
                      data: "Données de paiement (référence Stripe)",
                      users: ["Entreprise"],
                      finalite: "Gestion des abonnements, crédits, historique d'achat",
                      base: "Art. 6.1.b – Exécution du contrat",
                    },
                    {
                      data: "Messages échangés, historique de candidatures",
                      users: ["Candidat", "Entreprise"],
                      finalite: "Fonctionnement du service, prévention de la fraude",
                      base: "Art. 6.1.b – Exécution du contrat + Art. 6.1.f – Intérêt légitime",
                    },
                    {
                      data: "Token de notification push, logs d'activité",
                      users: ["Candidat", "Entreprise"],
                      finalite: "Envoi de notifications, sécurité du service",
                      base: "Art. 6.1.b – Exécution du contrat",
                    },
                  ].map((row) => (
                    <tr key={row.data} className="border-border border-b last:border-0">
                      <td
                        className={`px-3 py-2.5 align-top ${row.bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {row.data}
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <div className="flex flex-wrap gap-1">
                          {row.users.map((u) => (u === "Candidat" ? <BadgeCandidat key={u} /> : <BadgePro key={u} />))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">{row.finalite}</td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">{row.base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubTitle>9.3 Données particulièrement sensibles</SubTitle>
            <CardRgpd>
              <strong>Traitement de données sensibles — Information obligatoire :</strong> Conformément au RGPD et à la
              loi Informatique et Libertés, certaines données traitées par WeSafe relèvent de catégories particulières
              ou bénéficient d&apos;une protection renforcée :
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  <strong>Numéro de sécurité sociale (NIR) :</strong> traité sur le fondement de l&apos;article 87 de la
                  loi Informatique et Libertés modifiée, dans le cadre strictement nécessaire à l&apos;établissement de
                  contrats de travail. <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder> s&apos;engage à recueillir le
                  consentement explicite de l&apos;Utilisateur et à mettre en œuvre les mesures techniques appropriées
                  (chiffrement, accès restreint).
                </li>
                <li>
                  <strong>Documents d&apos;identité :</strong> traités sur le fondement d&apos;une obligation légale
                  (vérification du droit au travail) et conservés uniquement le temps nécessaire à la vérification.
                </li>
                <li>
                  <strong>Données relatives à la santé (carte vitale) :</strong> traitées sur le fondement de
                  l&apos;article 9.2.b du RGPD (obligations en matière de droit du travail et de sécurité sociale).
                </li>
                <li>
                  <strong>Signatures numérisées :</strong> utilisées exclusivement pour la signature de documents
                  contractuels ; non exploitées à des fins d&apos;identification biométrique.
                </li>
                <li>
                  <strong>Données physiques (taille, poids) :</strong> collectées au titre des conditions
                  d&apos;aptitude physique définies par le code de la sécurité intérieure pour les agents de sécurité
                  privée.
                </li>
              </ul>
            </CardRgpd>

            <SubTitle>9.4 Sous-traitants et transferts de données</SubTitle>
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted">
                    {["Sous-traitant", "Pays", "Données traitées", "Garanties"].map((h) => (
                      <th
                        key={h}
                        className="border-border border-b px-3 py-2.5 text-left font-semibold text-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Supabase, Inc.",
                      "EU (Allemagne)",
                      "Toutes les données utilisateurs, fichiers, messages",
                      "DPA signé, hébergement EU, clauses contractuelles types",
                    ],
                    [
                      "Stripe, Inc.",
                      "UE / USA",
                      "Données de paiement (CB masquée, référence transaction)",
                      "Certifié PCI-DSS niveau 1, clauses contractuelles types",
                    ],
                    [
                      "Railway Corp.",
                      "USA",
                      "Images de tampons (données non personnelles)",
                      "Contrat de service — données traitées de façon éphémère",
                    ],
                    [
                      "Google LLC (Firebase)",
                      "UE / USA",
                      "Token de notification push (identifiant d'appareil)",
                      "Clauses contractuelles types, Privacy Shield successeur",
                    ],
                  ].map(([st, pays, data, garanties]) => (
                    <tr key={st} className="border-border border-b last:border-0">
                      <td className="px-3 py-2.5 align-top font-medium text-foreground">{st}</td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">{pays}</td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">{data}</td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">{garanties}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mb-4 text-muted-foreground leading-7">
              <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder> s&apos;assure que tout transfert de données hors de
              l&apos;Espace Économique Européen est encadré par des garanties appropriées conformément au chapitre V du
              RGPD (clauses contractuelles types de la Commission européenne ou décisions d&apos;adéquation).
            </p>

            <SubTitle>9.5 Durées de conservation</SubTitle>
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border-border border-b px-3 py-2.5 text-left font-semibold text-foreground">
                      Données
                    </th>
                    <th className="border-border border-b px-3 py-2.5 text-left font-semibold text-foreground">
                      Durée de conservation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Données de compte (profil, email)",
                      "Durée de la relation contractuelle + 3 ans après la clôture du compte",
                    ],
                    [
                      "Documents d'identité (CNI, passeport)",
                      "Durée de la relation + 1 an (obligation art. L. 8221-5 C. trav.)",
                    ],
                    ["NIR", "Durée de la relation contractuelle + 5 ans (prescription sociale)"],
                    ["Cartes CNAPS, diplômes", "Durée de validité du document + 1 an"],
                    [
                      "Contrats de travail signés",
                      "5 ans après la fin du contrat de travail (art. L. 3243-4 C. trav.)",
                    ],
                    ["Données de paiement", "5 ans (prescription commerciale — art. L. 110-4 C. com.)"],
                    ["Messages", "3 ans à compter de leur envoi"],
                    ["Logs techniques / sécurité", "12 mois"],
                    ["Cookies / données de navigation", "13 mois maximum (recommandation CNIL)"],
                  ].map(([d, duree]) => (
                    <tr key={d} className="border-border border-b last:border-0">
                      <td className="px-3 py-2.5 align-top text-muted-foreground">{d}</td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">{duree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubTitle>9.6 Droits des personnes concernées</SubTitle>
            <p className="mb-3 text-muted-foreground leading-7">
              Conformément aux articles 15 à 22 du RGPD, tout Utilisateur bénéficie des droits suivants :
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong>Droit d&apos;accès :</strong> obtenir confirmation du traitement et une copie des données
              </li>
              <li>
                <strong>Droit de rectification :</strong> faire corriger des données inexactes ou incomplètes
              </li>
              <li>
                <strong>Droit à l&apos;effacement (« droit à l&apos;oubli ») :</strong> demander la suppression des
                données, sous réserve d&apos;obligations légales de conservation
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> recevoir ses données dans un format structuré et lisible par
                machine
              </li>
              <li>
                <strong>Droit d&apos;opposition :</strong> s&apos;opposer au traitement fondé sur l&apos;intérêt
                légitime
              </li>
              <li>
                <strong>Droit à la limitation :</strong> demander la suspension provisoire d&apos;un traitement
              </li>
              <li>
                <strong>Droit de ne pas faire l&apos;objet d&apos;une décision automatisée</strong> (article 22 RGPD)
              </li>
              <li>
                <strong>Droit de retrait du consentement</strong> à tout moment pour les traitements fondés sur le
                consentement
              </li>
            </ul>
            <p className="mb-4 text-muted-foreground leading-7">
              Pour exercer ces droits, contacter :{" "}
              <a href="mailto:dpo@wesafe.fr" className="text-primary underline-offset-2 hover:underline">
                <Placeholder>[dpo@wesafe.fr]</Placeholder>
              </a>{" "}
              ou <Placeholder>[NOM DE LA SOCIÉTÉ] — [ADRESSE POSTALE]</Placeholder> en joignant une copie d&apos;une
              pièce d&apos;identité. WeSafe s&apos;engage à répondre dans un délai maximum d&apos;
              <strong>un mois</strong> à compter de la réception de la demande.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              En cas de réponse insatisfaisante, l&apos;Utilisateur peut saisir la <strong>CNIL</strong> (
              <a
                href="https://www.cnil.fr/fr/plaintes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                www.cnil.fr/fr/plaintes
              </a>
              ).
            </p>

            <SubTitle>9.7 Sécurité des données</SubTitle>
            <p className="mb-3 text-muted-foreground leading-7">
              <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder> met en œuvre les mesures techniques et organisationnelles
              appropriées pour protéger les données personnelles contre tout accès non autorisé, perte accidentelle,
              altération ou divulgation, notamment :
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Chiffrement des données en transit (TLS 1.3) et au repos (AES-256)</li>
              <li>Authentification sécurisée (JWT, expo-secure-store pour les tokens)</li>
              <li>Contrôle d&apos;accès aux données (Row Level Security Supabase)</li>
              <li>Stockage des documents sensibles dans des buckets isolés avec accès restreint</li>
              <li>Mots de passe stockés sous forme hachée (bcrypt via Supabase Auth)</li>
              <li>Journalisation des accès et détection d&apos;anomalies</li>
            </ul>
          </section>

          {/* ── Art. 10 ── */}
          <section id="art10">
            <SectionTitle id="art10">Article 10 – Obligations et interdictions des Utilisateurs</SectionTitle>
            <SubTitle>10.1 Obligations générales</SubTitle>
            <p className="mb-3 text-muted-foreground leading-7">Tout Utilisateur s&apos;engage à :</p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                Fournir des informations exactes, complètes et à jour lors de l&apos;inscription et tout au long de
                l&apos;utilisation ;
              </li>
              <li>
                Utiliser la Plateforme conformément à sa destination professionnelle exclusive (secteur sécurité privée)
                ;
              </li>
              <li>Respecter les droits des tiers et notamment la réglementation CNAPS ;</li>
              <li>
                Ne pas publier de contenus faux, trompeurs ou portant atteinte à des droits de propriété intellectuelle
                ;
              </li>
              <li>
                Signaler tout dysfonctionnement ou comportement frauduleux à l&apos;adresse{" "}
                <a href="mailto:support@wesafe.fr" className="text-primary underline-offset-2 hover:underline">
                  <Placeholder>[support@wesafe.fr]</Placeholder>
                </a>
                .
              </li>
            </ul>
            <SubTitle>10.2 Interdictions spécifiques</SubTitle>
            <p className="mb-3 text-muted-foreground leading-7">Il est strictement interdit :</p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                De créer de faux profils ou de falsifier des documents (cartes CNAPS, pièces d&apos;identité, diplômes)
                ;
              </li>
              <li>
                D&apos;utiliser la Plateforme pour des activités illicites, discriminatoires ou contraires à
                l&apos;ordre public ;
              </li>
              <li>De collecter des données personnelles d&apos;autres Utilisateurs à des fins non autorisées ;</li>
              <li>
                De tenter de porter atteinte à l&apos;intégrité ou à la sécurité de la Plateforme (reverse engineering,
                injection de code, tentatives d&apos;intrusion) ;
              </li>
              <li>De revendre ou céder l&apos;accès à son compte à un tiers ;</li>
              <li>
                De publier des annonces discriminatoires ou illégales au regard du droit du travail et de la loi du 27
                mai 2008 relative aux discriminations à l&apos;embauche.
              </li>
            </ul>
          </section>

          {/* ── Art. 11 ── */}
          <section id="art11">
            <SectionTitle id="art11">Article 11 – Propriété intellectuelle</SectionTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Tous les éléments de la Plateforme (logiciel, code, interfaces, logos, marque « WeSafe ») sont la
              propriété exclusive de <Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder> et protégés par le Code de la
              propriété intellectuelle. Toute reproduction ou exploitation sans autorisation écrite préalable est
              interdite.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Les contenus générés par les Utilisateurs (profils, CV, photos) restent leur propriété. En les déposant
              sur WeSafe, ils accordent à l&apos;Éditeur une licence non exclusive, gratuite et mondiale aux seules fins
              de fourniture du service.
            </p>
          </section>

          {/* ── Art. 12 ── */}
          <section id="art12">
            <SectionTitle id="art12">Article 12 – Disponibilité du service</SectionTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              L&apos;Éditeur s&apos;efforce d&apos;assurer une disponibilité de la Plateforme 24h/24 et 7j/7. Toutefois,
              des interruptions pour maintenance, mises à jour ou incidents techniques peuvent survenir. L&apos;Éditeur
              s&apos;engage à informer les Utilisateurs, dans la mesure du possible, des interruptions planifiées au
              moins 48 heures à l&apos;avance.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Aucune garantie de disponibilité continue n&apos;est fournie au titre des formules gratuites. Un SLA (
              <em>Service Level Agreement</em>) peut être convenu dans le cadre de formules commerciales spécifiques.
            </p>
          </section>

          {/* ── Art. 13 ── */}
          <section id="art13">
            <SectionTitle id="art13">Article 13 – Responsabilité</SectionTitle>
            <p className="mb-3 text-muted-foreground leading-7">
              WeSafe est un intermédiaire technique de mise en relation. À ce titre, l&apos;Éditeur n&apos;est pas
              partie aux contrats de travail conclus entre les Candidats et les Entreprises, et ne saurait être tenu
              responsable :
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>De l&apos;inexactitude des informations ou documents fournis par les Utilisateurs ;</li>
              <li>Des décisions de recrutement ou de refus d&apos;embauche ;</li>
              <li>De la non-conformité réglementaire des agents recrutés par les Entreprises ;</li>
              <li>
                De tout préjudice indirect résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser la
                Plateforme ;
              </li>
              <li>Des actes ou omissions des Utilisateurs contraires aux présentes CGU.</li>
            </ul>
            <p className="mb-4 text-muted-foreground leading-7">
              La responsabilité de l&apos;Éditeur au titre de la Plateforme est en tout état de cause limitée aux
              dommages directs prouvés et plafonnée aux sommes effectivement versées par l&apos;Utilisateur concerné au
              cours des 12 mois précédant le fait générateur du dommage.
            </p>
          </section>

          {/* ── Art. 14 ── */}
          <section id="art14">
            <SectionTitle id="art14">Article 14 – Suspension et résiliation du compte</SectionTitle>
            <SubTitle>14.1 Résiliation à l&apos;initiative de l&apos;Utilisateur</SubTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Tout Utilisateur peut clôturer son compte à tout moment depuis les paramètres de l&apos;application ou en
              envoyant une demande écrite à{" "}
              <a href="mailto:support@wesafe.fr" className="text-primary underline-offset-2 hover:underline">
                <Placeholder>[support@wesafe.fr]</Placeholder>
              </a>
              . La clôture entraîne la suppression du profil public. Les données sont conservées selon les durées
              légales définies à l&apos;Article 9.5.
            </p>
            <SubTitle>14.2 Suspension ou résiliation par l&apos;Éditeur</SubTitle>
            <p className="mb-3 text-muted-foreground leading-7">
              L&apos;Éditeur se réserve le droit de suspendre ou de résilier un compte, avec ou sans préavis, en cas de
              :
            </p>
            <ul className="mb-4 ml-4 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Violation des présentes CGU ;</li>
              <li>Fourniture d&apos;informations ou documents falsifiés ;</li>
              <li>Activité frauduleuse ou illicite constatée ;</li>
              <li>Non-paiement des sommes dues (pour les formules payantes).</li>
            </ul>
            <p className="mb-4 text-muted-foreground leading-7">
              En cas de suspension pour motif grave (fraude documentaire, falsification de carte CNAPS), l&apos;Éditeur
              se réserve le droit de signaler les faits aux autorités compétentes (CNAPS, PHAROS).
            </p>
          </section>

          {/* ── Art. 15 ── */}
          <section id="art15">
            <SectionTitle id="art15">Article 15 – Modification des CGU</SectionTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              L&apos;Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les Utilisateurs seront
              informés des modifications substantielles par notification in-app et/ou par email au moins{" "}
              <strong>30 jours avant</strong> leur entrée en vigueur. La poursuite de l&apos;utilisation après ce délai
              vaut acceptation des nouvelles conditions.
            </p>
          </section>

          {/* ── Art. 16 ── */}
          <section id="art16">
            <SectionTitle id="art16">Article 16 – Droit applicable et règlement des litiges</SectionTitle>
            <p className="mb-4 text-muted-foreground leading-7">
              Les présentes CGU sont soumises au droit français. En cas de litige, les parties s&apos;engagent à
              rechercher une solution amiable. À défaut d&apos;accord dans un délai de 30 jours, le litige sera soumis à
              la compétence des tribunaux de{" "}
              <strong>
                <Placeholder>[VILLE DU SIÈGE]</Placeholder>
              </strong>
              .
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              Conformément aux articles L. 611-1 et suivants du Code de la consommation, les consommateurs (personnes
              physiques) ont la faculté de recourir à un médiateur de la consommation. L&apos;entité de médiation
              compétente est :{" "}
              <Placeholder>[NOM DU MÉDIATEUR CHOISI, ex : Médiateur du e-commerce de la FEVAD]</Placeholder> —{" "}
              <Placeholder>[URL]</Placeholder>.
            </p>
            <p className="mb-4 text-muted-foreground leading-7">
              La Commission Européenne met à disposition une plateforme de règlement en ligne des litiges :{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
          </section>

          {/* Liens docs légaux */}
          <div className="mt-10 flex flex-wrap gap-3 border-border border-t pt-8">
            <Link
              href="/mentions-legales"
              className="rounded-lg border border-border px-4 py-2 text-muted-foreground text-sm transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Mentions légales
            </Link>
            <Link
              href="/conditions-generales-d-utilisation"
              className="rounded-lg border border-primary bg-primary/5 px-4 py-2 font-medium text-primary text-sm"
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
