import { useEffect, useState } from "react";
import { Sparkles, BookOpen, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Article = { id: string; title: string; summary: string | null; body: string; category: string; created_at: string };
type Lesson = { title: string; body: string; date: string };

const Learn = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [open, setOpen] = useState<Article | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonErr, setLessonErr] = useState("");
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [cat, setCat] = useState("All");

  const loadLesson = async () => {
    setLoadingLesson(true); setLessonErr("");
    const { data, error } = await supabase.functions.invoke("daily-lesson", { body: {} });
    if (error || data?.error) {
      let msg = data?.error;
      try { msg = msg || (await (error as any)?.context?.json())?.error; } catch { /* ignore */ }
      setLessonErr(msg || "Couldn't load today's lesson.");
    } else setLesson(data);
    setLoadingLesson(false);
  };

  useEffect(() => {
    supabase.from("articles").select("id, title, summary, body, category, created_at").eq("published", true).order("created_at", { ascending: false }).then(({ data }) => setArticles((data || []) as any));
    loadLesson();
  }, []);

  const cats = ["All", ...Array.from(new Set(articles.map((a) => a.category)))];
  const shown = cat === "All" ? articles : articles.filter((a) => a.category === cat);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-20 p-4 pt-20 md:pt-10 sm:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {open ? (
            <article className="glass-card p-5 sm:p-8">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setOpen(null)}><ArrowLeft className="w-4 h-4 mr-1" />All guides</Button>
              <div className="text-xs text-primary font-semibold mb-1">{open.category}</div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display mb-4">{open.title}</h1>
              <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-foreground/90">{open.body}</div>
            </article>
          ) : (
            <>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display">Learn</h1>
                <p className="text-sm text-muted-foreground">A fresh AI lesson every day, plus guides on building habits that last.</p>
              </div>

              <div className="glass-card p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"><Sparkles className="w-4 h-4" />Today's lesson for you</div>
                    {lessonErr && <Button size="sm" variant="ghost" onClick={loadLesson}><RefreshCw className="w-4 h-4" /></Button>}
                  </div>
                  {loadingLesson ? <div className="flex items-center gap-2 text-sm text-muted-foreground py-6"><Loader2 className="w-4 h-4 animate-spin" />Writing today's lesson…</div>
                    : lessonErr ? <p className="text-sm text-muted-foreground">{lessonErr}</p>
                    : lesson && <>
                      <h2 className="text-xl font-bold font-display mb-2">{lesson.title}</h2>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{lesson.body}</div>
                    </>}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <BookOpen className="w-5 h-5 text-primary" /><h2 className="font-display font-bold mr-2">Guides</h2>
                  {cats.length > 2 && cats.map((c) => <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} className="h-7" onClick={() => setCat(c)}>{c}</Button>)}
                </div>
                {shown.length === 0 ? <p className="text-sm text-muted-foreground">New guides are coming soon.</p> : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {shown.map((a) => (
                      <button key={a.id} onClick={() => setOpen(a)} className="glass-card p-4 text-left hover:border-primary/40 transition-colors">
                        <div className="text-xs text-primary font-semibold">{a.category}</div>
                        <div className="font-semibold mt-0.5">{a.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.summary || a.body.slice(0, 140)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Learn;
