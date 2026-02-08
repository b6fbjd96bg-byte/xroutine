import { motion } from "framer-motion";
import { BarChart3, Calendar, CheckCircle2, Flame, PieChart, Target, Zap, Shield, Timer, Trophy, Brain, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "XP & Leveling System",
    description: "Earn XP for every habit you complete. Level up from Beginner to Habit Master as you build consistency.",
    color: "text-chart-yellow",
    bg: "bg-chart-yellow/10",
  },
  {
    icon: Shield,
    title: "'Life Happens' Pass",
    description: "One emergency skip per month to protect your streak — because real life doesn't pause for habit trackers.",
    color: "text-chart-blue",
    bg: "bg-chart-blue/10",
  },
  {
    icon: Timer,
    title: "Focus Mode Timer",
    description: "Built-in deep work timer for habits like meditation and reading. Stay locked in with a minimalist countdown.",
    color: "text-chart-pink",
    bg: "bg-chart-pink/10",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "14-day trends, habit performance rankings, and AI-powered insights to understand your patterns.",
    color: "text-chart-purple",
    bg: "bg-chart-purple/10",
  },
  {
    icon: Brain,
    title: "Habit Stacking",
    description: "Link new habits to existing ones — 'I'll meditate right after my morning coffee' — for automatic routines.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Trophy,
    title: "Celebrations & Rewards",
    description: "Full-screen confetti when you hit 100% daily completion. Achievement badges to showcase your wins.",
    color: "text-chart-green",
    bg: "bg-chart-green/10",
  },
  {
    icon: Calendar,
    title: "Heatmap Calendar",
    description: "Visualize your entire month with a color-coded calendar. See exactly where you thrived and where you slipped.",
    color: "text-chart-cyan",
    bg: "bg-chart-cyan/10",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description: "Current and longest streaks displayed front-and-center. Watch your flame grow as consistency builds.",
    color: "text-chart-yellow",
    bg: "bg-chart-yellow/10",
  },
  {
    icon: Sparkles,
    title: "Daily Motivation",
    description: "Rotating motivational quotes from behavioral science research to keep you inspired every single day.",
    color: "text-chart-pink",
    bg: "bg-chart-pink/10",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Why RoutineX?
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
            Not just tracking.{" "}
            <span className="text-gradient">Behavioral change.</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Every feature is designed based on habit psychology — from gamification that motivates to analytics that educate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
