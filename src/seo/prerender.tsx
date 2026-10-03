// Build-time only: rendered by the prerender plugin in vite.config.ts.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { PRERENDER_ROUTES } from "./routes";

const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), clear: () => m.clear(), key: () => null, length: 0 }; };
const g = globalThis as Record<string, unknown>;
g.localStorage ??= mem();
g.sessionStorage ??= mem();

export const ROUTES = PRERENDER_ROUTES;

export async function render(url: string) {
  const { MarketingRoutes } = await import("./MarketingRoutes");
  const ctx: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <HelmetProvider context={ctx}>
      <StaticRouter location={url}>
        <MarketingRoutes />
      </StaticRouter>
    </HelmetProvider>,
  );
  const h = ctx.helmet;
  const head = h ? [h.title, h.priority, h.meta, h.link, h.script].map((x) => x.toString()).join("") : "";
  return { html, head };
}
