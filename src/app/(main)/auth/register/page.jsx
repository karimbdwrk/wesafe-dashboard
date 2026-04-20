import Link from "next/link";
import { Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "../_components/register-form";
import { GoogleButton } from "../_components/social-auth/google-button";

const APPSTORE_URL = "https://apps.apple.com/app/wesafe";
const PLAYSTORE_URL =
	"https://play.google.com/store/apps/details?id=com.wesafe";

export default function RegisterV1() {
	return (
		<div className='flex h-dvh'>
			<div className='flex w-full items-center justify-center bg-background p-8 lg:w-2/3'>
				<div className='w-full max-w-md space-y-10 py-24 lg:py-32'>
					{/* Bannière inscription via app */}
					<div className='rounded-xl border border-border bg-card p-6 text-center space-y-4'>
						<div className='text-4xl'>📱</div>
						<div className='space-y-2'>
							<h2 className='text-lg font-semibold text-foreground'>
								Inscription via l&apos;application
							</h2>
							<p className='text-sm text-muted-foreground leading-relaxed'>
								Les inscriptions se font exclusivement depuis
								l&apos;application mobile WeSafe. Téléchargez-la
								gratuitement sur iOS ou Android pour créer votre
								compte.
							</p>
						</div>
						<div className='flex flex-col gap-2 sm:flex-row sm:justify-center'>
							<Button
								asChild
								className='gap-2 bg-black hover:bg-zinc-800 text-white'>
								<a
									href={APPSTORE_URL}
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										viewBox='0 0 24 24'
										className='h-4 w-4'
										fill='currentColor'
										aria-hidden='true'>
										<path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
									</svg>
									App Store
								</a>
							</Button>
							<Button asChild variant='outline' className='gap-2'>
								<a
									href={PLAYSTORE_URL}
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										viewBox='0 0 24 24'
										className='h-4 w-4'
										fill='currentColor'
										aria-hidden='true'>
										<path d='M3.18 23.76c.3.17.64.22.99.14l.11-.06 12.44-7.18-2.7-2.71zM.44 2.08A1.55 1.55 0 0 0 0 3.19v17.62c0 .43.16.83.44 1.11l.06.06 9.87-9.87v-.23zM20.13 10.4l-2.65-1.53-3 3 3 3 2.67-1.54c.76-.44.76-1.49-.02-1.93zM3.18.24l10.84 10.86 2.7-2.7L3.29.1A1.16 1.16 0 0 0 3.18.24z' />
									</svg>
									Google Play
								</a>
							</Button>
						</div>
						<p className='text-xs text-muted-foreground'>
							Déjà un compte ?{" "}
							<Link
								prefetch={false}
								href='login'
								className='text-primary hover:underline'>
								Se connecter
							</Link>
						</p>
					</div>

					{/* Formulaire flouté */}
					<div className='relative select-none' aria-hidden='true'>
						<div className='blur-sm pointer-events-none space-y-4'>
							<div className='space-y-4 text-center'>
								<div className='font-medium tracking-tight'>
									Register
								</div>
								<div className='mx-auto max-w-xl text-muted-foreground'>
									Fill in your details below.
								</div>
							</div>
							<div className='space-y-4'>
								<RegisterForm />
								<GoogleButton
									className='w-full'
									variant='outline'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='hidden bg-primary lg:block lg:w-1/3'>
				<div className='flex h-full flex-col items-center justify-center p-12 text-center'>
					<div className='space-y-6'>
						<Command className='mx-auto size-12 text-primary-foreground' />
						<div className='space-y-2'>
							<h1 className='font-light text-5xl text-primary-foreground'>
								Welcome!
							</h1>
							<p className='text-primary-foreground/80 text-xl'>
								You&apos;re in the right place.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
