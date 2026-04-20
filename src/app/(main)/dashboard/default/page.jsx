"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	Briefcase,
	Users,
	FileText,
	BarChart2,
	MessageSquare,
	Plus,
	ArrowRight,
	Building2,
	ShieldCheck,
	ClipboardList,
	UserCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Quick links par rôle ─────────────────────────────────────────────────────

const COMPANY_LINKS = [
	{
		label: "Mes offres d'emploi",
		description: "Gérez et suivez toutes vos offres",
		href: "/dashboard/my-jobs",
		icon: Briefcase,
		color: "bg-blue-500/10 text-blue-500",
	},
	{
		label: "Publier une offre",
		description: "Créer une nouvelle annonce",
		href: "/dashboard/my-jobs?new=true",
		icon: Plus,
		color: "bg-emerald-500/10 text-emerald-500",
	},
	{
		label: "Messagerie",
		description: "Vos échanges avec les candidats",
		href: "/dashboard/messages",
		icon: MessageSquare,
		color: "bg-violet-500/10 text-violet-500",
	},
];

const ADMIN_LINKS = [
	{
		label: "Utilisateurs",
		description: "Gérer tous les comptes",
		href: "/dashboard/users",
		icon: Users,
		color: "bg-blue-500/10 text-blue-500",
	},
	{
		label: "Offres d'emploi",
		description: "Toutes les annonces publiées",
		href: "/dashboard/jobs",
		icon: Briefcase,
		color: "bg-amber-500/10 text-amber-500",
	},
	{
		label: "Messagerie",
		description: "Conversations en cours",
		href: "/dashboard/messages",
		icon: MessageSquare,
		color: "bg-violet-500/10 text-violet-500",
	},
	{
		label: "Finance",
		description: "Suivi des paiements",
		href: "/dashboard/finance",
		icon: BarChart2,
		color: "bg-emerald-500/10 text-emerald-500",
	},
	{
		label: "Contrats",
		description: "Contrats actifs et archivés",
		href: "/dashboard/contracts",
		icon: FileText,
		color: "bg-rose-500/10 text-rose-500",
	},
];

const CANDIDATE_LINKS = [
	{
		label: "Mes candidatures",
		description: "Suivez l'avancement de vos dossiers",
		href: "/dashboard/my-applications",
		icon: ClipboardList,
		color: "bg-blue-500/10 text-blue-500",
	},
	{
		label: "Offres disponibles",
		description: "Explorez les annonces du moment",
		href: "/dashboard/jobs",
		icon: Briefcase,
		color: "bg-amber-500/10 text-amber-500",
	},
	{
		label: "Mes contrats",
		description: "Contrats en attente de signature",
		href: "/dashboard/contracts",
		icon: FileText,
		color: "bg-emerald-500/10 text-emerald-500",
	},
	{
		label: "Mon profil",
		description: "Complétez et mettez à jour votre profil",
		href: "/dashboard/profile",
		icon: UserCircle,
		color: "bg-violet-500/10 text-violet-500",
	},
];

// ─── Skeleton card ─────────────────────────────────────────────────────────────

function CardSkeleton() {
	return (
		<Card className='animate-pulse'>
			<CardContent className='p-5 flex items-start gap-4'>
				<Skeleton className='size-11 rounded-xl shrink-0' />
				<div className='flex-1 space-y-2 pt-1'>
					<Skeleton className='h-4 w-36' />
					<Skeleton className='h-3 w-24' />
				</div>
			</CardContent>
		</Card>
	);
}

// ─── Quick link card ───────────────────────────────────────────────────────────

