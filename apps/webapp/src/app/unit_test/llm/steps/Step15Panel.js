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
} from "@mui/material";
import { STEP15_FLOW, STEP15_CODE, STEP15_LEARNING_NOTES } from "../examples";
import { STEP15_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep15");
const api = new apijs("api/llm");

const SAMPLE_QUERIES = [
  { label: "バレー（昨日）", query: "昨日のバレーボールの結果は？" },
  { label: "AIニュース", query: "latest AI news" },
  { label: "天気", query: "今日の東京の天気" },
  { label: "株価", query: "今日のNVIDIA株価" },
];

/**
 * Step15: Tavily Web 検索（単体・Ollama なし）
 */
export default function Step15Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [maxResults, setMaxResults] = useState(5);
  const [searchDepth, setSearchDepth] = useState("basic");
  const [expandRelativeDates, setExpandRelativeDates] = useState(true);
  const [checkLoading, setCheckLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [health, setHealth] = useState(null);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    setCheckLoading(true);
    setError("");
    try {
      const res = await api.post({ mode: "checkTavily" });
      setHealth(res);
      if (!res?.success) {
        setError(res?.error || "Tavily 疎通に失敗しました");
      }
    } catch (err) {
      log.error("checkTavily failed", err);
      setError(err.message || "疎通エラー");
    } finally {
      setCheckLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim() || searchLoading) return;
    setSearchLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post({
        mode: "tavilySearch",
        query: query.trim(),
        maxResults: Number(maxResults) || 5,
        searchDepth,
        expandRelativeDates,
      });
      if (res?.success) {
        setResult(res);
      } else {
        setError(res?.error || "検索に失敗しました");
        setResult(res);
      }
    } catch (err) {
      log.error("tavilySearch failed", err);
      setError(err.message || "検索エラー");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① Tavily 設定・疎通</TestDialogTitle>
        <TestDialogDescription>
          Web 検索 API（最新情報ルート）の単体テストです。Ollama / Qdrant は使いません。
          Key は <code>env/.env.development</code> の <code>TAVILY_API_KEY</code> のみ（サーバ側）。
        </TestDialogDescription>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap alignItems="center">
          <Button variant="outlined" onClick={handleCheck} disabled={checkLoading}>
            Key 確認
          </Button>
          {(checkLoading || searchLoading) && <CircularProgress size={22} />}
        </Stack>

        {health && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
            <Chip
              label={health.success || health.ok ? "Key 設定済み" : "Key 未設定 / NG"}
              color={health.success || health.ok ? "success" : "warning"}
              size="small"
            />
            <Chip label={`depth=${health.searchDepth || "-"}`} size="small" variant="outlined" />
            <Chip label={`maxResults=${health.maxResults ?? "-"}`} size="small" variant="outlined" />
          </Stack>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>② 検索テスト</TestDialogTitle>
        <TestDialogDescription>
          「昨日」などはサーバ側で JST の日付に展開してから Tavily に送ります（スイッチで OFF 可）。
        </TestDialogDescription>

        <TextField
          label="質問 / 検索クエリ"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 2 }}
          disabled={searchLoading}
        />

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
          {SAMPLE_QUERIES.map((item) => (
            <Button
              key={item.label}
              size="small"
              variant="outlined"
              disabled={searchLoading}
              onClick={() => setQuery(item.query)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            select
            label="search_depth"
            size="small"
            value={searchDepth}
            onChange={(e) => setSearchDepth(e.target.value)}
            sx={{ minWidth: 160 }}
            disabled={searchLoading}
            helperText="advanced はクレジット消費が増えます"
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
            sx={{ width: 140 }}
            disabled={searchLoading}
          />
        </Stack>

        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Switch
              checked={expandRelativeDates}
              onChange={(e) => setExpandRelativeDates(e.target.checked)}
              disabled={searchLoading}
            />
          }
          label="相対日付（昨日/今日）を JST 日付に展開"
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={searchLoading || !query.trim()}
          >
            Tavily で検索
          </Button>
          {searchLoading && (
            <Typography variant="caption" color="text.secondary">
              検索中…
            </Typography>
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
            <TestDialogTitle>③ 検索結果</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <Chip label="Tavily" color="primary" size="small" />
              <Chip label="Ollama 未使用" size="small" variant="outlined" />
              <Chip label={`${(result.results || []).length} 件`} size="small" variant="outlined" />
              <Chip
                label={`Tavily ${result.tavilyDurationMs ?? "-"} ms`}
                size="small"
                variant="outlined"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              元クエリ: {result.query}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              実際に送った検索文: <strong>{result.searchQuery}</strong>
            </Typography>

            <Stack spacing={1.5}>
              {(result.results || []).map((r) => (
                <Box
                  key={`${r.rank}-${r.url}`}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
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
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {r.content}
                  </Typography>
                  {r.score != null && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      score={Number(r.score).toFixed(3)}
                      {r.publishedDate ? ` / ${r.publishedDate}` : ""}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>④ Context テキスト（後で LLM に渡す用）</TestDialogTitle>
            <CodeBlock>{result.context || "（空）"}</CodeBlock>
          </TestDialogCard>
        </>
      )}

      <TestDialogCard>
        <TestDialogTitle>⑤ データフロー</TestDialogTitle>
        <CodeBlock>{STEP15_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP15_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP15_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP15_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
