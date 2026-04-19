"use client";

import { useEffect, useRef, useState } from "react";
import {
	User,
	MapPin,
	CalendarClock,
	FileText,
	MessagesSquare,
	CheckCircle,
	XCircle,
	ChevronRight,
	Clock,
	Banknote,
	Send,
	FileCheck,
	Users,
	CheckCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase/supabaseClient";
import { CATEGORY } from "@/constants/categories";
import { formatSalary } from "@/constants/salary";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
	applied: {
		title: "Candidature envoyée",
		description: "Un candidat a postulé à cette annonce.",
		badgeClass:
			"bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
		dotClass: "bg-blue-500",
		isFinal: false,
	},
	selected: {
		title: "Profil sélectionné",
		description: "Vous avez sélectionné ce candidat pour la suite.",
		badgeClass:
			"bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
		dotClass: "bg-violet-500",
		isFinal: false,
	},
	contract_sent: {
		title: "Contrat envoyé",
		description: "Vous avez envoyé un contrat au candidat.",
		badgeClass:
			"bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
		dotClass: "bg-amber-500",
		isFinal: false,
	},
	contract_signed_candidate: {
		title: "Contrat signé (candidat)",
		description: "Le candidat a signé le contrat.",
		badgeClass:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
		dotClass: "bg-emerald-500",
		isFinal: false,
	},
	contract_signed_pro: {
		title: "Contrat finalisé",
		description: "Vous avez signé le contrat. La mission est confirmée.",
		badgeClass:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
		dotClass: "bg-emerald-600",
		isFinal: true,
	},
	rejected: {
		title: "Candidature refusée",
		description: "Vous avez refusé cette candidature.",
		badgeClass:
			"bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
		dotClass: "bg-red-500",
		isFinal: true,
	},
};

const STATUS_ORDER = [
	"applied",
	"selected",
	"contract_sent",
	"contract_signed_candidate",
	"contract_signed_pro",
];

