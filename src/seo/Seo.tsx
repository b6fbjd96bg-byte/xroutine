import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://superoutine.in";
export const SITE_NAME = "Superoutine";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export type Crumb = { name: string; path: string };

type Props = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  crumbs?: Crumb[];
  jsonLd?: object[];
};

/** Per-page head tags. Rendered into static HTML at build time and managed client-side. */
const Seo = ({ title, description, path, type = "website", noindex, crumbs, jsonLd = [] }: Props) => {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const breadcrumb = crumbs && crumbs.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
          "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.path}`,
        })),
      }
    : null;
  const blocks = breadcrumb ? [...jsonLd, breadcrumb] : jsonLd;

  // Drop the static fallback tags from index.html so the page has a single set.
  useEffect(() => {
    document.head
      .querySelectorAll('meta[name="description"]:not([data-rh]),meta[property^="og:"]:not([data-rh]),meta[name^="twitter:"]:not([data-rh]),link[rel="canonical"]:not([data-rh])')
      .forEach((n) => n.remove());
  }, []);

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <link rel="canonical" href={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  );
};

export const NoIndex = () => (
  <Helmet>
    <meta name="robots" content="noindex, nofollow" />
  </Helmet>
);

export const softwareAppLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Superoutine",
  alternateName: "Super Routine",
  url: `${SITE_URL}/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description: "AI habit tracker and routine planner with XP levels, streaks, an AI coach and analytics. 15-day free trial with every feature.",
  offers: [
    { "@type": "Offer", name: "Monthly", price: "4.99", priceCurrency: "USD", description: "15-day free trial, then $4.99 per month" },
    { "@type": "Offer", name: "Yearly", price: "39", priceCurrency: "USD", description: "15-day free trial, then $39 per year" },
    { "@type": "Offer", name: "Lifetime", price: "79", priceCurrency: "USD", description: "One-time payment, limited to the first 100 buyers" },
  ],
};

export const faqLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export default Seo;
