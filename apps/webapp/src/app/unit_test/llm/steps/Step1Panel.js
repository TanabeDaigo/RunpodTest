"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { logjs, apijs } from "@lib/client";
import {
  TestDialogCard,
  TestDialogTitle,
  TestDialogDescription,
  CodeBlock,
  ButtonContainer,
} from "../../styles";
import { Button, TextField, CircularProgress, Chip, Stack, Typography, Box } from "@mui/material";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP1_FLOW, STEP1_CODE, STEP1_LEARNING_NOTES } from "../examples";
import { STEP1_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep1");
const api = new apijs("api/llm");

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "12px",
};

/**
 * Step1: Ollama Chat テスト（実装済み・いつでも再実行可能）
 */
export default function Step1Panel() {
  const [health, setHealth] = useState(null);
  const [model, setModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "あなたは日本語で回答するアシスタントです。ユーザーの質問には必ず日本語で答えてください。"
  );
  const [prompt, setPrompt] = useState("日本で一番高い山は？");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastMeta, setLastMeta] = useState(null);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const refreshHealth = useCallback(async () => {
    setError("");
    try {
      const res = await api.post({ mode: "checkHealth" });
      setHealth(res);
      if (!res?.success && res?.error) {
        setError(res.error);
      }
    } catch (err) {
      log.error("checkHealth failed", err);
      setError(err.message || "疎通確認に失敗しました");
      setHealth({ ok: false, error: err.message });
    }
  }, []);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = prompt.trim();
    if (!text || loading) return;
    if (!model) {
      setError("生成モデルを選択してください");
      return;
    }

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setPrompt("");
    setLoading(true);
    setError("");
    setLastMeta(null);

    const requestMessages = systemPrompt.trim()
      ? [{ role: "system", content: systemPrompt.trim() }, ...nextMessages]
      : nextMessages;

    try {
      const res = await api.post({
        mode: "chat",
        model,
        messages: requestMessages,
      });

      if (res?.success) {
        setMessages([...nextMessages, { role: "assistant", content: res.content || "(空の回答)" }]);
        setLastMeta({
          model: res.model,
          totalDurationMs: res.totalDurationMs,
          evalCount: res.evalCount,
          promptEvalCount: res.promptEvalCount,
          flow: res.flow,
        });
      } else {
        setError(res?.error || "送信に失敗しました");
        setMessages(nextMessages);
      }
    } catch (err) {
      log.error("chat failed", err);
      setError(err.message || "送信中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setLastMeta(null);
    setError("");
  };

  const healthOk = health?.ok || health?.success;

  return (
    <>
      <TestDialogCard>
        <TestDialogTitle>① Ollama 接続状態</TestDialogTitle>
        <TestDialogDescription>
          PowerShell の <code>ollama run</code> ではなく、アプリから HTTP API で同じモデルを呼び出します。
        </TestDialogDescription>

        <Stack direction="row" spacing={1} sx={{ my: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip label={healthOk ? "接続 OK" : "未接続 / エラー"} color={healthOk ? "success" : "error"} size="small" />
          <Chip label={health?.baseUrl || "http://127.0.0.1:11434"} size="small" variant="outlined" />
          {health?.version && (
            <Chip
              label={`v${typeof health.version === "string" ? health.version : health.version?.version || "?"}`}
              size="small"
              variant="outlined"
            />
          )}
          {health?.latencyMs != null && <Chip label={`${health.latencyMs} ms`} size="small" variant="outlined" />}
        </Stack>

        <ButtonContainer>
          <Button variant="outlined" onClick={refreshHealth} sx={{ mr: 1 }}>
            疎通確認
          </Button>
        </ButtonContainer>

        <Box sx={{ mt: 2 }}>
          <OllamaModelSelect kind="chat" value={model} onChange={setModel} disabled={loading} />
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>② Chat テスト（Llama3）</TestDialogTitle>
        <TestDialogDescription>
          ここはまだ RAG ではありません。モデルが学習時に持っている知識だけで答えます。
        </TestDialogDescription>

        <Box
          sx={{
            mt: 2,
            mb: 2,
            p: 2,
            minHeight: 240,
            maxHeight: 420,
            overflowY: "auto",
            bgcolor: "#f8fafc",
            borderRadius: 2,
            border: "1px solid #e2e8f0",
          }}
        >
          {messages.length === 0 && !loading && (
            <Typography color="text.secondary" variant="body2">
              メッセージを送信すると、会話履歴がここに表示されます。
            </Typography>
          )}
          {messages.map((m, i) => (
            <Box
              key={`${m.role}-${i}`}
              sx={{
                mb: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: m.role === "user" ? "#e0e7ff" : "#fff",
                border: "1px solid",
                borderColor: m.role === "user" ? "#c7d2fe" : "#e2e8f0",
                maxWidth: "90%",
                ml: m.role === "user" ? "auto" : 0,
                mr: m.role === "assistant" ? "auto" : 0,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                {m.role === "user" ? "You" : "Llama3"}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {m.content}
              </Typography>
            </Box>
          ))}
          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                推論中…（CPU 環境では数十秒かかることがあります）
              </Typography>
            </Stack>
          )}
          <div ref={bottomRef} />
        </Box>

        <TextField
          label="System Prompt（回答方針・言語）"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          style={inputStyle}
          disabled={loading}
          helperText="messages の先頭に role=system として送られます。日本語固定はこの設定で行います。"
        />

        <TextField
          label="プロンプト"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          multiline
          minRows={2}
          fullWidth
          style={inputStyle}
          disabled={loading}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={handleSend} disabled={loading || !prompt.trim()}>
            送信
          </Button>
          <Button variant="outlined" onClick={handleClear} disabled={loading}>
            履歴クリア
          </Button>
          <Button variant="text" disabled={loading} onClick={() => setPrompt("今日は何日？")}>
            例: 今日は何日？
          </Button>
          <Button variant="text" disabled={loading} onClick={() => setPrompt("日本で一番高い山は？")}>
            例: 富士山
          </Button>
        </Stack>

        {lastMeta && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              model={lastMeta.model} / {lastMeta.totalDurationMs} ms
              {lastMeta.evalCount != null ? ` / eval_count=${lastMeta.evalCount}` : ""}
              {lastMeta.promptEvalCount != null ? ` / prompt_eval=${lastMeta.promptEvalCount}` : ""}
            </Typography>
          </Box>
        )}
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>③ いまのデータフロー</TestDialogTitle>
        <TestDialogDescription>RAG 前の最小構成です。</TestDialogDescription>
        <CodeBlock>{STEP1_FLOW}</CodeBlock>
        {lastMeta?.flow && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              直近リクエストの通過経路
            </Typography>
            <Typography variant="body2">{lastMeta.flow.join(" → ")}</Typography>
          </Box>
        )}
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>④ サーバー側の本質</TestDialogTitle>
        <TestDialogDescription>Ollama REST を叩く薄いラッパーです。LangChain はまだ使いません。</TestDialogDescription>
        <CodeBlock>{STEP1_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑤ セットアップ・実施メモ</TestDialogTitle>
        <TestDialogDescription>
          インストール手順・PowerShell 操作・実対話ログ。あとから見返す用です。
        </TestDialogDescription>
        <CodeBlock>{STEP1_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP1_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
