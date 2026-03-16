"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Badge } from "@/components/ui/badge";
import {
	Zap,
	MapPin,
	Briefcase,
	Calendar,
	Building2,
	Clock,
	Euro,
	Sun,
	Moon,
	Timer,
} from "lucide-react";

const contractTypeLabel = {
	// minuscules (format réel Supabase)
	cdi: "CDI",
	cdd: "CDD",
	freelance: "Freelance",
	stage: "Stage",
	alternance: "Alternance",
	// camelCase legacy
	full_time: "CDI",
	part_time: "CDD",
	internship: "Stage",
	apprentice: "Alternance",
};

const categoryLabel = {
	asc: "Agent de sécurité cynophile",
	aps: "Agent de prévention et sécurité",
	ssiap1: "SSIAP 1",
	ssiap2: "SSIAP 2",
	ssiap3: "SSIAP 3",
	apr: "Agent de protection rapprochée",
	ti: "Télésurveillance",
};

const workScheduleLabel = { daily: "Journée", nightly: "Nuit", mixed: "Mixte" };
const workTimeLabel = { fulltime: "Temps plein", parttime: "Temps partiel" };

function formatDate(dateStr) {
	if (!dateStr) return null;
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function parseListField(value) {
	if (!value) return null;
	if (Array.isArray(value)) return value.length > 0 ? value : null;
	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
		} catch {
			return value.trim() ? value : null;
		}
	}
	return null;
}

function getSalaryDisplay(job) {
	if (job.salary_type === "selon_profil") return "Selon profil";
	if (job.salary_hourly) return `${job.salary_hourly} €/h`;
	if (job.salary_monthly_min && job.salary_monthly_max)
		return `${job.salary_monthly_min} – ${job.salary_monthly_max} €/mois`;
	if (job.salary_monthly_fixed) return `${job.salary_monthly_fixed} €/mois`;
	if (job.salary_annual_min && job.salary_annual_max)
		return `${job.salary_annual_min} – ${job.salary_annual_max} €/an`;
	if (job.salary_annual_fixed) return `${job.salary_annual_fixed} €/an`;
	if (job.salary_min && job.salary_max)
		return `${job.salary_min} – ${job.salary_max} €`;
	if (job.salary_amount) return `${job.salary_amount} €`;
	return "Selon profil";
}

