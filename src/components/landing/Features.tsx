import { motion } from "framer-motion";
import { BarChart3, Calendar, CheckCircle2, Flame, PieChart, Target } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Monthly Grid View",
    description: "See your entire month at a glance with an intuitive calendar grid for tracking daily habits.",
    color: "text-chart-pink",
    bg: "bg-chart-pink/10",
  },
  {
    icon: BarChart3,
    title: "Weekly Analytics",
    description: "Color-coded weekly progress bars showing your completion rates across different time periods.",
    color: "text-chart-purple",
    bg: "bg-chart-purple/10",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description: "Build momentum with current and longest streak tracking to keep you motivated.",
    color: "text-chart-yellow",
    bg: "bg-chart-yellow/10",
  },
  {
    icon: PieChart,
    title: "Progress Charts",
    description: "Beautiful donut charts and progress visualizations for your overall daily completion.",
    color: "text-chart-blue",
    bg: "bg-chart-blue/10",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set custom goals for each habit and track how close you are to achieving them.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: CheckCircle2,
    title: "Easy Check-ins",
    description: "One-click habit completion with satisfying animations and instant visual feedback.",
    color: "text-chart-green",
    bg: "bg-chart-green/10",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Everything you need to{" "}
            <span className="text-gradient">build habits</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you track, analyze, and improve your daily routines.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