function QuickLinkCard({ label, description, href, icon: Icon, color }) {
	return (
		<Link href={href}>
			<Card className='group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full'>
				<CardContent className='p-5 flex items-start gap-4'>
					<div
						className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
						<Icon className='size-5' />
					</div>
					<div className='flex-1 min-w-0'>
						<p className='font-medium text-sm text-foreground'>
							{label}
						</p>
						<p className='text-xs text-muted-foreground mt-0.5 truncate'>
							{description}
						</p>
					</div>
					<ArrowRight className='size-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5' />
				</CardContent>
			</Card>
		</Link>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DefaultPage() {
	const [role, setRole] = useState(null); // "company" | "admin" | "super_admin" | "candidate"
	const [userName, setUserName] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function detectRole() {
			const { data: auth } = await supabase.auth.getUser();
			const user = auth?.user;
			if (!user) {
				setLoading(false);
				return;
			}

			// Detect role by table lookup
			const { data: company } = await supabase
				.from("companies")
				.select("id, name")
				.eq("id", user.id)
				.maybeSingle();

			if (company) {
				setUserName(company.name || null);
				setRole("company");
				setLoading(false);
				return;
			}

			const { data: admin } = await supabase
				.from("admins")
				.select("role")
				.eq("id", user.id)
				.maybeSingle();

			if (admin) {
				const meta = user.user_metadata;
				setUserName(meta?.full_name || meta?.name || null);
				setRole(admin.role === "super_admin" ? "super_admin" : "admin");
				setLoading(false);
				return;
			}

			// Candidat : chercher dans profiles
			const { data: profile } = await supabase
				.from("profiles")
				.select("firstname, lastname")
				.eq("id", user.id)
				.maybeSingle();

			if (profile) {
				setUserName(
					`${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim() ||
						null,
				);
				setRole("candidate");
			}

			setLoading(false);
		}
		detectRole();
	}, []);

	const isCompany = role === "company";
	const isCandidate = role === "candidate";
	const links = isCompany
		? COMPANY_LINKS
		: isCandidate
			? CANDIDATE_LINKS
			: ADMIN_LINKS;

	const greeting = (() => {
		const h = new Date().getHours();
		if (h < 12) return "Bonjour";
		if (h < 18) return "Bon après-midi";
		return "Bonsoir";
	})();

	const roleLabel = isCompany
		? "Entreprise"
		: isCandidate
			? "Candidat"
			: role === "super_admin"
				? "Super Admin"
				: "Admin";

	const roleBadgeClass = isCompany
		? "bg-blue-500/10 text-blue-500 border-blue-500/20"
		: isCandidate
			? "bg-violet-500/10 text-violet-600 border-violet-500/20"
			: "bg-amber-500/10 text-amber-600 border-amber-500/20";

	const roleIcon = isCompany ? (
		<Building2 className='size-3.5' />
	) : isCandidate ? (
		<UserCircle className='size-3.5' />
	) : (
		<ShieldCheck className='size-3.5' />
	);

	const subtitle = loading
		? "Chargement de votre espace…"
		: isCompany
			? "Bienvenue sur votre espace entreprise WeSafe."
			: isCandidate
				? "Bienvenue sur votre espace candidat WeSafe."
				: "Bienvenue sur le panneau d'administration WeSafe.";

	return (
		<div className='relative'>
			{/* Contenu flouté pour les candidats */}
			<div
				className={`max-w-4xl mx-auto space-y-8 py-2 transition-all duration-300 ${
					isCandidate ? "blur-sm pointer-events-none select-none" : ""
				}`}>
				{/* Header */}
				<div className='flex items-start justify-between gap-4'>
					<div>
						<h1 className='text-2xl font-semibold tracking-tight'>
							{greeting}
							{userName ? `, ${userName}` : ""} 👋
						</h1>
						<p className='text-muted-foreground text-sm mt-1'>
							{subtitle}
						</p>
					</div>
					{!loading && (
						<div
							className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${roleBadgeClass}`}>
							{roleIcon}
							{roleLabel}
						</div>
					)}
				</div>

				{/* Quick links */}
				<section>
					<h2 className='text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4'>
						Accès rapides
					</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
						{loading
							? Array.from({ length: 3 }).map((_, i) => (
									<CardSkeleton key={i} />
								))
							: links.map((link) => (
									<QuickLinkCard key={link.href} {...link} />
								))}
					</div>
				</section>

				{/* CTA company */}
				{!loading && isCompany && (
					<section>
						<Card className='border-dashed bg-muted/30'>
							<CardContent className='p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
								<div>
									<p className='font-medium'>
										Prêt à recruter ?
									</p>
									<p className='text-sm text-muted-foreground mt-0.5'>
										Publiez une offre en quelques minutes et
										trouvez le bon profil.
									</p>
								</div>
								<Button asChild className='shrink-0'>
									<Link href='/dashboard/my-jobs?new=true'>
										<Plus className='size-4 mr-2' />
										Nouvelle offre
									</Link>
								</Button>
							</CardContent>
						</Card>
					</section>
				)}

				{/* CTA candidat (dans la zone floutée) */}
				{!loading && isCandidate && (
					<section>
						<Card className='border-dashed bg-muted/30'>
							<CardContent className='p-6'>
								<p className='font-medium'>
									Trouvez votre prochaine mission
								</p>
								<p className='text-sm text-muted-foreground mt-0.5'>
									Parcourez les offres disponibles et postulez
									en quelques secondes.
								</p>
							</CardContent>
						</Card>
					</section>
				)}

				{/* CTA admin */}
				{!loading && !isCompany && !isCandidate && (
					<section>
						<Card className='border-dashed bg-muted/30'>
							<CardContent className='p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
								<div>
									<p className='font-medium'>
										Plateforme WeSafe
									</p>
									<p className='text-sm text-muted-foreground mt-0.5'>
										Vous avez accès à l'ensemble des outils
										d'administration.
									</p>
								</div>
								<Button
									asChild
									variant='outline'
									className='shrink-0'>
									<Link href='/dashboard/users'>
										<Users className='size-4 mr-2' />
										Voir les utilisateurs
									</Link>
								</Button>
							</CardContent>
						</Card>
					</section>
				)}
			</div>

			{/* Overlay candidat */}
			{isCandidate && !loading && (
				<div className='absolute inset-0 flex items-center justify-center z-10'>
					<div className='bg-background/80 backdrop-blur-none border rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center space-y-4'>
						<div className='size-14 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto'>
							<UserCircle className='size-7 text-violet-500' />
						</div>
						<div>
							<h2 className='text-lg font-semibold'>
								Espace non disponible sur web
							</h2>
							<p className='text-sm text-muted-foreground mt-2 leading-relaxed'>
								Le dashboard web est réservé aux entreprises et
								administrateurs. Pour accéder à vos
								candidatures, contrats et offres d'emploi,
								utilisez l'application mobile WeSafe.
							</p>
						</div>
						<Button asChild className='w-full'>
							<Link href='/jobs'>
								<Briefcase className='size-4 mr-2' />
								Voir les offres disponibles
							</Link>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
