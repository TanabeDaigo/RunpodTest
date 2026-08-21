/**
 * POST /v1/web — Tavily / Gemini Grounding
 * mode=context: 検索結果を Context 文字列に（Qwen3 へ渡す用）
 * mode=answer: 検索＋回答一体（Gemini）または Tavily answer
 */
import {
  expandSearchQuery,
  formatTavilyContext,
  getTavilyPublicConfig,
  tavilySearch,
} from "../../llm/tavilyClient.js";
import {
  formatGeminiContext,
  formatGeminiError,
  geminiGenerateContent,
  getGeminiPublicConfig,
  getGeminiSearchModel,
} from "../../llm/geminiClient.js";
import { assertTenant } from "../auth.js";
import { withQueue } from "../queue.js";
import { errEnvelope, okEnvelope } from "../response.js";

/**
 * @param {object} params
 * @param {string} params.query
 * @param {"tavily"|"gemini"} [params.provider]
 * @param {"context"|"answer"} [params.mode]
 * @param {number} [params.maxResults]
 * @param {string} [params.searchDepth]
 * @param {boolean} [params.expandRelativeDates]
 * @param {string} [params.geminiModel]
 * @param {string} [params.tenantId]
 * @param {string} [params.requestId]
 */
export async function webService(params = {}) {
  const started = Date.now();
  const requestId = params.requestId;
  const tenant = assertTenant({ tenantId: params.tenantId, requireTenant: false });
  if (!tenant.ok) {
    return errEnvelope({ error: tenant.error, requestId, durationMs: Date.now() - started });
  }

  const raw = String(params.query || "").trim();
  if (!raw) {
    return errEnvelope({ error: "query が必要です", requestId, durationMs: Date.now() - started });
  }

  const provider =
    String(params.provider || "tavily").toLowerCase() === "gemini" ? "gemini" : "tavily";
  const mode = String(params.mode || "context").toLowerCase() === "answer" ? "answer" : "context";
  const searchQuery =
    params.expandRelativeDates === false ? raw : expandSearchQuery(raw);

  try {
    const data = await withQueue({
      tenantId: tenant.tenantId,
      op: "web",
      run: async () => {
        if (provider === "gemini") {
          if (!getGeminiPublicConfig().apiKeySet) {
            throw new Error("GEMINI_API_KEY が未設定です（webProvider=gemini）");
          }
          const geminiResult = await geminiGenerateContent({
            prompt: searchQuery,
            model: params.geminiModel || getGeminiSearchModel(),
            useGoogleSearch: true,
            systemInstruction: [
              "Web検索結果に基づき、事実を日本語で簡潔にまとめてください。",
              "分からない場合は分からないと述べてください。",
              "可能なら出典を示してください。",
              "絵文字は使わないでください。",
            ].join("\n"),
          });
          const context = formatGeminiContext(geminiResult);
          return {
            provider: "gemini",
            mode,
            searchQuery,
            sources: geminiResult.grounding?.sources || [],
            webSearchQueries: geminiResult.grounding?.webSearchQueries || [],
            context,
            answer: mode === "answer" ? geminiResult.answer || "" : null,
            geminiAnswer: geminiResult.answer || "",
            model: geminiResult.model,
            finishReason: geminiResult.finishReason,
            usage: geminiResult.usage,
            geminiDurationMs: geminiResult.durationMs,
            config: getGeminiPublicConfig(),
          };
        }

        if (!getTavilyPublicConfig().apiKeySet) {
          throw new Error("TAVILY_API_KEY が未設定です");
        }
        const searchResult = await tavilySearch({
          query: searchQuery,
          maxResults: params.maxResults,
          searchDepth: params.searchDepth,
          includeAnswer: mode === "answer",
        });
        const sources = (searchResult.results || []).map((r) => ({
          rank: r.rank,
          title: r.title,
          url: r.url,
          score: r.score,
          publishedDate: r.publishedDate,
        }));
        const context = formatTavilyContext(searchResult.results);
        return {
          provider: "tavily",
          mode,
          searchQuery,
          sources,
          results: searchResult.results,
          context,
          answer: mode === "answer" ? searchResult.answer || null : null,
          tavilyDurationMs: searchResult.durationMs,
          searchDepth: searchResult.searchDepth,
          maxResults: searchResult.maxResults,
          config: getTavilyPublicConfig(),
        };
      },
    });

    return okEnvelope({
      requestId,
      durationMs: Date.now() - started,
      usage: data.usage || { model: data.model || null },
      data,
    });
  } catch (err) {
    const msg =
      provider === "gemini" ? formatGeminiError(err) : err.message || String(err);
    return errEnvelope({
      error: msg,
      requestId,
      durationMs: Date.now() - started,
    });
  }
}
