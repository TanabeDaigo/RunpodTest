/**
 * POST /v1/generate — Chat 生成（Qwen3 等）
 */
import { createOllamaAdapter } from "../adapters/ollama.js";
import { assertTenant } from "../auth.js";
import { withQueue } from "../queue.js";
import { errEnvelope, okEnvelope } from "../response.js";

/**
 * @param {object} params
 * @param {Array<{role:string,content:string}>} [params.messages]
 * @param {string} [params.prompt]
 * @param {string} [params.system]
 * @param {string} [params.model]
 * @param {boolean} [params.stream] - 将来用（現状 false のみ）
 * @param {object} [params.options]
 * @param {string} [params.tenantId]
 * @param {string} [params.requestId]
 * @param {object} [params.ollama]
 */
export async function generateService(params = {}) {
  const started = Date.now();
  const requestId = params.requestId;
  const tenant = assertTenant({ tenantId: params.tenantId, requireTenant: false });
  if (!tenant.ok) {
    return errEnvelope({ error: tenant.error, requestId, durationMs: Date.now() - started });
  }

  if (params.stream === true) {
    return errEnvelope({
      error: "stream は未対応です（将来 SSE）",
      requestId,
      durationMs: Date.now() - started,
    });
  }

  const model = params.model;
  if (!model) {
    return errEnvelope({ error: "model が必要です", requestId, durationMs: Date.now() - started });
  }

  let messages = Array.isArray(params.messages) ? params.messages : null;
  if (!messages) {
    const prompt = String(params.prompt || "").trim();
    if (!prompt) {
      return errEnvelope({
        error: "messages または prompt が必要です",
        requestId,
        durationMs: Date.now() - started,
      });
    }
    messages = [];
    if (params.system && String(params.system).trim()) {
      messages.push({ role: "system", content: String(params.system).trim() });
    }
    messages.push({ role: "user", content: prompt });
  }

  try {
    const data = await withQueue({
      tenantId: tenant.tenantId,
      op: "generate",
      run: async () => {
        const ollama = params.ollama || createOllamaAdapter({ model });
        const result = await ollama.chat({
          model,
          messages,
          options: params.options,
        });
        return {
          answer: result.content || "",
          model: result.model,
          totalDurationMs: result.totalDurationMs,
          evalCount: result.evalCount,
          promptEvalCount: result.promptEvalCount,
        };
      },
    });
    return okEnvelope({
      requestId,
      durationMs: Date.now() - started,
      usage: {
        model: data.model,
        evalCount: data.evalCount,
        promptEvalCount: data.promptEvalCount,
      },
      data,
    });
  } catch (err) {
    return errEnvelope({
      error: err.message || String(err),
      requestId,
      durationMs: Date.now() - started,
    });
  }
}
