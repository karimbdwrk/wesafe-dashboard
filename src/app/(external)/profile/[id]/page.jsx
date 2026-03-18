"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	MapPin,
	Mail,
	Calendar,
	User,
	Languages,
	Car,
	ShieldCheck,
	GraduationCap,
	FileText,
	CreditCard,
	Ruler,
	Weight,
	Star,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
	if (!dateStr) return null;
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function parseListField(value) {
	if (!value) return [];
	if (Array.isArray(value)) return value;
	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return value.trim() ? [value.trim()] : [];
		}
	}
	return [];
}

function getAge(birthday) {
	if (!birthday) return null;
	const birth = new Date(birthday);
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
	return age;
}

function getInitials(firstname, lastname) {
	return `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase() || "?";
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children }) {
	return (
		<div className='space-y-3'>
			<div className='flex items-center gap-2'>
				<Icon className='h-4 w-4 text-muted-foreground shrink-0' />
				<h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
					{title}
				</h2>
			</div>
			{children}
		</div>
	);
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function ProfileAvatar({ avatarUrl, firstname, lastname, size = 96 }) {
	const [imgError, setImgError] = useState(false);
	const initials = getInitials(firstname, lastname);

	if (!avatarUrl || imgError) {
		return (
			<div
				className='rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground font-bold'
				style={{ width: size, height: size, fontSize: size * 0.33 }}>
				{initials}
			</div>
		);
	}
	return (
		<img
			src={avatarUrl}
			alt={`${firstname} ${lastname}`}
			className='rounded-full object-cover border-2 border-border shrink-0'
			style={{ width: size, height: size }}
			onError={() => setImgError(true)}
		/>
	);
}

// ─── Document status badge ────────────────────────────────────────────────────

const statusVariant = {
	approved: "default",
	pending: "secondary",
	rejected: "destructive",
};

const statusLabel = {
	approved: "Validé",
	pending: "En attente",
	rejected: "Refusé",
};

function DocBadge({ status }) {
	return (
		<Badge variant={statusVariant[status] || "secondary"}>
			{statusLabel[status] || status || "En attente"}
		</Badge>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
	const { id } = useParams();
	const [profile, setProfile] = useState(null);
	const [diplomas, setDiplomas] = useState([]);
	const [certifications, setCertifications] = useState([]);
	const [cnapsCards, setCnapsCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		if (!id) return;

		const fetchAll = async () => {
			const [
				{ data: profileData, error: profileError },
				{ data: diplomasData },
				{ data: certsData },
				{ data: cnapsData },
			] = await Promise.all([
				supabase.from("profiles").select("*").eq("id", id).single(),
				supabase
					.from("user_diplomas")
					.select("*")
					.eq("user_id", id)
					.order("created_at", { ascending: false }),
				supabase
					.from("user_certifications")
					.select("*")
					.eq("user_id", id)
					.order("created_at", { ascending: false }),
				supabase
					.from("user_cnaps_cards")
					.select("*")
					.eq("user_id", id)
					.order("created_at", { ascending: false }),
			]);

			setLoading(false);

			if (profileError || !profileData) {
				console.error("[profile] erreur:", profileError);
				setNotFound(true);
				return;
			}

			console.log("[profile] data:", profileData);
			setProfile(profileData);
			setDiplomas(diplomasData || []);
			setCertifications(certsData || []);
			setCnapsCards(cnapsData || []);
		};

		fetchAll();
	}, [id]);

	// ── Loading ─────────────────────────────────────────────────────────────
	if (loading) {
		return (
			<div className='min-h-dvh flex items-center justify-center'>
				<div className='h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
			</div>
		);
	}

	// ── Not found ───────────────────────────────────────────────────────────
	if (notFound) {
		return (
			<div className='min-h-dvh flex flex-col items-center justify-center gap-3 text-center px-4'>
				<p className='text-4xl'>🔍</p>
				<h1 className='text-xl font-semibold'>Profil introuvable</h1>
				<p className='text-sm text-muted-foreground'>
					Ce profil n&apos;existe pas ou a été supprimé.
				</p>
			</div>
		);
	}

	// ── Prepare data ────────────────────────────────────────────────────────
	const fullName =
		`${profile.firstname || ""} ${profile.lastname || ""}`.trim();
	const age = getAge(profile.birthday);
	const languages = parseListField(profile.languages);
	const drivingLicenses = parseListField(profile.driving_licenses);

	const location = [profile.city, profile.department, profile.region]
		.filter(Boolean)
		.join(", ");

	// ── Render ──────────────────────────────────────────────────────────────
	return (
		<div className='min-h-dvh bg-muted/30 py-10 px-4 pt-24'>
			<div className='max-w-2xl mx-auto space-y-6'>
				{/* ── Header card ─────────────────────────────────────────── */}
				<div className='rounded-2xl border bg-card shadow-sm overflow-hidden'>
					{/* Banner */}
					<div className='h-24 bg-gradient-to-r from-primary/20 to-primary/5' />

					{/* Avatar + name */}
					<div className='px-6 pb-6'>
						<div className='-mt-12 flex items-end gap-4'>
							<ProfileAvatar
								avatarUrl={profile.avatar_url}
								firstname={profile.firstname}
								lastname={profile.lastname}
								size={88}
							/>
							<div className='pb-1 min-w-0'>
								<h1 className='text-2xl font-bold truncate'>
									{fullName || "Candidat"}
								</h1>
								<div className='flex flex-wrap gap-1.5 mt-1.5'>
									{profile.former_soldier && (
										<Badge
											variant='secondary'
											className='gap-1'>
											<Star className='h-3 w-3' />
											Ancien militaire
										</Badge>
									)}
									{profile.gender === "male" && (
										<Badge variant='outline'>Homme</Badge>
									)}
									{profile.gender === "female" && (
										<Badge variant='outline'>Femme</Badge>
									)}
									{age !== null && (
										<Badge variant='outline'>
											{age} ans
										</Badge>
									)}
								</div>
							</div>
						</div>

						{/* Bio-line */}
						<div className='mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground'>
							{location && (
								<span className='flex items-center gap-1.5'>
									<MapPin className='h-3.5 w-3.5 shrink-0' />
									{location}
									{profile.postcode &&
										` (${profile.postcode})`}
								</span>
							)}
							{profile.email && (
								<a
									href={`mailto:${profile.email}`}
									className='flex items-center gap-1.5 hover:text-foreground transition-colors'>
									<Mail className='h-3.5 w-3.5 shrink-0' />
									{profile.email}
								</a>
							)}
							{profile.birthday && (
								<span className='flex items-center gap-1.5'>
									<Calendar className='h-3.5 w-3.5 shrink-0' />
									{formatDate(profile.birthday)}
								</span>
							)}
						</div>
					</div>
				</div>

				{/* ── Info card ────────────────────────────────────────────── */}
				{(profile.height ||
					profile.weight ||
					languages.length > 0 ||
					drivingLicenses.length > 0) && (
					<div className='rounded-2xl border bg-card shadow-sm p-6 space-y-5'>
						{(profile.height || profile.weight) && (
							<Section icon={User} title='Physique'>
								<div className='flex flex-wrap gap-3'>
									{profile.height && (
										<div className='flex items-center gap-2 text-sm'>
											<Ruler className='h-4 w-4 text-muted-foreground' />
											<span>{profile.height} cm</span>
										</div>
									)}
									{profile.weight && (
										<div className='flex items-center gap-2 text-sm'>
											<Weight className='h-4 w-4 text-muted-foreground' />
											<span>{profile.weight} kg</span>
										</div>
									)}
								</div>
							</Section>
						)}

						{(profile.height || profile.weight) &&
							(languages.length > 0 ||
								drivingLicenses.length > 0) && <Separator />}

						{languages.length > 0 && (
							<Section icon={Languages} title='Langues'>
								<div className='flex flex-wrap gap-2'>
									{languages.map((lang, i) => (
										<Badge key={i} variant='secondary'>
											{lang}
										</Badge>
									))}
								</div>
							</Section>
						)}

						{languages.length > 0 && drivingLicenses.length > 0 && (
							<Separator />
						)}

						{drivingLicenses.length > 0 && (
							<Section icon={Car} title='Permis de conduire'>
								<div className='flex flex-wrap gap-2'>
									{drivingLicenses.map((lic, i) => (
										<Badge key={i} variant='outline'>
											{lic}
										</Badge>
									))}
								</div>
							</Section>
						)}
					</div>
				)}

				{/* ── Documents cards ──────────────────────────────────────── */}

				{diplomas.length > 0 && (
					<div className='rounded-2xl border bg-card shadow-sm p-6'>
						<Section icon={GraduationCap} title='Diplômes'>
							<div className='space-y-2 mt-1'>
								{diplomas.map((doc) => (
									<div
										key={doc.id}
										className='flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm'>
										<span className='font-medium truncate'>
											{doc.name ||
												doc.diploma_name ||
												doc.type ||
												"Diplôme"}
										</span>
										<DocBadge status={doc.status} />
									</div>
								))}
							</div>
						</Section>
					</div>
				)}

				{certifications.length > 0 && (
					<div className='rounded-2xl border bg-card shadow-sm p-6'>
						<Section icon={ShieldCheck} title='Certifications'>
							<div className='space-y-2 mt-1'>
								{certifications.map((doc) => (
									<div
										key={doc.id}
										className='flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm'>
										<span className='font-medium truncate'>
											{doc.name ||
												doc.certification_name ||
												doc.type ||
												"Certification"}
										</span>
										<div className='flex items-center gap-2 shrink-0'>
											{doc.expiry_date && (
												<span className='text-xs text-muted-foreground'>
													exp.{" "}
													{formatDate(
														doc.expiry_date,
													)}
												</span>
											)}
											<DocBadge status={doc.status} />
										</div>
									</div>
								))}
							</div>
						</Section>
					</div>
				)}

				{cnapsCards.length > 0 && (
					<div className='rounded-2xl border bg-card shadow-sm p-6'>
						<Section
							icon={CreditCard}
							title='Cartes professionnelles CNAPS'>
							<div className='space-y-2 mt-1'>
								{cnapsCards.map((doc) => (
									<div
										key={doc.id}
										className='flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm'>
										<span className='font-medium truncate'>
											{doc.card_number
												? `Carte n° ${doc.card_number}`
												: doc.name || "Carte CNAPS"}
										</span>
										<div className='flex items-center gap-2 shrink-0'>
											{doc.expiry_date && (
												<span className='text-xs text-muted-foreground'>
													exp.{" "}
													{formatDate(
														doc.expiry_date,
													)}
												</span>
											)}
											<DocBadge status={doc.status} />
										</div>
									</div>
								))}
							</div>
						</Section>
					</div>
				)}

				{/* ── Footer ───────────────────────────────────────────────── */}
				<p className='text-center text-xs text-muted-foreground pb-4'>
					Profil partagé via WeSafe
				</p>
			</div>
		</div>
	);
}
