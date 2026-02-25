import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is Superoutine?",
    answer:
      "Superoutine is a gamified habit tracker that uses XP leveling, streak protection, and smart analytics to help you build lasting habits. It turns your daily routine into a game you actually want to play.",
  },
  {
    question: "Is Superoutine free to use?",
    answer:
      "Yes! Superoutine is free to start. You can track unlimited daily and weekly habits, earn XP, use the focus timer, and access all core features — no credit card required.",
  },
  {
    question: "How does the XP system work?",
    answer:
      "You earn XP every time you complete a habit — 10 XP for daily habits and 25 XP for weekly habits. As you accumulate XP, you level up from Beginner to Habit Master, unlocking achievement badges along the way.",
  },
  {
    question: "What is streak protection?",
    answer:
      "Life happens! Streak protection gives you one emergency skip per month. If you miss a day, you can use your skip to keep your streak alive without penalty.",
  },
  {
    question: "Can I track both daily and weekly habits?",
    answer:
      "Absolutely. Superoutine supports both daily habits (like drinking water, meditation) and weekly habits (like gym sessions, meal prep). Each has its own tracking grid and progress analytics.",
  },
  {
    question: "Does Superoutine work on mobile?",
    answer:
      "Yes, Superoutine is fully responsive and works beautifully on phones, tablets, and desktops. You can even add it to your home screen for an app-like experience.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 relative">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about Superoutine
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/20 transition-colors"
              >
                <h3 className="font-display font-semibold text-sm sm:text-base pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
