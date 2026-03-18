"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Building2,
	User,
	Calendar,
	Clock,
	MapPin,
	Euro,
	Briefcase,
	FileText,
	ShieldCheck,
	ChevronRight,
	Check,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function getInitials(firstname, lastname) {
	return `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase() || "?";
}

// ─── Static example articles ──────────────────────────────────────────────────

const EXAMPLE_ARTICLES = [
	{
		id: 1,
		title: "Engagement",
		content:
			"L'Employeur engage le Salarié en qualité d'Agent de sécurité, Statut Employé, à compter du 1er avril 2026, sous réserve de la réalisation des conditions suspensives.",
	},
	{
		id: 2,
		title: "Durée du travail",
		content:
			"Le Salarié est engagé à temps plein pour une durée hebdomadaire de 35 heures, réparties selon les plannings établis par l'Employeur.",
	},
	{
		id: 3,
		title: "Rémunération",
		content:
			"Le Salarié percevra un salaire brut mensuel de 1 900,00 € pour 151,67 heures mensuelles, versé le dernier jour ouvré de chaque mois.",
	},
	{
		id: 4,
		title: "Lieu de travail",
		content:
			"Le Salarié exercera ses fonctions principalement à Lyon et dans le département du Rhône, sans que cette mention ne constitue une clause de stabilité géographique.",
	},
	{
		id: 5,
		title: "Convention collective",
		content:
			"Le contrat est soumis à la Convention Collective Nationale des Entreprises de Prévention et de Sécurité (IDCC 1351).",
	},
	{
		id: 6,
		title: "Période d'essai",
		content:
			"Le contrat est conclu avec une période d'essai de 2 mois, renouvelable une fois dans les conditions prévues par la convention collective.",
	},
];

// ─── Info chip ────────────────────────────────────────────────────────────────

function InfoChip({ icon: Icon, label, value }) {
	if (!value) return null;
	return (
		<div className='flex items-start gap-3 rounded-xl border bg-card px-4 py-3'>
			<div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
				<Icon className='h-4 w-4 text-primary' />
			</div>
			<div className='min-w-0'>
				<p className='text-xs text-muted-foreground'>{label}</p>
				<p className='text-sm font-semibold truncate'>{value}</p>
			</div>
		</div>
	);
}

// ─── Article row ──────────────────────────────────────────────────────────────

function ArticleRow({ number, title, content }) {
	return (
		<div className='group flex gap-4'>
			<div className='flex flex-col items-center'>
				<div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold'>
					{number}
				</div>
				<div className='mt-2 w-px flex-1 bg-border group-last:hidden' />
			</div>
			<div className='pb-6 pt-0.5 min-w-0'>
				<p className='text-sm font-semibold mb-1'>{title}</p>
				<p className='text-sm text-muted-foreground leading-relaxed'>
					{content}
				</p>
			</div>
		</div>
	);
}

// ─── Party card ───────────────────────────────────────────────────────────────

function PartyCard({ label, name, role, avatarUrl, initials }) {
	return (
		<div className='flex-1 rounded-xl border bg-card p-4 space-y-3 min-w-0'>
			<p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
				{label}
			</p>
			<div className='flex items-center gap-3'>
				{avatarUrl ? (
					<img
						src={avatarUrl}
						alt={name}
						className='h-10 w-10 rounded-full object-cover border shrink-0'
					/>
				) : (
					<div className='h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground text-xs font-bold'>
						{initials}
					</div>
				)}
				<div className='min-w-0'>
					<p className='text-sm font-semibold truncate'>{name}</p>
					{role && (
						<p className='text-xs text-muted-foreground truncate'>
							{role}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContractPage() {
	const { uuid } = useParams();
	const [contract, setContract] = useState(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		if (!uuid) return;
		supabase
			.from("contracts")
			.select("*, companies(*), profiles(*)")
			.eq("id", uuid)
			.single()
			.then(({ data, error }) => {
				setLoading(false);
				if (error || !data) {
					console.error("[contracts] erreur:", error);
					setNotFound(true);
					return;
				}
				console.log("[contracts] data:", data);
				setContract(data);
			});
	}, [uuid]);

	// ── Loading ──────────────────────────────────────────────────────────────
	if (loading) {
		return (
			<div className='min-h-dvh flex items-center justify-center'>
				<div className='h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
			</div>
		);
	}

	// ── Not found ────────────────────────────────────────────────────────────
	if (notFound) {
		return (
			<div className='min-h-dvh flex flex-col items-center justify-center gap-3 text-center px-4'>
				<p className='text-4xl'>📄</p>
				<h1 className='text-xl font-semibold'>Contrat introuvable</h1>
				<p className='text-sm text-muted-foreground'>
					Ce contrat n&apos;existe pas ou a été supprimé.
				</p>
			</div>
		);
	}

	// ── Derived values ───────────────────────────────────────────────────────
	const company = contract?.companies;
	const candidate = contract?.profiles;

	const contractTitle =
		contract?.title || contract?.type || "Contrat de travail CDI";
	const contractType = contract?.contract_type || contract?.type || "CDI";
	const startDate = contract?.start_date || contract?.starts_at;
	const endDate = contract?.end_date || contract?.ends_at;
	const salary = contract?.salary || contract?.salary_amount;
	const position =
		contract?.position || contract?.job_title || "Agent de sécurité";
	const location = contract?.location || company?.city || null;
	const hoursPerWeek =
		contract?.hours_per_week || contract?.weekly_hours || "35h / semaine";
	const trialPeriod = contract?.trial_period || "2 mois";
	const collective =
		contract?.collective_agreement ||
		"CCN Prévention et Sécurité (IDCC 1351)";

	const articles = EXAMPLE_ARTICLES;

	const statusConfig = {
		signed: { label: "Signé", variant: "default" },
		pending: { label: "En attente", variant: "secondary" },
		draft: { label: "Brouillon", variant: "outline" },
		rejected: { label: "Refusé", variant: "destructive" },
	};
	const status = statusConfig[contract?.status] || statusConfig.pending;

	return (
		<div className='min-h-dvh bg-muted/30 py-10 px-4 pt-24'>
			<div className='max-w-2xl mx-auto space-y-5'>
				{/* ── Header ─────────────────────────────────────────────── */}
				<div className='rounded-2xl border bg-card shadow-sm overflow-hidden'>
					<div className='h-2 bg-gradient-to-r from-primary to-primary/40' />
					<div className='p-6'>
						<div className='flex items-start justify-between gap-4 flex-wrap'>
							<div className='space-y-1.5'>
								<div className='flex items-center gap-2 flex-wrap'>
									<Badge variant={status.variant}>
										{status.label}
									</Badge>
									<Badge variant='outline'>
										{contractType}
									</Badge>
								</div>
								<h1 className='text-xl font-bold'>
									{contractTitle}
								</h1>
								{startDate && (
									<p className='text-sm text-muted-foreground flex items-center gap-1.5'>
										<Calendar className='h-3.5 w-3.5' />
										Prise de poste : {formatDate(startDate)}
										{endDate && ` → ${formatDate(endDate)}`}
									</p>
								)}
							</div>
							<div className='h-10 w-10 rounded-xl border bg-primary/10 flex items-center justify-center shrink-0'>
								<FileText className='h-5 w-5 text-primary' />
							</div>
						</div>
					</div>
				</div>

				{/* ── Key infos grid ──────────────────────────────────────── */}
				<div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
					<InfoChip icon={Briefcase} label='Poste' value={position} />
					{salary && (
						<InfoChip
							icon={Euro}
							label='Salaire brut'
							value={`${salary} €/mois`}
						/>
					)}
					<InfoChip
						icon={Clock}
						label='Temps de travail'
						value={
							typeof hoursPerWeek === "number"
								? `${hoursPerWeek}h / semaine`
								: hoursPerWeek
						}
					/>
					{location && (
						<InfoChip icon={MapPin} label='Lieu' value={location} />
					)}
					<InfoChip
						icon={ShieldCheck}
						label="Période d'essai"
						value={trialPeriod}
					/>
					<InfoChip
						icon={FileText}
						label='Convention'
						value={collective}
					/>
				</div>

				{/* ── Parties ─────────────────────────────────────────────── */}
				<div>
					<p className='text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2'>
						<User className='h-3.5 w-3.5' />
						Parties au contrat
					</p>
					<div className='flex gap-3 flex-wrap'>
						<PartyCard
							label='Employeur'
							name={company?.name || "WeSafe SAS"}
							role={company?.email || null}
							avatarUrl={
								company?.logo_url || company?.avatar || null
							}
							initials={(company?.name?.[0] || "W").toUpperCase()}
						/>
						<PartyCard
							label='Salarié'
							name={
								candidate
									? `${candidate.firstname || ""} ${candidate.lastname || ""}`.trim()
									: "Marie Martin"
							}
							role={candidate?.email || null}
							avatarUrl={candidate?.avatar_url || null}
							initials={
								candidate
									? getInitials(
											candidate.firstname,
											candidate.lastname,
										)
									: "MM"
							}
						/>
					</div>
				</div>

				{/* ── Articles ────────────────────────────────────────────── */}
				<div className='rounded-2xl border bg-card shadow-sm p-6'>
					<p className='text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2'>
						<FileText className='h-3.5 w-3.5' />
						Clauses du contrat
					</p>
					{articles.map((art, i) => (
						<ArticleRow
							key={art.id}
							number={i + 1}
							title={art.title}
							content={art.content}
						/>
					))}
				</div>

				{/* ── Signatures ──────────────────────────────────────────── */}
				<div className='rounded-2xl border bg-card shadow-sm p-6'>
					<p className='text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2'>
						<Check className='h-3.5 w-3.5' />
						Signatures
					</p>
					<div className='grid grid-cols-2 gap-4'>
						{[
							{
								label: "Pour l'Employeur",
								name: company?.name || "WeSafe SAS",
								signed: contract?.employer_signed_at,
							},
							{
								label: "Le Salarié",
								name: candidate
									? `${candidate.firstname || ""} ${candidate.lastname || ""}`.trim()
									: "Marie Martin",
								signed: contract?.candidate_signed_at,
							},
						].map((party) => (
							<div
								key={party.label}
								className='rounded-xl border p-4 space-y-3'>
								<p className='text-xs text-muted-foreground'>
									{party.label}
								</p>
								<p className='text-sm font-semibold'>
									{party.name}
								</p>
								{party.signed ? (
									<div className='flex items-center gap-1.5 text-xs text-green-600 font-medium'>
										<Check className='h-3.5 w-3.5' />
										Signé le {formatDate(party.signed)}
									</div>
								) : (
									<div className='h-10 border-b border-dashed border-border' />
								)}
							</div>
						))}
					</div>
				</div>

				{/* ── Footer ──────────────────────────────────────────────── */}
				<p className='text-center text-xs text-muted-foreground pb-4'>
					Document généré via WeSafe ·{" "}
					{formatDate(
						contract?.created_at || new Date().toISOString(),
					)}
				</p>
			</div>
		</div>
	);
}
