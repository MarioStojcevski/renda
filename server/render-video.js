var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
var root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
var remotionBin = process.platform === "win32"
    ? path.join(root, "node_modules", ".bin", "remotion.cmd")
    : path.join(root, "node_modules", ".bin", "remotion");
var parseProgressLine = function (line) {
    var bundling = line.match(/Bundling\s+(\d+)%/);
    if (bundling) {
        return {
            phase: "bundling",
            percent: Number(bundling[1]),
            message: "Bundling\u2026 ".concat(bundling[1], "%"),
        };
    }
    var rendered = line.match(/Rendered\s+(\d+)\/(\d+)/);
    if (rendered) {
        var current = Number(rendered[1]);
        var total = Number(rendered[2]);
        var percent = total > 0 ? Math.round((current / total) * 100) : 0;
        return {
            phase: "rendering",
            current: current,
            total: total,
            percent: percent,
            message: "Rendering frames\u2026 ".concat(current, "/").concat(total),
        };
    }
    var encoded = line.match(/Encoded\s+(\d+)\/(\d+)/);
    if (encoded) {
        var current = Number(encoded[1]);
        var total = Number(encoded[2]);
        var percent = total > 0 ? Math.round((current / total) * 100) : 0;
        return {
            phase: "encoding",
            current: current,
            total: total,
            percent: percent,
            message: "Encoding video\u2026 ".concat(current, "/").concat(total),
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
export var renderVideoToFile = function (timeline, onEvent) {
    var outDir = path.join(root, "out");
    mkdirSync(outDir, { recursive: true });
    var propsPath = path.join(outDir, ".render-props.json");
    var timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    var outputPath = path.join(outDir, "renda-".concat(timestamp, ".mp4"));
    writeFileSync(propsPath, JSON.stringify(timeline), "utf8");
    var emit = function (event) {
        onEvent === null || onEvent === void 0 ? void 0 : onEvent(event);
    };
    emit({ type: "phase", phase: "starting", message: "Starting render…" });
    return new Promise(function (resolve, reject) {
        var _a, _b;
        var args = [
            "render",
            "src/composition/index.ts",
            "scenes",
            outputPath,
            "--props=".concat(propsPath),
        ];
        var child = spawn(remotionBin, args, {
            cwd: root,
            shell: process.platform === "win32",
            stdio: ["ignore", "pipe", "pipe"],
            windowsHide: true,
        });
        var stderr = "";
        var stdout = "";
        var handleLine = function (line) {
            var trimmed = line.trim();
            if (!trimmed)
                return;
            var progress = parseProgressLine(trimmed);
            if (progress) {
                emit(__assign({ type: "progress" }, progress));
                return;
            }
            if (/error|failed|cannot decode|cancelled/i.test(trimmed)) {
                emit({ type: "log", level: "error", message: trimmed });
            }
        };
        var feed = function (chunk, target) {
            var _a;
            var buffer = target + chunk.toString();
            var lines = buffer.split(/\r?\n/);
            var remainder = (_a = lines.pop()) !== null && _a !== void 0 ? _a : "";
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                handleLine(line);
            }
            return remainder;
        };
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (chunk) {
            stdout = feed(chunk, stdout);
        });
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", function (chunk) {
            stderr = feed(chunk, stderr);
        });
        child.on("error", function (err) {
            reject(err);
        });
        child.on("close", function (code) {
            if (code === 0 && existsSync(outputPath)) {
                emit({ type: "phase", phase: "done", message: "Render complete" });
                resolve({
                    outputPath: outputPath,
                    fileName: path.basename(outputPath),
                    relativePath: "out/".concat(path.basename(outputPath)),
                });
                return;
            }
            var log = "".concat(stderr, "\n").concat(stdout).trim();
            var hint = log.includes("blob:")
                ? " Uploaded media (browser-only URLs) cannot be rendered. Use built-in assets or files in public/."
                : log.includes("Cannot decode") || log.includes("404")
                    ? " Some images failed to load. Re-save the project or use assets from public/."
                    : "";
            reject(new Error((log.split("\n").filter(Boolean).slice(-8).join("\n") ||
                "Remotion exited with code ".concat(code)) + hint));
        });
    });
};
