"use client";

import { useState } from "react";
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
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { STEP20_FLOW, STEP20_CODE, STEP20_LEARNING_NOTES } from "../examples";
import { STEP20_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep20");
const api = new apijs("api/llm");

const LLM_MODEL = "gemini-flash-latest";
const SEARCH_MODEL = "gemini-flash-latest";

const SAMPLE_QUERIES = [
  { label: "山（LLM）", query: "日本で一番高い山は？" },
  { label: "天気", query: "今日の東京の天気を教えて" },
  { label: "株価", query: "今日のNVIDIAの株価は？" },
  { label: "AIニュース", query: "2026年の最新AIニュースを教えて" },
  { label: "料金", query: "現在のGemini APIの料金はいくら？" },
];

/**
 * Step20: Gemini 2.5 Flash-Lite（通常） / Flash + Google Search Grounding
 */
export default function Step20Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [model, setModel] = useState(LLM_MODEL);
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);
  const [error, setError] = useState("");
  const [health, setHealth] = useState(null);
  const [result, setResult] = useState(null);

  const handleHealth = async () => {
    setHealthLoading(true);
    setError("");
    try {
      const res = await api.post({ mode: "checkGemini" });
      setHealth(res);
      if (!res?.success) {
        setError(res?.error || "疎通に失敗しました");
      }
    } catch (err) {
      log.error("checkGemini failed", err);
      setError(err.message || "疎通エラー");
    } finally {
      setHealthLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post({
        mode: "answerFromGemini",
        query: query.trim(),
        model: model.trim() || undefined,
        useGoogleSearch,
      });
      if (res?.success) {
        setResult(res);
      } else {
        setError(res?.error || "回答に失敗しました");
        setResult(res);
      }
    } catch (err) {
      log.error("answerFromGemini failed", err);
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① Gemini 疎通</TestDialogTitle>
        <TestDialogDescription>
          キーは <code>GEMINI_API_KEY</code>（サーバのみ）。チャットや Git に貼らないでください。
          漏洩したら AI Studio で再発行してください。
        </TestDialogDescription>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
          <Button variant="outlined" onClick={handleHealth} disabled={healthLoading || loading}>
            {healthLoading ? <CircularProgress size={20} /> : "疎通確認"}
          </Button>
          {health?.config && (
            <Chip
              size="small"
              label={health.config.apiKeySet ? "API Key 設定済" : "API Key 未設定"}
              color={health.config.apiKeySet ? "success" : "warning"}
              variant="outlined"
            />
          )}
          {health?.config?.llmModel && (
            <Chip size="small" label={`LLM: ${health.config.llmModel}`} variant="outlined" />
          )}
          {health?.config?.searchModel && (
            <Chip size="small" label={`Search: ${health.config.searchModel}`} variant="outlined" />
          )}
          {health?.model && !health?.config?.llmModel && (
            <Chip size="small" label={health.model} variant="outlined" />
          )}
        </Stack>
        {health?.answerPreview && (
          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            応答: {health.answerPreview}
          </Typography>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>② 質問 → Gemini</TestDialogTitle>
        <TestDialogDescription>
          STEP1: 検索 OFF → <code>gemini-flash-latest</code>（通常 LLM）。
          STEP2: 検索 ON → 同モデル + Google Search Grounding。
          2.5 系は新規キー不可。Lite を試すなら <code>gemini-3.5-flash-lite</code>。
        </TestDialogDescription>

        <TextField
          label="質問"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 2 }}
          disabled={loading}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
          {SAMPLE_QUERIES.map((item) => (
            <Button
              key={item.label}
              size="small"
              variant="outlined"
              disabled={loading}
              onClick={() => setQuery(item.query)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <TextField
          label="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
          helperText={
            useGoogleSearch
              ? "推奨: gemini-flash-latest（Grounding）"
              : "推奨: gemini-flash-latest（通常 LLM）。Lite 候補: gemini-3.5-flash-lite"
          }
        />

        <FormControlLabel
          sx={{ mt: 1, display: "block" }}
          control={
            <Switch
              checked={useGoogleSearch}
              onChange={(e) => {
                const on = e.target.checked;
                setUseGoogleSearch(on);
                setModel(on ? SEARCH_MODEL : LLM_MODEL);
              }}
              disabled={loading}
            />
          }
          label="Google Search grounding（STEP2 / Web検索＋回答）"
        />

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleAsk} disabled={loading || !query.trim()}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Gemini で実行"}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}
      </TestDialogCard>

      {result?.success && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>③ 結果</TestDialogTitle>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
            <Chip label={`route: ${result.route}`} size="small" color="info" />
            {result.usedGoogleSearch && (
              <Chip label="Google Search" size="small" color="primary" variant="outlined" />
            )}
            <Chip label="Ollama 未使用" size="small" variant="outlined" />
            {result.model && <Chip label={result.model} size="small" variant="outlined" />}
            <Chip label={`${result.totalDurationMs} ms`} size="small" variant="outlined" />
          </Stack>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="body2">{result.answer}</Typography>
          </Box>

          {(result.emptyHint || result.finishReason) && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }} color="warning.main">
              finishReason={result.finishReason || "—"}
              {result.emptyHint ? ` / ${result.emptyHint}` : ""}
              {result.usage?.thoughtsTokenCount != null
                ? ` / thoughtsToken=${result.usage.thoughtsTokenCount}`
                : ""}
            </Typography>
          )}
          {result.webSearchQueries?.length > 0 && (
            <Typography variant="caption" display="block" sx={{ mt: 1.5 }} color="text.secondary">
              検索クエリ: {result.webSearchQueries.join(" / ")}
            </Typography>
          )}

          {(result.sources || []).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                出典
              </Typography>
              <Stack spacing={1}>
                {result.sources.map((s) => (
                  <Typography key={`${s.rank}-${s.url || s.title}`} variant="body2">
                    [{s.rank}]{" "}
                    {s.url ? (
                      <Link href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title || s.url}
                      </Link>
                    ) : (
                      s.title
                    )}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          <Accordion sx={{ mt: 2 }} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">生レスポンス（要約）</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CodeBlock>
                {JSON.stringify(
                  {
                    model: result.model,
                    usage: result.usage,
                    sources: result.sources,
                    webSearchQueries: result.webSearchQueries,
                    flow: result.flow,
                  },
                  null,
                  2,
                )}
              </CodeBlock>
            </AccordionDetails>
          </Accordion>
        </TestDialogCard>
      )}

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>④ 処理の流れ / 学び</TestDialogTitle>
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">フロー</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP20_FLOW}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">コード</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP20_CODE}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">学習メモ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP20_LEARNING_NOTES}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">セットアップ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP20_SETUP_MEMO}</CodeBlock>
          </AccordionDetails>
        </Accordion>
      </TestDialogCard>
    </>
  );
}
