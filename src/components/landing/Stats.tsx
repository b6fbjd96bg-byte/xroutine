import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "2.5M", label: "Habits Completed" },
  { value: "94%", label: "Streak Retention" },
  { value: "4.9★", label: "User Rating" },
];

const Stats = () => {
  return (
    <section className="py-16 px-4 border-y border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold font-display text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
