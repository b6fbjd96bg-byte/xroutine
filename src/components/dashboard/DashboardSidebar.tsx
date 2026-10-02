import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, ListTodo, Gift, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashIcon, CalIcon, StatsIcon, GearIcon } from "./NavIcons";
import SidebarUpgrade from "@/components/premium/SidebarUpgrade";

const navItems = [
  { icon: DashIcon, label: "Dashboard", path: "/dashboard" },
  { icon: ListTodo, label: "To-Do Calendar", path: "/dashboard/todos" },
  { icon: Bot, label: "AI Coach", path: "/dashboard/coach" },
  { icon: CalIcon, label: "Calendar", path: "/dashboard/calendar" },
  { icon: StatsIcon, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Gift, label: "Refer & Earn", path: "/dashboard/refer" },
  { icon: GearIcon, label: "Settings", path: "/dashboard/settings" },
];

const SidebarContent = ({ onNavigate, compact }: { onNavigate?: () => void; compact?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">
      <Link to="/" className={cn("flex items-center gap-3 mb-8", compact && "justify-center")} onClick={onNavigate} title="Superoutine">
        <img src="/logo.png" alt="Superoutine" className="w-9 h-9 rounded-xl" />
        {!compact && <span className="text-xl font-bold font-display">Superoutine</span>}
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            title={item.label}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200",
              location.pathname === item.path && "bg-primary/10 text-primary",
              compact && "justify-center px-0"
            )}
          >
            <item.icon className="w-5 h-5" />
            {!compact && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <SidebarUpgrade compact={compact} />

      <button
        onClick={handleSignOut}
        title="Sign Out"
        className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200", compact && "justify-center px-0")}
      >
        <LogOut className="w-5 h-5" />
        {!compact && <span className="font-medium">Sign Out</span>}
      </button>
    </div>
  );
};

const DashboardSidebar = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur-xl border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Superoutine" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold font-display">Superoutine</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card border-border p-6">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        {/* Spacer for fixed header */}
        <div className="h-14" />
      </>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-card border-r border-border py-6 px-3 flex flex-col z-40">
      <SidebarContent compact />
    </aside>
  );
};

export default DashboardSidebar;
