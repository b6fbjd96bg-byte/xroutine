import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowRight, Sparkles, Target, Zap, Trophy, Crown, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingWizardProps {
  onComplete: (habits: { name: string; goal: number }[]) => void;
}

const suggestedHabits = [
  { name: "Drink 2L of Water", goal: 25, emoji: "💧" },
  { name: "Meditation", goal: 20, emoji: "🧘" },
  { name: "Reading", goal: 15, emoji: "📚" },
  { name: "Running", goal: 16, emoji: "🏃" },
  { name: "Stretching", goal: 20, emoji: "🤸" },
  { name: "Eating Healthy", goal: 25, emoji: "🥗" },
  { name: "Journaling", goal: 20, emoji: "📝" },
  { name: "Sleep by 11 PM", goal: 25, emoji: "😴" },
];

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [selectedHabits, setSelectedHabits] = useState<Set<number>>(new Set());
  const [customHabit, setCustomHabit] = useState("");
  const { toast } = useToast();

  const steps = [
    { icon: Sparkles, title: "Welcome to Superoutine!", subtitle: "Let's set up your habit tracker in 30 seconds" },
    { icon: Target, title: "Pick Your Habits", subtitle: "Choose habits you want to build (you can always add more later)" },
    { icon: Crown, title: "Choose Your Path", subtitle: "Start free or go all-in" },
    { icon: Zap, title: "How It Works", subtitle: "Quick tour of your superpowers" },
    { icon: Trophy, title: "You're All Set!", subtitle: "Let's start your journey" },
  ];

  const toggleHabit = (index: number) => {
    const next = new Set(selectedHabits);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedHabits(next);
  };

  const addCustom = () => {
    if (customHabit.trim()) {
      suggestedHabits.push({ name: customHabit.trim(), goal: 20, emoji: "⭐" });
      setSelectedHabits(new Set([...selectedHabits, suggestedHabits.length - 1]));
      setCustomHabit("");
    }
  };

  const handleFinish = () => {
    const habits = Array.from(selectedHabits).map((i) => ({
      name: suggestedHabits[i].name,
      goal: suggestedHabits[i].goal,
    }));
    onComplete(habits.length > 0 ? habits : [{ name: "Drink 2L of Water", goal: 25 }]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/50" : "w-2 bg-secondary"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="glass-card p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-primary" />
                </motion.div>
                <h1 className="text-3xl font-bold font-display mb-3">
                  Welcome to <span className="text-gradient">Superoutine</span>
                </h1>
                <p className="text-muted-foreground mb-8">
                  You're about to join thousands of people building better habits with gamification, streaks, and smart analytics.
                </p>
                <div className="space-y-3 text-left mb-8">
                  {[
                    "Earn XP for every habit you complete",
                    "Protect your streaks with 'Life Happens' passes",
                    "Track progress with beautiful analytics",
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
                <Button variant="hero" size="lg" className="w-full group" onClick={() => setStep(1)}>
                  Let's Go
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* Step 1: Pick Habits */}
            {step === 1 && (
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold font-display mb-2">Pick Your Habits</h2>
                  <p className="text-muted-foreground text-sm">Select the habits you want to build. You can customize later.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {suggestedHabits.map((habit, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleHabit(i)}
                      className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                        selectedHabits.has(i)
                          ? "bg-primary/10 border-primary/40 ring-1 ring-primary/30"
                          : "bg-secondary/30 border-border/30 hover:border-border/60"
                      }`}
                    >
                      <div className="text-lg mb-1">{habit.emoji}</div>
                      <div className="text-sm font-medium">{habit.name}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Custom habit */}
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Add your own habit..."
                    value={customHabit}
                    onChange={(e) => setCustomHabit(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustom()}
                    className="bg-secondary/50"
                  />
                  <Button variant="outline" onClick={addCustom} disabled={!customHabit.trim()}>
                    Add
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(0)} className="flex-1">
                    Back
                  </Button>
                  <Button variant="hero" className="flex-1 group" onClick={() => setStep(2)}>
                    Continue
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Choose Your Path */}
            {step === 2 && (
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold font-display mb-2">Choose Your Path</h2>
                  <p className="text-muted-foreground text-sm">Pick the plan that fits your commitment level</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Free */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(3)}
                    className="p-5 rounded-2xl text-left border-2 border-border/50 bg-secondary/20 hover:border-primary/40 transition-all group"
                  >
                    <Rocket className="w-8 h-8 text-primary mb-3" />
                    <div className="text-lg font-bold font-display mb-1">Start Free</div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li>✓ Up to 5 daily habits</li>
                      <li>✓ Up to 3 weekly habits</li>
                      <li>✓ Basic analytics</li>
                      <li>✓ 1 streak protection/month</li>
                      <li>✓ Focus timer & journal</li>
                    </ul>
                    <div className="mt-3 text-sm font-semibold text-primary group-hover:underline">
                      Continue Free →
                    </div>
                  </motion.button>

                  {/* Premium */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      toast({
                        title: "You're on the waitlist! 🎉",
                        description: "We'll notify you when Premium launches. Starting you on Free for now.",
                      });
                      setStep(3);
                    }}
                    className="p-5 rounded-2xl text-left border-2 border-chart-yellow/40 bg-chart-yellow/5 hover:border-chart-yellow/70 transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-3 right-3 text-[10px] font-bold bg-chart-yellow/20 text-chart-yellow px-2 py-0.5 rounded-full">
                      COMING SOON
                    </div>
                    <Crown className="w-8 h-8 text-chart-yellow mb-3" />
                    <div className="text-lg font-bold font-display mb-1">Get Serious</div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li>✓ Unlimited habits</li>
                      <li>✓ Deep analytics & insights</li>
                      <li>✓ 3 streak protections/month</li>
                      <li>✓ Weekly email reports</li>
                      <li>✓ Full AI motivation</li>
                    </ul>
                    <div className="mt-3 text-sm font-semibold text-chart-yellow group-hover:underline">
                      Join Waitlist →
                    </div>
                  </motion.button>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: How it works */}
            {step === 3 && (
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold font-display mb-2">Your Superpowers</h2>
                  <p className="text-muted-foreground text-sm">Here's what makes Superoutine different</p>
                </div>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: "⚡", title: "XP & Levels", desc: "Every habit completed earns XP. Daily = +10 XP, Weekly = +50 XP. Level up as you grow!" },
                    { icon: "🛡️", title: "Life Happens Pass", desc: "Emergency skips protect your streak. Because everyone has bad days." },
                    { icon: "🔥", title: "Streak Fire", desc: "Build consecutive day streaks. Watch your flame grow and never want to break it." },
                    { icon: "🎯", title: "Focus Timer", desc: "Built-in deep work timer for habits like meditation and reading." },
                  ].map((item) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 p-3 rounded-xl bg-secondary/30"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <div className="font-semibold font-display text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button variant="hero" className="flex-1 group" onClick={() => setStep(4)}>
                    Almost Done
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Ready */}
            {step === 4 && (
              <div className="glass-card p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6"
                >
                  <Trophy className="w-10 h-10 text-chart-yellow" />
                </motion.div>
                <h2 className="text-3xl font-bold font-display mb-3">You're Ready!</h2>
                <p className="text-muted-foreground mb-4">
                  {selectedHabits.size > 0
                    ? `${selectedHabits.size} habit${selectedHabits.size > 1 ? "s" : ""} selected. Your tracker starts at Level 1 with 0 XP.`
                    : "We'll add a starter habit for you. You can customize anytime."}
                </p>
                <div className="p-4 rounded-xl bg-secondary/30 mb-8">
                  <div className="text-sm text-muted-foreground mb-2">Starting Stats</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xl font-bold text-primary">Lv. 1</div>
                      <div className="text-xs text-muted-foreground">Level</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-chart-yellow">0</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-chart-pink">0 🔥</div>
                      <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(3)} className="flex-1">
                    Back
                  </Button>
                  <Button variant="hero" size="lg" className="flex-1 group" onClick={handleFinish}>
                    Launch Dashboard
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingWizard;
