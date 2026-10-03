import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Sun, Moon, Clock, Check, Package, X, Sunrise, Dumbbell, BookOpen, Brain, type LucideIcon } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
const PACK_STYLES: Record<string, { icon: LucideIcon; card: string; glow: string; badge: string; text: string; chip: string }> = {
  morning: { icon: Sunrise, card: "border-chart-yellow/40 bg-gradient-to-br from-chart-yellow/15 to-transparent", glow: "bg-chart-yellow", badge: "bg-chart-yellow", text: "text-chart-yellow", chip: "border-chart-yellow/40 text-chart-yellow" },
  evening: { icon: Moon, card: "border-chart-purple/40 bg-gradient-to-br from-chart-purple/15 to-transparent", glow: "bg-chart-purple", badge: "bg-chart-purple", text: "text-chart-purple", chip: "border-chart-purple/40 text-chart-purple" },
  fitness: { icon: Dumbbell, card: "border-chart-pink/40 bg-gradient-to-br from-chart-pink/15 to-transparent", glow: "bg-chart-pink", badge: "bg-chart-pink", text: "text-chart-pink", chip: "border-chart-pink/40 text-chart-pink" },
  study: { icon: BookOpen, card: "border-chart-blue/40 bg-gradient-to-br from-chart-blue/15 to-transparent", glow: "bg-chart-blue", badge: "bg-chart-blue", text: "text-chart-blue", chip: "border-chart-blue/40 text-chart-blue" },
  mind: { icon: Brain, card: "border-chart-cyan/40 bg-gradient-to-br from-chart-cyan/15 to-transparent", glow: "bg-chart-cyan", badge: "bg-chart-cyan", text: "text-chart-cyan", chip: "border-chart-cyan/40 text-chart-cyan" },
};

import { TEMPLATES, newStep, type RoutineStep, type Template } from "@/lib/routineTemplates";

type Routine = { id: string; name: string; time_of_day: string; steps: RoutineStep[] };
const today = () => new Date().toLocaleDateString("en-CA");
const TIME_ICON: Record<string, any> = { morning: Sun, evening: Moon, anytime: Clock };

