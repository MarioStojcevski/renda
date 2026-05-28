var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { renderVideoToFile } from "./server/render-video";
var OUT_DIR = path.join(process.cwd(), "out");
var readBody = function (req) {
    return new Promise(function (resolve, reject) {
        var chunks = [];
        req.on("data", function (chunk) { return chunks.push(Buffer.from(chunk)); });
        req.on("end", function () { return resolve(Buffer.concat(chunks).toString("utf8")); });
        req.on("error", reject);
    });
};
var sendJson = function (res, status, data) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
};
var writeNdjson = function (res, data) {
    res.write("".concat(JSON.stringify(data), "\n"));
};
var safeFileName = function (name) {
    if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
        return null;
    }
    return name;
};
export var rendaRenderPlugin = function () { return ({
    name: "renda-render-api",
    configureServer: function (server) {
        var _this = this;
        server.middlewares.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var url, fileName, filePath, fileStat, _a, raw, timeline, result, err_1, message;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = new URL((_b = req.url) !== null && _b !== void 0 ? _b : "/", "http://localhost");
                        if (!(url.pathname === "/api/render/file" && req.method === "GET")) return [3 /*break*/, 5];
                        fileName = safeFileName(url.searchParams.get("name"));
                        if (!fileName) {
                            sendJson(res, 400, { error: "Invalid file name" });
                            return [2 /*return*/];
                        }
                        filePath = path.join(OUT_DIR, fileName);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, stat(filePath)];
                    case 2:
                        fileStat = _c.sent();
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "video/mp4");
                        res.setHeader("Content-Length", String(fileStat.size));
                        res.setHeader("Content-Disposition", "attachment; filename=\"".concat(fileName, "\""));
                        createReadStream(filePath).pipe(res);
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        sendJson(res, 404, { error: "Render file not found" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                    case 5:
                        if (url.pathname !== "/api/render" || req.method !== "POST") {
                            next();
                            return [2 /*return*/];
                        }
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 9, , 10]);
                        return [4 /*yield*/, readBody(req)];
                    case 7:
                        raw = _c.sent();
                        timeline = JSON.parse(raw);
                        if (!Array.isArray(timeline === null || timeline === void 0 ? void 0 : timeline.VideoTrack) || timeline.VideoTrack.length === 0) {
                            sendJson(res, 400, { error: "Add at least one scene before rendering." });
                            return [2 /*return*/];
                        }
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/x-ndjson");
                        res.setHeader("Cache-Control", "no-cache");
                        res.setHeader("Connection", "keep-alive");
                        return [4 /*yield*/, renderVideoToFile(timeline, function (event) {
                                writeNdjson(res, event);
                            })];
                    case 8:
                        result = _c.sent();
                        writeNdjson(res, {
                            type: "complete",
                            fileName: result.fileName,
                            relativePath: result.relativePath,
                            downloadUrl: "/api/render/file?name=".concat(encodeURIComponent(result.fileName)),
                        });
                        res.end();
                        return [3 /*break*/, 10];
                    case 9:
                        err_1 = _c.sent();
                        if (!res.headersSent) {
                            message = err_1 instanceof Error ? err_1.message : "Render failed";
                            sendJson(res, 500, { error: message });
                            return [2 /*return*/];
                        }
                        writeNdjson(res, {
                            type: "error",
                            message: err_1 instanceof Error ? err_1.message : "Render failed",
                        });
                        res.end();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
    },
}); };
