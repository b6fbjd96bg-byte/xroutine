import { useState } from "react";
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

const Settings = () => {
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
    sound: false,
  });
  const [theme, setTheme] = useState("dark");
  const [userName, setUserName] = useState("User");
  const [email, setEmail] = useState("user@example.com");

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
                  <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-xl font-bold font-display">Notifications</h2>
            </div>
            <div className="space-y-1">
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
    </div>
  );
};

export default Settings;
