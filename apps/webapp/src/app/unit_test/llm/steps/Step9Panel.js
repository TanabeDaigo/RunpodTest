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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP9_FLOW, STEP9_CODE, STEP9_LEARNING_NOTES } from "../examples";
import { STEP9_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep9");
const api = new apijs("api/llm");

const SAMPLE_QUERIES = [
  { label: "当たり: パスワード", query: "パスワードは何日ごとに変更しますか？" },
  { label: "当たり: 富士山", query: "富士山の標高は何メートルですか？" },
  { label: "当たり: 出張", query: "出張申請は何日前までに必要ですか？" },
  { label: "外れ: 天気", query: "今日の天気はどうですか？" },
];

/**
 * Step9: RAG 一通り（Retrieval → Prompt → Llama3）
 */
export default function Step9Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [model, setModel] = useState("");
  const [source, setSource] = useState("sample_manual.txt");
  const [topK, setTopK] = useState(3);
  const [template, setTemplate] = useState("strict");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedRank, setSelectedRank] = useState(1);

  const selectedHit = result?.hits?.find((h) => h.rank === selectedRank) || result?.hits?.[0];

  const handleRag = async () => {
    if (!query.trim() || loading) return;
    if (!model) {
      setError("生成モデルを選択してください");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const body = {
        mode: "ragAnswer",
        query: query.trim(),
        model,
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
        setError(res?.error || "RAG 回答に失敗しました");
      }
    } catch (err) {
      log.error("ragAnswer failed", err);
      setError(err.message || "RAG 回答中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① 質問と RAG パラメータ</TestDialogTitle>
        <TestDialogDescription>
          Retrieval → Prompt 組み立て → Llama3 chat まで一通り実行します。CPU
          では回答生成に時間がかかることがあります。
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

        <Box sx={{ mt: 2 }}>
          <OllamaModelSelect kind="chat" value={model} onChange={setModel} disabled={loading} />
        </Box>

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
          <Button variant="contained" onClick={handleRag} disabled={loading || !query.trim()}>
            RAG 回答
          </Button>
          {loading && (
            <>
              <CircularProgress size={22} />
              <Typography variant="caption" color="text.secondary">
                検索 → Prompt → Llama3 生成中…（CPU では数十秒〜かかることがあります）
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
          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>② 回答</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <Chip label={`template=${result.template}`} color="primary" size="small" />
              <Chip label={`${result.hitCount} hits`} size="small" variant="outlined" />
              <Chip label={result.model || "model"} size="small" variant="outlined" />
              <Chip label={`全体 ${result.totalDurationMs} ms`} size="small" variant="outlined" />
              {result.chatDurationMs != null && (
                <Chip label={`生成 ${result.chatDurationMs} ms`} size="small" variant="outlined" />
              )}
            </Stack>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#f0fdf4",
                borderRadius: 2,
                border: "1px solid #bbf7d0",
                whiteSpace: "pre-wrap",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              {result.answer || "（空の回答）"}
            </Box>
            {result.flow && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
                {result.flow.join(" → ")}
              </Typography>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ 使われた hits（根拠）</TestDialogTitle>
            <TestDialogDescription>
              回答がこれらの Context に沿っているか確認してください。
            </TestDialogDescription>
            {result.hitCount === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ヒットなし。strict なら「わからない」になりやすいです。
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
                      maxHeight: 220,
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
            <Accordion disableGutters elevation={0} sx={{ bgcolor: "transparent" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>④ messages / Prompt（折りたたみ）</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeBlock>{result.promptText}</CodeBlock>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  messages JSON
                </Typography>
                <CodeBlock>{JSON.stringify(result.messages, null, 2)}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          </TestDialogCard>
        </>
      )}

      <TestDialogCard>
        <TestDialogTitle>⑤ データフロー</TestDialogTitle>
        <CodeBlock>{STEP9_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP9_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP9_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP9_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
