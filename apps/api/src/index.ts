import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "@fastify/cors";
import Fastify from "fastify";

import { renderVideoToFile } from "./render-video.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const OUT_DIR = path.join(root, "out");
const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? "0.0.0.0";

const safeFileName = (name: string | undefined): string | null => {
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return null;
  }
  return name;
};

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

app.get("/health", async () => ({ ok: true }));

app.get<{ Querystring: { name?: string } }>("/api/render/file", async (request, reply) => {
  const fileName = safeFileName(request.query.name);
  if (!fileName) {
    return reply.code(400).send({ error: "Invalid file name" });
  }

  const filePath = path.join(OUT_DIR, fileName);

  try {
    const fileStat = await stat(filePath);
    reply.header("Content-Type", "video/mp4");
    reply.header("Content-Length", String(fileStat.size));
    reply.header("Content-Disposition", `attachment; filename="${fileName}"`);
    return reply.send(createReadStream(filePath));
  } catch {
    return reply.code(404).send({ error: "Render file not found" });
  }
});

app.post("/api/render", async (request, reply) => {
  const timeline = request.body as {
    VideoTrack?: unknown[];
  };

  if (!Array.isArray(timeline?.VideoTrack) || timeline.VideoTrack.length === 0) {
    return reply.code(400).send({ error: "Add at least one scene before rendering." });
  }

  reply.raw.writeHead(200, {
    "Content-Type": "application/x-ndjson",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const writeNdjson = (data: unknown) => {
    reply.raw.write(`${JSON.stringify(data)}\n`);
  };

  try {
    const result = await renderVideoToFile(timeline, (event) => {
      writeNdjson(event);
    });

    writeNdjson({
      type: "complete",
      fileName: result.fileName,
      relativePath: result.relativePath,
      downloadUrl: `/api/render/file?name=${encodeURIComponent(result.fileName)}`,
    });
    reply.raw.end();
  } catch (err) {
    if (!reply.raw.headersSent) {
      const message = err instanceof Error ? err.message : "Render failed";
      return reply.code(500).send({ error: message });
    }

    writeNdjson({
      type: "error",
      message: err instanceof Error ? err.message : "Render failed",
    });
    reply.raw.end();
  }
});

try {
  await app.listen({ port: PORT, host: HOST });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
