-- =============================================================================
-- Step19: User Memory（会話履歴）
-- 蓄積先: 学習ラボ専用 PostgreSQL（例: database = metro_llm）
-- 接続: LLM_PG_HOST / LLM_PG_PORT / LLM_PG_USER / LLM_PG_PASSWORD / LLM_PG_DATABASE
--
-- 実行例:
--   psql -h 127.0.0.1 -U postgres -d metro_llm -f apps/webapp/scripts/sql/llm_chat_messages.sql
--
-- Windows で SELECT 時に SJIS エラーが出る場合（絵文字など）:
--   SET client_encoding TO 'UTF8';
--   または psql 起動前に: chcp 65001
-- アプリ側は Memory 保存時に絵文字を除去します。
-- =============================================================================

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

COMMENT ON TABLE llm_chat_messages IS 'Step19: tenant+user+session 単位の会話 Memory';
COMMENT ON COLUMN llm_chat_messages.tenant_id IS 'テナント境界（他社履歴を混ぜない）';
COMMENT ON COLUMN llm_chat_messages.user_id IS 'ユーザー境界（本番はセッションから解決）';
COMMENT ON COLUMN llm_chat_messages.session_id IS '会話スレッド。変えると文脈が切れる';
COMMENT ON COLUMN llm_chat_messages.role IS 'user | assistant | system';
COMMENT ON COLUMN llm_chat_messages.content IS 'メッセージ本文（Main に渡す直近 N 件用）';

CREATE INDEX IF NOT EXISTS idx_llm_chat_messages_scope_created
  ON llm_chat_messages (tenant_id, user_id, session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_llm_chat_messages_created
  ON llm_chat_messages (created_at DESC);
