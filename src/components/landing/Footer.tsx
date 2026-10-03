import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Superoutine" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold font-display">Superoutine</span>
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

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/earn" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refer & Earn</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About / Creator</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping Policy</Link></li>
              <li><Link to="/refunds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cancellation and Refunds</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Superoutine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
