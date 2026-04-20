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
								WeSafe
							</span>
						</Link>
						<p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
							La plateforme de recrutement dédiée aux
							professionnels de la sécurité privée.
						</p>
					</div>

					<div>
						<h4 className='font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground'>
							Produit
						</h4>
						<ul className='mt-4 flex flex-col gap-3'>
							<li>
								<Link
									href='/tarifs'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Tarifs
								</Link>
							</li>
							<li>
								<Link
									href='/jobs'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Offres d'emploi
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
									href='/a-propos'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									À propos
								</Link>
							</li>
							<li>
								<Link
									href='/blog'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href='/contact'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground'>
							Légal
						</h4>
						<ul className='mt-4 flex flex-col gap-3'>
							<li>
								<Link
									href='/mentions-legales'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Mentions légales
								</Link>
							</li>
							<li>
								<Link
									href='/politique-de-confidentialite'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Politique de confidentialité
								</Link>
							</li>
							<li>
								<Link
									href='/conditions-generales-d-utilisation'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Conditions générales d'utilisation
								</Link>
							</li>
							<li>
								<Link
									href='/conditions-generales-de-vente'
									className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
									Conditions générales de vente
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-12 border-t border-border pt-8 text-center'>
					<p className='text-sm text-muted-foreground'>
						© {new Date().getFullYear()} WeSafe. Tous droits
						réservés.
					</p>
				</div>
			</div>
		</footer>
	);
}
