/**
 *
 * KronoMetro
 *
 * Copyright © 2025-present KronoMetro, Co. All rights reserved.
 *
 */
import { injectable } from "tsyringe";
import { createHash } from "crypto";
import logjs from "@metrojs/logjs";
import { AbstractObject as Abstract } from "@common/server";
import { service } from "@lib/server";
import { runLangChainRag, LANGCHAIN_MAPPING } from "../llm/langchainRag.js";
import {
  checkLlmPostgres as pingLlmPostgres,
  listProductPrices as fetchProductPrices,
  findProductPrice,
  extractProductNameFromQuery,
  formatPriceContext,
  getLlmPgPublicConfig,
  ensureProductCatalogJsonb,
} from "../llm/postgresPrice.js";
import {
  expandSearchQuery,
  formatTavilyContext,
  getTavilyPublicConfig,
  tavilySearch as runTavilySearch,
} from "../llm/tavilyClient.js";
import {
  buildQdrantFilter,
  resolveTenantScope,
  withTenantPayload,
} from "../llm/tenantScope.js";
import {
  appendChatMemory as appendChatMemoryRow,
  clearChatMemory as clearChatMemoryRows,
  ensureChatMemoryTable as ensureChatMemoryTablePg,
  listChatMemory as listChatMemoryRows,
  toOllamaChatMessages,
} from "../llm/postgresChatMemory.js";
import {
  formatGeminiError,
  geminiCheckHealth,
  geminiGenerateContent,
  getGeminiLlmModel,
  getGeminiPublicConfig,
  getGeminiSearchModel,
} from "../llm/geminiClient.js";
import {
  buildRagMessages,
  runOrchestrateAsk,
} from "../ask/index.js";
import {
  dispatchAiGateway,
} from "../ai-gateway/index.js";

const { OllamaService, QdrantService, PdfService, ChunkService } = service;
const log = new logjs("LlmController");

/**
 * source + chunkId から安定した Point ID（UUID 形式）を作る。
 * 同じ source・chunkId なら常に同じ ID になり、再インデックス時の upsert が上書きしやすい。
 * @param {string} source - ドキュメント識別子（ファイル名など）
 * @param {number|string} chunkId - チャンク番号
 * @returns {string} UUID 風の文字列
 */
