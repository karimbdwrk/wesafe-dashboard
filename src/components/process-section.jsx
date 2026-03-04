import { UserPlus, Search, FileCheck, Briefcase } from "lucide-react";

const steps = [
	{
		icon: UserPlus,
		step: "01",
		title: "Creez votre profil",
		description:
			"Inscrivez-vous en quelques minutes. Renseignez vos certifications, votre experience et vos disponibilites.",
	},
	{
		icon: Search,
		step: "02",
		title: "Explorez les offres",
		description:
			"Parcourez les offres classiques ou les missions last minute selon vos competences et votre localisation.",
	},
	{
		icon: FileCheck,
		step: "03",
		title: "Postulez en un clic",
		description:
			"Envoyez votre candidature directement depuis l'application. Suivez l'avancement en temps reel.",
	},
	{
		icon: Briefcase,
		step: "04",
		title: "Signez et travaillez",
		description:
			"Contrat genere automatiquement, signature electronique et vous etes pret a prendre votre poste.",
	},
];

export function ProcessSection() {
	return (
		<section id='process' className='py-20 md:py-32'>
			<div className='mx-auto max-w-7xl px-6'>
				<div className='mx-auto max-w-2xl text-center'>
					<p className='text-sm font-medium tracking-widest text-primary uppercase'>
						Comment ca marche
					</p>
					<h2 className='mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl text-balance'>
						Du profil au poste en 4 etapes
					</h2>
					<p className='mt-4 text-lg text-muted-foreground'>
						Un processus simplifie pour un recrutement efficace et
						rapide.
					</p>
				</div>

				<div className='relative mt-16'>
					{/* Connecting line */}
					<div className='absolute top-16 left-0 right-0 hidden h-px bg-border lg:block' />

					<div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
						{steps.map((step) => (
							<div
								key={step.step}
								className='relative text-center'>
								<div className='relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card'>
									<step.icon className='h-6 w-6 text-primary' />
									<span className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
										{step.step}
									</span>
								</div>
								<h3 className='font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground'>
									{step.title}
								</h3>
								<p className='mt-3 leading-relaxed text-muted-foreground'>
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
