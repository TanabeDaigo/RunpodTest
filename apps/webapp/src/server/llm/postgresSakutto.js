/**
 * サクッと記録（Sakutto）用 PostgreSQL 操作
 * テーブル: sakutto_records（user_id は MySQL ユーザー ID を文字列で保持）
 */

import { getLlmPgPool } from "./postgresPrice.js";

/**
 * @param {object|null|undefined} session
 * @returns {string|null}
 */
export function resolveSakuttoUserId(session) {
  const u = session?.user;
  if (!u) return null;
  const id = u.user_id ?? u.id ?? u.sub;
  if (id == null || id === "") return null;
  return String(id);
}

/**
 * ローカル日付を YYYY-MM-DD にする
 * @param {Date} [date]
 */
export function toDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * @param {object} row
 */
function mapRecord(row) {
  const recordDate =
    row.record_date instanceof Date
      ? toDateString(row.record_date)
      : String(row.record_date || "").slice(0, 10);

  return {
    id: String(row.id),
    userId: String(row.user_id),
    recordDate,
    achievement: row.achievement || "",
    meals: row.meals || "",
    play: row.play || "",
    sleep: row.sleep_note || "",
    note: row.note || "",
    summary: row.summary || "",
    photoPath: row.photo_path || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * 同一 user + record_date なら上書き（UPSERT）
 * @param {object} input
 */
export async function upsertSakuttoRecord(input) {
  const userId = String(input.userId || "").trim();
  const recordDate = String(input.recordDate || "").trim() || toDateString();
  if (!userId) {
    throw new Error("userId が必要です");
  }

  const result = await getLlmPgPool().query(
    `
    INSERT INTO sakutto_records (
      user_id, record_date,
      achievement, meals, play, sleep_note, note,
      summary, photo_path,
      created_at, updated_at
    ) VALUES (
      $1, $2::date,
      $3, $4, $5, $6, $7,
      $8, $9,
      NOW(), NOW()
    )
    ON CONFLICT (user_id, record_date) DO UPDATE SET
      achievement = EXCLUDED.achievement,
      meals = EXCLUDED.meals,
      play = EXCLUDED.play,
      sleep_note = EXCLUDED.sleep_note,
      note = EXCLUDED.note,
      summary = EXCLUDED.summary,
      photo_path = COALESCE(EXCLUDED.photo_path, sakutto_records.photo_path),
      updated_at = NOW()
    RETURNING *
    `,
    [
      userId,
      recordDate,
      input.achievement || null,
      input.meals || null,
      input.play || null,
      input.sleep || input.sleepNote || null,
      input.note || null,
      input.summary || null,
      input.photoPath || null,
    ],
  );

  return mapRecord(result.rows[0]);
}

/**
 * 指定日の記録を1件取得
 * @param {string} userId
 * @param {string} recordDate - YYYY-MM-DD
 */
export async function getSakuttoRecordByDate(userId, recordDate) {
  const uid = String(userId || "").trim();
  const date = String(recordDate || "").trim();
  if (!uid) {
    throw new Error("userId が必要です");
  }
  if (!date) {
    throw new Error("recordDate が必要です");
  }

  const result = await getLlmPgPool().query(
    `
    SELECT *
    FROM sakutto_records
    WHERE user_id = $1 AND record_date = $2::date
    LIMIT 1
    `,
    [uid, date],
  );

  if (!result.rows[0]) {
    return null;
  }
  return mapRecord(result.rows[0]);
}

/**
 * 最近の記録（新しい日付順）
 * @param {string} userId
 * @param {number} [limit]
 */
export async function listRecentSakuttoRecords(userId, limit = 10) {
  const uid = String(userId || "").trim();
  if (!uid) {
    throw new Error("userId が必要です");
  }
  const lim = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const result = await getLlmPgPool().query(
    `
    SELECT *
    FROM sakutto_records
    WHERE user_id = $1
    ORDER BY record_date DESC, id DESC
    LIMIT $2
    `,
    [uid, lim],
  );

  return result.rows.map(mapRecord);
}
