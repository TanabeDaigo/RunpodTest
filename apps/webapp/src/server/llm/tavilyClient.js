/**
 * Tavily Web Search（LLM 学習ラボ / Step15）
 * API Key は env TAVILY_API_KEY（サーバのみ）
 */

import logjs from "@metrojs/logjs";

const log = new logjs("TavilyClient");

const TAVILY_SEARCH_URL = "https://api.tavily.com/search";

export function getTavilyPublicConfig() {
  const apiKey = process.env.TAVILY_API_KEY || "";
  const depth = process.env.TAVILY_SEARCH_DEPTH || "basic";
  return {
    apiKeySet: Boolean(apiKey.trim()),
    searchDepth: depth === "advanced" ? "advanced" : "basic",
    maxResults: Math.min(Math.max(Number(process.env.TAVILY_MAX_RESULTS || 5), 1), 10),
    endpoint: TAVILY_SEARCH_URL,
  };
}

/**
 * 「昨日」「今日」などを JST の具体日付付きクエリに寄せる
 * @param {string} query
 * @param {Date} [now]
 */
export function expandSearchQuery(query, now = new Date()) {
  const q = String(query || "").trim();
  if (!q) return "";

  const fmt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jstParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = Number(jstParts.find((p) => p.type === "year")?.value);
  const m = Number(jstParts.find((p) => p.type === "month")?.value);
  const d = Number(jstParts.find((p) => p.type === "day")?.value);
  const todayJst = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

  const dayLabel = (offset) => {
    const dt = new Date(todayJst);
    dt.setUTCDate(dt.getUTCDate() + offset);
    return fmt.format(dt);
  };

  let out = q;
  const extras = [];
  if (/昨日/.test(q)) {
    extras.push(dayLabel(-1));
  }
  if (/今日|本日/.test(q)) {
    extras.push(dayLabel(0));
  }
  if (/一昨日/.test(q)) {
    extras.push(dayLabel(-2));
  }
  if (extras.length) {
    out = `${q} ${extras.join(" ")}`;
  }
  return out;
}

/**
 * @param {object} params
 * @param {string} params.query
 * @param {number} [params.maxResults]
 * @param {"basic"|"advanced"} [params.searchDepth]
 * @param {boolean} [params.includeAnswer]
 */
export async function tavilySearch({
  query,
  maxResults,
  searchDepth,
  includeAnswer = false,
} = {}) {
  const cfg = getTavilyPublicConfig();
  const apiKey = (process.env.TAVILY_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY が未設定です。env/.env.development に追加してください。");
  }

  const q = String(query || "").trim();
  if (!q) {
    throw new Error("query が空です");
  }

  const depth = searchDepth === "advanced" ? "advanced" : cfg.searchDepth;
  const limit = Math.min(
    Math.max(Number(maxResults) || cfg.maxResults, 1),
    10,
  );

  const started = Date.now();
  const res = await fetch(TAVILY_SEARCH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: q,
      search_depth: depth,
      max_results: limit,
      include_answer: includeAnswer === true,
      include_images: false,
    }),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Tavily 応答の JSON 解析に失敗しました (HTTP ${res.status})`);
  }

  if (!res.ok) {
    const msg = data?.detail || data?.error || data?.message || text || res.statusText;
    log.error("tavilySearch HTTP error", { status: res.status, msg });
    throw new Error(`Tavily API error (${res.status}): ${msg}`);
  }

  const results = Array.isArray(data.results)
    ? data.results.map((r, i) => ({
        rank: i + 1,
        title: r.title || "",
        url: r.url || "",
        content: r.content || "",
        score: r.score,
        publishedDate: r.published_date || null,
      }))
    : [];

  return {
    query: data.query || q,
    answer: data.answer || null,
    results,
    searchDepth: depth,
    maxResults: limit,
    durationMs: Date.now() - started,
    responseTime: data.response_time ?? null,
  };
}

/**
 * 検索結果を LLM / 画面用のテキストに
 * @param {Array<object>} results
 */
export function formatTavilyContext(results = []) {
  if (!results.length) {
    return "（検索結果なし）";
  }
  return results
    .map((r) => {
      const meta = [
        r.score != null ? `score=${Number(r.score).toFixed(3)}` : null,
        r.publishedDate ? `date=${r.publishedDate}` : null,
      ]
        .filter(Boolean)
        .join(", ");
      return [
        `[${r.rank}] ${r.title || "(no title)"}`,
        meta ? `(${meta})` : null,
        r.url ? `URL: ${r.url}` : null,
        r.content || "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n---\n\n");
}
