import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";
import { useEffect } from "react";
import Seo from "@/seo/Seo";

export type LegalSection = { heading: string; body: string[] };

const LegalPage = ({ title, updated, sections, path, description }: { title: string; updated: string; sections: LegalSection[]; path: string; description: string }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-background">
      <Seo title={`${title} | Superoutine`} description={description} path={path} crumbs={[{ name: title, path }]} />
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-20">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-bold font-display mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {updated}</p>
        <div className="glass-card p-6 sm:p-8 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold font-display mb-3 text-primary">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-2">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalPage;
