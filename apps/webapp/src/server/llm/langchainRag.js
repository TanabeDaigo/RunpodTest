/**
 * Step11 用: LangChain 部品で RAG を組み立てるヘルパー
 *
 * 自前（OllamaService / QdrantService / buildRagMessages）と対応する部品:
 * - OllamaEmbeddings  … Embedding
 * - MetroQdrantRetriever … Qdrant 検索（既存 QdrantService をラップ）
 * - ChatPromptTemplate  … Prompt 組み立て
 * - ChatOllama          … Llama3 生成
 */

import { BaseRetriever } from "@langchain/core/retrievers";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";

/**
 * 既存 QdrantService + OllamaEmbeddings を LangChain Retriever に載せたもの。
 * （学習用: VectorStore の作り直しはせず、Step6 で入れた Collection をそのまま使う）
 */
export class MetroQdrantRetriever extends BaseRetriever {
  static lc_name() {
    return "MetroQdrantRetriever";
  }

  lc_namespace = ["metrojs", "retrievers"];

  /**
   * @param {object} fields
   * @param {object} fields.qdrant - QdrantService インスタンス
   * @param {OllamaEmbeddings} fields.embeddings
   * @param {string} [fields.collection]
   * @param {number} [fields.topK]
   * @param {string} [fields.source]
   * @param {number} [fields.scoreThreshold]
   */
  constructor(fields) {
    super(fields);
    this.qdrant = fields.qdrant;
    this.embeddings = fields.embeddings;
    this.collection = fields.collection;
    this.topK = fields.topK ?? 3;
    this.source = fields.source;
    this.scoreThreshold = fields.scoreThreshold;
  }

  /**
   * @param {string} query
   * @returns {Promise<Document[]>}
   */
  async _getRelevantDocuments(query) {
    const vector = await this.embeddings.embedQuery(String(query || ""));

    let filter;
    if (this.source && String(this.source).trim()) {
      filter = {
        must: [{ key: "source", match: { value: String(this.source).trim() } }],
      };
    }

    const searched = await this.qdrant.search({
      collection: this.collection,
      vector,
      limit: this.topK,
      scoreThreshold: this.scoreThreshold,
      filter,
    });

    return (searched.hits || []).map(
      (h, i) =>
        new Document({
          pageContent: h.payload?.text ?? "",
          metadata: {
            id: h.id,
            score: h.score,
            rank: i + 1,
            source: h.payload?.source ?? null,
            page: h.payload?.page ?? null,
            chunkId: h.payload?.chunkId ?? null,
            charCount: h.payload?.charCount ?? null,
            collection: searched.collection,
          },
        }),
    );
  }
}

/**
 * Document[] を Step8 相当の Context 文字列に整形
 * @param {Document[]} docs
 * @returns {string}
 */
export function formatLangChainDocs(docs = []) {
  if (!docs.length) {
    return "（参考情報なし）";
  }
  return docs
    .map((d, i) => {
      const m = d.metadata || {};
      const scoreRounded =
        typeof m.score === "number" ? Number(m.score.toFixed(4)) : m.score;
      const meta = [
        scoreRounded != null ? `score=${scoreRounded}` : null,
        m.source ? `source=${m.source}` : null,
        m.chunkId != null ? `chunkId=${m.chunkId}` : null,
        m.page != null ? `page=${m.page}` : null,
      ]
        .filter(Boolean)
        .join(", ");
      return `[${m.rank ?? i + 1}] (${meta})\n${d.pageContent || ""}`.trim();
    })
    .join("\n\n---\n\n");
}

/**
 * Document[] → UI 用 hits[]
 * @param {Document[]} docs
 */
export function docsToHits(docs = []) {
  return docs.map((d, i) => {
    const m = d.metadata || {};
    const score = m.score;
    return {
      rank: m.rank ?? i + 1,
      id: m.id ?? null,
      score,
      scoreRounded: typeof score === "number" ? Number(score.toFixed(4)) : score,
      text: d.pageContent || "",
      source: m.source ?? null,
      page: m.page ?? null,
      chunkId: m.chunkId ?? null,
      charCount: m.charCount ?? null,
      textPreview: String(d.pageContent || "").slice(0, 120),
    };
  });
}

