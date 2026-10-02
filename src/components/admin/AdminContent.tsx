import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil, Send } from "lucide-react";
import { toast } from "sonner";

type Article = { id: string; title: string; summary: string | null; body: string; category: string; published: boolean; created_at: string };
const empty = { title: "", summary: "", body: "", category: "Habits", published: true };

export const AdminContent = () => {
  const [list, setList] = useState<Article[]>([]);
  const [form, setForm] = useState<typeof empty>(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    setList((data || []) as any);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (form.title.trim().length < 2 || !form.body.trim()) return toast.error("Add a title and the guide text.");
    const row = { ...form, title: form.title.trim(), summary: form.summary.trim() || null, category: form.category.trim() || "Habits" };
    const { error } = editing ? await supabase.from("articles").update(row).eq("id", editing) : await supabase.from("articles").insert(row);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Guide updated" : "Guide published");
    setForm(empty); setEditing(null); load();
  };

  const remove = async (a: Article) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    await supabase.from("articles").delete().eq("id", a.id); load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">{editing ? "Edit guide" : "Write a guide"}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={160} />
          <div className="flex gap-2">
            <Input placeholder="Category (e.g. Sleep)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <label className="flex items-center gap-2 text-sm shrink-0"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />Published</label>
          </div>
          <Input placeholder="Short summary (optional)" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <Textarea placeholder="Guide text" rows={10} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <div className="flex gap-2">
            <Button onClick={save}>{editing ? "Save changes" : "Publish"}</Button>
            {editing && <Button variant="ghost" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">All guides ({list.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {list.length === 0 && <p className="text-sm text-muted-foreground">No guides yet. Users see an AI lesson every day either way.</p>}
          {list.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
              <div className="min-w-0"><div className="text-sm font-semibold truncate">{a.title}</div><div className="text-xs text-muted-foreground">{a.category} · {a.published ? "Published" : "Draft"}</div></div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(a.id); setForm({ title: a.title, summary: a.summary || "", body: a.body, category: a.category, published: a.published }); }}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(a)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

type Sent = { id: string; title: string; body: string | null; created_at: string };

export const AdminNotifications = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState<Sent[]>([]);
  const load = useCallback(async () => {
    const { data } = await supabase.from("notifications").select("id, title, body, created_at").is("user_id", null).order("created_at", { ascending: false }).limit(50);
    setSent((data || []) as any);
  }, []);
  useEffect(() => { load(); }, [load]);

  const send = async () => {
    if (!title.trim()) return toast.error("Add a title");
    const { error } = await supabase.from("notifications").insert({ user_id: null, kind: "info", title: title.trim(), body: body.trim() || null });
    if (error) return toast.error(error.message);
    toast.success("Sent to every user's inbox");
    setTitle(""); setBody(""); load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Message all users</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} />
          <Textarea placeholder="Message (optional)" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={send}><Send className="w-4 h-4 mr-1" />Send to everyone</Button>
          <p className="text-xs text-muted-foreground">Users also get automatic messages when their payment goes through, when a friend joins with their link and when they earn referral money.</p>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Sent messages</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sent.length === 0 && <p className="text-sm text-muted-foreground">Nothing sent yet.</p>}
          {sent.map((n) => (
            <div key={n.id} className="flex items-start justify-between gap-2 border-b border-border/40 pb-2">
              <div className="min-w-0"><div className="text-sm font-semibold">{n.title}</div>{n.body && <div className="text-xs text-muted-foreground line-clamp-2">{n.body}</div>}<div className="text-[11px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div></div>
              <Button size="icon" variant="ghost" onClick={async () => { await supabase.from("notifications").delete().eq("id", n.id); load(); }}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
