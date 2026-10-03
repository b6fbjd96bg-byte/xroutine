import { Link, useParams } from "react-router-dom";
import ContentPage, { Breadcrumbs, MarketingShell } from "@/components/marketing/ContentPage";
import Seo from "@/seo/Seo";
import { PAGES } from "@/content/pages";
import { COMPARE } from "@/content/compare";
import { USE_CASES } from "@/content/useCases";
import { POSTS } from "@/content/blog";
import NotFound from "@/pages/NotFound";

export const PricingPage = () => <ContentPage page={PAGES.pricing} />;
export const FeaturesPage = () => <ContentPage page={PAGES.features} />;
export const AICoachPage = () => <ContentPage page={PAGES["ai-coach"]} />;
export const AboutPage = () => <ContentPage page={PAGES.about} />;
export const FAQPage = () => <ContentPage page={PAGES.faq} />;

export const ComparePage = () => {
  const { slug = "" } = useParams();
  const p = COMPARE[slug];
  return p ? <ContentPage page={p} /> : <NotFound />;
};
export const UseCasePage = () => {
  const { slug = "" } = useParams();
  const p = USE_CASES[slug];
  return p ? <ContentPage page={p} /> : <NotFound />;
};
export const BlogPostPage = () => {
  const { slug = "" } = useParams();
  const p = POSTS[slug];
  return p ? <ContentPage page={p} parent={{ name: "Blog", path: "/blog" }} /> : <NotFound />;
};

export const BlogIndexPage = () => (
  <MarketingShell>
    <Seo
      title="Superoutine Blog – Habit Building Guides"
      description="Practical guides on building habits, habit stacking and choosing a habit tracker, written by the team behind the Superoutine AI habit tracker."
      path="/blog"
      crumbs={[{ name: "Blog", path: "/blog" }]}
    />
    <div className="max-w-3xl mx-auto">
      <Breadcrumbs crumbs={[{ name: "Blog", path: "/blog" }]} />
      <h1 className="text-3xl sm:text-5xl font-bold font-display mb-4">Superoutine blog</h1>
      <p className="text-lg text-muted-foreground mb-10">Practical guides on building habits that last, from the team behind the Superoutine AI habit tracker.</p>
      <div className="space-y-4">
        {Object.values(POSTS).map((p) => (
          <Link key={p.path} to={p.path} className="block glass-card p-6 hover:border-primary/50 transition-colors">
            <h2 className="text-xl font-bold font-display mb-2">{p.h1}</h2>
            <p className="text-sm text-muted-foreground mb-2">{p.intro}</p>
            <p className="text-xs text-muted-foreground">By {p.article?.author} · <time dateTime={p.article?.published}>{p.article?.published}</time></p>
          </Link>
        ))}
      </div>
    </div>
  </MarketingShell>
);
