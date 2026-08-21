/**
 * POST /v1/route — Router LLM（internal|web|general）
 */
import { runRouterQuestion, normalizeForceRoute } from "../../llm/routeQuestion.js";
import { createOllamaAdapter } from "../adapters/ollama.js";
import { assertTenant } from "../auth.js";
import { withQueue } from "../queue.js";
import { errEnvelope, okEnvelope } from "../response.js";

/**
 * @param {object} params
 * @param {string} params.query
 * @param {string} [params.routerModel]
 * @param {string} [params.model]
 * @param {string} [params.forceRoute]
 * @param {string} [params.tenantId]
 * @param {string} [params.requestId]
 * @param {object} [params.options]
 * @param {object} [params.ollama]
 */
export async function routeService(params = {}) {
  const started = Date.now();
  const requestId = params.requestId;
  const tenant = assertTenant({ tenantId: params.tenantId, requireTenant: false });
  if (!tenant.ok) {
    return errEnvelope({ error: tenant.error, requestId, durationMs: Date.now() - started });
  }

  const query = String(params.query || "").trim();
  if (!query) {
    return errEnvelope({ error: "query が必要です", requestId, durationMs: Date.now() - started });
  }

  const forced = normalizeForceRoute(params.forceRoute);
  if (forced) {
    return okEnvelope({
      requestId,
      durationMs: Date.now() - started,
      usage: { model: null },
      data: {
        skipped: true,
        forceRoute: forced,
        route: forced,
        confidence: 1,
        entity_name: "",
        parsed: { route: forced, entity_name: "", confidence: 1 },
        raw: null,
        model: null,
        attempts: 0,
      },
    });
  }

  const model = params.routerModel || params.model;
  if (!model) {
    return errEnvelope({
      error: "routerModel（または model）が必要です",
      requestId,
      durationMs: Date.now() - started,
    });
  }

  try {
    const data = await withQueue({
      tenantId: tenant.tenantId,
      op: "route",
      run: async () => {
        const ollama = params.ollama || createOllamaAdapter({ model });
        const result = await runRouterQuestion(ollama, {
          query,
          model,
          options: params.options,
        });
        return {
          skipped: false,
          forceRoute: null,
          route: result.parsed.route,
          confidence: result.parsed.confidence,
          entity_name: result.parsed.entity_name,
          parsed: result.parsed,
          raw: result.raw,
          model: result.model,
          attempts: result.attempts,
          chatDurationMs: result.chatDurationMs,
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
