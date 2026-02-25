import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Download,
  Trash2,
  Moon,
  Sun,
  Mail,
  Shield,
  HelpCircle,
  LogOut,
  Check,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
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
import SmartReminders from "@/components/gamification/SmartReminders";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradePrompt from "@/components/premium/UpgradePrompt";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { tier, isPremium, limits } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
    sound: false,
  });
  const [weeklyEmailEnabled, setWeeklyEmailEnabled] = useState(true);
  const [emailPrefLoaded, setEmailPrefLoaded] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });

    // Load email preferences
    supabase
      .from("email_preferences")
      .select("weekly_report_enabled")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setWeeklyEmailEnabled(data.weekly_report_enabled);
        setEmailPrefLoaded(true);
      });
  }, [user]);

  const toggleWeeklyEmail = async () => {
    if (!user) return;
    const newVal = !weeklyEmailEnabled;
    setWeeklyEmailEnabled(newVal);

    // Upsert preference
    const { error } = await supabase
      .from("email_preferences")
      .upsert({ user_id: user.id, weekly_report_enabled: newVal }, { onConflict: "user_id" });

    if (error) {
      setWeeklyEmailEnabled(!newVal);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newVal ? "Weekly emails enabled ✅" : "Weekly emails disabled" });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const trimmed = displayName.trim();
    if (!trimmed || trimmed.length > 100) {
      toast({ title: "Invalid name", description: "Display name must be 1–100 characters.", variant: "destructive" });
      return;
    }
    setIsSavingProfile(true);
    const { error } = await supabase.from("profiles").update({ display_name: trimmed }).eq("id", user.id);
    setIsSavingProfile(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated ✅", description: "Your display name has been saved." });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords match.", variant: "destructive" });
      return;
    }
    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsSavingPassword(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated ✅", description: "Your password has been changed." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-64 p-4 sm:p-6 lg:p-8">
        <motion.div className="max-w-[800px] mx-auto space-y-4 sm:space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
              <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              <span className="text-gradient">Settings</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Customize your experience</p>
          </motion.div>

          {/* Profile */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-xl font-bold font-display">Profile</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs sm:text-sm">Display Name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-secondary/50" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                  <Input id="email" value={user?.email ?? ""} className="bg-secondary/50 opacity-60" disabled />
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSavingProfile} size="sm">
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-xl font-bold font-display">Change Password</h2>
            </div>
            <div className="space-y-4 max-w-sm">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs sm:text-sm">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-secondary/50 pr-10"
                  />
                  <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs sm:text-sm">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type={showPasswords ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <Button onClick={handleChangePassword} disabled={isSavingPassword} size="sm">
                {isSavingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-xl font-bold font-display">Notifications</h2>
            </div>
            <div className="space-y-1">
              {/* Email Weekly Report toggle */}
              <div className="flex items-center justify-between py-3 border-b border-border/30">
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Weekly Email Report</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Receive your report card via email every Monday</p>
                  </div>
                </div>
                <Switch
                  checked={weeklyEmailEnabled}
                  onCheckedChange={toggleWeeklyEmail}
                  disabled={!emailPrefLoaded}
                  className="shrink-0 ml-3"
                />
              </div>
              {[
                { key: "dailyReminder" as const, label: "Daily Reminders", desc: "Get reminded to complete your habits", icon: Smartphone },
                { key: "weeklyReport" as const, label: "Weekly Reports", desc: "Receive weekly progress summaries", icon: Globe },
                { key: "achievements" as const, label: "Achievements", desc: "Get notified when you unlock achievements", icon: Check },
                { key: "sound" as const, label: "Sound Effects", desc: "Play sounds when completing habits", icon: Bell },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <item.icon className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium">{item.label}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className="shrink-0 ml-3"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Smart Reminders */}
          <motion.div variants={itemVariants}>
            <SmartReminders />
          </motion.div>

          {/* Appearance */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-xl font-bold font-display">Appearance</h2>
            </div>
            <div className="space-y-3">
              <Label className="text-xs sm:text-sm">Theme</Label>
              <div className="flex gap-3">
                {[
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "light", label: "Light", icon: Sun },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm",
                      theme === opt.value ? "border-primary bg-primary/10" : "border-border/50 hover:border-border"
                    )}
                  >
                    <opt.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", theme === opt.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("font-medium text-xs sm:text-sm", theme === opt.value ? "text-primary" : "text-muted-foreground")}>{opt.label}</span>
                    {theme === opt.value && <Check className="w-3.5 h-3.5 text-primary ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Subscription */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Crown className="w-5 h-5 text-chart-yellow" />
              <h2 className="text-base sm:text-xl font-bold font-display">Subscription</h2>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold",
                isPremium ? "bg-chart-yellow/20 text-chart-yellow" : "bg-secondary text-muted-foreground"
              )}>
                {isPremium ? "👑 PREMIUM" : "FREE PLAN"}
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {[
                { label: "Daily habits", free: `Up to ${limits.maxDailyHabits}`, premium: "Unlimited" },
                { label: "Weekly habits", free: `Up to ${limits.maxWeeklyHabits}`, premium: "Unlimited" },
                { label: "Streak protections", free: "1/month", premium: "3/month" },
                { label: "Deep analytics", free: "✗", premium: "✓" },
                { label: "Weekly email reports", free: "✗", premium: "✓" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-1.5 text-xs sm:text-sm border-b border-border/20 last:border-0">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={isPremium ? "text-chart-yellow font-medium" : "text-foreground"}>
                    {isPremium ? row.premium : row.free}
                  </span>
                </div>
              ))}
            </div>
            {!isPremium && (
              <Button variant="outline" className="w-full gap-2 border-chart-yellow/30 text-chart-yellow hover:bg-chart-yellow/10" onClick={() => setShowUpgrade(true)}>
                <Crown className="w-4 h-4" />
                Upgrade to Premium
              </Button>
            )}
          </motion.div>

          {/* Data & Privacy */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-xl font-bold font-display">Data & Privacy</h2>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm h-10 sm:h-11">
                <Download className="w-4 h-4 shrink-0" />
                Export All Data
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-3 text-destructive hover:text-destructive text-xs sm:text-sm h-10 sm:h-11">
                    <Trash2 className="w-4 h-4 shrink-0" />
                    Delete All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border mx-4 sm:mx-auto max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base sm:text-lg">Delete All Data?</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm">
                      This action cannot be undone. This will permanently delete all your habits, progress, and settings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="text-xs sm:text-sm">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs sm:text-sm">Delete Everything</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>

          {/* Help & Support */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-xl font-bold font-display">Help & Support</h2>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm h-10 sm:h-11">
                <Mail className="w-4 h-4 shrink-0" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm h-10 sm:h-11">
                <HelpCircle className="w-4 h-4 shrink-0" />
                FAQ & Documentation
              </Button>
            </div>
          </motion.div>

          {/* Sign Out */}
          <motion.div variants={itemVariants}>
            <Link to="/">
              <Button variant="outline" className="w-full gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs sm:text-sm">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </Link>
          </motion.div>

          {/* Version */}
          <motion.p variants={itemVariants} className="text-center text-xs sm:text-sm text-muted-foreground pb-4">
            Superoutine v1.0.0
          </motion.p>
        </motion.div>
      </main>
      <UpgradePrompt open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
};

export default Settings;
