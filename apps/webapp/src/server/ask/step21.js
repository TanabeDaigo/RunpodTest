/**
 * STEP21: RAG / WEB / LLM 統合（Router API + Answer API）
 *
 * 画面向け route 名: RAG | WEB | LLM
 * 内部（ai-gateway）: internal | web | general
 *
 * 将来 GPU 分離時は AiGatewayClient が HTTP に切り替わるだけ。
 */

import logjs from "@metrojs/logjs";
import { createAiGatewayClient } from "./AiGatewayClient.js";
import { buildRagMessages, formatRagContext } from "./rag/ContextBuilder.js";
import { createQdrant, searchQdrant } from "./rag/QdrantSearch.js";
import { resolveTenantScope, buildQdrantFilter } from "../llm/tenantScope.js";

const log = new logjs("Step21");

export const STEP21_ROUTES = ["RAG", "WEB", "LLM"];

const UI_TO_INTERNAL = {
  RAG: "internal",
  WEB: "web",
  LLM: "general",
};

const INTERNAL_TO_UI = {
  internal: "RAG",
  web: "WEB",
  general: "LLM",
};

/**
 * @param {string} route
 * @returns {"RAG"|"WEB"|"LLM"|null}
 */
export function normalizeStep21Route(route) {
  const r = String(route || "").trim().toUpperCase();
  if (STEP21_ROUTES.includes(r)) return r;
  const lower = String(route || "").trim().toLowerCase();
  if (INTERNAL_TO_UI[lower]) return INTERNAL_TO_UI[lower];
  return null;
}

/**
 * @param {string} uiRoute
 * @param {object} [parsed]
 */
export function buildRouteReason(uiRoute, parsed = {}) {
  const entity = String(parsed.entity_name || "").trim();
  const conf =
    typeof parsed.confidence === "number" ? parsed.confidence : null;

  let base = "";
  if (uiRoute === "RAG") {
    base = "社内情報・規程・マニュアルに関する質問のため";
  } else if (uiRoute === "WEB") {
    base = "最新の公開情報（ニュース・株価・天気など）に関する質問のため";
  } else {
    base = "一般知識で回答可能な質問のため";
  }

  const extras = [];
  if (entity) extras.push(`対象: ${entity}`);
  if (conf != null) extras.push(`confidence=${conf.toFixed(2)}`);
  return extras.length ? `${base}（${extras.join(", ")}）` : base;
}

function defaultRouterModel() {
  return process.env.OLLAMA_MODEL || "qwen3:8b";
}

function defaultMainModel() {
  return process.env.OLLAMA_MODEL || "qwen3:8b";
}

/**
 * API① Router 判定（回答はしない）
 * @param {object} body
 */
export async function runStep21Router(body = {}) {
  const started = Date.now();
  const question = String(body.question || body.query || "").trim();
  if (!question) {
    return {
      success: false,
      error: "question が必要です",
      durationMs: Date.now() - started,
    };
  }

  const forceUi = normalizeStep21Route(body.forceRoute || body.route);
  const routerModel = body.routerModel || body.model || defaultRouterModel();
  const ai = createAiGatewayClient();

  try {
    const routeRes = await ai.route({
      query: question,
      routerModel: forceUi ? undefined : routerModel,
      forceRoute: forceUi ? UI_TO_INTERNAL[forceUi] : null,
      tenantId: body.tenantId,
      options: body.options,
    });

    if (!routeRes.ok) {
      return {
        success: false,
        error: routeRes.error || "Router 判定に失敗しました",
        durationMs: Date.now() - started,
        requestId: routeRes.requestId,
      };
    }

    const internal = routeRes.data?.route || "general";
    const uiRoute = INTERNAL_TO_UI[internal] || "LLM";
    const parsed = routeRes.data?.parsed || {
      route: internal,
      entity_name: routeRes.data?.entity_name || "",
      confidence: routeRes.data?.confidence ?? 0.5,
    };
    const reason = buildRouteReason(uiRoute, parsed);

    return {
      success: true,
      route: uiRoute,
      reason,
      confidence: parsed.confidence,
      entity_name: parsed.entity_name || "",
      internalRoute: internal,
      routerModel: routeRes.data?.model || routerModel,
      skipped: routeRes.data?.skipped === true,
      durationMs: Date.now() - started,
      requestId: routeRes.requestId,
      aiGateway: {
        mode: ai.usesHttp() ? "http" : "in-process",
      },
    };
  } catch (err) {
    log.error("runStep21Router error", err);
    return {
      success: false,
      error: err.message || String(err),
      durationMs: Date.now() - started,
    };
  }
}

/**
 * @param {"RAG"|"WEB"|"LLM"} route
 * @returns {Array<{ id: string, label: string, status: "pending"|"done"|"active"|"skipped" }>}
 */
