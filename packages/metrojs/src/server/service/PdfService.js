import logjs from "@metrojs/logjs";
import { PDFParse } from "pdf-parse";

const log = new logjs("PdfService");

/**
 * PDF テキスト抽出（DocumentLoader 相当・Step4）
 *
 * 文字入り PDF を対象。スキャン画像のみの PDF は OCR が別途必要（未対応）。
 */
class PdfService {
  /**
   * Buffer / Uint8Array / base64 文字列から PDF を解析
   * @param {object} params
   * @param {Buffer|Uint8Array|string} params.data Buffer / Uint8Array / base64
   * @param {string} [params.filename]
   * @param {boolean} [params.isBase64]
   */
  async parse({ data, filename = "document.pdf", isBase64 = false } = {}) {
    const buffer = this._toBuffer(data, isBase64);
    if (!buffer || buffer.length === 0) {
      throw new Error("PDF data is empty");
    }

    // %PDF ヘッダ簡易チェック
    const header = buffer.subarray(0, 5).toString("utf8");
    if (!header.startsWith("%PDF")) {
      throw new Error("Invalid PDF: file does not start with %PDF header（スキャン画像や別形式の可能性）");
    }

    log.info("[PdfService] parse start", { filename, bytes: buffer.length });

    const parser = new PDFParse({ data: buffer });
    try {
      const info = await parser.getInfo();
      const textResult = await parser.getText();

      const pages = (textResult.pages || []).map((p) => ({
        page: p.num,
        text: (p.text || "").trim(),
        charCount: (p.text || "").trim().length,
      }));

      // ページ区切りフッタ（"-- 1 of N --"）を除いた全文
      const fullText = pages
        .map((p) => p.text)
        .filter(Boolean)
        .join("\n\n");

      const totalPages = textResult.total || info.total || pages.length;
      const emptyPages = pages.filter((p) => p.charCount === 0).length;
      const diagnostics = this._diagnoseExtractability(buffer, fullText, totalPages, emptyPages);

      return {
        filename,
        numpages: totalPages,
        charCount: fullText.length,
        text: fullText,
        textPreview: fullText.slice(0, 500),
        pages,
        emptyPages,
        warning: diagnostics.warning,
        extractability: diagnostics.extractability,
        info: {
          pdfVersion: info?.info?.PDFFormatVersion,
          title: info?.info?.Title || null,
          author: info?.info?.Author || null,
          producer: info?.info?.Producer || null,
          creator: info?.info?.Creator || null,
        },
      };
    } finally {
      await parser.destroy();
    }
  }

  /**
   * 抽出可否の診断（CID フォント + ToUnicode なし 等）
   * @private
   */
  _diagnoseExtractability(buffer, fullText, totalPages, emptyPages) {
    const ascii = buffer.toString("latin1");
    const hasToUnicode = /\/ToUnicode\b/.test(ascii);
    const hasCid = /\/Subtype\s*\/Type0\b|CIDFont|CIDSystemInfo|HeiseiMin|HeiseiKaku|KozMin|KozGo/.test(ascii);
    const isReportLab = /ReportLab/i.test(ascii);

    if (fullText.length > 0) {
      return {
        extractability: "ok",
        warning:
          emptyPages > 0
            ? `${emptyPages} ページはテキストが空です（画像ページの可能性）。`
            : null,
      };
    }

    if (hasCid && !hasToUnicode) {
      return {
        extractability: "cid_without_tounicode",
        warning: [
          "テキストが抽出できませんでした。",
          "この PDF は日本語フォント（CID）を使っていますが、Unicode 対応表（ToUnicode）が無いため、",
          "画面上では読めてもプログラムでは文字に戻せません。",
          isReportLab ? "（ReportLab 生成 PDF に多いパターンです）" : "",
          "",
          "対処:",
          "1) Word / Googleドキュメント等から「PDFとして保存」し直す（文字がコピーできるか確認）",
          "2) または Step4 では検証用の「文字選択できる PDF」を使う",
          "3) どうしてもこのファイルが必要なら、後で OCR（画像認識）が必要",
        ]
          .filter((line) => line !== "")
          .join("\n"),
      };
    }

    return {
      extractability: "empty_or_image_only",
      warning:
        "テキストが抽出できませんでした。スキャン PDF（画像のみ）の可能性があります。OCR が必要です。",
    };
  }

  /**
   * @private
   */
  _toBuffer(data, isBase64) {
    if (Buffer.isBuffer(data)) {
      return data;
    }
    if (data instanceof Uint8Array) {
      return Buffer.from(data);
    }
    if (typeof data === "string") {
      // data URL 除去
      const raw = data.includes("base64,") ? data.split("base64,").pop() : data;
      if (isBase64 || /^[A-Za-z0-9+/=\s]+$/.test(raw.slice(0, 100))) {
        return Buffer.from(raw.replace(/\s/g, ""), "base64");
      }
      return Buffer.from(data);
    }
    throw new Error("Unsupported PDF data type");
  }
}

if (typeof window !== "undefined") {
  throw new Error("PdfServiceはサーバーサイドでのみ使用可能です");
}

export default PdfService;
