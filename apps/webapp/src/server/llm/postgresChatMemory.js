/**
 * Step19: 会話 Memory（PostgreSQL llm_chat_messages）
 * 本体 MySQL ではなく、学習ラボ専用 PG（metro_llm）に蓄積する。
 */

import logjs from "@metrojs/logjs";
import { getLlmPgPool, getLlmPgPublicConfig } from "./postgresPrice.js";
import { normalizeTenantId } from "./tenantScope.js";

const log = new logjs("LlmChatMemory");

const DDL = `
CREATE TABLE IF NOT EXISTS llm_chat_messages (
  id            BIGSERIAL PRIMARY KEY,
  tenant_id     TEXT        NOT NULL,
  user_id       TEXT        NOT NULL,
  session_id    TEXT        NOT NULL,
  role          TEXT        NOT NULL
                CHECK (role IN ('user', 'assistant', 'system')),
  content       TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_llm_chat_messages_scope_created
  ON llm_chat_messages (tenant_id, user_id, session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_llm_chat_messages_created
  ON llm_chat_messages (created_at DESC);
`;

/**
 * @param {unknown} raw
 * @returns {string}
 */
export function normalizeMemoryUserId(raw) {
  return String(raw ?? "")
    .trim()
    .slice(0, 128);
}

/**
 * @param {unknown} raw
 * @returns {string}
 */
export function normalizeSessionId(raw) {
  const s = String(raw ?? "")
    .trim()
    .slice(0, 128);
  return s || "default";
}

/**
 * @param {object} row
 */
function mapMessage(row) {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    userId: String(row.user_id),
    sessionId: String(row.session_id),
    role: String(row.role),
    content: String(row.content || ""),
    createdAt: row.created_at,
  };
}

/**
 * Windows の psql (client_encoding=SJIS) で SELECT が落ちないよう、
 * 絵文字など SJIS に無い文字を除去する。
 * DB 自体は UTF8 のままで問題ないが、運用ツール向けに防御する。
 * @param {string} text
 * @returns {string}
 */
export function sanitizeMemoryText(text) {
  let t = String(text || "");
  // 絵文字・記号類（拡張絵文字含む）
  t = t.replace(/\p{Extended_Pictographic}/gu, "");
  t = t.replace(/\uFE0F|\u200D/g, "");
  // サロゲートペア残り・その他の非 BMP（SJIS に無いことが多い）
  t = t.replace(/[\u{10000}-\u{10FFFF}]/gu, "");
  return t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * @returns {Promise<{ created: boolean, config: object }>}
 */
export async function ensureChatMemoryTable() {
  const pool = getLlmPgPool();
  await pool.query(DDL);
  log.info("[LlmChatMemory] ensure table llm_chat_messages");
  return {
    created: true,
    table: "llm_chat_messages",
    config: getLlmPgPublicConfig(),
  };
}

/**
 * 直近 N 件を古い順で返す（chat messages 用）
 * @param {object} params
 * @param {string} params.tenantId
 * @param {string} params.userId
 * @param {string} [params.sessionId]
 * @param {number} [params.limit]
 */
export async function listChatMemory({
  tenantId,
  userId,
  sessionId = "default",
  limit = 12,
} = {}) {
  const tid = normalizeTenantId(tenantId);
  const uid = normalizeMemoryUserId(userId);
  const sid = normalizeSessionId(sessionId);
  const lim = Math.min(Math.max(Number(limit) || 12, 1), 100);

  if (!tid) throw new Error("tenantId が必要です");
  if (!uid) throw new Error("userId が必要です");

  await ensureChatMemoryTable();

  const result = await getLlmPgPool().query(
    `
    SELECT id, tenant_id, user_id, session_id, role, content, created_at
    FROM (
      SELECT id, tenant_id, user_id, session_id, role, content, created_at
      FROM llm_chat_messages
      WHERE tenant_id = $1
        AND user_id = $2
        AND session_id = $3
      ORDER BY created_at DESC, id DESC
      LIMIT $4
    ) recent
    ORDER BY created_at ASC, id ASC
    `,
    [tid, uid, sid, lim],
  );

  return {
    tenantId: tid,
    userId: uid,
    sessionId: sid,
    limit: lim,
    messages: (result.rows || []).map(mapMessage),
  };
}

/**
 * @param {object} params
 * @param {string} params.tenantId
 * @param {string} params.userId
 * @param {string} [params.sessionId]
 * @param {"user"|"assistant"|"system"} params.role
 * @param {string} params.content
 */
export async function appendChatMemory({
  tenantId,
  userId,
  sessionId = "default",
  role,
  content,
} = {}) {
  const tid = normalizeTenantId(tenantId);
  const uid = normalizeMemoryUserId(userId);
  const sid = normalizeSessionId(sessionId);
  const r = String(role || "").trim();
  const text = sanitizeMemoryText(content);

  if (!tid) throw new Error("tenantId が必要です");
  if (!uid) throw new Error("userId が必要です");
  if (!["user", "assistant", "system"].includes(r)) {
    throw new Error("role は user | assistant | system である必要があります");
  }
  if (!text) throw new Error("content が必要です（絵文字除去後に空になりました）");

  await ensureChatMemoryTable();

  const result = await getLlmPgPool().query(
    `
    INSERT INTO llm_chat_messages (tenant_id, user_id, session_id, role, content)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, tenant_id, user_id, session_id, role, content, created_at
    `,
    [tid, uid, sid, r, text],
  );

  return {
    message: mapMessage(result.rows[0]),
  };
}

/**
 * セッション単位で履歴削除
 * @param {object} params
 */
export async function clearChatMemory({
  tenantId,
  userId,
  sessionId = "default",
} = {}) {
  const tid = normalizeTenantId(tenantId);
  const uid = normalizeMemoryUserId(userId);
  const sid = normalizeSessionId(sessionId);

  if (!tid) throw new Error("tenantId が必要です");
  if (!uid) throw new Error("userId が必要です");

  await ensureChatMemoryTable();

  const result = await getLlmPgPool().query(
    `
    DELETE FROM llm_chat_messages
    WHERE tenant_id = $1
      AND user_id = $2
      AND session_id = $3
    `,
    [tid, uid, sid],
  );

  return {
    tenantId: tid,
    userId: uid,
    sessionId: sid,
    deleted: result.rowCount ?? 0,
  };
}

/**
 * Ollama chat 用に { role, content }[] へ
 * @param {Array<{ role: string, content: string }>} messages
 */
export function toOllamaChatMessages(messages = []) {
  return (messages || [])
    .filter((m) => m && ["user", "assistant", "system"].includes(m.role) && m.content)
    .map((m) => ({
      role: m.role,
      content: String(m.content),
    }));
}
