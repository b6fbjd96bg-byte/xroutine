import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = ["Transforming.", "Growing.", "Winning.", "Leveling Up."];
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, TrendingUp, Zap, Shield, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import LiveDashboardDemo from "./LiveDashboardDemo";

const Hero = () => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setInterval(() => setW((i) => (i + 1) % WORDS.length), 2200); return () => clearInterval(t); }, []);
  return (
    <section aria-label="Hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-chart-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        <div className="hidden sm:block absolute top-10 right-10 w-64 h-64 bg-chart-blue/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary/60" style={{ left: `${(i * 53) % 100}%`, bottom: -10 }}
            animate={{ y: [0, -900], opacity: [0, 1, 0] }} transition={{ duration: 8 + (i % 5), repeat: Infinity, delay: i * 0.6, ease: "linear" }} />
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl font-bold font-display mb-4 sm:mb-6 leading-tight"
        >
          Stop Tracking. Start{" "}
          <span className="relative inline-block min-w-[6ch] align-bottom">
            <AnimatePresence mode="wait">
              <motion.span key={WORDS[w]} className="text-gradient inline-block" initial={{ opacity: 0, y: 30, rotateX: -60 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -30, rotateX: 60 }} transition={{ duration: 0.45 }}>
                {WORDS[w]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
        >
          Superoutine uses <strong className="text-foreground">XP leveling</strong>, <strong className="text-foreground">streak protection</strong>, and <strong className="text-foreground">smart analytics</strong> to turn your daily habits into a game you actually want to play.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link to="/signup">
            <Button variant="hero" size="xl" className="group">
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="heroOutline" size="xl">
              Sign In
            </Button>
          </Link>
          <div className="flex items-center">
            <button
              onClick={async () => {
                const shareText = `I'm using Superoutine — stop tracking, start transforming. Try it!`;
                try {
                  if (navigator.share) {
                    await navigator.share({ title: 'Superoutine', text: shareText });
                  } else {
                    await navigator.clipboard.writeText(shareText);
                    alert('Share text copied to clipboard');
                  }
                } catch (e) {}
              }}
              className="ml-3 inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-border text-sm bg-secondary/30 hover:bg-secondary/40 transition"
            >
              Share
            </button>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-3 sm:gap-6 justify-center mb-12 sm:mb-16 px-2"
        >
          {[
            { icon: Zap, text: "Earn XP & Level Up" },
            { icon: Shield, text: "Streak Protection" },
            { icon: BarChart3, text: "Deep Analytics" },
            { icon: TrendingUp, text: "+40% Consistency" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{text}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4 relative"
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass-card p-4 md:p-6 rounded-2xl">
            <LiveDashboardDemo />
          </div>
          
          </motion.div>
          {/* Glow Effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
