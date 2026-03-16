"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, MessageSquare, CheckCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SUPERADMIN_ID = "c5f72d6f-7ab4-4e19-8b3b-12714740efad";

function TypingIndicator() {
	return (
		<div className='flex justify-start'>
			<div className='bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center'>
				<span className='w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]' />
				<span className='w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]' />
				<span className='w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]' />
			</div>
		</div>
	);
}

function timeLabel(dateStr) {
	const d = new Date(dateStr);
	const now = new Date();
	const diffDays = Math.floor((now - d) / 86400000);
	if (diffDays === 0)
		return d.toLocaleTimeString("fr-FR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	if (diffDays === 1) return "Hier";
	if (diffDays < 7)
		return d.toLocaleDateString("fr-FR", { weekday: "short" });
	return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function fullTime(dateStr) {
	return new Date(dateStr).toLocaleTimeString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function Page() {
	const [conversations, setConversations] = useState([]);
	const [actorNames, setActorNames] = useState({});
	const [selected, setSelected] = useState(null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [sending, setSending] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	// true quand une activité récente (typing ou message) a été reçue du participant
	const [convParticipantOnline, setConvParticipantOnline] = useState(false);
	const messagesContainerRef = useRef(null);
	const typingTimeoutRef = useRef(null);
	// Timeout qui éteint le rond vert après 30s sans aucune activité du participant
	const onlineTimeoutRef = useRef(null);
	// Référence au canal conv:{id} — assignée SEULEMENT après SUBSCRIBED
	const convChannelRef = useRef(null);
	const selectedRef = useRef(null);

	// Charger les conversations + dernier message
	useEffect(() => {
		supabase
			.from("support_conversations")
			.select(
				"*, support_messages(id, content, created_at, sender_id, is_read)",
			)
			.order("created_at", { ascending: false })
			.then(async ({ data, error }) => {
				if (error) {
					// Fallback : construire conversations depuis les messages directement
					const { data: msgs } = await supabase
						.from("support_messages")
						.select("*")
						.order("created_at", { ascending: false });

					if (!msgs) return;

					// Grouper par conversation_id
					const convMap = {};
					msgs.forEach((m) => {
						if (!convMap[m.conversation_id]) {
							convMap[m.conversation_id] = {
								id: m.conversation_id,
								lastMessage: m,
								unread: 0,
								participantId:
									m.sender_id !== SUPERADMIN_ID
										? m.sender_id
										: null,
							};
						}
						if (!m.is_read && m.sender_id !== SUPERADMIN_ID) {
							convMap[m.conversation_id].unread++;
						}
					});

					const convList = Object.values(convMap).sort((a, b) => {
						const ta = a.lastMessage?.created_at ?? "";
						const tb = b.lastMessage?.created_at ?? "";
						return tb.localeCompare(ta);
					});
					setConversations(convList);
					await loadActorNames(
						convList.map((c) => c.participantId).filter(Boolean),
					);
				} else {
					const convList = (data ?? [])
						.map((c) => {
							const msgs = c.support_messages ?? [];
							const sorted = [...msgs].sort(
								(a, b) =>
									new Date(b.created_at) -
									new Date(a.created_at),
							);
							const unread = msgs.filter(
								(m) =>
									!m.is_read && m.sender_id !== SUPERADMIN_ID,
							).length;
							const participantId =
								msgs.find((m) => m.sender_id !== SUPERADMIN_ID)
									?.sender_id ?? null;
							return {
								...c,
								lastMessage: sorted[0] ?? null,
								unread,
								participantId,
							};
						})
						.sort((a, b) => {
							const ta = a.lastMessage?.created_at ?? "";
							const tb = b.lastMessage?.created_at ?? "";
							return tb.localeCompare(ta);
						});
					setConversations(convList);
					await loadActorNames(
						convList.map((c) => c.participantId).filter(Boolean),
					);
				}
			});
	}, []);

	// ── Realtime global : mise à jour de la liste des conversations ──────
	useEffect(() => {
		const listChannel = supabase
			.channel("all-messages-list")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "support_messages",
				},
				(payload) => {
					const msg = payload.new;
					setConversations((prev) => {
						const convId = msg.conversation_id;
						const exists = prev.find((c) => c.id === convId);
						let updated;
						if (exists) {
							updated = prev.map((c) => {
								if (c.id !== convId) return c;
								const isSelected =
									selectedRef.current?.id === convId;
								const isFromOther =
									msg.sender_id !== SUPERADMIN_ID;
								return {
									...c,
									lastMessage: msg,
									// Incrémenter non-lu seulement si conv non active et message entrant
									unread:
										isFromOther && !isSelected
											? (c.unread ?? 0) + 1
											: c.unread,
								};
							});
						} else {
							// Nouvelle conversation inconnue : l'ajouter
							const newConv = {
								id: convId,
								lastMessage: msg,
								unread: msg.sender_id !== SUPERADMIN_ID ? 1 : 0,
								participantId:
									msg.sender_id !== SUPERADMIN_ID
										? msg.sender_id
										: null,
							};
							updated = [...prev, newConv];
							// Charger le nom du nouveau participant
							if (newConv.participantId) {
								loadActorNames([newConv.participantId]);
							}
						}
						return updated.sort((a, b) => {
							const ta = a.lastMessage?.created_at ?? "";
							const tb = b.lastMessage?.created_at ?? "";
							return tb.localeCompare(ta);
						});
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(listChannel);
		};
	}, []);

	async function loadActorNames(ids) {
		if (!ids.length) return;
		const unique = [...new Set(ids)];
		const [{ data: profiles }, { data: companies }] = await Promise.all([
			supabase
				.from("profiles")
				.select("id, firstname, lastname")
				.in("id", unique),
			supabase.from("companies").select("id, name").in("id", unique),
		]);
		const map = {};
		profiles?.forEach((p) => {
			map[p.id] =
				`${p.firstname || ""} ${p.lastname || ""}`.trim() || "Candidat";
		});
		companies?.forEach((c) => {
			map[c.id] = c.name || "Entreprise";
		});
		setActorNames((prev) => ({ ...prev, ...map }));
	}

	// Charger les messages d'une conversation
	async function selectConversation(conv) {
		setSelected(conv);
		const { data } = await supabase
			.from("support_messages")
			.select("*")
			.eq("conversation_id", conv.id)
			.order("created_at", { ascending: true });
		setMessages(data ?? []);

		// Marquer comme lus
		await supabase
			.from("support_messages")
			.update({ is_read: true })
			.eq("conversation_id", conv.id)
			.eq("is_read", false)
			.neq("sender_id", SUPERADMIN_ID);

		setConversations((prev) =>
			prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c)),
		);
	}

	// Envoyer un message
	async function sendMessage(e) {
		e.preventDefault();
		if (!input.trim() || !selected || sending) return;
		setSending(true);
		const { data, error } = await supabase
			.from("support_messages")
			.insert({
				conversation_id: selected.id,
				sender_id: SUPERADMIN_ID,
				content: input.trim(),
				is_read: false,
			})
			.select()
			.single();
		setSending(false);
		if (!error && data) {
			setMessages((prev) => [...prev, data]);
			setInput("");
			// Broadcaster le message pour que l'app user le reçoive immédiatement
			// sans dépendre du CDC postgres_changes (plus fiable)
			convChannelRef.current?.send({
				type: "broadcast",
				event: "new_message",
				payload: data,
			});
			setConversations((prev) => {
				const updated = prev.map((c) =>
					c.id === selected.id ? { ...c, lastMessage: data } : c,
				);
				return [...updated].sort((a, b) => {
					const ta = a.lastMessage?.created_at ?? "";
					const tb = b.lastMessage?.created_at ?? "";
					return tb.localeCompare(ta);
				});
			});
		}
	}

	// Scroll to bottom quand les messages changent
	useEffect(() => {
		const el = messagesContainerRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages, isTyping]);

	// ── Realtime par conversation : messages + présence + frappe ──────────
	useEffect(() => {
		if (!selected) return;
		selectedRef.current = selected;
		setConvParticipantOnline(false);
		setIsTyping(false);
		clearTimeout(onlineTimeoutRef.current);

		// Marquer le participant comme en ligne + démarrer un timeout d'inactivité.
		// Appelé à chaque signal reçu (typing OU nouveau message).
		function markOnline() {
			setConvParticipantOnline(true);
			clearTimeout(onlineTimeoutRef.current);
			// 30 secondes sans aucune activité → offline
			onlineTimeoutRef.current = setTimeout(
				() => setConvParticipantOnline(false),
				30_000,
			);
		}

		// 1. Postgres Changes — nouveaux messages + confirmations de lecture
		const msgChannel = supabase
			.channel(`db-messages-${selected.id}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "support_messages",
					filter: `conversation_id=eq.${selected.id}`,
				},
				(payload) => {
					const msg = payload.new;
					if (msg.sender_id === SUPERADMIN_ID) return;
					markOnline(); // message reçu → participant en ligne
					setMessages((prev) => [...prev, msg]);
					setIsTyping(false);
					supabase
						.from("support_messages")
						.update({ is_read: true })
						.eq("id", msg.id);
					setConversations((prev) => {
						const updated = prev.map((c) =>
							c.id === selectedRef.current?.id
								? { ...c, lastMessage: msg }
								: c,
						);
						return [...updated].sort((a, b) => {
							const ta = a.lastMessage?.created_at ?? "";
							const tb = b.lastMessage?.created_at ?? "";
							return tb.localeCompare(ta);
						});
					});
				},
			)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "support_messages",
					// Pas de filtre : les filtres sur UPDATE nécessitent REPLICA IDENTITY FULL
					// On filtre côté client par conversation_id
				},
				(payload) => {
					const updated = payload.new;
					if (updated.conversation_id !== selectedRef.current?.id)
						return;
					// Mettre à jour is_read dans la liste locale (double check vert)
					setMessages((prev) =>
						prev.map((m) =>
							m.id === updated.id
								? { ...m, is_read: updated.is_read }
								: m,
						),
					);
				},
			)
			.subscribe();

		// 2. Canal broadcast uniquement (plus de Presence côté admin)
		const convChannel = supabase.channel(`conv-${selected.id}`, {
			config: { broadcast: { self: false } },
		});

		convChannel
			.on("broadcast", { event: "typing" }, ({ payload }) => {
				if (payload?.sender_id === SUPERADMIN_ID) return;
				markOnline(); // typing reçu → participant en ligne (même signal)
				setIsTyping(true);
				clearTimeout(typingTimeoutRef.current);
				typingTimeoutRef.current = setTimeout(
					() => setIsTyping(false),
					3000,
				);
			})
			// ⚠️ Assigner la ref SEULEMENT après SUBSCRIBED pour que .send() marche
			.subscribe((status) => {
				if (status === "SUBSCRIBED") {
					convChannelRef.current = convChannel;
				}
			});

		return () => {
			supabase.removeChannel(convChannel);
			supabase.removeChannel(msgChannel);
			convChannelRef.current = null;
			setIsTyping(false);
			setConvParticipantOnline(false);
			clearTimeout(typingTimeoutRef.current);
			clearTimeout(onlineTimeoutRef.current);
		};
	}, [selected?.id]);

	const handleInputChange = useCallback((e) => {
		setInput(e.target.value);
		// Pas de broadcast typing côté admin pour ne pas polluer l'app user
	}, []);

	return (
		<div className='flex h-[calc(100vh-7rem)] rounded-xl border overflow-hidden bg-background'>
			{/* ─── Colonne gauche : liste des conversations ─── */}
			<div className='w-72 shrink-0 border-r flex flex-col'>
				<div className='px-4 py-3 border-b'>
					<h2 className='font-semibold text-sm'>Conversations</h2>
				</div>
				<div className='flex-1 min-h-0 overflow-y-auto'>
					{conversations.length === 0 ? (
						<div className='flex flex-col items-center justify-center gap-2 text-muted-foreground py-16 text-sm'>
							<MessageSquare className='h-8 w-8 opacity-20' />
							Aucune conversation
						</div>
					) : (
						conversations.map((conv) => {
							const name = conv.participantId
								? (actorNames[conv.participantId] ?? "…")
								: "Conversation";
							const isActive = selected?.id === conv.id;
							// Vert uniquement pour la conv active, quand une activité récente a été reçue
							const isOnline = isActive && convParticipantOnline;
							return (
								<button
									key={conv.id}
									type='button'
									onClick={() => selectConversation(conv)}
									className={`w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-muted transition-colors ${isActive ? "bg-muted" : ""}`}>
									{/* Avatar initiales + indicateur en ligne */}
									<div className='relative shrink-0'>
										<div className='h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold'>
											{name.slice(0, 2).toUpperCase()}
										</div>
										{isOnline && (
											<span className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background' />
										)}
									</div>
									<div className='flex-1 min-w-0'>
										<div className='flex items-center justify-between'>
											<span className='text-sm font-medium truncate'>
												{name}
											</span>
											{conv.lastMessage && (
												<span className='text-[10px] text-muted-foreground shrink-0 ml-1'>
													{timeLabel(
														conv.lastMessage
															.created_at,
													)}
												</span>
											)}
										</div>
										<p className='text-xs text-muted-foreground truncate mt-0.5'>
											{conv.lastMessage?.content ??
												"Pas encore de message"}
										</p>
									</div>
									{conv.unread > 0 && (
										<Badge className='shrink-0 h-4 min-w-4 px-1 text-[10px] rounded-full'>
											{conv.unread}
										</Badge>
									)}
								</button>
							);
						})
					)}
				</div>
			</div>

			{/* ─── Colonne droite : messages ─── */}
			<div className='flex-1 flex flex-col min-w-0'>
				{!selected ? (
					<div className='flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground'>
						<MessageSquare className='h-10 w-10 opacity-20' />
						<p className='text-sm'>Sélectionne une conversation</p>
					</div>
				) : (
					<>
						{/* Header conversation */}
						<div className='px-4 py-3 border-b flex items-center gap-3 shrink-0'>
							<div className='relative'>
								<div className='h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold'>
									{(selected.participantId
										? (actorNames[selected.participantId] ??
											"?")
										: "?"
									)
										.slice(0, 2)
										.toUpperCase()}
								</div>
								{convParticipantOnline && (
									<span className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background' />
								)}
							</div>
							<div>
								<p className='font-semibold text-sm leading-none'>
									{selected.participantId
										? (actorNames[selected.participantId] ??
											"…")
										: "Conversation"}
								</p>
								{convParticipantOnline && (
									<p className='text-[11px] text-green-500 mt-0.5'>
										En ligne
									</p>
								)}
							</div>
						</div>

						{/* Bulles de messages */}
						<div
							ref={messagesContainerRef}
							className='flex-1 min-h-0 overflow-y-auto px-4 py-4'>
							<div className='flex flex-col gap-2'>
								{messages.map((msg) => {
									const isMe =
										msg.sender_id === SUPERADMIN_ID;
									return (
										<div
											key={msg.id}
											className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
											<div
												className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-snug ${
													isMe
														? "bg-primary text-primary-foreground rounded-br-sm"
														: "bg-muted text-foreground rounded-bl-sm"
												}`}>
												<p>{msg.content}</p>
											</div>
											<div className='flex items-center gap-0.5 px-1'>
												<span className='text-[10px] text-muted-foreground'>
													{fullTime(msg.created_at)}
												</span>
												{isMe && (
													<CheckCheck
														className={`h-3 w-3 ${
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
								{isTyping && <TypingIndicator />}
							</div>
						</div>
						{/* Input réponse */}
						<form
							onSubmit={sendMessage}
							className='px-4 py-3 border-t flex gap-2 shrink-0'>
							<Input
								value={input}
								onChange={handleInputChange}
								placeholder='Écrire un message…'
								className='flex-1'
								autoFocus
							/>
							<Button
								type='submit'
								size='icon'
								disabled={!input.trim() || sending}>
								<Send className='h-4 w-4' />
							</Button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
