"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase/supabaseClient";

const SUPERADMIN_ID = "c5f72d6f-7ab4-4e19-8b3b-12714740efad";

interface NotificationContextValue {
  unreadMessages: number;
  fetchCount: () => Promise<void>;
  setActiveConversationId: (id: string | null) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  unreadMessages: 0,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: default context placeholders
  fetchCount: async () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: default context placeholders
  setActiveConversationId: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadMessages, setUnreadMessages] = useState(0);
  // Conversation currently open in the messages page — new messages in this convo won't increment the badge
  const activeConvIdRef = useRef<string | null>(null);

  const fetchCount = useCallback(async () => {
    const { count } = await supabase
      .from("support_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .neq("sender_id", SUPERADMIN_ID);
    setUnreadMessages(count ?? 0);
  }, []);

  const setActiveConversationId = useCallback((id: string | null) => {
    activeConvIdRef.current = id;
  }, []);

  useEffect(() => {
    fetchCount();

    const channel = supabase
      .channel("global-unread-refresh")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages" }, (payload) => {
        const msg = payload.new as { sender_id: string; conversation_id: string };
        // Message envoyé par l'admin → ignoré
        if (msg.sender_id === SUPERADMIN_ID) return;
        // Conversation actuellement ouverte → l'admin le voit et le marque lu immédiatement
        if (activeConvIdRef.current && msg.conversation_id === activeConvIdRef.current) return;
        fetchCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCount]);

  return (
    <NotificationContext.Provider value={{ unreadMessages, fetchCount, setActiveConversationId }}>
      {children}
    </NotificationContext.Provider>
  );
}
