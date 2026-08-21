/**
 * Ollama モデル一覧の分類ヘルパー（LLM 学習ラボ / Sakutto 共通）
 */

/** Embedding 専用っぽい名前か */
export function isEmbedModelName(name) {
  const n = String(name || "").toLowerCase();
  if (!n) return false;
  return n.includes("embed") || n.includes("nomic-embed");
}

/** Chat / 生成用として選べる名前か */
export function isChatModelName(name) {
  const n = String(name || "").toLowerCase();
  if (!n) return false;
  return !isEmbedModelName(n);
}

/**
 * listModels の models[] から名前配列を取る
 * @param {Array<{ name?: string }|string>} models
 * @param {"chat"|"embed"|"all"} [kind]
 */
export function filterModelNames(models = [], kind = "all") {
  const names = models
    .map((m) => (typeof m === "string" ? m : m?.name))
    .filter(Boolean);

  if (kind === "chat") return names.filter(isChatModelName);
  if (kind === "embed") return names.filter(isEmbedModelName);
  return names;
}

/**
 * 初期選択を決める
 * @param {string[]} names
 * @param {"chat"|"embed"} kind
 * @param {string} [preferred] env デフォルトなど
 */
export function pickPreferredModel(names, kind = "chat", preferred) {
  if (!names.length) return "";
  if (preferred && names.includes(preferred)) return preferred;

  if (kind === "embed") {
    return (
      names.find((n) => n.startsWith("nomic-embed-text")) ||
      names.find((n) => n.toLowerCase().includes("embed")) ||
      names[0]
    );
  }

  return (
    names.find((n) => n.startsWith("qwen3")) ||
    names.find((n) => n.startsWith("llama3")) ||
    names[0]
  );
}
