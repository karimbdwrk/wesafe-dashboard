import { supabase } from "@/lib/supabase/supabaseClient";

export async function logActivity(
  userId: string | null | undefined,
  eventType: string,
  metadata?: Record<string, unknown>,
) {
  if (!userId) return;

  const { error } = await supabase.from("user_activity").insert({
    user_id: userId,
    event_type: eventType,
    metadata: metadata ?? null,
  });

  if (error) {
    console.error(`[user_activity] insert "${eventType}" erreur:`, error);
  }
}
