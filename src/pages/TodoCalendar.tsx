import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Trash2, Circle, CheckCircle2 } from "lucide-react";
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

const TodoCalendar = () => {
  const { user } = useAuth();
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [selected, setSelected] = useState(ymd(new Date()));
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const start = ymd(month);
  const end = ymd(new Date(month.getFullYear(), month.getMonth() + 1, 0));

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("todos").select("id,title,completed,date,priority").eq("user_id", user.id).gte("date", start).lte("date", end).order("created_at");
    setTodos((data as Todo[]) || []);
  }, [user, start, end]);
  useEffect(() => { load(); }, [load]);

  const byDate = useMemo(() => {
    const m: Record<string, Todo[]> = {};
    todos.forEach(t => (m[t.date] ||= []).push(t));
    return m;
  }, [todos]);

  const cells = useMemo(() => {
    const first = (month.getDay() + 6) % 7; // Monday start
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  }, [month]);

  const add = async () => {
    if (!title.trim() || !user) return;
    const { data } = await supabase.from("todos").insert({ user_id: user.id, title: title.trim(), date: selected, priority }).select("id,title,completed,date,priority").single();
    if (data) {
      if (selected >= start && selected <= end) setTodos(p => [...p, data as Todo]);
      setTitle("");
    }
  };
  const toggle = async (t: Todo) => {
    setTodos(p => p.map(x => x.id === t.id ? { ...x, completed: !x.completed } : x));
    await supabase.from("todos").update({ completed: !t.completed }).eq("id", t.id);
  };
  const remove = async (id: string) => {
    setTodos(p => p.filter(x => x.id !== id));
    await supabase.from("todos").delete().eq("id", id);
  };

  const dayTodos = byDate[selected] || [];
  const today = ymd(new Date());
  const doneMonth = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-20 p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-4xl font-bold font-display text-gradient">To-Do Calendar</h1>
              <p className="text-muted-foreground">Plan tasks for any day. {doneMonth}/{todos.length} done this month.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="font-display font-semibold w-36 text-center">{month.toLocaleString("default", { month: "long", year: "numeric" })}</span>
              <Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 glass-card p-4">
              <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2 text-center">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((c, i) => {
                  if (!c) return <div key={i} />;
                  const key = ymd(c);
                  const list = byDate[key] || [];
                  const done = list.filter(t => t.completed).length;
                  return (
                    <button key={key} onClick={() => setSelected(key)} className={cn(
                      "aspect-square sm:aspect-[4/3] rounded-lg p-1.5 text-left flex flex-col border transition-all",
                      key === selected ? "border-primary bg-primary/10" : "border-border/40 hover:bg-secondary/60",
                    )}>
                      <span className={cn("text-xs font-semibold", key === today && "text-primary")}>{c.getDate()}</span>
                      {list.length > 0 && <>
                        <div className="flex gap-0.5 mt-auto flex-wrap">
                          {list.slice(0, 4).map(t => <span key={t.id} className={cn("w-1.5 h-1.5 rounded-full", t.completed ? "bg-muted-foreground" : prioColor[t.priority] || "bg-primary")} />)}
                        </div>
                        <span className="text-[10px] text-muted-foreground hidden sm:block">{done}/{list.length} done</span>
                      </>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 glass-card p-5">
              <h2 className="font-display font-bold mb-1">{new Date(selected + "T00:00").toLocaleDateString("default", { weekday: "long", day: "numeric", month: "long" })}</h2>
              <p className="text-xs text-muted-foreground mb-4">{dayTodos.filter(t => t.completed).length}/{dayTodos.length} tasks done</p>
              <div className="flex gap-2 mb-2">
                <Input value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Add a task…" />
                <Button size="icon" onClick={add} disabled={!title.trim()}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex gap-1 mb-4">
                {["high", "medium", "low"].map(p => (
                  <button key={p} onClick={() => setPriority(p)} className={cn("text-xs px-2 py-1 rounded-full capitalize flex items-center gap-1 border", priority === p ? "border-primary text-foreground" : "border-border/40 text-muted-foreground")}>
                    <span className={cn("w-2 h-2 rounded-full", prioColor[p])} />{p}
                  </button>
                ))}
              </div>
              <div className="space-y-1">
                <AnimatePresence>
                  {dayTodos.map(t => (
                    <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 group py-1.5">
                      <button onClick={() => toggle(t)} aria-label="Toggle task">{t.completed ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground" />}</button>
                      <span className={cn("w-2 h-2 rounded-full", prioColor[t.priority] || "bg-primary")} />
                      <span className={cn("text-sm flex-1", t.completed && "line-through text-muted-foreground")}>{t.title}</span>
                      <button onClick={() => remove(t.id)} className="opacity-0 group-hover:opacity-100" aria-label="Delete task"><Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {dayTodos.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nothing planned. Add a task above.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoCalendar;
