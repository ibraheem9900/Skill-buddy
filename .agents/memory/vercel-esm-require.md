---
name: Vercel ESM createRequire fix
description: Why the esbuild SSR bundle returns 500 on Vercel Node.js 20 but works fine in Bun
---

## The Rule
After esbuild bundles `dist/server/server.js` into `ssr-bundle.mjs` with `--format=esm`, prepend a `createRequire` polyfill to the output file before deploying to Vercel.

```js
const requirePolyfill =
  `import { createRequire } from "node:module";\n` +
  `const require = createRequire(import.meta.url);\n\n`;
writeFileSync(bundlePath, requirePolyfill + readFileSync(bundlePath, "utf-8"));
```

**Why:** Node.js 20 ESM does NOT define `require` in scope. Bun silently polyfills it. The esbuild bundle includes CJS dependencies whose interop shim checks `typeof require !== "undefined"` — true in Bun, false in Node 20, causing those modules to throw "Dynamic require of X is not supported" at runtime, which the h3 server catches and returns as a 500.

**How to apply:** Any time `scripts/build-vercel.mjs` is updated or the esbuild step changes, confirm this polyfill is still prepended. The fix lives in the post-esbuild file-prepend step in `scripts/build-vercel.mjs`.

## Other fixes in the same file
- Use `node_modules/.bin/vite build` (not bare `vite build`) — Vercel's build PATH may not include node_modules/.bin when the script is called as `node script.mjs`
- Read request body into a Buffer before passing to `new Request()` — `body: req, duplex: "half"` is Bun-only; Node.js 20 requires a real ReadableStream or Buffer
- `shouldAddHelpers: false` in `.vc-config.json` — Vercel helpers can interfere with the custom adapter
