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
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { STEP8_FLOW, STEP8_CODE, STEP8_LEARNING_NOTES } from "../examples";
import { STEP8_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep8");
const api = new apijs("api/llm");

const SAMPLE_QUERIES = [
  { label: "当たり: パスワード", query: "パスワードは何日ごとに変更しますか？" },
  { label: "当たり: 富士山", query: "富士山の標高は何メートルですか？" },
  { label: "当たり: 出張", query: "出張申請は何日前までに必要ですか？" },
  { label: "外れ: 天気", query: "今日の天気はどうですか？" },
];

/**
 * Step8: Retrieval → Context → Prompt / messages
 */
export default function Step8Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [source, setSource] = useState("sample_manual.txt");
  const [topK, setTopK] = useState(3);
  const [template, setTemplate] = useState("strict");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedRank, setSelectedRank] = useState(1);

  const selectedHit = result?.hits?.find((h) => h.rank === selectedRank) || result?.hits?.[0];

  const handleBuild = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const body = {
        mode: "buildRagPrompt",
        query: query.trim(),
        topK,
        template,
      };
      if (source.trim()) {
        body.source = source.trim();
      }

      const res = await api.post(body);

      if (res?.success) {
        setResult(res);
        setSelectedRank(res.hits?.[0]?.rank ?? 1);
      } else {
        setError(res?.error || "Prompt 組み立てに失敗しました");
      }
    } catch (err) {
      log.error("buildRagPrompt failed", err);
      setError(err.message || "Prompt 組み立て中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① 質問と Template</TestDialogTitle>
        <TestDialogDescription>
          内部で Retrieval（Step7）を行い、hits を Context にした Prompt / messages
          を組み立てます。まだ Llama3 には送りません。
        </TestDialogDescription>

        <TextField
          label="質問（query）"
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
          label="source フィルタ（空なら全件）"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 2 }}
          disabled={loading}
          helperText="Step6 で入れた source（PDFならファイル名）と一致させる。違うとヒットしません。空欄=全件検索"
        />

        <Box sx={{ mt: 3, px: 1 }}>
          <Typography variant="body2" gutterBottom>
            TopK: <strong>{topK}</strong> 件
          </Typography>
          <Slider
            value={topK}
            onChange={(_, v) => setTopK(v)}
            min={1}
            max={10}
            step={1}
            marks
            disabled={loading}
            valueLabelDisplay="auto"
          />
        </Box>

        <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
          Template
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={template}
          disabled={loading}
          onChange={(_, v) => {
            if (v) setTemplate(v);
          }}
        >
          <ToggleButton value="strict">strict（根拠外はわからない）</ToggleButton>
          <ToggleButton value="normal">normal（参考情報を優先）</ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={handleBuild} disabled={loading || !query.trim()}>
            Prompt 組み立て
          </Button>
          {loading && (
            <>
              <CircularProgress size={22} />
              <Typography variant="caption" color="text.secondary">
                Retrieval → Prompt 生成中…
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

      {result && (
        <>
          <TestDialogCard>
            <TestDialogTitle>② サマリ</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
              <Chip label={`template=${result.template}`} color="primary" size="small" />
              <Chip label={`${result.hitCount} hits`} size="small" variant="outlined" />
              <Chip label={`${result.totalDurationMs} ms`} size="small" variant="outlined" />
              {result.retrieval?.sourceFilter && (
                <Chip
                  label={`source=${result.retrieval.sourceFilter}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
            {result.flow && (
              <Typography variant="caption" color="text.secondary">
                {result.flow.join(" → ")}
              </Typography>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ 使われた hits（Context の材料）</TestDialogTitle>
            {result.hitCount === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ヒットなし。Context は「（参考情報なし）」になります。外れ質問や未 Indexing
                を確認してください。
              </Typography>
            ) : (
              <>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 2 }}>
                  {result.hits.map((h) => (
                    <Chip
                      key={`${h.rank}-${h.id}`}
                      label={`#${h.rank} score=${h.scoreRounded}`}
                      size="small"
                      color={h.rank === selectedHit?.rank ? "primary" : "default"}
                      onClick={() => setSelectedRank(h.rank)}
                    />
                  ))}
                </Stack>
                {selectedHit && (
                  <Box
                    sx={{
                      p: 2,
                      maxHeight: 240,
                      overflowY: "auto",
                      bgcolor: "#f8fafc",
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                      fontSize: 13,
                    }}
                  >
                    {selectedHit.text}
                  </Box>
                )}
              </>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>④ 完成 Prompt（promptText）</TestDialogTitle>
            <TestDialogDescription>
              System + User（参考情報 + 質問）。Step9 ではこれを messages として Llama3 に送ります。
            </TestDialogDescription>
            <CodeBlock>{result.promptText}</CodeBlock>
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>⑤ Step9 へ渡す messages[]</TestDialogTitle>
            <CodeBlock>
              {JSON.stringify(
                {
                  messages: result.messages,
                  note: "mode: chat でこの messages を送る（Step9）",
                },
                null,
                2
              )}
            </CodeBlock>
          </TestDialogCard>
        </>
      )}

      <TestDialogCard>
        <TestDialogTitle>⑥ データフロー</TestDialogTitle>
        <CodeBlock>{STEP8_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑦ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP8_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑧ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP8_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑨ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP8_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
