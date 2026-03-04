import { Shield } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer
			id='contact'
			className='border-t border-border bg-card/50 py-16'>
			<div className='mx-auto max-w-7xl px-6'>
				<div className='grid gap-10 md:grid-cols-4'>
					<div className='md:col-span-1'>
						<Link href='/' className='flex items-center gap-2'>
							<div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary'>
								<Shield className='h-5 w-5 text-primary-foreground' />
							</div>
							<span className='font-[family-name:var(--font-heading)] text-xl font-bold text-foreground'>
								SecuRecruit
							</span>
						</Link>
						<p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
							La plateforme de recrutement dediee aux
							professionnels de la securite privee.
						</p>
					</div>

					<div>
						<h4 className='font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground'>
							Produit
						</h4>
						<ul className='mt-4 flex flex-col gap-3'>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Fonctionnalites
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Tarifs
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Offres d&apos;emploi
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Last Minute
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground'>
							Entreprise
						</h4>
						<ul className='mt-4 flex flex-col gap-3'>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									A propos
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Carrieres
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground'>
							Legal
						</h4>
						<ul className='mt-4 flex flex-col gap-3'>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Mentions legales
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Confidentialite
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									CGU
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-12 border-t border-border pt-8 text-center'>
					<p className='text-sm text-muted-foreground'>
						SecuRecruit. Tous droits reserves.
					</p>
				</div>
			</div>
		</footer>
	);
}
