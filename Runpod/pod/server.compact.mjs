import http from "http";
import os from "os";
import { randomUUID } from "crypto";

const PORT = Number(process.env.PORT || 3100);
const KEY = String(process.env.AI_GATEWAY_API_KEY || "").trim();
const OLLAMA = String(process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
const MODEL = String(process.env.OLLAMA_MODEL || "llama3.2:1b").trim() || "llama3.2:1b";
const T = Number(process.env.OLLAMA_TIMEOUT_MS || 600000);

const rid = (x) => String(x || "").trim() || randomUUID();
const ok = (d, ms, id, u = null) => ({ ok: true, requestId: rid(id), durationMs: ms|0, usage: u, data: d ?? null });
const bad = (e, ms, id) => ({ ok: false, requestId: rid(id), durationMs: ms|0, usage: null, data: null, error: String(e) });

function send(res, code, obj) {
  const b = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(b),
    "Access-Control-Allow-Origin": "*",
  });
  res.end(b);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const c = [];
    req.on("data", (x) => c.push(x));
    req.on("end", () => {
      const raw = Buffer.concat(c).toString("utf8");
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

const auth = (req) => !KEY || String(req.headers.authorization || "") === `Bearer ${KEY}`;

async function ollama(path, { method = "GET", body, timeout = T } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(`${OLLAMA}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    const text = await res.text();
    let json = {};
    try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
    return { status: res.status, json, text };
  } finally { clearTimeout(t); }
}

function msgs(body) {
  if (Array.isArray(body.messages) && body.messages.length) {
    return body.messages.filter((m) => m && m.content).map((m) => ({ role: String(m.role || "user"), content: String(m.content) }));
  }
  const p = String(body.prompt || body.question || "").trim();
  if (!p) throw new Error("messages or prompt required");
  const out = [];
  if (body.system) out.push({ role: "system", content: String(body.system) });
  out.push({ role: "user", content: p });
  return out;
}

async function ensureModel(model) {
  const tags = await ollama("/api/tags", { timeout: 30000 });
  const names = new Set((tags.json.models || []).map((m) => String(m.name || "")));
  if (names.has(model)) return false;
  const pull = await ollama("/api/pull", { method: "POST", body: { name: model, stream: false }, timeout: 1800000 });
  if (pull.status >= 400) throw new Error(`pull failed ${pull.status}`);
  return true;
}

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url || "/", "http://x").pathname.replace(/\/$/, "") || "/";
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method === "GET" && (path === "/health" || path === "/v1/health")) {
    let ollamaOk = false;
    try { ollamaOk = (await ollama("/api/tags", { timeout: 5000 })).status < 400; } catch {}
    return send(res, 200, { ok: true, service: "metroai-pod-gateway", runtime: "node", ollama: ollamaOk, defaultModel: MODEL, hostname: os.hostname(), at: new Date().toISOString() });
  }
  if (req.method === "POST" && path === "/v1/hello") {
    if (!auth(req)) return send(res, 401, bad("Unauthorized"));
    const t0 = Date.now();
    let body = {};
    try { body = await readJson(req); } catch { return send(res, 400, bad("invalid JSON")); }
    return send(res, 200, ok({ message: String(body.message || "Hello World").trim() || "Hello World", service: "metroai-pod-gateway", hostname: os.hostname(), pid: process.pid, at: new Date().toISOString(), note: "Hello OK (Pod HTTP / Node.js)" }, Date.now() - t0, body.requestId));
  }
  if (req.method === "POST" && path === "/v1/generate") {
    if (!auth(req)) return send(res, 401, bad("Unauthorized"));
    const t0 = Date.now();
    let body = {};
    try { body = await readJson(req); } catch { return send(res, 400, bad("invalid JSON")); }
    try {
      const model = String(body.model || MODEL).trim() || MODEL;
      const messages = msgs(body);
      const payload = { model, messages, stream: false, ...(body.options && typeof body.options === "object" ? { options: body.options } : {}) };
      let chat = await ollama("/api/chat", { method: "POST", body: payload });
      let pulled = false;
      if (chat.status === 404 && body.autoPull !== false) {
        pulled = await ensureModel(model);
        chat = await ollama("/api/chat", { method: "POST", body: payload });
      }
      if (chat.status >= 400) return send(res, 200, bad(`Ollama HTTP ${chat.status}: ${String(chat.text).slice(0, 400)}`, Date.now() - t0, body.requestId));
      const answer = String(chat.json?.message?.content || "");
      return send(res, 200, ok({ answer, message: answer, model: chat.json?.model || model, service: "metroai-pod-gateway", pulled, note: `generate OK via Ollama on Pod (${model})` }, Date.now() - t0, body.requestId, { model: chat.json?.model || model }));
    } catch (e) {
      return send(res, 200, bad(e.message || String(e), Date.now() - t0, body.requestId));
    }
  }
  return send(res, 404, bad(`unknown route: ${req.method} ${path}`));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[metroai-pod] :${PORT} model=${MODEL}`);
});
