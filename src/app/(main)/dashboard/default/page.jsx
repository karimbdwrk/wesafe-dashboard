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
	const [role, setRole] = useState(null); // "company" | "admin" | "super_admin"
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

			// Display name from metadata
			const meta = user.user_metadata;
			setUserName(
				meta?.name || meta?.full_name || meta?.company_name || null,
			);

			// Detect role by table lookup
			const { data: company } = await supabase
				.from("companies")
				.select("id, name")
				.eq("id", user.id)
				.maybeSingle();

			if (company) {
				setUserName(company.name || userName);
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
				setRole(admin.role === "super_admin" ? "super_admin" : "admin");
			}

			setLoading(false);
		}
		detectRole();
	}, []);

	const isCompany = role === "company";
	const links = isCompany ? COMPANY_LINKS : ADMIN_LINKS;

	const greeting = (() => {
		const h = new Date().getHours();
		if (h < 12) return "Bonjour";
		if (h < 18) return "Bon après-midi";
		return "Bonsoir";
	})();

	return (
		<div className='max-w-4xl mx-auto space-y-8 py-2'>
			{/* Header */}
			<div className='flex items-start justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold tracking-tight'>
						{greeting}
						{userName ? `, ${userName}` : ""} 👋
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						{loading
							? "Chargement de votre espace…"
							: isCompany
								? "Bienvenue sur votre espace entreprise WeSafe."
								: "Bienvenue sur le panneau d'administration WeSafe."}
					</p>
				</div>
				{!loading && (
					<div
						className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
							isCompany
								? "bg-blue-500/10 text-blue-500 border-blue-500/20"
								: "bg-amber-500/10 text-amber-600 border-amber-500/20"
						}`}>
						{isCompany ? (
							<Building2 className='size-3.5' />
						) : (
							<ShieldCheck className='size-3.5' />
						)}
						{isCompany
							? "Entreprise"
							: role === "super_admin"
								? "Super Admin"
								: "Admin"}
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

			{/* CTA contextuel */}
			{!loading && isCompany && (
				<section>
					<Card className='border-dashed bg-muted/30'>
						<CardContent className='p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
							<div>
								<p className='font-medium'>Prêt à recruter ?</p>
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

			{!loading && !isCompany && (
				<section>
					<Card className='border-dashed bg-muted/30'>
						<CardContent className='p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
							<div>
								<p className='font-medium'>Plateforme WeSafe</p>
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
	);
}
