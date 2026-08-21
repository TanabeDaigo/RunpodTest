import logjs from "@metrojs/logjs";

const log = new logjs("ChunkService");

/**
 * 区切り優先順（RecursiveCharacterTextSplitter 相当）
 * 大きい境界から試し、だめなら次へ。最後は1文字単位。
 */
const DEFAULT_SEPARATORS = ["\n\n", "\n", "。", "．", "！", "？", "、", " ", ""];

/**
 * テキスト分割（Chunking / Step5）
 *
 * LangChain なしで RecursiveCharacterTextSplitter の考え方を実装。
 * Step6 で各 chunk を Embedding → Qdrant に渡す。
 */
class ChunkService {
  /**
   * @param {object} [config]
   * @param {number} [config.chunkSize]
   * @param {number} [config.chunkOverlap]
   * @param {string[]} [config.separators]
   */
  constructor(config = {}) {
    this.defaultChunkSize = Number(config.chunkSize || process.env.CHUNK_SIZE || 500);
    this.defaultChunkOverlap = Number(config.chunkOverlap || process.env.CHUNK_OVERLAP || 80);
    this.separators = Array.isArray(config.separators) ? config.separators : DEFAULT_SEPARATORS;
  }

  /**
   * 単一テキストを分割
   * @param {object} params
   * @param {string} params.text
   * @param {number} [params.chunkSize]
   * @param {number} [params.chunkOverlap]
   * @param {object} [params.metadata]
   */
  splitText({ text, chunkSize, chunkOverlap, metadata = {} } = {}) {
    const size = Number(chunkSize ?? this.defaultChunkSize);
    const overlap = Number(chunkOverlap ?? this.defaultChunkOverlap);
    this._validateParams(size, overlap);

    if (!text || !String(text).trim()) {
      return { chunkSize: size, chunkOverlap: overlap, count: 0, chunks: [] };
    }

    const pieces = this._splitRecursive(String(text).trim(), this.separators, size);
    const merged = this._buildChunksWithOverlap(pieces, size, overlap);

    const chunks = merged.map((chunkText, index) => ({
      id: index,
      text: chunkText,
      charCount: chunkText.length,
      ...metadata,
    }));

    log.info("[ChunkService] splitText", {
      inputChars: text.length,
      chunkSize: size,
      chunkOverlap: overlap,
      count: chunks.length,
    });

    return {
      chunkSize: size,
      chunkOverlap: overlap,
      separators: this.separators.filter((s) => s !== ""),
      count: chunks.length,
      avgCharCount:
        chunks.length > 0
          ? Math.round(chunks.reduce((sum, c) => sum + c.charCount, 0) / chunks.length)
          : 0,
      chunks,
    };
  }

  /**
   * Step4 document 形（pages[]）をまとめて分割
   * @param {object} params
   * @param {string} [params.source]
   * @param {Array<{ page?: number, text: string }>} [params.pages]
   * @param {string} [params.text]
   * @param {number} [params.chunkSize]
   * @param {number} [params.chunkOverlap]
   */
  splitDocument({ source = "document", pages, text, chunkSize, chunkOverlap } = {}) {
    const size = Number(chunkSize ?? this.defaultChunkSize);
    const overlap = Number(chunkOverlap ?? this.defaultChunkOverlap);

    const pageList =
      Array.isArray(pages) && pages.length > 0
        ? pages
        : [{ page: null, text: text || "" }];

    const allChunks = [];
    for (const page of pageList) {
      const pageText = page?.text || "";
      if (!String(pageText).trim()) continue;

      const result = this.splitText({
        text: pageText,
        chunkSize: size,
        chunkOverlap: overlap,
        metadata: {
          source,
          page: page.page ?? null,
        },
      });

      for (const chunk of result.chunks) {
        allChunks.push({
          ...chunk,
          id: allChunks.length,
        });
      }
    }

    return {
      source,
      chunkSize: size,
      chunkOverlap: overlap,
      pageCount: pageList.length,
      count: allChunks.length,
      avgCharCount:
        allChunks.length > 0
          ? Math.round(allChunks.reduce((sum, c) => sum + c.charCount, 0) / allChunks.length)
          : 0,
      chunks: allChunks,
      document: {
        source,
        chunks: allChunks,
      },
    };
  }

  /**
   * @private
   */
  _validateParams(size, overlap) {
    if (!Number.isFinite(size) || size <= 0) {
      throw new Error("chunkSize must be a positive number");
    }
    if (!Number.isFinite(overlap) || overlap < 0) {
      throw new Error("chunkOverlap must be >= 0");
    }
    if (overlap >= size) {
      throw new Error("chunkOverlap must be smaller than chunkSize");
    }
  }

  /**
   * 大きい区切りから再帰的に分割し、各片を chunkSize 以下にする
   * @private
   */
  _splitRecursive(text, separators, chunkSize) {
    if (text.length <= chunkSize) {
      return text ? [text] : [];
    }

    let separator = "";
    let nextSeparators = [];
    for (let i = 0; i < separators.length; i++) {
      const candidate = separators[i];
      if (candidate === "") {
        separator = "";
        nextSeparators = [];
        break;
      }
      if (text.includes(candidate)) {
        separator = candidate;
        nextSeparators = separators.slice(i + 1);
        break;
      }
    }

    if (separator === "") {
      // 文字単位
      const chars = [];
      for (let i = 0; i < text.length; i += chunkSize) {
        chars.push(text.slice(i, i + chunkSize));
      }
      return chars;
    }

    const parts = text.split(separator);
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      // 末尾以外は区切り文字を末尾に残す（。「」などの文脈維持）
      const normalized = i < parts.length - 1 ? part + separator : part;

      if (normalized.length <= chunkSize) {
        result.push(normalized);
      } else {
        result.push(...this._splitRecursive(normalized, nextSeparators, chunkSize));
      }
    }
    return result.filter(Boolean);
  }

  /**
   * 片を chunkSize 近くまで詰め、次 chunk 先頭に overlap を載せる
   * @private
   */
  _buildChunksWithOverlap(pieces, chunkSize, overlap) {
    if (!pieces.length) return [];

    const chunks = [];
    let buffer = "";

    const flush = () => {
      const trimmed = buffer.trim();
      if (trimmed) chunks.push(trimmed);
      // 次の先頭用 overlap
      buffer = overlap > 0 ? buffer.slice(Math.max(0, buffer.length - overlap)) : "";
    };

    for (const piece of pieces) {
      if (!piece) continue;

      if (!buffer) {
        buffer = piece;
        if (buffer.length >= chunkSize) {
          // 大きすぎる片は強制スライス
          while (buffer.length > chunkSize) {
            chunks.push(buffer.slice(0, chunkSize));
            buffer = overlap > 0 ? buffer.slice(chunkSize - overlap) : buffer.slice(chunkSize);
          }
        }
        continue;
      }

      if (buffer.length + piece.length <= chunkSize) {
        buffer += piece;
      } else {
        flush();
        buffer = (buffer || "") + piece;
        while (buffer.length > chunkSize) {
          chunks.push(buffer.slice(0, chunkSize));
          buffer = overlap > 0 ? buffer.slice(chunkSize - overlap) : buffer.slice(chunkSize);
        }
      }
    }

    const last = buffer.trim();
    if (last && (chunks.length === 0 || chunks[chunks.length - 1] !== last)) {
      chunks.push(last);
    }

    return chunks;
  }
}

if (typeof window !== "undefined") {
  throw new Error("ChunkServiceはサーバーサイドでのみ使用可能です");
}

export default ChunkService;
