/**
 * POST /v1/embed — Embedding
 */
import { createOllamaAdapter } from "../adapters/ollama.js";
import { assertTenant } from "../auth.js";
import { withQueue } from "../queue.js";
import { errEnvelope, okEnvelope } from "../response.js";

/**
 * @param {object} params
 * @param {string} params.text
 * @param {string} [params.prompt] - text の別名
 * @param {string} [params.embedModel]
 * @param {string} [params.tenantId]
 * @param {string} [params.requestId]
 * @param {object} [params.ollama]
 */
export async function embedService(params = {}) {
  const started = Date.now();
  const requestId = params.requestId;
  const tenant = assertTenant({ tenantId: params.tenantId, requireTenant: false });
  if (!tenant.ok) {
    return errEnvelope({ error: tenant.error, requestId, durationMs: Date.now() - started });
  }

  const text = String(params.text || params.prompt || "").trim();
  if (!text) {
    return errEnvelope({ error: "text が必要です", requestId, durationMs: Date.now() - started });
  }

  try {
    const data = await withQueue({
      tenantId: tenant.tenantId,
      op: "embed",
      run: async () => {
        const ollama =
          params.ollama ||
          createOllamaAdapter({ embedModel: params.embedModel });
        const result = await ollama.embeddings({
          model: params.embedModel,
          prompt: text,
        });
        return {
          vector: result.embedding,
          dimensions: result.dimensions,
          model: result.model,
        };
      },
    });
    return okEnvelope({
      requestId,
      durationMs: Date.now() - started,
      usage: { model: data.model },
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
