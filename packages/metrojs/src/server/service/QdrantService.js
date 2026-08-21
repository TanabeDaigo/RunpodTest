import logjs from "@metrojs/logjs";

const log = new logjs("QdrantService");

/**
 * Qdrant REST API クライアント（薄いラッパー）
 *
 * Step3: Docker で起動した Qdrant への疎通・Collection 操作
 * Step6: upsertPoints / deleteBySource（Indexing）
 * Step7: search（Retrieval）
 * Embedding モデル nomic-embed-text の次元は 768（Cosine）
 */
class QdrantService {
  /**
   * @param {object} [config]
   * @param {string} [config.baseUrl]
   * @param {string} [config.collection]
   * @param {number} [config.vectorSize]
   * @param {number} [config.timeoutMs]
   */
  constructor(config = {}) {
    this.baseUrl = (config.baseUrl || process.env.QDRANT_URL || "http://127.0.0.1:6333").replace(/\/$/, "");
    this.defaultCollection =
      config.collection || process.env.QDRANT_COLLECTION || "metrojs_rag_docs";
    this.vectorSize = Number(config.vectorSize || process.env.QDRANT_VECTOR_SIZE || 768);
    this.timeoutMs = Number(config.timeoutMs || process.env.QDRANT_TIMEOUT_MS || 30000);
  }

  /**
   * @private
   */
  async _fetch(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = { raw: text };
      }

      if (!res.ok) {
        const detail = json?.status?.error || json?.error || text || res.statusText;
        throw new Error(`Qdrant API error ${res.status}: ${detail}`);
      }

