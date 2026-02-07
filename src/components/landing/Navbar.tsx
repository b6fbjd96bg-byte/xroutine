import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${scrolled ? "py-2" : ""}`}
    >
      <div className={`max-w-6xl mx-auto flex items-center justify-between glass-card px-6 py-3 transition-all duration-300 ${scrolled ? "shadow-lg shadow-primary/5" : ""}`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display">RoutineX</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="default" size="sm">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
