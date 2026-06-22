/**
 * Vercel Build Output API v3 for SkillBuddy.
 *
 * Problem solved here:
 *   dist/server/server.js uses dynamic import("./assets/server-*.js")
 *   which fails in Vercel's function environment because Vercel tries to
 *   bundle/trace the function and the dynamic import with a hashed path
 *   confuses the bundler.
 *
 * Solution:
 *   Use esbuild to pre-bundle EVERYTHING into one self-contained
 *   ssr-bundle.mjs with zero dynamic imports, then wrap it in a tiny
 *   Node.js (req, res) adapter.
 *
 * Output:
 *   .vercel/output/
 *     config.json                   ← routing: filesystem then /ssr
 *     static/                       ← dist/client contents (assets, images)
 *     functions/
 *       ssr.func/
 *         ssr-bundle.mjs            ← esbuild bundle of entire server
 *         index.mjs                 ← Node.js (req,res) → fetch adapter
 *         package.json              ← { "type": "module" }
 *         .vc-config.json           ← { runtime: "nodejs20.x" }
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

// ── 1. Vite build ────────────────────────────────────────────────────────────
console.log("\n📦 Running vite build...\n");
execSync("vite build", { stdio: "inherit" });

// ── 2. Directory structure ───────────────────────────────────────────────────
mkdirSync(`${VERCEL_OUT}/static`, { recursive: true });
mkdirSync(FUNC_DIR, { recursive: true });
console.log("\n📁 Created .vercel/output structure");

// ── 3. Static assets ─────────────────────────────────────────────────────────
cpSync("dist/client", `${VERCEL_OUT}/static`, { recursive: true });
console.log("✓  Copied dist/client → .vercel/output/static");

// ── 4. Bundle server with esbuild ────────────────────────────────────────────
//
// This step is the critical fix:
//   dist/server/server.js has  import("./assets/server-[hash].js")
//   esbuild resolves ALL local imports statically and merges them into
//   one file — no dynamic imports survive at runtime.
//
// --external:node:*   keeps Node.js built-ins (node:path etc.) as-is
// --platform=node     enables Node.js globals (Buffer, process, etc.)
// --format=esm        outputs ES modules (matches our function's package.json)
// --target=node20     allows top-level await and native ESM
//
console.log("\n⚙️  Bundling SSR server with esbuild...");
execSync(
  [
    "node_modules/.bin/esbuild dist/server/server.js",
    `--bundle`,
    `--outfile=${FUNC_DIR}/ssr-bundle.mjs`,
    `--format=esm`,
    `--target=node20`,
    `--platform=node`,
    `--external:node:*`,
    `--log-level=warning`,
  ].join(" "),
  { stdio: "inherit" }
);
console.log("✓  Bundled → ssr.func/ssr-bundle.mjs");

// ── 5. Node.js adapter ───────────────────────────────────────────────────────
//
// The bundled server exports { fetch(request, env, ctx) }.
// Vercel Node.js functions receive (req, res).
// This adapter bridges the two.
//
writeFileSync(
  `${FUNC_DIR}/index.mjs`,
  `import server from "./ssr-bundle.mjs";

export default async function handler(req, res) {
  const proto = (req.headers["x-forwarded-proto"] ?? "https")
    .split(",")[0]
    .trim();
  const host =
    req.headers["x-forwarded-host"] ??
    req.headers.host ??
    "localhost";
  const url = new URL(req.url, proto + "://" + host);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v == null) continue;
    if (Array.isArray(v)) v.forEach((vi) => headers.append(k, vi));
    else headers.set(k, v);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const webReq = new Request(url.toString(), {
    method: req.method,
    headers,
    ...(hasBody ? { body: req, duplex: "half" } : {}),
  });

  let webRes;
  try {
    webRes = await server.fetch(webReq);
  } catch (err) {
    console.error("[ssr] unhandled error:", err);
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

// ── 6. ESM marker ────────────────────────────────────────────────────────────
writeFileSync(`${FUNC_DIR}/package.json`, JSON.stringify({ type: "module" }));

// ── 7. Vercel function config ─────────────────────────────────────────────────
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

// ── 8. Vercel routing ─────────────────────────────────────────────────────────
writeFileSync(
  `${VERCEL_OUT}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Serve existing static files (JS, CSS, images) directly
        { handle: "filesystem" },
        // All other requests go to SSR
        { src: "/(.*)", dest: "/ssr" },
      ],
    },
    null,
    2
  )
);
console.log("✓  Written .vercel/output/config.json");

console.log("\n✅ Vercel Build Output ready at .vercel/output/\n");
