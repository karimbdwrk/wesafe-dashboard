import { Search, FileText, Clock, Shield, Zap, Users } from "lucide-react";

const features = [
	{
		icon: Search,
		title: "Processus de recrutement",
		description:
			"Un parcours de recrutement structure et transparent, du depot de candidature a l'embauche, entierement digitalise.",
	},
	{
		icon: FileText,
		title: "Generation de contrats",
		description:
			"Generez vos contrats de travail en quelques clics grace a nos modeles pre-remplis et conformes a la legislation.",
	},
	{
		icon: Clock,
		title: "Offres Last Minute",
		description:
			"Besoin urgent d'un agent ? Publiez une offre last minute et recevez des candidatures en temps reel.",
	},
	{
		icon: Shield,
		title: "Profils verifies",
		description:
			"Chaque agent est verifie : diplomes, certifications CNAPS, experience. Recrutez en toute confiance.",
	},
	{
		icon: Zap,
		title: "Matching intelligent",
		description:
			"Notre algorithme vous propose les candidats les plus pertinents selon vos criteres et votre localisation.",
	},
	{
		icon: Users,
		title: "Gestion d'equipe",
		description:
			"Planifiez vos equipes, gerez les plannings et suivez la disponibilite de vos agents depuis l'application.",
	},
];

export function FeaturesSection() {
	return (
		<section id='fonctionnalites' className='py-20 md:py-32'>
			<div className='mx-auto max-w-7xl px-6'>
				<div className='mx-auto max-w-2xl text-center'>
					<p className='text-sm font-medium tracking-widest text-primary uppercase'>
						Fonctionnalites
					</p>
					<h2 className='mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl text-balance'>
						Tout ce dont vous avez besoin pour recruter dans la
						securite
					</h2>
					<p className='mt-4 text-lg text-muted-foreground'>
						Une plateforme complete pensee pour les professionnels
						de la securite privee.
					</p>
				</div>

				<div className='mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{features.map((feature) => (
						<div
							key={feature.title}
							className='group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:bg-card/80'>
							<div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10'>
								<feature.icon className='h-6 w-6 text-primary' />
							</div>
							<h3 className='font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground'>
								{feature.title}
							</h3>
							<p className='mt-3 leading-relaxed text-muted-foreground'>
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
