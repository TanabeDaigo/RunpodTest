/**
 * POST /v1/hello — GPU 疎通確認（Ollama 不要）
 */
import os from "os";
import { okEnvelope } from "../response.js";

/**
 * @param {object} [params]
 * @param {string} [params.requestId]
 * @param {string} [params.message]
 */
export async function helloService(params = {}) {
  const started = Date.now();
  const message = String(params.message || "Hello World").trim() || "Hello World";

  return okEnvelope({
    requestId: params.requestId,
    durationMs: Date.now() - started,
    data: {
      message,
      service: "ai-gateway",
      hostname: os.hostname(),
      pid: process.pid,
      at: new Date().toISOString(),
      note: "疎通 OK（この応答に Ollama は使っていません）",
    },
  });
}
