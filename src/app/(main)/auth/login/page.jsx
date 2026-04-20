import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { LoginForm } from "../_components/login-form";

export default function LoginV1() {
	return (
		<div className='flex h-dvh'>
			{/* Bouton retour */}
			<Link
				href='/'
				className='absolute top-4 left-4 flex items-center gap-1.5 text-sm text-white hover:text-gray-300 transition-colors z-10'>
				<ArrowLeft className='h-4 w-4' />
				Accueil
			</Link>
			<div className='hidden bg-primary lg:block lg:w-1/3'>
				<div className='flex h-full flex-col items-center justify-center p-12 text-center'>
					<div className='space-y-6'>
						<Shield className='mx-auto size-12 text-primary-foreground' />
						<div className='space-y-2'>
							<h1 className='font-light text-5xl text-primary-foreground'>
								Bon retour
							</h1>
							<p className='text-primary-foreground/80 text-xl'>
								Connectez-vous pour continuer
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='flex w-full items-center justify-center bg-background p-8 lg:w-2/3'>
				<div className='w-full max-w-md space-y-10 py-24 lg:py-32'>
					<div className='space-y-4 text-center'>
						<div className='font-medium tracking-tight'>
							Connexion
						</div>
						<div className='mx-auto max-w-xl text-muted-foreground'>
							Bienvenue sur WeSafe. Entrez vos identifiants pour
							accéder à votre espace.
						</div>
					</div>
					<div className='space-y-4'>
						<LoginForm />
						<p className='text-center text-muted-foreground text-xs'>
							Pas encore de compte ?{" "}
							<Link
								prefetch={false}
								href='register'
								className='text-primary hover:underline'>
								Télécharger l&apos;application
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
