import { createFileRoute } from "@tanstack/react-router";

const routes = [
  "/", "/services", "/categories", "/explore", "/become-a-provider", "/about", "/contact", "/faq", "/terms", "/privacy", "/auth/login", "/auth/signup",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const base = "";
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
          .map((p) => `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq></url>`)
          .join("\n")}\n</urlset>`;
        return new Response(body, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