function buildPointId(source, chunkId) {
  // SHA-256 の先頭 32 hex を UUID 風（8-4-4-4-12）に分割
  const hex = createHash("sha256").update(`${source}::${chunkId}`).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * 学習用 Rerank: 質問ベクトルと各 hit.text を再 Embedding し、Cosine 類似度で並べ替える。
 * （本番の Cross-Encoder ではなく、パイプライン理解用の簡易実装）
 *
 * 処理の流れ:
 * 1. 質問の Embedding（未指定ならここで計算）
 * 2. 各ヒット本文を再 Embedding
 * 3. Cosine 類似度をスコアとし、降順ソートして rank を付け直す
 *
 * @param {OllamaService} ollama
 * @param {object} params
 * @param {string} params.query
 * @param {Array<object>} params.hits
 * @param {string} [params.embedModel]
 * @param {number[]} [params.queryEmbedding] - 既存があれば再利用して再計算を省略
 */
async function rerankHitsByEmbedding(ollama, { query, hits = [], embedModel, queryEmbedding } = {}) {
  // 1) 質問ベクトル（未指定なら Embedding）
  let qVec = queryEmbedding;
  if (!Array.isArray(qVec) || qVec.length === 0) {
    const embedded = await ollama.embeddings({ model: embedModel, prompt: query });
    qVec = embedded.embedding;
  }

  const scored = [];
  for (const h of hits) {
    const text = String(h.text || "").trim();
    // 本文が空のヒットは最下位扱い（score=-1）
    if (!text) {
      scored.push({
        ...h,
        retrievalRank: h.rank,
        retrievalScore: h.score,
        retrievalScoreRounded: h.scoreRounded,
        score: -1,
        scoreRounded: -1,
        rerankScore: -1,
      });
      continue;
    }
    // 2) ヒット本文を再 Embedding → 質問との Cosine
    const docEmbed = await ollama.embeddings({ model: embedModel, prompt: text });
    const sim = OllamaService.cosineSimilarity(qVec, docEmbed.embedding);
    scored.push({
      ...h,
      retrievalRank: h.rank, // Retrieval 時点の順位を残す（比較用）
      retrievalScore: h.score,
      retrievalScoreRounded: h.scoreRounded,
      score: sim,
      scoreRounded: Number(sim.toFixed(4)),
      rerankScore: sim,
    });
  }

  // 3) 類似度の高い順に並べ、rank を 1 から付け直す
  scored.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

  return scored.map((h, i) => ({
    ...h,
    rank: i + 1,
    textPreview: String(h.text || "").slice(0, 120),
  }));
}

/**
 * LLM / RAG 学習用コントローラー
 *
 * unit_test/llm の各 Step から呼ばれ、Ollama・Qdrant・PDF・Chunk を組み合わせて
 * 「チャット → Embedding → インデックス → 検索 → Prompt → 回答 → Rerank」を段階的に学ぶ。
 *
 * Step1: Ollama 疎通・Chat / Generate
 * Step2: Embedding（テキスト → ベクトル）・類似度比較
 * Step3: Qdrant 疎通・Collection・試験 Point 保存
 * Step4: PDF テキスト抽出
 * Step5: Chunking（長文を短い断片に分割）
 * Step6: Embedding → Qdrant 保存（Indexing）／PDF 一括 Indexing
 * Step7: Retrieval（質問 → Embedding → TopK 検索）※まだ生成しない
 * Step8: Prompt 組み立て（hits → Context → messages）※まだ生成しない
 * Step9: Llama3 へ渡して RAG 回答
 * Step10: Reranking（候補を広げて並べ直し → 回答）
 * Step11: LangChain で再構成（同じ RAG を部品で組み立て）
 * Step12: 社内システムへ組み込み（保留）
 * Step13: PostgreSQL から価格を取得して回答（Qdrant 不使用）
 * Step17: Router → RAG / Web / General → Main LLM（オーケストレータ）
 * Step18: tenant_id を payload filter / collection 命名に本接続
 * Step19: User Memory（PostgreSQL llm_chat_messages）
 * Step20: Gemini（通常回答 / Google Search grounding）
 */
@injectable()
class LlmController extends Abstract {
  constructor() {
    super();
    log.debug("LlmController initialized");
  }

  /** リクエスト params から OllamaService（Chat / Embedding）を生成 */
  _createOllama() {
    return new OllamaService({
      baseUrl: this.params?.baseUrl,
      model: this.params?.model,
      embedModel: this.params?.embedModel,
    });
  }

  /** リクエスト params から QdrantService（ベクトル DB）を生成 */
  _createQdrant() {
    return new QdrantService({
      baseUrl: this.params?.qdrantUrl,
      collection: this.params?.collection,
      vectorSize: this.params?.vectorSize,
    });
  }

  /** PDF テキスト抽出用サービス */
  _createPdf() {
    return new PdfService();
  }

  /** チャンク分割用サービス（chunkSize / chunkOverlap を反映） */
  _createChunk() {
    return new ChunkService({
      chunkSize: this.params?.chunkSize,
      chunkOverlap: this.params?.chunkOverlap,
    });
  }

  /**
   * Step1: Ollama サーバーへの疎通確認（起動しているか・応答するか）
   */
  async checkHealth(req, dbjs) {
    try {
      const ollama = this._createOllama();
      const result = await ollama.checkHealth();
      return {
        success: result.ok,
        step: 1,
        stepName: "Ollama API 疎通確認",
        ...result,
      };
    } catch (err) {
      log.error("checkHealth error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step1: Ollama に入っているモデル一覧を取得（llama3 / nomic-embed-text など）
   */
  async listModels(req, dbjs) {
    try {
      const ollama = this._createOllama();
      const result = await ollama.listModels();
      return {
        success: true,
        step: 1,
        stepName: "モデル一覧取得",
        ...result,
      };
    } catch (err) {
      log.error("listModels error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step1: Chat（会話形式）で LLM に問い合わせる。
   * messages 配列（role: system/user/assistant）をそのまま Ollama /api/chat に渡す。
   * RAG なしの素の Llama3 応答確認用。
   *
   * body: { mode, model?, messages: [{role, content}], options? }
   */
  async chat(req, dbjs) {
    try {
      const { model, messages, options } = this.params;
      const ollama = this._createOllama();
      // Browser → API → 本メソッド → OllamaService → Llama3
      const result = await ollama.chat({ model, messages, options });
      return {
        success: true,
        step: 1,
        stepName: "Ollama Chat",
        flow: [
          "Browser UI",
          "Next.js API (/api/llm)",
          "LlmController.chat",
          "OllamaService.chat",
          "POST Ollama /api/chat",
          "Llama3 推論",
          "回答テキスト",
        ],
        ...result,
      };
    } catch (err) {
      log.error("chat error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step1: Generate（単発プロンプト）で LLM に問い合わせる。
   * Chat と違い messages ではなく prompt（＋任意の system）を渡す。
   *
   * body: { mode, model?, prompt, system? }
   */
  async generate(req, dbjs) {
    try {
      const { model, prompt, system, options } = this.params;
      const ollama = this._createOllama();
      const result = await ollama.generate({ model, prompt, system, options });
      return {
        success: true,
        step: 1,
        stepName: "Ollama Generate",
        flow: [
          "Browser UI",
          "Next.js API (/api/llm)",
          "LlmController.generate",
          "OllamaService.generate",
          "POST Ollama /api/generate",
          "Llama3 推論",
          "回答テキスト",
        ],
        ...result,
      };
    } catch (err) {
      log.error("generate error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step2: Embedding（テキスト → 数値ベクトル）。
   * nomic-embed-text 等で意味空間上の座標に変換する。巨大な配列は既定では返さず、
   * 次元数と preview のみ返す（includeFullVector=true で全文ベクトルも返す）。
   *
   * body: { mode, embedModel?, prompt, includeFullVector? }
   */
  async embed(req, dbjs) {
    try {
      const { embedModel, model, prompt, includeFullVector } = this.params;
      const ollama = this._createOllama();
      const result = await ollama.embeddings({
        model: embedModel || model,
        prompt,
      });

      const response = {
        success: true,
        step: 2,
        stepName: "Embedding",
        flow: [
          "Browser UI",
          "Next.js API (/api/llm)",
          "LlmController.embed",
          "OllamaService.embeddings",
          "POST Ollama /api/embed",
          "nomic-embed-text",
          "float[] ベクトル",
        ],
        model: result.model,
        dimensions: result.dimensions,
        preview: result.preview,
        totalDurationMs: result.totalDurationMs,
      };

      // 学習・デバッグ用にフルベクトルが必要なときだけ付与
      if (includeFullVector) {
        response.embedding = result.embedding;
      }

      return response;
    } catch (err) {
      log.error("embed error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step2: 2 つのテキストをそれぞれ Embedding し、Cosine 類似度で「意味の近さ」を数値化する。
   * 「似た文はスコアが高い」ことを体感する学習用。
   *
   * body: { mode, embedModel?, textA, textB }
   */
  async compareEmbeddings(req, dbjs) {
    try {
      const { embedModel, model, textA, textB } = this.params;
      const ollama = this._createOllama();
      const result = await ollama.compareEmbeddings({
        model: embedModel || model,
        textA,
        textB,
      });

      return {
        success: true,
        step: 2,
        stepName: "Embedding 類似度比較",
        flow: [
          "textA / textB",
          "それぞれ Embedding",
          "Cosine Similarity",
          "類似度スコア",
        ],
        ...result,
      };
    } catch (err) {
      log.error("compareEmbeddings error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step3: Qdrant（ベクトル DB）への疎通確認
   */
  async checkQdrant(req, dbjs) {
    try {
      const qdrant = this._createQdrant();
      const result = await qdrant.checkHealth();
      return {
        success: result.ok,
        step: 3,
        stepName: "Qdrant 疎通確認",
        ...result,
      };
    } catch (err) {
      log.error("checkQdrant error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step3: Qdrant 上の Collection（ベクトルの格納庫）一覧を取得
   */
  async listCollections(req, dbjs) {
    try {
      const qdrant = this._createQdrant();
      const result = await qdrant.listCollections();
      return {
        success: true,
        step: 3,
        stepName: "Collection 一覧",
        ...result,
      };
    } catch (err) {
      log.error("listCollections error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step3: Collection が無ければ作成する（あればそのまま）。
   * vectorSize（次元）と distance（Cosine 等）を指定。recreate=true で作り直し。
   *
   * body: { mode, collection?, vectorSize?, distance?, recreate? }
   */
  async ensureCollection(req, dbjs) {
    try {
      const { collection, vectorSize, distance, recreate } = this.params;
      const qdrant = this._createQdrant();
      const result = await qdrant.ensureCollection({
        name: collection,
        vectorSize,
        distance,
        recreate: recreate === true,
      });
      return {
        success: true,
        step: 3,
        stepName: "Collection 確保",
        flow: [
          "Docker Qdrant",
          "PUT /collections/{name}",
          `vectors.size=${result.vectorSize}`,
          `distance=${result.distance}`,
        ],
        ...result,
      };
    } catch (err) {
      log.error("ensureCollection error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step3: 試験用に 1 文を Embedding し、Qdrant へ 1 Point として保存する。
   * 「テキスト → ベクトル → DB 保存」の最小ループを確認する。
   *
   * 処理の流れ:
   * 1. テキストを Embedding
   * 2. 次元に合わせて Collection を確保
   * 3. Point（vector + payload）を upsert
   * 4. 件数を返して保存できたことを確認
   *
   * body: { mode, text, collection?, id?, embedModel? }
   */
  async upsertTestPoint(req, dbjs) {
    try {
      const { text, collection, id, embedModel } = this.params;
      if (!text?.trim()) {
        return { success: false, error: "text is required" };
      }

      const ollama = this._createOllama();
      const qdrant = this._createQdrant();

      // 1) テキスト → ベクトル
      const embedded = await ollama.embeddings({
        model: embedModel,
        prompt: text.trim(),
      });

      // 2) Collection が無ければ作成（次元は embedding に合わせる）
      await qdrant.ensureCollection({
        name: collection,
        vectorSize: embedded.dimensions,
        distance: "Cosine",
      });

      // 3) Point 保存（payload に原文を残す＝後で検索ヒット時に本文を返すため）
      const upserted = await qdrant.upsertPoint({
        collection,
        id: id ?? 1,
        vector: embedded.embedding,
        payload: {
          text: text.trim(),
          source: "step3_test",
          createdAt: new Date().toISOString(),
        },
      });

      // 4) コレクション内の Point 総数
      const counted = await qdrant.countPoints(collection || qdrant.defaultCollection);

      return {
        success: true,
        step: 3,
        stepName: "試験 Point 保存",
        flow: [
          "text",
          "nomic-embed-text",
          "vector",
          "Qdrant Point upsert",
          "payload に原文を保持",
        ],
        model: embedded.model,
        dimensions: embedded.dimensions,
        preview: embedded.preview,
        upserted,
        count: counted.count,
      };
    } catch (err) {
      log.error("upsertTestPoint error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step4: PDF → テキスト抽出。
   * ブラウザから base64 で送られた PDF を pdf-parse で読み、ページ単位のテキストと
   * メタデータ（ページ数・文字数・抽出可否など）を返す。OCR はしない。
   *
   * body: { mode, filename, contentBase64 } または { mode, files: [{ name, text, isBase64 }] }
   */
  async parsePdf(req, dbjs) {
    try {
      const pdf = this._createPdf();
      const files = [];

      // files[] 形式、または単体 contentBase64 のどちらにも対応
      if (Array.isArray(this.params.files) && this.params.files.length > 0) {
        for (const f of this.params.files) {
          files.push({
            filename: f.name || f.filename || "document.pdf",
            data: f.text || f.contentBase64 || f.data,
            isBase64: f.isBase64 !== false,
          });
        }
      } else if (this.params.contentBase64 || this.params.data) {
        files.push({
          filename: this.params.filename || "document.pdf",
          data: this.params.contentBase64 || this.params.data,
          isBase64: true,
        });
      } else {
        return { success: false, error: "PDF data is required (contentBase64 or files[])" };
      }

      const results = [];
      for (const file of files) {
        const parsed = await pdf.parse(file);
        results.push(parsed);
      }

      const primary = results[0];
      return {
        success: true,
        step: 4,
        stepName: "PDF テキスト抽出",
        flow: [
          "Browser で PDF 選択",
          "base64 で /api/llm へ送信",
          "PdfService.parse (pdf-parse)",
          "ページ単位テキスト + メタデータ",
        ],
        ...primary,
        results: results.length > 1 ? results : undefined,
        // Step5 以降でそのまま使える document 形
        document: {
          source: primary.filename,
          pages: primary.pages,
          text: primary.text,
        },
      };
    } catch (err) {
      log.error("parsePdf error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step5: Chunking（長文を短い断片に分割）。
   * Embedding・検索の単位を小さくし、関連箇所だけを Context に載せやすくする。
   * 区切りは段落→改行→句点…の順で再帰的に切る（Recursive）。
   *
   * body: {
   *   mode,
   *   text?,
   *   source?,
   *   pages?: [{ page, text }],
   *   chunkSize?,
   *   chunkOverlap?
   * }
   */
  async chunkText(req, dbjs) {
    try {
      const { text, source, pages, chunkSize, chunkOverlap } = this.params;
      if ((!text || !String(text).trim()) && !(Array.isArray(pages) && pages.length > 0)) {
        return { success: false, error: "text or pages[] is required" };
      }

      const chunker = this._createChunk();
      const result = chunker.splitDocument({
        source: source || "manual_input",
        pages,
        text,
        chunkSize,
        chunkOverlap,
      });

      return {
        success: true,
        step: 5,
        stepName: "Chunking",
        flow: [
          "長いテキスト / pages[]",
          "ChunkService.splitDocument",
          "Recursive 区切り（段落→改行→句点→…）",
          "chunkSize / overlap 適用",
          "chunks[]（Step6 入力）",
        ],
        ...result,
      };
    } catch (err) {
      log.error("chunkText error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step6: Indexing（Chunk → Embedding → Qdrant 保存）。
   * 検索可能なナレッジベースに文書を入れる本番相当の処理。
   *
   * 処理の流れ:
   * 1. chunks が渡されていればそれを使い、無ければ text/pages から Chunking
   * 2. 先頭チャンクで Embedding 次元を確定し Collection を確保
   * 3. replaceSource なら同 source の旧 Point を削除（重複防止）
   * 4. 各チャンクを Embedding → Point 配列を組み立てて一括 upsert
   * 5. 件数とサンプルを返して確認
   *
   * body: {
   *   mode,
   *   text?,
   *   chunks?: [{ id, text, page?, source? }],
   *   source?,
   *   chunkSize?,
   *   chunkOverlap?,
   *   collection?,
   *   replaceSource?: boolean  // 同 source の旧 Point を消してから投入
   *   tenantId?,          // Step18: payload.tenant_id / 専用 collection
   *   isolationMode?,     // "payload" | "collection"
   *   requireTenant?,     // true なら tenantId 必須
   * }
   */
  async indexChunks(req, dbjs) {
    const started = Date.now();
    try {
      const {
        text,
        chunks: inputChunks,
        source,
        pages,
        chunkSize,
        chunkOverlap,
        collection,
        replaceSource = true,
        embedModel,
        tenantId,
        isolationMode = "payload",
        requireTenant = false,
      } = this.params;

      const qdrant = this._createQdrant();
      const scope = resolveTenantScope({
        tenantId,
        collection,
        isolationMode,
        defaultCollection: qdrant.defaultCollection,
        requireTenant,
      });
      if (!scope.ok) {
        return { success: false, error: scope.error, step: 18 };
      }

      const resolvedCollection = scope.collection;
      const docSource = source || "manual_input";
      const chunker = this._createChunk();
      const ollama = this._createOllama();

      // 1) 入力チャンクがあれば正規化、無ければ分割して作る
      let chunks = [];
      if (Array.isArray(inputChunks) && inputChunks.length > 0) {
        chunks = inputChunks
          .filter((c) => c && String(c.text || "").trim())
          .map((c, i) => ({
            id: c.id ?? i,
            text: String(c.text).trim(),
            page: c.page ?? null,
            source: c.source || docSource,
            charCount: String(c.text).trim().length,
          }));
      } else {
        const split = chunker.splitDocument({
          source: docSource,
          pages,
          text,
          chunkSize: chunkSize ?? 120,
          chunkOverlap: chunkOverlap ?? 30,
        });
        chunks = split.chunks;
      }

      if (chunks.length === 0) {
        return { success: false, error: "no chunks to index (text/chunks required)" };
      }

      // 2) 最初の Embedding で次元を確定し Collection を確保
      const firstEmbed = await ollama.embeddings({
        model: embedModel,
        prompt: chunks[0].text,
      });

      await qdrant.ensureCollection({
        name: resolvedCollection,
        vectorSize: firstEmbed.dimensions,
        distance: "Cosine",
      });

      // 3) 同じ source（+ tenant）の古いデータを消してから入れ直す
      if (replaceSource) {
        await qdrant.deleteBySource({
          collection: resolvedCollection,
          source: docSource,
          tenantId: scope.tenantId || undefined,
        });
      }

      const points = [];
      const previews = [];
      const idSourcePrefix = scope.tenantId ? `${scope.tenantId}::${docSource}` : null;

      const toPayload = (chunk) =>
        withTenantPayload(
          {
            text: chunk.text,
            source: chunk.source || docSource,
            page: chunk.page,
            chunkId: chunk.id,
            charCount: chunk.charCount,
            indexedAt: new Date().toISOString(),
          },
          scope.tenantId,
        );

      // 4a) 1件目は既に embed 済みなので再利用
      {
        const chunk = chunks[0];
        const pointId = buildPointId(idSourcePrefix || chunk.source || docSource, chunk.id);
        points.push({
          id: pointId,
          vector: firstEmbed.embedding,
          payload: toPayload(chunk),
        });
        previews.push({
          chunkId: chunk.id,
          pointId,
          charCount: chunk.charCount,
          textPreview: chunk.text.slice(0, 80),
          dimensions: firstEmbed.dimensions,
          tenantId: scope.tenantId,
        });
      }

      // 4b) 2件目以降を順に Embedding → Point 化
      for (let i = 1; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedded = await ollama.embeddings({
          model: embedModel,
          prompt: chunk.text,
        });
        const pointId = buildPointId(idSourcePrefix || chunk.source || docSource, chunk.id);
        points.push({
          id: pointId,
          vector: embedded.embedding,
          payload: toPayload(chunk),
        });
        previews.push({
          chunkId: chunk.id,
          pointId,
          charCount: chunk.charCount,
          textPreview: chunk.text.slice(0, 80),
          dimensions: embedded.dimensions,
          tenantId: scope.tenantId,
        });
      }

      // 5) 一括 upsert し、件数と同 source のサンプルを取得
      const upserted = await qdrant.upsertPoints({
        collection: resolvedCollection,
        points,
      });
      const counted = await qdrant.countPoints(
        resolvedCollection || qdrant.defaultCollection,
      );
      const scrolled = await qdrant.scrollPoints({
        collection: resolvedCollection,
        limit: Math.min(5, points.length),
        filter: buildQdrantFilter({
          tenantId: scope.tenantId,
          source: docSource,
          useTenantFilter: Boolean(scope.tenantId),
        }),
      });

      return {
        success: true,
        step: scope.tenantId ? 18 : 6,
        stepName: scope.tenantId
          ? "Indexing（tenant 付き）"
          : "Indexing（Embedding → Qdrant）",
        flow: [
          "text / chunks",
          "Chunking（必要なら）",
          "nomic-embed-text（各 chunk）",
          scope.tenantId
            ? `tenant_id=${scope.tenantId} / isolation=${scope.isolationMode}`
            : null,
          replaceSource ? "同 source の旧 Point 削除" : "上書き upsert",
          "Qdrant upsertPoints",
          "Collection に蓄積",
        ].filter(Boolean),
        source: docSource,
        tenantId: scope.tenantId,
        isolationMode: scope.isolationMode,
        collection: upserted.collection,
        chunkCount: chunks.length,
        upserted: upserted.upserted,
        dimensions: firstEmbed.dimensions,
        model: firstEmbed.model,
        replaceSource: replaceSource === true,
        pointCount: counted.count,
        totalDurationMs: Date.now() - started,
        previews,
        storedSamples: scrolled.points,
      };
    } catch (err) {
      log.error("indexChunks error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step6: PDF 一括 Indexing（抽出 → Chunking → Embedding → Qdrant）。
   * parsePdf → indexChunks を順に呼び、途中で this.params を一時差し替える。
   * スキャン画像のみの PDF（テキスト抽出ゼロ）はエラーで止める。
   *
   * body: {
   *   mode,
   *   filename,
   *   contentBase64,
   *   source?,          // 省略時は PDF ファイル名
   *   chunkSize?,
   *   chunkOverlap?,
   *   replaceSource?,
   *   collection?,
   *   embedModel?
   * }
   */
  async indexPdf(req, dbjs) {
    const started = Date.now();
    try {
      // PDF → テキスト
      const parsed = await this.parsePdf(req, dbjs);
      if (!parsed?.success) {
        return {
          success: false,
          error: parsed?.error || "parsePdf failed before indexing",
        };
      }

      const pages = parsed.pages || [];
      const hasText = pages.some((p) => String(p?.text || "").trim()) || String(parsed.text || "").trim();
      if (!hasText) {
        return {
          success: false,
          error: "PDF からテキストを抽出できませんでした（スキャン画像のみの可能性）",
          pdf: {
            filename: parsed.filename,
            numpages: parsed.numpages,
            charCount: parsed.charCount,
            warning: parsed.warning,
            extractability: parsed.extractability,
          },
        };
      }

      // indexChunks 用に params を差し替え（呼び出し後に必ず復元）
      const prev = {
        pages: this.params.pages,
        text: this.params.text,
        chunks: this.params.chunks,
        source: this.params.source,
      };

      this.params.pages = pages;
      this.params.text = undefined;
      this.params.chunks = undefined;
      this.params.source = (this.params.source && String(this.params.source).trim()) || parsed.filename;

      const indexed = await this.indexChunks(req, dbjs);

      this.params.pages = prev.pages;
      this.params.text = prev.text;
      this.params.chunks = prev.chunks;
      this.params.source = prev.source;

      if (!indexed?.success) {
        return {
          success: false,
          error: indexed?.error || "indexChunks failed after parsePdf",
          pdf: {
            filename: parsed.filename,
            numpages: parsed.numpages,
            charCount: parsed.charCount,
            warning: parsed.warning,
            extractability: parsed.extractability,
          },
        };
      }

      return {
        ...indexed,
        stepName: "PDF Indexing（抽出 → Embedding → Qdrant）",
        flow: [
          "PDF 選択",
          "PdfService.parse",
          "pages[]（page 付き）",
          "Chunking",
          "nomic-embed-text",
          "Qdrant upsert",
        ],
        inputType: "pdf",
        pdf: {
          filename: parsed.filename,
          numpages: parsed.numpages,
          charCount: parsed.charCount,
          warning: parsed.warning,
          extractability: parsed.extractability,
          textPreview: parsed.textPreview,
        },
        totalDurationMs: Date.now() - started,
      };
    } catch (err) {
      log.error("indexPdf error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step7: Retrieval（質問 Embedding → Qdrant TopK 検索）
   *
   * RAG の「検索だけ」を行うステップ。質問文をベクトル化し、Qdrant から
   * 類似度の高いチャンクを TopK 件取り出す。ここでは LLM（Llama3）には渡さない。
   *
   * 処理の流れ:
   * 1. リクエストから質問文・検索条件を取得
   * 2. Ollama（nomic-embed-text 等）で質問を Embedding（クエリベクトル化）
   * 3. 任意で payload.source による絞り込みフィルタを組み立て
   * 4. Qdrant でベクトル類似検索（TopK / scoreThreshold）
   * 5. ヒット結果を UI 向けに整形して返す
   *
   * body: {
   *   mode,
   *   query,             // 検索したい質問文（必須）
   *   topK?,             // 返す件数（既定 3）
   *   source?,           // payload.source で絞る（任意）
   *   scoreThreshold?,   // これ未満のヒットを落とす（任意）
   *   collection?,       // Qdrant コレクション名（任意）
   *   embedModel?        // Embedding モデル名（任意）
   *   tenantId?,         // Step18: 指定時は payload.tenant_id で絞る
   *   isolationMode?,
   *   requireTenant?,    // true なら tenantId 必須
   * }
   */
  async retrieve(req, dbjs) {
    const started = Date.now();
    try {
      // 1) パラメータ取得（未指定の topK は 3）
      const {
        query,
        topK = 3,
        source,
        scoreThreshold,
        collection,
        embedModel,
        tenantId,
        isolationMode = "payload",
        requireTenant = false,
      } = this.params;

      // 質問文が空なら検索できないのでエラー
      const q = String(query || "").trim();
      if (!q) {
        return { success: false, error: "query is required" };
      }

      // Ollama（Embedding）と Qdrant（ベクトルDB）のクライアントを用意
      const ollama = this._createOllama();
      const qdrant = this._createQdrant();
      const scope = resolveTenantScope({
        tenantId,
        collection,
        isolationMode,
        defaultCollection: qdrant.defaultCollection,
        requireTenant,
      });
      if (!scope.ok) {
        return { success: false, error: scope.error, step: 18 };
      }

      // 2) 質問テキスト → クエリベクトル（Embedding）
      //    インデックス時と同じ embed モデルを使う想定
      const embedded = await ollama.embeddings({
        model: embedModel,
        prompt: q,
      });

      // 3) tenant / source で絞る
      const filter = buildQdrantFilter({
        tenantId: scope.tenantId,
        source: source && String(source).trim() ? String(source).trim() : null,
        useTenantFilter: Boolean(scope.tenantId),
      });

      // 4) Qdrant 類似検索
      const searched = await qdrant.search({
        collection: scope.collection,
        vector: embedded.embedding,
        limit: topK,
        scoreThreshold,
        filter,
      });

      // 5) ヒットをランク付きの見やすい形に整形（本文・出典・プレビューなど）
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
        charCount: h.payload?.charCount ?? null,
        textPreview: String(h.payload?.text || "").slice(0, 120),
      }));

      // Step7 の結果（検索ヒットまで。生成は Step8 以降）
      return {
        success: true,
        step: scope.tenantId ? 18 : 7,
        stepName: scope.tenantId
          ? "Retrieval（tenant filter）"
          : "Retrieval（質問 → TopK）",
        flow: [
          "質問テキスト",
          "nomic-embed-text（query vector）",
          scope.tenantId
            ? `Qdrant search + tenant_id=${scope.tenantId} (${scope.isolationMode})`
            : filter
              ? "Qdrant search + source filter"
              : "Qdrant search（TopK）",
          "hits[{ score, payload.text, ... }]",
          "※ まだ Llama3 には渡さない",
        ],
        query: q,
        tenantId: scope.tenantId,
        isolationMode: scope.isolationMode,
        collection: searched.collection,
        topK: searched.limit,
        sourceFilter: source && String(source).trim() ? String(source).trim() : null,
        filter,
        scoreThreshold: typeof scoreThreshold === "number" ? scoreThreshold : null,
        dimensions: embedded.dimensions,
        model: embedded.model,
        hitCount: hits.length,
        hits,
        totalDurationMs: Date.now() - started,
      };
    } catch (err) {
      log.error("retrieve error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step8: Prompt 組み立て（Retrieval hits → Context → messages）。
   * LLM に渡す直前の「材料」を作るだけ。ここではまだ Llama3 を呼ばない。
   *
   * 処理の流れ:
   * 1. hits が渡されていればそれを使い、無ければ Step7 retrieve を実行
   * 2. buildRagMessages で System + User（参考情報＋質問）を組み立て
   * 3. messages / promptText / context を UI 確認用に返す
   *
   * body: {
   *   mode,
   *   query,
   *   topK?,
   *   source?,
   *   scoreThreshold?,
   *   template?: "strict" | "normal",
   *   hits?: [...]  // 渡すと Retrieval をスキップ
   * }
   */
  async buildRagPrompt(req, dbjs) {
    const started = Date.now();
    try {
      const { query, template = "strict", hits: inputHits } = this.params;
      const q = String(query || "").trim();
      if (!q) {
        return { success: false, error: "query is required" };
      }

      let retrieval = null;
      let hits = [];

      // 1) 手元の hits があれば再利用、無ければ検索から取得
      if (Array.isArray(inputHits) && inputHits.length > 0) {
        hits = inputHits.map((h, i) => ({
          rank: h.rank ?? i + 1,
          id: h.id ?? null,
          score: h.score,
          scoreRounded:
            h.scoreRounded ??
            (typeof h.score === "number" ? Number(h.score.toFixed(4)) : h.score),
          text: h.text ?? h.payload?.text ?? "",
          source: h.source ?? h.payload?.source ?? null,
          page: h.page ?? h.payload?.page ?? null,
          chunkId: h.chunkId ?? h.payload?.chunkId ?? null,
          charCount: h.charCount ?? null,
          textPreview: String(h.text ?? h.payload?.text ?? "").slice(0, 120),
        }));
      } else {
        retrieval = await this.retrieve(req, dbjs);
        if (!retrieval?.success) {
          return {
            success: false,
            error: retrieval?.error || "retrieve failed before building prompt",
          };
        }
        hits = retrieval.hits || [];
      }

      // 2) Context + messages 組み立て
      const built = buildRagMessages({ query: q, hits, template });

      return {
        success: true,
        step: 8,
        stepName: "Prompt 組み立て（Context → messages）",
        flow: [
          inputHits?.length ? "hits（入力）" : "Retrieval（Step7）",
          "Context 整形（番号付き）",
          `Template=${built.template}`,
          "messages[{system,user}]",
          "※ まだ Llama3 には渡さない（Step9）",
        ],
        query: q,
        template: built.template,
        hitCount: hits.length,
        hits,
        context: built.context,
        system: built.system,
        userContent: built.userContent,
        messages: built.messages,
        promptText: built.promptText,
        retrieval: retrieval
          ? {
              collection: retrieval.collection,
              topK: retrieval.topK,
              sourceFilter: retrieval.sourceFilter,
              model: retrieval.model,
              dimensions: retrieval.dimensions,
              totalDurationMs: retrieval.totalDurationMs,
            }
          : null,
        totalDurationMs: Date.now() - started,
      };
    } catch (err) {
      log.error("buildRagPrompt error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step9: RAG 一通り（検索 → Prompt → Llama3 生成）。
   * 「マニュアルを根拠に答える」最小の完成形。
   *
   * 処理の流れ:
   * 1. buildRagPrompt（内部で必要なら Retrieval）
   * 2. 組み立てた messages を Ollama chat に渡す
   * 3. 回答テキストとヒット・Context をまとめて返す
   *
   * body: {
   *   mode,
   *   query,
   *   topK?,
   *   source?,
   *   scoreThreshold?,
   *   template?: "strict" | "normal",
   *   model?,
   *   options?
   * }
   */
  async ragAnswer(req, dbjs) {
    const started = Date.now();
    try {
      const { model, options } = this.params;

      // 1) 検索＋Prompt
      const promptBuilt = await this.buildRagPrompt(req, dbjs);
      if (!promptBuilt?.success) {
        return {
          success: false,
          error: promptBuilt?.error || "buildRagPrompt failed before chat",
        };
      }

      // 2) Llama3 で生成
      const ollama = this._createOllama();
      const chatResult = await ollama.chat({
        model,
        messages: promptBuilt.messages,
        options,
      });

      return {
        success: true,
        step: 9,
        stepName: "RAG 回答（検索→Prompt→生成）",
        flow: [
          "質問",
          "Retrieval（Step7）",
          "Prompt 組み立て（Step8）",
          "Ollama chat（llama3）",
          "回答テキスト",
        ],
        query: promptBuilt.query,
        template: promptBuilt.template,
        hitCount: promptBuilt.hitCount,
        hits: promptBuilt.hits,
        context: promptBuilt.context,
        messages: promptBuilt.messages,
        promptText: promptBuilt.promptText,
        retrieval: promptBuilt.retrieval,
        answer: chatResult.content,
        model: chatResult.model,
        chatDurationMs: chatResult.totalDurationMs,
        evalCount: chatResult.evalCount,
        promptEvalCount: chatResult.promptEvalCount,
        totalDurationMs: Date.now() - started,
      };
    } catch (err) {
      log.error("ragAnswer error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step10: Rerank 付き RAG。
   * Retrieval で多めに候補を取り、再 Embedding + Cosine で並べ直してから
   * 上位だけを Context に載せて回答する（学習用の簡易 Rerank）。
   *
   * 処理の流れ:
   * 1. candidateK 件で Retrieval
   * 2. 各ヒットを再スコアして並べ替え
   * 3. 上位 finalTopN 件で Prompt 組み立て
   * 4. skipAnswer でなければ Llama3 生成
   * 5. before/after の順位比較表も返す
   *
   * body: {
   *   mode,
   *   query,
   *   candidateK?,   // Retrieval で多めに取る件数（default 8）
   *   finalTopN?,    // Rerank 後に Context へ載せる件数（default 3）
   *   source?,
   *   scoreThreshold?,
   *   template?,
   *   skipAnswer?: boolean  // true なら並べ替えだけ（生成スキップ）
   *   model?,
   *   options?,
   *   embedModel?
   * }
   */
  async ragAnswerWithRerank(req, dbjs) {
    const started = Date.now();
    try {
      const {
        query,
        candidateK = 8,
        finalTopN = 3,
        source,
        scoreThreshold,
        template = "strict",
        skipAnswer = false,
        model,
        options,
        embedModel,
      } = this.params;

      const q = String(query || "").trim();
      if (!q) {
        return { success: false, error: "query is required" };
      }

      // 件数の上下限を軽くクリップ
      const cand = Math.max(1, Math.min(Number(candidateK) || 8, 20));
      const topN = Math.max(1, Math.min(Number(finalTopN) || 3, cand));

      // 1) Retrieval を candidateK 件で実行（params.topK を一時的に差し替え）
      const prevTopK = this.params.topK;
      this.params.topK = cand;
      const retrieval = await this.retrieve(req, dbjs);
      this.params.topK = prevTopK;

      if (!retrieval?.success) {
        return {
          success: false,
          error: retrieval?.error || "retrieve failed before rerank",
        };
      }

      const hitsBefore = (retrieval.hits || []).map((h) => ({ ...h }));
      const ollama = this._createOllama();

      // 2) 再 Embedding + Cosine で並べ替え
      const rerankedAll = await rerankHitsByEmbedding(ollama, {
        query: q,
        hits: hitsBefore,
        embedModel,
      });
      // 3) Context に載せる上位 N 件
      const hitsAfter = rerankedAll.slice(0, topN).map((h, i) => ({
        ...h,
        rank: i + 1,
      }));

      // 順位がどう変わったかの比較表（学習 UI 用）
      const comparison = hitsBefore.map((before) => {
        const after = rerankedAll.find((h) => h.id === before.id);
        const afterRank = after?.rank ?? null;
        return {
          id: before.id,
          textPreview: before.textPreview || String(before.text || "").slice(0, 80),
          beforeRank: before.rank,
          beforeScore: before.scoreRounded,
          afterRank,
          afterScore: after?.scoreRounded ?? null,
          rankDelta:
            afterRank != null && before.rank != null ? before.rank - afterRank : null, // +なら順位アップ
          usedInContext: hitsAfter.some((h) => h.id === before.id),
        };
      });

      const built = buildRagMessages({ query: q, hits: hitsAfter, template });

      // 4) 必要なら生成（skipAnswer なら並べ替え結果だけ返す）
      let chatResult = null;
      if (!skipAnswer) {
        chatResult = await ollama.chat({
          model,
          messages: built.messages,
          options,
        });
      }

      return {
        success: true,
        step: 10,
        stepName: "Reranking（候補拡大 → 並べ直し → 回答）",
        flow: [
          "質問",
          `Retrieval（candidateK=${cand}）`,
          "Rerank（再 Embedding + Cosine）",
          `上位 finalTopN=${topN} を Context`,
          skipAnswer ? "※ 回答生成スキップ" : "Ollama chat（llama3）",
        ],
        query: q,
        template: built.template,
        candidateK: cand,
        finalTopN: topN,
        sourceFilter: retrieval.sourceFilter,
        collection: retrieval.collection,
        embedModel: retrieval.model,
        hitCountBefore: hitsBefore.length,
        hitCountAfter: hitsAfter.length,
        hitsBefore,
        hitsAfter,
        comparison,
        context: built.context,
        messages: built.messages,
        promptText: built.promptText,
        skipAnswer: skipAnswer === true,
        answer: chatResult?.content ?? null,
        model: chatResult?.model ?? null,
        chatDurationMs: chatResult?.totalDurationMs ?? null,
        totalDurationMs: Date.now() - started,
        note:
          "学習用 Rerank（同一 Embedding の再スコア）。本番では Cross-Encoder（bge-reranker 等）を使うことが多い。",
      };
    } catch (err) {
      log.error("ragAnswerWithRerank error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step11: LangChain で RAG を再構成する。
   * Step9 と同じ「検索 → Prompt → 生成」を、LangChain の部品で組み立てる学習用。
   * Indexing（Step6）済みの Qdrant Collection をそのまま使う。
   *
   * 処理の流れ:
   * 1. OllamaEmbeddings で質問をベクトル化
   * 2. MetroQdrantRetriever（BaseRetriever）で類似チャンク取得
   * 3. ChatPromptTemplate で messages 組み立て
   * 4. ChatOllama で回答生成
   *
   * body: {
   *   mode,
   *   query,
   *   topK?,
   *   source?,
   *   scoreThreshold?,
   *   template?: "strict" | "normal",
   *   model?,
   *   embedModel?,
   *   collection?,
   *   baseUrl?,
   *   options?
   * }
   */
  async ragAnswerLangChain(req, dbjs) {
    const started = Date.now();
    try {
      const {
        query,
        topK = 3,
        source,
        scoreThreshold,
        template = "strict",
        model,
        embedModel,
        collection,
        baseUrl,
        options,
      } = this.params;

      const q = String(query || "").trim();
      if (!q) {
        return { success: false, error: "query is required" };
      }

      const key = template === "normal" ? "normal" : "strict";
      const systemPrompt = RAG_SYSTEM_PROMPTS[key];
      const qdrant = this._createQdrant();
      const ollama = this._createOllama();

      const result = await runLangChainRag({
        query: q,
        systemPrompt,
        qdrant,
        ollamaBaseUrl: baseUrl || ollama.baseUrl,
        model: model || ollama.defaultModel || process.env.OLLAMA_MODEL,
        embedModel: embedModel || ollama.defaultEmbedModel || process.env.OLLAMA_EMBED_MODEL,
        collection: collection || qdrant.defaultCollection,
        topK,
        source: source && String(source).trim() ? String(source).trim() : undefined,
        scoreThreshold,
        options: options || {},
      });

      return {
        success: true,
        step: 11,
        stepName: "LangChain で再構成（RAG）",
        flow: [
          "質問",
          "OllamaEmbeddings（LangChain）",
          "MetroQdrantRetriever（BaseRetriever）",
          "ChatPromptTemplate",
          "ChatOllama（llama3）",
          "回答テキスト",
        ],
        query: q,
        template: key,
        hitCount: result.hits.length,
        hits: result.hits,
        context: result.context,
        messages: result.messages,
        promptText: result.promptText,
        answer: result.answer,
        model: result.model,
        embedModel: result.embedModel,
        collection: result.collection,
        topK: Math.max(1, Number(topK) || 3),
        sourceFilter: source && String(source).trim() ? String(source).trim() : null,
        mapping: LANGCHAIN_MAPPING,
        note:
          "Step9 と同じ流れを LangChain 部品で組んだ学習用実装。Indexing は Step6 の自前経路のまま。",
        totalDurationMs: Date.now() - started,
      };
    } catch (err) {
      log.error("ragAnswerLangChain error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step13: 学習用 PostgreSQL 疎通確認（本体 MySQL とは別接続）
   */
  async checkLlmPostgres(req, dbjs) {
    try {
      const result = await pingLlmPostgres();
      return {
        success: true,
        step: 13,
        stepName: "PostgreSQL 疎通（LLM ラボ）",
        ...result,
      };
    } catch (err) {
      log.error("checkLlmPostgres error", err);
      return {
        success: false,
        step: 13,
        error: err.message,
        config: getLlmPgPublicConfig(),
      };
    }
  }

  /**
   * Step13: product_catalog（JSONB）作成・シード
   */
  async ensureProductCatalogJsonb(req, dbjs) {
    try {
      const result = await ensureProductCatalogJsonb({ reseeds: true });
      return {
        success: true,
        step: 13,
        stepName: "product_catalog（JSONB）準備",
        ...result,
      };
    } catch (err) {
      log.error("ensureProductCatalogJsonb error", err);
      return { success: false, error: err.message, config: getLlmPgPublicConfig() };
    }
  }

  /**
   * Step13: product_catalog 一覧（JSONB）
   */
  async listProductPrices(req, dbjs) {
    try {
      const rows = await fetchProductPrices();
      return {
        success: true,
        step: 13,
        stepName: "価格一覧（PostgreSQL JSONB）",
        table: "product_catalog",
        count: rows.length,
        rows,
      };
    } catch (err) {
      log.error("listProductPrices error", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step13: PostgreSQL JSONB の価格を根拠に回答（Qdrant は使わない）
   *
   * 処理の流れ:
   * 1. 商品名を params.productName または質問文から推定（aliases 含む）
   * 2. product_catalog.payload を JSONB 検索
   * 3. skipAnswer でなければ、DB 結果だけを Context にして LLM が文章化
   *
   * body: {
   *   mode,
   *   query?,           // 例: 林檎の値段は？ / apple の価格は？
   *   productName?,     // 明示指定があれば優先
   *   skipAnswer?,      // true なら DB 結果のみ（LLM なし）
   *   model?,
   *   options?
   * }
   */
  async answerPriceFromPostgres(req, dbjs) {
    const started = Date.now();
    try {
      const {
        query,
        productName: inputName,
        skipAnswer = false,
        model,
        options,
      } = this.params;

      const q = String(query || "").trim();
      let productName = String(inputName || "").trim();

      // 商品名が無ければカタログと質問から推定
      const catalog = await fetchProductPrices();
      if (!productName) {
        productName = extractProductNameFromQuery(q, catalog) || "";
      }
      if (!productName && q) {
        // 質問全体を名前候補として試す（短い場合）
        if (q.length <= 20) {
          productName = q.replace(/[？?。]/g, "").trim();
        }
      }

      if (!productName) {
        return {
          success: false,
          error: "productName か、商品名を含む query が必要です（例: リンゴの価格は？）",
          catalog,
        };
      }

      const found = await findProductPrice(productName);

      if (found?.ambiguous) {
        return {
          success: false,
          error: `候補が複数あります: ${found.candidates.map((c) => c.productName).join(", ")}`,
          candidates: found.candidates,
          productName,
          query: q || null,
        };
      }

      if (!found) {
        return {
          success: true,
          step: 13,
          stepName: "PostgreSQL 価格回答",
          flow: ["質問", "PostgreSQL SELECT", "ヒットなし", skipAnswer ? "LLM スキップ" : "わからない系回答"],
          query: q || null,
          productName,
          hit: null,
          context: formatPriceContext(null),
          answer: skipAnswer
            ? null
            : `「${productName}」の価格データは PostgreSQL（product_catalog JSONB）に見つかりませんでした。`,
          skipAnswer: skipAnswer === true,
          usedQdrant: false,
          totalDurationMs: Date.now() - started,
        };
      }

      const context = formatPriceContext(found);
      let answer = null;
      let chatResult = null;

      if (!skipAnswer) {
        const ollama = this._createOllama();
        const system = [
          "あなたは社内の価格マスタ（PostgreSQL JSONB）の結果だけを根拠に答えるアシスタントです。",
          "回答は必ず日本語のみで書いてください。",
          "参考情報に書かれた価格・更新日時以外は推測しないでください。",
          "金額は「○○円」と明示してください。",
        ].join("\n");
        const userContent = [
          "## 参考情報（PostgreSQL product_catalog.payload）",
          context,
          "",
          "## 質問",
          q || `${found.productName}の価格は？`,
        ].join("\n");

        chatResult = await ollama.chat({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent },
          ],
          options,
        });
        answer = chatResult.content;
      } else {
        answer = `${found.productName} の現在価格は ${found.priceYen} 円です（JSONB 直接。LLM なし）。`;
      }

      return {
        success: true,
        step: 13,
        stepName: "PostgreSQL JSONB 価格回答",
        flow: [
          "質問 / 商品名（aliases 可）",
          "PostgreSQL JSONB SELECT product_catalog",
          "参考情報（価格行）",
          skipAnswer ? "定型文で回答（LLM なし）" : "Ollama chat",
        ],
        query: q || null,
        productName,
        hit: found,
        context,
        answer,
        model: chatResult?.model ?? null,
        chatDurationMs: chatResult?.totalDurationMs ?? null,
        skipAnswer: skipAnswer === true,
        usedQdrant: false,
        table: "product_catalog",
        note: "価格の正本は JSONB。表記ゆれは aliases。リアルタイム数値は Qdrant に載せない学習用 Step です。",
        totalDurationMs: Date.now() - started,
      };
    } catch (err) {
      log.error("answerPriceFromPostgres error", err);
      return { success: false, error: err.message, config: getLlmPgPublicConfig() };
    }
  }

  /**
   * Step15: Tavily 設定・疎通確認（検索はしない／または極小クエリ）
   */
  async checkTavily(req, dbjs) {
    try {
      const cfg = getTavilyPublicConfig();
      if (!cfg.apiKeySet) {
        return {
          success: false,
          step: 15,
          stepName: "Tavily 疎通",
          error: "TAVILY_API_KEY が未設定です",
          ...cfg,
        };
      }
      return {
        success: true,
        step: 15,
        stepName: "Tavily 疎通",
        ok: true,
        message: "API Key は設定済みです。続けて「検索テスト」を実行してください。",
        ...cfg,
        // キー本体は返さない
      };
    } catch (err) {
      log.error("checkTavily error", err);
      return { success: false, error: err.message, ...getTavilyPublicConfig() };
    }
  }

  /**
   * Step15: Tavily 検索のみ（Ollama なし）
   * body: { mode, query, maxResults?, searchDepth?, expandRelativeDates? }
   */
  async tavilySearch(req, dbjs) {
    const started = Date.now();
    try {
      const {
        query,
        maxResults,
        searchDepth,
        expandRelativeDates = true,
        includeAnswer = false,
      } = this.params || {};

      const raw = String(query || "").trim();
      if (!raw) {
        return { success: false, error: "query が必要です" };
      }

      const searchQuery =
        expandRelativeDates === false ? raw : expandSearchQuery(raw);

      const result = await runTavilySearch({
        query: searchQuery,
        maxResults,
        searchDepth,
        includeAnswer,
      });

      return {
        success: true,
        step: 15,
        stepName: "Tavily 検索",
        route: "web",
        query: raw,
        searchQuery,
        results: result.results,
        context: formatTavilyContext(result.results),
        tavilyAnswer: result.answer,
        searchDepth: result.searchDepth,
        maxResults: result.maxResults,
        tavilyDurationMs: result.durationMs,
        tavilyResponseTime: result.responseTime,
        usedOllama: false,
        usedQdrant: false,
        note: "Tavily 単体テスト。回答生成（Ollama）は Step16（answerFromTavily）で接続。",
        totalDurationMs: Date.now() - started,
        config: getTavilyPublicConfig(),
      };
    } catch (err) {
      log.error("tavilySearch error", err);
      return {
        success: false,
        step: 15,
        error: err.message,
        config: getTavilyPublicConfig(),
        totalDurationMs: Date.now() - started,
      };
    }
  }

  /**
   * Step16: Tavily 検索 → Context → Ollama で要約・回答
   * body: {
   *   mode, query, model?, options?,
   *   maxResults?, searchDepth?, expandRelativeDates?,
   *   skipAnswer?  // true なら検索のみ（Step15 相当）
   * }
   */
  async answerFromTavily(req, dbjs) {
    const started = Date.now();
    try {
      const {
        query,
        model,
        options,
        maxResults,
        searchDepth,
        expandRelativeDates = true,
        skipAnswer = false,
      } = this.params || {};

      const raw = String(query || "").trim();
      if (!raw) {
        return { success: false, error: "query が必要です" };
      }

      const searchQuery =
        expandRelativeDates === false ? raw : expandSearchQuery(raw);

      const searchResult = await runTavilySearch({
        query: searchQuery,
        maxResults,
        searchDepth,
        includeAnswer: false,
      });

      const context = formatTavilyContext(searchResult.results);
      const sources = (searchResult.results || []).map((r) => ({
        rank: r.rank,
        title: r.title,
        url: r.url,
        score: r.score,
        publishedDate: r.publishedDate,
      }));

      if (!searchResult.results?.length) {
        return {
          success: true,
          step: 16,
          stepName: "Tavily → Ollama 回答",
          route: "web",
          flow: ["質問", "Tavily 検索", "ヒットなし", "わからない系回答"],
          query: raw,
          searchQuery,
          results: [],
          sources: [],
          context,
          answer: skipAnswer
            ? null
            : "参考になる検索結果が見つかりませんでした。質問を具体化するか、別の言い方で試してください。",
          skipAnswer: skipAnswer === true,
          usedOllama: false,
          usedQdrant: false,
          tavilyDurationMs: searchResult.durationMs,
          totalDurationMs: Date.now() - started,
          config: getTavilyPublicConfig(),
        };
      }

      let answer = null;
      let chatResult = null;

      if (!skipAnswer) {
        const ollama = this._createOllama();
        const system = [
          "あなたは Web 検索結果だけを根拠に答えるアシスタントです。",
          "回答は必ず日本語のみで書いてください。英語の説明文は禁止です。",
          "参考情報に書かれていない事実・数値・試合結果は推測しないでください。",
          "分からない場合は「わからない」と明記してください。",
          "可能なら根拠にした出典の番号（[1] など）を短く示してください。",
          "最後に「主な出典」として URL を1〜3件列挙してください。",
        ].join("\n");
        const userContent = [
          "## 参考情報（Tavily Web 検索）",
          context,
          "",
          "## 質問",
          raw,
        ].join("\n");

        chatResult = await ollama.chat({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent },
          ],
          options,
        });
        answer = chatResult.content;
      } else {
        answer = null;
      }

      return {
        success: true,
        step: 16,
        stepName: "Tavily → Ollama 回答",
        route: "web",
        flow: [
          "質問",
          "相対日付の展開（任意）",
          "Tavily Search",
          "Context 組み立て",
          skipAnswer ? "LLM スキップ" : "Ollama chat（要約・回答）",
        ],
        query: raw,
        searchQuery,
        results: searchResult.results,
        sources,
        context,
        answer,
        model: chatResult?.model ?? null,
        chatDurationMs: chatResult?.totalDurationMs ?? null,
        tavilyDurationMs: searchResult.durationMs,
        tavilyResponseTime: searchResult.responseTime,
        searchDepth: searchResult.searchDepth,
        maxResults: searchResult.maxResults,
        skipAnswer: skipAnswer === true,
        usedOllama: skipAnswer !== true,
        usedQdrant: false,
        note: "最新情報は Tavily が根拠。Ollama は要約・日本語化のみ。Qdrant は使わない。",
        totalDurationMs: Date.now() - started,
        config: getTavilyPublicConfig(),
      };
    } catch (err) {
      log.error("answerFromTavily error", err);
      return {
        success: false,
        step: 16,
        error: err.message,
        config: getTavilyPublicConfig(),
        totalDurationMs: Date.now() - started,
      };
    }
  }

  /**
   * Step17: Router → (RAG | Tavily | general) → Main LLM
   * 実装: ask/Orchestrator（CPU）+ ai-gateway（GPU API 分割）
   * body: {
   *   mode, query,
   *   routerModel?, mainModel?, model?,
   *   collection?, tenantId?,
   *   forceRoute?, skipAnswer?,
   *   topK?, scoreThreshold?, routerConfidenceThreshold?,
   *   allowInternalPromote?,
   *   maxResults?, searchDepth?, expandRelativeDates?,
   *   embedModel?, options?, webProvider?: "tavily"|"gemini", geminiModel?
   * }
   */
  async orchestrateAsk(req, dbjs) {
    return runOrchestrateAsk({
      ...(this.params || {}),
      qdrantUrl: this.params?.qdrantUrl,
      vectorSize: this.params?.vectorSize,
    });
  }

  /**
   * 共通GPU API: POST /v1/route 相当
   */
  async aiRoute(req, dbjs) {
    const result = await dispatchAiGateway("route", this.params || {});
    return { success: result.ok === true, step: 17, gateway: "route", ...result };
  }

  /**
   * 共通GPU API: POST /v1/embed 相当
   */
  async aiEmbed(req, dbjs) {
    const result = await dispatchAiGateway("embed", this.params || {});
    return { success: result.ok === true, step: 17, gateway: "embed", ...result };
  }

  /**
   * 共通GPU API: POST /v1/generate 相当
   */
  async aiGenerate(req, dbjs) {
    const result = await dispatchAiGateway("generate", this.params || {});
    return { success: result.ok === true, step: 17, gateway: "generate", ...result };
  }

  /**
   * 共通GPU API: POST /v1/web 相当
   */
  async aiWeb(req, dbjs) {
    const result = await dispatchAiGateway("web", this.params || {});
    return { success: result.ok === true, step: 17, gateway: "web", ...result };
  }

  async ensureChatMemoryTable(req, dbjs) {
    try {
      const result = await ensureChatMemoryTablePg();
      return {
        success: true,
        step: 19,
        stepName: "Memory テーブル確保",
        ...result,
        sqlPath: "apps/webapp/scripts/sql/llm_chat_messages.sql",
      };
    } catch (err) {
      log.error("ensureChatMemoryTable error", err);
      return { success: false, step: 19, error: err.message };
    }
  }

  /**
   * Step19: 直近 Memory 一覧
   * body: { mode, tenantId, userId, sessionId?, limit? }
   */
  async listChatMemory(req, dbjs) {
    try {
      const { tenantId, userId, sessionId, limit } = this.params || {};
      const listed = await listChatMemoryRows({
        tenantId,
        userId,
        sessionId,
        limit,
      });
      return {
        success: true,
        step: 19,
        stepName: "Memory 一覧",
        ...listed,
      };
    } catch (err) {
      log.error("listChatMemory error", err);
      return { success: false, step: 19, error: err.message };
    }
  }

  /**
   * Step19: Memory 1件追記（デバッグ用）
   * body: { mode, tenantId, userId, sessionId?, role, content }
   */
  async appendChatMemory(req, dbjs) {
    try {
      const { tenantId, userId, sessionId, role, content } = this.params || {};
      const result = await appendChatMemoryRow({
        tenantId,
        userId,
        sessionId,
        role,
        content,
      });
      return {
        success: true,
        step: 19,
        stepName: "Memory 追記",
        ...result,
      };
    } catch (err) {
      log.error("appendChatMemory error", err);
      return { success: false, step: 19, error: err.message };
    }
  }

  /**
   * Step19: セッション Memory 削除
   * body: { mode, tenantId, userId, sessionId? }
   */
  async clearChatMemory(req, dbjs) {
    try {
      const { tenantId, userId, sessionId } = this.params || {};
      const result = await clearChatMemoryRows({
        tenantId,
        userId,
        sessionId,
      });
      return {
        success: true,
        step: 19,
        stepName: "Memory クリア",
        ...result,
      };
    } catch (err) {
      log.error("clearChatMemory error", err);
      return { success: false, step: 19, error: err.message };
    }
  }

  /**
   * Step20: Gemini 疎通（検索なし）
   */
  async checkGemini(req, dbjs) {
    try {
      const health = await geminiCheckHealth();
      return {
        success: health.ok === true,
        step: 20,
        stepName: "Gemini 疎通",
        ...health,
      };
    } catch (err) {
      log.error("checkGemini error", err);
      return {
        success: false,
        step: 20,
        error: formatGeminiError(err),
        config: getGeminiPublicConfig(),
      };
    }
  }

  /**
   * Step20: Gemini で回答（任意で Google Search grounding）
   * body: {
   *   mode, query, model?,
   *   useGoogleSearch?: boolean  // true なら Web検索＋回答（Ollama 不要）
   *   systemInstruction?
   * }
   */
  async answerFromGemini(req, dbjs) {
    const started = Date.now();
    try {
      const {
        query,
        model,
        useGoogleSearch = false,
        systemInstruction,
      } = this.params || {};

      const raw = String(query || "").trim();
      if (!raw) {
        return { success: false, error: "query が必要です" };
      }

      if (!getGeminiPublicConfig().apiKeySet) {
        return {
          success: false,
          step: 20,
          error: "GEMINI_API_KEY が未設定です",
          config: getGeminiPublicConfig(),
        };
      }

      const system =
        systemInstruction ||
        [
          "回答は必ず日本語のみで書いてください。",
          "最新情報が必要な場合は検索結果に基づいて答えてください。",
          "分からない場合は分からないと述べてください。",
          "絵文字は使わないでください。",
        ].join("\n");

      const wantSearch = useGoogleSearch === true;
      const result = await geminiGenerateContent({
        prompt: raw,
        model: model || (wantSearch ? getGeminiSearchModel() : getGeminiLlmModel()),
        useGoogleSearch: wantSearch,
        systemInstruction: system,
      });

      return {
        success: true,
        step: 20,
        stepName: wantSearch ? "Gemini + Google Search" : "Gemini 回答",
        route: wantSearch ? "web" : "general",
        flow: [
          "質問",
          wantSearch ? "Gemini + google_search" : "Gemini generateContent",
          "回答（Ollama なし）",
        ],
        query: raw,
        answer: result.answer || "(空の回答)",
        emptyHint: result.diagnosis?.emptyHint || null,
        model: result.model,
        finishReason: result.finishReason,
        usage: result.usage,
        diagnosis: result.diagnosis,
        sources: result.grounding?.sources || [],
        webSearchQueries: result.grounding?.webSearchQueries || [],
        usedGoogleSearch: result.usedGoogleSearch,
        usedOllama: false,
        usedQdrant: false,
        usedTavily: false,
        geminiDurationMs: result.durationMs,
        totalDurationMs: Date.now() - started,
        config: getGeminiPublicConfig(),
        note: wantSearch
          ? "Grounding は Gemini が検索＋回答。Step17 では Context にして Qwen3 に渡すこともできる。"
          : "通常 LLM（検索なし）。モデル既定は GEMINI_LLM_MODEL（gemini-flash-latest）。",
      };
    } catch (err) {
      log.error("answerFromGemini error", err);
      return {
        success: false,
        step: 20,
        error: formatGeminiError(err),
        config: getGeminiPublicConfig(),
        totalDurationMs: Date.now() - started,
      };
    }
  }
}

export default LlmController;
