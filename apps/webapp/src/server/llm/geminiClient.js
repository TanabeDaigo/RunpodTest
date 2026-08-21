/**
 * Gemini API（学習ラボ / Step20）
 * - 通常 LLM: Gemini 2.5 Flash-Lite（検索なし）
 * - Web 検索: Gemini 2.5 Flash + Google Search Grounding
 *
 * API Key: GEMINI_API_KEY（サーバのみ）
 */

import logjs from "@metrojs/logjs";

const log = new logjs("GeminiClient");

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

/** 通常 LLM（STEP1）。2.5 は新規キー不可 → 3.x エイリアス */
export const GEMINI_LLM_MODEL_DEFAULT = "gemini-flash-latest";
/** Google Search Grounding（STEP2） */
export const GEMINI_SEARCH_MODEL_DEFAULT = "gemini-flash-latest";

export function getGeminiLlmModel() {
  const m = String(
    process.env.GEMINI_LLM_MODEL || process.env.GEMINI_MODEL || GEMINI_LLM_MODEL_DEFAULT,
  ).trim();
  return m.replace(/^models\//, "") || GEMINI_LLM_MODEL_DEFAULT;
}

export function getGeminiSearchModel() {
  const m = String(
    process.env.GEMINI_SEARCH_MODEL || GEMINI_SEARCH_MODEL_DEFAULT,
  ).trim();
  return m.replace(/^models\//, "") || GEMINI_SEARCH_MODEL_DEFAULT;
}

export function getGeminiPublicConfig() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const llmModel = getGeminiLlmModel();
  const searchModel = getGeminiSearchModel();
  return {
    apiKeySet: Boolean(apiKey.trim()),
    model: llmModel,
    llmModel,
    searchModel,
    endpointBase: GEMINI_BASE,
  };
}

function getApiKey() {
  const key = String(process.env.GEMINI_API_KEY || "").trim();
  if (!key) {
    throw new Error("GEMINI_API_KEY が未設定です（env/.env.development）");
  }
  return key;
}

function resolveModel(model, { useGoogleSearch = false } = {}) {
  const fallback = useGoogleSearch ? getGeminiSearchModel() : getGeminiLlmModel();
  const m = String(model || fallback).trim();
  return m.replace(/^models\//, "") || fallback;
}

/**
 * Quota / モデル不可などを日本語ヒント付きにする
 * @param {unknown} err
 */
export function formatGeminiError(err) {
  const msg = String(err?.message || err || "Gemini API error");
  const hints = [];
  if (/quota|rate.?limit|TooManyRequests|\b429\b/i.test(msg)) {
    hints.push("無料枠または Rate Limit 超過の可能性があります。https://ai.dev/rate-limit を確認してください。");
    hints.push("Google Search Grounding は通常の generateContent より枠が厳しいことがあります。");
  }
  if (/no longer available|not found|is not found|NOT_FOUND/i.test(msg)) {
    hints.push(
      "このモデルはこの API キーでは使えない可能性があります。GEMINI_LLM_MODEL / GEMINI_SEARCH_MODEL を gemini-flash-latest などに変更してください。",
    );
  }
  if (/API[_ ]?key|PERMISSION|UNAUTHENTICATED|\b401\b|\b403\b/i.test(msg)) {
    hints.push("GEMINI_API_KEY が無効か、Google AI Studio / Cloud の設定を確認してください。");
  }
  if (/billing|plan and billing/i.test(msg)) {
    hints.push("課金（Pay-as-you-go）が必要な機能の可能性があります。料金表を確認してください。");
  }
  return hints.length ? `${msg}\n\n${hints.join("\n")}` : msg;
}

/**
 * @param {object} data - generateContent レスポンス
 * @returns {string}
 */
export function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  // thought: true は思考サマリ。最終回答は thought なしの text
  const answerParts = parts.filter((p) => typeof p?.text === "string" && p.text && !p.thought);
  const fallback = parts.filter((p) => typeof p?.text === "string" && p.text);
  const use = answerParts.length > 0 ? answerParts : fallback;
  return use
    .map((p) => p.text)
    .join("\n")
    .trim();
}

/**
 * 空回答の切り分け用メタ
 * @param {object} data
 */
export function diagnoseGeminiResponse(data) {
  const candidate = data?.candidates?.[0] || null;
  const parts = candidate?.content?.parts || [];
  const finishReason = candidate?.finishReason || null;
  const usage = data?.usageMetadata || null;
  const promptFeedback = data?.promptFeedback || null;
  const thoughtParts = parts.filter((p) => p?.thought).length;
  const textParts = parts.filter((p) => typeof p?.text === "string" && p.text && !p.thought).length;

  let emptyHint = null;
  if (!candidate) {
    emptyHint =
      promptFeedback?.blockReason
        ? `入力がブロックされました: ${promptFeedback.blockReason}`
        : "candidates が空です（ブロックまたはエラー）";
  } else if (finishReason === "MAX_TOKENS" && textParts === 0) {
    emptyHint =
      "思考トークンで maxOutputTokens を使い切り、本文が空です。maxOutputTokens を増やすか thinking を抑えてください。";
  } else if (finishReason === "SAFETY") {
    emptyHint = "安全フィルタで停止しました";
  } else if (textParts === 0 && thoughtParts > 0) {
    emptyHint = "思考パートのみで本文テキストがありません";
  } else if (textParts === 0) {
    emptyHint = `本文テキストなし (finishReason=${finishReason || "unknown"})`;
  }

  return {
    finishReason,
    promptFeedback,
    thoughtParts,
    textParts,
    thoughtsTokenCount: usage?.thoughtsTokenCount ?? usage?.thoughts_token_count ?? null,
    candidatesTokenCount: usage?.candidatesTokenCount ?? null,
    promptTokenCount: usage?.promptTokenCount ?? null,
    emptyHint,
  };
}

/**
 * groundingMetadata から出典を抜き出す
 * @param {object} data
 */
export function extractGroundingSources(data) {
  const meta = data?.candidates?.[0]?.groundingMetadata || {};
  const chunks = meta.groundingChunks || [];
  const sources = [];
  const seen = new Set();

  for (let i = 0; i < chunks.length; i += 1) {
    const web = chunks[i]?.web;
    if (!web) continue;
    const url = String(web.uri || "").trim();
    const title = String(web.title || "").trim() || url;
    const key = url || title;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    sources.push({
      rank: sources.length + 1,
      title,
      url: url || null,
    });
  }

  return {
    sources,
    webSearchQueries: Array.isArray(meta.webSearchQueries) ? meta.webSearchQueries : [],
    groundingSupports: meta.groundingSupports || [],
    searchEntryPoint: meta.searchEntryPoint || null,
  };
}

/**
 * @param {object} params
 * @param {string} params.prompt
 * @param {string} [params.model]
 * @param {boolean} [params.useGoogleSearch] - true なら tools.google_search
 * @param {string} [params.systemInstruction]
 */
/**
 * Qwen3 等へ渡す Context 用（Grounding 結果）
 * @param {object} result - geminiGenerateContent の戻り
 */
export function formatGeminiContext(result) {
  const lines = [];
  const answer = String(result?.answer || "").trim();
  if (answer) {
    lines.push("## Gemini 検索要約");
    lines.push(answer);
  }
  const sources = result?.grounding?.sources || [];
  if (sources.length > 0) {
    lines.push("");
    lines.push("## 出典");
    sources.forEach((s) => {
      const title = s.title || s.url || "";
      lines.push(`[${s.rank}] ${title}${s.url && s.url !== title ? ` ${s.url}` : ""}`);
    });
  }
  const queries = result?.grounding?.webSearchQueries || [];
  if (queries.length > 0) {
    lines.push("");
    lines.push(`検索クエリ: ${queries.join(" / ")}`);
  }
  return lines.join("\n").trim();
}

function buildThinkingConfig(modelId) {
  const m = String(modelId || "").toLowerCase();
  if (/2\.5/.test(m) || /flash-lite/.test(m)) {
    return { thinkingBudget: 0 };
  }
  return { thinkingLevel: "minimal" };
}

export async function geminiGenerateContent({
  prompt,
  model,
  useGoogleSearch = false,
  systemInstruction,
} = {}) {
  const started = Date.now();
  const apiKey = getApiKey();
  const modelId = resolveModel(model, { useGoogleSearch });
  const text = String(prompt || "").trim();
  if (!text) {
    throw new Error("prompt が必要です");
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text }],
      },
    ],
  };

  if (systemInstruction && String(systemInstruction).trim()) {
    body.systemInstruction = {
      parts: [{ text: String(systemInstruction).trim() }],
    };
  }

  if (useGoogleSearch) {
    body.tools = [{ google_search: {} }];
  }

  // 2.5: thinkingBudget / 3.x: thinkingLevel。非対応なら後段で外して再試行
  body.generationConfig = {
    maxOutputTokens: 8192,
    thinkingConfig: buildThinkingConfig(modelId),
  };

  const url = `${GEMINI_BASE}/models/${encodeURIComponent(modelId)}:generateContent`;
  log.info("[GeminiClient] generateContent", {
    model: modelId,
    useGoogleSearch: useGoogleSearch === true,
    promptLen: text.length,
  });

  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  let rawText = await res.text();
  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error(`Gemini 応答が JSON ではありません (HTTP ${res.status})`);
  }

  // thinking 設定が拒否されたら、3.x なら low、だめなら設定なし
  const thinkingError = !res.ok && /thinking|Thinking/i.test(String(data?.error?.message || ""));
  const isGemini25 = /2\.5/.test(String(modelId));
  if (thinkingError && !isGemini25) {
    body.generationConfig.thinkingConfig = { thinkingLevel: "low" };
    log.info("[GeminiClient] retry thinkingLevel=low", { model: modelId });
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });
    rawText = await res.text();
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(`Gemini 応答が JSON ではありません (HTTP ${res.status})`);
    }
  }

  if (!res.ok && /thinking|Thinking/i.test(String(data?.error?.message || ""))) {
    delete body.generationConfig.thinkingConfig;
    log.info("[GeminiClient] retry without thinkingConfig", { model: modelId });
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });
    rawText = await res.text();
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(`Gemini 応答が JSON ではありません (HTTP ${res.status})`);
    }
  }

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      `Gemini API error HTTP ${res.status}`;
    throw new Error(msg);
  }

  const answer = extractGeminiText(data);
  const grounding = extractGroundingSources(data);
  const diagnosis = diagnoseGeminiResponse(data);
  const finishReason = diagnosis.finishReason;
  const usage = data?.usageMetadata || null;

  if (!answer) {
    log.warn("[GeminiClient] empty answer", diagnosis);
  }

  return {
    model: modelId,
    answer,
    finishReason,
    usage,
    diagnosis,
    grounding,
    raw: data,
    durationMs: Date.now() - started,
    usedGoogleSearch: useGoogleSearch === true,
  };
}

/**
 * 疎通: 短い質問（検索なし）
 */
export async function geminiCheckHealth() {
  const started = Date.now();
  try {
    const result = await geminiGenerateContent({
      prompt: "OK とだけ日本語で返してください。",
      model: getGeminiLlmModel(),
      useGoogleSearch: false,
    });
    return {
      ok: true,
      model: result.model,
      answerPreview: String(result.answer || "").slice(0, 80),
      durationMs: Date.now() - started,
      config: getGeminiPublicConfig(),
    };
  } catch (err) {
    return {
      ok: false,
      error: formatGeminiError(err),
      durationMs: Date.now() - started,
      config: getGeminiPublicConfig(),
    };
  }
}
