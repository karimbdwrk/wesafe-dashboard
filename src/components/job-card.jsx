import Link from "next/link";
import { MapPin, Clock, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY } from "@/constants/categories";

// ─── Constantes partagées ──────────────────────────────────────────────────────

export const contractTypeLabel = { cdi: "CDI", cdd: "CDD" };

// ─── Utilitaires partagés ──────────────────────────────────────────────────────

export function getCatAcronym(id) {
	return (
		CATEGORY.find((c) => c.id === id)?.acronym ?? id?.toUpperCase() ?? ""
	);
}

export function getSalaryDisplay(job) {
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

export function getLocation(job) {
	return [
		job.city,
		job.department !== job.city ? job.department : null,
		job.region,
	]
		.filter(Boolean)
		.join(", ");
}

export function formatRelativeDate(dateStr) {
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

// ─── Skeleton ──────────────────────────────────────────────────────────────────

export function JobCardSkeleton() {
	return (
		<div className='rounded-xl border border-border bg-card p-4 animate-pulse'>
			<div className='flex items-start gap-3'>
				<div className='h-10 w-10 rounded-lg bg-muted shrink-0' />
				<div className='flex-1 space-y-2 pr-16'>
					<div className='h-3 w-24 bg-muted rounded' />
					<div className='h-4 w-40 bg-muted rounded' />
					<div className='flex gap-2 mt-2'>
						<div className='h-4 w-20 bg-muted rounded' />
						<div className='h-4 w-12 bg-muted rounded' />
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Contenu interne partagé ───────────────────────────────────────────────────

function JobCardContent({ job, salary, location, relativeDate }) {
	const company = job.companies;

	return (
		<>
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
						{job.category && (
							<span className='rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground'>
								{getCatAcronym(job.category)}
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
		</>
	);
}

// ─── Composant principal ───────────────────────────────────────────────────────
//
// Deux modes :
//   - Mode lien  : passer `href` → la carte est un <Link>, bouton "Postuler"
//                  visible si `onApply` est fourni
//   - Mode bouton: passer `onClick` → la carte est un <button>, pas de postuler
//                  `selected` active le style sélectionné
//
// Props :
//   job       {object}   Objet job avec companies join
//   href      {string?}  Lien de la page détail (active le mode lien)
//   onClick   {fn?}      Handler de clic (active le mode bouton)
//   selected  {bool?}    Surligne la carte (mode bouton)
//   onApply   {fn?}      Affiche le bouton "Postuler" et appelle cette fn

export function JobCard({ job, href, onClick, selected = false, onApply }) {
	const salary = getSalaryDisplay(job);
	const location = getLocation(job);
	const relativeDate = formatRelativeDate(job.created_at);

	const sharedContent = (
		<JobCardContent
			job={job}
			salary={salary}
			location={location}
			relativeDate={relativeDate}
		/>
	);

	if (href) {
		return (
			<Link
				href={href}
				className='group relative rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm block'>
				{sharedContent}
				{onApply && (
					<div className='mt-3 pt-3 border-t border-border flex justify-end'>
						<Button
							size='sm'
							variant='ghost'
							className='text-primary hover:bg-primary/10 hover:text-primary h-7 text-xs'
							onClick={(e) => {
								e.preventDefault();
								onApply();
							}}>
							Postuler
						</Button>
					</div>
				)}
			</Link>
		);
	}

	return (
		<button
			type='button'
			onClick={onClick}
			className={`w-full text-left group relative rounded-xl border p-4 transition-all focus:outline-none ${
				selected
					? "border-primary bg-primary/5 shadow-sm"
					: "border-border bg-card hover:border-primary/40 hover:shadow-sm"
			}`}>
			{sharedContent}
		</button>
	);
}
