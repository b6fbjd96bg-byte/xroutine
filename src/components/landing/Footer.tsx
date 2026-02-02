import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display">RoutineX</span>
        </div>

        <p className="text-sm text-muted-foreground">
          © 2024 RoutineX. Build better habits, transform your life.
        </p>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
