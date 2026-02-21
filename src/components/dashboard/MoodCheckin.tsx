import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MOODS = [
  { value: 1, emoji: "😔", label: "Tough day" },
  { value: 2, emoji: "😐", label: "Meh" },
  { value: 3, emoji: "🙂", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "🤩", label: "Amazing" },
];

interface MoodCheckinProps {
  completedToday: number;
  totalHabits: number;
}

const MoodCheckin = ({ completedToday, totalHabits }: MoodCheckinProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [recentMoods, setRecentMoods] = useState<{ mood: number; date: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchMoods = async () => {
      const { data } = await supabase
        .from("mood_checkins")
        .select("mood, date")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(7);
      if (data) {
        setRecentMoods(data);
        const today = new Date().toISOString().split("T")[0];
        const todayEntry = data.find(m => m.date === today);
        if (todayEntry) setTodayMood(todayEntry.mood);
      }
    };
    fetchMoods();
  }, [user]);

  const handleMoodSelect = async (mood: number) => {
    if (!user || saving) return;
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("mood_checkins")
      .upsert({ user_id: user.id, mood, date: today }, { onConflict: "user_id,date" });

    if (!error) {
      setTodayMood(mood);
      setRecentMoods(prev => {
        const updated = prev.filter(m => m.date !== today);
        return [{ mood, date: today }, ...updated].slice(0, 7);
      });
      toast({ title: `${MOODS[mood - 1].emoji} Mood logged!`, description: "Keep tracking — patterns reveal insights!" });
    }
    setSaving(false);
  };

  const avgMood = recentMoods.length > 0
    ? (recentMoods.reduce((s, m) => s + m.mood, 0) / recentMoods.length).toFixed(1)
    : null;

  const habitCorrelation = completedToday > 0 && totalHabits > 0
    ? `You've done ${completedToday}/${totalHabits} habits — ${completedToday >= totalHabits ? "that usually means a great mood day!" : "every bit counts toward feeling better!"}`
    : "Complete a habit and see how it affects your mood!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <h3 className="font-bold font-display text-base">How are you feeling?</h3>
        </div>
        {avgMood && (
          <span className="text-xs text-muted-foreground">
            7-day avg: {avgMood}/5
          </span>
        )}
      </div>

      {/* Mood selector */}
      <div className="flex justify-between gap-2 mb-4">
        {MOODS.map((m) => (
          <motion.button
            key={m.value}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodSelect(m.value)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
              todayMood === m.value
                ? "bg-primary/15 border border-primary/30 shadow-sm"
                : "hover:bg-secondary/50"
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Recent mood dots */}
      {recentMoods.length > 1 && (
        <div className="flex items-center gap-1 mb-3">
          <span className="text-xs text-muted-foreground mr-1">Week:</span>
          {recentMoods.slice().reverse().map((m, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
              title={m.date}
            >
              {MOODS[m.mood - 1]?.emoji}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">{habitCorrelation}</p>
    </motion.div>
  );
};

export default MoodCheckin;
