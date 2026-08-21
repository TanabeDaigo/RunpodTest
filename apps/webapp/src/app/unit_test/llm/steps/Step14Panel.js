"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Tabs,
  Tab,
} from "@mui/material";
import { STEP14_FLOW, STEP14_CODE, STEP14_LEARNING_NOTES } from "../examples";
import { STEP14_SETUP_MEMO } from "../setupMemos";
import { isChatModelName } from "../ollamaModels";

const log = new logjs("UnitTestLlmStep14");
const api = new apijs("api/llm");

const FALLBACK_CHAT_MODELS = ["llama3:8b", "qwen3:8b"];

const SAMPLE_QUERIES = [
  "こんにちは。自己紹介してください。",
  "日本で一番高い山は？短く答えて。",
  "社内マニュアルに無い内容は推測せず「わからない」と答えてください。今日の天気は？",
];

/**
 * Step14: 生成モデル切替（タブ）で同じ質問を比較
 */
export default function Step14Panel() {
  const [installedNames, setInstalledNames] = useState([]);
  const [model, setModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "あなたは日本語で回答するアシスタントです。ユーザーの質問には必ず日本語で答えてください。簡潔に答えてください。",
  );
  const [prompt, setPrompt] = useState(SAMPLE_QUERIES[1]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastMeta, setLastMeta] = useState(null);
  /** モデルごとの直近回答（切替比較用） */
  const [answersByModel, setAnswersByModel] = useState({});

  const chatModels = useMemo(() => {
    const fromOllama = installedNames.filter(isChatModelName);
    if (fromOllama.length > 0) return fromOllama;
    return FALLBACK_CHAT_MODELS;
  }, [installedNames]);

  useEffect(() => {
    if (!model && chatModels.length > 0) {
      setModel(chatModels[0]);
    }
  }, [chatModels, model]);

  const tabIndex = Math.max(
    0,
    chatModels.findIndex((n) => n === model),
  );

  const refreshModels = useCallback(async () => {
    setError("");
    try {
      const res = await api.post({ mode: "listModels" });
      if (res?.success) {
        const names = (res.models || []).map((m) => m.name).filter(Boolean);
        setInstalledNames(names);
        const chat = names.filter(isChatModelName);
        if (chat.length > 0 && !chat.includes(model)) {
          // 優先: qwen3 → llama3 → 先頭
          const preferred =
            chat.find((n) => n.startsWith("qwen3")) ||
            chat.find((n) => n.startsWith("llama3")) ||
            chat[0];
          setModel(preferred);
        }
      } else {
        setError(res?.error || "モデル一覧の取得に失敗しました");
      }
    } catch (err) {
      log.error("listModels failed", err);
      setError(err.message || "モデル一覧の取得に失敗しました");
    }
  }, [model]);

  useEffect(() => {
    refreshModels();
    // 初回のみ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (_e, newIndex) => {
    const next = chatModels[newIndex];
    if (!next) return;
    setModel(next);
    setError("");
    // タブ切替時は入力中の回答表示を、そのモデルのキャッシュに切り替え
    setAnswer(answersByModel[next]?.content || "");
    setLastMeta(answersByModel[next]?.meta || null);
  };

  const handleSend = async () => {
    const text = prompt.trim();
    if (!text || loading) return;
    if (!model) {
      setError("比較するモデルを選択してください（ollama list）");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    const messages = [];
    if (systemPrompt.trim()) {
      messages.push({ role: "system", content: systemPrompt.trim() });
    }
    messages.push({ role: "user", content: text });

    try {
      const res = await api.post({
        mode: "chat",
        model,
        messages,
      });

      if (res?.success) {
        const content = res.content || "(空の回答)";
        const meta = {
          model: res.model || model,
          totalDurationMs: res.totalDurationMs,
          evalCount: res.evalCount,
          promptEvalCount: res.promptEvalCount,
        };
        setAnswer(content);
        setLastMeta(meta);
        setAnswersByModel((prev) => ({
          ...prev,
          [model]: { content, meta, query: text },
        }));
      } else {
        setError(res?.error || "送信に失敗しました");
      }
    } catch (err) {
      log.error("chat failed", err);
      setError(err.message || "送信中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① モデル選択（タブ）</TestDialogTitle>
        <TestDialogDescription>
          Ollama に入っている生成モデルをタブで切り替え、同じ質問を投げて日本語や速度を比べます。
          Embedding（nomic-embed-text）は対象外です。既存の <code>mode=chat</code> を使います。
        </TestDialogDescription>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="outlined" size="small" onClick={refreshModels} disabled={loading}>
            モデル一覧を再取得
          </Button>
          <Chip label={`選択中: ${model}`} color="primary" size="small" />
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {chatModels.map((name) => (
              <Tab key={name} label={name} disabled={loading} />
            ))}
          </Tabs>
        </Box>

        {chatModels.length === 0 && (
          <Typography color="warning.main" sx={{ mt: 2 }} variant="body2">
            Chat 用モデルが見つかりません。<code>ollama pull llama3:8b</code> /{" "}
            <code>ollama pull qwen3:8b</code> を確認してください。
          </Typography>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>② 質問</TestDialogTitle>
        <TextField
          label="System Prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 1 }}
          disabled={loading}
        />
        <TextField
          label="質問"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={{ mt: 2 }}
          disabled={loading}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
          {SAMPLE_QUERIES.map((q) => (
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

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={handleSend} disabled={loading || !prompt.trim()}>
            {model} に送信
          </Button>
          {loading && (
            <>
              <CircularProgress size={22} />
              <Typography variant="caption" color="text.secondary">
                {model} で生成中…
              </Typography>
            </>
          )}
        </Stack>

        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}
      </TestDialogCard>

      {(answer || lastMeta) && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>③ 回答（選択中モデル）</TestDialogTitle>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
            <Chip label={lastMeta?.model || model} color="secondary" size="small" />
            {lastMeta?.totalDurationMs != null && (
              <Chip label={`${lastMeta.totalDurationMs} ms`} size="small" variant="outlined" />
            )}
          </Stack>
          <Box
            sx={{
              p: 2.5,
              bgcolor: "#fafafa",
              borderRadius: 2,
              border: "1px solid #e5e5e5",
              whiteSpace: "pre-wrap",
              fontSize: 15,
              lineHeight: 1.7,
              minHeight: 80,
            }}
          >
            {answer || "（まだ回答なし。このタブで送信してください）"}
          </Box>
        </TestDialogCard>
      )}

      {Object.keys(answersByModel).length > 0 && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>④ モデル別の直近回答（比較）</TestDialogTitle>
          <TestDialogDescription>
            タブを切り替えて同じ質問を送ると、ここにモデルごとの結果が残ります。
          </TestDialogDescription>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {Object.entries(answersByModel).map(([name, data]) => (
              <Box
                key={name}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: name === model ? "primary.main" : "divider",
                  bgcolor: name === model ? "action.selected" : "background.paper",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Chip label={name} size="small" color={name === model ? "primary" : "default"} />
                  {data.meta?.totalDurationMs != null && (
                    <Chip label={`${data.meta.totalDurationMs} ms`} size="small" variant="outlined" />
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Q: {data.query}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                  {data.content}
                </Typography>
              </Box>
            ))}
          </Stack>
        </TestDialogCard>
      )}

      <TestDialogCard>
        <TestDialogTitle>⑤ データフロー</TestDialogTitle>
        <CodeBlock>{STEP14_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ 本質</TestDialogTitle>
        <CodeBlock>{STEP14_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップメモ</TestDialogTitle>
        <CodeBlock>{STEP14_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP14_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
