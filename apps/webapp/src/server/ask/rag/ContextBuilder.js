/**
 * 案件CPU: RAG Context 組み立て
 */

export const RAG_SYSTEM_PROMPTS = {
  strict: [
    "あなたは社内マニュアルに基づいて答えるアシスタントです。",
    "回答は必ず日本語のみで書いてください。英語や絵文字は使わないでください。",
    "以下の「参考情報」だけを根拠にして答えてください。",
    "参考情報に書かれていないことは推測せず、「わからない」と答えてください。",
    "可能なら、どの参考情報（番号）を使ったかも短く示してください。",
  ].join("\n"),
  normal: [
    "あなたは社内マニュアルを優先して答えるアシスタントです。",
    "回答は必ず日本語のみで書いてください。",
    "まず「参考情報」を根拠にしてください。",
    "参考情報だけで足りない場合は、その旨を添えて一般知識で補足して構いません。",
  ].join("\n"),
};

/**
 * @param {Array<object>} hits
 * @returns {string}
 */
export function formatRagContext(hits = []) {
  if (!hits.length) {
    return "（参考情報なし）";
  }

  return hits
    .map((h) => {
      const meta = [
        h.scoreRounded != null ? `score=${h.scoreRounded}` : null,
        h.source ? `source=${h.source}` : null,
        h.chunkId != null ? `chunkId=${h.chunkId}` : null,
        h.page != null ? `page=${h.page}` : null,
      ]
        .filter(Boolean)
        .join(", ");
      return `[${h.rank}] (${meta})\n${h.text || ""}`.trim();
    })
    .join("\n\n---\n\n");
}

/**
 * @param {object} params
 * @param {string} params.query
 * @param {Array<object>} params.hits
 * @param {"strict"|"normal"} [params.template]
 */
export function buildRagMessages({ query, hits = [], template = "strict" } = {}) {
  const key = template === "normal" ? "normal" : "strict";
  const system = RAG_SYSTEM_PROMPTS[key];
  const context = formatRagContext(hits);
  const userContent = [
    "## 参考情報",
    context,
    "",
    "## 質問",
    String(query || "").trim(),
  ].join("\n");

  const messages = [
    { role: "system", content: system },
    { role: "user", content: userContent },
  ];

  const promptText = [
    "### System",
    system,
    "",
    "### User",
    userContent,
  ].join("\n");

  return {
    template: key,
    system,
    context,
    userContent,
    messages,
    promptText,
  };
}
