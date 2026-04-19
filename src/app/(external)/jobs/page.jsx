"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	MapPin,
	Briefcase,
	Building2,
	Euro,
	Zap,
	Search,
	SlidersHorizontal,
	Moon,
	Sun,
	Timer,
	Clock,
	Calendar,
	ChevronLeft,
	ChevronRight,
	X,
} from "lucide-react";

// ─── Constantes ────────────────────────────────────────────────────────────────

const JOBS_PER_PAGE = 10;

const contractTypeLabel = {
	cdi: "CDI",
	cdd: "CDD",
	freelance: "Freelance",
	stage: "Stage",
	alternance: "Alternance",
	full_time: "CDI",
	part_time: "CDD",
	internship: "Stage",
	apprentice: "Alternance",
};

const categoryLabel = {
	asc: "Agent cynophile",
	aps: "Agent de sécurité",
	ssiap1: "SSIAP 1",
	ssiap2: "SSIAP 2",
	ssiap3: "SSIAP 3",
	apr: "Protection rapprochée",
	ti: "Télésurveillance",
};

const workScheduleLabel = {
	daily: "Journée",
	nightly: "Nuit",
	mixed: "Mixte",
	variable: "Variable",
};

const workTimeLabel = { fulltime: "Temps plein", parttime: "Temps partiel" };

const CONTRACT_OPTIONS = [
	{ value: "", label: "Tous contrats" },
	{ value: "cdi", label: "CDI" },
	{ value: "cdd", label: "CDD" },
	{ value: "freelance", label: "Freelance" },
	{ value: "stage", label: "Stage" },
	{ value: "alternance", label: "Alternance" },
];

const CATEGORY_OPTIONS = [
	{ value: "", label: "Toutes catégories" },
	{ value: "aps", label: "Agent de sécurité" },
	{ value: "ssiap1", label: "SSIAP 1" },
	{ value: "ssiap2", label: "SSIAP 2" },
	{ value: "ssiap3", label: "SSIAP 3" },
	{ value: "asc", label: "Agent cynophile" },
	{ value: "apr", label: "Protection rapprochée" },
	{ value: "ti", label: "Télésurveillance" },
];

// ─── Utilitaires ───────────────────────────────────────────────────────────────

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
	return null;
}

function getLocation(job) {
	return [
		job.city,
		job.department !== job.city ? job.department : null,
		job.region,
	]
		.filter(Boolean)
		.join(", ");
}

function formatRelativeDate(dateStr) {
	if (!dateStr) return null;
	const diff = Date.now() - new Date(dateStr).getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);
	if (minutes < 60) return `Il y a ${minutes} min`;
	if (hours < 24) return `Il y a ${hours}h`;
	if (days === 1) return "Hier";
	if (days < 7) return `Il y a ${days} jours`;
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
	});
}

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

// ─── Carte résumé (colonne gauche) ─────────────────────────────────────────────

function JobCard({ job, selected, onClick }) {
	const salary = getSalaryDisplay(job);
	const location = getLocation(job);
	const relativeDate = formatRelativeDate(job.created_at);
	const company = job.companies;

	return (
		<button
			type='button'
			onClick={onClick}
			className={`w-full text-left group relative rounded-xl border p-4 transition-all focus:outline-none ${
				selected
					? "border-primary bg-primary/5 shadow-sm"
					: "border-border bg-card hover:border-primary/40 hover:shadow-sm"
			}`}>
			{job.isLastMinute && (
				<div className='absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary'>
					<Zap className='h-2.5 w-2.5' />
					Last Minute
				</div>
			)}

			<div className='flex items-start gap-3'>
				{/* Logo */}
				<div className='shrink-0'>
					{company?.logo_url ? (
						<img
							src={company.logo_url}
							alt={company.name}
							className='h-10 w-10 rounded-lg object-cover border'
						/>
					) : (
						<div className='h-10 w-10 rounded-lg bg-muted border flex items-center justify-center'>
							<Building2 className='w-4 h-4 text-muted-foreground' />
						</div>
					)}
				</div>

				{/* Contenu */}
				<div className='min-w-0 flex-1 pr-16'>
					<p className='text-[11px] text-muted-foreground font-medium truncate'>
						{company?.name ?? "Entreprise"}
					</p>
					<p className='mt-0.5 text-sm font-semibold text-foreground leading-snug line-clamp-2'>
						{job.title}
					</p>

					<div className='mt-2 flex flex-wrap gap-1.5'>
						{location && (
							<span className='flex items-center gap-1 text-[11px] text-muted-foreground'>
								<MapPin className='h-3 w-3 shrink-0' />
								<span className='truncate max-w-30'>
									{location}
								</span>
							</span>
						)}
						{job.contract_type && (
							<span className='rounded border border-border px-1.5 py-0.5 text-[11px] font-medium text-foreground'>
								{contractTypeLabel[job.contract_type] ??
									job.contract_type.toUpperCase()}
							</span>
						)}
					</div>

					<div className='mt-2 flex items-center justify-between gap-2'>
						{salary && (
							<span className='text-xs font-semibold text-foreground'>
								{salary}
							</span>
						)}
						{relativeDate && (
							<span className='flex items-center gap-1 text-[11px] text-muted-foreground ml-auto'>
								<Clock className='h-3 w-3' />
								{relativeDate}
							</span>
						)}
					</div>
				</div>
			</div>
		</button>
	);
}