export default function JobPage() {
	const { id } = useParams();
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		if (!id) return;
		supabase
			.from("jobs")
			.select("*, companies(name, logo_url)")
			.eq("id", id)
			.single()
			.then(({ data, error }) => {
				setLoading(false);
				if (error || !data) setNotFound(true);
				else setJob(data);
			});
	}, [id]);

	if (loading) {
		return (
			<div className='min-h-dvh flex items-center justify-center'>
				<div className='h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
			</div>
		);
	}

	if (notFound) {
		return (
			<div className='min-h-dvh flex flex-col items-center justify-center gap-3 text-center px-4'>
				<p className='text-4xl'>🔍</p>
				<h1 className='text-xl font-semibold'>Offre introuvable</h1>
				<p className='text-sm text-muted-foreground'>
					Cette offre n&apos;existe pas ou a été supprimée.
				</p>
			</div>
		);
	}

	const company = job.companies;
	const salary = getSalaryDisplay(job);
	const location = [
		job.city,
		job.department !== job.city ? job.department : null,
		job.region,
	]
		.filter(Boolean)
		.join(", ");

	return (
		<div className='min-h-dvh bg-background'>
			<div className='max-w-2xl mx-auto px-4 py-10'>
				{/* Header entreprise */}
				<div className='flex items-center gap-4 mb-6'>
					{company?.logo_url ? (
						<img
							src={company.logo_url}
							alt={company.name}
							className='h-14 w-14 rounded-xl object-cover border shrink-0'
						/>
					) : (
						<div className='h-14 w-14 rounded-xl bg-muted border flex items-center justify-center shrink-0'>
							<Building2 className='w-6 h-6 text-muted-foreground' />
						</div>
					)}
					<div>
						<p className='text-sm text-muted-foreground font-medium'>
							{company?.name || "Entreprise"}
						</p>
						<h1 className='text-xl font-bold leading-tight flex items-center gap-2 flex-wrap'>
							{job.title}
							{job.isLastMinute && (
								<span className='inline-flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5'>
									<Zap
										className='w-3 h-3'
										fill='currentColor'
									/>
									Last Minute
								</span>
							)}
						</h1>
					</div>
				</div>

				{/* Badges rapides */}
				<div className='flex flex-wrap gap-2 mb-6'>
					{location && (
						<Badge
							variant='outline'
							className='flex items-center gap-1.5'>
							<MapPin className='w-3.5 h-3.5' />
							{location}
						</Badge>
					)}
					{job.contract_type && (
						<Badge
							variant='outline'
							className='flex items-center gap-1.5'>
							<Briefcase className='w-3.5 h-3.5' />
							{contractTypeLabel[job.contract_type] ??
								job.contract_type.toUpperCase()}
						</Badge>
					)}
					{job.category && (
						<Badge variant='secondary'>
							{categoryLabel[job.category] ?? job.category}
						</Badge>
					)}
					{job.work_schedule &&
						workScheduleLabel[job.work_schedule] && (
							<Badge
								variant='outline'
								className='flex items-center gap-1.5'>
								{job.work_schedule === "nightly" ? (
									<Moon className='w-3.5 h-3.5' />
								) : (
									<Sun className='w-3.5 h-3.5' />
								)}
								{workScheduleLabel[job.work_schedule]}
							</Badge>
						)}
					{job.work_time && workTimeLabel[job.work_time] && (
						<Badge
							variant='outline'
							className='flex items-center gap-1.5'>
							<Timer className='w-3.5 h-3.5' />
							{workTimeLabel[job.work_time]}
						</Badge>
					)}
					{salary && (
						<Badge
							variant='outline'
							className='flex items-center gap-1.5'>
							<Euro className='w-3.5 h-3.5' />
							{salary}
						</Badge>
					)}
					{job.start_date_asap ? (
						<Badge
							variant='outline'
							className='flex items-center gap-1.5'>
							<Calendar className='w-3.5 h-3.5' />
							Dès que possible
						</Badge>
					) : job.start_date ? (
						<Badge
							variant='outline'
							className='flex items-center gap-1.5'>
							<Calendar className='w-3.5 h-3.5' />
							Début {formatDate(job.start_date)}
						</Badge>
					) : null}
					{job.end_date && (
						<Badge
							variant='outline'
							className='flex items-center gap-1.5'>
							<Clock className='w-3.5 h-3.5' />
							Fin {formatDate(job.end_date)}
						</Badge>
					)}
				</div>

				{/* Séparateur */}
				<hr className='mb-6' />

				{/* Description */}
				{job.description?.trim() ? (
					<p className='text-sm text-foreground whitespace-pre-wrap leading-relaxed'>
						{job.description.trim()}
					</p>
				) : (
					<p className='text-muted-foreground text-sm'>
						Aucune description disponible.
					</p>
				)}

				{/* Missions */}
				{(() => {
					const items = parseListField(job.missions);
					if (!items) return null;
					return (
						<div className='mt-2'>
							<h2 className='text-sm font-semibold mb-2'>
								Missions
							</h2>
							{Array.isArray(items) ? (
								<ul className='list-disc list-inside space-y-1'>
									{items.map((item, i) => (
										<li
											key={i}
											className='text-sm text-foreground'>
											{item}
										</li>
									))}
								</ul>
							) : (
								<p className='text-sm text-foreground whitespace-pre-wrap leading-relaxed'>
									{items}
								</p>
							)}
						</div>
					);
				})()}

				{/* Profil recherché */}
				{(() => {
					const items = parseListField(job.searched_profile);
					if (!items) return null;
					return (
						<div className='mt-8'>
							<h2 className='text-sm font-semibold mb-2'>
								Profil recherché
							</h2>
							{Array.isArray(items) ? (
								<ul className='list-disc list-inside space-y-1'>
									{items.map((item, i) => (
										<li
											key={i}
											className='text-sm text-foreground'>
											{item}
										</li>
									))}
								</ul>
							) : (
								<p className='text-sm text-foreground whitespace-pre-wrap leading-relaxed'>
									{items}
								</p>
							)}
						</div>
					);
				})()}

				{/* Avantages */}
				{(job.accommodations ||
					job.packed_lunch ||
					job.reimbursements ||
					job.vacations) && (
					<div className='mt-8'>
						<h2 className='text-sm font-semibold mb-3'>
							Avantages
						</h2>
						<div className='flex flex-wrap gap-2'>
							{job.accommodations && (
								<Badge variant='secondary'>Logement</Badge>
							)}
							{job.packed_lunch && (
								<Badge variant='secondary'>Panier repas</Badge>
							)}
							{job.reimbursements && (
								<Badge variant='secondary'>
									Remboursements
								</Badge>
							)}
							{job.vacations && (
								<Badge variant='secondary'>Congés payés</Badge>
							)}
						</div>
					</div>
				)}

				{/* Footer */}
				<div className='mt-10 pt-6 border-t text-xs text-muted-foreground'>
					Publiée le {formatDate(job.created_at)}
				</div>
			</div>
		</div>
	);
}
