import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, Circle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
}

const DailyPlanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchTodos = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTodos(data.map(t => ({ id: t.id, title: t.title, completed: t.completed, priority: t.priority })));
    }
    setLoading(false);
  }, [user, today]);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const addTodo = async () => {
    if (!newTask.trim() || !user) return;
    const { data, error } = await supabase
      .from("todos")
      .insert({ user_id: user.id, title: newTask.trim(), date: today })
      .select()
      .single();

    if (!error && data) {
      setTodos(prev => [...prev, { id: data.id, title: data.title, completed: data.completed, priority: data.priority }]);
      setNewTask("");
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const newCompleted = !todo.completed;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
    await supabase.from("todos").update({ completed: newCompleted }).eq("id", id);
  };

  const deleteTodo = async (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    await supabase.from("todos").delete().eq("id", id);
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-sm">📝 Daily Planner</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedCount}/{todos.length} tasks done
          </p>
        </div>
        {todos.length > 0 && (
          <div className="h-2 w-20 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <Input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          placeholder="Add a task..."
          className="h-8 text-sm bg-secondary/50 border-border/50"
        />
        <Button size="sm" onClick={addTodo} disabled={!newTask.trim()} className="h-8 px-2">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {todos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2 group py-1"
            >
              <button onClick={() => toggleTodo(todo.id)} className="shrink-0">
                {todo.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
              <span className={`text-sm flex-1 truncate ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {!loading && todos.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default DailyPlanner;
