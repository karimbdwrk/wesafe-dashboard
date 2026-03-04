import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
	return (
		<section className='py-20 md:py-32'>
			<div className='mx-auto max-w-7xl px-6'>
				<div className='relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16'>
					{/* Background glow */}
					<div className='pointer-events-none absolute inset-0'>
						<div className='absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]' />
						<div className='absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]' />
					</div>

					<div className='relative mx-auto max-w-2xl text-center'>
						<h2 className='font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl text-balance'>
							Pret a transformer votre recrutement ?
						</h2>
						<p className='mt-4 text-lg leading-relaxed text-muted-foreground'>
							Rejoignez des milliers de professionnels de la
							securite qui font deja confiance a SecuRecruit.
							Telechargez l&apos;application gratuitement.
						</p>

						<div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
							{/* App Store */}
							<Button
								size='lg'
								className='bg-foreground text-background hover:bg-foreground/90 gap-3 px-6'>
								<svg
									viewBox='0 0 24 24'
									className='h-6 w-6 fill-current'
									aria-hidden='true'>
									<path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
								</svg>
								<div className='text-left'>
									<p className='text-xs opacity-70'>
										Telecharger sur
									</p>
									<p className='text-sm font-semibold'>
										App Store
									</p>
								</div>
							</Button>

							{/* Google Play */}
							<Button
								size='lg'
								className='bg-foreground text-background hover:bg-foreground/90 gap-3 px-6'>
								<svg
									viewBox='0 0 24 24'
									className='h-6 w-6 fill-current'
									aria-hidden='true'>
									<path d='M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.49l-2.302 2.302-8.634-8.634z' />
								</svg>
								<div className='text-left'>
									<p className='text-xs opacity-70'>
										Disponible sur
									</p>
									<p className='text-sm font-semibold'>
										Google Play
									</p>
								</div>
							</Button>
						</div>

						<p className='mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
							<ArrowRight className='h-4 w-4 text-primary' />
							Inscription gratuite, sans engagement
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
