import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, TrendingUp, Zap, Shield, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-chart-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        <div className="hidden sm:block absolute top-10 right-10 w-64 h-64 bg-chart-blue/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            #1 Gamified Habit Tracker — Join 10,000+ achievers
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl font-bold font-display mb-4 sm:mb-6 leading-tight"
        >
          Stop Tracking. Start{" "}
          <span className="text-gradient">Transforming.</span>
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
          <div className="glass-card p-4 md:p-6 rounded-2xl">
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-chart-pink" />
                  <div className="w-3 h-3 rounded-full bg-chart-purple" />
                  <div className="w-3 h-3 rounded-full bg-chart-blue" />
                </div>
                <span className="text-xs text-muted-foreground">Live Dashboard Preview</span>
              </div>
              
              {/* XP Bar Preview */}
              <div className="mb-6 p-3 rounded-xl bg-secondary/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-display font-semibold">Level 7 — Habit Master</span>
                  <span className="text-xs text-primary">4,350 / 5,000 XP</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-primary to-chart-cyan"
                    initial={{ width: "0%" }}
                    animate={{ width: "87%" }}
                    transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Mini Chart Preview */}
              <div className="hidden sm:grid grid-cols-7 gap-2 mb-6">
                {[40, 60, 80, 45, 90, 70, 55].map((height, i) => (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center gap-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                  >
                    <div 
                      className="w-full rounded-t-sm bg-gradient-to-t from-primary/80 to-primary"
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-primary">87%</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Completion</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-chart-purple">14</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Day Streak 🔥</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 text-center flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-chart-green" />
                  <div className="text-lg sm:text-2xl font-bold text-chart-green">+12%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
