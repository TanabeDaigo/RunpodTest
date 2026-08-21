/**
 * RunPod Pod — HTTP AI Gateway（Node.js / MetroJS と同系統）
 *
 * レスポンス形は metrojs ai-gateway と同じ:
 *   { ok, requestId, durationMs, usage, data } / { ok:false, error }
 *
 * GET  /health | /v1/health
 * POST /v1/hello
 * POST /v1/generate
 *
 * 起動:
 *   node server.mjs
 *   PORT=3100 OLLAMA_MODEL=llama3.2:1b node server.mjs
 */

import http from "http";
import os from "os";
import { randomUUID } from "crypto";

const PORT = Number(process.env.PORT || process.env.AI_GATEWAY_PORT || 3100);
const API_KEY = String(process.env.AI_GATEWAY_API_KEY || "").trim();
const OLLAMA_BASE = String(
  process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
).replace(/\/$/, "");
const DEFAULT_MODEL =
  String(process.env.OLLAMA_MODEL || "llama3.2:1b").trim() || "llama3.2:1b";
const CHAT_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 600000);
const PULL_TIMEOUT_MS = Number(process.env.OLLAMA_PULL_TIMEOUT_MS || 1800000);

function ensureRequestId(requestId) {
  const id = String(requestId || "").trim();
  return id || randomUUID();
}

function okEnvelope({ data, durationMs = 0, usage = null, requestId } = {}) {
  return {
    ok: true,
    requestId: ensureRequestId(requestId),
    durationMs: Number(durationMs) || 0,
    usage: usage || null,
    data: data ?? null,
  };
}

function errEnvelope({ error, durationMs = 0, requestId, extra } = {}) {
  return {
    ok: false,
    requestId: ensureRequestId(requestId),
    durationMs: Number(durationMs) || 0,
    usage: null,
    data: null,
    error: String(error || "unknown error"),
    ...(extra && typeof extra === "object" ? extra : {}),
  };
}

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
  return String(req.headers.authorization || "") === `Bearer ${API_KEY}`;
}

