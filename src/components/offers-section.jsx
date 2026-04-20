"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase/supabaseClient";
import { JobCard, JobCardSkeleton } from "@/components/job-card";

const APPSTORE_URL = "https://apps.apple.com/app/wesafe";
const PLAYSTORE_URL =
	"https://play.google.com/store/apps/details?id=com.wesafe";

export function OffersSection() {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [applyOpen, setApplyOpen] = useState(false);

	useEffect(() => {
		supabase
			.from("jobs")
			.select("*, companies(name, logo_url)")
			.eq("status", "published")
			.neq("isLastMinute", true)
			.order("sponsorship_date", { ascending: false, nullsFirst: false })
			.order("created_at", { ascending: false })
			.limit(6)
			.then(({ data }) => {
				setJobs(data ?? []);
				setLoading(false);
			});
	}, []);

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
						Des offres mises à jour en temps réel
					</h2>
					<p className='mt-4 text-lg text-muted-foreground'>
						Offres classiques et missions last minute dans toute la
						France.
					</p>
				</div>

				<div className='mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{loading
						? Array.from({ length: 6 }).map((_, i) => (
								<JobCardSkeleton key={i} />
							))
						: jobs.map((job) => (
								<JobCard
									key={job.id}
									job={job}
									href={`/jobs/${job.id}`}
									onApply={() => setApplyOpen(true)}
								/>
							))}
				</div>

				<div className='mt-10 text-center'>
					<Button
						asChild
						variant='outline'
						size='lg'
						className='border-border text-foreground hover:bg-secondary'>
						<Link href='/jobs'>Voir toutes les offres</Link>
					</Button>
				</div>
			</div>

			{/* AlertDialog téléchargement */}
			<AlertDialog open={applyOpen} onOpenChange={setApplyOpen}>
				<AlertDialogContent className='max-w-sm text-center'>
					<button
						type='button'
						onClick={() => setApplyOpen(false)}
						className='absolute top-3 right-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity'>
						<X className='h-4 w-4' />
						<span className='sr-only'>Fermer</span>
					</button>
					<AlertDialogHeader className='items-center'>
						<div className='text-4xl mb-2'>📱</div>
						<AlertDialogTitle className='text-xl'>
							Postulez depuis l&apos;application
						</AlertDialogTitle>
						<AlertDialogDescription className='text-sm text-muted-foreground leading-relaxed'>
							Pour postuler à cette offre et suivre vos
							candidatures en temps réel, téléchargez
							l&apos;application mobile WeSafe. Disponible
							gratuitement sur iOS et Android.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className='flex-col gap-2 sm:flex-col'>
						<Button
							asChild
							className='w-full bg-black hover:bg-zinc-800 text-white gap-2'>
							<a
								href={APPSTORE_URL}
								target='_blank'
								rel='noopener noreferrer'>
								<svg
									viewBox='0 0 24 24'
									className='h-4 w-4 fill-current'
									aria-hidden='true'>
									<path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04l-.06.18zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
								</svg>
								Télécharger sur l&apos;App Store
							</a>
						</Button>
						<Button
							asChild
							variant='outline'
							className='w-full gap-2'>
							<a
								href={PLAYSTORE_URL}
								target='_blank'
								rel='noopener noreferrer'>
								<svg
									viewBox='0 0 24 24'
									className='h-4 w-4 fill-current'
									aria-hidden='true'>
									<path d='M3.18 23.76c.3.17.64.22.98.15l12.09-6.98-2.67-2.67-10.4 9.5zM.5 1.48C.19 1.82 0 2.33 0 3v18c0 .67.19 1.18.5 1.52l.08.08 10.08-10.08v-.24L.58 1.4l-.08.08zM20.27 10.43l-2.73-1.58-3 2.99 3 2.99 2.74-1.58c.78-.45.78-1.37-.01-1.82zM4.16.24L16.25 7.22l-2.67 2.67L3.18.39C3.48.32 3.86.07 4.16.24z' />
								</svg>
								Télécharger sur Google Play
							</a>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</section>
	);
}