/**
 * 自前実装 ↔ LangChain 部品の対応表（学習 UI 用）
 */
export const LANGCHAIN_MAPPING = [
  {
    handrolled: "OllamaService.embeddings",
    langchain: "OllamaEmbeddings.embedQuery",
    role: "質問のベクトル化",
  },
  {
    handrolled: "QdrantService.search",
    langchain: "MetroQdrantRetriever (BaseRetriever)",
    role: "類似チャンク検索",
  },
  {
    handrolled: "buildRagMessages / formatRagContext",
    langchain: "ChatPromptTemplate",
    role: "Prompt 組み立て",
  },
  {
    handrolled: "OllamaService.chat",
    langchain: "ChatOllama",
    role: "回答生成",
  },
];

/**
 * LangChain 部品で RAG を実行する
 * @param {object} params
 * @param {string} params.query
 * @param {string} params.systemPrompt
 * @param {object} params.qdrant - QdrantService インスタンス
 * @param {string} [params.ollamaBaseUrl]
 * @param {string} [params.model]
 * @param {string} [params.embedModel]
 * @param {string} [params.collection]
 * @param {number} [params.topK]
 * @param {string} [params.source]
 * @param {number} [params.scoreThreshold]
 * @param {object} [params.options] - temperature 等（ChatOllama へ）
 */
export async function runLangChainRag({
  query,
  systemPrompt,
  qdrant,
  ollamaBaseUrl,
  model,
  embedModel,
  collection,
  topK = 3,
  source,
  scoreThreshold,
  options = {},
} = {}) {
  const baseUrl = (ollamaBaseUrl || process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(
    /\/$/,
    "",
  );
  const chatModel = model || process.env.OLLAMA_MODEL || "llama3:8b";
  const embModel = embedModel || process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

  const embeddings = new OllamaEmbeddings({
    model: embModel,
    baseUrl,
  });

  const retriever = new MetroQdrantRetriever({
    qdrant,
    embeddings,
    collection,
    topK,
    source,
    scoreThreshold,
  });

  const llm = new ChatOllama({
    model: chatModel,
    baseUrl,
    temperature: options.temperature,
    // その他数値オプションがあれば渡す
    ...(typeof options.num_predict === "number" ? { numPredict: options.num_predict } : {}),
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "{system}"],
    ["human", "## 参考情報\n{context}\n\n## 質問\n{question}"],
  ]);

  // 1) Retriever
  const docs = await retriever.invoke(query);
  const context = formatLangChainDocs(docs);

  // 2) Prompt
  const messages = await prompt.formatMessages({
    system: systemPrompt,
    context,
    question: query,
  });

  // 3) Chat
  const aiMessage = await llm.invoke(messages);
  const answer =
    typeof aiMessage?.content === "string"
      ? aiMessage.content
      : Array.isArray(aiMessage?.content)
        ? aiMessage.content.map((c) => (typeof c === "string" ? c : c?.text || "")).join("")
        : String(aiMessage?.content ?? "");

  const promptText = [
    "### System",
    systemPrompt,
    "",
    "### User",
    `## 参考情報\n${context}\n\n## 質問\n${query}`,
  ].join("\n");

  const serializableMessages = messages.map((m) => ({
    role: m._getType?.() === "system" ? "system" : m._getType?.() === "human" ? "user" : m._getType?.() || "unknown",
    content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
  }));

  return {
    answer,
    docs,
    hits: docsToHits(docs),
    context,
    messages: serializableMessages,
    promptText,
    model: chatModel,
    embedModel: embModel,
    collection: docs[0]?.metadata?.collection || collection || qdrant?.defaultCollection || null,
  };
}
