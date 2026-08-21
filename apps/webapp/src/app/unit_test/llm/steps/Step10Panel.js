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
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP10_FLOW, STEP10_CODE, STEP10_LEARNING_NOTES } from "../examples";
import { STEP10_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep10");
const api = new apijs("api/llm");

const SAMPLE_QUERIES = [
  { label: "当たり: パスワード", query: "パスワードは何日ごとに変更しますか？" },
  { label: "当たり: 富士山", query: "富士山の標高は何メートルですか？" },
  { label: "当たり: 出張", query: "出張申請は何日前までに必要ですか？" },
  { label: "外れ: 天気", query: "今日の天気はどうですか？" },
];

/**
 * Step10: Reranking（候補拡大 → 並べ直し → RAG）
 */
export default function Step10Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [model, setModel] = useState("");
  const [source, setSource] = useState("sample_manual.txt");
  const [candidateK, setCandidateK] = useState(8);
  const [finalTopN, setFinalTopN] = useState(3);
  const [template, setTemplate] = useState("strict");
  const [generateAnswer, setGenerateAnswer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleRun = async () => {
    if (!query.trim() || loading) return;
    if (finalTopN > candidateK) {
      setError("finalTopN は candidateK 以下にしてください");
      return;
    }
    if (generateAnswer && !model) {
      setError("生成モデルを選択してください");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const body = {
        mode: "ragAnswerWithRerank",
        query: query.trim(),
        candidateK,
        finalTopN,
        template,
        skipAnswer: !generateAnswer,
      };
      if (generateAnswer && model) {
        body.model = model;
      }
      if (source.trim()) {
        body.source = source.trim();
      }

      const res = await api.post(body);

      if (res?.success) {
        setResult(res);
      } else {
        setError(res?.error || "Rerank RAG に失敗しました");
      }
    } catch (err) {
      log.error("ragAnswerWithRerank failed", err);
      setError(err.message || "Rerank RAG 中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① 質問と Rerank パラメータ</TestDialogTitle>
        <TestDialogDescription>
          まず candidateK 件を Retrieval し、再 Embedding + Cosine で並べ直してから上位
          finalTopN 件だけ Context に載せます。短いサンプルでは順位が変わらないこともありますが、パイプラインの理解が目的です。
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
            candidateK（広めに取る）: <strong>{candidateK}</strong>
          </Typography>
          <Slider
            value={candidateK}
            onChange={(_, v) => {
              setCandidateK(v);
              if (finalTopN > v) setFinalTopN(v);
            }}
            min={3}
            max={15}
            step={1}
            marks
            disabled={loading}
            valueLabelDisplay="auto"
          />
          <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
            finalTopN（Context に載せる）: <strong>{finalTopN}</strong>
          </Typography>
          <Slider
            value={finalTopN}
            onChange={(_, v) => setFinalTopN(v)}
            min={1}
            max={candidateK}
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
          <ToggleButton value="strict">strict</ToggleButton>
          <ToggleButton value="normal">normal</ToggleButton>
        </ToggleButtonGroup>

        <FormControlLabel
          sx={{ mt: 1, display: "block" }}
          control={
            <Checkbox
              checked={generateAnswer}
              onChange={(e) => setGenerateAnswer(e.target.checked)}
              disabled={loading}
            />
          }
          label="Llama3 で回答も生成する（OFF なら Before/After 比較だけ・速い）"
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={handleRun} disabled={loading || !query.trim()}>
            Rerank + RAG 実行
          </Button>
          {loading && (
            <>
              <CircularProgress size={22} />
              <Typography variant="caption" color="text.secondary">
                {generateAnswer
                  ? "Retrieval → 再 Embedding → 生成中…（CPU では時間がかかります）"
                  : "Retrieval → 再 Embedding 中…"}
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
              <Chip label={`candidateK=${result.candidateK}`} size="small" variant="outlined" />
              <Chip label={`finalTopN=${result.finalTopN}`} color="primary" size="small" />
              <Chip
                label={`before ${result.hitCountBefore} → after ${result.hitCountAfter}`}
                size="small"
                variant="outlined"
              />
              <Chip label={`${result.totalDurationMs} ms`} size="small" variant="outlined" />
            </Stack>
            <Typography variant="caption" color="text.secondary" display="block">
              {result.note}
            </Typography>
            {result.flow && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                {result.flow.join(" → ")}
              </Typography>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ Before / After（順位比較）</TestDialogTitle>
            <TestDialogDescription>
              rankDelta が正なら Rerank で順位が上がった（例: 3→1 なら +2）。usedInContext =
              Context に採用。
            </TestDialogDescription>
            <CodeBlock>
              {JSON.stringify(
                {
                  comparison: result.comparison,
                },
                null,
                2
              )}
            </CodeBlock>
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>④ Context に使った hits（After 上位）</TestDialogTitle>
            <CodeBlock>
              {JSON.stringify(
                (result.hitsAfter || []).map((h) => ({
                  rank: h.rank,
                  retrievalRank: h.retrievalRank,
                  retrievalScore: h.retrievalScoreRounded,
                  rerankScore: h.scoreRounded,
                  source: h.source,
                  chunkId: h.chunkId,
                  textPreview: h.textPreview,
                })),
                null,
                2
              )}
            </CodeBlock>
          </TestDialogCard>

          {result.answer != null && (
            <TestDialogCard style={{ gridColumn: "1 / -1" }}>
              <TestDialogTitle>⑤ 回答</TestDialogTitle>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                <Chip label={`template=${result.template}`} color="primary" size="small" />
                {result.model && <Chip label={result.model} size="small" variant="outlined" />}
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
            </TestDialogCard>
          )}

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <Accordion disableGutters elevation={0} sx={{ bgcolor: "transparent" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>⑥ Prompt（折りたたみ）</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeBlock>{result.promptText}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          </TestDialogCard>
        </>
      )}

      <TestDialogCard>
        <TestDialogTitle>⑦ データフロー</TestDialogTitle>
        <CodeBlock>{STEP10_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP10_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑨ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP10_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑩ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP10_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
