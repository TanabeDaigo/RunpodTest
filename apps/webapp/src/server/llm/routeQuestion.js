/**
 * Step17: Router LLM — 質問を internal / web / general に分類
 */

export const ROUTER_ROUTES = ["internal", "web", "general"];

export const ROUTER_SYSTEM_PROMPT = [
  "あなたはAIルーターです。",
  "ユーザーの質問を次のいずれか1つに分類してください。",
  "",
  "internal",
  "- 契約書・顧客情報・案件情報・社内規程・マニュアル・社内文書",
  "",
  "web",
  "- 株価・ニュース・天気・試合結果・今日/昨日など最新の公開情報",
  "",
  "general",
  "- 一般知識・数学・歴史・プログラミング・定義の説明",
  "",
  "JSONのみ返してください。前置き・解説・コードフェンスは禁止です。",
  '形式: {"route":"internal|web|general","entity_name":"","confidence":0.0}',
  "entity_name は社名・製品名など分かれば入れ、無ければ空文字。",
  "confidence は 0.0〜1.0。",
].join("\n");

/**
 * @param {string} text
 * @returns {string}
 */
export function stripRouterNoise(text) {
  let t = String(text || "");
  t = t.replace(/<think>[\s\S]*?<\/think>/gi, "");
  t = t.replace(/```(?:json)?\s*([\s\S]*?)```/gi, "$1");
  return t.trim();
}

/**
 * @param {string} raw
 * @returns {{ route: string, entity_name: string, confidence: number } | null}
 */
export function parseRouterJson(raw) {
  const cleaned = stripRouterNoise(raw);
  if (!cleaned) return null;

  let obj = null;
  try {
    obj = JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      obj = JSON.parse(m[0]);
    } catch {
      return null;
    }
  }

  if (!obj || typeof obj !== "object") return null;

  const route = String(obj.route || "")
    .trim()
    .toLowerCase();
  if (!ROUTER_ROUTES.includes(route)) return null;

  let confidence = Number(obj.confidence);
  if (!Number.isFinite(confidence)) confidence = 0.5;
  confidence = Math.max(0, Math.min(1, confidence));

  return {
    route,
    entity_name: String(obj.entity_name || "").trim(),
    confidence,
  };
}

/**
 * Router LLM を1回（失敗時もう1回）呼ぶ
 * @param {object} ollama - OllamaService
 * @param {object} params
 * @param {string} params.query
 * @param {string} [params.model]
 * @param {object} [params.options]
 */
export async function runRouterQuestion(ollama, { query, model, options } = {}) {
  const q = String(query || "").trim();
  if (!q) {
    throw new Error("query is required for router");
  }

  const messages = [
    { role: "system", content: ROUTER_SYSTEM_PROMPT },
    { role: "user", content: q },
  ];

  const started = Date.now();
  let raw = "";
  let chatResult = null;
  let parsed = null;
  let attempts = 0;

  for (let i = 0; i < 2; i += 1) {
    attempts += 1;
    const retryHint =
      i === 0
        ? q
        : [
            q,
            "",
            "前回の出力が不正でした。JSONオブジェクト1つだけを返してください。",
            '{"route":"general","entity_name":"","confidence":0.5}',
          ].join("\n");

    chatResult = await ollama.chat({
      model,
      messages: [
        { role: "system", content: ROUTER_SYSTEM_PROMPT },
        { role: "user", content: retryHint },
      ],
      options,
    });
    raw = chatResult?.content || "";
    parsed = parseRouterJson(raw);
    if (parsed) break;
  }

  if (!parsed) {
    parsed = { route: "general", entity_name: "", confidence: 0.3 };
  }

  return {
    model: chatResult?.model || model || null,
    raw,
    parsed,
    attempts,
    durationMs: Date.now() - started,
    chatDurationMs: chatResult?.totalDurationMs ?? null,
    messages,
  };
}

/**
 * @param {string|null|undefined} forceRoute
 * @returns {string|null}
 */
export function normalizeForceRoute(forceRoute) {
  if (forceRoute == null || forceRoute === "" || forceRoute === "auto") return null;
  const r = String(forceRoute).trim().toLowerCase();
  return ROUTER_ROUTES.includes(r) ? r : null;
}
