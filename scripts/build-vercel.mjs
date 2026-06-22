/**
 * Vercel Build Output API v3 generator for SkillBuddy.
 *
 * Flow:
 *  1. Run `vite build`  →  dist/client/ (static)  +  dist/server/ (SSR fetch handler)
 *  2. Copy dist/client/ → .vercel/output/static/
 *  3. Copy dist/server/ → .vercel/output/functions/ssr.func/
 *  4. Write a Node.js adapter that wraps the Web Fetch API handler
 *  5. Write .vc-config.json (Node.js 20 runtime)
 *  6. Write routing config.json (filesystem first, then SSR for everything else)
 *
 * Vercel automatically detects .vercel/output/ after the build command runs.
 * No outputDirectory in vercel.json is needed.
 */

import { cpSync, mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { execSync } from "child_process";

const VERCEL_OUT = ".vercel/output";
const FUNC_DIR = `${VERCEL_OUT}/functions/ssr.func`;

// ── 0. Clean ────────────────────────────────────────────────────────────────
if (existsSync(VERCEL_OUT)) {
  rmSync(VERCEL_OUT, { recursive: true });
  console.log("🗑  Cleaned .vercel/output");
}

// ── 1. Build ─────────────────────────────────────────────────────────────────
console.log("\n📦 Running vite build...\n");
execSync("vite build", { stdio: "inherit" });

// ── 2. Create directory structure ───────────────────────────────────────────
mkdirSync(`${VERCEL_OUT}/static`, { recursive: true });
mkdirSync(FUNC_DIR, { recursive: true });
console.log("\n📁 Created .vercel/output structure");

// ── 3. Static assets ─────────────────────────────────────────────────────────
cpSync("dist/client", `${VERCEL_OUT}/static`, { recursive: true });
console.log("✓  Copied dist/client → .vercel/output/static");

// ── 4. SSR server bundle ─────────────────────────────────────────────────────
cpSync("dist/server", FUNC_DIR, { recursive: true });
console.log("✓  Copied dist/server → ssr.func/");

// ── 5. Node.js adapter entry ─────────────────────────────────────────────────
//
// dist/server/server.js exports:
//   export default { async fetch(request, env, ctx) { … } }
//
// Vercel Node.js functions receive (req, res) — this adapter bridges the gap.
//
writeFileSync(
  `${FUNC_DIR}/index.mjs`,
  `import server from "./server.js";

export default async function handler(req, res) {
  const proto = (req.headers["x-forwarded-proto"] ?? "https").split(",")[0].trim();
  const host  = req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";
  const url   = new URL(req.url, \`\${proto}://\${host}\`);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v == null) continue;
    if (Array.isArray(v)) v.forEach((vi) => headers.append(k, vi));
    else headers.set(k, v);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const webReq  = new Request(url.toString(), {
    method:  req.method,
    headers,
    body:    hasBody ? req : null,
    duplex:  hasBody ? "half" : undefined,
  });

  let webRes;
  try {
    webRes = await server.fetch(webReq);
  } catch (err) {
    console.error("[ssr] fetch error:", err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("Internal Server Error");
    return;
  }

  res.statusCode = webRes.status;
  webRes.headers.forEach((v, k) => res.setHeader(k, v));
  const buf = Buffer.from(await webRes.arrayBuffer());
  res.end(buf);
}
`
);
console.log("✓  Written ssr.func/index.mjs (Node.js adapter)");

// Mark function dir as ESM so Node 20 resolves .js imports correctly
writeFileSync(`${FUNC_DIR}/package.json`, JSON.stringify({ type: "module" }));

// ── 6. Function config (.vc-config.json) ─────────────────────────────────────
writeFileSync(
  `${FUNC_DIR}/.vc-config.json`,
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      shouldAddHelpers: true,
    },
    null,
    2
  )
);
console.log("✓  Written ssr.func/.vc-config.json");

// ── 7. Vercel routing (config.json) ──────────────────────────────────────────
//
// Order matters:
//  a) Serve static files from .vercel/output/static/ (handle: filesystem)
//  b) Route everything else to the SSR serverless function
//
writeFileSync(
  `${VERCEL_OUT}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Let Vercel serve any file that exists in static/ directly
        { handle: "filesystem" },
        // Fallback: all other requests → SSR function
        { src: "/(.*)", dest: "/ssr" },
      ],
    },
    null,
    2
  )
);
console.log("✓  Written .vercel/output/config.json");

console.log("\n✅ Vercel Build Output ready at .vercel/output/\n");
