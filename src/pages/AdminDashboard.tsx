import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Activity,
  BookOpen,
  Zap,
  Trash2,
  Shield,
  BarChart3,
  Calendar,
  Search,
  LogOut,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    isAdmin,
    loading,
    users,
    stats,
    usersLoading,
    statsLoading,
    fetchUsers,
    fetchStats,
    deleteUser,
  } = useAdmin();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchUsers();
    }
  }, [isAdmin]);

  const handleDelete = async (userId: string, email: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast.success(`User ${email} deleted successfully`);
    } else {
      toast.error("Failed to delete user");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "New This Week",
      value: stats?.newUsersThisWeek || 0,
      icon: TrendingUp,
      color: "text-chart-green",
      bg: "bg-chart-green/10",
    },
    {
      title: "Active Users (7d)",
      value: stats?.activeUsers || 0,
      icon: Activity,
      color: "text-chart-blue",
      bg: "bg-chart-blue/10",
    },
    {
      title: "Total Habits",
      value: stats?.totalHabits || 0,
      icon: BarChart3,
      color: "text-chart-purple",
      bg: "bg-chart-purple/10",
    },
    {
      title: "Journal Entries",
      value: stats?.totalJournals || 0,
      icon: BookOpen,
      color: "text-chart-yellow",
      bg: "bg-chart-yellow/10",
    },
    {
      title: "Total XP Earned",
      value: stats?.totalXP?.toLocaleString() || "0",
      icon: Zap,
      color: "text-chart-pink",
      bg: "bg-chart-pink/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                fetchStats();
                fetchUsers();
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 rounded-lg bg-secondary/50 w-fit">
          {(["overview", "users"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "overview" ? "📊 Overview" : "👥 Users"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold font-display">
                        {statsLoading ? "..." : stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {stat.title}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Signup Chart */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-display">
                  <Calendar className="w-4 h-4 text-primary" />
                  User Signups — Last 30 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Loading chart...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={stats?.signupsByDay || []}>
                      <defs>
                        <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(158, 45%, 50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(158, 45%, 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 22%)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "hsl(220, 12%, 55%)", fontSize: 11 }}
                        tickFormatter={(v) => v.slice(5)}
                      />
                      <YAxis tick={{ fill: "hsl(220, 12%, 55%)", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(225, 20%, 15%)",
                          border: "1px solid hsl(225, 15%, 22%)",
                          borderRadius: "8px",
                          color: "hsl(220, 20%, 90%)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(158, 45%, 50%)"
                        fill="url(#signupGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Quick User Table */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-display">
                  <Users className="w-4 h-4 text-primary" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>XP</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 5).map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{u.display_name}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {u.total_xp} XP
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.email_confirmed ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {u.email_confirmed ? "Verified" : "Unverified"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "users" && (
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-base font-display">
                  <Users className="w-4 h-4 text-primary" />
                  All Users ({users.length})
                </CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="py-12 text-center text-muted-foreground">
                  Loading users...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Habits</TableHead>
                        <TableHead>XP</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">
                                {u.display_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {u.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {u.last_sign_in_at
                              ? new Date(u.last_sign_in_at).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell className="text-sm">{u.habit_count}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {u.total_xp} XP
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={u.email_confirmed ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {u.email_confirmed ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-destructive" />
                                    Delete User
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to permanently delete{" "}
                                    <strong>{u.email}</strong>? This action cannot
                                    be undone. All their data (habits, journals,
                                    XP) will be removed.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(u.id, u.email)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
