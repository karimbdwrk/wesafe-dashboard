import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SECTIONS = [
	{ id: "art1", label: "1. Objet & champ d'application" },
	{ id: "art2", label: "2. Produits & services" },
	{ id: "art3", label: "3. Prix & TVA" },
	{ id: "art4", label: "4. Commande & conclusion" },
	{ id: "art5", label: "5. Paiement (Stripe)" },
	{ id: "art6", label: "6. Facturation" },
	{ id: "art7", label: "7. Livraison du service" },
	{ id: "art8", label: "8. Droit de rétractation" },
	{ id: "art9", label: "9. Résiliation abonnements" },
	{ id: "art10", label: "10. Remboursements" },
	{ id: "art11", label: "11. Modification des tarifs" },
	{ id: "art12", label: "12. Garanties & responsabilité" },
	{ id: "art13", label: "13. Données personnelles" },
	{ id: "art14", label: "14. Droit applicable" },
];

function Placeholder({ children }) {
	return (
		<mark className='bg-amber-100 text-amber-800 font-semibold px-1 rounded not-italic'>
			{children}
		</mark>
	);
}

function SectionTitle({ id, children }) {
	return (
		<h2
			id={id}
			className='text-xl font-semibold text-foreground mt-8 mb-4 pb-2 border-b border-border scroll-mt-20'>
			{children}
		</h2>
	);
}

function SubTitle({ children }) {
	return (
		<h3 className='text-base font-semibold text-foreground mt-5 mb-2'>
			{children}
		</h3>
	);
}

function CardInfo({ children }) {
	return (
		<div className='rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 mb-5'>
			{children}
		</div>
	);
}

function CardWarn({ children }) {
	return (
		<div className='rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-5'>
			{children}
		</div>
	);
}

function CardGreen({ children }) {
	return (
		<div className='rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 mb-5'>
			{children}
		</div>
	);
}