// ─── Panneau détail (colonne droite) ───────────────────────────────────────────

function JobDetail({ job, onClose }) {
	const company = job.companies;
	const salary = getSalaryDisplay(job);
	const location = getLocation(job);

	return (
		<div className='h-full overflow-y-auto px-6 py-8'>
			{/* Bouton retour (mobile) */}
			{onClose && (
				<button
					type='button'
					onClick={onClose}
					className='mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'>
					<ArrowLeft className='h-4 w-4' />
					Retour aux offres
				</button>
			)}

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
								<Zap className='w-3 h-3' fill='currentColor' />
								Last Minute
							</span>
						)}
					</h1>
				</div>
			</div>

			{/* Badges */}
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
				{job.work_schedule && workScheduleLabel[job.work_schedule] && (
					<Badge
						variant='outline'
						className='flex items-center gap-1.5'>
						{job.work_schedule === "nightly" ? (
							<Moon className='w-3.5 h-3.5' />
						) : job.work_schedule === "daily" ? (
							<Sun className='w-3.5 h-3.5' />
						) : (
							<Timer className='w-3.5 h-3.5' />
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
					<div className='mt-8'>
						<h2 className='text-sm font-semibold mb-2'>Missions</h2>
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

			{/* Diplômes / certifications */}
			{(() => {
				const diplomas = parseListField(job.diplomas_required);
				const certs = parseListField(job.certifications_required);
				if (!diplomas && !certs) return null;
				return (
					<div className='mt-8'>
						<h2 className='text-sm font-semibold mb-2'>
							Qualifications requises
						</h2>
						<div className='flex flex-wrap gap-2'>
							{diplomas?.map?.((d, i) => (
								<Badge key={i} variant='secondary'>
									{d}
								</Badge>
							))}
							{certs?.map?.((c, i) => (
								<Badge key={i} variant='secondary'>
									{c}
								</Badge>
							))}
						</div>
					</div>
				);
			})()}

			{/* Avantages */}
			{(job.accommodations ||
				job.packed_lunch ||
				job.reimbursements ||
				job.vacations) && (
				<div className='mt-8'>
					<h2 className='text-sm font-semibold mb-3'>Avantages</h2>
					<div className='flex flex-wrap gap-2'>
						{job.accommodations && (
							<Badge variant='secondary'>Logement</Badge>
						)}
						{job.packed_lunch && (
							<Badge variant='secondary'>Panier repas</Badge>
						)}
						{job.reimbursements && (
							<Badge variant='secondary'>Remboursements</Badge>
						)}
						{job.vacations && (
							<Badge variant='secondary'>Congés payés</Badge>
						)}
					</div>
				</div>
			)}

			{/* CTA */}
			<div className='mt-10 pt-6 border-t flex items-center justify-between gap-4 flex-wrap'>
				<p className='text-xs text-muted-foreground'>
					Publiée le {formatDate(job.created_at)}
				</p>
				<Button size='sm'>Postuler à cette offre</Button>
			</div>
		</div>
	);
}

// ─── Page principale ────────────────────────────────────────────────────────────

export default function JobsPage() {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [contractFilter, setContractFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedJob, setSelectedJob] = useState(null);
	const [page, setPage] = useState(1);

	useEffect(() => {
		supabase
			.from("jobs")
			.select("*, companies(name, logo_url)")
			.eq("status", "published")
			.order("created_at", { ascending: false })
			.then(({ data }) => {
				const list = data ?? [];
				setJobs(list);
				setLoading(false);
				if (list.length > 0) setSelectedJob(list[0]);
			});
	}, []);

	// Réinitialise la page quand les filtres changent
	useEffect(() => {
		setPage(1);
	}, [search, contractFilter, categoryFilter]);

	const filtered = jobs.filter((job) => {
		const q = search.toLowerCase();
		const matchSearch =
			!q ||
			job.title?.toLowerCase().includes(q) ||
			job.companies?.name?.toLowerCase().includes(q) ||
			job.city?.toLowerCase().includes(q) ||
			job.region?.toLowerCase().includes(q);
		const matchContract =
			!contractFilter || job.contract_type === contractFilter;
		const matchCategory =
			!categoryFilter || job.category === categoryFilter;
		return matchSearch && matchContract && matchCategory;
	});

	const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
	const paginated = filtered.slice(
		(page - 1) * JOBS_PER_PAGE,
		page * JOBS_PER_PAGE,
	);

	const router = useRouter();

	const handleSelectJob = useCallback(
		(job) => {
			if (window.innerWidth < 1024) {
				router.push(`/jobs/${job.id}`);
			} else {
				setSelectedJob(job);
			}
		},
		[router],
	);

	const activeFiltersCount = [contractFilter, categoryFilter].filter(
		Boolean,
	).length;

	return (
		<div className='min-h-dvh bg-background flex flex-col mt-12'>
			{/* ── Barre de recherche ── */}
			<div className='border-b border-border bg-card/50 px-4 py-5'>
				<div className='mx-auto max-w-7xl'>
					<div className='flex flex-col sm:flex-row gap-3'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
							<input
								type='text'
								placeholder='Poste, entreprise, ville…'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40'
							/>
						</div>
						<Button
							variant='outline'
							onClick={() => setShowFilters((v) => !v)}
							className='flex items-center gap-2 shrink-0'>
							<SlidersHorizontal className='h-4 w-4' />
							Filtres
							{activeFiltersCount > 0 && (
								<span className='ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold'>
									{activeFiltersCount}
								</span>
							)}
						</Button>
					</div>

					{showFilters && (
						<div className='mt-3 flex flex-col sm:flex-row gap-3'>
							<select
								value={contractFilter}
								onChange={(e) =>
									setContractFilter(e.target.value)
								}
								className='flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40'>
								{CONTRACT_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
							<select
								value={categoryFilter}
								onChange={(e) =>
									setCategoryFilter(e.target.value)
								}
								className='flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40'>
								{CATEGORY_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
							{activeFiltersCount > 0 && (
								<Button
									variant='ghost'
									size='sm'
									onClick={() => {
										setContractFilter("");
										setCategoryFilter("");
									}}
									className='text-muted-foreground flex items-center gap-1'>
									<X className='h-3.5 w-3.5' />
									Réinitialiser
								</Button>
							)}
						</div>
					)}
				</div>
			</div>

			{/* ── Corps deux colonnes ── */}
			<div
				className='flex-1 mx-auto w-full max-w-7xl flex overflow-hidden'
				style={{ height: "calc(100dvh - 112px)" }}>
				{/* ─ Colonne gauche (liste) ─ */}
				<div className='flex flex-col border-r border-border bg-background w-full lg:w-95 xl:w-105 shrink-0'>
					{/* Compteur */}
					<div className='px-4 py-3 border-b border-border shrink-0'>
						<p className='text-xs text-muted-foreground'>
							{loading
								? "Chargement…"
								: `${filtered.length} offre${filtered.length !== 1 ? "s" : ""}`}
						</p>
					</div>

					{/* Liste scrollable */}
					<div className='flex-1 overflow-y-auto px-3 py-3 space-y-2'>
						{loading ? (
							<div className='flex items-center justify-center py-16'>
								<div className='h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin' />
							</div>
						) : paginated.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-16 gap-2 text-center'>
								<p className='text-2xl'>🔍</p>
								<p className='text-sm font-medium'>
									Aucune offre trouvée
								</p>
								<p className='text-xs text-muted-foreground'>
									Modifiez vos critères de recherche.
								</p>
							</div>
						) : (
							paginated.map((job) => (
								<JobCard
									key={job.id}
									job={job}
									selected={selectedJob?.id === job.id}
									onClick={() => handleSelectJob(job)}
								/>
							))
						)}
					</div>

					{/* Pagination */}
					{!loading && totalPages > 1 && (
						<div className='shrink-0 border-t border-border px-4 py-3 flex items-center justify-between gap-2'>
							<Button
								variant='outline'
								size='sm'
								disabled={page === 1}
								onClick={() => setPage((p) => p - 1)}
								className='h-8 w-8 p-0'>
								<ChevronLeft className='h-4 w-4' />
							</Button>
							<span className='text-xs text-muted-foreground'>
								Page {page} / {totalPages}
							</span>
							<Button
								variant='outline'
								size='sm'
								disabled={page === totalPages}
								onClick={() => setPage((p) => p + 1)}
								className='h-8 w-8 p-0'>
								<ChevronRight className='h-4 w-4' />
							</Button>
						</div>
					)}
				</div>

				{/* ─ Colonne droite (détail) ─ */}
				<div className='flex-1 overflow-hidden hidden lg:block'>
					{selectedJob ? (
						<JobDetail job={selectedJob} onClose={null} />
					) : (
						<div className='h-full flex flex-col items-center justify-center gap-3 text-center px-8'>
							<Briefcase className='h-10 w-10 text-muted-foreground/40' />
							<p className='text-sm font-medium text-muted-foreground'>
								Sélectionnez une offre pour afficher son détail
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
