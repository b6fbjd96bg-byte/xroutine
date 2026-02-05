 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Link } from "react-router-dom";
 import { 
   ArrowLeft, 
   Settings as SettingsIcon, 
   User, 
   Bell, 
   Palette, 
   Download, 
   Trash2, 
   Moon, 
   Sun, 
   Volume2, 
   Mail,
   Shield,
   HelpCircle,
   LogOut,
   Check
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Switch } from "@/components/ui/switch";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { cn } from "@/lib/utils";
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
 
   const settingsSections = [
     {
       title: "Profile",
       icon: User,
       items: [
         {
           type: "input" as const,
           label: "Display Name",
           value: userName,
           onChange: setUserName,
         },
         {
           type: "input" as const,
           label: "Email",
           value: email,
           onChange: setEmail,
         },
       ],
     },
     {
       title: "Notifications",
       icon: Bell,
       items: [
         {
           type: "toggle" as const,
           label: "Daily Reminders",
           description: "Get reminded to complete your habits",
           checked: notifications.dailyReminder,
           onChange: () => setNotifications(prev => ({ ...prev, dailyReminder: !prev.dailyReminder })),
         },
         {
           type: "toggle" as const,
           label: "Weekly Reports",
           description: "Receive weekly progress summaries",
           checked: notifications.weeklyReport,
           onChange: () => setNotifications(prev => ({ ...prev, weeklyReport: !prev.weeklyReport })),
         },
         {
           type: "toggle" as const,
           label: "Achievement Notifications",
           description: "Get notified when you unlock achievements",
           checked: notifications.achievements,
           onChange: () => setNotifications(prev => ({ ...prev, achievements: !prev.achievements })),
         },
         {
           type: "toggle" as const,
           label: "Sound Effects",
           description: "Play sounds when completing habits",
           checked: notifications.sound,
           onChange: () => setNotifications(prev => ({ ...prev, sound: !prev.sound })),
         },
       ],
     },
     {
       title: "Appearance",
       icon: Palette,
       items: [
         {
           type: "theme" as const,
           label: "Theme",
           value: theme,
           onChange: setTheme,
         },
       ],
     },
   ];
 
   return (
     <div className="min-h-screen bg-background p-8">
       <div className="max-w-[800px] mx-auto space-y-8">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center gap-4"
         >
           <Link to="/dashboard">
             <Button variant="ghost" size="icon">
               <ArrowLeft className="w-5 h-5" />
             </Button>
           </Link>
           <div>
             <h1 className="text-3xl font-bold font-display flex items-center gap-3">
               <SettingsIcon className="w-8 h-8 text-muted-foreground" />
               <span className="text-gradient">Settings</span>
             </h1>
             <p className="text-muted-foreground">Customize your experience</p>
           </div>
         </motion.div>
 
         {/* Settings Sections */}
         {settingsSections.map((section, sectionIndex) => (
           <motion.div
             key={section.title}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: sectionIndex * 0.1 }}
             className="glass-card p-6"
           >
             <div className="flex items-center gap-3 mb-6">
               <section.icon className="w-5 h-5 text-primary" />
               <h2 className="text-xl font-bold font-display">{section.title}</h2>
             </div>
 
             <div className="space-y-4">
               {section.items.map((item, itemIndex) => (
                 <div key={item.label}>
                   {item.type === "input" && (
                     <div className="space-y-2">
                       <Label htmlFor={item.label}>{item.label}</Label>
                       <Input
                         id={item.label}
                         value={item.value}
                         onChange={(e) => item.onChange(e.target.value)}
                         className="bg-secondary/50 max-w-md"
                       />
                     </div>
                   )}
 
                   {item.type === "toggle" && (
                     <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                       <div>
                         <p className="font-medium">{item.label}</p>
                         <p className="text-sm text-muted-foreground">{item.description}</p>
                       </div>
                       <Switch
                         checked={item.checked}
                         onCheckedChange={item.onChange}
                       />
                     </div>
                   )}
 
                   {item.type === "theme" && (
                     <div className="space-y-3">
                       <Label>{item.label}</Label>
                       <div className="flex gap-3">
                         {[
                           { value: "dark", label: "Dark", icon: Moon },
                           { value: "light", label: "Light", icon: Sun },
                         ].map((themeOption) => (
                           <button
                             key={themeOption.value}
                             onClick={() => item.onChange(themeOption.value)}
                             className={cn(
                               "flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all",
                               item.value === themeOption.value
                                 ? "border-primary bg-primary/10"
                                 : "border-border/50 hover:border-border"
                             )}
                           >
                             <themeOption.icon className={cn(
                               "w-5 h-5",
                               item.value === themeOption.value ? "text-primary" : "text-muted-foreground"
                             )} />
                             <span className={cn(
                               "font-medium",
                               item.value === themeOption.value ? "text-primary" : "text-muted-foreground"
                             )}>
                               {themeOption.label}
                             </span>
                             {item.value === themeOption.value && (
                               <Check className="w-4 h-4 text-primary ml-2" />
                             )}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </motion.div>
         ))}
 
         {/* Data & Privacy */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="glass-card p-6"
         >
           <div className="flex items-center gap-3 mb-6">
             <Shield className="w-5 h-5 text-primary" />
             <h2 className="text-xl font-bold font-display">Data & Privacy</h2>
           </div>
 
           <div className="space-y-3">
             <Button variant="outline" className="w-full justify-start gap-3">
               <Download className="w-4 h-4" />
               Export All Data
             </Button>
 
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button variant="outline" className="w-full justify-start gap-3 text-destructive hover:text-destructive">
                   <Trash2 className="w-4 h-4" />
                   Delete All Data
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent className="bg-card border-border">
                 <AlertDialogHeader>
                   <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
                   <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete all your habits, progress, and settings.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                     Delete Everything
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           </div>
         </motion.div>
 
         {/* Help & Support */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="glass-card p-6"
         >
           <div className="flex items-center gap-3 mb-6">
             <HelpCircle className="w-5 h-5 text-primary" />
             <h2 className="text-xl font-bold font-display">Help & Support</h2>
           </div>
 
           <div className="space-y-3">
             <Button variant="outline" className="w-full justify-start gap-3">
               <Mail className="w-4 h-4" />
               Contact Support
             </Button>
             <Button variant="outline" className="w-full justify-start gap-3">
               <HelpCircle className="w-4 h-4" />
               FAQ & Documentation
             </Button>
           </div>
         </motion.div>
 
         {/* Sign Out */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
         >
           <Link to="/">
             <Button variant="outline" className="w-full gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
               <LogOut className="w-4 h-4" />
               Sign Out
             </Button>
           </Link>
         </motion.div>
 
         {/* Version */}
         <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.6 }}
           className="text-center text-sm text-muted-foreground"
         >
           RoutineX v1.0.0
         </motion.p>
       </div>
     </div>
   );
 };
 
 export default Settings;