import Image from "next/image";
import iphonemockup from "@/assets/iphonemockup.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
	return (
		<section className='relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32'>
			{/* Background glow */}
			<div className='pointer-events-none absolute inset-0'>
				<div className='absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]' />
			</div>

			<div className='relative mx-auto max-w-7xl px-6'>
				<div className='flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20'>
					{/* Left content */}
					<div className='flex-1 text-center lg:text-left'>
						<div className='mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground'>
							<span className='h-2 w-2 rounded-full bg-primary' />
							Disponible sur App Store & Play Store
						</div>

						<h1 className='font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance'>
							Le recrutement en
							<span className='text-primary'> securite</span>,
							reinvente.
						</h1>

						<p className='mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:max-w-lg'>
							Trouvez les meilleurs agents de securite ou
							decrochez votre prochain poste en quelques clics.
							Offres classiques, missions last minute et contrats
							generes automatiquement.
						</p>

						<div className='mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start'>
							<Button
								size='lg'
								className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8'>
								Commencer gratuitement
								<ArrowRight className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='lg'
								className='border-border text-foreground hover:bg-secondary gap-2 px-8'>
								Voir la demo
							</Button>
						</div>

						{/* Stats */}
						<div className='mt-12 flex items-center justify-center gap-8 lg:justify-start'>
							<div>
								<p className='font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground'>
									12K+
								</p>
								<p className='text-sm text-muted-foreground'>
									Agents inscrits
								</p>
							</div>
							<div className='h-10 w-px bg-border' />
							<div>
								<p className='font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground'>
									850+
								</p>
								<p className='text-sm text-muted-foreground'>
									Entreprises
								</p>
							</div>
							<div className='h-10 w-px bg-border' />
							<div>
								<p className='font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground'>
									98%
								</p>
								<p className='text-sm text-muted-foreground'>
									Satisfaction
								</p>
							</div>
						</div>
					</div>

					{/* Right - iPhone mockup */}
					<div className='relative flex-shrink-0'>
						<div className='relative mx-auto w-xl'>
							{/* Phone frame */}
							<div className='relative overflow-hidden'>
								<Image
									src={iphonemockup}
									alt='SecuRecruit application mobile'
									width={800}
									height={720}
									className='w-full'
									priority
								/>
							</div>
							{/* Floating badge */}
							<div className='absolute -right-6 top-20 rounded-xl border border-border bg-card px-4 py-3 shadow-xl'>
								<p className='text-xs text-muted-foreground'>
									Nouvelle mission
								</p>
								<p className='font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground'>
									Agent SSIAP 1
								</p>
								<p className='text-xs text-primary'>
									Last minute
								</p>
							</div>
							{/* Floating badge bottom */}
							<div className='absolute -left-6 bottom-32 rounded-xl border border-border bg-card px-4 py-3 shadow-xl'>
								<p className='text-xs text-muted-foreground'>
									Contrat genere
								</p>
								<p className='font-[family-name:var(--font-heading)] text-sm font-semibold text-primary'>
									En 30 secondes
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