export default function CGVPage() {
	return (
		<div className='min-h-screen bg-background'>
			{/* Hero */}
			<section className='border-b border-border bg-primary py-16 mt-14'>
				<div className='mx-auto max-w-6xl px-6'>
					<Link
						href='/'
						className='inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6 transition-colors'>
						<ArrowLeft className='h-4 w-4' />
						Retour à l&apos;accueil
					</Link>
					<p className='text-primary-foreground/60 text-sm font-medium uppercase tracking-widest mb-2'>
						Conditions commerciales
					</p>
					<h1 className='font-(family-name:--font-heading) text-3xl font-bold text-primary-foreground md:text-4xl mb-3'>
						Conditions Générales de Vente
					</h1>
					<p className='text-primary-foreground/70 text-sm'>
						Applicables à compter du{" "}
						<strong className='text-primary-foreground'>
							20 avril 2026
						</strong>{" "}
						— Dernière mise à jour :{" "}
						<strong className='text-primary-foreground'>
							20 avril 2026
						</strong>
					</p>
				</div>
			</section>

			{/* Layout */}
			<div className='mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12'>
				{/* Sommaire sticky */}
				<aside className='hidden lg:block'>
					<div className='sticky top-20 rounded-xl border border-border bg-card p-4 max-h-[calc(100vh-6rem)] overflow-y-auto'>
						<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
							Sommaire
						</p>
						<nav className='space-y-0.5 text-sm'>
							{SECTIONS.map((s) => (
								<a
									key={s.id}
									href={`#${s.id}`}
									className='block px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
									{s.label}
								</a>
							))}
						</nav>
					</div>
				</aside>

				{/* Contenu principal */}
				<main className='rounded-xl border border-border bg-card p-8 min-w-0 space-y-2'>
					<CardWarn>
						<strong>⚠️ À compléter :</strong> Les éléments{" "}
						<mark className='bg-amber-100 text-amber-800 font-semibold px-1 rounded'>
							surlignés en jaune
						</mark>{" "}
						doivent être remplacés par les informations exactes
						avant publication. Les tarifs indiqués sont susceptibles
						d&apos;évoluer conformément à l&apos;Article 11.
					</CardWarn>

					{/* ── Art. 1 ── */}
					<section id='art1'>
						<SectionTitle id='art1'>
							Article 1 – Objet et champ d&apos;application
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les présentes Conditions Générales de Vente
							(ci-après « CGV ») régissent exclusivement les
							relations commerciales entre{" "}
							<strong>
								<Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder>
							</strong>{" "}
							(ci-après « WeSafe » ou « l&apos;Éditeur »),{" "}
							<Placeholder>[FORME JURIDIQUE]</Placeholder> au
							capital de <Placeholder>[MONTANT]</Placeholder> €,
							immatriculée sous le SIRET{" "}
							<Placeholder>[SIRET]</Placeholder>, siège social :{" "}
							<Placeholder>[ADRESSE]</Placeholder>, et toute
							personne morale ou physique (ci-après « le Client »)
							souscrivant à un ou plusieurs des services payants
							proposés via la Plateforme WeSafe.
						</p>
						<CardInfo>
							<strong>Public cible des CGV :</strong> Les produits
							commerciaux de WeSafe (abonnements, crédits,
							sponsoring) sont destinés{" "}
							<strong>exclusivement aux Entreprises</strong>{" "}
							(personnes morales). L&apos;accès à
							l&apos;application pour les Candidats (agents de
							sécurité) est entièrement gratuit.
						</CardInfo>
						<p className='text-muted-foreground leading-7 mb-4'>
							Toute commande de service payant implique
							l&apos;acceptation pleine et entière des présentes
							CGV, qui prévalent sur tout document émanant du
							Client. Les CGV sont accessibles en permanence sur
							la Plateforme et envoyées par email lors de chaque
							commande.
						</p>
					</section>

					{/* ── Art. 2 ── */}
					<section id='art2'>
						<SectionTitle id='art2'>
							Article 2 – Produits et services commercialisés
						</SectionTitle>

						<SubTitle>2.1 Abonnements Entreprises</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe propose aux Entreprises trois formules
							d&apos;abonnement :
						</p>

						{/* Pricing cards */}
						<div className='grid gap-4 sm:grid-cols-3 my-6'>
							{/* Standard */}
							<div className='rounded-xl border border-border p-5 flex flex-col gap-3'>
								<span className='self-start rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-muted-foreground'>
									Standard
								</span>
								<div>
									<span className='text-3xl font-bold text-foreground'>
										0 €
									</span>
									<span className='text-sm text-muted-foreground'>
										/mois
									</span>
								</div>
								<p className='text-xs text-muted-foreground'>
									Accès de base, sans engagement
								</p>
								<ul className='space-y-1 text-sm text-muted-foreground'>
									{[
										"Publications d'annonces",
										"Réception de candidatures",
										"Messagerie",
										"Profil entreprise public",
									].map((f) => (
										<li
											key={f}
											className='flex items-center gap-1.5'>
											<span className='text-primary font-bold text-xs'>
												✓
											</span>
											{f}
										</li>
									))}
								</ul>
							</div>

							{/* Standard+ */}
							<div className='rounded-xl border-2 border-primary p-5 flex flex-col gap-3'>
								<span className='self-start rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-primary-foreground'>
									Standard+
								</span>
								<div>
									<span className='text-3xl font-bold text-foreground'>
										19 €
									</span>
									<span className='text-sm text-muted-foreground'>
										/mois TTC
									</span>
								</div>
								<p className='text-xs text-muted-foreground'>
									ou <strong>199 € TTC/an</strong> (−13 %)
								</p>
								<ul className='space-y-1 text-sm text-muted-foreground'>
									{[
										"Tout le Standard",
										"Annonces Last Minute",
										"Publications illimitées",
										"Statistiques avancées",
										"Badge entreprise vérifiée",
										"Génération de contrats",
									].map((f) => (
										<li
											key={f}
											className='flex items-center gap-1.5'>
											<span className='text-primary font-bold text-xs'>
												✓
											</span>
											{f}
										</li>
									))}
								</ul>
							</div>

							{/* Premium */}
							<div className='rounded-xl border border-border p-5 flex flex-col gap-3'>
								<span className='self-start rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-muted-foreground'>
									Premium
								</span>
								<div>
									<span className='text-3xl font-bold text-foreground'>
										25 €
									</span>
									<span className='text-sm text-muted-foreground'>
										/mois TTC
									</span>
								</div>
								<p className='text-xs text-muted-foreground'>
									ou <strong>249 € TTC/an</strong> (−17 %)
								</p>
								<ul className='space-y-1 text-sm text-muted-foreground'>
									{[
										"Tout le Standard+",
										"Mise en avant des annonces",
										"Dashboard analytique complet",
										"Support prioritaire 7j/7",
										"Accès API WeSafe",
									].map((f) => (
										<li
											key={f}
											className='flex items-center gap-1.5'>
											<span className='text-primary font-bold text-xs'>
												✓
											</span>
											{f}
										</li>
									))}
								</ul>
							</div>
						</div>

						<SubTitle>2.2 Pack de crédits « Last Minute »</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les crédits Last Minute permettent aux Entreprises
							(formules Standard+ et Premium) de publier des
							annonces urgentes avec un délai de mission inférieur
							à 7 jours. Un crédit est consommé à chaque
							publication d&apos;une annonce Last Minute.
						</p>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Pack",
											"Quantité",
											"Prix TTC",
											"Prix unitaire",
											"Validité",
										].map((h) => (
											<th
												key={h}
												className='px-3 py-2.5 text-left font-semibold text-foreground border-b border-border'>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className='px-3 py-2.5 border-b border-border font-medium text-foreground'>
											Pack Last Minute
										</td>
										<td className='px-3 py-2.5 border-b border-border text-muted-foreground'>
											10 crédits
										</td>
										<td className='px-3 py-2.5 border-b border-border font-semibold text-foreground'>
											30,00 € TTC
										</td>
										<td className='px-3 py-2.5 border-b border-border text-muted-foreground'>
											3,00 € / crédit
										</td>
										<td className='px-3 py-2.5 border-b border-border text-muted-foreground'>
											12 mois à compter de l&apos;achat
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<CardInfo>
							Les crédits non utilisés à l&apos;expiration de leur
							période de validité sont{" "}
							<strong>perdus sans remboursement</strong>. Les
							crédits sont attachés au compte Entreprise et non
							transférables.
						</CardInfo>

						<SubTitle>
							2.3 Sponsoring d&apos;annonces (boost de visibilité)
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							L&apos;option de sponsoring permet à une Entreprise
							de mettre en avant une annonce spécifique dans les
							résultats de recherche et en page d&apos;accueil de
							la Plateforme, afin d&apos;augmenter sa visibilité
							auprès des Candidats.
						</p>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Durée de sponsoring",
											"Prix TTC",
											"Description",
										].map((h) => (
											<th
												key={h}
												className='px-3 py-2.5 text-left font-semibold text-foreground border-b border-border'>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{[
										[
											"1 semaine",
											"9,99 €",
											"Mise en avant pendant 7 jours calendaires",
										],
										[
											"2 semaines",
											"17,99 €",
											"Mise en avant pendant 14 jours calendaires",
										],
										[
											"1 mois",
											"29,99 €",
											"Mise en avant pendant 30 jours calendaires",
										],
									].map(([dur, prix, desc]) => (
										<tr
											key={dur}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 font-medium text-foreground'>
												{dur}
											</td>
											<td className='px-3 py-2.5 font-semibold text-foreground'>
												{prix}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground'>
												{desc}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className='text-muted-foreground leading-7 mb-4'>
							Le sponsoring prend effet dès la validation du
							paiement. La durée commence à courir à compter de la
							date d&apos;activation effective. L&apos;annonce
							sponsorisée doit être conforme aux CGU de la
							Plateforme ; tout manquement peut entraîner la
							suspension du sponsoring sans remboursement.
						</p>
					</section>

					{/* ── Art. 3 ── */}
					<section id='art3'>
						<SectionTitle id='art3'>
							Article 3 – Prix et TVA
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Tous les prix affichés sur la Plateforme sont
							indiqués en{" "}
							<strong>
								euros (€) toutes taxes comprises (TTC)
							</strong>
							, incluant la TVA au taux légal en vigueur en France
							(actuellement <strong>20 %</strong> pour les
							services numériques).
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							La décomposition HT / TVA apparaît sur chaque
							facture émise par WeSafe. Les Entreprises soumises à
							la TVA peuvent déduire la TVA facturée dans les
							conditions du droit commun.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe se réserve le droit de modifier ses tarifs à
							tout moment. Toute modification est notifiée au
							Client selon les modalités de l&apos;Article 11.
						</p>
					</section>

					{/* ── Art. 4 ── */}
					<section id='art4'>
						<SectionTitle id='art4'>
							Article 4 – Commande et conclusion du contrat
						</SectionTitle>
						<SubTitle>4.1 Processus de commande</SubTitle>
						<p className='text-muted-foreground leading-7 mb-3'>
							La commande se déroule intégralement depuis
							l&apos;application mobile WeSafe :
						</p>
						<ol className='list-decimal list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								Sélection de la formule ou du produit souhaité
								(abonnement, crédit ou sponsoring)
							</li>
							<li>
								Récapitulatif de commande avec affichage du prix
								TTC et des conditions applicables
							</li>
							<li>
								Saisie des informations de paiement via
								l&apos;interface sécurisée Stripe
							</li>
							<li>
								Confirmation de commande par la validation du
								paiement
							</li>
							<li>
								Envoi immédiat d&apos;un email de confirmation
								avec récapitulatif et facture
							</li>
						</ol>
						<SubTitle>4.2 Conclusion du contrat</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Le contrat de vente est réputé conclu à la date de
							confirmation du paiement par Stripe et de réception
							de l&apos;email de confirmation par le Client.
							L&apos;Éditeur se réserve le droit de refuser toute
							commande pour motif légitime (compte suspendu,
							fraude suspectée, etc.).
						</p>
					</section>

					{/* ── Art. 5 ── */}
					<section id='art5'>
						<SectionTitle id='art5'>
							Article 5 – Modalités de paiement
						</SectionTitle>
						<SubTitle>5.1 Prestataire de paiement</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les paiements sont traités par{" "}
							<strong>Stripe, Inc.</strong> (510 Townsend Street,
							San Francisco, CA 94103, États-Unis), prestataire de
							services de paiement certifié PCI-DSS niveau 1.
							WeSafe ne stocke jamais les données bancaires
							complètes du Client sur ses propres serveurs ; ces
							données sont exclusivement gérées par Stripe.
						</p>
						<SubTitle>5.2 Moyens de paiement acceptés</SubTitle>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								Carte bancaire (Visa, Mastercard, American
								Express)
							</li>
							<li>Apple Pay (iOS)</li>
							<li>Google Pay (Android)</li>
						</ul>
						<SubTitle>
							5.3 Abonnements — prélèvement automatique
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-3'>
							Lors de la souscription à un abonnement, le Client
							autorise Stripe à effectuer des prélèvements
							automatiques aux échéances suivantes :
						</p>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								<strong>Formule mensuelle :</strong> prélèvement
								le même jour de chaque mois
							</li>
							<li>
								<strong>Formule annuelle :</strong> prélèvement
								unique le jour de la souscription, puis à
								l&apos;anniversaire
							</li>
						</ul>
						<p className='text-muted-foreground leading-7 mb-4'>
							En cas d&apos;échec de prélèvement, Stripe effectue
							des relances automatiques (3 tentatives sur 7
							jours). Après échec définitif, l&apos;abonnement est
							automatiquement suspendu et le Client est notifié
							par email.
						</p>
						<SubTitle>5.4 Sécurité des paiements</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Toutes les transactions sont sécurisées par le
							protocole TLS et le système d&apos;authentification
							forte des paiements (3D Secure v2) conformément à la
							DSP2 (Directive 2015/2366/UE).
						</p>
					</section>

					{/* ── Art. 6 ── */}
					<section id='art6'>
						<SectionTitle id='art6'>
							Article 6 – Facturation
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Une <strong>facture électronique</strong> est
							générée automatiquement et envoyée à l&apos;adresse
							email du compte Client immédiatement après chaque
							paiement. Les factures sont également accessibles
							depuis l&apos;espace « Mon compte » de
							l&apos;application.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les factures mentionnent : date de transaction,
							désignation du service, prix HT, TVA applicable (20
							%), prix TTC, numéro de TVA intracommunautaire de
							WeSafe, ainsi que les informations légales de la
							société.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Le Client est responsable de la mise à jour de ses
							informations de facturation (raison sociale,
							adresse, numéro de TVA) depuis les paramètres de son
							compte.
						</p>
					</section>

					{/* ── Art. 7 ── */}
					<section id='art7'>
						<SectionTitle id='art7'>
							Article 7 – Livraison du service
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les services WeSafe étant des services numériques
							dématérialisés, leur « livraison » s&apos;entend
							comme l&apos;activation effective des
							fonctionnalités souscrites sur le compte du Client.
						</p>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								<strong>Abonnements :</strong> activation
								immédiate après confirmation du paiement (en
								principe dans les 5 minutes)
							</li>
							<li>
								<strong>Crédits Last Minute :</strong> crédits
								crédités sur le compte dans les 5 minutes
								suivant le paiement
							</li>
							<li>
								<strong>Sponsoring :</strong> activation dans un
								délai maximum de 2 heures ouvrées suivant la
								confirmation du paiement
							</li>
						</ul>
						<p className='text-muted-foreground leading-7 mb-4'>
							En cas de délai d&apos;activation supérieur, le
							Client peut contacter le support WeSafe à{" "}
							<a
								href='mailto:support@wesafe.fr'
								className='text-primary hover:underline underline-offset-2'>
								<Placeholder>[support@wesafe.fr]</Placeholder>
							</a>
							.
						</p>
					</section>

					{/* ── Art. 8 ── */}
					<section id='art8'>
						<SectionTitle id='art8'>
							Article 8 – Droit de rétractation
						</SectionTitle>
						<SubTitle>
							8.1 Exclusion du droit de rétractation — Entreprises
							(B2B)
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Conformément à l&apos;article L. 221-3 du Code de la
							consommation, le droit de rétractation prévu aux
							articles L. 221-18 et suivants du même Code{" "}
							<strong>ne s&apos;applique pas</strong> aux contrats
							conclus entre professionnels dans le cadre de leur
							activité principale. Les Entreprises clientes de
							WeSafe agissant en tant que professionnels ne
							bénéficient donc d&apos;
							<strong>aucun droit légal de rétractation</strong>.
						</p>
						<SubTitle>
							8.2 Droit de rétractation — Personnes physiques
							consommateurs
						</SubTitle>
						<CardGreen>
							Dans le cas exceptionnel où un consommateur
							(personne physique n&apos;agissant pas dans le cadre
							de son activité professionnelle) souscrirait à un
							service payant, celui-ci bénéficierait d&apos;un
							droit de rétractation de{" "}
							<strong>14 jours calendaires</strong> à compter de
							la date de souscription (article L. 221-18 C.
							conso.).
						</CardGreen>
						<p className='text-muted-foreground leading-7 mb-4'>
							Toutefois, conformément à l&apos;article L. 221-28
							12° du Code de la consommation,{" "}
							<strong>le droit de rétractation est exclu</strong>{" "}
							pour les contenus numériques dont l&apos;exécution a
							commencé avec l&apos;accord préalable et exprès du
							Client, qui a reconnu perdre son droit de
							rétractation. Cette reconnaissance est recueillie
							lors du processus de commande par une case à cocher
							dédiée.
						</p>
						<SubTitle>8.3 Formulaire de rétractation</SubTitle>
						<p className='text-muted-foreground leading-7 mb-3'>
							Pour les cas où le droit de rétractation serait
							applicable, le Client peut notifier sa décision à{" "}
							<a
								href='mailto:retractation@wesafe.fr'
								className='text-primary hover:underline underline-offset-2'>
								<Placeholder>
									[retractation@wesafe.fr]
								</Placeholder>
							</a>{" "}
							:
						</p>
						<div className='rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground font-mono leading-relaxed my-4 whitespace-pre-line'>
							{`À l'attention de [NOM DE LA SOCIÉTÉ], [ADRESSE]

Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la prestation de service suivante :
Commandée le (*) / reçue le (*) : ___________
Nom du consommateur : ___________
Adresse du consommateur : ___________
Signature du consommateur (uniquement en cas de notification sur papier) : ___________
Date : ___________

(*) Rayez la mention inutile.`}
						</div>
					</section>

					{/* ── Art. 9 ── */}
					<section id='art9'>
						<SectionTitle id='art9'>
							Article 9 – Résiliation des abonnements
						</SectionTitle>
						<SubTitle>9.1 Résiliation mensuelle</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les abonnements mensuels peuvent être résiliés à
							tout moment depuis les paramètres de
							l&apos;application (section « Mon abonnement » → «
							Annuler »). La résiliation prend effet à la{" "}
							<strong>fin de la période en cours</strong> déjà
							facturée. Aucun remboursement au prorata n&apos;est
							effectué pour le mois en cours.
						</p>
						<SubTitle>9.2 Résiliation annuelle</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les abonnements annuels sont souscrits pour une
							période ferme de 12 mois. Le Client peut résilier à
							tout moment, mais la résiliation ne prendra effet
							qu&apos;à l&apos;échéance annuelle. Aucun
							remboursement des mois restants n&apos;est effectué,
							sauf cas prévus à l&apos;Article 10.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Le Client recevra un email de rappel 30 jours avant
							le renouvellement automatique de son abonnement
							annuel.
						</p>
						<SubTitle>9.3 Résiliation par WeSafe</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe se réserve le droit de résilier un abonnement
							avec effet immédiat en cas de violation des CGU
							(fraude, falsification de documents, non-paiement
							persistant), sans préjudice des sommes dues.
						</p>
						<SubTitle>9.4 Effets de la résiliation</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							À la date d&apos;effet de la résiliation : toutes
							les fonctionnalités de la formule souscrite sont
							désactivées ; les crédits Last Minute non utilisés
							sont <strong>définitivement perdus</strong> ; les
							données de l&apos;Entreprise restent accessibles en
							lecture seule pendant une période transitoire de 30
							jours.
						</p>
					</section>

					{/* ── Art. 10 ── */}
					<section id='art10'>
						<SectionTitle id='art10'>
							Article 10 – Remboursements
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							En règle générale, WeSafe n&apos;effectue pas de
							remboursement des sommes versées. Par exception, un
							remboursement peut être accordé dans les cas
							suivants :
						</p>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										<th className='px-3 py-2.5 text-left font-semibold text-foreground border-b border-border'>
											Cas
										</th>
										<th className='px-3 py-2.5 text-left font-semibold text-foreground border-b border-border'>
											Traitement
										</th>
									</tr>
								</thead>
								<tbody>
									{[
										[
											"Double facturation avérée (erreur technique Stripe)",
											"Remboursement intégral du doublon dans un délai de 5 à 10 jours ouvrés",
										],
										[
											"Indisponibilité majeure du service (> 72h consécutives, hors maintenance planifiée)",
											"Remboursement au prorata de la durée d'indisponibilité pour les abonnements en cours",
										],
										[
											"Résiliation annuelle dans les 7 premiers jours (cooling-off interne WeSafe)",
											"Remboursement intégral au prorata, accordé à titre commercial, sous réserve qu'aucune fonctionnalité exclusive n'ait été utilisée",
										],
										[
											"Exercice du droit de rétractation (consommateurs uniquement — Art. 8.2)",
											"Remboursement intégral dans un délai de 14 jours par reversement sur la carte utilisée",
										],
										[
											"Crédits Last Minute non utilisés en cas de clôture du compte à l'initiative de WeSafe sans faute du Client",
											"Remboursement au prorata des crédits restants",
										],
									].map(([cas, traitement]) => (
										<tr
											key={cas}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{cas}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{traitement}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className='text-muted-foreground leading-7 mb-4'>
							Pour toute demande de remboursement, contacter :{" "}
							<a
								href='mailto:facturation@wesafe.fr'
								className='text-primary hover:underline underline-offset-2'>
								<Placeholder>
									[facturation@wesafe.fr]
								</Placeholder>
							</a>{" "}
							avec la référence de commande (numéro de facture
							Stripe).
						</p>
					</section>

					{/* ── Art. 11 ── */}
					<section id='art11'>
						<SectionTitle id='art11'>
							Article 11 – Modification des tarifs
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe se réserve le droit de modifier ses tarifs à
							tout moment. Toute modification tarifaire est
							notifiée aux Clients concernés par email et
							notification in-app avec un préavis minimum de{" "}
							<strong>30 jours calendaires</strong> avant son
							entrée en vigueur.
						</p>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								<strong>Abonnements mensuels :</strong> le
								nouveau tarif s&apos;applique à la prochaine
								échéance suivant l&apos;expiration du préavis de
								30 jours.
							</li>
							<li>
								<strong>Abonnements annuels :</strong> le
								nouveau tarif s&apos;applique au prochain
								renouvellement annuel suivant la notification.
							</li>
						</ul>
						<p className='text-muted-foreground leading-7 mb-4'>
							Si le Client n&apos;accepte pas les nouveaux tarifs,
							il peut résilier son abonnement avant la date
							d&apos;entrée en vigueur du nouveau tarif, sans
							pénalité, selon les modalités de l&apos;Article 9.
						</p>
					</section>

					{/* ── Art. 12 ── */}
					<section id='art12'>
						<SectionTitle id='art12'>
							Article 12 – Garanties et limitation de
							responsabilité
						</SectionTitle>
						<SubTitle>12.1 Garantie de conformité</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe garantit que les services payants fournis
							sont conformes à leur description au moment de la
							commande. En cas de non-conformité constatée, le
							Client doit notifier WeSafe dans un délai de{" "}
							<strong>30 jours</strong> suivant la découverte du
							défaut.
						</p>
						<SubTitle>12.2 Limitation de responsabilité</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							La responsabilité de WeSafe au titre des CGV est
							limitée au montant total payé par le Client durant
							les <strong>12 mois précédant</strong> le fait
							générateur du dommage. WeSafe ne saurait être tenu
							responsable de préjudices indirects (perte de
							chiffre d&apos;affaires, perte de profit, perte de
							chance de recrutement, etc.).
						</p>
						<SubTitle>12.3 Force majeure</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe ne pourra être tenu responsable de tout
							retard ou inexécution résultant d&apos;un cas de
							force majeure au sens de l&apos;article 1218 du Code
							civil (pandémie, catastrophe naturelle, panne
							majeure d&apos;infrastructure réseau, décision
							gouvernementale, etc.).
						</p>
					</section>

					{/* ── Art. 13 ── */}
					<section id='art13'>
						<SectionTitle id='art13'>
							Article 13 – Données personnelles liées aux
							transactions
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Dans le cadre des transactions commerciales, WeSafe
							collecte et traite les données nécessaires à la
							gestion des abonnements et des paiements : nom du
							responsable de compte, email de facturation, SIRET,
							historique des achats, référence de transaction
							Stripe.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Ces données sont conservées pendant{" "}
							<strong>5 ans</strong> à compter de la date de la
							transaction, conformément aux obligations comptables
							et fiscales françaises (articles L. 123-22 et L. 102
							B du LPF).
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Le traitement complet des données personnelles est
							décrit dans les{" "}
							<Link
								href='/cgu#art9'
								className='text-primary hover:underline underline-offset-2'>
								CGU — Article 9
							</Link>
							.
						</p>
					</section>

					{/* ── Art. 14 ── */}
					<section id='art14'>
						<SectionTitle id='art14'>
							Article 14 – Droit applicable et règlement des
							litiges
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les présentes Conditions Générales de Vente sont
							soumises au droit français. Tout litige relatif à
							leur interprétation ou à leur exécution relève, à
							défaut d&apos;accord amiable, de la compétence
							exclusive du{" "}
							<strong>
								Tribunal de Commerce de{" "}
								<Placeholder>[VILLE DU SIÈGE]</Placeholder>
							</strong>{" "}
							(pour les litiges entre professionnels).
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Pour les litiges avec des consommateurs, et
							conformément aux articles L. 611-1 et suivants du
							Code de la consommation, le Client peut recourir à
							la médiation de la consommation auprès de :{" "}
							<Placeholder>
								[NOM DU MÉDIATEUR — ex. : Médiateur du
								e-commerce FEVAD]
							</Placeholder>
							.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Plateforme européenne de règlement en ligne des
							litiges :{" "}
							<a
								href='https://ec.europa.eu/consumers/odr'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary hover:underline underline-offset-2'>
								ec.europa.eu/consumers/odr
							</a>
							.
						</p>
					</section>

					{/* Liens docs légaux */}
					<div className='mt-10 pt-8 border-t border-border flex flex-wrap gap-3'>
						<Link
							href='/mentions-legales'
							className='rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
							Mentions légales
						</Link>
						<Link
							href='/conditions-generales-d-utilisation'
							className='rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
							Conditions générales d'utilisation
						</Link>
						<Link
							href='/conditions-generales-de-vente'
							className='rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary'>
							Conditions générales de vente
						</Link>
						<Link
							href='/politique-de-confidentialite'
							className='rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
							Politique de confidentialité
						</Link>
					</div>
				</main>
			</div>
		</div>
	);
}