const STATUS_FILTER_OPTIONS = [
	{ value: "", label: "Tous" },
	{ value: "applied", label: "En attente" },
	{ value: "selected", label: "Sélectionnés" },
	{ value: "contract_sent", label: "Contrat envoyé" },
	{ value: "contract_signed_candidate", label: "Signé (candidat)" },
	{ value: "contract_signed_pro", label: "Finalisé" },
	{ value: "rejected", label: "Refusés" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCatAcronym(id) {
	return CATEGORY.find((c) => c.id === id)?.acronym ?? id ?? "";
}

function getCatLabel(id) {
	const cat = CATEGORY.find((c) => c.id === id);
	return cat ? `${cat.acronym} — ${cat.name}` : (id ?? "");
}

function formatDate(dateStr) {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function formatDatetime(dateStr) {
	if (!dateStr) return "—";
	const d = new Date(dateStr);
	return (
		d.toLocaleDateString("fr-FR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) +
		" · " +
		d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
	);
}

function getInitials(firstname, lastname) {
	return `${(firstname ?? "").charAt(0)}${(lastname ?? "").charAt(0)}`.toUpperCase();
}

// ─── Timeline ────────────────────────────────────────────────────────────────

function buildTimelineSteps(events) {
	if (!events?.length) return [];
	const steps = [...events];
	const lastStatus = events[events.length - 1].status;
	const cfg = STATUS_CONFIG[lastStatus];
	if (cfg?.isFinal) return steps;
	const idx = STATUS_ORDER.indexOf(lastStatus);
	const next = STATUS_ORDER[idx + 1];
	if (next) steps.push({ status: next, isPending: true });
	return steps;
}

function Timeline({ events }) {
	const steps = buildTimelineSteps(events);
	if (!steps.length)
		return (
			<p className='text-sm text-muted-foreground'>
				Aucun événement pour l'instant.
			</p>
		);

	return (
		<div className='flex flex-col'>
			{steps.map((step, idx) => {
				const cfg = STATUS_CONFIG[step.status];
				if (!cfg) return null;
				const isPending = !!step.isPending;
				const isLast = idx === steps.length - 1;
				return (
					<div key={`${step.status}-${idx}`} className='flex gap-4'>
						{/* dot + line */}
						<div className='flex flex-col items-center'>
							<div
								className={`mt-1 size-2.5 rounded-full shrink-0 ${
									isPending ? "bg-border" : cfg.dotClass
								}`}
							/>
							{!isLast && (
								<div className='w-px flex-1 bg-border mt-1 mb-0 min-h-8' />
							)}
						</div>
						{/* content */}
						<div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
							<p
								className={`text-sm font-medium ${
									isPending ? "text-muted-foreground" : ""
								}`}>
								{cfg.title}
							</p>
							<p
								className={`text-xs mt-0.5 ${
									isPending
										? "text-muted-foreground/50"
										: "text-muted-foreground"
								}`}>
								{isPending ? "En attente…" : cfg.description}
							</p>
							{!isPending && step.created_at && (
								<div className='flex items-center gap-1 mt-1'>
									<CalendarClock className='size-3 text-muted-foreground/50' />
									<span className='text-[11px] text-muted-foreground/50'>
										{formatDatetime(step.created_at)}
									</span>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

// ─── Messaging Sheet ─────────────────────────────────────────────────────────

function MessagingSheet({ open, onClose, application, companyId }) {
	const [messages, setMessages] = useState([]);
	const [newMsg, setNewMsg] = useState("");
	const [sending, setSending] = useState(false);
	const scrollContainerRef = useRef(null);
	const applyId = application?.id;
	const candidateName =
		`${application?.profiles?.firstname ?? ""} ${application?.profiles?.lastname ?? ""}`.trim();

	useEffect(() => {
		if (!open || !applyId) return;

		async function loadMessages() {
			const { data } = await supabase
				.from("messages")
				.select("*")
				.eq("apply_id", applyId)
				.order("created_at", { ascending: true });
			setMessages(data ?? []);
			setTimeout(() => {
				const el = scrollContainerRef.current;
				if (el) el.scrollTop = el.scrollHeight;
			}, 50);
		}
		loadMessages();

		const channel = supabase
			.channel(`messages-${applyId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `apply_id=eq.${applyId}`,
				},
				(payload) => {
					setMessages((prev) => [...prev, payload.new]);
					setTimeout(() => {
						const el = scrollContainerRef.current;
						if (el) el.scrollTop = el.scrollHeight;
					}, 50);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [open, applyId]);

	async function sendMessage() {
		if (!newMsg.trim() || !companyId || !applyId) return;
		setSending(true);
		await supabase.from("messages").insert({
			apply_id: applyId,
			sender_id: companyId,
			content: newMsg.trim(),
			is_read: false,
		});
		setNewMsg("");
		setSending(false);
	}

	return (
		<Sheet open={open} onOpenChange={(v) => !v && onClose()}>
			<SheetContent
				side='right'
				className='flex flex-col w-full max-w-md p-0 gap-0'>
				<SheetHeader className='px-5 py-4 border-b shrink-0'>
					<div className='flex items-center gap-3'>
						<Avatar className='size-9'>
							<AvatarImage
								src={application?.profiles?.avatar_url}
							/>
							<AvatarFallback>
								{getInitials(
									application?.profiles?.firstname,
									application?.profiles?.lastname,
								)}
							</AvatarFallback>
						</Avatar>
						<div>
							<SheetTitle className='text-sm font-semibold leading-tight'>
								{candidateName || "Candidat"}
							</SheetTitle>
							<p className='text-xs text-muted-foreground font-normal'>
								{application?.jobs?.title}
							</p>
						</div>
					</div>
				</SheetHeader>

				{/* Messages */}
				<div
					ref={scrollContainerRef}
					className='flex-1 min-h-0 overflow-y-auto px-5 py-4'>
					<div className='flex flex-col gap-3'>
						{messages.length === 0 && (
							<p className='text-center text-sm text-muted-foreground py-8'>
								Aucun message pour l'instant.
							</p>
						)}
						{messages.map((msg) => {
							const isMe = msg.sender_id === companyId;
							return (
								<div
									key={msg.id}
									className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
									<div
										className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
											isMe
												? "bg-primary text-primary-foreground rounded-br-sm"
												: "bg-muted text-foreground rounded-bl-sm"
										}`}>
										<p className='leading-snug'>
											{msg.content}
										</p>
									</div>
									<div className='flex items-center gap-0.5 px-1'>
										<span className='text-[10px] text-muted-foreground'>
											{new Date(
												msg.created_at,
											).toLocaleTimeString("fr-FR", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
										{isMe && (
											<CheckCheck
												className={`size-3 ${
													msg.is_read
														? "text-green-500"
														: "text-muted-foreground/50"
												}`}
											/>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Input */}
				<div className='border-t px-4 py-3 flex gap-2 shrink-0'>
					<Input
						value={newMsg}
						onChange={(e) => setNewMsg(e.target.value)}
						placeholder='Écrire un message…'
						onKeyDown={(e) =>
							e.key === "Enter" && !e.shiftKey && sendMessage()
						}
						className='flex-1'
					/>
					<Button
						size='icon'
						onClick={sendMessage}
						disabled={sending || !newMsg.trim()}>
						<Send className='size-4' />
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }) {
	return (
		<div className='flex flex-col gap-3'>
			<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
				{title}
			</p>
			{children}
		</div>
	);
}

// ─── Application detail panel ─────────────────────────────────────────────────

function ApplicationDetail({
	application,
	statusEvents,
	companyId,
	onSelect,
	onReject,
	onGenerateContract,
}) {
	const [messagingOpen, setMessagingOpen] = useState(false);

	const status = application.current_status;
	const statusCfg = STATUS_CONFIG[status];
	const job = application.jobs;
	const profile = application.profiles;
	const salary = job ? formatSalary(job) : null;
	const hasContract = [
		"contract_sent",
		"contract_signed_candidate",
		"contract_signed_pro",
	].includes(status);

	const candidateName =
		`${profile?.firstname ?? ""} ${profile?.lastname ?? ""}`.trim();

	return (
		<div className='h-full overflow-y-auto'>
			<div className='flex flex-col gap-6 p-6'>
				{/* Candidate header */}
				<div className='flex items-start justify-between gap-4'>
					<div className='flex items-center gap-4'>
						<Avatar className='size-14 border text-lg'>
							<AvatarImage src={profile?.avatar_url} />
							<AvatarFallback>
								{getInitials(
									profile?.firstname,
									profile?.lastname,
								)}
							</AvatarFallback>
						</Avatar>
						<div>
							<h2 className='text-xl font-bold'>
								{candidateName || "Candidat"}
							</h2>
							<p className='text-sm text-muted-foreground'>
								Candidature reçue le{" "}
								{formatDate(application.created_at)}
							</p>
						</div>
					</div>
					{statusCfg && (
						<Badge
							className={`shrink-0 text-[11px] px-2 h-6 font-medium ${statusCfg.badgeClass}`}>
							{statusCfg.title}
						</Badge>
					)}
				</div>

				<div className='h-px bg-border' />

				{/* Job info */}
				{job && (
					<Section title='Offre concernée'>
						<div className='rounded-xl border bg-muted/30 p-4 flex flex-col gap-2.5'>
							<p className='font-semibold'>{job.title}</p>
							<div className='flex flex-wrap gap-2'>
								{job.category && (
									<span className='rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium'>
										{getCatAcronym(job.category)}
									</span>
								)}
								{job.contract_type && (
									<Badge
										variant='outline'
										className='h-5 px-1.5 text-[11px]'>
										{job.contract_type.toUpperCase()}
									</Badge>
								)}
								{job.city && (
									<span className='flex items-center gap-1 text-xs text-muted-foreground'>
										<MapPin className='size-3' />
										{job.city}
										{job.department_code &&
											` (${job.department_code})`}
									</span>
								)}
								{salary && salary !== "Non spécifié" && (
									<span className='flex items-center gap-1 text-xs text-muted-foreground'>
										<Banknote className='size-3' />
										{salary}
									</span>
								)}
								{job.work_time && (
									<span className='flex items-center gap-1 text-xs text-muted-foreground'>
										<Clock className='size-3' />
										{job.work_time === "fulltime"
											? "Temps plein"
											: "Temps partiel"}
									</span>
								)}
							</div>
						</div>
					</Section>
				)}

				{/* Timeline */}
				<Section title='Suivi de la candidature'>
					<Timeline events={statusEvents} />
				</Section>

				{/* Messaging button — hidden if applied or rejected */}
				{status !== "applied" && status !== "rejected" && (
					<>
						<div className='h-px bg-border' />
						<Button
							onClick={() => setMessagingOpen(true)}
							className='w-full gap-2'>
							<MessagesSquare className='size-4' />
							Messagerie
						</Button>
					</>
				)}

				{/* Contract */}
				{hasContract && (
					<>
						<div className='h-px bg-border' />
						<Section title='Contrat de mission'>
							<div className='rounded-xl border bg-card p-4 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow'>
								<div className='size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0'>
									<FileText className='size-5 text-blue-600 dark:text-blue-400' />
								</div>
								<div className='flex-1 min-w-0'>
									<p className='font-medium text-sm'>
										Contrat de mission
									</p>
									<p className='text-xs text-muted-foreground'>
										{status === "contract_signed_pro"
											? "Voir le contrat"
											: "Voir & finaliser le contrat"}
									</p>
								</div>
								<ChevronRight className='size-4 text-muted-foreground shrink-0' />
							</div>
						</Section>
					</>
				)}

				{/* Actions */}
				{(status === "applied" || status === "selected") && (
					<>
						<div className='h-px bg-border' />
						<Section title='Actions'>
							{status === "applied" && (
								<div className='flex flex-col gap-2'>
									<Button
										onClick={() => onSelect(application)}
										variant='outline'
										className='w-full border-violet-500 text-violet-600 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-950'>
										<CheckCircle className='size-4 mr-2' />
										Sélectionner le candidat
									</Button>
									<Button
										onClick={() => onReject(application)}
										variant='outline'
										className='w-full border-destructive text-destructive hover:bg-destructive/5'>
										<XCircle className='size-4 mr-2' />
										Refuser la candidature
									</Button>
								</div>
							)}
							{status === "selected" && (
								<div className='flex flex-col gap-2'>
									<Button
										onClick={() =>
											onGenerateContract(application)
										}
										variant='outline'
										className='w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950'>
										<FileCheck className='size-4 mr-2' />
										Générer le contrat
									</Button>
									<Button
										onClick={() => onReject(application)}
										variant='outline'
										className='w-full border-destructive text-destructive hover:bg-destructive/5'>
										<XCircle className='size-4 mr-2' />
										Refuser la candidature
									</Button>
								</div>
							)}
						</Section>
					</>
				)}

				{status === "rejected" && (
					<p className='text-sm text-muted-foreground'>
						Cette candidature a été refusée.
					</p>
				)}
				{status === "contract_signed_pro" && (
					<p className='text-sm text-muted-foreground'>
						La mission est confirmée. Aucune action requise.
					</p>
				)}
			</div>

			<MessagingSheet
				open={messagingOpen}
				onClose={() => setMessagingOpen(false)}
				application={application}
				companyId={companyId}
			/>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyApplicationsPage() {
	const [companyId, setCompanyId] = useState(null);
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedApp, setSelectedApp] = useState(null);
	const [statusEvents, setStatusEvents] = useState([]);
	const [statusFilter, setStatusFilter] = useState("");
	const [search, setSearch] = useState("");

	// Confirmation dialogs
	const [selectTarget, setSelectTarget] = useState(null);
	const [rejectTarget, setRejectTarget] = useState(null);
	const [contractTarget, setContractTarget] = useState(null);

	// Init
	useEffect(() => {
		async function init() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;
			setCompanyId(user.id);
			await fetchApplications(user.id);
		}
		init();
	}, []);

	async function fetchApplications(cid) {
		setLoading(true);
		const { data } = await supabase
			.from("applications")
			.select("*, jobs(*), profiles(*)")
			.eq("company_id", cid)
			.order("created_at", { ascending: false });
		const apps = data ?? [];
		setApplications(apps);
		if (apps.length) {
			setSelectedApp(apps[0]);
			await loadStatusEvents(apps[0].id);
		}
		setLoading(false);
	}

	async function loadStatusEvents(applyId) {
		const { data } = await supabase
			.from("application_status_events")
			.select("*")
			.eq("application_id", applyId)
			.order("created_at", { ascending: true });
		setStatusEvents(data ?? []);
	}

	async function handleSelectApp(app) {
		setSelectedApp(app);
		await loadStatusEvents(app.id);
	}

	async function updateStatus(applyId, newStatus) {
		await supabase.from("application_status_events").insert({
			application_id: applyId,
			status: newStatus,
			actor: "company",
		});
		await supabase
			.from("applications")
			.update({
				current_status: newStatus,
				updated_at: new Date().toISOString(),
			})
			.eq("id", applyId);

		setApplications((prev) =>
			prev.map((a) =>
				a.id === applyId ? { ...a, current_status: newStatus } : a,
			),
		);
		if (selectedApp?.id === applyId) {
			setSelectedApp((prev) => ({
				...prev,
				current_status: newStatus,
			}));
			await loadStatusEvents(applyId);
		}
	}

	async function confirmSelect() {
		if (!selectTarget) return;
		await updateStatus(selectTarget.id, "selected");
		setSelectTarget(null);
	}

	async function confirmReject() {
		if (!rejectTarget) return;
		await updateStatus(rejectTarget.id, "rejected");
		setRejectTarget(null);
	}

	async function confirmGenerateContract() {
		if (!contractTarget) return;
		await updateStatus(contractTarget.id, "contract_sent");
		setContractTarget(null);
	}

	// Filtered list
	const filtered = applications.filter((app) => {
		const matchStatus =
			!statusFilter || app.current_status === statusFilter;
		const name =
			`${app.profiles?.firstname ?? ""} ${app.profiles?.lastname ?? ""}`.toLowerCase();
		const matchSearch =
			!search ||
			name.includes(search.toLowerCase()) ||
			app.jobs?.title?.toLowerCase().includes(search.toLowerCase());
		return matchStatus && matchSearch;
	});

	// Stats
	const stats = {
		total: applications.length,
		applied: applications.filter((a) => a.current_status === "applied")
			.length,
		selected: applications.filter((a) => a.current_status === "selected")
			.length,
		finalized: applications.filter((a) =>
			[
				"contract_sent",
				"contract_signed_candidate",
				"contract_signed_pro",
			].includes(a.current_status),
		).length,
	};

	return (
		<div
			className='flex flex-col gap-6'
			style={{ height: "calc(100dvh - 96px)" }}>
			{/* Header */}
			<div>
				<h1 className='text-2xl font-bold tracking-tight'>
					Candidatures
				</h1>
				<p className='text-sm text-muted-foreground'>
					{applications.length} candidature
					{applications.length !== 1 ? "s" : ""} reçue
					{applications.length !== 1 ? "s" : ""}
				</p>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
				<div className='rounded-xl border bg-card p-4'>
					<p className='text-sm text-muted-foreground'>Total</p>
					<p className='text-2xl font-bold'>{stats.total}</p>
				</div>
				<div className='rounded-xl border bg-card p-4'>
					<p className='text-sm text-muted-foreground'>En attente</p>
					<p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
						{stats.applied}
					</p>
				</div>
				<div className='rounded-xl border bg-card p-4'>
					<p className='text-sm text-muted-foreground'>
						Sélectionnés
					</p>
					<p className='text-2xl font-bold text-violet-600 dark:text-violet-400'>
						{stats.selected}
					</p>
				</div>
				<div className='rounded-xl border bg-card p-4'>
					<p className='text-sm text-muted-foreground'>Contrats</p>
					<p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
						{stats.finalized}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className='flex flex-wrap gap-2 items-center'>
				<Input
					placeholder='Rechercher un candidat ou une offre…'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='w-64 shrink-0'
				/>
				<div className='flex gap-1.5 flex-wrap'>
					{STATUS_FILTER_OPTIONS.map((opt) => (
						<Button
							key={opt.value}
							size='sm'
							variant={
								statusFilter === opt.value
									? "default"
									: "outline"
							}
							onClick={() => setStatusFilter(opt.value)}>
							{opt.label}
						</Button>
					))}
				</div>
			</div>

			{/* Two-column layout */}
			<div className='min-h-0 flex-1 overflow-hidden'>
				{loading ? (
					<div className='flex flex-col gap-3'>
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className='h-20 rounded-xl' />
						))}
					</div>
				) : applications.length === 0 ? (
					<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center'>
						<Users className='size-10 text-muted-foreground/40' />
						<p className='font-medium'>
							Aucune candidature pour l'instant
						</p>
						<p className='text-sm text-muted-foreground'>
							Les candidatures reçues sur vos offres apparaîtront
							ici.
						</p>
					</div>
				) : (
					<div className='flex h-full gap-4'>
						{/* Left : list */}
						<div className='flex w-full flex-col gap-2 overflow-y-auto lg:w-96 xl:w-105 lg:shrink-0'>
							{filtered.length === 0 ? (
								<p className='text-sm text-muted-foreground text-center py-8'>
									Aucune candidature pour ce filtre.
								</p>
							) : (
								filtered.map((app) => {
									const cfg =
										STATUS_CONFIG[app.current_status];
									const isActive = selectedApp?.id === app.id;
									const name =
										`${app.profiles?.firstname ?? ""} ${app.profiles?.lastname ?? ""}`.trim();
									return (
										<button
											type='button'
											key={app.id}
											onClick={() => handleSelectApp(app)}
											className={`group w-full rounded-xl border bg-card p-4 text-left transition-all hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
												isActive
													? "border-primary ring-1 ring-primary"
													: ""
											}`}>
											<div className='flex items-start gap-3'>
												<Avatar className='size-9 mt-0.5 shrink-0'>
													<AvatarImage
														src={
															app.profiles
																?.avatar_url
														}
													/>
													<AvatarFallback className='text-xs'>
														{getInitials(
															app.profiles
																?.firstname,
															app.profiles
																?.lastname,
														)}
													</AvatarFallback>
												</Avatar>
												<div className='flex-1 min-w-0'>
													<div className='flex items-start justify-between gap-2'>
														<span className='font-semibold text-sm truncate'>
															{name || "Candidat"}
														</span>
														{cfg && (
															<Badge
																className={`text-[10px] px-1.5 h-5 shrink-0 font-medium ${cfg.badgeClass}`}>
																{cfg.title}
															</Badge>
														)}
													</div>
													<p className='text-xs text-muted-foreground truncate mt-0.5'>
														{app.jobs?.title ?? "—"}
													</p>
													<p className='text-[11px] text-muted-foreground/60 mt-1'>
														{formatDate(
															app.created_at,
														)}
													</p>
												</div>
											</div>
										</button>
									);
								})
							)}
						</div>

						{/* Right : detail */}
						<div className='hidden lg:flex flex-1 rounded-xl border bg-card min-h-0 overflow-hidden'>
							{selectedApp ? (
								<ApplicationDetail
									application={selectedApp}
									statusEvents={statusEvents}
									companyId={companyId}
									onSelect={(app) => setSelectTarget(app)}
									onReject={(app) => setRejectTarget(app)}
									onGenerateContract={(app) =>
										setContractTarget(app)
									}
								/>
							) : (
								<div className='flex items-center justify-center w-full text-muted-foreground text-sm'>
									Sélectionnez une candidature
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Dialog — sélectionner */}
			<AlertDialog
				open={!!selectTarget}
				onOpenChange={(v) => !v && setSelectTarget(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Confirmer la sélection
						</AlertDialogTitle>
						<AlertDialogDescription>
							Êtes-vous sûr de vouloir sélectionner ce candidat
							pour la suite du processus de recrutement ?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction onClick={confirmSelect}>
							Confirmer
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Dialog — refuser */}
			<AlertDialog
				open={!!rejectTarget}
				onOpenChange={(v) => !v && setRejectTarget(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirmer le refus</AlertDialogTitle>
						<AlertDialogDescription>
							Êtes-vous sûr de vouloir refuser cette candidature ?
							Cette action est définitive.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmReject}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
							Refuser
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Dialog — générer contrat */}
			<AlertDialog
				open={!!contractTarget}
				onOpenChange={(v) => !v && setContractTarget(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Générer le contrat</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action enverra un contrat au candidat et le
							notifiera. Confirmez-vous ?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction onClick={confirmGenerateContract}>
							Générer
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
