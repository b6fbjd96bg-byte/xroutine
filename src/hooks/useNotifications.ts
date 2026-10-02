import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Notice = { id: string; user_id: string | null; kind: string; title: string; body: string | null; link: string | null; created_at: string; read: boolean };

export const useNotifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notice[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const since = new Date(Math.min(Date.now() - 60 * 86400000, new Date(user.created_at).getTime() - 7 * 86400000)).toISOString();
    const [{ data: n }, { data: r }] = await Promise.all([
      supabase.from("notifications").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(100),
      supabase.from("notification_reads").select("notification_id"),
    ]);
    const read = new Set((r || []).map((x: any) => x.notification_id));
    setItems(((n || []) as any[]).map((x) => ({ ...x, read: read.has(x.id) })));
  }, [user]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  const markRead = async (ids: string[]) => {
    if (!user || !ids.length) return;
    setItems((all) => all.map((x) => (ids.includes(x.id) ? { ...x, read: true } : x)));
    await supabase.from("notification_reads").upsert(ids.map((id) => ({ user_id: user.id, notification_id: id })), { onConflict: "user_id,notification_id", ignoreDuplicates: true });
  };

  return { items, unread: items.filter((x) => !x.read).length, markRead, reload: load };
};
