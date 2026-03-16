"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const SUPERADMIN_ID = "c5f72d6f-7ab4-4e19-8b3b-12714740efad";

export async function sendSupportNotification({
	recipientId,
	conversationId,
	messageContent,
}: {
	recipientId: string;
	conversationId: string;
	messageContent: string;
}) {
	// Chercher une notification non lue existante pour cette même conversation
	const { data: existing } = await supabaseAdmin
		.from("notifications")
		.select("id, metadata")
		.eq("recipient_id", recipientId)
		.eq("type", "support_message")
		.eq("is_read", false)
		.filter("metadata->>conversation_id", "eq", conversationId)
		.maybeSingle();

	if (existing) {
		// Incrémenter le compteur et mettre à jour la notification existante
		const count = (existing.metadata?.message_count ?? 1) + 1;
		const body =
			count === 1
				? messageContent.length > 100
					? messageContent.slice(0, 97) + "…"
					: messageContent
				: `${count} nouveaux messages`;

		const { error } = await supabaseAdmin
			.from("notifications")
			.update({
				body,
				title: "Nouveau message du support",
				created_at: new Date().toISOString(),
				metadata: { conversation_id: conversationId, message_count: count },
			})
			.eq("id", existing.id);

		if (error) {
			console.error("[sendSupportNotification] Erreur update:", error.message);
		}
	} else {
		// Première notification non lue pour cette conversation
		const snippet =
			messageContent.length > 100
				? messageContent.slice(0, 97) + "…"
				: messageContent;

		const { error } = await supabaseAdmin.from("notifications").insert({
			recipient_id: recipientId,
			actor_id: SUPERADMIN_ID,
			title: "Nouveau message du support",
			body: snippet,
			type: "support_message",
			entity_type: "support_conversation",
			is_read: false,
			metadata: { conversation_id: conversationId, message_count: 1 },
		});

		if (error) {
			console.error("[sendSupportNotification] Erreur insert:", error.message);
		}
	}
}



export async function getValueFromCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // default: 7 days
  });
}

export async function getPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): Promise<T> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  const value = cookie ? cookie.value.trim() : undefined;
  return allowed.includes(value as T) ? (value as T) : fallback;
}
