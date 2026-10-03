import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import Seo, { SITE_URL, faqLd, softwareAppLd, type Crumb } from "@/seo/Seo";
import type { ContentPageData } from "@/content/types";

const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export const MarketingShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-28 pb-16 px-4">{children}</main>
    <Footer />
  </div>
);

export const Breadcrumbs = ({ crumbs }: { crumbs: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6">
    <ol className="flex flex-wrap items-center gap-1">
      <li><Link to="/" className="hover:text-foreground">Home</Link></li>
      {crumbs.map((c, i) => (
        <li key={c.path} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3" />
          {i === crumbs.length - 1 ? <span aria-current="page" className="text-foreground">{c.name}</span> : <Link to={c.path} className="hover:text-foreground">{c.name}</Link>}
        </li>
      ))}
    </ol>
  </nav>
);

const ContentPage = ({ page, parent }: { page: ContentPageData; parent?: Crumb }) => {
  const crumbs: Crumb[] = [...(parent ? [parent] : []), { name: page.crumb, path: page.path }];
  const ld: object[] = [];
  if (page.software) ld.push(softwareAppLd);
  if (page.faq?.length) ld.push(faqLd(page.faq.map((f) => ({ q: f.q, a: f.more ? `${f.a} ${f.more}` : f.a }))));
  if (page.article) {
    ld.push({
      "@context": "https://schema.org", "@type": "Article", headline: page.h1, description: page.description,
      author: { "@type": "Person", name: page.article.author }, publisher: { "@type": "Organization", name: "Superoutine", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
      datePublished: page.article.published, dateModified: page.article.updated, mainEntityOfPage: `${SITE_URL}${page.path}`, image: `${SITE_URL}/og-image.png`,
    });
  }

  return (
    <MarketingShell>
      <Seo title={page.title} description={page.description} path={page.path} type={page.article ? "article" : "website"} crumbs={crumbs} jsonLd={ld} />
      <article className="max-w-3xl mx-auto">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="text-3xl sm:text-5xl font-bold font-display mb-4 leading-tight">{page.h1}</h1>
        {page.article && (
          <p className="text-sm text-muted-foreground mb-4">
            By {page.article.author} · Published <time dateTime={page.article.published}>{fmt(page.article.published)}</time> · Last updated <time dateTime={page.article.updated}>{fmt(page.article.updated)}</time>
          </p>
        )}
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">{page.intro}</p>

        {page.sections.map((s) => (
          <section key={s.h2} className="mb-10">
            <h2 className="text-2xl font-bold font-display mb-3">{s.h2}</h2>
            <p className="text-foreground leading-relaxed mb-3 font-medium">{s.answer}</p>
            {s.body?.map((b, i) => <p key={i} className="text-muted-foreground leading-relaxed mb-3">{b}</p>)}
            {s.bullets && (
              <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground mb-3">
                {s.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
            {s.table && (
              <div className="overflow-x-auto glass-card my-4">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border/50">{s.table.head.map((h, i) => <th key={i} scope="col" className="text-left p-3 font-semibold font-display">{h}</th>)}</tr></thead>
                  <tbody>{s.table.rows.map((r, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0">{r.map((c, j) => j === 0 ? <th key={j} scope="row" className="text-left p-3 font-medium">{c}</th> : <td key={j} className="p-3 text-muted-foreground">{c}</td>)}</tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {s.subs?.map((x) => (
              <div key={x.h3} className="mt-4">
                <h3 className="text-lg font-semibold font-display mb-1">{x.h3}</h3>
                <p className="text-muted-foreground leading-relaxed">{x.body}</p>
              </div>
            ))}
          </section>
        ))}

        {page.faq && page.faq.length > 0 && (
          <section className="mb-10">
            {page.sections.length > 0 && <h2 className="text-2xl font-bold font-display mb-4">Frequently asked questions</h2>}
            <div className="space-y-5">
              {page.faq.map((f) => (
                <div key={f.q} className="glass-card p-5">
                  {page.sections.length > 0 ? <h3 className="font-semibold font-display mb-1">{f.q}</h3> : <h2 className="text-lg font-semibold font-display mb-1">{f.q}</h2>}
                  <p className="text-foreground leading-relaxed">{f.a}</p>
                  {f.more && <p className="text-muted-foreground leading-relaxed mt-1">{f.more}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="glass-card p-6 text-center mb-10">
          <p className="font-display font-semibold text-lg mb-1">Try Superoutine free for 15 days</p>
          <p className="text-sm text-muted-foreground mb-4">Every feature included. Then $4.99/month, $39/year or $79 lifetime.</p>
          <Link to="/signup"><Button>Start free trial</Button></Link>
        </div>

        {page.related && (
          <nav aria-label="Related pages">
            <h2 className="text-lg font-semibold font-display mb-3">Related</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {page.related.map((r) => (
                <li key={r.to}><Link to={r.to} className="block glass-card p-3 text-sm text-primary hover:underline">{r.label}</Link></li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </MarketingShell>
  );
};

export default ContentPage;
