/**
 * 案件CPU → 共通GPU クライアント
 *
 * 優先順位:
 * 1. RUNPOD_API_KEY + RUNPOD_ENDPOINT_ID → 対象 op のみ RunPod /runsync
 * 2. AI_GATEWAY_BASE_URL → HTTP（ローカル stub 等）
 * 3. 未設定 → 同一プロセスの ai-gateway
 *
 * RUNPOD_OPS（カンマ区切り、既定: hello,generate）
 *   route / web は CPU 側のまま（オーケストレーション用）
 */

import { randomUUID } from "crypto";
import {
  dispatchAiGateway,
  embedService,
  generateService,
  helloService,
  routeService,
  webService,
} from "../ai-gateway/index.js";

function gatewayBaseUrl() {
  return String(process.env.AI_GATEWAY_BASE_URL || "").replace(/\/$/, "");
}

function gatewayApiKey() {
  return String(process.env.AI_GATEWAY_API_KEY || "").trim();
}

function runpodApiKey() {
  return String(process.env.RUNPOD_API_KEY || "").trim();
}

function runpodEndpointId() {
  return String(process.env.RUNPOD_ENDPOINT_ID || "").trim();
}

function runpodApiBase() {
  return String(process.env.RUNPOD_API_BASE || "https://api.runpod.ai/v2").replace(
    /\/$/,
    "",
  );
}

function runpodConfigured() {
  return Boolean(runpodApiKey() && runpodEndpointId());
}

/** @returns {Set<string>} */
function runpodOps() {
  const raw = String(process.env.RUNPOD_OPS || "hello,generate")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return new Set(raw.length ? raw : ["hello", "generate"]);
}

/**
 * @param {string} op
 */
export function usesRunpodFor(op) {
  if (!runpodConfigured()) return false;
  return runpodOps().has(String(op || "").toLowerCase());
}

/**
 * @returns {"runpod"|"http"|"in-process"}
 */
export function resolveAiGatewayMode() {
  if (runpodConfigured()) return "runpod";
  if (gatewayBaseUrl()) return "http";
  return "in-process";
}

/**
 * @param {string} path
 * @param {object} body
 */
async function httpPost(path, body) {
  const base = gatewayBaseUrl();
  const apiKey = gatewayApiKey();
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...(body.tenantId ? { "X-Tenant-Id": String(body.tenantId) } : {}),
      ...(body.requestId ? { "X-Request-Id": String(body.requestId) } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`AI Gateway 応答が JSON ではありません (HTTP ${res.status})`);
  }
  if (!res.ok && json.ok !== false) {
    throw new Error(json.error || `AI Gateway HTTP ${res.status}`);
  }
  return json;
}

/**
 * @param {string} endpointId
 * @param {string} apiKey
 * @param {string} jobId
 * @param {number} started
 * @param {string} [requestId]
 */
async function runpodPollStatus(endpointId, apiKey, jobId, started, requestId) {
  const pollTimeoutMs = Number(process.env.RUNPOD_POLL_TIMEOUT_MS || 900000);
  const pollIntervalMs = Number(process.env.RUNPOD_POLL_INTERVAL_MS || 3000);
  const statusUrl = `${runpodApiBase()}/${encodeURIComponent(endpointId)}/status/${encodeURIComponent(jobId)}`;

  while (Date.now() - started < pollTimeoutMs) {
    await new Promise((r) => setTimeout(r, pollIntervalMs));
    const res = await fetch(statusUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const text = await res.text();
    let json = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        `RunPod status 応答が JSON ではありません (HTTP ${res.status}): ${text.slice(0, 200)}`,
      );
    }
    if (!res.ok) {
      return {
        ok: false,
        requestId: requestId || jobId,
        durationMs: Date.now() - started,
        usage: null,
        data: null,
        error: json.error || json.message || `RunPod status HTTP ${res.status}`,
        runpod: json,
      };
    }

    const st = String(json.status || "").toUpperCase();
    if (st === "COMPLETED") {
      return { ok: true, json, polled: true };
    }
    if (st === "FAILED" || st === "CANCELLED" || st === "TIMED_OUT") {
      return {
        ok: false,
        requestId: requestId || jobId || randomUUID(),
        durationMs: Date.now() - started,
        usage: null,
        data: json.output || null,
        error:
          json.error ||
          (typeof json.output === "string" ? json.output : null) ||
          `RunPod status=${st}`,
        runpod: {
          status: json.status,
          id: json.id || jobId,
          delayTime: json.delayTime,
          executionTime: json.executionTime,
        },
      };
    }
    // IN_QUEUE / IN_PROGRESS / others → keep polling
  }

  return {
    ok: false,
    requestId: requestId || jobId || randomUUID(),
    durationMs: Date.now() - started,
    usage: null,
    data: null,
    error: `RunPod ジョブがタイムアウトしました（${pollTimeoutMs}ms）。コンソールの Requests で job=${jobId} を確認してください`,
    runpod: { id: jobId, status: "POLL_TIMEOUT" },
  };
}

/**
 * @param {object} json
 * @param {number} started
 * @param {string} [requestId]
 * @param {boolean} [polled]
 */
