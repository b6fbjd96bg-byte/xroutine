import { defineConfig, type Plugin } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const SITE = "https://superoutine.in";

// Renders public marketing routes to static HTML after the client build,
// and writes sitemap.xml. Private routes stay client-only.
function prerender(): Plugin {
  let outDir = "dist";
  return {
    name: "superoutine-prerender",
    apply: "build",
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); },
    async closeBundle() {
      if (process.env.SKIP_PRERENDER) return;
      const { createServer } = await import("vite");
      const server = await createServer({
        configFile: false,
        mode: "production",
        root: __dirname,
        logLevel: "error",
        appType: "custom",
        server: { middlewareMode: true, hmr: false, watch: null },
        resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
        plugins: [react()],
        optimizeDeps: { noDiscovery: true, include: [] },
        ssr: { noExternal: ["react-helmet-async"] },
      });
      try {
        const mod = await server.ssrLoadModule("/src/seo/prerender.tsx");
        const tpl = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
        const stripped = tpl
          .replace(/<title>[\s\S]*?<\/title>/, "")
          .replace(/<meta\s+(name="description"|property="og:[^"]*"|name="twitter:[^"]*")[^>]*>\s*/g, "")
          .replace(/<link rel="canonical"[^>]*>\s*/g, "");
        let ok = 0;
        for (const url of mod.ROUTES as string[]) {
          try {
            const { html, head } = await mod.render(url);
            const out = stripped
              .replace("</head>", `${head}</head>`)
              .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
            const file = url === "/" ? path.join(outDir, "index.html") : path.join(outDir, url.slice(1), "index.html");
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, out);
            if (url !== "/") fs.writeFileSync(path.join(outDir, `${url.slice(1)}.html`), out);
            ok++;
          } catch (e) {
            console.error(`[prerender] ${url} failed:`, e);
          }
        }
        const today = new Date().toISOString().slice(0, 10);
        const urls = (mod.ROUTES as string[]).map((u) => `  <url><loc>${SITE}${u === "/" ? "/" : u}</loc><lastmod>${today}</lastmod></url>`).join("\n");
        fs.writeFileSync(path.join(outDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
        console.log(`[prerender] ${ok}/${mod.ROUTES.length} routes rendered`);
      } catch (e) {
        console.error("[prerender] skipped:", e);
      } finally {
        await server.close();
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), prerender()].filter(Boolean),
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          charts: ["recharts"],
          supabase: ["@supabase/supabase-js"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
