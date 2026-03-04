import { MapPin, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const offers = [
	{
		title: "Agent de securite - Centre Commercial",
		company: "SecuriGroup",
		location: "Paris 12e",
		type: "CDI",
		salary: "1 900 - 2 200 EUR",
		posted: "Il y a 2h",
		urgent: false,
	},
	{
		title: "Agent SSIAP 1 - Evenementiel",
		company: "ProtecEvents",
		location: "Lyon",
		type: "CDD",
		salary: "13.50 EUR/h",
		posted: "Il y a 30min",
		urgent: true,
	},
	{
		title: "Rondier intervenant",
		company: "NightWatch",
		location: "Marseille",
		type: "CDI",
		salary: "2 100 - 2 400 EUR",
		posted: "Il y a 5h",
		urgent: false,
	},
	{
		title: "Agent cynophile - Site industriel",
		company: "K9 Security",
		location: "Toulouse",
		type: "CDD",
		salary: "14.20 EUR/h",
		posted: "Il y a 15min",
		urgent: true,
	},
];

export function OffersSection() {
	return (
		<section
			id='offres'
			className='border-t border-border bg-card/50 py-20 md:py-32'>
			<div className='mx-auto max-w-7xl px-6'>
				<div className='mx-auto max-w-2xl text-center'>
					<p className='text-sm font-medium tracking-widest text-primary uppercase'>
						Offres d&apos;emploi
					</p>
					<h2 className='mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl text-balance'>
						Des offres mises a jour en temps reel
					</h2>
					<p className='mt-4 text-lg text-muted-foreground'>
						Offres classiques et missions last minute dans toute la
						France.
					</p>
				</div>

				<div className='mt-12 grid gap-4 md:grid-cols-2'>
					{offers.map((offer, index) => (
						<div
							key={index}
							className='group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40'>
							{offer.urgent && (
								<div className='absolute top-4 right-4 flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
									<Zap className='h-3 w-3' />
									Last Minute
								</div>
							)}

							<h3 className='font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground pr-24'>
								{offer.title}
							</h3>
							<p className='mt-1 text-sm text-muted-foreground'>
								{offer.company}
							</p>

							<div className='mt-4 flex flex-wrap items-center gap-4'>
								<span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
									<MapPin className='h-4 w-4' />
									{offer.location}
								</span>
								<span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
									<Clock className='h-4 w-4' />
									{offer.posted}
								</span>
								<span className='rounded-md border border-border px-2.5 py-0.5 text-xs font-medium text-foreground'>
									{offer.type}
								</span>
							</div>

							<div className='mt-4 flex items-center justify-between'>
								<p className='font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground'>
									{offer.salary}
								</p>
								<Button
									variant='ghost'
									size='sm'
									className='text-primary hover:bg-primary/10 hover:text-primary'>
									Postuler
								</Button>
							</div>
						</div>
					))}
				</div>

				<div className='mt-10 text-center'>
					<Button
						variant='outline'
						size='lg'
						className='border-border text-foreground hover:bg-secondary'>
						Voir toutes les offres
					</Button>
				</div>
			</div>
		</section>
	);
}
