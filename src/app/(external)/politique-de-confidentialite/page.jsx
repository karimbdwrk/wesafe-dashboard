import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SECTIONS = [
	{ id: "s1", label: "1. Qui sommes-nous ?" },
	{ id: "s2", label: "2. Données collectées" },
	{ id: "s3", label: "3. Données sensibles" },
	{ id: "s4", label: "4. Finalités & bases légales" },
	{ id: "s5", label: "5. Durées de conservation" },
	{ id: "s6", label: "6. Partage des données" },
	{ id: "s7", label: "7. Transferts hors UE" },
	{ id: "s8", label: "8. Sécurité" },
	{ id: "s9", label: "9. Vos droits" },
	{ id: "s10", label: "10. Cookies & stockage local" },
	{ id: "s11", label: "11. Mineurs" },
	{ id: "s12", label: "12. Notifications push" },
	{ id: "s13", label: "13. Modifications" },
	{ id: "s14", label: "14. Contact & DPO" },
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

function CardRgpd({ children }) {
	return (
		<div className='rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-800 mb-5'>
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

function BadgeCandidat() {
	return (
		<span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700'>
			Candidat
		</span>
	);
}

function BadgePro() {
	return (
		<span className='inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700'>
			Entreprise
		</span>
	);
}

function RightBadge({ children }) {
	return (
		<span className='inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground'>
			{children}
		</span>
	);
}

export default function PolitiqueConfidentialitePage() {
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
						Protection des données
					</p>
					<h1 className='font-(family-name:--font-heading) text-3xl font-bold text-primary-foreground md:text-4xl mb-3'>
						Politique de Confidentialité
					</h1>
					<p className='text-primary-foreground/70 text-sm'>
						Conforme au RGPD (UE) 2016/679 et à la loi Informatique
						et Libertés — Dernière mise à jour :{" "}
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
						doivent être remplacés par les informations exactes de
						la société avant publication.
					</CardWarn>

					<CardRgpd>
						<strong>Résumé accessible :</strong> WeSafe collecte vos
						données uniquement pour faire fonctionner la plateforme
						de mise en relation dans le secteur de la sécurité
						privée. Certaines données sont sensibles (pièce
						d&apos;identité, numéro de sécurité sociale, cartes
						CNAPS) — elles sont collectées parce que la loi
						l&apos;exige pour exercer dans ce secteur. Vos données
						ne sont <strong>jamais vendues</strong>. Vous pouvez
						accéder, modifier ou supprimer vos données à tout
						moment.
					</CardRgpd>

					{/* ── 1 ── */}
					<section id='s1'>
						<SectionTitle id='s1'>
							1. Qui sommes-nous ?
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe est une plateforme numérique de mise en
							relation entre des professionnels de la sécurité
							privée (agents, opérateurs) et des entreprises du
							secteur, éditée par :
						</p>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<tbody>
									{[
										[
											"Société",
											<Placeholder key='soc'>
												[NOM DE LA SOCIÉTÉ]
											</Placeholder>,
										],
										[
											"Forme juridique",
											<Placeholder key='fj'>
												[SAS / SASU / SARL]
											</Placeholder>,
										],
										[
											"Siège social",
											<Placeholder key='siege'>
												[ADRESSE COMPLÈTE]
											</Placeholder>,
										],
										[
											"SIRET",
											<Placeholder key='siret'>
												[14 CHIFFRES]
											</Placeholder>,
										],
										[
											"Email général",
											<a
												key='email'
												href='mailto:'
												className='text-primary hover:underline underline-offset-2'>
												<Placeholder>
													[contact@wesafe.fr]
												</Placeholder>
											</a>,
										],
										[
											"Email DPO",
											<a
												key='dpo'
												href='mailto:'
												className='text-primary hover:underline underline-offset-2'>
												<Placeholder>
													[dpo@wesafe.fr]
												</Placeholder>
											</a>,
										],
									].map(([label, value]) => (
										<tr
											key={label}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 font-medium text-foreground w-40 align-top'>
												{label}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{value}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className='text-muted-foreground leading-7 mb-4'>
							En tant que{" "}
							<strong>responsable du traitement</strong> au sens
							de l&apos;article 4 du RGPD,{" "}
							<Placeholder>[NOM DE LA SOCIÉTÉ]</Placeholder>{" "}
							détermine les finalités et les moyens des
							traitements de données personnelles décrits dans la
							présente politique.
						</p>
					</section>

					{/* ── 2 ── */}
					<section id='s2'>
						<SectionTitle id='s2'>
							2. Quelles données collectons-nous ?
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Nous collectons uniquement les données strictement
							nécessaires au fonctionnement de la Plateforme (
							<em>principe de minimisation</em> — art. 5.1.c
							RGPD).
						</p>

						<SubTitle>
							2.1 Données collectées lors de l&apos;inscription
						</SubTitle>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Donnée",
											"Profil concerné",
											"Obligatoire",
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
										{
											data: "Adresse e-mail",
											users: ["both"],
											required: true,
										},
										{
											data: "Mot de passe (haché, non lisible)",
											users: ["both"],
											required: true,
										},
										{
											data: "Prénom, nom",
											users: ["both"],
											required: true,
										},
										{
											data: "Date de naissance",
											users: ["cand"],
											required: true,
										},
										{
											data: "Genre",
											users: ["cand"],
											required: true,
										},
										{
											data: "Adresse (code postal, ville, commune, département, région)",
											users: ["cand"],
											required: true,
										},
										{
											data: "Taille (cm), poids (kg)",
											users: ["cand"],
											required: true,
											note: "réglementation CNAPS",
										},
										{
											data: "Nom de la société, SIRET",
											users: ["pro"],
											required: true,
										},
									].map((row) => (
										<tr
											key={row.data}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.data}
											</td>
											<td className='px-3 py-2.5 align-top'>
												<div className='flex flex-wrap gap-1'>
													{(row.users.includes(
														"both",
													) ||
														row.users.includes(
															"cand",
														)) && <BadgeCandidat />}
													{(row.users.includes(
														"both",
													) ||
														row.users.includes(
															"pro",
														)) && <BadgePro />}
												</div>
											</td>
											<td className='px-3 py-2.5 align-top'>
												{row.required ? (
													<span className='font-medium text-red-600'>
														Oui
														{row.note && (
															<span className='text-muted-foreground/60 font-normal text-xs ml-1'>
																({row.note})
															</span>
														)}
													</span>
												) : (
													<span className='text-muted-foreground'>
														Facultatif
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<SubTitle>
							2.2 Données renseignées ultérieurement (profil)
						</SubTitle>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Donnée",
											"Profil concerné",
											"Obligatoire",
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
										{
											data: "Photo de profil / logo",
											users: ["both"],
										},
										{
											data: "Langues parlées",
											users: ["cand"],
										},
										{
											data: "Catégories de permis de conduire",
											users: ["cand"],
										},
										{
											data: "Expériences professionnelles (CV)",
											users: ["cand"],
										},
										{
											data: "Description de l'entreprise",
											users: ["pro"],
										},
									].map((row) => (
										<tr
											key={row.data}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.data}
											</td>
											<td className='px-3 py-2.5 align-top'>
												<div className='flex flex-wrap gap-1'>
													{(row.users.includes(
														"both",
													) ||
														row.users.includes(
															"cand",
														)) && <BadgeCandidat />}
													{(row.users.includes(
														"both",
													) ||
														row.users.includes(
															"pro",
														)) && <BadgePro />}
												</div>
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												Facultatif
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<SubTitle>
							2.3 Documents transmis pour vérification
						</SubTitle>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Document",
											"Profil concerné",
											"Finalité",
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
										{
											doc: "Pièce d'identité (CNI recto/verso ou passeport)",
											users: ["cand"],
											fin: "Vérification d'identité & droit au travail",
										},
										{
											doc: "Numéro de sécurité sociale (NIR, 15 chiffres)",
											users: ["cand"],
											fin: "Identification réglementaire, contrats, DSN",
										},
										{
											doc: "Carte vitale ou attestation SS",
											users: ["cand"],
											fin: "Vérification d'affiliation SS",
										},
										{
											doc: "Carte professionnelle CNAPS (photo + numéro + validité)",
											users: ["cand"],
											fin: "Vérification de l'habilitation professionnelle",
										},
										{
											doc: "Diplôme SSIAP (1/2/3)",
											users: ["cand"],
											fin: "Vérification de qualification",
										},
										{
											doc: "Extrait KBIS (PDF)",
											users: ["pro"],
											fin: "Vérification d'existence légale",
										},
										{
											doc: "Tampon d'entreprise (image)",
											users: ["pro"],
											fin: "Apposition sur documents officiels",
										},
										{
											doc: "Signature manuscrite numérisée",
											users: ["both"],
											fin: "Signature électronique des contrats",
										},
									].map((row) => (
										<tr
											key={row.doc}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.doc}
											</td>
											<td className='px-3 py-2.5 align-top'>
												<div className='flex flex-wrap gap-1'>
													{(row.users.includes(
														"both",
													) ||
														row.users.includes(
															"cand",
														)) && <BadgeCandidat />}
													{(row.users.includes(
														"both",
													) ||
														row.users.includes(
															"pro",
														)) && <BadgePro />}
												</div>
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.fin}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<SubTitle>
							2.4 Données générées par l&apos;utilisation
						</SubTitle>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								Candidatures soumises et leur statut (acceptée,
								refusée, en attente)
							</li>
							<li>
								Annonces d&apos;emploi publiées par les
								Entreprises
							</li>
							<li>Messages échangés via la messagerie interne</li>
							<li>Contrats de travail générés et signés</li>
							<li>Historique de notifications reçues</li>
							<li>
								Tokens de session (JWT, conservés en stockage
								sécurisé sur l&apos;appareil)
							</li>
							<li>
								Token de notification push (identifiant
								d&apos;appareil Firebase)
							</li>
							<li>
								Logs d&apos;activité techniques (horodatage,
								type d&apos;action)
							</li>
							<li>
								Données de paiement : référence de transaction
								Stripe, statut d&apos;abonnement (aucune donnée
								bancaire brute stockée par WeSafe)
							</li>
						</ul>
					</section>

					{/* ── 3 ── */}
					<section id='s3'>
						<SectionTitle id='s3'>
							3. Données particulièrement sensibles
						</SectionTitle>
						<CardRgpd>
							<strong>
								Pourquoi collectons-nous des données sensibles ?
							</strong>
							<br />
							La sécurité privée est un secteur{" "}
							<strong>fortement réglementé</strong> en France par
							le Code de la sécurité intérieure (CSI) et le CNAPS.
							Les obligations légales imposées aux employeurs et
							aux agents justifient la collecte de certaines
							données qui seraient, dans un autre contexte,
							excessives.
						</CardRgpd>

						<SubTitle>
							3.1 Numéro de Sécurité Sociale (NIR)
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-3'>
							Le NIR (numéro à 15 chiffres) est collecté auprès
							des Candidats pour les finalités suivantes, toutes
							fondées sur une obligation légale :
						</p>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								Établissement des contrats de travail (mentions
								obligatoires)
							</li>
							<li>
								Transmission de la Déclaration Sociale
								Nominative (DSN) par les Entreprises
							</li>
							<li>
								Vérification de l&apos;identité du Candidat dans
								le cadre du processus de recrutement réglementé
							</li>
						</ul>
						<p className='text-muted-foreground leading-7 mb-4'>
							Base légale :{" "}
							<strong>
								Article 87 de la loi Informatique et Libertés
								modifiée
							</strong>{" "}
							— traitement nécessaire au respect d&apos;une
							obligation légale incombant au responsable de
							traitement en matière de droit du travail et de
							sécurité sociale. Le NIR est chiffré en base de
							données et accessible uniquement aux agents
							habilités de WeSafe et aux Entreprises ayant recruté
							le Candidat, dans le strict cadre de leur relation
							contractuelle.
						</p>

						<SubTitle>
							3.2 Documents d&apos;identité (CNI, passeport)
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Collectés sur le fondement de l&apos;
							<strong>
								article L. 8221-5 du Code du travail
							</strong>{" "}
							(obligation de vérification du droit au travail en
							France). Les images sont stockées dans un bucket
							sécurisé à accès restreint et ne sont utilisées
							qu&apos;à des fins de vérification manuelle par
							l&apos;équipe WeSafe.
						</p>

						<SubTitle>
							3.3 Carte vitale / attestation de sécurité sociale
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Collectée pour vérifier l&apos;affiliation du
							Candidat à la sécurité sociale française, condition
							préalable à l&apos;établissement d&apos;un contrat
							de travail déclaré. Base légale :{" "}
							<strong>Article 9.2.b du RGPD</strong> (obligations
							en matière de droit du travail et de sécurité
							sociale).
						</p>

						<SubTitle>
							3.4 Données physiques (taille, poids)
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Collectées conformément aux conditions
							d&apos;aptitude physique définies par les textes
							réglementaires du secteur de la sécurité privée pour
							certains postes (APS, cynophile, protection
							rapprochée). Ces données ne font l&apos;objet
							d&apos;aucun traitement automatisé à des fins de
							sélection ou de discrimination.
						</p>

						<SubTitle>
							3.5 Signatures manuscrites numérisées
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les signatures sont collectées exclusivement pour
							permettre la{" "}
							<strong>signature électronique avancée</strong> des
							contrats de travail (Règlement eIDAS, UE n°
							910/2014). Elles ne sont pas traitées à des fins
							d&apos;identification biométrique et ne sont pas
							comparées à d&apos;autres signatures.
						</p>
					</section>

					{/* ── 4 ── */}
					<section id='s4'>
						<SectionTitle id='s4'>
							4. Pourquoi utilisons-nous vos données ? (Finalités
							et bases légales)
						</SectionTitle>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Finalité",
											"Base légale RGPD",
											"Profil",
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
										{
											fin: "Créer et gérer votre compte",
											base: "Art. 6.1.b – Exécution du contrat",
											users: ["both"],
										},
										{
											fin: "Afficher votre profil public aux recruteurs",
											base: "Art. 6.1.b – Exécution du contrat",
											users: ["cand"],
										},
										{
											fin: "Permettre les candidatures et le recrutement",
											base: "Art. 6.1.b – Exécution du contrat",
											users: ["both"],
										},
										{
											fin: "Vérifier les documents professionnels et d'identité",
											base: "Art. 6.1.c – Obligation légale",
											users: ["both"],
										},
										{
											fin: "Générer et signer des contrats de travail",
											base: "Art. 6.1.b – Exécution du contrat",
											users: ["both"],
										},
										{
											fin: "Assurer la messagerie entre Candidats et Entreprises",
											base: "Art. 6.1.b – Exécution du contrat",
											users: ["both"],
										},
										{
											fin: "Envoyer des notifications en temps réel",
											base: "Art. 6.1.b – Exécution du contrat",
											users: ["both"],
										},
										{
											fin: "Gérer les abonnements et les paiements",
											base: "Art. 6.1.b – Exécution du contrat",
											users: ["pro"],
										},
										{
											fin: "Émettre des factures et respecter les obligations comptables",
											base: "Art. 6.1.c – Obligation légale",
											users: ["pro"],
										},
										{
											fin: "Prévenir la fraude et sécuriser la Plateforme",
											base: "Art. 6.1.f – Intérêt légitime",
											users: ["both"],
										},
										{
											fin: "Fournir des statistiques anonymisées aux Entreprises",
											base: "Art. 6.1.b – Exécution du contrat",
											users: ["pro"],
										},
										{
											fin: "Améliorer la Plateforme (analytics internes anonymisés)",
											base: "Art. 6.1.f – Intérêt légitime",
											users: ["both"],
										},
										{
											fin: "Traitement du NIR pour les contrats et la DSN",
											base: "Art. 87 LIL – Obligation légale spécifique",
											users: ["cand"],
										},
										{
											fin: "Répondre aux demandes d'exercice des droits RGPD",
											base: "Art. 6.1.c – Obligation légale",
											users: ["both"],
										},
									].map((row) => (
										<tr
											key={row.fin}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.fin}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.base}
											</td>
											<td className='px-3 py-2.5 align-top'>
												<div className='flex flex-wrap gap-1'>
													{(row.users.includes(
														"both",
													) ||
														row.users.includes(
															"cand",
														)) && <BadgeCandidat />}
													{(row.users.includes(
														"both",
													) ||
														row.users.includes(
															"pro",
														)) && <BadgePro />}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<CardInfo>
							<strong>Pas de décision automatisée :</strong>{" "}
							WeSafe n&apos;utilise aucun système de scoring
							automatique, de profilage ou de décision entièrement
							automatisée impactant les utilisateurs au sens de
							l&apos;article 22 du RGPD. Toutes les décisions de
							sélection de candidats restent à la discrétion des
							Entreprises.
						</CardInfo>
					</section>

					{/* ── 5 ── */}
					<section id='s5'>
						<SectionTitle id='s5'>
							5. Combien de temps conservons-nous vos données ?
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Vos données sont conservées uniquement le temps
							nécessaire aux finalités pour lesquelles elles ont
							été collectées, dans le respect des durées légales
							minimales obligatoires.
						</p>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Catégorie de données",
											"Durée de conservation active",
											"Durée d'archivage intermédiaire",
											"Référence légale",
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
											"Données de compte (email, profil)",
											"Durée de la relation contractuelle",
											"3 ans après clôture du compte",
											"Art. 2224 C. civil",
										],
										[
											"Documents d'identité (CNI, passeport)",
											"Durée de la vérification (max. 6 mois)",
											"1 an après fin de la relation",
											"Art. L. 8221-5 C. trav.",
										],
										[
											"Numéro de sécurité sociale (NIR)",
											"Durée de la relation contractuelle",
											"5 ans après fin de relation",
											"Prescription sociale (art. L. 244-3 CSS)",
										],
										[
											"Carte vitale / attestation SS",
											"Durée de la vérification",
											"1 an après fin de la relation",
											"Obligation art. 9.2.b RGPD",
										],
										[
											"Cartes CNAPS, diplômes SSIAP",
											"Durée de validité du document",
											"1 an après expiration",
											"Réglementation CSI / CNAPS",
										],
										[
											"Signature numérisée",
											"Durée de la relation contractuelle",
											"5 ans après fin de relation",
											"Conservation des contrats",
										],
										[
											"Contrats de travail signés",
											"Durée de la relation contractuelle",
											"5 ans après fin du contrat",
											"Art. L. 3243-4 C. trav.",
										],
										[
											"Données de paiement (référence Stripe)",
											"Durée de l'abonnement",
											"5 ans après la transaction",
											"Art. L. 110-4 C. com.",
										],
										[
											"Factures émises",
											"Active",
											"10 ans (art. L. 123-22 C. com.)",
											"Obligation comptable",
										],
										[
											"Messages de la messagerie",
											"Active",
											"3 ans à compter de l'envoi",
											"Prescription de droit commun",
										],
										[
											"Logs techniques et de sécurité",
											"Active",
											"12 mois",
											"Recommandation CNIL",
										],
										[
											"Tokens de session (appareil)",
											"Durée de la session active",
											"Supprimés à la déconnexion",
											"Sécurité du service",
										],
									].map(([cat, active, archive, ref]) => (
										<tr
											key={cat}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{cat}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{active}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{archive}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{ref}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className='text-muted-foreground leading-7 mb-4'>
							Au-delà de la durée d&apos;archivage intermédiaire,
							vos données sont{" "}
							<strong>
								définitivement supprimées ou anonymisées
							</strong>{" "}
							de manière irréversible.
						</p>
					</section>

					{/* ── 6 ── */}
					<section id='s6'>
						<SectionTitle id='s6'>
							6. Avec qui partageons-nous vos données ?
						</SectionTitle>

						<SubTitle>
							6.1 Entre utilisateurs de la Plateforme
						</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Le profil public d&apos;un Candidat (prénom, photo,
							compétences, certifications vérifiées, ville) est
							visible par les Entreprises inscrites sur la
							Plateforme. Les informations suivantes ne sont{" "}
							<strong>jamais</strong> visibles publiquement : NIR,
							photos de documents d&apos;identité, carte vitale,
							date de naissance complète, poids.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Une Entreprise ayant recruté un Candidat peut
							accéder à son NIR et à ses documents d&apos;identité
							uniquement dans le cadre strict de la relation de
							travail et pour les obligations légales associées
							(DSN, DPAE, etc.).
						</p>

						<SubTitle>6.2 Sous-traitants techniques</SubTitle>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Partenaire",
											"Rôle",
											"Données transmises",
											"Localisation",
											"Garanties",
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
										{
											name: "Supabase, Inc.",
											role: "Base de données, authentification, stockage de fichiers",
											data: "Toutes les données utilisateurs, documents, messages, contrats",
											loc: "🇩🇪 Allemagne (EU West)",
											garanties:
												"DPA signé, RGPD-compliant, clauses contractuelles types CE",
										},
										{
											name: "Stripe, Inc.",
											role: "Traitement des paiements",
											data: "Email, nom, référence de transaction (aucune donnée bancaire brute)",
											loc: "🇪🇺 UE + 🇺🇸 USA",
											garanties:
												"PCI-DSS niveau 1, clauses contractuelles types CE",
										},
										{
											name: "Google LLC (Firebase)",
											role: "Notifications push (Android)",
											data: "Token d'appareil (identifiant anonyme)",
											loc: "🇪🇺 UE + 🇺🇸 USA",
											garanties:
												"Clauses contractuelles types CE, Data Privacy Framework",
										},
										{
											name: "Railway Corp.",
											role: "Traitement d'images (tampons)",
											data: "Image du tampon uniquement (non rattachée à un profil)",
											loc: "🇺🇸 USA",
											garanties:
												"Traitement éphémère, pas de stockage persistant",
										},
										{
											name: "geo.api.gouv.fr",
											role: "Autocomplétion des communes",
											data: "Code postal saisi (aucune donnée personnelle)",
											loc: "🇫🇷 France",
											garanties:
												"API publique de l'État français",
										},
										{
											name: "restcountries.com",
											role: "Sélection de nationalité",
											data: "Aucune donnée personnelle transmise",
											loc: "Externe",
											garanties: "API publique",
										},
									].map((row) => (
										<tr
											key={row.name}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 font-medium text-foreground align-top'>
												{row.name}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.role}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.data}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.loc}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.garanties}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className='text-muted-foreground leading-7 mb-4'>
							Tous nos sous-traitants sont sélectionnés pour leur
							conformité au RGPD et font l&apos;objet d&apos;un
							contrat de traitement des données (DPA) en bonne et
							due forme.
						</p>

						<SubTitle>6.3 Autorités compétentes</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe peut être amené à communiquer des données
							personnelles à des autorités judiciaires,
							administratives ou réglementaires (CNAPS, PHAROS,
							CNIL, tribunaux) sur réquisition légale ou en cas de
							fraude documentaire grave. Cette communication est
							limitée au strict nécessaire.
						</p>

						<SubTitle>6.4 Ce que nous ne faisons jamais</SubTitle>
						<CardGreen>
							WeSafe{" "}
							<strong>
								ne vend jamais vos données personnelles
							</strong>{" "}
							à des tiers. Nous ne faisons aucune publicité ciblée
							basée sur le contenu de vos profils ou de vos
							messages. Vos données ne sont pas utilisées à des
							fins de démarchage commercial sans votre
							consentement explicite.
						</CardGreen>
					</section>

					{/* ── 7 ── */}
					<section id='s7'>
						<SectionTitle id='s7'>
							7. Transferts de données hors Union Européenne
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-3'>
							Certains de nos sous-traitants sont établis ou
							hébergent des données aux États-Unis (Stripe, Google
							Firebase, Railway). Ces transferts hors de
							l&apos;Espace Économique Européen sont encadrés par
							les garanties suivantes :
						</p>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								<strong>
									Clauses contractuelles types (CCT)
								</strong>{" "}
								adoptées par la Commission européenne en vertu
								de l&apos;article 46.2.c du RGPD — applicables à
								Stripe, Google LLC et Railway
							</li>
							<li>
								<strong>Data Privacy Framework UE-USA</strong>{" "}
								(décision d&apos;adéquation de la Commission du
								10 juillet 2023) pour les entités américaines
								certifiées sous ce cadre
							</li>
							<li>
								<strong>Hébergement EU (Allemagne)</strong> pour
								Supabase : les données sont physiquement
								stockées en Europe sans transfert
								transatlantique des données sensibles
							</li>
						</ul>
						<p className='text-muted-foreground leading-7 mb-4'>
							Vous pouvez obtenir une copie des garanties mises en
							place en contactant :{" "}
							<a
								href='mailto:dpo@wesafe.fr'
								className='text-primary hover:underline underline-offset-2'>
								<Placeholder>[dpo@wesafe.fr]</Placeholder>
							</a>
						</p>
					</section>

					{/* ── 8 ── */}
					<section id='s8'>
						<SectionTitle id='s8'>
							8. Comment protégeons-nous vos données ?
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							La protection de vos données est une priorité
							absolue, particulièrement compte tenu de la nature
							sensible de certaines informations collectées. Nous
							mettons en œuvre les mesures suivantes :
						</p>

						<SubTitle>8.1 Mesures techniques</SubTitle>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								<strong>Chiffrement en transit :</strong> toutes
								les communications entre l&apos;application et
								nos serveurs utilisent le protocole TLS 1.3
							</li>
							<li>
								<strong>Chiffrement au repos :</strong> les
								données sont chiffrées avec AES-256 dans la base
								Supabase
							</li>
							<li>
								<strong>
									Stockage sécurisé sur l&apos;appareil :
								</strong>{" "}
								les tokens d&apos;authentification sont
								conservés dans{" "}
								<code className='text-xs bg-muted px-1 py-0.5 rounded'>
									expo-secure-store
								</code>{" "}
								(enclave sécurisée iOS / Android Keystore)
							</li>
							<li>
								<strong>
									Contrôle d&apos;accès granulaire :
								</strong>{" "}
								Row Level Security (RLS) Supabase — chaque
								utilisateur n&apos;accède qu&apos;à ses propres
								données
							</li>
							<li>
								<strong>Buckets isolés :</strong> les documents
								sensibles (identité, NIR, CNAPS) sont dans des
								espaces de stockage séparés avec des politiques
								d&apos;accès strictes
							</li>
							<li>
								<strong>Hachage des mots de passe :</strong>{" "}
								algorithme bcrypt via Supabase Auth — les mots
								de passe en clair ne sont jamais stockés
							</li>
							<li>
								<strong>Authentification forte :</strong> OTP
								(code à usage unique) requis pour la signature
								des contrats
							</li>
						</ul>

						<SubTitle>8.2 Mesures organisationnelles</SubTitle>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								Accès aux données sensibles strictement limité
								aux agents habilités de l&apos;équipe WeSafe
							</li>
							<li>
								Formation du personnel aux bonnes pratiques de
								sécurité et de protection des données
							</li>
							<li>
								Procédure de gestion des violations de données
								personnelles (notification CNIL sous 72h
								conformément à l&apos;article 33 du RGPD)
							</li>
							<li>
								Revue périodique des accès et des politiques de
								sécurité
							</li>
						</ul>

						<CardWarn>
							<strong>En cas de violation de données :</strong> si
							nous détectons une violation susceptible
							d&apos;engendrer un risque pour vos droits et
							libertés, nous vous en informerons directement dans
							les meilleurs délais, conformément à l&apos;article
							34 du RGPD.
						</CardWarn>
					</section>

					{/* ── 9 ── */}
					<section id='s9'>
						<SectionTitle id='s9'>
							9. Vos droits sur vos données
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Le RGPD vous confère un ensemble de droits sur vos
							données personnelles. Voici comment les exercer
							concrètement avec WeSafe :
						</p>

						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Droit",
											"Ce que vous pouvez faire",
											"Délai de réponse",
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
											"📋 Accès",
											"Obtenir une copie de toutes vos données personnelles détenues par WeSafe",
										],
										[
											"✏️ Rectification",
											"Corriger des données inexactes depuis votre profil ou par demande écrite",
										],
										[
											"🗑️ Effacement",
											"Demander la suppression de vos données (sous réserve des obligations légales de conservation)",
										],
										[
											"📦 Portabilité",
											"Recevoir vos données dans un format structuré, lisible par machine (JSON/CSV)",
										],
										[
											"🚫 Opposition",
											"Vous opposer aux traitements fondés sur l'intérêt légitime (analytics, prévention fraude)",
										],
										[
											"⏸️ Limitation",
											"Demander la suspension temporaire d'un traitement contesté",
										],
										[
											"🤖 Anti-automatisation",
											"Ne pas faire l'objet d'une décision basée exclusivement sur un traitement automatisé",
										],
										[
											"↩️ Retrait du consentement",
											"Retirer votre consentement à tout moment pour les traitements qui le requièrent (ex : photo de profil)",
										],
									].map(([droit, desc], i) => (
										<tr
											key={droit}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 align-top'>
												<RightBadge>{droit}</RightBadge>
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{desc}
											</td>
											{i === 0 && (
												<td
													rowSpan={8}
													className='px-3 py-2.5 text-center align-middle font-semibold text-primary'>
													1 mois
													<br />
													<span className='text-xs font-normal text-muted-foreground'>
														(+ 2 mois si complexité)
													</span>
												</td>
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<SubTitle>Comment exercer vos droits ?</SubTitle>
						<ol className='list-decimal list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								<strong>Via l&apos;application :</strong>{" "}
								certains droits (rectification, suppression du
								profil) sont directement accessibles dans
								Paramètres → Mon compte.
							</li>
							<li>
								<strong>Par email :</strong>{" "}
								<a
									href='mailto:dpo@wesafe.fr'
									className='text-primary hover:underline underline-offset-2'>
									<Placeholder>[dpo@wesafe.fr]</Placeholder>
								</a>{" "}
								— en précisant votre demande et en joignant une
								copie de votre pièce d&apos;identité.
							</li>
							<li>
								<strong>Par courrier :</strong>{" "}
								<Placeholder>
									[NOM DE LA SOCIÉTÉ] — [ADRESSE POSTALE]
								</Placeholder>{" "}
								— courrier recommandé avec accusé de réception.
							</li>
						</ol>
						<p className='text-muted-foreground leading-7 mb-3'>
							Si vous estimez que vos droits n&apos;ont pas été
							respectés, vous pouvez saisir la{" "}
							<strong>
								Commission Nationale de l&apos;Informatique et
								des Libertés (CNIL)
							</strong>{" "}
							:
						</p>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>
								En ligne :{" "}
								<a
									href='https://www.cnil.fr/fr/plaintes'
									target='_blank'
									rel='noopener noreferrer'
									className='text-primary hover:underline underline-offset-2'>
									www.cnil.fr/fr/plaintes
								</a>
							</li>
							<li>
								Par courrier : CNIL — 3 Place de Fontenoy, TSA
								80715, 75334 Paris Cedex 07
							</li>
						</ul>
					</section>

					{/* ── 10 ── */}
					<section id='s10'>
						<SectionTitle id='s10'>
							10. Cookies et stockage local
						</SectionTitle>

						<SubTitle>10.1 Application mobile</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							L&apos;application mobile WeSafe n&apos;utilise pas
							de cookies. Elle recourt aux mécanismes de stockage
							natifs suivants, exclusivement à des fins techniques
							:
						</p>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<thead>
									<tr className='bg-muted'>
										{[
											"Mécanisme",
											"Données stockées",
											"Finalité",
											"Durée",
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
										{
											mec: "expo-secure-store\n(enclave sécurisée)",
											data: "Token JWT de session",
											fin: "Maintien de la session d'authentification",
											dur: "Durée de la session active",
										},
										{
											mec: "AsyncStorage",
											data: "Préférences locales (thème, langue)",
											fin: "Personnalisation de l'interface",
											dur: "Jusqu'à suppression manuelle",
										},
									].map((row) => (
										<tr
											key={row.mec}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 align-top'>
												<code className='text-xs bg-muted px-1 py-0.5 rounded block whitespace-pre-line'>
													{row.mec}
												</code>
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.data}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.fin}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{row.dur}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<SubTitle>10.2 Site internet</SubTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Le site internet de WeSafe utilise uniquement des
							cookies <strong>strictement nécessaires</strong> à
							son fonctionnement (session, préférences RGPD).
							Aucun cookie publicitaire ou de traçage tiers
							n&apos;est déposé sans votre consentement préalable,
							conformément aux recommandations de la CNIL
							(délibération n° 2020-091 du 17 septembre 2020).
						</p>
						<CardInfo>
							Un bandeau de gestion des cookies est présent sur le
							site internet. Vous pouvez à tout moment modifier
							vos préférences en cliquant sur « Gérer mes cookies
							» en bas de chaque page.
						</CardInfo>
					</section>

					{/* ── 11 ── */}
					<section id='s11'>
						<SectionTitle id='s11'>
							11. Protection des mineurs
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe est une plateforme destinée aux
							professionnels. L&apos;accès est réservé aux
							personnes majeures (18 ans révolus). Nous ne
							collectons pas sciemment de données personnelles
							concernant des mineurs.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Si vous êtes parent ou tuteur et pensez qu&apos;un
							mineur a créé un compte sur la Plateforme,
							contactez-nous immédiatement à{" "}
							<a
								href='mailto:dpo@wesafe.fr'
								className='text-primary hover:underline underline-offset-2'>
								<Placeholder>[dpo@wesafe.fr]</Placeholder>
							</a>{" "}
							afin que nous procédions à la suppression du compte
							et des données associées.
						</p>
					</section>

					{/* ── 12 ── */}
					<section id='s12'>
						<SectionTitle id='s12'>
							12. Notifications push
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-3'>
							L&apos;application WeSafe peut vous envoyer des
							notifications push sur votre appareil. Ces
							notifications sont utilisées pour vous informer de :
						</p>
						<ul className='list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4'>
							<li>Nouvelles candidatures reçues (Entreprises)</li>
							<li>Statuts de vérification de vos documents</li>
							<li>Nouveaux messages reçus</li>
							<li>
								Nouvelles annonces correspondant à votre profil
								(Candidats)
							</li>
							<li>Confirmations de paiement (Entreprises)</li>
						</ul>
						<p className='text-muted-foreground leading-7 mb-4'>
							Les notifications push nécessitent
							l&apos;enregistrement d&apos;un{" "}
							<strong>token d&apos;appareil</strong> auprès de
							Google Firebase (Android) ou Apple APNs (iOS). Ce
							token est un identifiant technique anonyme qui ne
							contient aucune donnée personnelle.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Vous pouvez{" "}
							<strong>désactiver les notifications push</strong> à
							tout moment depuis les paramètres de votre appareil
							(iOS : Réglages → WeSafe → Notifications ; Android :
							Paramètres → Applications → WeSafe → Notifications)
							sans impact sur le fonctionnement général de
							l&apos;application.
						</p>
					</section>

					{/* ── 13 ── */}
					<section id='s13'>
						<SectionTitle id='s13'>
							13. Modifications de la politique de confidentialité
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe se réserve le droit de modifier la présente
							politique à tout moment pour refléter des
							changements réglementaires, techniques ou liés à nos
							pratiques. La date de dernière mise à jour est
							indiquée en haut de cette page.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							En cas de modification substantielle (nouvelle
							catégorie de données, nouvelle finalité, nouveau
							sous-traitant), vous serez notifié par email et par
							notification in-app au moins{" "}
							<strong>30 jours avant</strong> l&apos;entrée en
							vigueur des changements.
						</p>
						<p className='text-muted-foreground leading-7 mb-4'>
							Nous vous encourageons à consulter régulièrement
							cette page. La version précédente de la politique
							est disponible sur demande à{" "}
							<a
								href='mailto:dpo@wesafe.fr'
								className='text-primary hover:underline underline-offset-2'>
								<Placeholder>[dpo@wesafe.fr]</Placeholder>
							</a>
							.
						</p>
					</section>

					{/* ── 14 ── */}
					<section id='s14'>
						<SectionTitle id='s14'>
							14. Contact et Délégué à la Protection des Données
						</SectionTitle>
						<p className='text-muted-foreground leading-7 mb-4'>
							Pour toute question relative à la présente politique
							ou à l&apos;exercice de vos droits, vous pouvez
							contacter notre Délégué à la Protection des Données
							(DPO) :
						</p>
						<div className='overflow-x-auto mb-4'>
							<table className='w-full text-sm border-collapse'>
								<tbody>
									{[
										[
											"Nom du DPO",
											<Placeholder key='nom'>
												[NOM DU DPO]
											</Placeholder>,
										],
										[
											"Email",
											<a
												key='email'
												href='mailto:dpo@wesafe.fr'
												className='text-primary hover:underline underline-offset-2'>
												<Placeholder>
													[dpo@wesafe.fr]
												</Placeholder>
											</a>,
										],
										[
											"Adresse postale",
											<Placeholder key='adresse'>
												[NOM DE LA SOCIÉTÉ] — [ADRESSE
												COMPLÈTE]
											</Placeholder>,
										],
									].map(([label, value]) => (
										<tr
											key={label}
											className='border-b border-border last:border-0'>
											<td className='px-3 py-2.5 font-medium text-foreground w-40 align-top'>
												{label}
											</td>
											<td className='px-3 py-2.5 text-muted-foreground align-top'>
												{value}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className='text-muted-foreground leading-7 mb-4'>
							Nous nous engageons à répondre à toute demande dans
							un délai maximum d&apos;<strong>un mois</strong> à
							compter de sa réception. Ce délai peut être porté à
							trois mois pour les demandes complexes ou
							nombreuses, auquel cas vous serez informé dans le
							premier mois.
						</p>
						<CardGreen>
							<strong>Autorité de contrôle :</strong> Vous avez le
							droit d&apos;introduire une réclamation auprès de la
							CNIL (
							<a
								href='https://www.cnil.fr'
								target='_blank'
								rel='noopener noreferrer'
								className='text-green-700 hover:underline underline-offset-2'>
								www.cnil.fr
							</a>
							) si vous estimez que le traitement de vos données
							personnelles n&apos;est pas conforme au RGPD, sans
							préjudice de tout autre recours administratif ou
							juridictionnel.
						</CardGreen>
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
							Conditions générales d&apos;utilisation
						</Link>
						<Link
							href='/conditions-generales-de-vente'
							className='rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'>
							Conditions générales de vente
						</Link>
						<Link
							href='/politique-de-confidentialite'
							className='rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary'>
							Politique de confidentialité
						</Link>
					</div>
				</main>
			</div>
		</div>
	);
}
