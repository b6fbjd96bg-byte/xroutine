import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DailyJournal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [entryId, setEntryId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const hasChanges = content !== savedContent;

  const fetchEntry = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    if (data) {
      setContent(data.content);
      setSavedContent(data.content);
      setEntryId(data.id);
    }
  }, [user, today]);

  useEffect(() => { fetchEntry(); }, [fetchEntry]);

  const saveEntry = async () => {
    if (!user) return;
    setSaving(true);

    if (entryId) {
      await supabase.from("journal_entries").update({ content }).eq("id", entryId);
    } else {
      const { data } = await supabase
        .from("journal_entries")
        .insert({ user_id: user.id, content, date: today })
        .select()
        .single();
      if (data) setEntryId(data.id);
    }

    setSavedContent(content);
    setSaving(false);
    toast({ title: "📝 Saved!", description: "Journal entry updated" });
  };

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-sm">Daily Journal</h3>
        </div>
        <Button
          size="sm"
          variant={hasChanges ? "default" : "ghost"}
          onClick={saveEntry}
          disabled={!hasChanges || saving}
          className="h-7 text-xs px-3"
        >
          <Save className="w-3 h-3 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind today? Wins, reflections, blockers..."
        className="min-h-[100px] text-sm bg-secondary/30 border-border/50 resize-none"
      />
      {savedContent && !hasChanges && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground mt-2"
        >
          ✅ Saved for today
        </motion.p>
      )}
    </div>
  );
};

export default DailyJournal;
