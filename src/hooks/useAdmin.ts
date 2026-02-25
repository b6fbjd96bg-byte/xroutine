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
}

interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  activeUsers: number;
  totalHabits: number;
  totalJournals: number;
  totalXP: number;
  signupsByDay: { date: string; count: number }[];
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

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

  const fetchUsers = async (page = 1) => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-api", {
        body: null,
        method: "GET",
      });
      // Use query params via headers workaround - invoke with body
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=list-users&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
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
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
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

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=delete-user`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
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

  return {
    isAdmin,
    loading,
    users,
    stats,
    usersLoading,
    statsLoading,
    fetchUsers,
    fetchStats,
    deleteUser,
  };
};
