import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Pencil } from "lucide-react";

function getCompanyStatusBadge(status) {
	switch (status) {
		case "active":
			return { color: "success", label: "Active" };
		case "pending":
			return { color: "warning", label: "En attente" };
		case "inactive":
			return { color: "outline", label: "Inactive" };
		case "suspended":
			return { color: "destructive", label: "Suspendue" };
		default:
			return { color: "outline", label: "Non défini" };
	}
}

export const companiesColumns = [
	{
		accessorKey: "logo_url",
		header: "Logo",
		cell: ({ row }) =>
			row.original.logo_url ? (
				<img
					src={row.original.logo_url}
					alt={row.original.name + " logo"}
					className='h-10 w-10 rounded border object-cover'
				/>
			) : (
				<span className='text-xs text-gray-400'>Aucun logo</span>
			),
		size: 60,
		enableSorting: false,
	},
	{
		accessorKey: "name",
		header: "Nom",
		cell: ({ row }) => (
			<span className='font-semibold'>{row.original.name}</span>
		),
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => <span>{row.original.email}</span>,
	},
	// {
	// 	accessorKey: "siret",
	// 	header: "SIRET",
	// 	cell: ({ row }) => (
	// 		<div className='flex items-center gap-2'>
	// 			<span>{row.original.siret}</span>
	// 			<button
	// 				type='button'
	// 				className='p-1 rounded bg-gray-100 hover:bg-gray-200 border'
	// 				onClick={() =>
	// 					navigator.clipboard.writeText(row.original.siret)
	// 				}
	// 				title='Copier le SIRET'>
	// 				<Copy className='w-4 h-4' />
	// 			</button>
	// 		</div>
	// 	),
	// },
	{
		accessorKey: "kbis_verification_status",
		header: "Statut KBIS",
		cell: ({ row }) => {
			const status = row.original.kbis_verification_status;
			const hasKbis = !!row.original.kbis_url;
			let color = "bg-gray-400";
			let label = "Aucun document envoyé";
			let clickable = false;

			if (hasKbis) {
				clickable = true;
				if (status === "verified") {
					color = "bg-green-500";
					label = "Vérifié";
				} else if (status === "pending") {
					color = "bg-yellow-400";
					label = "En attente";
				} else if (status === "rejected") {
					color = "bg-red-500";
					label = "Refusé";
				}
			}

			const badge = (
				<span
					className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm font-medium bg-white border-gray-300 ${!clickable ? "text-gray-400" : "cursor-pointer"}`}>
					<span className={`w-2 h-2 rounded-full ${color}`} />
					{label}
				</span>
			);

			return clickable ? (
				<button
					type='button'
					className='focus:outline-none'
					onClick={() => {
						const event = new CustomEvent("openKbisStatusDialog", {
							detail: row.original,
						});
						window.dispatchEvent(event);
					}}
					title='Modifier le statut KBIS'>
					{badge}
				</button>
			) : (
				badge
			);
		},
		size: 140,
	},
	// {
	// 	accessorKey: "isConfirmed",
	// 	header: "Confirmée",
	// 	cell: ({ row }) => (
	// 		<Badge variant={row.original.isConfirmed ? "success" : "outline"}>
	// 			{row.original.isConfirmed ? "Oui" : "Non"}
	// 		</Badge>
	// 	),
	// },
	{
		accessorKey: "company_status",
		header: "Statut entreprise",
		cell: ({ row }) => {
			const status = row.original.company_status;
			let color = "gray";
			let label = "Non défini";
			if (status === "active") {
				color = "bg-green-500";
				label = "Active";
			} else if (status === "pending") {
				color = "bg-yellow-400";
				label = "En attente";
			} else if (status === "inactive") {
				color = "bg-gray-400";
				label = "Inactive";
			} else if (status === "suspended") {
				color = "bg-red-500";
				label = "Suspendue";
			}
			return (
				<button
					type='button'
					className='focus:outline-none'
					onClick={() => {
						const event = new CustomEvent(
							"openCompanyStatusDialog",
							{ detail: row.original },
						);
						window.dispatchEvent(event);
					}}
					title='Modifier le statut'>
					<span className='inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm font-medium bg-white border-gray-300 cursor-pointer'>
						<span className={`w-2 h-2 rounded-full ${color}`} />
						{label}
					</span>
				</button>
			);
		},
		size: 120,
	},
	// {
	// 	accessorKey: "isArchived",
	// 	header: "Archivée",
	// 	cell: ({ row }) => (
	// 		<Badge
	// 			variant={row.original.isArchived ? "destructive" : "outline"}>
	// 			{row.original.isArchived ? "Oui" : "Non"}
	// 		</Badge>
	// 	),
	// },
	// {
	// 	accessorKey: "created_at",
	// 	header: "Créée le",
	// 	cell: ({ row }) => {
	// 		const date = new Date(row.original.created_at);
	// 		return date.toLocaleDateString("fr-FR");
	// 	},
	// },
	// {
	// 	accessorKey: "updated_at",
	// 	header: "Modifiée le",
	// 	cell: ({ row }) => {
	// 		const date = new Date(row.original.updated_at);
	// 		return date.toLocaleDateString("fr-FR");
	// 	},
	// },
	// {
	// 	accessorKey: "description",
	// 	header: "Description",
	// 	cell: ({ row }) => (
	// 		<span className='line-clamp-2 text-xs text-gray-600 max-w-xs'>
	// 			{row.original.description}
	// 		</span>
	// 	),
	// 	size: 300,
	// },
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => (
			<Button
				variant='outline'
				size='sm'
				onClick={() => {
					if (typeof window !== "undefined") {
						const event = new CustomEvent("openCompanySheet", {
							detail: row.original,
						});
						window.dispatchEvent(event);
					}
				}}>
				<Pencil className='w-4 h-4' />
			</Button>
		),
		enableSorting: false,
	},
];