export function buildStepTemplate(route) {
  if (route === "RAG") {
    return [
      { id: "router", label: "Router判定", status: "done" },
      { id: "embed", label: "Embedding", status: "pending" },
      { id: "qdrant", label: "Qdrant検索", status: "pending" },
      { id: "context", label: "Context作成", status: "pending" },
      { id: "ollama", label: "Ollama回答生成", status: "pending" },
      { id: "done", label: "回答完了", status: "pending" },
    ];
  }
  if (route === "WEB") {
    return [
      { id: "router", label: "Router判定", status: "done" },
      { id: "tavily", label: "Tavily Web検索", status: "pending" },
      { id: "results", label: "検索結果取得", status: "pending" },
      { id: "ollama", label: "Ollama回答生成", status: "pending" },
      { id: "done", label: "回答完了", status: "pending" },
    ];
  }
  return [
    { id: "router", label: "Router判定", status: "done" },
    { id: "ollama", label: "Ollama回答生成", status: "pending" },
    { id: "done", label: "回答完了", status: "pending" },
  ];
}

function markSteps(steps, doneIds, activeId = null) {
  return steps.map((s) => {
    if (doneIds.includes(s.id)) return { ...s, status: "done" };
    if (activeId && s.id === activeId) return { ...s, status: "active" };
    return { ...s, status: s.status === "done" ? "done" : "pending" };
  });
}

/**
 * API② 回答生成（route 必須）
 * @param {object} body
 */
