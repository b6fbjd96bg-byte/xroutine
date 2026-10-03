import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Circle, CheckCircle2 } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Todo = { id: string; title: string; completed: boolean; date: string; priority: string };
const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const prioColor: Record<string, string> = { high: "bg-destructive", medium: "bg-chart-yellow", low: "bg-primary" };
const prioRank: Record<string, number> = { high: 0, medium: 1, low: 2 };

const TodoList = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const today = ymd(new Date());

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("todos").select("id,title,completed,date,priority").eq("user_id", user.id).eq("date", today).order("created_at");
    setTodos((data as Todo[]) || []);
  }, [user, today]);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!title.trim() || !user) return;
    const { data } = await supabase.from("todos").insert({ user_id: user.id, title: title.trim(), date: today, priority }).select("id,title,completed,date,priority").single();
    if (data) { setTodos(p => [...p, data as Todo]); setTitle(""); }
  };
  const toggle = async (t: Todo) => {
    setTodos(p => p.map(x => x.id === t.id ? { ...x, completed: !x.completed } : x));
    await supabase.from("todos").update({ completed: !t.completed }).eq("id", t.id);
  };
  const remove = async (id: string) => {
    setTodos(p => p.filter(x => x.id !== id));
    await supabase.from("todos").delete().eq("id", id);
  };

  const sorted = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed) || (prioRank[a.priority] ?? 1) - (prioRank[b.priority] ?? 1));
  const done = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-20 p-4 sm:p-6 lg:p-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-gradient">To-Do</h1>
            <p className="text-muted-foreground">{done}/{todos.length} done today.</p>
          </div>

          <div className="glass-card p-4 sm:p-5">
            <div className="flex gap-2 mb-3">
              <Input value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Add a task…" />
              <Button size="icon" onClick={add} disabled={!title.trim()} aria-label="Add task"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex gap-1 mb-4">
              {["high", "medium", "low"].map(p => (
                <button key={p} type="button" onClick={() => setPriority(p)} className={cn("text-xs px-3 py-1.5 rounded-full capitalize flex items-center gap-1 border touch-manipulation", priority === p ? "border-primary text-foreground" : "border-border/40 text-muted-foreground")}>
                  <span className={cn("w-2 h-2 rounded-full", prioColor[p])} />{p}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              <AnimatePresence>
                {sorted.map(t => (
                  <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                    <button type="button" onClick={() => toggle(t)} aria-label="Toggle task" className="touch-manipulation shrink-0">
                      {t.completed ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                    </button>
                    <span className={cn("w-2 h-2 rounded-full shrink-0", prioColor[t.priority] || "bg-primary")} />
                    <span className={cn("text-sm flex-1 break-words", t.completed && "line-through text-muted-foreground")}>{t.title}</span>
                    <button type="button" onClick={() => remove(t.id)} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Delete task"><Trash2 className="w-4 h-4" /></button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {todos.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nothing yet. Add your first task above.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoList;
