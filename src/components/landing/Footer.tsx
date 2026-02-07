import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-display">RoutineX</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The gamified habit tracker that turns your daily routines into lasting behavioral change. Built with psychology, powered by design.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Privacy Policy</span></li>
              <li><span className="text-sm text-muted-foreground">Terms of Service</span></li>
              <li><span className="text-sm text-muted-foreground">Contact</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RoutineX. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with 💚 for habit builders everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
