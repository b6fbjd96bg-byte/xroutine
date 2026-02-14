import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Fitness Coach",
    quote: "Superoutine turned my scattered routine into a system. The XP leveling is addictive — I've maintained a 45-day streak!",
    rating: 5,
    avatar: "SK",
  },
  {
    name: "Marcus T.",
    role: "Software Engineer",
    quote: "The 'Life Happens' pass is genius. I used to lose 30-day streaks over one sick day. Not anymore.",
    rating: 5,
    avatar: "MT",
  },
  {
    name: "Priya R.",
    role: "Medical Student",
    quote: "The focus timer + habit stacking changed how I study. I linked 'Flashcards' after 'Morning Coffee' and haven't missed a day.",
    rating: 5,
    avatar: "PR",
  },
  {
    name: "James L.",
    role: "Entrepreneur",
    quote: "Finally, a habit tracker that makes me WANT to come back. The analytics showed me my worst day is Wednesday — now I plan around it.",
    rating: 5,
    avatar: "JL",
  },
];

const Testimonials = () => {
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
            Loved by <span className="text-gradient">habit builders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real people, real results. Here's what our community says.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-chart-yellow text-chart-yellow" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm font-display">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold font-display text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