async function ollamaFetch(path, { method = "GET", body, timeoutMs } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs || CHAT_TIMEOUT_MS);
  try {
    const res = await fetch(`${OLLAMA_BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    const text = await res.text();
    let json = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { raw: text };
    }
    return { status: res.status, json, text };
  } finally {
    clearTimeout(t);
  }
}

async function modelPresent(model) {
  const { status, json } = await ollamaFetch("/api/tags", { timeoutMs: 30000 });
  if (status >= 400) return false;
  const names = new Set((json.models || []).map((m) => String(m.name || "")));
  if (names.has(model)) return true;
  return false;
}

async function ensureModel(model) {
  if (await modelPresent(model)) return false;
  const { status, text } = await ollamaFetch("/api/pull", {
    method: "POST",
    body: { name: model, stream: false },
    timeoutMs: PULL_TIMEOUT_MS,
  });
  if (status >= 400) {
    throw new Error(`Ollama pull failed HTTP ${status}: ${String(text).slice(0, 500)}`);
  }
  return true;
}

function buildMessages(body = {}) {
  if (Array.isArray(body.messages) && body.messages.length) {
    const out = [];
    for (const m of body.messages) {
      if (!m || typeof m !== "object") continue;
      const role = String(m.role || "user");
      const content = String(m.content || "");
      if (content) out.push({ role, content });
    }
    if (out.length) return out;
  }
  const prompt = String(body.prompt || body.question || "").trim();
  if (!prompt) throw new Error("messages または prompt が必要です");
  const out = [];
  if (body.system && String(body.system).trim()) {
    out.push({ role: "system", content: String(body.system).trim() });
  }
  out.push({ role: "user", content: prompt });
  return out;
}

async function handleHello(body) {
  const started = Date.now();
  const message = String(body.message || "Hello World").trim() || "Hello World";
  return okEnvelope({
    requestId: body.requestId,
    durationMs: Date.now() - started,
    data: {
      message,
      service: "metroai-pod-gateway",
      hostname: os.hostname(),
      pid: process.pid,
      at: new Date().toISOString(),
      note: "Hello OK (Pod HTTP / Node.js / no Ollama)",
    },
  });
}

async function handleGenerate(body) {
  const started = Date.now();
  const requestId = body.requestId;
  try {
    const model = String(body.model || DEFAULT_MODEL).trim() || DEFAULT_MODEL;
    const messages = buildMessages(body);
    let pulled = false;

    const payload = {
      model,
      messages,
      stream: false,
      ...(body.options && typeof body.options === "object"
        ? { options: body.options }
        : {}),
    };

    let chat = await ollamaFetch("/api/chat", {
      method: "POST",
      body: payload,
      timeoutMs: CHAT_TIMEOUT_MS,
    });

    const autoPull = body.autoPull !== false;
    if (chat.status === 404 && autoPull) {
      pulled = await ensureModel(model);
      chat = await ollamaFetch("/api/chat", {
        method: "POST",
        body: payload,
        timeoutMs: CHAT_TIMEOUT_MS,
      });
    }

    if (chat.status >= 400) {
      return errEnvelope({
        requestId,
        durationMs: Date.now() - started,
        error: `Ollama HTTP ${chat.status}: ${String(chat.text).slice(0, 500)}`,
      });
    }

    const answer = String(chat.json?.message?.content || "");
    let note = `generate OK via Ollama on Pod (${model})`;
    if (pulled) note += " / model was pulled on demand";

    return okEnvelope({
      requestId,
      durationMs: Date.now() - started,
      usage: { model: chat.json?.model || model },
      data: {
        answer,
        message: answer,
        model: chat.json?.model || model,
        service: "metroai-pod-gateway",
        pulled,
        evalCount: chat.json?.eval_count,
        promptEvalCount: chat.json?.prompt_eval_count,
        note,
      },
    });
  } catch (err) {
    return errEnvelope({
      requestId,
      durationMs: Date.now() - started,
      error: err.message || String(err),
    });
  }
}

async function ollamaHealthy() {
  try {
    const { status } = await ollamaFetch("/api/tags", { timeoutMs: 5000 });
    return status < 400;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname.replace(/\/$/, "") || "/";

  if (req.method === "OPTIONS") {
    return send(res, 204, {});
  }

  if (req.method === "GET" && (path === "/health" || path === "/v1/health")) {
    const ollama = await ollamaHealthy();
    return send(res, 200, {
      ok: true,
      service: "metroai-pod-gateway",
      runtime: "node",
      ollama,
      defaultModel: DEFAULT_MODEL,
      hostname: os.hostname(),
      at: new Date().toISOString(),
    });
  }

  if (req.method === "POST" && path === "/v1/hello") {
    if (!checkAuth(req)) {
      return send(res, 401, errEnvelope({ error: "Unauthorized" }));
    }
    let body = {};
    try {
      body = await readJson(req);
    } catch {
      return send(res, 400, errEnvelope({ error: "invalid JSON" }));
    }
    return send(res, 200, await handleHello(body));
  }

  if (req.method === "POST" && path === "/v1/generate") {
    if (!checkAuth(req)) {
      return send(res, 401, errEnvelope({ error: "Unauthorized" }));
    }
    let body = {};
    try {
      body = await readJson(req);
    } catch {
      return send(res, 400, errEnvelope({ error: "invalid JSON" }));
    }
    const result = await handleGenerate(body);
    return send(res, 200, result);
  }

  return send(
    res,
    404,
    errEnvelope({
      error: `unknown route: ${req.method} ${path} (supported: /health, /v1/hello, /v1/generate)`,
    }),
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[metroai-pod] http://0.0.0.0:${PORT}`);
  console.log(`[metroai-pod] GET /health  POST /v1/hello  POST /v1/generate`);
  console.log(`[metroai-pod] OLLAMA_BASE=${OLLAMA_BASE} model=${DEFAULT_MODEL}`);
  if (API_KEY) console.log("[metroai-pod] AI_GATEWAY_API_KEY auth enabled");
});
