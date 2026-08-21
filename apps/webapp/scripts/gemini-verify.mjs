/**
 * Gemini API 最小検証（アプリ非依存）
 *
 * STEP1 通常 LLM:   pnpm --filter webapp gemini:verify
 * STEP2 Grounding:  pnpm --filter webapp gemini:verify -- --search
 *
 * 任意:
 *   --query "日本で一番高い山は？"
 *   --model gemini-flash-latest
 */
import fs from "fs";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const LLM_DEFAULT = "gemini-flash-latest";
const SEARCH_DEFAULT = "gemini-flash-latest";

const envText = fs.readFileSync(
  new URL("../../../env/.env.development", import.meta.url),
  "utf8",
);
const env = Object.fromEntries(
  [...envText.matchAll(/^([A-Z0-9_]+)=(.*)$/gm)].map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);

const args = process.argv.slice(2);
const useSearch = args.includes("--search");
const queryIdx = args.indexOf("--query");
const modelIdx = args.indexOf("--model");
const query =
  (queryIdx >= 0 ? args[queryIdx + 1] : "") ||
  (useSearch ? "2026年の最新AIニュースを教えて" : "日本で一番高い山は？");
const model =
  (modelIdx >= 0 ? args[modelIdx + 1] : "") ||
  (useSearch
    ? env.GEMINI_SEARCH_MODEL || SEARCH_DEFAULT
    : env.GEMINI_LLM_MODEL || env.GEMINI_MODEL || LLM_DEFAULT);

const apiKey = String(env.GEMINI_API_KEY || "").trim();

function hintFor(message) {
  const hints = [];
  if (/quota|rate.?limit|TooManyRequests|\b429\b/i.test(message)) {
    hints.push("- 無料枠 / Rate Limit 超過の可能性 → https://ai.dev/rate-limit");
    hints.push("- Grounding は通常呼び出しより枠が厳しいことがあります");
  }
  if (/no longer available|not found|NOT_FOUND/i.test(message)) {
    hints.push("- このキーではモデルが使えない可能性 → gemini-flash-latest を試す");
  }
  if (/API[_ ]?key|PERMISSION|UNAUTHENTICATED|\b401\b|\b403\b/i.test(message)) {
    hints.push("- GEMINI_API_KEY または AI Studio / Cloud 設定を確認");
  }
  if (/billing|plan and billing/i.test(message)) {
    hints.push("- 課金が必要な機能の可能性。料金表を確認");
  }
  return hints;
}

if (!apiKey) {
  console.error("GEMINI_API_KEY が未設定です（env/.env.development）");
  process.exit(1);
}

const body = {
  contents: [{ role: "user", parts: [{ text: query }] }],
  systemInstruction: {
    parts: [{ text: "回答は日本語のみ。分からなければ分からないと述べてください。" }],
  },
  generationConfig: { maxOutputTokens: 2048 },
};
if (useSearch) {
  body.tools = [{ google_search: {} }];
}

const url = `${GEMINI_BASE}/models/${encodeURIComponent(model)}:generateContent`;
console.log("=== Gemini verify ===");
console.log("step   :", useSearch ? "STEP2 Google Search Grounding" : "STEP1 通常 LLM");
console.log("model  :", model);
console.log("search :", useSearch);
console.log("query  :", query);
console.log("");

const started = Date.now();
const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-goog-api-key": apiKey,
  },
  body: JSON.stringify(body),
});
const rawText = await res.text();
let data = {};
try {
  data = rawText ? JSON.parse(rawText) : {};
} catch {
  console.error(`JSON ではありません (HTTP ${res.status})`);
  console.error(rawText.slice(0, 500));
  process.exit(1);
}

if (!res.ok) {
  const message = data?.error?.message || data?.message || `HTTP ${res.status}`;
  console.error("ERROR:", message);
  const hints = hintFor(message);
  if (hints.length) {
    console.error("");
    hints.forEach((h) => console.error(h));
  }
  process.exit(1);
}

const parts = data?.candidates?.[0]?.content?.parts || [];
const answer = parts
  .filter((p) => typeof p?.text === "string" && p.text && !p.thought)
  .map((p) => p.text)
  .join("\n")
  .trim();
const meta = data?.candidates?.[0]?.groundingMetadata || {};
const sources = (meta.groundingChunks || [])
  .map((c) => c?.web)
  .filter(Boolean)
  .map((web, i) => ({ rank: i + 1, title: web.title, url: web.uri }));

console.log("duration:", Date.now() - started, "ms");
console.log("finish  :", data?.candidates?.[0]?.finishReason || "-");
console.log("");
console.log("--- answer ---");
console.log(answer || "(空の回答)");
if (useSearch) {
  console.log("");
  console.log("--- search queries ---");
  console.log((meta.webSearchQueries || []).join(" / ") || "(なし)");
  console.log("");
  console.log("--- sources ---");
  if (!sources.length) console.log("(なし)");
  sources.forEach((s) => console.log(`[${s.rank}] ${s.title || ""} ${s.url || ""}`.trim()));
}
console.log("");
console.log("usage:", JSON.stringify(data?.usageMetadata || {}, null, 2));
