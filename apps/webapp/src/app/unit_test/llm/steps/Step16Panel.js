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
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP16_FLOW, STEP16_CODE, STEP16_LEARNING_NOTES } from "../examples";
import { STEP16_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep16");
const api = new apijs("api/llm");

const SAMPLE_QUERIES = [
  { label: "バレー（昨日）", query: "昨日のバレーボールの結果は？" },
  { label: "天気", query: "今日の東京の天気を教えて" },
  { label: "株価", query: "今日のNVIDIAの株価は？" },
  { label: "AIニュース", query: "最近の AI に関する主なニュースは？" },
];

/**
 * Step16: Tavily 検索 → Ollama で要約・回答
 */
export default function Step16Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [model, setModel] = useState("");
  const [maxResults, setMaxResults] = useState(5);
  const [searchDepth, setSearchDepth] = useState("basic");
  const [expandRelativeDates, setExpandRelativeDates] = useState(true);
  const [skipAnswer, setSkipAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAnswer = async () => {
    if (!query.trim() || loading) return;
    if (!skipAnswer && !model) {
      setError("生成モデルを選択してください（一覧を再取得）");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post({
        mode: "answerFromTavily",
        query: query.trim(),
        model: model || undefined,
        maxResults: Number(maxResults) || 5,
        searchDepth,
        expandRelativeDates,
        skipAnswer,
      });
      if (res?.success) {
        setResult(res);
      } else {
        setError(res?.error || "回答に失敗しました");
        setResult(res);
      }
    } catch (err) {
      log.error("answerFromTavily failed", err);
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① 質問 → Tavily → Ollama</TestDialogTitle>
        <TestDialogDescription>
          Step15 の検索結果を Context にし、Ollama で要約・回答します。
          モデルは <code>listModels</code>（ollama list）から選択します。Qdrant は使いません。
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

        <Box sx={{ mt: 2 }}>
          <OllamaModelSelect
            kind="chat"
            value={model}
            onChange={setModel}
            disabled={loading || skipAnswer}
          />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
          <TextField
            select
            label="search_depth"
            size="small"
            value={searchDepth}
            onChange={(e) => setSearchDepth(e.target.value)}
            sx={{ minWidth: 140 }}
            disabled={loading}
          >
            <MenuItem value="basic">basic</MenuItem>
            <MenuItem value="advanced">advanced</MenuItem>
          </TextField>
          <TextField
            label="max_results"
            type="number"
            size="small"
            value={maxResults}
            onChange={(e) => setMaxResults(e.target.value)}
            inputProps={{ min: 1, max: 10 }}
            sx={{ width: 120 }}
            disabled={loading}
          />
        </Stack>

        <FormControlLabel
          sx={{ mt: 1, display: "block" }}
          control={
            <Switch
              checked={expandRelativeDates}
              onChange={(e) => setExpandRelativeDates(e.target.checked)}
              disabled={loading}
            />
          }
          label="相対日付（昨日/今日）を JST 日付に展開"
        />
        <FormControlLabel
          control={
            <Switch
              checked={skipAnswer}
              onChange={(e) => setSkipAnswer(e.target.checked)}
              disabled={loading}
            />
          }
          label="LLM なし（検索結果のみ・Step15 相当）"
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            onClick={handleAnswer}
            disabled={loading || !query.trim()}
          >
            {skipAnswer ? "検索のみ実行" : "検索して回答"}
          </Button>
          {loading && (
            <>
              <CircularProgress size={22} />
              <Typography variant="caption" color="text.secondary">
                Tavily →{skipAnswer ? "" : " Ollama"}…
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

      {result?.success && (
        <>
          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>② 回答</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <Chip label="Tavily → Ollama" color="primary" size="small" />
              <Chip label="Qdrant 未使用" size="small" variant="outlined" />
              {result.model && <Chip label={result.model} size="small" variant="outlined" />}
              <Chip
                label={`Tavily ${result.tavilyDurationMs ?? "-"} ms`}
                size="small"
                variant="outlined"
              />
              {result.chatDurationMs != null && (
                <Chip label={`Chat ${result.chatDurationMs} ms`} size="small" variant="outlined" />
              )}
              <Chip
                label={`全体 ${result.totalDurationMs ?? "-"} ms`}
                size="small"
                variant="outlined"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              検索クエリ: {result.searchQuery}
            </Typography>
            {result.flow && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                {result.flow.join(" → ")}
              </Typography>
            )}
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#eff6ff",
                borderRadius: 2,
                border: "1px solid #bfdbfe",
                whiteSpace: "pre-wrap",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              {result.answer || "（LLM スキップ、または空の回答）"}
            </Box>
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ 出典（Tavily）</TestDialogTitle>
            <Stack spacing={1}>
              {(result.sources || result.results || []).map((r) => (
                <Box
                  key={`${r.rank}-${r.url}`}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    [{r.rank}] {r.title || "(no title)"}
                  </Typography>
                  {r.url && (
                    <Link href={r.url} target="_blank" rel="noopener noreferrer" variant="caption">
                      {r.url}
                    </Link>
                  )}
                </Box>
              ))}
            </Stack>
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <Accordion disableGutters elevation={0} sx={{ bgcolor: "transparent" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>④ Context / 検索詳細（折りたたみ）</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeBlock>{result.context}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          </TestDialogCard>
        </>
      )}

      <TestDialogCard>
        <TestDialogTitle>⑤ データフロー</TestDialogTitle>
        <CodeBlock>{STEP16_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP16_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP16_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP16_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