function runpodFinalizeCompleted(json, started, requestId, polled = false) {
  const output = json.output;
  if (output && typeof output === "object" && output.ok === false) {
    return {
      ok: false,
      requestId: requestId || json.id || randomUUID(),
      durationMs: Date.now() - started,
      usage: null,
      data: output,
      error: output.error || "RunPod handler returned ok:false",
      runpod: {
        status: json.status,
        id: json.id,
        delayTime: json.delayTime,
        executionTime: json.executionTime,
        polled,
      },
    };
  }

  const data =
    output && typeof output === "object"
      ? output
      : { message: output != null ? String(output) : "OK", raw: output };

  return {
    ok: true,
    requestId: requestId || json.id || randomUUID(),
    durationMs: Date.now() - started,
    usage: null,
    data: {
      ...data,
      runpodStatus: json.status,
      runpodJobId: json.id,
      delayTime: json.delayTime,
      executionTime: json.executionTime,
      polled,
    },
  };
}

/**
 * @param {string} op
 * @param {object} body
 */
async function runpodRunSync(op, body = {}) {
  const started = Date.now();
  const endpointId = runpodEndpointId();
  const apiKey = runpodApiKey();
  if (!endpointId || !apiKey) {
    return {
      ok: false,
      requestId: body.requestId || randomUUID(),
      durationMs: Date.now() - started,
      usage: null,
      data: null,
      error: "RUNPOD_ENDPOINT_ID と RUNPOD_API_KEY が必要です",
    };
  }

  const url = `${runpodApiBase()}/${encodeURIComponent(endpointId)}/runsync`;
  const input = {
    op,
    ...body,
  };
  if (op === "hello" && !input.message) {
    input.message = "Hello World";
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input }),
  });

  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `RunPod 応答が JSON ではありません (HTTP ${res.status}): ${text.slice(0, 200)}`,
    );
  }

  if (!res.ok) {
    return {
      ok: false,
      requestId: body.requestId || json.id || randomUUID(),
      durationMs: Date.now() - started,
      usage: null,
      data: null,
      error: json.error || json.message || `RunPod HTTP ${res.status}`,
      runpod: json,
    };
  }

  let status = String(json.status || "").toUpperCase();
  // runsync の待ち上限を超えると IN_PROGRESS のまま返る → /status で完了まで待つ
  if (status === "IN_PROGRESS" || status === "IN_QUEUE") {
    const jobId = json.id;
    if (!jobId) {
      return {
        ok: false,
        requestId: body.requestId || randomUUID(),
        durationMs: Date.now() - started,
        usage: null,
        data: null,
        error: `RunPod status=${status}（job id なし）`,
        runpod: json,
      };
    }
    const polled = await runpodPollStatus(
      endpointId,
      apiKey,
      jobId,
      started,
      body.requestId,
    );
    if (!polled.ok) return polled;
    json = polled.json;
    status = String(json.status || "").toUpperCase();
    return runpodFinalizeCompleted(json, started, body.requestId, true);
  }

  if (status && status !== "COMPLETED") {
    return {
      ok: false,
      requestId: body.requestId || json.id || randomUUID(),
      durationMs: Date.now() - started,
      usage: null,
      data: null,
      error:
        json.error ||
        (typeof json.output === "string" ? json.output : null) ||
        `RunPod status=${status || "unknown"}`,
      runpod: {
        status: json.status,
        id: json.id,
        delayTime: json.delayTime,
        executionTime: json.executionTime,
      },
    };
  }

  return runpodFinalizeCompleted(json, started, body.requestId, false);
}

function withIds(params = {}) {
  return {
    ...params,
    requestId: params.requestId || randomUUID(),
  };
}

/**
 * @param {string} op
 * @param {object} body
 * @param {() => Promise<object>} localFn
 * @param {string} httpPath
 */
async function dispatchOp(op, body, localFn, httpPath) {
  if (usesRunpodFor(op)) return runpodRunSync(op, body);
  if (gatewayBaseUrl()) return httpPost(httpPath, body);
  return localFn();
}

export class AiGatewayClient {
  /**
   * @param {object} [opts]
   * @param {boolean} [opts.preferHttp]
   */
  constructor(opts = {}) {
    this.preferHttp = opts.preferHttp === true;
  }

  mode() {
    if (this.preferHttp && gatewayBaseUrl()) return "http";
    return resolveAiGatewayMode();
  }

  usesHttp() {
    const m = this.mode();
    return m === "http" || m === "runpod";
  }

  usesRunpod() {
    return runpodConfigured();
  }

  async hello(params = {}) {
    const body = withIds(params);
    return dispatchOp("hello", body, () => helloService(body), "/v1/hello");
  }

  async route(params = {}) {
    const body = withIds(params);
    return dispatchOp("route", body, () => routeService(body), "/v1/route");
  }

  async embed(params = {}) {
    const body = withIds(params);
    return dispatchOp("embed", body, () => embedService(body), "/v1/embed");
  }

  async generate(params = {}) {
    const body = withIds(params);
    return dispatchOp("generate", body, () => generateService(body), "/v1/generate");
  }

  async web(params = {}) {
    const body = withIds(params);
    return dispatchOp("web", body, () => webService(body), "/v1/web");
  }

  async dispatch(op, params = {}) {
    const body = withIds(params);
    if (usesRunpodFor(op)) return runpodRunSync(op, body);
    if (gatewayBaseUrl()) return httpPost(`/v1/${op}`, body);
    return dispatchAiGateway(op, body);
  }
}

export function createAiGatewayClient(opts) {
  return new AiGatewayClient(opts);
}
