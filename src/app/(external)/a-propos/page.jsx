import Link from "next/link";
import {
	Shield,
	Users,
	Target,
	Heart,
	Zap,
	Award,
	MapPin,
	Mail,
	ArrowRight,
	CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const VALUES = [
	{
		icon: Shield,
		title: "Sécurité avant tout",
		description:
			"Nous vérifions chaque document, chaque habilitation, chaque identité. La rigueur réglementaire du secteur est notre priorité absolue.",
	},
	{
		icon: Heart,
		title: "Respect des agents",
		description:
			"Les professionnels de la sécurité méritent un outil digne de leur métier — rapide, fiable, et qui valorise leur expertise.",
	},
	{
		icon: Zap,
		title: "Rapidité & simplicité",
		description:
			"Du dépôt d'annonce à la signature du contrat en quelques minutes. Nous éliminons la paperasse pour que vous vous concentriez sur l'essentiel.",
	},
	{
		icon: Award,
		title: "Excellence opérationnelle",
		description:
			"Chaque fonctionnalité est pensée pour les réalités terrain du secteur : missions last minute, rotations d'équipes, conformité CNAPS.",
	},
];

const TEAM = [
	{
		name: "Alexandre Moreau",
		role: "Co-fondateur & CEO",
		bio: "15 ans dans la sécurité privée. Ancien chef de site SSIAP 3, il a créé WeSafe après avoir vécu les lacunes du recrutement de l'intérieur.",
		initials: "AM",
		color: "bg-primary",
	},
	{
		name: "Sophie Laurent",
		role: "Co-fondatrice & CTO",
		bio: "Ingénieure logicielle spécialisée en plateformes RH. Elle a conçu l'architecture technique pour répondre aux exigences réglementaires du secteur.",
		initials: "SL",
		color: "bg-violet-500",
	},
	{
		name: "Karim Benali",
		role: "Responsable Conformité",
		bio: "Expert CNAPS et droit du travail dans la sécurité privée. Il garantit que chaque fonctionnalité respecte le cadre légal en vigueur.",
		initials: "KB",
		color: "bg-emerald-500",
	},
];

const MILESTONES = [
	{
		year: "2022",
		label: "Genèse du projet",
		desc: "Constat des lacunes du recrutement dans la sécurité privée.",
	},
	{
		year: "2023",
		label: "Développement",
		desc: "18 mois de R&D avec des agents et entreprises pilotes.",
	},
	{
		year: "2024",
		label: "Lancement bêta",
		desc: "Ouverture à 50 entreprises partenaires et 500 agents.",
	},
	{
		year: "2025",
		label: "Croissance",
		desc: "12 000+ agents inscrits, 850+ entreprises actives en France.",
	},
	{
		year: "2026",
		label: "Aujourd'hui",
		desc: "Déploiement des contrats automatisés et de la messagerie temps réel.",
		current: true,
	},
];

export default function AProposPage() {
	return (
		<div className='min-h-screen bg-background'>
			{/* Hero */}
			<section className='relative overflow-hidden border-b border-border bg-primary pt-32 pb-20'>
				<div className='pointer-events-none absolute inset-0'>
					<div className='absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[100px]' />
				</div>
				<div className='relative mx-auto max-w-4xl px-6 text-center'>
					<p className='text-primary-foreground/60 text-sm font-medium uppercase tracking-widest mb-3'>
						Notre histoire
					</p>
					<h1 className='font-(family-name:--font-heading) text-4xl font-bold text-primary-foreground md:text-5xl mb-6'>
						WeSafe, nés du terrain
					</h1>
					<p className='text-primary-foreground/75 text-lg leading-relaxed max-w-2xl mx-auto'>
						WeSafe est né d&apos;un constat simple : le secteur de
						la sécurité privée manquait cruellement d&apos;outils
						adaptés à ses réalités. Ni LinkedIn, ni Indeed ne
						comprennent les cartes CNAPS, les habilitations SSIAP ou
						les impératifs de conformité réglementaire. Alors nous
						avons tout construit depuis zéro.
					</p>
				</div>
			</section>

			<div className='mx-auto max-w-6xl px-6 py-16 space-y-24'>
				{/* Mission */}
				<section className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
					<div>
						<div className='inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground mb-4'>
							<Target className='h-3.5 w-3.5' />
							Notre mission
						</div>
						<h2 className='font-(family-name:--font-heading) text-3xl font-bold text-foreground mb-5'>
							Connecter les talents de la sécurité avec les
							entreprises qui en ont besoin
						</h2>
						<p className='text-muted-foreground leading-7 mb-4'>
							WeSafe est la première plateforme pensée
							exclusivement pour le secteur de la sécurité privée
							en France. Nous mettons en relation agents,
							opérateurs et entreprises dans un environnement 100
							% conforme aux exigences du CNAPS et du Code de la
							sécurité intérieure.
						</p>
						<p className='text-muted-foreground leading-7 mb-6'>
							Notre vision : que chaque mission de sécurité soit
							pourvue par un professionnel vérifié, habilité et
							correctement rémunéré — dans les meilleurs délais.
						</p>
						<ul className='space-y-2'>
							{[
								"Vérification automatique des habilitations CNAPS",
								"Génération et signature de contrats en quelques clics",
								"Missions classiques et last minute sur une seule plateforme",
								"Données sécurisées et conformes au RGPD",
							].map((item) => (
								<li
									key={item}
									className='flex items-start gap-2.5 text-sm text-muted-foreground'>
									<CheckCircle2 className='h-4 w-4 text-primary shrink-0 mt-0.5' />
									{item}
								</li>
							))}
						</ul>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						{[
							{ value: "12K+", label: "Agents inscrits" },
							{ value: "850+", label: "Entreprises actives" },
							{ value: "98%", label: "Taux de satisfaction" },
							{
								value: "< 48h",
								label: "Délai moyen de recrutement",
							},
						].map((stat) => (
							<div
								key={stat.label}
								className='rounded-xl border border-border bg-card p-6 text-center'>
								<p className='font-(family-name:--font-heading) text-3xl font-bold text-primary mb-1'>
									{stat.value}
								</p>
								<p className='text-sm text-muted-foreground'>
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Valeurs */}
				<section>
					<div className='text-center mb-10'>
						<div className='inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground mb-4'>
							<Heart className='h-3.5 w-3.5' />
							Nos valeurs
						</div>
						<h2 className='font-(family-name:--font-heading) text-3xl font-bold text-foreground'>
							Ce qui nous guide chaque jour
						</h2>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						{VALUES.map((v) => (
							<div
								key={v.title}
								className='rounded-xl border border-border bg-card p-6 flex gap-4'>
								<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
									<v.icon className='h-5 w-5 text-primary' />
								</div>
								<div>
									<h3 className='font-semibold text-foreground mb-1'>
										{v.title}
									</h3>
									<p className='text-sm text-muted-foreground leading-6'>
										{v.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Timeline */}
				<section>
					<div className='text-center mb-10'>
						<div className='inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground mb-4'>
							<Zap className='h-3.5 w-3.5' />
							Notre parcours
						</div>
						<h2 className='font-(family-name:--font-heading) text-3xl font-bold text-foreground'>
							De l&apos;idée au produit
						</h2>
					</div>
					<div className='relative'>
						<div className='absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-border hidden md:block' />
						<div className='space-y-8'>
							{MILESTONES.map((m, i) => (
								<div
									key={m.year}
									className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
									<div
										className={`flex-1 rounded-xl border ${m.current ? "border-primary bg-primary/5" : "border-border bg-card"} p-5 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
										<p
											className={`text-xs font-semibold uppercase tracking-wider mb-1 ${m.current ? "text-primary" : "text-muted-foreground"}`}>
											{m.label}
										</p>
										<p className='text-sm text-muted-foreground leading-6'>
											{m.desc}
										</p>
									</div>
									<div
										className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${m.current ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"} font-(family-name:--font-heading) text-sm font-bold z-10`}>
										{m.year.slice(2)}
									</div>
									<div className='flex-1 hidden md:block' />
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Équipe */}
				<section>
					<div className='text-center mb-10'>
						<div className='inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground mb-4'>
							<Users className='h-3.5 w-3.5' />
							L&apos;équipe
						</div>
						<h2 className='font-(family-name:--font-heading) text-3xl font-bold text-foreground'>
							Des humains derrière la plateforme
						</h2>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
						{TEAM.map((member) => (
							<div
								key={member.name}
								className='rounded-xl border border-border bg-card p-6 text-center'>
								<div
									className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${member.color} text-white font-(family-name:--font-heading) text-xl font-bold`}>
									{member.initials}
								</div>
								<h3 className='font-semibold text-foreground'>
									{member.name}
								</h3>
								<p className='text-xs text-primary font-medium mb-3'>
									{member.role}
								</p>
								<p className='text-sm text-muted-foreground leading-6'>
									{member.bio}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Contact / CTA */}
				<section className='rounded-2xl border border-border bg-card p-10 text-center'>
					<div className='flex justify-center mb-5'>
						<div className='flex h-14 w-14 items-center justify-center rounded-xl bg-primary'>
							<Shield className='h-7 w-7 text-primary-foreground' />
						</div>
					</div>
					<h2 className='font-(family-name:--font-heading) text-2xl font-bold text-foreground mb-3'>
						Rejoignez la communauté WeSafe
					</h2>
					<p className='text-muted-foreground max-w-lg mx-auto mb-7'>
						Que vous soyez un agent à la recherche de votre
						prochaine mission ou une entreprise cherchant à
						renforcer ses équipes, WeSafe est fait pour vous.
					</p>
					<div className='flex flex-col sm:flex-row gap-3 justify-center'>
						<Link href='/auth/login'>
							<Button
								size='lg'
								className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2'>
								Commencer gratuitement
								<ArrowRight className='h-4 w-4' />
							</Button>
						</Link>
						<Link href='/contact'>
							<Button
								variant='outline'
								size='lg'
								className='gap-2 border-border'>
								<Mail className='h-4 w-4' />
								Nous contacter
							</Button>
						</Link>
					</div>
					<div className='mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground'>
						<MapPin className='h-3.5 w-3.5' />
						France métropolitaine · RGPD compliant · CNAPS certifié
					</div>
				</section>
			</div>
		</div>
	);
}
