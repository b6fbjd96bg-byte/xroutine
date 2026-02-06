import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const quotes = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.", author: "Benjamin Franklin" },
  { text: "Chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
  { text: "Good habits formed at youth make all the difference.", author: "Aristotle" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { text: "You'll never change your life until you change something you do daily.", author: "John C. Maxwell" },
  { text: "First forget inspiration. Habit is more dependable.", author: "Octavia Butler" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It's not what we do once in a while that shapes our lives, but what we do consistently.", author: "Tony Robbins" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "The difference between who you are and who you want to be is what you do.", author: "Unknown" },
];

const DailyQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Get quote based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setTimeout(() => {
      setCurrentQuote(quotes[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-4 rounded-xl bg-gradient-to-br from-primary/10 via-chart-purple/5 to-chart-cyan/10 border border-primary/20 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-2 left-2 opacity-20">
        <Quote className="w-8 h-8 text-primary" />
      </div>
      <div className="absolute bottom-2 right-2 opacity-20 rotate-180">
        <Quote className="w-6 h-6 text-chart-purple" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-chart-yellow" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Daily Motivation
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 0.3 }}
            >
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </motion.div>
          </Button>
        </div>

        <motion.div
          key={currentQuote.text}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium leading-relaxed mb-2 pl-4">
            "{currentQuote.text}"
          </p>
          <p className="text-xs text-primary font-medium pl-4">
            — {currentQuote.author}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DailyQuote;
