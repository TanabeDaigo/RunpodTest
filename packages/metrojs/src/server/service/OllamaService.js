import logjs from "@metrojs/logjs";

const log = new logjs("OllamaService");

/**
 * Ollama HTTP API クライアント
 *
 * Step1: Chat / Generate（llama3）
 * Step2: Embedding（nomic-embed-text）
 *
 * Ollama はローカルで HTTP サーバーを立てる（デフォルト :11434）。
 * このサービスはその REST API を叩く薄いラッパー。
 */
class OllamaService {
  /**
   * @param {object} [config]
   * @param {string} [config.baseUrl]
   * @param {string} [config.model] Chat / Generate 用
   * @param {string} [config.embedModel] Embedding 用
   * @param {number} [config.timeoutMs]
   */
  constructor(config = {}) {
    this.baseUrl = (config.baseUrl || process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
    this.defaultModel = config.model || process.env.OLLAMA_MODEL || "llama3:8b";
    this.defaultEmbedModel =
      config.embedModel || process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
    this.timeoutMs = Number(config.timeoutMs || process.env.OLLAMA_TIMEOUT_MS || 180000);
  }

  /**
   * Cosine Similarity（-1〜1。近いほど似ている）
   * @param {number[]} a
   * @param {number[]} b
   * @returns {number}
   */
  static cosineSimilarity(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || a.length !== b.length) {
      throw new Error("cosineSimilarity requires two equal-length non-empty vectors");
    }
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) {
      return 0;
    }
    return dot / denom;
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

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Ollama API error ${res.status}: ${body || res.statusText}`);
      }

      return await res.json();
    } catch (err) {
      if (err?.name === "AbortError") {
        throw new Error(`Ollama request timed out after ${this.timeoutMs}ms (${url})`);
      }
      if (err?.cause?.code === "ECONNREFUSED" || err?.code === "ECONNREFUSED") {
        throw new Error(
          `Ollama に接続できません (${this.baseUrl}). ollama serve が起動しているか確認してください。`
        );
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 疎通確認（バージョン取得）
   */
  async checkHealth() {
    const started = Date.now();
    try {
      const version = await this._fetch("/api/version");
      return {
        ok: true,
        baseUrl: this.baseUrl,
        defaultModel: this.defaultModel,
        defaultEmbedModel: this.defaultEmbedModel,
        version: version?.version || version,
        latencyMs: Date.now() - started,
      };
    } catch (err) {
      return {
        ok: false,
        baseUrl: this.baseUrl,
        defaultModel: this.defaultModel,
        defaultEmbedModel: this.defaultEmbedModel,
        latencyMs: Date.now() - started,
        error: err.message,
      };
    }
  }

  /**
   * インストール済みモデル一覧
   * @returns {Promise<{ models: Array<{ name: string, size?: number, modified_at?: string }> }>}
   */
  async listModels() {
    const data = await this._fetch("/api/tags");
    const models = (data.models || []).map((m) => ({
      name: m.name,
      size: m.size,
      modified_at: m.modified_at,
      details: m.details,
    }));
    return {
      models,
      baseUrl: this.baseUrl,
      defaultModel: this.defaultModel,
      defaultEmbedModel: this.defaultEmbedModel,
    };
  }

  /**
   * Chat API（会話履歴対応）
   * @param {object} params
   * @param {string} [params.model]
   * @param {Array<{ role: string, content: string }>} params.messages
   * @param {object} [params.options] Ollama の推論オプション
   */
  async chat({ model, messages, options } = {}) {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("messages is required");
    }

    const payload = {
      model: model || this.defaultModel,
      messages,
      stream: false,
    };
    if (options && typeof options === "object") {
      payload.options = options;
    }

    log.info("[OllamaService] chat", {
      model: payload.model,
      messageCount: messages.length,
    });

    const started = Date.now();
    const result = await this._fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      model: result.model || payload.model,
      message: result.message,
      content: result.message?.content || "",
      totalDurationMs: result.total_duration ? Math.round(result.total_duration / 1e6) : Date.now() - started,
      evalCount: result.eval_count,
      promptEvalCount: result.prompt_eval_count,
      raw: result,
    };
  }

  /**
   * Generate API（単発プロンプト）
   * @param {object} params
   * @param {string} [params.model]
   * @param {string} params.prompt
   * @param {string} [params.system]
   */
  async generate({ model, prompt, system, options } = {}) {
    if (!prompt) {
      throw new Error("prompt is required");
    }

    const payload = {
      model: model || this.defaultModel,
      prompt,
      stream: false,
    };
    if (system) {
      payload.system = system;
    }
    if (options && typeof options === "object") {
      payload.options = options;
    }

    log.info("[OllamaService] generate", { model: payload.model });

    const started = Date.now();
    const result = await this._fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      model: result.model || payload.model,
      content: result.response || "",
      totalDurationMs: result.total_duration ? Math.round(result.total_duration / 1e6) : Date.now() - started,
      evalCount: result.eval_count,
      promptEvalCount: result.prompt_eval_count,
      raw: result,
    };
  }

  /**
   * Embedding API（テキスト → ベクトル）
   * @param {object} params
   * @param {string} [params.model]
   * @param {string} params.prompt
   * @returns {Promise<{ model: string, embedding: number[], dimensions: number, preview: number[], totalDurationMs: number }>}
   */
  async embeddings({ model, prompt } = {}) {
    if (!prompt || !String(prompt).trim()) {
      throw new Error("prompt is required");
    }

    const embedModel = model || this.defaultEmbedModel;
    const text = String(prompt);
    log.info("[OllamaService] embeddings", { model: embedModel, length: text.length });

    const started = Date.now();

    // 新 API /api/embed、失敗時は旧 /api/embeddings にフォールバック
    let embedding;
    let raw;
    try {
      raw = await this._fetch("/api/embed", {
        method: "POST",
        body: JSON.stringify({ model: embedModel, input: text }),
      });
      embedding = Array.isArray(raw.embeddings?.[0])
        ? raw.embeddings[0]
        : Array.isArray(raw.embedding)
          ? raw.embedding
          : null;
    } catch (err) {
      log.warn("[OllamaService] /api/embed failed, fallback to /api/embeddings", err.message);
      raw = await this._fetch("/api/embeddings", {
        method: "POST",
        body: JSON.stringify({ model: embedModel, prompt: text }),
      });
      embedding = Array.isArray(raw.embedding) ? raw.embedding : null;
    }

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error("Ollama embedding response did not contain a vector");
    }

    return {
      model: embedModel,
      embedding,
      dimensions: embedding.length,
      preview: embedding.slice(0, 8),
      totalDurationMs: Date.now() - started,
      raw,
    };
  }

  /**
   * 2テキストの Embedding + Cosine Similarity
   * @param {object} params
   * @param {string} [params.model]
   * @param {string} params.textA
   * @param {string} params.textB
   */
  async compareEmbeddings({ model, textA, textB } = {}) {
    if (!textA?.trim() || !textB?.trim()) {
      throw new Error("textA and textB are required");
    }

    const [a, b] = await Promise.all([
      this.embeddings({ model, prompt: textA }),
      this.embeddings({ model, prompt: textB }),
    ]);

    const similarity = OllamaService.cosineSimilarity(a.embedding, b.embedding);

    return {
      model: a.model,
      dimensions: a.dimensions,
      similarity,
      similarityRounded: Math.round(similarity * 10000) / 10000,
      textA: { preview: a.preview, dimensions: a.dimensions, totalDurationMs: a.totalDurationMs },
      textB: { preview: b.preview, dimensions: b.dimensions, totalDurationMs: b.totalDurationMs },
      totalDurationMs: a.totalDurationMs + b.totalDurationMs,
    };
  }
}

if (typeof window !== "undefined") {
  throw new Error("OllamaServiceはサーバーサイドでのみ使用可能です");
}

export default OllamaService;
