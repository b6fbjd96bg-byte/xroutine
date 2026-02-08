import { motion } from "framer-motion";
import { UserPlus, ListChecks, TrendingUp, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description: "Sign up in seconds. Our onboarding wizard helps you set up your first habits based on your goals.",
  },
  {
    icon: ListChecks,
    step: "02",
    title: "Track Daily & Weekly",
    description: "Check off habits with one click. Earn XP, watch your streak grow, and unlock achievements.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Analyze & Improve",
    description: "Deep analytics show your patterns, best days, and areas for improvement with actionable insights.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Level Up Your Life",
    description: "As your level rises, so does your consistency. Build lasting routines that stick for good.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-chart-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From zero to habit hero in four simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 mx-auto">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-xs font-bold text-primary mb-2 font-display tracking-widest">{item.step}</div>
              <h3 className="text-lg font-bold font-display mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%_-_16px)] w-[calc(100%_-_32px)] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
