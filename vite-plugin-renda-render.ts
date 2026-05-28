import type { Plugin } from "vite";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

import { renderVideoToFile } from "./server/render-video";

const OUT_DIR = path.join(process.cwd(), "out");

const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });

const sendJson = (res: ServerResponse, status: number, data: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

const writeNdjson = (res: ServerResponse, data: unknown) => {
  res.write(`${JSON.stringify(data)}\n`);
};

const safeFileName = (name: string | null): string | null => {
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return null;
  }
  return name;
};

export const rendaRenderPlugin = (): Plugin => ({
  name: "renda-render-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url ?? "/", "http://localhost");

      if (url.pathname === "/api/render/file" && req.method === "GET") {
        const fileName = safeFileName(url.searchParams.get("name"));
        if (!fileName) {
          sendJson(res, 400, { error: "Invalid file name" });
          return;
        }

        const filePath = path.join(OUT_DIR, fileName);
        try {
          const fileStat = await stat(filePath);
          res.statusCode = 200;
          res.setHeader("Content-Type", "video/mp4");
          res.setHeader("Content-Length", String(fileStat.size));
          res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
          createReadStream(filePath).pipe(res);
        } catch {
          sendJson(res, 404, { error: "Render file not found" });
        }
        return;
      }

      if (url.pathname !== "/api/render" || req.method !== "POST") {
        next();
        return;
      }

      try {
        const raw = await readBody(req);
        const timeline = JSON.parse(raw);

        if (!Array.isArray(timeline?.VideoTrack) || timeline.VideoTrack.length === 0) {
          sendJson(res, 400, { error: "Add at least one scene before rendering." });
          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/x-ndjson");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const result = await renderVideoToFile(timeline, (event) => {
          writeNdjson(res, event);
        });

        writeNdjson(res, {
          type: "complete",
          fileName: result.fileName,
          relativePath: result.relativePath,
          downloadUrl: `/api/render/file?name=${encodeURIComponent(result.fileName)}`,
        });
        res.end();
      } catch (err) {
        if (!res.headersSent) {
          const message = err instanceof Error ? err.message : "Render failed";
          sendJson(res, 500, { error: message });
          return;
        }

        writeNdjson(res, {
          type: "error",
          message: err instanceof Error ? err.message : "Render failed",
        });
        res.end();
      }
    });
  },
});
