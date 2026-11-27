import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, Send } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "How am I doing this month?",
  "Plan my day around my habits",
  "I missed a few days. How do I bounce back?",
  "Which habit should I focus on next?",
];

const AICoach = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const next = [...messages, { role: "user" as const, content: t }].slice(-20);
    setMessages(next);
    setInput("");
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("ai-coach", { body: { messages: next } });
    setLoading(false);
    const msg = (data as any)?.error || (error ? "The coach couldn't answer. Try again." : null);
    if (msg) {
      toast({ title: "Coach unavailable", description: msg, variant: "destructive" });
      return;
    }
    setMessages((m) => [...m, { role: "assistant", content: (data as any).reply }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-20 p-4 sm:p-6 lg:p-10"><div className="max-w-3xl mx-auto flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <span className="absolute inset-0 rounded-xl bg-primary/25 animate-ping motion-reduce:hidden" style={{ animationDuration: "2.5s" }} />
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}><Bot className="h-5 w-5 text-primary" /></motion.div>
          </motion.div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display">AI Coach</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Knows your habits, streaks and today's tasks.</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="glass-card flex-1 flex flex-col p-3 sm:p-5 min-h-[60vh]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.length === 0 && (
              <div className="py-8 text-center space-y-4">
                
                <p className="text-sm text-muted-foreground">Ask anything about your habits. Try one of these:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {STARTERS.map((s, i) => (
                    <motion.button key={s} onClick={() => send(s)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} className="rounded-xl border border-border/50 bg-secondary/30 p-3 text-left text-sm hover:border-primary/40 hover:bg-primary/10 transition-colors">{s}</motion.button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} style={{ originX: m.role === "user" ? 1 : 0 }} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/50")}>
                  {m.role === "assistant" ? <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1"><ReactMarkdown>{m.content}</ReactMarkdown></div> : m.content}
                </div>
              </motion.div>
            ))}
            <AnimatePresence>{loading && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary/50 px-4 py-3" aria-label="Coach is thinking">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="h-2 w-2 rounded-full bg-primary" animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                  ))}
                </div>
              </motion.div>
            )}</AnimatePresence>
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask your coach…"
              rows={1}
              maxLength={2000}
              className="min-h-[44px] resize-none bg-secondary/50"
            />
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={loading || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></Button>
          </form>
        </motion.div>
      </div></main>
    </div>
  );
};

export default AICoach;
