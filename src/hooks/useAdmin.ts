import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AdminUser {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  habit_count: number;
  total_xp: number;
  email_confirmed: boolean;
  tier: string;
}

interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  activeUsers: number;
  totalHabits: number;
  totalJournals: number;
  totalXP: number;
  premiumUsers: number;
  waitlistCount: number;
  signupsByDay: { date: string; count: number }[];
}

interface TrafficData {
  viewsByDay: { date: string; views: number; unique: number }[];
  topPages: { path: string; views: number }[];
  totalViews: number;
  todayViews: number;
  uniqueVisitors: number;
}

interface WaitlistEntry {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [trafficLoading, setTrafficLoading] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      setIsAdmin(!!data);
      setLoading(false);
    };
    checkAdmin();
  }, [user]);

  const getHeaders = async () => ({
    Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  });

  const fetchUsers = async (page = 1) => {
    setUsersLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=list-users&page=${page}`,
        { headers: await getHeaders() }
      );
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setUsers(result.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=stats`,
        { headers: await getHeaders() }
      );
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setStats(result);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTraffic = async () => {
    setTrafficLoading(true);
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const today = new Date().toISOString().split("T")[0];

      const { data: views, error } = await supabase
        .from("page_views")
        .select("path, session_id, created_at")
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const byDay: Record<string, { views: number; sessions: Set<string> }> = {};
      for (let i = 0; i < 30; i++) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        byDay[d] = { views: 0, sessions: new Set() };
      }

      const allSessions = new Set<string>();
      let todayCount = 0;

      (views || []).forEach((v) => {
        const day = new Date(v.created_at).toISOString().split("T")[0];
        if (byDay[day]) {
          byDay[day].views++;
          if (v.session_id) byDay[day].sessions.add(v.session_id);
        }
        if (v.session_id) allSessions.add(v.session_id);
        if (day === today) todayCount++;
      });

      const viewsByDay = Object.entries(byDay)
        .map(([date, d]) => ({ date, views: d.views, unique: d.sessions.size }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const pageCounts: Record<string, number> = {};
      (views || []).forEach((v) => {
        pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
      });
      const topPages = Object.entries(pageCounts)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      setTraffic({
        viewsByDay,
        topPages,
        totalViews: views?.length || 0,
        todayViews: todayCount,
        uniqueVisitors: allSessions.size,
      });
    } catch (err) {
      console.error("Failed to fetch traffic:", err);
    } finally {
      setTrafficLoading(false);
    }
  };

  const fetchWaitlist = async () => {
    setWaitlistLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=waitlist`,
        { headers: await getHeaders() }
      );
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setWaitlist(result.waitlist || []);
    } catch (err) {
      console.error("Failed to fetch waitlist:", err);
    } finally {
      setWaitlistLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=delete-user`,
        {
          method: "POST",
          headers: await getHeaders(),
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setUsers(prev => prev.filter(u => u.id !== userId));
      return true;
    } catch (err) {
      console.error("Failed to delete user:", err);
      return false;
    }
  };

  const promoteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=promote-user`,
        {
          method: "POST",
          headers: await getHeaders(),
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, tier: "premium" } : u));
      return true;
    } catch (err) {
      console.error("Failed to promote user:", err);
      return false;
    }
  };

  const demoteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=demote-user`,
        {
          method: "POST",
          headers: await getHeaders(),
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, tier: "free" } : u));
      return true;
    } catch (err) {
      console.error("Failed to demote user:", err);
      return false;
    }
  };

  return {
    isAdmin,
    loading,
    users,
    stats,
    traffic,
    waitlist,
    usersLoading,
    statsLoading,
    trafficLoading,
    waitlistLoading,
    fetchUsers,
    fetchStats,
    fetchTraffic,
    fetchWaitlist,
    deleteUser,
    promoteUser,
    demoteUser,
  };
};
