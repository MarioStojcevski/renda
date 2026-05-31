import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const remotionBin =
  process.platform === "win32"
    ? path.join(root, "node_modules", ".bin", "remotion.cmd")
    : path.join(root, "node_modules", ".bin", "remotion");

const compositionEntry = path.join(root, "packages/composition/src/index.ts");

export type RenderVideoEvent = {
  type: string;
  message?: string;
  percent?: number;
  phase?: string;
  current?: number;
  total?: number;
  level?: string;
};

export type RenderVideoResult = {
  outputPath: string;
  fileName: string;
  relativePath: string;
};

type ProgressUpdate = Omit<RenderVideoEvent, "type">;

const parseProgressLine = (line: string): ProgressUpdate | null => {
  const bundling = line.match(/Bundling\s+(\d+)%/);
  if (bundling) {
    return {
      phase: "bundling",
      percent: Number(bundling[1]),
      message: `Bundling… ${bundling[1]}%`,
    };
  }

  const rendered = line.match(/Rendered\s+(\d+)\/(\d+)/);
  if (rendered) {
    const current = Number(rendered[1]);
    const total = Number(rendered[2]);
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    return {
      phase: "rendering",
      current,
      total,
      percent,
      message: `Rendering frames… ${current}/${total}`,
    };
  }

  const encoded = line.match(/Encoded\s+(\d+)\/(\d+)/);
  if (encoded) {
    const current = Number(encoded[1]);
    const total = Number(encoded[2]);
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    return {
      phase: "encoding",
      current,
      total,
      percent,
      message: `Encoding video… ${current}/${total}`,
    };
  }

  if (/Stitching|Muxing|Combining/i.test(line)) {
    return { phase: "encoding", message: "Finalizing video…" };
  }

  return null;
};

/**
 * Renders the current timeline to an MP4 under /out using the Remotion CLI.
 * Requires FFmpeg on PATH (bundled with @remotion/renderer on most installs).
 */
export const renderVideoToFile = (
  timeline: unknown,
  onEvent?: (event: RenderVideoEvent) => void
): Promise<RenderVideoResult> => {
  const outDir = path.join(root, "out");
  mkdirSync(outDir, { recursive: true });

  const propsPath = path.join(outDir, ".render-props.json");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = path.join(outDir, `renda-${timestamp}.mp4`);

  writeFileSync(propsPath, JSON.stringify(timeline), "utf8");

  const emit = (event: RenderVideoEvent) => {
    onEvent?.(event);
  };

  emit({ type: "phase", phase: "starting", message: "Starting render…" });

  return new Promise((resolve, reject) => {
    const args = [
      "render",
      compositionEntry,
      "scenes",
      outputPath,
      `--props=${propsPath}`,
    ];

    const child = spawn(remotionBin, args, {
      cwd: path.join(root, "packages/composition"),
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let stderr = "";
    let stdout = "";

    const handleLine = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const progress = parseProgressLine(trimmed);
      if (progress) {
        emit({ type: "progress", ...progress });
        return;
      }

      if (/error|failed|cannot decode|cancelled/i.test(trimmed)) {
        emit({ type: "log", level: "error", message: trimmed });
      }
    };

    const feed = (chunk: Buffer, target: string) => {
      let buffer = target + chunk.toString();
      const lines = buffer.split(/\r?\n/);
      const remainder = lines.pop() ?? "";
      for (const line of lines) {
        handleLine(line);
      }
      return remainder;
    };

    child.stdout?.on("data", (chunk: Buffer) => {
      stdout = feed(chunk, stdout);
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr = feed(chunk, stderr);
    });

    child.on("error", (err) => {
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0 && existsSync(outputPath)) {
        emit({ type: "phase", phase: "done", message: "Render complete" });
        resolve({
          outputPath,
          fileName: path.basename(outputPath),
          relativePath: `out/${path.basename(outputPath)}`,
        });
        return;
      }

      const log = `${stderr}\n${stdout}`.trim();
      const hint = log.includes("blob:")
        ? " Uploaded media (browser-only URLs) cannot be rendered. Use built-in assets or files in public/."
        : log.includes("Cannot decode") || log.includes("404")
          ? " Some images failed to load. Re-save the project or use assets from public/."
          : "";

      reject(
        new Error(
          (log.split("\n").filter(Boolean).slice(-8).join("\n") ||
            `Remotion exited with code ${code}`) + hint
        )
      );
    });
  });
};
