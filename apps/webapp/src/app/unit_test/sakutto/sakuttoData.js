/**
 * サクッと記録（Sakutto）— テーマカラー
 * 白 / ライトグリーン / オレンジアクセント
 */
export const sakuttoColors = {
  bg: "#F7FBF7",
  paper: "#FFFFFF",
  primary: "#7CB342",
  primaryDark: "#689F38",
  primarySoft: "#E8F5E9",
  accent: "#FF8A65",
  accentSoft: "#FFF3E0",
  text: "#3E4A3D",
  textMuted: "#6B7569",
  border: "#D7E5D4",
};

/**
 * 今日の日付を日本語で整形
 * @param {Date} [date]
 * @returns {string} 例: 2026年7月27日（月）
 */
export function formatJapaneseDate(date = new Date()) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = weekdays[date.getDay()];
  return `${y}年${m}月${d}日（${w}）`;
}

/**
 * Date → YYYY-MM-DD（ローカル）
 * @param {Date} [date]
 */
export function toYmd(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * YYYY-MM-DD を Date（ローカル正午）に
 * @param {string} ymd
 * @returns {Date|null}
 */
export function parseYmd(ymd) {
  const m = String(ymd || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
}

/**
 * YYYY-MM-DD に日数を加算
 * @param {string} ymd
 * @param {number} days
 */
export function addDaysYmd(ymd, days) {
  const d = parseYmd(ymd) || new Date();
  d.setDate(d.getDate() + Number(days || 0));
  return toYmd(d);
}

/**
 * 記録日の表示ラベル（今日 / 昨日 / 一昨日 / n日前 / 日付）
 * @param {string} recordDate - YYYY-MM-DD
 * @param {Date} [now]
 */
export function formatRecordDateLabel(recordDate, now = new Date()) {
  const d = parseYmd(recordDate);
  if (!d) return recordDate || "";

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((today - target) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  if (diffDays === 2) return "一昨日";
  if (diffDays > 2 && diffDays < 14) return `${diffDays}日前`;
  return formatJapaneseDate(d);
}

/**
 * API レコード → 一覧表示用
 * @param {object} record
 */
export function toRecentRecordView(record) {
  const summary = String(record?.summary || "").trim();
  const fallback = String(record?.achievement || record?.note || "").trim();
  return {
    id: String(record?.id ?? record?.recordDate ?? ""),
    dateText: formatRecordDateLabel(record?.recordDate),
    summary: summary || fallback || "（内容なし）",
  };
}
