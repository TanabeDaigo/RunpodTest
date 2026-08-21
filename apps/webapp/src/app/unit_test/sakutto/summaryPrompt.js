/**
 * Sakutto 用: フォーム内容 → LLM 要約プロンプト
 * 生成モデルは UI で listModels（ollama list）から選択する。
 */

/**
 * @param {object} values
 * @returns {boolean}
 */
export function hasAnyRecordInput(values) {
  return ["achievement", "meals", "play", "sleep", "note"].some(
    (k) => String(values?.[k] || "").trim().length > 0,
  );
}

/**
 * @param {object} values
 * @returns {string}
 */
export function buildSummaryUserPrompt(values) {
  const lines = [
    "以下は子どもの1日の記録メモです。保護者が読みやすい、あたたかい日記風の日本語に整えてください。",
    "・事実を歪めないでください",
    "・空欄の項目は無理に作らないでください",
    "・見出しや箇条書きでも、短い段落でも構いません",
    "・前置きや「以下にまとめます」などのメタ発言は不要です。本文だけ出力してください",
    "",
    `① 今日できるようになったこと: ${values.achievement?.trim() || "（未記入）"}`,
    `② 今日食べたもの: ${values.meals?.trim() || "（未記入）"}`,
    `③ 今日遊んだこと: ${values.play?.trim() || "（未記入）"}`,
    `④ 今日の睡眠: ${values.sleep?.trim() || "（未記入）"}`,
    `⑤ 今日のひとこと: ${values.note?.trim() || "（未記入）"}`,
  ];
  return lines.join("\n");
}

export const SUMMARY_SYSTEM_PROMPT =
  "あなたは子育て日記の編集アシスタントです。必ず日本語だけで、簡潔で優しい文章を書いてください。思考過程や英語の説明は出力しないでください。";

/**
 * Qwen などが思考タグを付けた場合に本文だけ残す
 * @param {string} text
 */
export function stripModelNoise(text) {
  let t = String(text || "");
  t = t.replace(/<think>[\s\S]*?<\/think>/gi, "");
  t = t.replace(/```[\s\S]*?```/g, (block) => {
    // コードフェンスで本文だけ囲まれている場合は中身を使う
    const inner = block.replace(/^```\w*\n?/, "").replace(/```$/, "").trim();
    return inner || block;
  });
  return t.trim();
}
