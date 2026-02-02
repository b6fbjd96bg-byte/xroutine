import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
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
            Build better habits, one day at a time
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight"
        >
          Transform Your Life with{" "}
          <span className="text-gradient">RoutineX</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Track your daily habits, visualize your progress, and build lasting
          routines with beautiful analytics and insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link to="/signup">
            <Button variant="hero" size="xl" className="group">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="heroOutline" size="xl">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {[
            "Daily & Weekly Tracking",
            "Visual Analytics",
            "Streak Tracking",
            "Progress Reports",
          ].map((feature, index) => (
            <div
              key={feature}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50"
            >
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="glass-card p-4 md:p-6 rounded-2xl">
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-chart-pink" />
                  <div className="w-3 h-3 rounded-full bg-chart-purple" />
                  <div className="w-3 h-3 rounded-full bg-chart-blue" />
                </div>
                <span className="text-xs text-muted-foreground">Dashboard Preview</span>
              </div>
              
              {/* Mini Chart Preview */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {[40, 60, 80, 45, 90, 70, 55].map((height, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t-sm bg-gradient-to-t from-primary/80 to-primary"
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">87%</div>
                  <div className="text-xs text-muted-foreground">Completion</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-chart-purple">14</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 text-center flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5 text-chart-green" />
                  <div className="text-2xl font-bold text-chart-green">+12%</div>
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
