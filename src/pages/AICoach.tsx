import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, Loader2, Send } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15"><Bot className="h-5 w-5 text-primary" /></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display">AI Coach</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Knows your habits, streaks and today's tasks.</p>
          </div>
        </div>

        <div className="glass-card flex-1 flex flex-col p-3 sm:p-5 min-h-[60vh]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.length === 0 && (
              <div className="py-8 text-center space-y-4">
                
                <p className="text-sm text-muted-foreground">Ask anything about your habits. Try one of these:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {STARTERS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-xl border border-border/50 bg-secondary/30 p-3 text-left text-sm hover:border-primary/40 transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/50")}>
                  {m.role === "assistant" ? <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1"><ReactMarkdown>{m.content}</ReactMarkdown></div> : m.content}
                </div>
              </div>
            ))}
            {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Coach is thinking…</div>}
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
        </div>
      </div></main>
    </div>
  );
};

export default AICoach;
