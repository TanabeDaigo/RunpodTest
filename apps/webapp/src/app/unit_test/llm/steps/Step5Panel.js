"use client";

import { useMemo, useState } from "react";
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
import { STEP5_FLOW, STEP5_CODE, STEP5_LEARNING_NOTES } from "../examples";
import { STEP5_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep5");
const api = new apijs("api/llm");

const SAMPLE_TEXT = `社内システムのパスワードは、90日ごとに変更してください。
変更手順は情報システム部のポータルに掲載しています。

出張申請は出発の3営業日前までに承認を得てください。
緊急時は事後申請も可能ですが、理由を必ず記載します。

日本で最も高い山は富士山で、標高は3776メートルです。
社内研修では地理の話題も例として使うことがあります。

問い合わせ窓口は support@example.com です。
電話は平日 9:00-18:00 のみ受け付けます。`;

/**
 * Step5: Chunking テスト
 */
export default function Step5Panel() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [source, setSource] = useState("sample_manual.txt");
  const [chunkSize, setChunkSize] = useState(120);
  const [chunkOverlap, setChunkOverlap] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedId, setSelectedId] = useState(0);

  const selectedChunk = useMemo(
    () => result?.chunks?.find((c) => c.id === selectedId) || result?.chunks?.[0],
    [result, selectedId]
  );

  const handleChunk = async () => {
    if (!text.trim() || loading) return;
    if (chunkOverlap >= chunkSize) {
      setError("overlap は chunkSize より小さくしてください");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post({
        mode: "chunkText",
        text: text.trim(),
        source: source.trim() || "manual_input",
        chunkSize,
        chunkOverlap,
      });

      if (res?.success) {
        setResult(res);
        setSelectedId(res.chunks?.[0]?.id ?? 0);
      } else {
        setError(res?.error || "Chunking に失敗しました");
      }
    } catch (err) {
      log.error("chunkText failed", err);
      setError(err.message || "Chunking 中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① テキストとパラメータ</TestDialogTitle>
        <TestDialogDescription>
          Step4 の抽出テキストを貼っても、下のサンプルでも試せます。size / overlap
          を変えて件数の変化を見てください。
        </TestDialogDescription>

        <TextField
          label="source（メタデータ）"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 2, mb: 2 }}
          disabled={loading}
        />

        <TextField
          label="分割するテキスト"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          minRows={8}
          fullWidth
          disabled={loading}
        />

        <Box sx={{ mt: 3, px: 1 }}>
          <Typography variant="body2" gutterBottom>
            chunkSize: <strong>{chunkSize}</strong> 文字
          </Typography>
          <Slider
            value={chunkSize}
            onChange={(_, v) => setChunkSize(v)}
            min={50}
            max={1000}
            step={10}
            disabled={loading}
            valueLabelDisplay="auto"
          />
          <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
            chunkOverlap: <strong>{chunkOverlap}</strong> 文字
          </Typography>
          <Slider
            value={chunkOverlap}
            onChange={(_, v) => setChunkOverlap(v)}
            min={0}
            max={Math.max(0, chunkSize - 10)}
            step={5}
            disabled={loading}
            valueLabelDisplay="auto"
          />
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={handleChunk} disabled={loading || !text.trim()}>
            Chunking 実行
          </Button>
          <Button
            variant="outlined"
            disabled={loading}
            onClick={() => {
              setText(SAMPLE_TEXT);
              setChunkSize(120);
              setChunkOverlap(30);
            }}
          >
            サンプルに戻す
          </Button>
          <Button
            variant="text"
            disabled={loading}
            onClick={() => {
              setChunkSize(80);
              setChunkOverlap(0);
            }}
          >
            例: 小さめ / overlap 0
          </Button>
          <Button
            variant="text"
            disabled={loading}
              onClick={() => {
              setChunkSize(200);
              setChunkOverlap(60);
            }}
          >
            例: 大きめ / overlap 多め
          </Button>
          {loading && <CircularProgress size={22} />}
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
            <TestDialogTitle>② 分割サマリ</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
              <Chip label={`${result.count} chunks`} color="primary" size="small" />
              <Chip label={`size=${result.chunkSize}`} size="small" variant="outlined" />
              <Chip label={`overlap=${result.chunkOverlap}`} size="small" variant="outlined" />
              <Chip label={`平均 ${result.avgCharCount} 文字`} size="small" variant="outlined" />
            </Stack>
            {result.flow && (
              <Typography variant="caption" color="text.secondary">
                {result.flow.join(" → ")}
              </Typography>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ Chunk 一覧</TestDialogTitle>
            <TestDialogDescription>
              隣り合う chunk の先頭を見ると、overlap で前の末尾が繰り返されていることがあります。
            </TestDialogDescription>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 2 }}>
              {(result.chunks || []).map((c) => (
                <Chip
                  key={c.id}
                  label={`#${c.id} (${c.charCount})`}
                  size="small"
                  color={c.id === selectedChunk?.id ? "primary" : "default"}
                  onClick={() => setSelectedId(c.id)}
                />
              ))}
            </Stack>

            {selectedChunk && (
              <Box
                sx={{
                  p: 2,
                  minHeight: 140,
                  maxHeight: 320,
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
                  id={selectedChunk.id}
                  {selectedChunk.page != null ? ` / page=${selectedChunk.page}` : ""}
                  {selectedChunk.source ? ` / source=${selectedChunk.source}` : ""}
                  {` / ${selectedChunk.charCount} 文字`}
                </Typography>
                {selectedChunk.text}
              </Box>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>④ Step6 へ渡す document 形</TestDialogTitle>
            <CodeBlock>
              {JSON.stringify(
                {
                  source: result.document?.source,
                  chunkCount: result.document?.chunks?.length,
                  chunks: (result.document?.chunks || []).slice(0, 5).map((c) => ({
                    id: c.id,
                    page: c.page,
                    charCount: c.charCount,
                    textPreview: (c.text || "").slice(0, 60),
                  })),
                  note: result.count > 5 ? `...他 ${result.count - 5} 件` : undefined,
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
        <CodeBlock>{STEP5_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP5_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP5_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP5_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
