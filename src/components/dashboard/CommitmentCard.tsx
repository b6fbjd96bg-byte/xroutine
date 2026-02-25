import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Share2, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CommitmentCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commitment, setCommitment] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_commitments")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setCommitment(data.commitment_text);
        setLoaded(true);
      });
  }, [user]);

  const save = async () => {
    if (!user || !draft.trim()) return;

    // Deactivate old commitments
    await supabase
      .from("user_commitments")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Insert new
    await supabase.from("user_commitments").insert({
      user_id: user.id,
      commitment_text: draft.trim(),
    });

    setCommitment(draft.trim());
    setEditing(false);
    toast({ title: "Commitment saved! 🎯", description: "You've made a promise to yourself." });
  };

  const handleShare = async () => {
    const text = `🎯 My Commitment: "${commitment}"\n\nHolding myself accountable with Superoutine!`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Share your commitment with others!" });
    }
  };

  if (!loaded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-sm">My Commitment</h3>
        </div>
        {commitment && !editing && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => { setDraft(commitment); setEditing(true); }} className="text-xs">
              <Pencil className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-xs">
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {editing || !commitment ? (
        <div className="flex gap-2">
          <Input
            placeholder="I will meditate every day for 30 days..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="text-sm bg-secondary/50"
            autoFocus
          />
          <Button size="sm" onClick={save} disabled={!draft.trim()}>
            <Check className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-foreground/90 italic">"{commitment}"</p>
      )}
    </motion.div>
  );
};

export default CommitmentCard;
