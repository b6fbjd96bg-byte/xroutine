import { COMPARE } from "@/content/compare";
import { USE_CASES } from "@/content/useCases";
import { POSTS } from "@/content/blog";

/** Public routes rendered to static HTML at build time. */
export const PRERENDER_ROUTES = [
  "/", "/pricing", "/features", "/ai-coach", "/about", "/faq", "/blog",
  ...Object.values(POSTS).map((p) => p.path),
  ...Object.values(COMPARE).map((p) => p.path),
  ...Object.values(USE_CASES).map((p) => p.path),
  "/privacy", "/terms", "/refunds", "/shipping", "/contact", "/earn",
];
