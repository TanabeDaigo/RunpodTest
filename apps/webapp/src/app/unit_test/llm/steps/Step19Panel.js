"use client";

import { useCallback, useState } from "react";
import { logjs, apijs } from "@lib/client";
import {
  TestDialogCard,
  TestDialogTitle,
  TestDialogDescription,
  CodeBlock,
} from "../../styles";
import {
  Button,
  TextField,
  CircularProgress,
  Chip,
  Stack,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP19_FLOW, STEP19_CODE, STEP19_LEARNING_NOTES } from "../examples";
import { STEP19_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep19");
const api = new apijs("api/llm");

const SAMPLE_TURNS = [
  "私の名前は太郎です。覚えておいてください。",
  "私の名前は何でしたか？",
  "さっきの名前に「さん」を付けて呼んでください。",
];

/**
 * Step19: User Memory（PostgreSQL）
 */
export default function Step19Panel() {
  const [tenantId, setTenantId] = useState("acme");
  const [userId, setUserId] = useState("user-1");
  const [sessionId, setSessionId] = useState("session-a");
  const [mainModel, setMainModel] = useState("");
  const [routerModel, setRouterModel] = useState("");
  const [useMemory, setUseMemory] = useState(true);
  const [memoryLimit, setMemoryLimit] = useState(12);
  const [prompt, setPrompt] = useState(SAMPLE_TURNS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableInfo, setTableInfo] = useState(null);
  const [memoryList, setMemoryList] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const refreshMemory = useCallback(async () => {
    if (!tenantId.trim() || !userId.trim()) return;
    try {
      const res = await api.post({
        mode: "listChatMemory",
        tenantId: tenantId.trim(),
        userId: userId.trim(),
        sessionId: sessionId.trim() || "default",
        limit: Number(memoryLimit) || 12,
      });
      if (res?.success) {
        setMemoryList(res);
      } else {
        setError(res?.error || "Memory 一覧の取得に失敗");
      }
    } catch (err) {
      log.error("listChatMemory failed", err);
      setError(err.message || "Memory 一覧エラー");
    }
  }, [tenantId, userId, sessionId, memoryLimit]);

  const handleEnsureTable = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post({ mode: "ensureChatMemoryTable" });
      if (res?.success) {
        setTableInfo(res);
      } else {
        setError(res?.error || "テーブル作成に失敗");
      }
    } catch (err) {
      log.error("ensureChatMemoryTable failed", err);
      setError(err.message || "テーブル作成エラー");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post({
        mode: "clearChatMemory",
        tenantId: tenantId.trim(),
        userId: userId.trim(),
        sessionId: sessionId.trim() || "default",
      });
      if (res?.success) {
        setLastResult(null);
        await refreshMemory();
      } else {
        setError(res?.error || "クリアに失敗");
      }
    } catch (err) {
      log.error("clearChatMemory failed", err);
      setError(err.message || "クリアエラー");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!prompt.trim() || loading) return;
    if (!mainModel) {
      setError("Main モデルを選択してください");
      return;
    }
    if (useMemory && (!tenantId.trim() || !userId.trim())) {
      setError("Memory 利用時は tenantId と userId が必要です");
      return;
    }

    setLoading(true);
    setError("");
    setLastResult(null);
    try {
      const res = await api.post({
        mode: "orchestrateAsk",
        query: prompt.trim(),
        routerModel: routerModel || mainModel,
        mainModel,
        forceRoute: "general",
        tenantId: tenantId.trim(),
        userId: userId.trim(),
        sessionId: sessionId.trim() || "default",
        useMemory,
        memoryLimit: Number(memoryLimit) || 12,
        skipAnswer: false,
      });
      if (res?.success) {
        setLastResult(res);
        await refreshMemory();
      } else {
        setError(res?.error || "送信に失敗しました");
        setLastResult(res);
      }
    } catch (err) {
      log.error("orchestrateAsk failed", err);
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① Memory の蓄積先（PostgreSQL）</TestDialogTitle>
        <TestDialogDescription>
          会話は Qdrant ではなく、学習ラボ用 PG（例: <code>metro_llm</code>）の
          <code>llm_chat_messages</code> に保存します。DDL は{" "}
          <code>apps/webapp/scripts/sql/llm_chat_messages.sql</code>。
          下のボタンでも <code>CREATE TABLE IF NOT EXISTS</code> 相当を実行できます。
        </TestDialogDescription>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          <Button variant="outlined" onClick={handleEnsureTable} disabled={loading}>
            テーブルを確保（ensure）
          </Button>
          <Button variant="outlined" onClick={refreshMemory} disabled={loading}>
            Memory 再読込
          </Button>
          <Button color="warning" variant="outlined" onClick={handleClear} disabled={loading}>
            この session をクリア
          </Button>
        </Stack>

        {tableInfo?.success && (
          <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
            table={tableInfo.table} / DB={tableInfo.config?.database || "—"} / sql=
            {tableInfo.sqlPath}
          </Typography>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>② スコープとモデル</TestDialogTitle>
        <TestDialogDescription>
          Memory は <code>tenant_id + user_id + session_id</code> で隔離します。
          デモは <code>forceRoute=general</code> で Router を固定し、文脈引き継ぎだけ見やすくしています。
        </TestDialogDescription>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="tenantId"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="sessionId"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            fullWidth
            disabled={loading}
            helperText="変えると文脈が切れる"
          />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <OllamaModelSelect
            kind="chat"
            label="Main モデル"
            value={mainModel}
            onChange={setMainModel}
            disabled={loading}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <OllamaModelSelect
            kind="chat"
            label="Router モデル（forceRoute 時は未使用可）"
            value={routerModel}
            onChange={setRouterModel}
            disabled={loading}
            helperText="空なら Main と同じモデル名を使います"
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 1 }} alignItems="center" flexWrap="wrap">
          <FormControlLabel
            control={
              <Switch
                checked={useMemory}
                onChange={(e) => setUseMemory(e.target.checked)}
                disabled={loading}
              />
            }
            label="useMemory（履歴を注入して保存）"
          />
          <TextField
            label="memoryLimit"
            type="number"
            size="small"
            value={memoryLimit}
            onChange={(e) => setMemoryLimit(e.target.value)}
            sx={{ width: 120 }}
            disabled={loading}
            inputProps={{ min: 2, max: 40 }}
          />
        </Stack>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>③ 続きの質問</TestDialogTitle>
        <TextField
          label="質問"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 1 }}
          disabled={loading}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
          {SAMPLE_TURNS.map((q) => (
            <Button
              key={q}
              size="small"
              variant="outlined"
              disabled={loading}
              onClick={() => setPrompt(q)}
            >
              {q.slice(0, 18)}…
            </Button>
          ))}
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleAsk} disabled={loading || !prompt.trim()}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "送信（Memory 付き ask）"}
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}
      </TestDialogCard>

      {lastResult?.success && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>④ 回答</TestDialogTitle>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
            <Chip label={`route=${lastResult.route}`} size="small" />
            {lastResult.useMemory && <Chip label="Memory ON" color="success" size="small" />}
            {lastResult.memory?.loadedCount != null && (
              <Chip
                label={`loaded ${lastResult.memory.loadedCount}`}
                size="small"
                variant="outlined"
              />
            )}
            {lastResult.memory?.appended && (
              <Chip label="appended" size="small" color="primary" variant="outlined" />
            )}
          </Stack>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="body2">{lastResult.answer}</Typography>
          </Box>
          {lastResult.flow && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              {lastResult.flow.join(" → ")}
            </Typography>
          )}
        </TestDialogCard>
      )}

      {memoryList?.messages && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>⑤ 保存済み Memory（PG）</TestDialogTitle>
          <Typography variant="caption" color="text.secondary">
            {memoryList.tenantId} / {memoryList.userId} / {memoryList.sessionId}（
            {memoryList.messages.length} 件）
          </Typography>
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {memoryList.messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Chip
                  label={m.role}
                  size="small"
                  color={m.role === "user" ? "primary" : "default"}
                  sx={{ mb: 0.5 }}
                />
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {m.content}
                </Typography>
              </Box>
            ))}
            {memoryList.messages.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                （まだ履歴がありません）
              </Typography>
            )}
          </Stack>
        </TestDialogCard>
      )}

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑥ 処理の流れ / コード / 学び</TestDialogTitle>
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">処理フロー</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP19_FLOW}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">コード例</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP19_CODE}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">学習メモ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP19_LEARNING_NOTES}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">セットアップ・SQL</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP19_SETUP_MEMO}</CodeBlock>
          </AccordionDetails>
        </Accordion>
      </TestDialogCard>
    </>
  );
}
