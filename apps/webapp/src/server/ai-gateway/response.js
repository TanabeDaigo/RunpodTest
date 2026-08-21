/**
 * 共通GPU API のレスポンス形
 * { ok, requestId, durationMs, usage, data } / { ok:false, error }
 */

import { randomUUID } from "crypto";

/**
 * @param {object} [opts]
 * @param {string} [opts.requestId]
 * @returns {string}
 */
export function ensureRequestId(requestId) {
  const id = String(requestId || "").trim();
  return id || randomUUID();
}

/**
 * @param {object} params
 * @param {object} params.data
 * @param {number} [params.durationMs]
 * @param {object|null} [params.usage]
 * @param {string} [params.requestId]
 */
export function okEnvelope({ data, durationMs = 0, usage = null, requestId } = {}) {
  return {
    ok: true,
    requestId: ensureRequestId(requestId),
    durationMs: Number(durationMs) || 0,
    usage: usage || null,
    data: data ?? null,
  };
}

/**
 * @param {object} params
 * @param {string} params.error
 * @param {number} [params.durationMs]
 * @param {string} [params.requestId]
 * @param {object} [params.extra]
 */
export function errEnvelope({ error, durationMs = 0, requestId, extra } = {}) {
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
