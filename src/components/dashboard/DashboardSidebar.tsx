import { Link, useLocation } from "react-router-dom";
import { CheckCircle, LayoutDashboard, Calendar, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6 flex flex-col">
      <Link to="/" className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold font-display">RoutineX</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200",
              location.pathname === item.path && "bg-primary/10 text-primary"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link
        to="/"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign Out</span>
      </Link>
    </aside>
  );
};

export default DashboardSidebar;