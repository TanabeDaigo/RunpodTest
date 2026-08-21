/**
 * 案件CPU: Qdrant 類似検索（Embedding は GPU embed の結果を受け取る）
 */
import { service } from "@lib/server";

const { QdrantService } = service;

/**
 * @param {object} [opts]
 */
export function createQdrant(opts = {}) {
  return new QdrantService({
    baseUrl: opts.baseUrl || opts.qdrantUrl,
    collection: opts.collection,
    vectorSize: opts.vectorSize,
  });
}

/**
 * @param {object} params
 * @param {object} [params.qdrant]
 * @param {string} params.collection
 * @param {number[]} params.vector
 * @param {number} [params.topK]
 * @param {number} [params.scoreThreshold]
 * @param {object|null} [params.filter]
 */
export async function searchQdrant({
  qdrant,
  collection,
  vector,
  topK = 3,
  scoreThreshold,
  filter = null,
} = {}) {
  const client = qdrant || createQdrant({ collection });
  const searched = await client.search({
    collection,
    vector,
    limit: Number(topK) || 3,
    scoreThreshold,
    filter: filter || undefined,
  });

  const hits = (searched.hits || []).map((h, rank) => ({
    rank: rank + 1,
    id: h.id,
    score: h.score,
    scoreRounded: typeof h.score === "number" ? Number(h.score.toFixed(4)) : h.score,
    text: h.payload?.text ?? "",
    source: h.payload?.source ?? null,
    tenantId: h.payload?.tenant_id ?? null,
    page: h.payload?.page ?? null,
    chunkId: h.payload?.chunkId ?? null,
    textPreview: String(h.payload?.text || "").slice(0, 120),
  }));

  const topScore =
    hits.length > 0 && typeof hits[0].score === "number" ? hits[0].score : null;

  return {
    collection: searched.collection,
    topK: searched.limit,
    hitCount: hits.length,
    topScore,
    hits,
    filter: filter || null,
  };
}
