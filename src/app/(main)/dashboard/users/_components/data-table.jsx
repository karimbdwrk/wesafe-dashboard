"use client";
"use no memo";

import * as React from "react";
import { useState, useEffect } from "react";

import { Plus, Pencil, Copy, Venus, Mars, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { CompaniesTable } from "../../../../../components/data-table/companies-table";

import { DataTable as DataTableNew } from "../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../components/data-table/data-table-view-options";
import { DataTableColumnHeader } from "../../../../../components/data-table/data-table-column-header";
import { withDndColumn } from "../../../../../components/data-table/table-utils";
import { dashboardColumns } from "./columns";
import { companiesColumns } from "./companies-columns";
// import type { sectionSchema } from "./schema";

import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/avatar-upload";
import { DatePicker } from "@/components/ui/date-picker";

function getCompanyStatusBadge(status) {
	switch (status) {
		case "active":
			return { color: "success", label: "Active" };
		case "pending":
			return { color: "warning", label: "En attente" };
		case "rejected":
			return { color: "outline", label: "Refusé" };
		case "suspended":
			return { color: "destructive", label: "Suspendue" };
		default:
			return { color: "outline", label: "Non défini" };
	}
}

function getBucketAndPath(url) {
	// Gère tous les types Supabase : public, authenticated, sign, etc.
	const match = url.match(/storage\/v1\/object\/[^/]+\/([^/]+)\/([^?#]+)/);
	if (!match) return null;
	return { bucket: match[1], path: match[2] };
}

function ImageWithSignedUrl({ url, alt }) {
	const [signedUrl, setSignedUrl] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		setError(false);
		setLoading(true);

		// URL déjà signée → directe
		if (url.includes("token=")) {
			setSignedUrl(url);
			setLoading(false);
			return;
		}

		// Signe TOUJOURS pour contourner le RLS, même sur bucket public
		const info = getBucketAndPath(url);
		if (!info) {
			setSignedUrl("");
			setLoading(false);
			return;
		}
		supabase.storage
			.from(info.bucket)
			.createSignedUrl(decodeURIComponent(info.path), 60 * 10)
			.then(({ data, error }) => {
				if (data?.signedUrl) {
					setSignedUrl(data.signedUrl);
					setLoading(false);
				} else {
					setError(true);
					setLoading(false);
					console.error("Erreur Supabase signedUrl:", error?.message);
				}
			});
	}, [url]);

	if (loading) {
		return (
			<div className='text-xs text-gray-400'>
				Chargement de l'image...
			</div>
		);
	}
	if (error || !signedUrl) {
		return (
			<div className='text-red-500 text-xs'>
				Image inaccessible (privée ou expirée)
			</div>
		);
	}
	return (
		<img
			src={signedUrl}
			alt={alt}
			className='max-w-full h-24 rounded border mb-2'
			onError={() => setError(true)}
		/>
	);
}

function parseDate(str) {
	if (!str) return null;
	const [dd, mm, yyyy] = str.split("-");
	if (!dd || !mm || !yyyy) return null;
	return new Date(`${yyyy}-${mm}-${dd}`);
}

function formatDateDDMMYYYY(date) {
	if (!date) return "";
	const dd = String(date.getDate()).padStart(2, "0");
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const yyyy = date.getFullYear();
	return `${dd}-${mm}-${yyyy}`;
}

const contractTypeLabel = {
	full_time: "CDI",
	part_time: "CDD",
	freelance: "Freelance",
	internship: "Stage",
	apprentice: "Alternance",
};

const jobsColumns = [
	{
		id: "company_avatar",
		header: "Entreprise",
		cell: ({ row }) => {
			const logoUrl = row.original.companies?.logo_url;
			const name = row.original.companies?.name;
			return (
				<div className='flex items-center gap-2'>
					{logoUrl ? (
						<img
							src={logoUrl}
							alt={name || "logo"}
							className='h-8 w-8 rounded-full object-cover border shrink-0'
						/>
					) : (
						<div className='h-8 w-8 rounded-full bg-muted border flex items-center justify-center shrink-0'>
							<span className='text-xs text-muted-foreground'>
								{name?.[0]?.toUpperCase() || "?"}
							</span>
						</div>
					)}
					<span className='text-sm truncate max-w-[120px]'>
						{name || "—"}
					</span>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "title",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Titre' />
		),
		cell: ({ row }) => (
			<div className='flex items-center gap-1.5'>
				<a
					href={`http://localhost:3000/jobs/${row.original.id}`}
					target='_blank'
					rel='noopener noreferrer'
					className='font-medium hover:underline'>
					{row.original.title || "—"}
				</a>
				{row.original.isLastMinute && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Zap
									className='w-3.5 h-3.5 text-yellow-500 shrink-0 cursor-default'
									fill='currentColor'
								/>
							</TooltipTrigger>
							<TooltipContent className='flex items-center gap-1.5'>
								<Zap
									className='w-3 h-3 text-yellow-500'
									fill='currentColor'
								/>
								<span>Last Minute</span>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		),
	},
	{
		accessorKey: "city",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Ville' />
		),
		cell: ({ row }) => (
			<span className='text-sm'>
				{row.original.city +
					" (" +
					row.original.department_code +
					")" || "—"}
			</span>
		),
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Catégorie' />
		),
		cell: ({ row }) =>
			row.original.category ? (
				<Badge variant='outline'>{row.original.category}</Badge>
			) : (
				<span className='text-xs text-muted-foreground'>—</span>
			),
	},
	{
		accessorKey: "contract_type",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Contrat' />
		),
		cell: ({ row }) => {
			const ct = row.original.contract_type;
			return ct ? (
				<Badge variant='secondary'>{contractTypeLabel[ct] ?? ct}</Badge>
			) : (
				<span className='text-xs text-muted-foreground'>—</span>
			);
		},
	},
	{
		accessorKey: "is_archived",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Archivé' />
		),
		cell: ({ row }) => {
			const archived = row.original.is_archived;
			return archived ? (
				<Badge
					variant='outline'
					className='flex items-center gap-1.5 w-fit'>
					<span className='w-1.5 h-1.5 rounded-full bg-red-500 shrink-0' />
					Archivé
				</Badge>
			) : (
				<Badge
					variant='outline'
					className='flex items-center gap-1.5 w-fit'>
					<span className='w-1.5 h-1.5 rounded-full bg-green-500 shrink-0' />
					Publié
				</Badge>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Statut' />
		),
		cell: ({ row }) => {
			const status = row.original.status;
			const config = {
				draft: { dot: "bg-yellow-400", label: "Brouillon" },
				published: { dot: "bg-green-500", label: "Publié" },
				archived: { dot: "bg-red-500", label: "Archivé" },
			};
			const { dot, label } = config[status] ?? {
				dot: "bg-gray-400",
				label: status ?? "—",
			};
			return (
				<button
					type='button'
					className='focus:outline-none'
					onClick={() =>
						window.dispatchEvent(
							new CustomEvent("openJobStatusDialog", {
								detail: row.original,
							}),
						)
					}>
					<Badge
						variant='outline'
						className='flex items-center gap-1.5 w-fit cursor-pointer'>
						<span
							className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`}
						/>
						{label}
					</Badge>
				</button>
			);
		},
	},
	{
		id: "applications_count",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Candidatures' />
		),
		cell: ({ row }) => {
			const count = row.original.applications?.[0]?.count ?? 0;
			return (
				<Badge
					variant={count > 0 ? "secondary" : "outline"}
					className='tabular-nums'>
					{count}
				</Badge>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "start_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Début' />
		),
		cell: ({ row }) => {
			const d = row.original.start_date;
			return (
				<span className='text-sm text-muted-foreground whitespace-nowrap'>
					{d ? new Date(d).toLocaleDateString("fr-FR") : "—"}
				</span>
			);
		},
	},
	{
		accessorKey: "end_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Fin' />
		),
		cell: ({ row }) => {
			const d = row.original.end_date;
			return (
				<span className='text-sm text-muted-foreground whitespace-nowrap'>
					{d ? new Date(d).toLocaleDateString("fr-FR") : "—"}
				</span>
			);
		},
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<Button
				variant='ghost'
				size='icon'
				onClick={() =>
					window.dispatchEvent(
						new CustomEvent("openJobSheet", {
							detail: row.original,
						}),
					)
				}>
				<Pencil className='w-4 h-4' />
			</Button>
		),
		enableSorting: false,
		size: 40,
	},
];

const applicationStatusConfig = {
	applied: { dot: "bg-blue-500", label: "Candidature" },
	selected: { dot: "bg-yellow-400", label: "Sélectionné" },
	contract_sent: { dot: "bg-purple-500", label: "Contrat envoyé" },
	contract_signed_pro: { dot: "bg-green-500", label: "Contrat signé" },
	rejected: { dot: "bg-red-500", label: "Refusé" },
};

function CandidateAvatar({ avatarUrl, firstname, lastname }) {
	const [imgError, setImgError] = useState(false);
	const initials =
		`${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase() || "?";

	if (!avatarUrl || imgError) {
		return (
			<div className='h-8 w-8 rounded-full bg-black flex items-center justify-center shrink-0'>
				<span className='text-xs text-white font-semibold leading-none'>
					{initials}
				</span>
			</div>
		);
	}
	return (
		<img
			src={avatarUrl}
			alt={`${firstname} ${lastname}`}
			className='h-8 w-8 rounded-full object-cover border shrink-0'
			onError={() => setImgError(true)}
		/>
	);
}

const applicationsColumns = [
	{
		id: "company",
		header: "Entreprise",
		cell: ({ row }) => {
			const logoUrl = row.original.companies?.logo_url;
			const name = row.original.companies?.name;
			return (
				<div className='flex items-center gap-2'>
					{logoUrl ? (
						<img
							src={logoUrl}
							alt={name || "logo"}
							className='h-8 w-8 rounded-full object-cover border shrink-0'
						/>
					) : (
						<div className='h-8 w-8 rounded-full bg-muted border flex items-center justify-center shrink-0'>
							<span className='text-xs text-muted-foreground'>
								{name?.[0]?.toUpperCase() || "?"}
							</span>
						</div>
					)}
					<span className='text-sm truncate max-w-[120px]'>
						{name || "—"}
					</span>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		id: "job_title",
		accessorFn: (row) => row.jobs?.title ?? "",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Offre d'emploi" />
		),
		cell: ({ row }) => (
			<div className='flex items-center gap-1.5'>
				<span className='font-medium text-sm truncate'>
					{row.original.jobs?.title || "—"}
				</span>
				{row.original.jobs?.isLastMinute && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Zap
									className='w-3.5 h-3.5 text-yellow-500 shrink-0 cursor-default'
									fill='currentColor'
								/>
							</TooltipTrigger>
							<TooltipContent className='flex items-center gap-1.5'>
								<Zap
									className='w-3 h-3 text-yellow-500'
									fill='currentColor'
								/>
								<span>Last Minute</span>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		),
		size: 200,
	},
	{
		id: "candidate",
		header: "Candidat",
		cell: ({ row }) => {
			const avatarUrl = row.original.profiles?.avatar_url;
			const firstname = row.original.profiles?.firstname || "";
			const lastname = row.original.profiles?.lastname || "";
			const fullName = `${lastname} ${firstname}`.trim() || "—";
			return (
				<div className='flex items-center gap-2'>
					<CandidateAvatar
						avatarUrl={avatarUrl}
						firstname={firstname}
						lastname={lastname}
					/>
					<span className='text-sm truncate max-w-[140px]'>
						{fullName}
					</span>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		id: "current_status",
		accessorKey: "current_status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Statut' />
		),
		cell: ({ row }) => {
			const status = row.original.current_status;
			const config = applicationStatusConfig[status] || {
				dot: "bg-gray-400",
				label: status ?? "—",
			};
			return (
				<Badge
					variant='outline'
					className='flex items-center gap-1.5 w-fit'>
					<span
						className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`}
					/>
					{config.label}
				</Badge>
			);
		},
	},
];

export function DataTable({
	data: initialData,
	companies: initialCompaniesData,
}) {
	const [data, setData] = React.useState(initialData);
	const [companiesData, setCompaniesData] =
		React.useState(initialCompaniesData);
	const [jobsData, setJobsData] = useState([]);
	const [applicationsData, setApplicationsData] = useState([]);
	const [communeResults, setCommuneResults] = useState([]);
	const [selectedCommune, setSelectedCommune] = useState(null);

	const [selectedProfile, setSelectedProfile] = useState(null);
	const [showConfirm, setShowConfirm] = useState(false);
	const [formData, setFormData] = useState({});

	const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
	const [selectedCompany, setSelectedCompany] = useState(null);
	const [newStatus, setNewStatus] = useState("");
	const [companyRejectReason, setCompanyRejectReason] = useState("");

	const [kbisDialogOpen, setKbisDialogOpen] = useState(false);
	const [newKbisStatus, setNewKbisStatus] = useState("");
	const [signedKbisUrl, setSignedKbisUrl] = useState("");
	const [newSiret, setNewSiret] = useState("");

	const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
	const [selectedSignatureProfile, setSelectedSignatureProfile] =
		useState(null);
	const [newSignatureStatus, setNewSignatureStatus] = useState("");
	const [signedSignatureUrl, setSignedSignatureUrl] = useState("");

	const [companySignatureDialogOpen, setCompanySignatureDialogOpen] =
		useState(false);
	const [selectedCompanySignature, setSelectedCompanySignature] =
		useState(null);
	const [newCompanySignatureStatus, setNewCompanySignatureStatus] =
		useState("");

	const [companyStampDialogOpen, setCompanyStampDialogOpen] = useState(false);
	const [selectedCompanyStamp, setSelectedCompanyStamp] = useState(null);
	const [newCompanyStampStatus, setNewCompanyStampStatus] = useState("");

	const [companySheetOpen, setCompanySheetOpen] = useState(false);
	const [formDataCompany, setFormDataCompany] = useState({});

	const [jobSheetOpen, setJobSheetOpen] = useState(false);
	const [selectedJob, setSelectedJob] = useState(null);
	const [jobFormData, setJobFormData] = useState({});
	const [jobStatusDialogOpen, setJobStatusDialogOpen] = useState(false);
	const [newJobStatus, setNewJobStatus] = useState("");

	useEffect(() => {
		function handleOpenCompanySheet(e) {
			setSelectedCompany(e.detail);
			setFormDataCompany({
				name: e.detail.name || "",
				email: e.detail.email || "",
				stripe_customer_id: e.detail.stripe_customer_id || "",
				description: e.detail.description || "",
			});
			setCompanySheetOpen(true);
		}
		window.addEventListener("openCompanySheet", handleOpenCompanySheet);
		return () => {
			window.removeEventListener(
				"openCompanySheet",
				handleOpenCompanySheet,
			);
		};
	}, []);

	useEffect(() => {
		function handleOpenJobSheet(e) {
			setSelectedJob(e.detail);
			setJobFormData({
				title: e.detail.title || "",
				is_archived: e.detail.is_archived ?? false,
			});
			setJobSheetOpen(true);
		}
		window.addEventListener("openJobSheet", handleOpenJobSheet);
		return () => {
			window.removeEventListener("openJobSheet", handleOpenJobSheet);
		};
	}, []);

	useEffect(() => {
		function handleOpenJobStatusDialog(e) {
			setSelectedJob(e.detail);
			setNewJobStatus(e.detail.status || "");
			setJobStatusDialogOpen(true);
		}
		window.addEventListener(
			"openJobStatusDialog",
			handleOpenJobStatusDialog,
		);
		return () => {
			window.removeEventListener(
				"openJobStatusDialog",
				handleOpenJobStatusDialog,
			);
		};
	}, []);

	async function handleUpdateJobStatus() {
		const { error } = await supabase
			.from("jobs")
			.update({ status: newJobStatus })
			.eq("id", selectedJob.id);
		if (!error) {
			toast.success("Statut mis à jour !");
			setJobStatusDialogOpen(false);
			setJobsData((prev) =>
				prev.map((j) =>
					j.id === selectedJob.id
						? { ...j, status: newJobStatus }
						: j,
				),
			);
		} else {
			toast.error("Erreur : " + error.message);
		}
	}

	function handleChangeCompany(e) {
		setFormDataCompany({
			...formDataCompany,
			[e.target.name]: e.target.value,
		});
	}

	async function handleUpdateCompany() {
		const { data, error } = await supabase
			.from("companies")
			.update({
				name: formDataCompany.name,
				email: formDataCompany.email,
				description: formDataCompany.description,
			})
			.eq("id", selectedCompany.id)
			.select();
		if (!error && data && data.length > 0) {
			toast.success("Entreprise mise à jour !");
			setCompanySheetOpen(false);
			setCompaniesData((prev) =>
				prev.map((company) =>
					company.id === selectedCompany.id
						? { ...company, ...formDataCompany }
						: company,
				),
			);
		} else {
			toast.error(
				"Erreur lors de la mise à jour : " +
					(error?.message || "Inconnue"),
			);
		}
	}

	function formatSiret(siret) {
		if (!siret) return "";
		const digits = siret.replace(/\D/g, "");
		return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{5})$/, "$1 $2 $3 $4");
	}

	useEffect(() => {
		function handleOpenKbisStatusDialog(e) {
			setSelectedCompany(e.detail);
			setNewKbisStatus(e.detail.kbis_verification_status);
			setNewSiret(e.detail.siret || "");
			setKbisDialogOpen(true);
		}
		window.addEventListener(
			"openKbisStatusDialog",
			handleOpenKbisStatusDialog,
		);
		return () => {
			window.removeEventListener(
				"openKbisStatusDialog",
				handleOpenKbisStatusDialog,
			);
		};
	}, []);

	useEffect(() => {
		function handleOpenCompanySignatureDialog(e) {
			setSelectedCompanySignature(e.detail);
			setNewCompanySignatureStatus(e.detail.signature_status || "");
			setCompanySignatureDialogOpen(true);
		}
		window.addEventListener(
			"openCompanySignatureDialog",
			handleOpenCompanySignatureDialog,
		);
		return () =>
			window.removeEventListener(
				"openCompanySignatureDialog",
				handleOpenCompanySignatureDialog,
			);
	}, []);

	async function handleUpdateCompanySignatureStatus() {
		const { error } = await supabase
			.from("companies")
			.update({ signature_status: newCompanySignatureStatus })
			.eq("id", selectedCompanySignature.id);
		if (!error) {
			toast.success("Statut de signature mis à jour !");
			setCompanySignatureDialogOpen(false);
			setCompaniesData((prev) =>
				prev.map((c) =>
					c.id === selectedCompanySignature.id
						? { ...c, signature_status: newCompanySignatureStatus }
						: c,
				),
			);
		} else {
			toast.error("Erreur : " + (error?.message || "Inconnue"));
		}
	}

	useEffect(() => {
		function handleOpenCompanyStampDialog(e) {
			setSelectedCompanyStamp(e.detail);
			setNewCompanyStampStatus(e.detail.stamp_status || "");
			setCompanyStampDialogOpen(true);
		}
		window.addEventListener(
			"openCompanyStampDialog",
			handleOpenCompanyStampDialog,
		);
		return () =>
			window.removeEventListener(
				"openCompanyStampDialog",
				handleOpenCompanyStampDialog,
			);
	}, []);

	async function handleUpdateCompanyStampStatus() {
		const { error } = await supabase
			.from("companies")
			.update({ stamp_status: newCompanyStampStatus })
			.eq("id", selectedCompanyStamp.id);
		if (!error) {
			toast.success("Statut du tampon mis à jour !");
			setCompanyStampDialogOpen(false);
			setCompaniesData((prev) =>
				prev.map((c) =>
					c.id === selectedCompanyStamp.id
						? { ...c, stamp_status: newCompanyStampStatus }
						: c,
				),
			);
		} else {
			toast.error("Erreur : " + (error?.message || "Inconnue"));
		}
	}

	useEffect(() => {
		function handleOpenSignatureDialog(e) {
			setSelectedSignatureProfile(e.detail);
			setNewSignatureStatus(e.detail.signature_status || "");
			// signature_url est une URL publique complète, pas besoin de signed URL
			setSignedSignatureUrl(e.detail.signature_url || "");
			setSignatureDialogOpen(true);
		}
		window.addEventListener(
			"openSignatureDialog",
			handleOpenSignatureDialog,
		);
		return () =>
			window.removeEventListener(
				"openSignatureDialog",
				handleOpenSignatureDialog,
			);
	}, []);

	async function handleUpdateSignatureStatus() {
		const { error } = await supabase
			.from("profiles")
			.update({ signature_status: newSignatureStatus })
			.eq("id", selectedSignatureProfile.id);
		if (!error) {
			toast.success("Statut de signature mis à jour !");
			setSignatureDialogOpen(false);
			setData((prev) =>
				prev.map((p) =>
					p.id === selectedSignatureProfile.id
						? { ...p, signature_status: newSignatureStatus }
						: p,
				),
			);
		} else {
			toast.error("Erreur : " + (error?.message || "Inconnue"));
		}
	}

	useEffect(() => {
		console.log(
			"Profil sélectionné pour signature :",
			selectedSignatureProfile,
		);
	}, [selectedSignatureProfile]);

	async function handleUpdateKbisStatus() {
		const siretToSend = newSiret.replace(/\D/g, "");
		const { data, error } = await supabase
			.from("companies")
			.update({
				kbis_verification_status: newKbisStatus,
				siret: siretToSend,
			})
			.eq("id", selectedCompany.id)
			.select();
		if (!error && data && data.length > 0) {
			toast.success("Statut KBIS mis à jour !");
			setKbisDialogOpen(false);
			// Mise à jour locale si besoin
			setCompaniesData((prev) =>
				prev.map((company) =>
					company.id === selectedCompany.id
						? {
								...company,
								kbis_verification_status: newKbisStatus,
								siret: newSiret,
							}
						: company,
				),
			);
		} else {
			toast.error(
				"Erreur lors de la mise à jour : " +
					(error?.message || "Inconnue"),
			);
		}
	}

	useEffect(() => {
		async function fetchSignedUrl() {
			if (selectedCompany?.kbis_url) {
				const info = getBucketAndPath(selectedCompany.kbis_url);
				if (info) {
					const { data, error } = await supabase.storage
						.from(info.bucket)
						.createSignedUrl(info.path, 60 * 10); // 10 min
					if (data?.signedUrl) setSignedKbisUrl(data.signedUrl);
					else setSignedKbisUrl("");
				} else {
					setSignedKbisUrl("");
				}
			} else {
				setSignedKbisUrl("");
			}
		}
		fetchSignedUrl();
	}, [selectedCompany]);

	useEffect(() => {
		function handleOpenCompanyStatusDialog(e) {
			setSelectedCompany(e.detail);
			setNewStatus(e.detail.company_status);
			setCompanyRejectReason(e.detail.reject_message ?? "");
			setCompanyDialogOpen(true);
		}
		window.addEventListener(
			"openCompanyStatusDialog",
			handleOpenCompanyStatusDialog,
		);
		return () => {
			window.removeEventListener(
				"openCompanyStatusDialog",
				handleOpenCompanyStatusDialog,
			);
		};
	}, []);

	async function handleUpdateStatus() {
		const updatePayload = { company_status: newStatus };
		if (newStatus === "suspended" || newStatus === "rejected") {
			updatePayload.reject_message = companyRejectReason.trim() || null;
		} else {
			updatePayload.reject_message = null;
		}
		const { data, error } = await supabase
			.from("companies")
			.update(updatePayload)
			.eq("id", selectedCompany.id)
			.select();
		if (!error) {
			toast.success("Statut mis à jour avec succès !");
			setCompanyDialogOpen(false);
			setCompaniesData((prev) =>
				prev.map((company) =>
					company.id === selectedCompany.id
						? { ...company, company_status: newStatus }
						: company,
				),
			);
		} else {
			toast.error(
				"Erreur lors de la mise à jour : " +
					(error.message || "Inconnue"),
			);
		}
	}

	useEffect(() => {
		console.log("Profils companies reçus dans DataTable:", companiesData);
		setCompaniesData(initialCompaniesData);
	}, [initialCompaniesData]);

	useEffect(() => {
		supabase
			.from("jobs")
			.select("*, companies(name, logo_url), applications(count)")
			.order("created_at", { ascending: false })
			.then(({ data, error }) => {
				if (error) {
					console.error("Erreur fetch jobs:", error);
				} else {
					console.log("Jobs data:", data);
					setJobsData(data || []);
				}
			});
	}, []);

	useEffect(() => {
		supabase
			.from("applications")
			.select(
				"*, jobs(title, isLastMinute), companies!company_id(name, logo_url), profiles!candidate_id(firstname, lastname, avatar_url)",
			)
			.order("created_at", { ascending: false })
			.then(({ data, error }) => {
				if (error) {
					console.error("Erreur fetch applications:", error);
				} else {
					setApplicationsData(data || []);
				}
			});
	}, []);

	// Initialise la date de naissance au chargement du profil
	useEffect(() => {
		if (selectedProfile && selectedProfile.birthday) {
			// Si la date est déjà au format YYYY-MM-DD, convertis-la
			let birthday = selectedProfile.birthday;
			if (/^\\d{4}-\\d{2}-\\d{2}$/.test(birthday)) {
				const [year, month, day] = birthday.split("-");
				birthday = `${day}-${month}-${year}`;
			}
			setFormData((prev) => ({
				...prev,
				birthday,
			}));
		}
	}, [selectedProfile]);

	// Affiche la card commune du profil au chargement
	useEffect(() => {
		if (selectedProfile && selectedProfile.city) {
			setSelectedCommune({
				code: selectedProfile.department_code || selectedProfile.city,
				nom: selectedProfile.city,
				departement: { nom: selectedProfile.department },
				codeDepartement: selectedProfile.department_code,
				region: { nom: selectedProfile.region },
				codeRegion: selectedProfile.region_code,
				centre: {
					coordinates: [
						selectedProfile.longitude,
						selectedProfile.latitude,
					],
				},
			});
		}
	}, [selectedProfile]);
	React.useEffect(() => {
		setData(initialData);
	}, [initialData]);
	const columns = withDndColumn([
		...dashboardColumns.map((col) =>
			col.accessorKey === "id"
				? {
						...col,
						cell: ({ row }) => (
							<div className='flex items-center gap-2'>
								<span>{row.original.id}</span>
								<button
									type='button'
									className='p-1 rounded bg-gray-100 hover:bg-gray-200 border'
									onClick={() => {
										navigator.clipboard.writeText(
											row.original.id,
										);
										toast.success(
											"ID copié dans le presse-papier",
										);
									}}
									title="Copier l'ID">
									<Copy className='w-4 h-4' />
								</button>
							</div>
						),
					}
				: col.accessorKey === "gender"
					? {
							...col,
							cell: ({ row }) => {
								const gender = row.original.gender;
								if (gender === "male") {
									return (
										<Badge
											variant='outline'
											className='flex items-center gap-1 px-2 py-1 text-blue-700 border-blue-300'>
											<Mars className='w-4 h-4 text-blue-500' />
											Homme
										</Badge>
									);
								} else if (gender === "female") {
									return (
										<Badge
											variant='outline'
											className='flex items-center gap-1 px-2 py-1 text-pink-700 border-pink-300'>
											<Venus className='w-4 h-4 text-pink-500' />
											Femme
										</Badge>
									);
								} else {
									return null;
								}
							},
						}
					: col,
		),
	]);
	const table = useDataTableInstance({
		data,
		columns,
		getRowId: (row) => row.id?.toString?.() || String(row.id),
	});

	const companiesTable = useDataTableInstance({
		data: companiesData ?? [],
		columns: companiesColumns,
		getRowId: (row) => row.id?.toString?.() || String(row.id),
	});

	const jobsTable = useDataTableInstance({
		data: jobsData ?? [],
		columns: jobsColumns,
		getRowId: (row) => row.id?.toString?.() || String(row.id),
	});

	const applicationsTable = useDataTableInstance({
		data: applicationsData ?? [],
		columns: applicationsColumns,
		getRowId: (row) => row.id?.toString?.() || String(row.id),
	});

	const handleRowClick = (row) => {
		console.log("Row clicked:", row.original);
		setSelectedProfile(row.original);
		setFormData(row.original);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSave = () => {
		setShowConfirm(true);
	};

	const handleConfirm = async () => {
		// Affiche le JWT utilisé pour l'update
		const session = await supabase.auth.getSession();
		const jwt = session?.data?.session?.access_token;
		console.log("JWT utilisé pour l'update:", jwt);
		try {
			// On retire l'id, newLanguage et newLicense du payload
			const { id, newLanguage, newLicense, ...rest } = formData;
			// On compare avec selectedProfile pour ne garder que les champs modifiés
			let updatePayload = Object.keys(rest).reduce((acc, key) => {
				if (rest[key] !== selectedProfile[key]) {
					acc[key] = rest[key];
				}
				return acc;
			}, {});
			console.log(
				"Payload envoyé à Supabase:",
				updatePayload,
				"pour le profil ID:",
				id,
			);
			if (Object.keys(updatePayload).length === 0) {
				toast.info("Aucune modification détectée.");
				setShowConfirm(false);
				setSelectedProfile(null);
				return;
			}
			if (selectedCommune) {
				updatePayload = {
					...updatePayload,
					city: selectedCommune.nom,
					department:
						selectedCommune.departement?.nom ||
						selectedCommune.codeDepartement,
					region:
						selectedCommune.region?.nom ||
						selectedCommune.codeRegion,
					latitude: selectedCommune.centre?.coordinates?.[1],
					longitude: selectedCommune.centre?.coordinates?.[0],
					department_code: selectedCommune.codeDepartement,
					region_code: selectedCommune.codeRegion,
				};
			}
			const { data: updateData, error } = await supabase
				.from("profiles")
				.update(updatePayload)
				.eq("id", id)
				.select();
			console.log("Résultat update Supabase:", { updateData, error });
			if (error || !updateData || updateData.length === 0) {
				toast.error(
					"Erreur lors de la mise à jour du profil : " +
						(error?.message || "Aucune modification enregistrée"),
				);
			} else {
				toast.success("Profil mis à jour avec succès !");
				setData((prev) =>
					prev.map((item) =>
						item.id === id ? { ...item, ...updatePayload } : item,
					),
				);
			}
		} catch (e) {
			console.error("Exception update:", e);
			toast.error("Erreur inattendue lors de la mise à jour.");
		}
		setShowConfirm(false);
		setSelectedProfile(null);
	};

	const [sheetOpen, setSheetOpen] = useState(false);

	React.useEffect(() => {
		function handleOpenProfileDrawer(e) {
			setSelectedProfile(e.detail);
			setFormData(e.detail);
			setSheetOpen(true);
		}
		window.addEventListener("openProfileDrawer", handleOpenProfileDrawer);
		return () => {
			window.removeEventListener(
				"openProfileDrawer",
				handleOpenProfileDrawer,
			);
		};
	}, []);

	return (
		<>
			<Tabs
				defaultValue='profiles'
				className='w-full flex-col justify-start gap-6'>
				<div className='flex items-center justify-between'>
					<Label htmlFor='view-selector' className='sr-only'>
						View
					</Label>
					<Select defaultValue='profiles'>
						<SelectTrigger
							className='flex @4xl/main:hidden w-fit'
							size='sm'
							id='view-selector'>
							<SelectValue placeholder='Select a view' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='profiles'>Candidats</SelectItem>
							<SelectItem value='companies'>
								Entreprises
							</SelectItem>
							{/* <SelectItem value='jobs'>
								Offres d'emploi
							</SelectItem>
							<SelectItem value='applications'>
								Candidatures
							</SelectItem> */}
						</SelectContent>
					</Select>
					<TabsList className='@4xl/main:flex hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1'>
						<TabsTrigger value='profiles'>Candidats</TabsTrigger>
						<TabsTrigger value='companies'>
							Entreprises
							<Badge variant='secondary'>3</Badge>
						</TabsTrigger>
						{/* <TabsTrigger value='jobs'>
							Offres d'emploi <Badge variant='secondary'>2</Badge>
						</TabsTrigger>
						<TabsTrigger value='applications'>
							Candidatures
						</TabsTrigger> */}
					</TabsList>
					<div className='flex items-center gap-2'>
						<DataTableViewOptions table={table} />
						<Button variant='outline' size='sm'>
							<Plus />
							<span className='hidden lg:inline'>
								Add Section
							</span>
						</Button>
					</div>
				</div>
				<TabsContent
					value='profiles'
					className='relative flex flex-col gap-4 overflow-auto'>
					<div className='overflow-hidden rounded-lg border'>
						<DataTableNew
							dndEnabled
							table={table}
							columns={columns}
							onReorder={setData}
							// onRowClick={handleRowClick}
						/>
					</div>
					<DataTablePagination table={table} />
				</TabsContent>
				<TabsContent value='companies' className='flex flex-col'>
					<div className='overflow-hidden rounded-lg border'>
						<CompaniesTable
							dndEnabled
							table={companiesTable}
							columns={companiesColumns}
							onReorder={setCompaniesData}
						/>
					</div>
					<DataTablePagination table={companiesTable} />
				</TabsContent>
				<TabsContent value='jobs' className='flex flex-col gap-4'>
					<div className='overflow-hidden rounded-lg border'>
						<DataTableNew table={jobsTable} columns={jobsColumns} />
					</div>
					<DataTablePagination table={jobsTable} />
				</TabsContent>
				<TabsContent
					value='applications'
					className='flex flex-col gap-4'>
					<div className='overflow-hidden rounded-lg border'>
						<DataTableNew
							table={applicationsTable}
							columns={applicationsColumns}
						/>
					</div>
					<DataTablePagination table={applicationsTable} />
				</TabsContent>
			</Tabs>
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent
					side='right'
					className='w-[400px] overflow-y-auto max-h-screen p-4'>
					{!!selectedProfile && (
						<>
							<SheetHeader>
								<SheetTitle>Profil candidat</SheetTitle>
							</SheetHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSave();
								}}>
								<div className='space-y-3'>
									{/* AvatarUpload au-dessus du formulaire */}
									<div className='flex justify-center mb-4'>
										<AvatarUpload
											avatarUrl={formData.avatar_url}
											onChange={(file) => {
												// Ici, tu peux gérer l'upload vers Supabase et mettre à jour formData.avatar_url
												toast.info(
													"Image sélectionnée : " +
														file.name,
												);
												// Exemple : setFormData({ ...formData, avatar_url: URL.createObjectURL(file) });
											}}
											size={96}
										/>
									</div>
									{/* Champs explicitement listés et ordonnés */}
									<div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Prénom
										</label>
										<input
											name='firstname'
											value={formData.firstname || ""}
											onChange={handleChange}
											className='border rounded px-2 py-1 w-full'
										/>
									</div>
									<div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Nom
										</label>
										<input
											name='lastname'
											value={formData.lastname || ""}
											onChange={handleChange}
											className='border rounded px-2 py-1 w-full'
										/>
									</div>
									{/* <div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Date de naissance
										</label>
										<DatePicker
											value={
												formData.birthday &&
												/^\d{4}-\d{2}-\d{2}$/.test(
													formData.birthday,
												)
													? new Date(
															formData.birthday,
														)
													: formData.birthday &&
														  /^\d{2}-\d{2}-\d{4}$/.test(
																formData.birthday,
														  )
														? new Date(
																formData.birthday
																	.split("-")
																	.reverse()
																	.join("/"),
															)
														: null
											}
											onChange={(date) => {
												if (date) {
													const day = String(
														date.getDate(),
													).padStart(2, "0");
													const month = String(
														date.getMonth() + 1,
													).padStart(2, "0");
													const year =
														date.getFullYear();
													setFormData({
														...formData,
														birthday: `${year}-${month}-${day}`,
													});
												} else {
													setFormData({
														...formData,
														birthday: "",
													});
												}
											}}
											format='YYYY-MM-DD'
											className='w-full'
										/>
									</div> */}
									<div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Genre
										</label>
										<Select
											value={
												formData.gender === "male"
													? "male"
													: formData.gender ===
														  "female"
														? "female"
														: ""
											}
											onValueChange={(value) =>
												setFormData({
													...formData,
													gender: value,
												})
											}>
											<SelectTrigger className='w-full border rounded px-2 py-1'>
												<SelectValue placeholder='Sélectionner le genre'>
													{formData.gender === "male"
														? "Homme"
														: formData.gender ===
															  "female"
															? "Femme"
															: "Sélectionner le genre"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='male'>
													Homme
												</SelectItem>
												<SelectItem value='female'>
													Femme
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Code postal
										</label>
										<input
											name='postcode'
											value={formData.postcode || ""}
											onChange={async (e) => {
												handleChange(e);
												const codePostal =
													e.target.value;
												if (
													/^\d{5}$/.test(codePostal)
												) {
													try {
														const res = await fetch(
															`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom,code,codeDepartement,codeRegion,region,departement,centre`,
														);
														const data =
															await res.json();
														setCommuneResults(data);
														setSelectedCommune(
															null,
														);
													} catch (err) {
														setCommuneResults([]);
														setSelectedCommune(
															null,
														);
													}
												} else {
													setCommuneResults([]);
													setSelectedCommune(null);
												}
											}}
											className='border rounded px-2 py-1 w-full'
										/>
										{formData.postcode && (
											<div className='mt-2'>
												{/* Affiche la card du profil sélectionné si aucun résultat API */}
												{communeResults.length === 0 &&
												selectedCommune ? (
													<Card
														key={
															selectedCommune.code ||
															selectedCommune.nom
														}
														className={`p-3 mb-2 border border-blue-500 bg-blue-50`}>
														<div className='font-bold'>
															{
																selectedCommune.nom
															}
														</div>
														<div className='text-xs text-gray-600'>
															Département :{" "}
															{selectedCommune
																.departement
																?.nom ||
																selectedCommune.codeDepartement}
														</div>
														<div className='text-xs text-gray-600'>
															Région :{" "}
															{selectedCommune
																.region?.nom ||
																selectedCommune.codeRegion}
														</div>
														{/* <div className='text-xs text-gray-600'>
															Latitude :{" "}
															{selectedCommune
																.centre
																?.coordinates?.[1] ||
																"-"}
														</div>
														<div className='text-xs text-gray-600'>
															Longitude :{" "}
															{selectedCommune
																.centre
																?.coordinates?.[0] ||
																"-"}
														</div> */}
														<div className='text-xs text-gray-600'>
															Code département :{" "}
															{
																selectedCommune.codeDepartement
															}
														</div>
														<div className='text-xs text-gray-600'>
															Code région :{" "}
															{
																selectedCommune.codeRegion
															}
														</div>
													</Card>
												) : null}
												{/* Affiche les résultats de l'API si présents */}
												{communeResults.length > 0
													? communeResults.map(
															(commune) => (
																<Card
																	key={
																		commune.code
																	}
																	className={`p-3 mb-2 cursor-pointer border ${selectedCommune?.code === commune.code ? "border-blue-500 bg-blue-50" : ""}`}
																	onClick={() =>
																		setSelectedCommune(
																			commune,
																		)
																	}>
																	<div className='font-bold'>
																		{
																			commune.nom
																		}
																	</div>
																	<div className='text-xs text-gray-600'>
																		Département
																		:{" "}
																		{commune
																			.departement
																			?.nom ||
																			commune.codeDepartement}
																	</div>
																	<div className='text-xs text-gray-600'>
																		Région :{" "}
																		{commune
																			.region
																			?.nom ||
																			commune.codeRegion}
																	</div>
																	{/* <div className='text-xs text-gray-600'>
																		Latitude
																		:{" "}
																		{commune
																			.centre
																			?.coordinates?.[1] ||
																			"-"}
																	</div>
																	<div className='text-xs text-gray-600'>
																		Longitude
																		:{" "}
																		{commune
																			.centre
																			?.coordinates?.[0] ||
																			"-"}
																	</div> */}
																	<div className='text-xs text-gray-600'>
																		Code
																		département
																		:{" "}
																		{
																			commune.codeDepartement
																		}
																	</div>
																	<div className='text-xs text-gray-600'>
																		Code
																		région :{" "}
																		{
																			commune.codeRegion
																		}
																	</div>
																</Card>
															),
														)
													: null}
											</div>
										)}
									</div>
									<div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Email
										</label>
										<input
											name='email'
											value={formData.email || ""}
											onChange={handleChange}
											className='border rounded px-2 py-1 w-full'
										/>
									</div>
									<div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Ancien militaire
										</label>
										<Switch
											checked={Boolean(
												formData.former_soldier,
											)}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													former_soldier: checked,
												})
											}
											className='ml-2'
										/>
									</div>
									<div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Permis de conduire
										</label>
										<div className='flex flex-wrap gap-2 mb-2'>
											{(formData.driving_licenses
												? formData.driving_licenses
														.split(",")
														.map((l) => l.trim())
														.filter((l) => l)
												: []
											).map((license, idx) => (
												<span
													key={license + idx}
													className='inline-flex items-center bg-gray-100 text-xs rounded px-2 py-1 border border-gray-300'>
													{license}
													<button
														type='button'
														className='ml-1 text-gray-500 hover:text-red-500'
														onClick={() => {
															const licenses = (
																formData.driving_licenses ||
																""
															)
																.split(",")
																.map((l) =>
																	l.trim(),
																)
																.filter(
																	(l) => l,
																);
															licenses.splice(
																idx,
																1,
															);
															setFormData({
																...formData,
																driving_licenses:
																	licenses.join(
																		", ",
																	),
															});
														}}
														aria-label={`Supprimer ${license}`}>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='w-3 h-3'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M6 18L18 6M6 6l12 12'
															/>
														</svg>
													</button>
												</span>
											))}
										</div>
										<Select
											value={formData.newLicense || ""}
											onValueChange={(value) => {
												if (
													value &&
													!(
														formData.driving_licenses ||
														""
													)
														.split(",")
														.map((l) => l.trim())
														.includes(value)
												) {
													const licenses = (
														formData.driving_licenses ||
														""
													)
														.split(",")
														.map((l) => l.trim())
														.filter((l) => l);
													licenses.push(value);
													setFormData({
														...formData,
														driving_licenses:
															licenses.join(", "),
														newLicense: "",
													});
												}
											}}>
											<SelectTrigger className='w-full border rounded px-2 py-1'>
												<SelectValue placeholder='Ajouter un permis' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='AM'>
													AM
												</SelectItem>
												<SelectItem value='A1'>
													A1
												</SelectItem>
												<SelectItem value='A2'>
													A2
												</SelectItem>
												<SelectItem value='A'>
													A
												</SelectItem>
												<SelectItem value='B'>
													B
												</SelectItem>
												<SelectItem value='BE'>
													BE
												</SelectItem>
												<SelectItem value='B1'>
													B1
												</SelectItem>
												<SelectItem value='C1'>
													C1
												</SelectItem>
												<SelectItem value='C1E'>
													C1E
												</SelectItem>
												<SelectItem value='C'>
													C
												</SelectItem>
												<SelectItem value='CE'>
													CE
												</SelectItem>
												<SelectItem value='D1'>
													D1
												</SelectItem>
												<SelectItem value='D1E'>
													D1E
												</SelectItem>
												<SelectItem value='D'>
													D
												</SelectItem>
												<SelectItem value='DE'>
													DE
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className='mb-4'>
										<label className='block text-sm font-medium mb-1'>
											Langues
										</label>
										<div className='flex flex-wrap gap-2 mb-2'>
											{(formData.languages
												? formData.languages
														.split(",")
														.map((l) => l.trim())
														.filter((l) => l)
												: []
											).map((lang, idx) => (
												<span
													key={lang + idx}
													className='inline-flex items-center bg-gray-100 text-xs rounded px-2 py-1 border border-gray-300'>
													{lang}
													<button
														type='button'
														className='ml-1 text-gray-500 hover:text-red-500'
														onClick={() => {
															const langs = (
																formData.languages ||
																""
															)
																.split(",")
																.map((l) =>
																	l.trim(),
																)
																.filter(
																	(l) => l,
																);
															langs.splice(
																idx,
																1,
															);
															setFormData({
																...formData,
																languages:
																	langs.join(
																		", ",
																	),
															});
														}}
														aria-label={`Supprimer ${lang}`}>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='w-3 h-3'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M6 18L18 6M6 6l12 12'
															/>
														</svg>
													</button>
												</span>
											))}
										</div>
										<div className='flex gap-2'>
											<input
												type='text'
												placeholder='Ajouter une langue'
												className='border rounded px-2 py-1 flex-1'
												value={
													formData.newLanguage || ""
												}
												onChange={(e) =>
													setFormData({
														...formData,
														newLanguage:
															e.target.value,
													})
												}
												onKeyDown={(e) => {
													if (
														e.key === "Enter" &&
														formData.newLanguage?.trim()
													) {
														const langs = (
															formData.languages ||
															""
														)
															.split(",")
															.map((l) =>
																l.trim(),
															)
															.filter((l) => l);
														if (
															!langs.includes(
																formData.newLanguage.trim(),
															)
														) {
															langs.push(
																formData.newLanguage.trim(),
															);
															setFormData({
																...formData,
																languages:
																	langs.join(
																		", ",
																	),
																newLanguage: "",
															});
														}
													}
												}}
											/>
											<Button
												type='button'
												onClick={() => {
													if (
														formData.newLanguage?.trim()
													) {
														const langs = (
															formData.languages ||
															""
														)
															.split(",")
															.map((l) =>
																l.trim(),
															)
															.filter((l) => l);
														if (
															!langs.includes(
																formData.newLanguage.trim(),
															)
														) {
															langs.push(
																formData.newLanguage.trim(),
															);
															setFormData({
																...formData,
																languages:
																	langs.join(
																		", ",
																	),
																newLanguage: "",
															});
														}
													}
												}}>
												Ajouter
											</Button>
										</div>
									</div>
									<div className='mb-4 flex gap-4'>
										<div className='w-1/2'>
											<label className='block text-sm font-medium mb-1'>
												Taille
											</label>
											<input
												name='height'
												value={formData.height || ""}
												onChange={handleChange}
												className='border rounded px-2 py-1 w-full'
											/>
										</div>
										<div className='w-1/2'>
											<label className='block text-sm font-medium mb-1'>
												Poids
											</label>
											<input
												name='weight'
												value={formData.weight || ""}
												onChange={handleChange}
												className='border rounded px-2 py-1 w-full'
											/>
										</div>
									</div>
								</div>
								<Button type='submit' className='w-full mt-4'>
									Enregistrer
								</Button>
							</form>
						</>
					)}
				</SheetContent>
			</Sheet>
			<Sheet open={companySheetOpen} onOpenChange={setCompanySheetOpen}>
				<SheetContent
					side='right'
					className='w-[400px] overflow-y-auto max-h-screen p-4'>
					<SheetHeader>
						<SheetTitle>Modifier l'entreprise</SheetTitle>
					</SheetHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleUpdateCompany();
						}}
						className='space-y-4'>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Nom
							</label>
							<input
								name='name'
								value={formDataCompany.name}
								onChange={handleChangeCompany}
								className='border rounded px-2 py-1 w-full'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Email
							</label>
							<input
								name='email'
								value={formDataCompany.email}
								onChange={handleChangeCompany}
								className='border rounded px-2 py-1 w-full'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Stripe Customer ID
							</label>
							<input
								name='stripe_customer_id'
								value={formDataCompany.stripe_customer_id}
								readOnly
								className='border rounded px-2 py-1 w-full bg-gray-100'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Description
							</label>
							<textarea
								name='description'
								value={formDataCompany.description}
								onChange={handleChangeCompany}
								className='border rounded px-2 py-1 w-full min-h-[80px]'
							/>
						</div>
						<Button type='submit' className='w-full mt-4'>
							Mettre à jour
						</Button>
					</form>
				</SheetContent>
			</Sheet>
			<Sheet open={jobSheetOpen} onOpenChange={setJobSheetOpen}>
				<SheetContent
					side='right'
					className='w-[400px] overflow-y-auto max-h-screen p-4'>
					<SheetHeader>
						<SheetTitle>Modifier l'offre d'emploi</SheetTitle>
					</SheetHeader>
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							const { error } = await supabase
								.from("jobs")
								.update({
									title: jobFormData.title,
									is_archived: jobFormData.is_archived,
								})
								.eq("id", selectedJob.id);
							if (error) {
								toast.error("Erreur : " + error.message);
							} else {
								toast.success("Offre mise à jour !");
								setJobsData((prev) =>
									prev.map((j) =>
										j.id === selectedJob.id
											? { ...j, ...jobFormData }
											: j,
									),
								);
								setJobSheetOpen(false);
							}
						}}
						className='space-y-4 mt-4'>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Titre
							</label>
							<input
								name='title'
								value={jobFormData.title ?? ""}
								onChange={(e) =>
									setJobFormData((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
								className='border rounded px-2 py-1 w-full'
							/>
						</div>
						<div className='flex items-center justify-between'>
							<Label
								htmlFor='job-is-archived'
								className='text-sm font-medium'>
								Archivé
							</Label>
							<Switch
								id='job-is-archived'
								checked={jobFormData.is_archived ?? false}
								onCheckedChange={(checked) =>
									setJobFormData((prev) => ({
										...prev,
										is_archived: checked,
									}))
								}
							/>
						</div>
						<Button type='submit' className='w-full mt-4'>
							Mettre à jour
						</Button>
					</form>
				</SheetContent>
			</Sheet>
			<Dialog
				open={jobStatusDialogOpen}
				onOpenChange={setJobStatusDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier le statut de l'offre</DialogTitle>
					</DialogHeader>
					<div className='flex flex-col gap-4'>
						<div className='flex gap-2 justify-center'>
							{[
								{
									value: "draft",
									dot: "bg-yellow-400",
									label: "Brouillon",
								},
								{
									value: "published",
									dot: "bg-green-500",
									label: "Publié",
								},
								{
									value: "archived",
									dot: "bg-red-500",
									label: "Archivé",
								},
							].map(({ value, dot, label }) => (
								<button
									key={value}
									type='button'
									className={`focus:outline-none ${newJobStatus === value ? "ring-2 ring-primary rounded-full" : ""}`}
									onClick={() => setNewJobStatus(value)}>
									<Badge
										variant='outline'
										className='flex items-center gap-1.5 px-4 py-2 cursor-pointer'>
										<span
											className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`}
										/>
										{label}
									</Badge>
								</button>
							))}
						</div>
						<Button
							onClick={handleUpdateJobStatus}
							disabled={
								!newJobStatus ||
								newJobStatus === selectedJob?.status
							}
							className='w-full'>
							Mettre à jour
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog
				open={companyDialogOpen}
				onOpenChange={setCompanyDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Modifier le statut de l'entreprise
						</DialogTitle>
					</DialogHeader>
					<div className='flex flex-col gap-4'>
						<div className='flex gap-2 justify-center'>
							{["active", "pending", "rejected", "suspended"].map(
								(status) => {
									const { color, label } =
										getCompanyStatusBadge(status);
									return (
										<button
											key={status}
											type='button'
											className={`focus:outline-none ${newStatus === status ? "ring-2 ring-primary" : ""}`}
											onClick={() =>
												setNewStatus(status)
											}>
											<Badge
												variant={color}
												className='px-4 py-2 cursor-pointer'>
												{label}
											</Badge>
										</button>
									);
								},
							)}
						</div>
						{(newStatus === "suspended" ||
							newStatus === "rejected") && (
							<div className='flex flex-col gap-1.5'>
								<label className='text-sm font-medium'>
									{newStatus === "rejected"
										? "Raison du refus"
										: "Raison de la suspension"}
								</label>
								<textarea
									className='w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring'
									rows={3}
									value={companyRejectReason}
									onChange={(e) =>
										setCompanyRejectReason(e.target.value)
									}
									placeholder={
										newStatus === "rejected"
											? "Expliquer la raison du refus…"
											: "Expliquer la raison de la suspension…"
									}
								/>
							</div>
						)}
						<Button
							onClick={handleUpdateStatus}
							disabled={
								!newStatus ||
								newStatus === selectedCompany?.company_status
							}
							className='w-full'>
							Mettre à jour
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog open={kbisDialogOpen} onOpenChange={setKbisDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Statut KBIS de l'entreprise</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<span className='font-semibold'>
								Document KBIS :
							</span>
							{selectedCompany?.kbis_url ? (
								signedKbisUrl ? (
									<a
										href={signedKbisUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='block mt-2 text-blue-600 underline'>
										Voir le KBIS
									</a>
								) : (
									<span className='block mt-2 text-gray-400'>
										Lien KBIS inaccessible
									</span>
								)
							) : (
								<span className='block mt-2 text-gray-400'>
									Aucun document envoyé
								</span>
							)}
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>
								SIRET
							</label>
							<input
								name='siret'
								value={formatSiret(newSiret)}
								onChange={(e) =>
									setNewSiret(
										e.target.value.replace(/\D/g, ""),
									)
								}
								minLength={15}
								maxLength={15}
								className='border rounded px-2 py-1 w-full'
							/>
						</div>
						<div className='flex gap-2 justify-center'>
							<Button
								variant={
									newKbisStatus === "verified"
										? "default"
										: "outline"
								}
								onClick={() => setNewKbisStatus("verified")}>
								Vérifié
							</Button>
							<Button
								variant={
									newKbisStatus === "pending"
										? "default"
										: "outline"
								}
								onClick={() => setNewKbisStatus("pending")}>
								En attente
							</Button>
							<Button
								variant={
									newKbisStatus === "rejected"
										? "default"
										: "outline"
								}
								onClick={() => setNewKbisStatus("rejected")}>
								Refusé
							</Button>
						</div>
						<Button
							onClick={handleUpdateKbisStatus}
							disabled={
								(!newKbisStatus ||
									newKbisStatus ===
										selectedCompany?.kbis_verification_status) &&
								newSiret === selectedCompany?.siret
							}
							className='w-full'>
							Mettre à jour
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog
				open={signatureDialogOpen}
				onOpenChange={setSignatureDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Signature du candidat</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<span className='font-semibold text-sm'>
								Document :
							</span>
							{selectedSignatureProfile?.signature_url ? (
								signedSignatureUrl ? (
									<img
										src={signedSignatureUrl}
										alt='Signature'
										className='mt-2 max-h-32 rounded border object-contain bg-white'
									/>
								) : (
									<span className='block mt-2 text-gray-400 text-sm'>
										Chargement…
									</span>
								)
							) : (
								<span className='block mt-2 text-gray-400 text-sm'>
									Aucune signature envoyée
								</span>
							)}
						</div>
						<div className='flex gap-2 justify-center'>
							{["pending", "verified", "rejected"].map((s) => {
								const labels = {
									pending: "En attente",
									verified: "Vérifiée",
									rejected: "Refusée",
								};
								return (
									<Button
										key={s}
										variant={
											newSignatureStatus === s
												? "default"
												: "outline"
										}
										onClick={() =>
											setNewSignatureStatus(s)
										}>
										{labels[s]}
									</Button>
								);
							})}
						</div>
						<Button
							onClick={handleUpdateSignatureStatus}
							disabled={
								!newSignatureStatus ||
								newSignatureStatus ===
									selectedSignatureProfile?.signature_status
							}
							className='w-full'>
							Mettre à jour
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog
				open={companySignatureDialogOpen}
				onOpenChange={setCompanySignatureDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Signature de l&apos;éntreprise
						</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<span className='font-semibold text-sm'>
								Document :
							</span>
							{selectedCompanySignature?.signature_url ? (
								<img
									src={selectedCompanySignature.signature_url}
									alt='Signature'
									className='mt-2 max-h-32 rounded border object-contain bg-white'
								/>
							) : (
								<span className='block mt-2 text-gray-400 text-sm'>
									Aucune signature envoyée
								</span>
							)}
						</div>
						<div className='flex gap-2 justify-center'>
							{["pending", "verified", "rejected"].map((s) => {
								const labels = {
									pending: "En attente",
									verified: "Vérifiée",
									rejected: "Refusée",
								};
								return (
									<Button
										key={s}
										variant={
											newCompanySignatureStatus === s
												? "default"
												: "outline"
										}
										onClick={() =>
											setNewCompanySignatureStatus(s)
										}>
										{labels[s]}
									</Button>
								);
							})}
						</div>
						<Button
							onClick={handleUpdateCompanySignatureStatus}
							disabled={
								!newCompanySignatureStatus ||
								newCompanySignatureStatus ===
									selectedCompanySignature?.signature_status
							}
							className='w-full'>
							Mettre à jour
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog
				open={companyStampDialogOpen}
				onOpenChange={setCompanyStampDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Tampon de l&apos;éntreprise</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<span className='font-semibold text-sm'>
								Document :
							</span>
							{selectedCompanyStamp?.stamp_url ? (
								<img
									src={selectedCompanyStamp.stamp_url}
									alt='Tampon'
									className='mt-2 max-h-32 rounded border object-contain bg-white'
								/>
							) : (
								<span className='block mt-2 text-gray-400 text-sm'>
									Aucun tampon envoyé
								</span>
							)}
						</div>
						<div className='flex gap-2 justify-center'>
							{["pending", "verified", "rejected"].map((s) => {
								const labels = {
									pending: "En attente",
									verified: "Vérifié",
									rejected: "Refusé",
								};
								return (
									<Button
										key={s}
										variant={
											newCompanyStampStatus === s
												? "default"
												: "outline"
										}
										onClick={() =>
											setNewCompanyStampStatus(s)
										}>
										{labels[s]}
									</Button>
								);
							})}
						</div>
						<Button
							onClick={handleUpdateCompanyStampStatus}
							disabled={
								!newCompanyStampStatus ||
								newCompanyStampStatus ===
									selectedCompanyStamp?.stamp_status
							}
							className='w-full'>
							Mettre à jour
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			{showConfirm && (
				<div className='fixed inset-0 flex items-center justify-center bg-black/40 z-60'>
					<div className='bg-white p-6 rounded shadow-lg'>
						<h3 className='text-lg font-bold mb-2'>
							Confirmer la modification
						</h3>
						<p>
							Voulez-vous vraiment enregistrer les modifications ?
						</p>
						<div className='flex gap-4 mt-4'>
							<Button onClick={handleConfirm}>
								Oui, enregistrer
							</Button>
							<Button
								variant='outline'
								onClick={() => setShowConfirm(false)}>
								Annuler
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