const Routines = () => {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [checks, setChecks] = useState<Record<string, string[]>>({});
  const [name, setName] = useState("");
  const [time, setTime] = useState("morning");
  const [stepText, setStepText] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<Routine | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: r }, { data: c }] = await Promise.all([
      supabase.from("routines").select("id, name, time_of_day, steps").order("created_at"),
      supabase.from("routine_checks").select("routine_id, done_steps").eq("date", today()),
    ]);
    setRoutines((r || []) as any);
    setChecks(Object.fromEntries((c || []).map((x: any) => [x.routine_id, x.done_steps])));
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const create = async (n: string, t: string, steps: RoutineStep[] = []) => {
    if (!user || !n.trim()) return;
    const { error } = await supabase.from("routines").insert({ user_id: user.id, name: n.trim(), time_of_day: t, steps: steps as any });
    if (error) return toast.error(error.message);
    setName(""); load();
  };

  const saveSteps = async (r: Routine, steps: RoutineStep[]) => {
    setRoutines((all) => all.map((x) => (x.id === r.id ? { ...x, steps } : x)));
    const { error } = await supabase.from("routines").update({ steps: steps as any }).eq("id", r.id);
    if (error) { toast.error(error.message); load(); }
  };

  const toggle = async (r: Routine, stepId: string) => {
    if (!user) return;
    const cur = checks[r.id] || [];
    const next = cur.includes(stepId) ? cur.filter((s) => s !== stepId) : [...cur, stepId];
    setChecks((c) => ({ ...c, [r.id]: next }));
    const { error } = await supabase.from("routine_checks").upsert({ user_id: user.id, routine_id: r.id, date: today(), done_steps: next }, { onConflict: "routine_id,date" });
    if (error) { toast.error(error.message); load(); return; }
    if (next.length === r.steps.length && r.steps.length > 0 && !cur.includes(stepId)) toast.success(`${r.name} complete!`);
  };

  const remove = async () => {
    if (!toDelete) return;
    await supabase.from("routines").delete().eq("id", toDelete.id);
    setToDelete(null); load();
  };

  const addPack = async (t: Template) => {
    if (!user) return;
    await create(t.name, t.time, t.steps.map(newStep));
    const { data: existing } = await supabase.from("habits").select("name");
    const have = new Set((existing || []).map((h: any) => h.name.toLowerCase()));
    const fresh = t.habits.filter((h) => !have.has(h.toLowerCase()));
    if (fresh.length) await supabase.from("habits").insert(fresh.map((h) => ({ user_id: user.id, name: h })));
    toast.success(`${t.name} added${fresh.length ? ` with ${fresh.length} new habit${fresh.length > 1 ? "s" : ""}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-20 p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">Routines</h1>
            <p className="text-sm text-muted-foreground">Step-by-step routines you tick off each day, plus ready-made packs.</p>
          </div>

          <div className="glass-card p-4 sm:p-6">
            <h2 className="font-display font-bold mb-3 flex items-center gap-2"><Package className="w-5 h-5 text-primary" />Ready-made packs</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEMPLATES.map((t, i) => {
                const st = PACK_STYLES[t.key] || PACK_STYLES.morning;
                const Icon = st.icon;
                return (
                <div key={t.key} className={cn("relative overflow-hidden rounded-2xl border p-4 flex flex-col transition-transform duration-200 hover:-translate-y-1", st.card)}>
                  <div className={cn("absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-40", st.glow)} />
                  <div className="relative flex items-center gap-3 mb-3">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shadow-lg", st.badge)}><Icon className="w-5 h-5 text-background" /></div>
                    <div>
                      <div className="font-display font-bold">{t.name}</div>
                      <div className={cn("text-xs font-semibold", st.text)}>{t.steps.length} steps · {t.time}</div>
                    </div>
                  </div>
                  <ul className="relative space-y-1 mb-3">
                    {t.steps.map((s) => <li key={s} className="text-xs text-muted-foreground flex items-center gap-2"><span className={cn("w-1.5 h-1.5 rounded-full shrink-0", st.badge)} />{s}</li>)}
                  </ul>
                  <div className="relative flex flex-wrap gap-1 mb-3">
                    {t.habits.map((h) => <span key={h} className={cn("text-[10px] px-2 py-0.5 rounded-full border", st.chip)}>{h}</span>)}
                  </div>
                  <Button size="sm" className={cn("relative mt-auto border-0 text-background hover:opacity-90", st.badge)} onClick={() => addPack(t)}><Plus className="w-4 h-4 mr-1" />Add pack</Button>
                </div>
              );})}
              ))}
            </div>
          </div>

          <div className="glass-card p-4 sm:p-6">
            <h2 className="font-display font-bold mb-3">New routine</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="e.g. Morning routine" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create(name, time)} maxLength={80} />
              <div className="flex gap-1">
                {["morning", "evening", "anytime"].map((t) => {
                  const I = TIME_ICON[t];
                  return <Button key={t} size="sm" variant={time === t ? "default" : "outline"} onClick={() => setTime(t)} className="capitalize"><I className="w-4 h-4 mr-1" />{t}</Button>;
                })}
              </div>
              <Button onClick={() => create(name, time)} disabled={!name.trim()}><Plus className="w-4 h-4 mr-1" />Create</Button>
            </div>
          </div>

          {routines.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">No routines yet. Add a pack above or create your own.</p>}

          <div className="grid md:grid-cols-2 gap-4">
            {routines.map((r) => {
              const done = checks[r.id] || [];
              const pct = r.steps.length ? Math.round((done.filter((d) => r.steps.some((s) => s.id === d)).length / r.steps.length) * 100) : 0;
              const I = TIME_ICON[r.time_of_day] || Clock;
              return (
                <div key={r.id} className="glass-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-display font-bold"><I className="w-4 h-4 text-primary" />{r.name}</div>
                    <button onClick={() => setToDelete(r)} className="text-muted-foreground hover:text-destructive" aria-label="Delete routine"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary mb-3 overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
                  <ul className="space-y-1.5 mb-3">
                    {r.steps.map((s) => (
                      <li key={s.id} className="flex items-center gap-2 group">
                        <button onClick={() => toggle(r, s.id)} className={cn("w-5 h-5 rounded-md border flex items-center justify-center shrink-0", done.includes(s.id) ? "bg-primary border-primary text-primary-foreground" : "border-border")}>
                          {done.includes(s.id) && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <span className={cn("text-sm flex-1", done.includes(s.id) && "line-through text-muted-foreground")}>{s.text}</span>
                        <button onClick={() => saveSteps(r, r.steps.filter((x) => x.id !== s.id))} className="opacity-0 group-hover:opacity-100 text-muted-foreground" aria-label="Remove step"><X className="w-3.5 h-3.5" /></button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Input className="h-8 text-sm" placeholder="Add a step" value={stepText[r.id] || ""} onChange={(e) => setStepText({ ...stepText, [r.id]: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter" && stepText[r.id]?.trim()) { saveSteps(r, [...r.steps, newStep(stepText[r.id].trim())]); setStepText({ ...stepText, [r.id]: "" }); } }} />
                    <Button size="sm" variant="secondary" disabled={!stepText[r.id]?.trim()} onClick={() => { saveSteps(r, [...r.steps, newStep(stepText[r.id].trim())]); setStepText({ ...stepText, [r.id]: "" }); }}><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete "{toDelete?.name}"?</AlertDialogTitle><AlertDialogDescription>This removes the routine and its history. Your habits stay.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Keep it</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Routines;