export async function runStep21Answer(body = {}) {
  const started = Date.now();
  const question = String(body.question || body.query || "").trim();
  const uiRoute = normalizeStep21Route(body.route);

  if (!question) {
    return {
      success: false,
      error: "question が必要です",
      durationMs: Date.now() - started,
    };
  }
  if (!uiRoute) {
    return {
      success: false,
      error: "route は RAG / WEB / LLM のいずれかが必要です",
      durationMs: Date.now() - started,
    };
  }

  const mainModel = body.mainModel || body.model || defaultMainModel();
  const embedModel = body.embedModel;
  const topK = Number(body.topK) || 3;
  const maxResults = Number(body.maxResults) || 5;
  const searchDepth = body.searchDepth || "basic";
  const collection = body.collection;
  const tenantId = body.tenantId;
  const ai = createAiGatewayClient();
  let steps = buildStepTemplate(uiRoute);

  try {
    let answer = "";
    let sources = [];
    let retrieval = null;
    let web = null;
    let contextPreview = "";
    let generateModel = mainModel;

    if (uiRoute === "RAG") {
      steps = markSteps(steps, ["router"], "embed");
      const embedRes = await ai.embed({
        text: question,
        embedModel,
        tenantId,
      });
      if (!embedRes.ok) {
        return {
          success: false,
          route: uiRoute,
          error: embedRes.error || "Embedding に失敗しました",
          steps: markSteps(steps, ["router"], "embed"),
          durationMs: Date.now() - started,
        };
      }
      steps = markSteps(steps, ["router", "embed"], "qdrant");

      const qdrant = createQdrant({
        collection,
        qdrantUrl: body.qdrantUrl,
        vectorSize: body.vectorSize,
      });
      const tenantScope = resolveTenantScope({
        tenantId,
        collection,
        isolationMode: body.isolationMode || "payload",
        defaultCollection: qdrant.defaultCollection,
        requireTenant: false,
      });
      if (!tenantScope.ok) {
        return {
          success: false,
          route: uiRoute,
          error: tenantScope.error,
          steps,
          durationMs: Date.now() - started,
        };
      }
      // tenant 未指定時も collection は既定名へ（診断表示用）
      const resolvedCollection =
        tenantScope.collection || qdrant.defaultCollection;
      const filter = buildQdrantFilter({
        tenantId: tenantScope.tenantId,
        useTenantFilter: Boolean(tenantScope.tenantId),
      });
      const searched = await searchQdrant({
        qdrant,
        collection: resolvedCollection,
        vector: embedRes.data.vector,
        topK,
        filter,
      });
      retrieval = {
        ...searched,
        dimensions: embedRes.data.dimensions,
        embedModel: embedRes.data.model,
        tenantId: tenantScope.tenantId,
      };
      steps = markSteps(steps, ["router", "embed", "qdrant"], "context");

      const built = buildRagMessages({
        query: question,
        hits: searched.hits,
        template: "strict",
      });
      contextPreview = String(built.context || "").slice(0, 800);
      steps = markSteps(steps, ["router", "embed", "qdrant", "context"], "ollama");

      if (!searched.hits.length) {
        answer =
          "参考になる社内文書が見つかりませんでした。別の言い方で質問するか、文書をインデックスしてください。" +
          (tenantScope.tenantId
            ? `（tenant_id=${tenantScope.tenantId} の filter で 0 件。Step18 の acme/beta や tenant 空で再試行してください）`
            : "（collection に Point が無い、または Embedding モデル不一致の可能性があります。Step6/18 で index してください）");
        steps = markSteps(steps, ["router", "embed", "qdrant", "context", "done"], null).map(
          (s) => (s.id === "ollama" ? { ...s, status: "skipped" } : s),
        );
      } else {
        const genRes = await ai.generate({
          model: mainModel,
          messages: built.messages,
          options: body.options,
          tenantId: tenantScope.tenantId,
        });
        if (!genRes.ok) {
          return {
            success: false,
            route: uiRoute,
            error: genRes.error || "Ollama 回答生成に失敗しました",
            steps: markSteps(steps, ["router", "embed", "qdrant", "context"], "ollama"),
            retrieval,
            durationMs: Date.now() - started,
          };
        }
        answer = genRes.data.answer || "";
        generateModel = genRes.data.model || mainModel;
        steps = markSteps(
          steps,
          ["router", "embed", "qdrant", "context", "ollama", "done"],
        );
      }
    } else if (uiRoute === "WEB") {
      steps = markSteps(steps, ["router"], "tavily");
      const webRes = await ai.web({
        query: question,
        provider: "tavily",
        mode: "context",
        maxResults,
        searchDepth,
        expandRelativeDates: body.expandRelativeDates !== false,
        tenantId,
      });
      if (!webRes.ok) {
        return {
          success: false,
          route: uiRoute,
          error: webRes.error || "Tavily 検索に失敗しました",
          steps: markSteps(steps, ["router"], "tavily"),
          durationMs: Date.now() - started,
        };
      }
      web = webRes.data;
      sources = web.sources || [];
      steps = markSteps(steps, ["router", "tavily", "results"], "ollama");
      contextPreview = String(web.context || "").slice(0, 800);

      if (!sources.length && !String(web.context || "").trim()) {
        answer =
          "参考になる検索結果が見つかりませんでした。質問を具体化するか、別の言い方で試してください。";
        steps = markSteps(steps, ["router", "tavily", "results", "ollama", "done"]);
      } else {
        const messages = [
          {
            role: "system",
            content: [
              "あなたは Web 検索結果だけを根拠に答えるアシスタントです。",
              "回答は必ず日本語のみで書いてください。",
              "参考情報に書かれていない事実は推測しないでください。",
              "分からない場合は「わからない」と明記してください。",
              "可能なら出典番号（[1] など）を示してください。",
            ].join("\n"),
          },
          {
            role: "user",
            content: [
              "## 参考情報（Tavily Web 検索）",
              web.context || formatRagContext([]),
              "",
              "## 質問",
              question,
            ].join("\n"),
          },
        ];
        const genRes = await ai.generate({
          model: mainModel,
          messages,
          options: body.options,
          tenantId,
        });
        if (!genRes.ok) {
          return {
            success: false,
            route: uiRoute,
            error: genRes.error || "Ollama 回答生成に失敗しました",
            steps: markSteps(steps, ["router", "tavily", "results"], "ollama"),
            web,
            sources,
            durationMs: Date.now() - started,
          };
        }
        answer = genRes.data.answer || "";
        generateModel = genRes.data.model || mainModel;
        steps = markSteps(steps, ["router", "tavily", "results", "ollama", "done"]);
      }
    } else {
      // LLM
      steps = markSteps(steps, ["router"], "ollama");
      const messages = [
        {
          role: "system",
          content: [
            "あなたは日本語で答えるアシスタントです。",
            "一般知識に基づき、簡潔に日本語のみで答えてください。",
            "絵文字は使わないでください。",
            "不確かな場合はその旨を述べてください。",
          ].join("\n"),
        },
        { role: "user", content: question },
      ];
      const genRes = await ai.generate({
        model: mainModel,
        messages,
        options: body.options,
        tenantId,
      });
      if (!genRes.ok) {
        return {
          success: false,
          route: uiRoute,
          error: genRes.error || "Ollama 回答生成に失敗しました",
          steps: markSteps(steps, ["router"], "ollama"),
          durationMs: Date.now() - started,
        };
      }
      answer = genRes.data.answer || "";
      generateModel = genRes.data.model || mainModel;
      steps = markSteps(steps, ["router", "ollama", "done"]);
    }

    return {
      success: true,
      route: uiRoute,
      answer,
      steps,
      sources,
      retrieval,
      web: web
        ? {
            searchQuery: web.searchQuery,
            sources: web.sources,
            tavilyDurationMs: web.tavilyDurationMs,
          }
        : null,
      contextPreview,
      mainModel: generateModel,
      durationMs: Date.now() - started,
      aiGateway: {
        mode: ai.usesHttp() ? "http" : "in-process",
      },
    };
  } catch (err) {
    log.error("runStep21Answer error", err);
    return {
      success: false,
      route: uiRoute,
      error: err.message || String(err),
      steps,
      durationMs: Date.now() - started,
    };
  }
}
