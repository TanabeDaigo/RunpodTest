/**
 * ローカル擬似 GPU サーバ（疎通確認用）
 *
 * 使い方:
 *   pnpm --filter webapp ai-gateway:stub
 *
 * 別ターミナルで webapp の env に:
 *   AI_GATEWAY_BASE_URL=http://127.0.0.1:3100
 *
 * その後 Step21 「GPU疎通（Hello）」を押すと mode=http になる。
 *
 * RunPod を借りる前に、HTTP 経路だけ先に確認できる。
 */

import http from "http";
import os from "os";
import { randomUUID } from "crypto";

const PORT = Number(process.env.AI_GATEWAY_STUB_PORT || 3100);
const API_KEY = String(process.env.AI_GATEWAY_API_KEY || "").trim();

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function checkAuth(req) {
  if (!API_KEY) return true;
  const h = String(req.headers.authorization || "");
  return h === `Bearer ${API_KEY}`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname.replace(/\/$/, "") || "/";

  if (req.method === "GET" && (path === "/health" || path === "/v1/health")) {
    return send(res, 200, {
      ok: true,
      service: "ai-gateway-stub",
      hostname: os.hostname(),
      at: new Date().toISOString(),
    });
  }

  if (req.method === "POST" && path === "/v1/hello") {
    if (!checkAuth(req)) {
      return send(res, 401, { ok: false, error: "Unauthorized", data: null });
    }
    const started = Date.now();
    let body = {};
    try {
      body = await readJson(req);
    } catch {
      return send(res, 400, { ok: false, error: "invalid JSON", data: null });
    }
    const requestId = body.requestId || randomUUID();
    return send(res, 200, {
      ok: true,
      requestId,
      durationMs: Date.now() - started,
      usage: null,
      data: {
        message: String(body.message || "Hello World").trim() || "Hello World",
        service: "ai-gateway-stub",
        hostname: os.hostname(),
        pid: process.pid,
        at: new Date().toISOString(),
        note: "疎通 OK（ローカル stub。Ollama 未使用）",
      },
    });
  }

  send(res, 404, {
    ok: false,
    error: `stub は /v1/hello と /health のみ対応: ${req.method} ${path}`,
    data: null,
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[ai-gateway-stub] http://127.0.0.1:${PORT}`);
  console.log(`[ai-gateway-stub] POST /v1/hello  /  GET /health`);
  if (API_KEY) console.log("[ai-gateway-stub] AI_GATEWAY_API_KEY 認証あり");
  else console.log("[ai-gateway-stub] 認証なし（ラボ用）");
});
