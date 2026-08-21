/**
 * 案件CPU: AskOrchestrator
 * Router → RAG / Web / General → Main LLM（ステップ分割で GPU を呼ぶ）
 */

import logjs from "@metrojs/logjs";
import { getTavilyPublicConfig } from "../llm/tavilyClient.js";
import { getGeminiPublicConfig } from "../llm/geminiClient.js";
import {
  buildQdrantFilter,
  resolveTenantScope,
} from "../llm/tenantScope.js";
import { createAiGatewayClient } from "./AiGatewayClient.js";
import {
  appendChatMemoryRow,
  listChatMemoryRows,
  toOllamaChatMessages,
} from "./memory.js";
import { buildRagMessages, formatRagContext } from "./rag/ContextBuilder.js";
import { createQdrant, searchQdrant } from "./rag/QdrantSearch.js";

const log = new logjs("AskOrchestrator");

/**
 * @param {object} params - orchestrateAsk 相当のパラメータ
 * @param {object} [deps]
 * @param {import('./AiGatewayClient.js').AiGatewayClient} [deps.ai]
 * @param {object} [deps.qdrant]
 */
export async function runOrchestrateAsk(params = {}, deps = {}) {
  const started = Date.now();
  const flow = ["質問"];
  const ai = deps.ai || createAiGatewayClient();

  try {
    const {
      query,
      routerModel,
      mainModel,
      model,
      collection,
      tenantId,
      forceRoute,
      skipAnswer = false,
      topK = 3,
      scoreThreshold = 0.55,
      routerConfidenceThreshold = 0.6,
      allowInternalPromote = false,
      maxResults = 5,
      searchDepth = "basic",
      expandRelativeDates = true,
      embedModel,
      options,
      webProvider = "tavily",
      geminiModel,
      isolationMode = "payload",
      requireTenant = false,
      useMemory = false,
      userId,
      sessionId = "default",
      memoryLimit = 12,
      qdrantUrl,
      vectorSize,
    } = params;

    const raw = String(query || "").trim();
    if (!raw) {
      return { success: false, error: "query が必要です" };
    }

    const resolvedRouterModel = routerModel || model;
    const resolvedMainModel = mainModel || model || routerModel;
    if (!skipAnswer && !resolvedMainModel) {
      return { success: false, error: "mainModel（または model）が必要です" };
    }
    if (!forceRoute && !resolvedRouterModel) {
      return { success: false, error: "routerModel（または model）が必要です" };
    }

    const qdrantForScope = deps.qdrant || createQdrant({ qdrantUrl, collection, vectorSize });
    const tenantScope = resolveTenantScope({
      tenantId,
      collection,
      isolationMode,
      defaultCollection: qdrantForScope.defaultCollection,
      requireTenant: false,
    });
    if (!tenantScope.ok) {
      return { success: false, error: tenantScope.error, step: 17 };
    }
    const resolvedCollection = tenantScope.collection;
    const tenantFilter = buildQdrantFilter({
      tenantId: tenantScope.tenantId,
      useTenantFilter: Boolean(tenantScope.tenantId),
    });

    // ── ① Router（GPU）──────────────────────────────────────
    const routeRes = await ai.route({
      query: raw,
      routerModel: resolvedRouterModel,
      forceRoute,
      tenantId: tenantScope.tenantId,
      options,
    });
    if (!routeRes.ok) {
      return {
        success: false,
        step: 17,
        error: routeRes.error || "Router に失敗しました",
        flow,
        totalDurationMs: Date.now() - started,
      };
    }

    const routerData = routeRes.data || {};
    const tentativeRoute = routerData.route;
    const routerBlock = {
      skipped: routerData.skipped === true,
      forceRoute: routerData.forceRoute || null,
      model: routerData.model,
      raw: routerData.raw,
      parsed: routerData.parsed || {
        route: tentativeRoute,
        entity_name: routerData.entity_name || "",
        confidence: routerData.confidence ?? 1,
      },
      durationMs: routeRes.durationMs,
      attempts: routerData.attempts || 0,
    };

    if (routerBlock.skipped) {
      flow.push(`forceRoute=${tentativeRoute}`);
    } else {
      flow.push("Router LLM");
      flow.push(`router→${tentativeRoute} (conf=${routerBlock.parsed.confidence})`);
    }

    const conf = Number(routerBlock.parsed?.confidence ?? 0);
    const scoreThr =
      typeof scoreThreshold === "number" ? scoreThreshold : Number(scoreThreshold) || 0.55;
    const confThr =
      typeof routerConfidenceThreshold === "number"
        ? routerConfidenceThreshold
        : Number(routerConfidenceThreshold) || 0.6;

    // ── ② Vector Search（ゲート用）──────────────────────────
    let retrieval = null;
    let hits = [];
    let topScore = null;
    const needRetrieve =
      tentativeRoute === "internal" ||
      (allowInternalPromote === true && tentativeRoute === "general");

    if (needRetrieve) {
      if (requireTenant === true && !tenantScope.tenantId) {
        return {
          success: false,
          step: 18,
          error: "internal 検索には tenantId が必要です（requireTenant）",
          flow,
        };
      }
      flow.push(
        tenantScope.tenantId
          ? `Vector Search（ゲート, tenant=${tenantScope.tenantId}）`
          : "Vector Search（ゲート）",
      );
      const embedRes = await ai.embed({
        text: raw,
        embedModel,
        tenantId: tenantScope.tenantId,
      });
      if (!embedRes.ok) {
        return {
          success: false,
          step: 17,
          error: embedRes.error || "Embedding に失敗しました",
          flow,
          totalDurationMs: Date.now() - started,
        };
      }
      const searched = await searchQdrant({
        qdrant: qdrantForScope,
        collection: resolvedCollection,
        vector: embedRes.data.vector,
        topK,
        scoreThreshold: undefined,
        filter: tenantFilter,
      });
      hits = searched.hits;
      topScore = searched.topScore;
      retrieval = {
        ...searched,
        dimensions: embedRes.data.dimensions,
        embedModel: embedRes.data.model,
        tenantId: tenantScope.tenantId,
        isolationMode: tenantScope.isolationMode,
      };
    }

    // ── ③ 最終ルート決定 ──────────────────────────────────
    let finalRoute = "general";
    let routeReason = "";
    const forced = routerBlock.forceRoute;

    if (forced) {
      finalRoute = forced;
      routeReason = `forceRoute=${forced}`;
    } else if (tentativeRoute === "web") {
      finalRoute = "web";
      routeReason = `router=web (conf=${conf})`;
    } else if (tentativeRoute === "internal") {
      const scoreOk = topScore != null && topScore >= scoreThr;
      if (scoreOk) {
        finalRoute = "internal";
        routeReason =
          conf >= confThr
            ? `router=internal (conf=${conf}) + topScore=${topScore?.toFixed?.(4) ?? topScore}`
            : `router=internal だが conf 低 (${conf}<${confThr})。topScore=${topScore?.toFixed?.(4) ?? topScore} が高いため internal 維持`;
      } else {
        finalRoute = "general";
        routeReason = `router=internal だが topScore=${topScore ?? "なし"} < ${scoreThr} → general`;
      }
    } else if (
      tentativeRoute === "general" &&
      allowInternalPromote === true &&
      topScore != null &&
      topScore >= scoreThr
    ) {
      finalRoute = "internal";
      routeReason = `router=general だが topScore=${topScore.toFixed(4)} ≥ ${scoreThr} → internal 昇格`;
    } else {
      finalRoute = "general";
      routeReason = `router=general (conf=${conf})`;
    }

    flow.push(`最終 route=${finalRoute}`);

    // ── ④ コンテキスト取得 ────────────────────────────────
    let web = null;
    let context = "";
    let usedQdrant = false;
    let usedTavily = false;
    let usedGemini = false;
    const resolvedWebProvider =
      String(webProvider || "tavily").toLowerCase() === "gemini" ? "gemini" : "tavily";

    if (finalRoute === "internal") {
      usedQdrant = true;
      if (requireTenant === true && !tenantScope.tenantId) {
        return {
          success: false,
          step: 18,
          error: "internal ルートには tenantId が必要です（requireTenant）",
          route: finalRoute,
          routeReason,
          flow,
        };
      }
      if (!retrieval) {
        flow.push(
          tenantScope.tenantId
            ? `RAG retrieve (tenant=${tenantScope.tenantId})`
            : "RAG retrieve",
        );
        const embedRes = await ai.embed({
          text: raw,
          embedModel,
          tenantId: tenantScope.tenantId,
        });
        if (!embedRes.ok) {
          return {
            success: false,
            step: 17,
            error: embedRes.error || "Embedding に失敗しました",
            flow,
            totalDurationMs: Date.now() - started,
          };
        }
        const searched = await searchQdrant({
          qdrant: qdrantForScope,
          collection: resolvedCollection,
          vector: embedRes.data.vector,
          topK,
          filter: tenantFilter,
        });
        hits = searched.hits;
        topScore = searched.topScore;
        retrieval = {
          ...searched,
          dimensions: embedRes.data.dimensions,
          embedModel: embedRes.data.model,
          tenantId: tenantScope.tenantId,
          isolationMode: tenantScope.isolationMode,
        };
      } else {
        flow.push("RAG Context（ゲート結果を流用）");
      }
      context = formatRagContext(hits);
    } else if (finalRoute === "web") {
      const webLabel =
        resolvedWebProvider === "gemini" ? "Gemini Search Grounding" : "Tavily Search";
      flow.push(webLabel);
      const webRes = await ai.web({
        query: raw,
        provider: resolvedWebProvider,
        mode: "context",
        maxResults,
        searchDepth,
        expandRelativeDates,
        geminiModel,
        tenantId: tenantScope.tenantId,
      });
      if (!webRes.ok) {
        return {
          success: false,
          step: 17,
          error: webRes.error || "Web 検索に失敗しました",
          route: finalRoute,
          routeReason,
          flow,
          totalDurationMs: Date.now() - started,
        };
      }
      const w = webRes.data;
      context = w.context || "";
      usedTavily = w.provider === "tavily";
      usedGemini = w.provider === "gemini";
      web = {
        provider: w.provider,
        searchQuery: w.searchQuery,
        sources: w.sources || [],
        webSearchQueries: w.webSearchQueries,
        geminiAnswer: w.geminiAnswer,
        results: w.results,
        tavilyDurationMs: w.tavilyDurationMs,
        geminiDurationMs: w.geminiDurationMs,
        searchDepth: w.searchDepth,
        maxResults: w.maxResults,
        model: w.model,
        finishReason: w.finishReason,
        usage: w.usage,
      };
    } else {
      flow.push("Context なし（general）");
      context = "";
    }

    // ── ⑤ Main LLM（GPU generate）──────────────────────────
    let answer = null;
    let chatResult = null;
    let mainMessages = null;
    let memoryBlock = null;

    if (!skipAnswer) {
      flow.push("Main LLM");
      let system;
      let userContent;

      if (finalRoute === "internal") {
        const built = buildRagMessages({ query: raw, hits, template: "strict" });
        system = built.system;
        userContent = built.userContent;
        mainMessages = built.messages;
        context = built.context;
      } else if (finalRoute === "web") {
        const hasWebEvidence =
          (web?.sources?.length || 0) > 0 || Boolean(String(web?.geminiAnswer || "").trim());
        if (!hasWebEvidence) {
          answer =
            "参考になる検索結果が見つかりませんでした。質問を具体化するか、別の言い方で試してください。";
          flow.push("Web ヒットなし → 定型回答");
        } else {
          const webLabel =
            web?.provider === "gemini" ? "Gemini Google Search" : "Tavily Web 検索";
          system = [
            "あなたは Web 検索結果だけを根拠に答えるアシスタントです。",
            "回答は必ず日本語のみで書いてください。",
            "参考情報に書かれていない事実は推測しないでください。",
            "分からない場合は「わからない」と明記してください。",
            "可能なら出典番号（[1] など）を示し、最後に主な URL を列挙してください。",
          ].join("\n");
          userContent = [
            `## 参考情報（${webLabel}）`,
            context,
            "",
            "## 質問",
            raw,
          ].join("\n");
          mainMessages = [
            { role: "system", content: system },
            { role: "user", content: userContent },
          ];
        }
      } else {
        system = [
          "あなたは日本語で答えるアシスタントです。",
          "一般知識に基づき、簡潔に日本語のみで答えてください。",
          "絵文字・顔文字・英語の飾り書きは使わないでください。",
          "不確かな場合はその旨を述べてください。",
          "直前の会話がある場合は、その文脈を踏まえて答えてください。",
        ].join("\n");
        userContent = raw;
        mainMessages = [
          { role: "system", content: system },
          { role: "user", content: userContent },
        ];
      }

      if (useMemory === true && answer == null && mainMessages) {
        if (!tenantScope.tenantId) {
          return {
            success: false,
            step: 19,
            error: "useMemory には tenantId が必要です",
            flow,
          };
        }
        if (!userId || !String(userId).trim()) {
          return {
            success: false,
            step: 19,
            error: "useMemory には userId が必要です",
            flow,
          };
        }
        try {
          const listed = await listChatMemoryRows({
            tenantId: tenantScope.tenantId,
            userId,
            sessionId,
            limit: memoryLimit,
          });
          const prior = toOllamaChatMessages(listed.messages).filter(
            (m) => m.role === "user" || m.role === "assistant",
          );
          memoryBlock = {
            tenantId: listed.tenantId,
            userId: listed.userId,
            sessionId: listed.sessionId,
            limit: listed.limit,
            loadedCount: prior.length,
            messages: listed.messages,
          };
          if (prior.length > 0) {
            const sysMsgs = mainMessages.filter((m) => m.role === "system");
            const nonSys = mainMessages.filter((m) => m.role !== "system");
            mainMessages = [...sysMsgs, ...prior, ...nonSys];
            flow.push(`Memory 注入 ${prior.length} 件`);
          } else {
            flow.push("Memory 空（初回）");
          }
        } catch (memErr) {
          log.error("listChatMemory error", memErr);
          return {
            success: false,
            step: 19,
            error: memErr.message || "Memory の取得に失敗しました",
            flow,
          };
        }
      }

      if (answer == null && mainMessages) {
        const genRes = await ai.generate({
          model: resolvedMainModel,
          messages: mainMessages,
          options,
          tenantId: tenantScope.tenantId,
        });
        if (!genRes.ok) {
          return {
            success: false,
            step: 17,
            error: genRes.error || "Generate に失敗しました",
            flow,
            totalDurationMs: Date.now() - started,
          };
        }
        chatResult = {
          model: genRes.data.model,
          content: genRes.data.answer,
          totalDurationMs: genRes.data.totalDurationMs ?? genRes.durationMs,
        };
        answer = chatResult.content;
      }

      if (useMemory === true && answer != null && String(answer).trim()) {
        try {
          await appendChatMemoryRow({
            tenantId: tenantScope.tenantId,
            userId,
            sessionId,
            role: "user",
            content: raw,
          });
          await appendChatMemoryRow({
            tenantId: tenantScope.tenantId,
            userId,
            sessionId,
            role: "assistant",
            content: String(answer).trim(),
          });
          flow.push("Memory 追記（user+assistant）");
          if (memoryBlock) {
            memoryBlock.appended = true;
          } else {
            memoryBlock = {
              tenantId: tenantScope.tenantId,
              userId: String(userId).trim(),
              sessionId: String(sessionId || "default"),
              appended: true,
            };
          }
        } catch (memErr) {
          log.error("appendChatMemory error", memErr);
          return {
            success: false,
            step: 19,
            error: memErr.message || "Memory の保存に失敗しました",
            answer,
            flow,
          };
        }
      }
    } else {
      flow.push("LLM スキップ（skipAnswer）");
    }

    const contextPreview = String(context || "").slice(0, 800);

    return {
      success: true,
      step: 17,
      stepName: "Router → RAG / Web / General",
      query: raw,
      tenantId: tenantScope.tenantId,
      isolationMode: tenantScope.isolationMode,
      requireTenant: requireTenant === true,
      router: routerBlock,
      route: finalRoute,
      routeReason,
      thresholds: {
        scoreThreshold: scoreThr,
        routerConfidenceThreshold: confThr,
        allowInternalPromote: allowInternalPromote === true,
      },
      retrieval,
      web,
      memory: memoryBlock,
      useMemory: useMemory === true,
      userId: userId != null && String(userId).trim() ? String(userId).trim() : null,
      sessionId: String(sessionId || "default"),
      contextPreview,
      contextFullLength: String(context || "").length,
      answer,
      routerModel: resolvedRouterModel || null,
      mainModel: chatResult?.model || resolvedMainModel || null,
      chatDurationMs: chatResult?.totalDurationMs ?? null,
      skipAnswer: skipAnswer === true,
      usedOllama: skipAnswer !== true || !forced,
      usedQdrant,
      usedTavily,
      usedGemini,
      webProvider: finalRoute === "web" ? resolvedWebProvider : null,
      flow,
      note: tenantScope.tenantId
        ? `tenant_id=${tenantScope.tenantId} で internal を隔離（${tenantScope.isolationMode}）。GPU は route/embed/generate/web 分割呼び出し。`
        : "tenantId 未指定。GPU は route/embed/generate/web 分割呼び出し。",
      totalDurationMs: Date.now() - started,
      tavilyConfig: usedTavily ? getTavilyPublicConfig() : undefined,
      geminiConfig: usedGemini ? getGeminiPublicConfig() : undefined,
      aiGateway: {
        mode: ai.usesHttp() ? "http" : "in-process",
        baseUrl: process.env.AI_GATEWAY_BASE_URL || null,
      },
    };
  } catch (err) {
    log.error("runOrchestrateAsk error", err);
    return {
      success: false,
      step: 17,
      error: err.message,
      flow,
      totalDurationMs: Date.now() - started,
    };
  }
}