      return json;
    } catch (err) {
      if (err?.name === "AbortError") {
        throw new Error(`Qdrant request timed out after ${this.timeoutMs}ms (${url})`);
      }
      if (err?.cause?.code === "ECONNREFUSED" || err?.code === "ECONNREFUSED") {
        throw new Error(
          `Qdrant に接続できません (${this.baseUrl}). Docker で Qdrant が起動しているか確認してください。`
        );
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 疎通確認
   */
  async checkHealth() {
    const started = Date.now();
    try {
      const root = await this._fetch("/");
      return {
        ok: true,
        baseUrl: this.baseUrl,
        defaultCollection: this.defaultCollection,
        vectorSize: this.vectorSize,
        title: root?.title,
        version: root?.version,
        latencyMs: Date.now() - started,
      };
    } catch (err) {
      return {
        ok: false,
        baseUrl: this.baseUrl,
        defaultCollection: this.defaultCollection,
        vectorSize: this.vectorSize,
        latencyMs: Date.now() - started,
        error: err.message,
      };
    }
  }

  /**
   * Collection 一覧
   */
  async listCollections() {
    const data = await this._fetch("/collections");
    const collections = data?.result?.collections || [];
    return {
      collections,
      baseUrl: this.baseUrl,
      defaultCollection: this.defaultCollection,
      vectorSize: this.vectorSize,
    };
  }

  /**
   * Collection 詳細
   * @param {string} [name]
   */
  async getCollection(name) {
    const collection = name || this.defaultCollection;
    const data = await this._fetch(`/collections/${encodeURIComponent(collection)}`);
    return {
      collection,
      result: data?.result,
      raw: data,
    };
  }

  /**
   * Collection 作成（既存ならスキップ）
   * @param {object} [params]
   * @param {string} [params.name]
   * @param {number} [params.vectorSize]
   * @param {string} [params.distance] Cosine | Euclid | Dot
   * @param {boolean} [params.recreate] true なら一度消して作り直す
   */
  async ensureCollection({ name, vectorSize, distance = "Cosine", recreate = false } = {}) {
    const collection = name || this.defaultCollection;
    const size = Number(vectorSize || this.vectorSize);

    const listed = await this.listCollections();
    const exists = (listed.collections || []).some((c) => c.name === collection);

    if (exists && recreate) {
      log.info("[QdrantService] delete collection", { collection });
      await this._fetch(`/collections/${encodeURIComponent(collection)}`, { method: "DELETE" });
    } else if (exists) {
      const detail = await this.getCollection(collection);
      return {
        created: false,
        existed: true,
        collection,
        vectorSize: size,
        distance,
        detail: detail.result,
      };
    }

    log.info("[QdrantService] create collection", { collection, size, distance });
    await this._fetch(`/collections/${encodeURIComponent(collection)}`, {
      method: "PUT",
      body: JSON.stringify({
        vectors: {
          size,
          distance,
        },
      }),
    });

    const detail = await this.getCollection(collection);
    return {
      created: true,
      existed: false,
      collection,
      vectorSize: size,
      distance,
      detail: detail.result,
    };
  }

  /**
   * 試験用 Point を1件 upsert（Step3 の理解用。本格投入は Step6）
   * @param {object} params
   * @param {string} [params.collection]
   * @param {number|string} [params.id]
   * @param {number[]} params.vector
   * @param {object} [params.payload]
   */
  async upsertPoint({ collection, id = 1, vector, payload = {} } = {}) {
    const result = await this.upsertPoints({
      collection,
      points: [{ id, vector, payload }],
    });
    return {
      collection: result.collection,
      id,
      vectorDimensions: vector?.length,
      payload,
      result: result.result,
    };
  }

  /**
   * 複数 Point をバッチ upsert（Step6）
   * @param {object} params
   * @param {string} [params.collection]
   * @param {Array<{ id: number|string, vector: number[], payload?: object }>} params.points
   */
  async upsertPoints({ collection, points } = {}) {
    if (!Array.isArray(points) || points.length === 0) {
      throw new Error("points is required");
    }

    const name = collection || this.defaultCollection;
    for (const p of points) {
      if (p.id === undefined || p.id === null) {
        throw new Error("each point requires id");
      }
      if (!Array.isArray(p.vector) || p.vector.length === 0) {
        throw new Error(`point ${p.id}: vector is required`);
      }
    }

    log.info("[QdrantService] upsertPoints", { collection: name, count: points.length });

    const data = await this._fetch(`/collections/${encodeURIComponent(name)}/points?wait=true`, {
      method: "PUT",
      body: JSON.stringify({
        points: points.map((p) => ({
          id: p.id,
          vector: p.vector,
          payload: p.payload || {},
        })),
      }),
    });

    return {
      collection: name,
      upserted: points.length,
      result: data?.result,
    };
  }

  /**
   * payload.source が一致する Point を削除（再インデックス用）
   * @param {object} params
   * @param {string} [params.collection]
   * @param {string} params.source
   * @param {string} [params.tenantId] - 指定時は同 tenant の source のみ削除
   */
  async deleteBySource({ collection, source, tenantId } = {}) {
    if (!source) {
      throw new Error("source is required");
    }
    const name = collection || this.defaultCollection;
    const must = [{ key: "source", match: { value: source } }];
    if (tenantId && String(tenantId).trim()) {
      must.push({ key: "tenant_id", match: { value: String(tenantId).trim() } });
    }
    log.info("[QdrantService] deleteBySource", {
      collection: name,
      source,
      tenantId: tenantId || null,
    });

    const data = await this._fetch(`/collections/${encodeURIComponent(name)}/points/delete?wait=true`, {
      method: "POST",
      body: JSON.stringify({
        filter: { must },
      }),
    });

    return {
      collection: name,
      source,
      tenantId: tenantId && String(tenantId).trim() ? String(tenantId).trim() : null,
      result: data?.result,
    };
  }

  /**
   * Point を数件取得（確認用）
   * @param {object} [params]
   * @param {string} [params.collection]
   * @param {number} [params.limit]
   * @param {object} [params.filter]
   */
  async scrollPoints({ collection, limit = 5, filter } = {}) {
    const name = collection || this.defaultCollection;
    const body = {
      limit,
      with_payload: true,
      with_vector: false,
    };
    if (filter) {
      body.filter = filter;
    }

    const data = await this._fetch(`/collections/${encodeURIComponent(name)}/points/scroll`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const points = (data?.result?.points || []).map((p) => ({
      id: p.id,
      payload: p.payload,
    }));

    return {
      collection: name,
      points,
      count: points.length,
    };
  }

  /**
   * ベクトル類似検索（Retrieval / Step7）
   * @param {object} params
   * @param {string} [params.collection]
   * @param {number[]} params.vector
   * @param {number} [params.limit] TopK
   * @param {number} [params.scoreThreshold]
   * @param {object} [params.filter] Qdrant filter
   * @param {boolean} [params.withPayload=true]
   */
  async search({
    collection,
    vector,
    limit = 5,
    scoreThreshold,
    filter,
    withPayload = true,
  } = {}) {
    if (!Array.isArray(vector) || vector.length === 0) {
      throw new Error("vector is required");
    }

    const name = collection || this.defaultCollection;
    const topK = Math.max(1, Math.min(Number(limit) || 5, 50));

    const body = {
      vector,
      limit: topK,
      with_payload: withPayload !== false,
      with_vector: false,
    };
    if (typeof scoreThreshold === "number" && !Number.isNaN(scoreThreshold)) {
      body.score_threshold = scoreThreshold;
    }
    if (filter) {
      body.filter = filter;
    }

    log.info("[QdrantService] search", {
      collection: name,
      limit: topK,
      dimensions: vector.length,
      hasFilter: Boolean(filter),
      scoreThreshold: body.score_threshold ?? null,
    });

    const data = await this._fetch(`/collections/${encodeURIComponent(name)}/points/search`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const hits = (data?.result || []).map((hit) => ({
      id: hit.id,
      score: hit.score,
      payload: hit.payload || {},
    }));

    return {
      collection: name,
      limit: topK,
      hitCount: hits.length,
      hits,
    };
  }

  /**
   * Collection 内の Point 数など簡易情報
   * @param {string} [name]
   */
  async countPoints(name) {
    const collection = name || this.defaultCollection;
    const data = await this._fetch(`/collections/${encodeURIComponent(collection)}/points/count`, {
      method: "POST",
      body: JSON.stringify({ exact: true }),
    });
    return {
      collection,
      count: data?.result?.count ?? null,
    };
  }
}

if (typeof window !== "undefined") {
  throw new Error("QdrantServiceはサーバーサイドでのみ使用可能です");
}

export default QdrantService;
