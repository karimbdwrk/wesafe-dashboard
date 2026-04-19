"use client";

import { Bell, Check, FileText } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase/supabaseClient";

type Notification = {
	id: string;
	title: string;
	body: string;
	type: string;
	is_read: boolean;
	created_at: string;
	actor_id: string | null;
	entity_type: string | null;
	metadata: Record<string, string> | null;
};

function timeAgo(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const min = Math.floor(diff / 60000);
	if (min < 1) return "À l'instant";
	if (min < 60) return `Il y a ${min} min`;
	const h = Math.floor(min / 60);
	if (h < 24) return `Il y a ${h}h`;
	const d = Math.floor(h / 24);
	return `Il y a ${d}j`;
}

export function NotificationsDrawer() {
	const [open, setOpen] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [actorNames, setActorNames] = useState<Record<string, string>>({});
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		async function init() {
			const { data: auth } = await supabase.auth.getUser();
			const user = auth?.user;
			if (!user) return;
			setUserId(user.id);

			// Détecter le rôle : company ou admin
			const { data: company } = await supabase
				.from("companies")
				.select("id")
				.eq("id", user.id)
				.maybeSingle();

			const isCompany = !!company;

			// Construction de la requête selon le rôle
			let query = supabase
				.from("notifications")
				.select("*")
				.eq("recipient_id", user.id)
				.order("created_at", { ascending: false });

			// Les admins n'ont pas besoin des notifs de type support_message (gérées dans la page messagerie)
			if (!isCompany) {
				query = query.neq("type", "support_message");
			}

			const { data, error } = await query;

			if (error) {
				console.error("[NotificationsDrawer] Erreur:", error.message);
				return;
			}
			const notifs = (data as Notification[]) ?? [];
			setNotifications(notifs);

			// Récupérer les noms des acteurs
			const ids = [...new Set(notifs.map((n) => n.actor_id).filter(Boolean))] as string[];
			if (ids.length === 0) return;

			const [{ data: profiles }, { data: companies }] = await Promise.all([
				supabase
					.from("profiles")
					.select("id, firstname, lastname")
					.in("id", ids),
				supabase
					.from("companies")
					.select("id, name")
					.in("id", ids),
			]);

			const map: Record<string, string> = {};
			profiles?.forEach((p) => {
				map[p.id] = `${p.firstname || ""} ${p.lastname || ""}`.trim() || "Candidat";
			});
			companies?.forEach((c) => {
				map[c.id] = c.name || "Entreprise";
			});
			setActorNames(map);
		}
		init();
	}, []);

	const unreadCount = notifications.filter((n) => !n.is_read).length;

	async function markAsRead(id: string) {
		const { error } = await supabase
			.from("notifications")
			.update({ is_read: true, read_at: new Date().toISOString() })
			.eq("id", id);
		if (!error) {
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
			);
		}
	}

	async function markAllAsRead() {
		const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
		if (unreadIds.length === 0) return;
		const { error } = await supabase
			.from("notifications")
			.update({ is_read: true, read_at: new Date().toISOString() })
			.in("id", unreadIds);
		if (!error) {
			setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
		}
	}

	return (
		<>
			<Button
				variant='outline'
				size='icon'
				className='relative'
				onClick={() => setOpen(true)}
				aria-label='Notifications'>
				<Bell className='h-4 w-4' />
				{unreadCount > 0 && (
					<Badge className='absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] leading-none rounded-full'>
						{unreadCount > 99 ? "99+" : unreadCount}
					</Badge>
				)}
			</Button>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side='right' className='flex flex-col w-80 sm:w-96 p-0'>
					<SheetHeader className='px-4 pt-4 pb-3 border-b'>
						<div className='flex items-center justify-between'>
							<SheetTitle className='flex items-center gap-2 text-base'>
								<Bell className='h-4 w-4' />
								Notifications
								{unreadCount > 0 && (
									<Badge variant='secondary' className='text-xs'>
										{unreadCount} non lues
									</Badge>
								)}
							</SheetTitle>
							{/* {unreadCount > 0 && (
								<Button
									variant='ghost'
									size='sm'
									className='text-xs h-7 px-2 text-muted-foreground'
									onClick={markAllAsRead}>
									Tout marquer lu
								</Button>
							)} */}
						</div>
					</SheetHeader>

					<div className='flex-1 overflow-y-auto min-h-0'>
						{notifications.length === 0 ? (
							<div className='flex flex-col items-center justify-center gap-2 text-center text-muted-foreground py-20'>
								<Bell className='h-8 w-8 opacity-20' />
								<p className='text-sm'>Aucune notification</p>
							</div>
						) : (
							<div className='divide-y'>
								{notifications.map((notif) => (
									<div
										key={notif.id}
										className={`flex gap-3 px-4 py-3 transition-colors ${!notif.is_read ? "bg-muted/50" : ""}`}>
										{/* Icône */}
										<div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${!notif.is_read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
											<FileText className='h-4 w-4' />
										</div>

										{/* Contenu */}
										<div className='flex-1 min-w-0'>
											<div className='flex items-start justify-between gap-2'>
												<p className={`text-sm leading-snug ${!notif.is_read ? "font-semibold" : "font-medium text-muted-foreground"}`}>
													{notif.title}
												</p>
												{!notif.is_read && (
													<span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary' />
												)}
											</div>
											{notif.actor_id && actorNames[notif.actor_id] && (
												<p className='text-xs font-medium text-foreground mt-0.5'>
													{actorNames[notif.actor_id]}
												</p>
											)}
											{notif.body && (
												<p className='text-xs text-muted-foreground mt-0.5 line-clamp-2'>
													{notif.body}
												</p>
											)}
											<div className='flex items-center justify-between mt-1.5'>
												<span className='text-[11px] text-muted-foreground'>
													{timeAgo(notif.created_at)}
												</span>
												{!notif.is_read && (
													<Button
														variant='ghost'
														size='sm'
														className='h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground'
														onClick={() => markAsRead(notif.id)}>
														<Check className='h-3 w-3 mr-1' />
														Marquer lu
													</Button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}

