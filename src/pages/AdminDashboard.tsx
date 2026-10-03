import { EmojiIcon } from "@/components/ui/emoji-icon";
import AdminGoogle from "@/components/admin/AdminGoogle";
import { KeyRound, DatabaseBackup } from "lucide-react";
import AdminBackup from "@/components/admin/AdminBackup";
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
  Eye,
  Globe,
  MousePointer,
  Crown,
  Star,
  ClipboardList,
  Megaphone,
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
import AdminMoney from "@/components/admin/AdminMoney";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminRevenue from "@/components/admin/AdminRevenue";
import { AdminContent, AdminNotifications } from "@/components/admin/AdminContent";
import AdminOverview from "@/components/admin/AdminOverview";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const {
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
  } = useAdmin();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "revenue" | "users" | "money" | "traffic" | "waitlist" | "content" | "notifications" | "google" | "backup">("overview");


  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchUsers();
      fetchTraffic();
      fetchWaitlist();
      const t = setInterval(() => { fetchStats(); fetchUsers(); }, 30000);
      return () => clearInterval(t);
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

  const handlePromote = async (userId: string, email: string) => {
    const success = await promoteUser(userId);
    if (success) {
      toast.success(`${email} promoted to Premium`);
    } else {
      toast.error("Failed to promote user");
    }
  };

  const handleDemote = async (userId: string, email: string) => {
    const success = await demoteUser(userId);
    if (success) {
      toast.success(`${email} demoted to Free`);
    } else {
      toast.error("Failed to demote user");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/RajputAdMin");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-sm text-center space-y-4">
          <h1 className="text-xl font-bold font-display">Admin access only</h1>
          <p className="text-sm text-muted-foreground">You're signed in with a regular account. Sign out to use the admin sign in.</p>
          <Button onClick={() => signOut()} className="w-full">Sign out</Button>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "New This Week", value: stats?.newUsersThisWeek || 0, icon: TrendingUp, color: "text-chart-green", bg: "bg-chart-green/10" },
    { title: "Active Users (7d)", value: stats?.activeUsers || 0, icon: Activity, color: "text-chart-blue", bg: "bg-chart-blue/10" },
    { title: "Premium Users", value: stats?.premiumUsers || 0, icon: Crown, color: "text-chart-yellow", bg: "bg-chart-yellow/10" },
    { title: "Waitlist", value: stats?.waitlistCount || 0, icon: ClipboardList, color: "text-chart-pink", bg: "bg-chart-pink/10" },
    { title: "Total Habits", value: stats?.totalHabits || 0, icon: BarChart3, color: "text-chart-purple", bg: "bg-chart-purple/10" },
    { title: "Journal Entries", value: stats?.totalJournals || 0, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
    { title: "Total XP", value: stats?.totalXP?.toLocaleString() || "0", icon: Zap, color: "text-chart-green", bg: "bg-chart-green/10" },
  ];

  const NAV = [
    { k: "overview", label: "Overview", icon: BarChart3 },
    { k: "users", label: "Users", icon: Users },
    { k: "revenue", label: "Plans & Payments", icon: Crown },
    { k: "money", label: "Referrals & Payouts", icon: TrendingUp },
    { k: "traffic", label: "Analytics", icon: Globe },
    { k: "content", label: "Content", icon: BookOpen },
    { k: "notifications", label: "Notifications", icon: Megaphone },
    { k: "waitlist", label: "Waitlist", icon: ClipboardList },
    { k: "google", label: "Google Sign-in", icon: KeyRound },
    { k: "backup", label: "Backup & Migrate", icon: DatabaseBackup },
  ] as const;
  const refreshAll = () => { fetchStats(); fetchUsers(); fetchTraffic(); fetchWaitlist(); };
  const initials = (user?.email || "A").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/60 bg-card/40 p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-8">
          <img src="/logo.png" alt="Superoutine" className="w-8 h-8 rounded-lg" />
          <span className="font-bold font-display text-lg">Superoutine</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map(n => (
            <button key={n.k} onClick={() => setActiveTab(n.k)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === n.k ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}>
              <n.icon className="w-5 h-5" />{n.label}
            </button>
          ))}
        </nav>
        <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 text-center">
          <Shield className="w-5 h-5 text-primary mx-auto" />
          <p className="text-sm font-semibold mt-2">Admin access</p>
          <p className="text-xs text-muted-foreground mt-1">Data refreshes every 30 seconds</p>
          <Button size="sm" variant="outline" className="w-full mt-3" onClick={refreshAll}><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh now</Button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/15 text-primary border border-primary/30">Admin Panel</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-primary"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" />LIVE</span>
          <div className="relative flex-1 max-w-xl mx-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); if (e.target.value) setActiveTab("users"); }} placeholder="Search users or emails..." className="pl-9 bg-card/60" />
          </div>
          <span className="hidden md:inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-border/60"><Calendar className="w-4 h-4" />Last 30 Days</span>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{initials}</span>
            <div className="hidden xl:block leading-tight"><p className="text-sm font-medium">Jatin</p><p className="text-xs text-muted-foreground">Admin</p></div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out"><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="lg:hidden flex gap-1 px-3 pb-2 overflow-x-auto">
          {NAV.map(n => (
            <button key={n.k} onClick={() => setActiveTab(n.k)} className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === n.k ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-secondary/40"}`}>
              <n.icon className="w-3.5 h-3.5" />{n.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 space-y-6 max-w-[1600px]">
        {activeTab === "overview" && <AdminOverview users={users} traffic={traffic} onGo={setActiveTab} />}

        {activeTab === "content" && <AdminContent />}
        {activeTab === "google" && <AdminGoogle />}
        {activeTab === "backup" && <AdminBackup />}
        {activeTab === "notifications" && <AdminNotifications />}
        {activeTab === "revenue" && <AdminRevenue onChanged={() => { fetchUsers(); fetchStats(); }} />}

        {activeTab === "money" && <AdminMoney users={users.map(u => ({ id: u.id, email: u.email }))} onChanged={() => { fetchUsers(); fetchStats(); }} />}

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
                <div className="py-12 text-center text-muted-foreground">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Referred by</TableHead>
                        <TableHead>Invited</TableHead>
                        <TableHead>Balance</TableHead>
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
                              <div className="font-medium text-sm">{u.display_name}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Never"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.tier === "premium" ? "default" : "secondary"} className="text-xs">
                              {u.tier === "premium" && <Crown className="w-3 h-3 mr-1" />}
                              {u.tier === "premium" ? "Premium" : "Free"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">${(u.total_paid || 0).toFixed(0)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{u.referred_by || "—"}</TableCell>
                          <TableCell className="text-sm">{u.invited_count || 0}</TableCell>
                          <TableCell className="text-sm">${((u.earned || 0) - (u.withdrawn || 0)).toFixed(2)}</TableCell>
                          <TableCell className="text-sm">{u.habit_count}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">{u.total_xp} XP</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.email_confirmed ? "default" : "destructive"} className="text-xs">
                              {u.email_confirmed ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Promote/Demote */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 ${u.tier === "premium" ? "text-chart-yellow hover:text-chart-yellow" : "text-muted-foreground hover:text-chart-yellow"} hover:bg-chart-yellow/10`}
                                    title={u.tier === "premium" ? "Demote to Free" : "Promote to Premium"}
                                  >
                                    <Crown className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                      <Crown className="w-5 h-5 text-chart-yellow" />
                                      {u.tier === "premium" ? "Demote User" : "Promote User"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {u.tier === "premium"
                                        ? <>Are you sure you want to demote <strong>{u.email}</strong> from Premium to Free?</>
                                        : <>Promote <strong>{u.email}</strong> to Premium? They will get unlimited habits, streak protections, and more.</>
                                      }
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        u.tier === "premium"
                                          ? handleDemote(u.id, u.email)
                                          : handlePromote(u.id, u.email)
                                      }
                                    >
                                      {u.tier === "premium" ? "Demote to Free" : "Promote to Premium"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              {/* Delete */}
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
                                      <strong>{u.email}</strong>? This action cannot be undone.
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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

        {activeTab === "traffic" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Total Page Views", value: traffic?.totalViews || 0, icon: Eye, color: "text-chart-blue", bg: "bg-chart-blue/10" },
                { title: "Today's Views", value: traffic?.todayViews || 0, icon: MousePointer, color: "text-primary", bg: "bg-primary/10" },
                { title: "Unique Visitors (30d)", value: traffic?.uniqueVisitors || 0, icon: Globe, color: "text-chart-purple", bg: "bg-chart-purple/10" },
              ].map((stat, i) => (
                <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold font-display">{trafficLoading ? "..." : stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.title}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-display">
                  <Eye className="w-4 h-4 text-chart-blue" />
                  Page Views — Last 30 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trafficLoading ? (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">Loading chart...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={traffic?.viewsByDay || []}>
                      <defs>
                        <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(200, 55%, 52%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(200, 55%, 52%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="uniqueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(265, 40%, 58%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(265, 40%, 58%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 22%)" />
                      <XAxis dataKey="date" tick={{ fill: "hsl(220, 12%, 55%)", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                      <YAxis tick={{ fill: "hsl(220, 12%, 55%)", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "hsl(225, 20%, 15%)", border: "1px solid hsl(225, 15%, 22%)", borderRadius: "8px", color: "hsl(220, 20%, 90%)" }} />
                      <Area type="monotone" dataKey="views" name="Views" stroke="hsl(200, 55%, 52%)" fill="url(#viewsGradient)" strokeWidth={2} />
                      <Area type="monotone" dataKey="unique" name="Unique" stroke="hsl(265, 40%, 58%)" fill="url(#uniqueGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-display">
                  <Globe className="w-4 h-4 text-primary" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trafficLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : (traffic?.topPages?.length || 0) === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No traffic data yet.</div>
                ) : (
                  <div className="space-y-3">
                    {traffic?.topPages.map((page, i) => (
                      <div key={page.path} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                          <span className="text-sm font-medium">{page.path}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">{page.views} views</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "waitlist" && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <Crown className="w-4 h-4 text-chart-yellow" />
                Premium Waitlist ({waitlist.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {waitlistLoading ? (
                <div className="py-12 text-center text-muted-foreground">Loading waitlist...</div>
              ) : waitlist.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No waitlist signups yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Signed Up</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waitlist.map((entry, i) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-sm text-muted-foreground">{i + 1}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{entry.display_name}</div>
                              <div className="text-xs text-muted-foreground">{entry.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Promote
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-chart-yellow" />
                                    Promote to Premium
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Promote <strong>{entry.email}</strong> from the waitlist to Premium?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handlePromote(entry.user_id, entry.email)}>
                                    Promote to Premium
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
