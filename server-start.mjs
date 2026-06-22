import { createServer } from "node:http";

const PORT = process.env.PORT ?? 5000;

async function startServer() {
  const serverModule = await import("./dist/server/server.js");
  const app = serverModule.default ?? serverModule;

  const httpServer = createServer(async (req, res) => {
    const proto = (req.headers["x-forwarded-proto"] ?? "http")
      .split(",")[0]
      .trim();
    const host =
      req.headers["x-forwarded-host"] ??
      req.headers.host ??
      `localhost:${PORT}`;

    const url = new URL(req.url, `${proto}://${host}`);

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v == null) continue;
      if (Array.isArray(v)) v.forEach((vi) => headers.append(k, vi));
      else headers.set(k, v);
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    let bodyBuf;
    if (hasBody) {
      bodyBuf = await new Promise((resolve) => {
        const chunks = [];
        req.on("data", (c) => chunks.push(c));
        req.on("end", () => resolve(Buffer.concat(chunks)));
      });
    }

    const webReq = new Request(url.toString(), {
      method: req.method,
      headers,
      ...(bodyBuf && bodyBuf.length > 0 ? { body: bodyBuf } : {}),
    });

    try {
      const webRes = await app.fetch(webReq);
      res.statusCode = webRes.status;
      webRes.headers.forEach((v, k) => res.setHeader(k, v));
      const buf = Buffer.from(await webRes.arrayBuffer());
      res.end(buf);
    } catch (err) {
      console.error("[server] unhandled error:", err);
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain");
      res.end("Internal Server Error");
    }
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillBuddy server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
