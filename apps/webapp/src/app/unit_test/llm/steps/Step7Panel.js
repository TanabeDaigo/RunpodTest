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
} from "@mui/material";
import { STEP7_FLOW, STEP7_CODE, STEP7_LEARNING_NOTES } from "../examples";
import { STEP7_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep7");
const api = new apijs("api/llm");

const SAMPLE_QUERIES = [
  { label: "当たり: パスワード", query: "パスワードは何日ごとに変更しますか？" },
  { label: "当たり: 富士山", query: "富士山の標高は何メートルですか？" },
  { label: "当たり: 出張", query: "出張申請は何日前までに必要ですか？" },
  { label: "外れ: 天気", query: "今日の天気はどうですか？" },
];

/**
 * Step7: Retrieval（質問 → Embedding → Qdrant TopK）
 */
export default function Step7Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [source, setSource] = useState("sample_manual.txt");
  const [topK, setTopK] = useState(3);
  const [scoreThreshold, setScoreThreshold] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedRank, setSelectedRank] = useState(1);

  const selectedHit = result?.hits?.find((h) => h.rank === selectedRank) || result?.hits?.[0];

  const handleRetrieve = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const body = {
        mode: "retrieve",
        query: query.trim(),
        topK,
      };
      if (source.trim()) {
        body.source = source.trim();
      }
      const threshold = Number(scoreThreshold);
      if (scoreThreshold !== "" && !Number.isNaN(threshold)) {
        body.scoreThreshold = threshold;
      }

      const res = await api.post(body);

      if (res?.success) {
        setResult(res);
        setSelectedRank(res.hits?.[0]?.rank ?? 1);
      } else {
        setError(res?.error || "Retrieval に失敗しました");
      }
    } catch (err) {
      log.error("retrieve failed", err);
      setError(err.message || "Retrieval 中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① 質問と Retrieval パラメータ</TestDialogTitle>
        <TestDialogDescription>
          Step6 で Indexing 済みの Collection に対し、質問を Embedding → TopK
          検索します。まだ Llama3 には渡しません。
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
          label="source フィルタ（空なら全件対象）"
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

        <TextField
          label="scoreThreshold（任意・空ならなし）"
          value={scoreThreshold}
          onChange={(e) => setScoreThreshold(e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 1 }}
          disabled={loading}
          placeholder="例: 0.3"
          helperText="Cosine score がこれ未満のヒットを落とす"
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={handleRetrieve} disabled={loading || !query.trim()}>
            Retrieval 実行
          </Button>
          {loading && (
            <>
              <CircularProgress size={22} />
              <Typography variant="caption" color="text.secondary">
                質問を Embedding 中…
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
            <TestDialogTitle>② 検索サマリ</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
              <Chip label={`${result.hitCount} hits`} color="primary" size="small" />
              <Chip label={`TopK=${result.topK}`} size="small" variant="outlined" />
              <Chip label={`${result.dimensions} dim`} size="small" variant="outlined" />
              <Chip label={`${result.totalDurationMs} ms`} size="small" variant="outlined" />
              {result.sourceFilter && (
                <Chip label={`source=${result.sourceFilter}`} size="small" variant="outlined" />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              collection={result.collection} / model={result.model}
            </Typography>
            {result.flow && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                {result.flow.join(" → ")}
              </Typography>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ ヒット一覧（近い順）</TestDialogTitle>
            <TestDialogDescription>
              score が大きいほど質問に近い（Cosine）。当たり質問では関連 chunk、外れでは score
              が低めになりがちです。
            </TestDialogDescription>

            {result.hitCount === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                ヒットなし。Step6 で Indexing 済みか、source / scoreThreshold を確認してください。
              </Typography>
            ) : (
              <>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 2 }}>
                  {result.hits.map((h) => (
                    <Chip
                      key={h.id}
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
                      minHeight: 140,
                      maxHeight: 360,
                      overflowY: "auto",
                      bgcolor: "#f8fafc",
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                      fontSize: 13,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      rank={selectedHit.rank} / score={selectedHit.scoreRounded}
                      {selectedHit.chunkId != null ? ` / chunkId=${selectedHit.chunkId}` : ""}
                      {selectedHit.source ? ` / source=${selectedHit.source}` : ""}
                      {selectedHit.page != null ? ` / page=${selectedHit.page}` : ""}
                    </Typography>
                    {selectedHit.text}
                  </Box>
                )}
              </>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>④ レスポンス形（Step8 への受け渡し）</TestDialogTitle>
            <CodeBlock>
              {JSON.stringify(
                {
                  query: result.query,
                  topK: result.topK,
                  hits: (result.hits || []).map((h) => ({
                    rank: h.rank,
                    score: h.scoreRounded,
                    source: h.source,
                    chunkId: h.chunkId,
                    textPreview: h.textPreview,
                  })),
                  note: "次の Step8 で payload.text を Context に載せる",
                },
                null,
                2
              )}
            </CodeBlock>
          </TestDialogCard>
        </>
      )}

      <TestDialogCard>
        <TestDialogTitle>⑤ データフロー</TestDialogTitle>
        <CodeBlock>{STEP7_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP7_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP7_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP7_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
