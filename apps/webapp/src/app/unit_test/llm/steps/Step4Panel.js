"use client";

import { useRef, useState } from "react";
import { logjs, apijs } from "@lib/client";
import {
  TestDialogCard,
  TestDialogTitle,
  TestDialogDescription,
  CodeBlock,
} from "../../styles";
import { Button, CircularProgress, Chip, Stack, Typography, Box } from "@mui/material";
import { STEP4_FLOW, STEP4_CODE, STEP4_LEARNING_NOTES } from "../examples";
import { STEP4_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep4");
const api = new apijs("api/llm");

/**
 * Step4: PDF → テキスト抽出
 */
export default function Step4Panel() {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);

  const readAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        const base64 = dataUrl.includes("base64,") ? dataUrl.split("base64,").pop() : dataUrl;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setError("PDF ファイルを選択してください");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setFileName(file.name);

    try {
      const contentBase64 = await readAsBase64(file);
      const res = await api.post({
        mode: "parsePdf",
        filename: file.name,
        contentBase64,
      });

      if (res?.success) {
        setResult(res);
        setSelectedPage(res.pages?.[0]?.page || 1);
      } else {
        setError(res?.error || "PDF の解析に失敗しました");
      }
    } catch (err) {
      log.error("parsePdf failed", err);
      setError(err.message || "PDF 解析中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  const page = result?.pages?.find((p) => p.page === selectedPage) || result?.pages?.[0];

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① PDF を選んでテキスト抽出</TestDialogTitle>
        <TestDialogDescription>
          文字選択できる PDF を推奨。スキャン画像のみの PDF はテキストが空になります（OCR は未対応）。
        </TestDialogDescription>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" component="label" disabled={loading}>
            PDF を選択
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={onInputChange} />
          </Button>
          {loading && <CircularProgress size={22} />}
          {fileName && <Chip label={fileName} size="small" variant="outlined" />}
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
            <TestDialogTitle>② 抽出サマリ</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
              <Chip label={`${result.numpages} ページ`} size="small" color="primary" />
              <Chip label={`${result.charCount} 文字`} size="small" />
              {result.info?.pdfVersion && <Chip label={`PDF ${result.info.pdfVersion}`} size="small" variant="outlined" />}
            </Stack>
            {result.warning && (
              <Typography color="warning.main" variant="body2" sx={{ mb: 1, whiteSpace: "pre-wrap" }}>
                {result.warning}
              </Typography>
            )}
            {result.extractability && result.extractability !== "ok" && (
              <Chip
                label={`extractability: ${result.extractability}`}
                size="small"
                color="warning"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            )}
            {result.info?.producer && (
              <Typography variant="caption" color="text.secondary" display="block">
                Producer: {result.info.producer}
              </Typography>
            )}
            {result.flow && (
              <Typography variant="caption" color="text.secondary">
                {result.flow.join(" → ")}
              </Typography>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ ページ別テキスト</TestDialogTitle>
            <TestDialogDescription>
              Step5（Chunking）では、この pages 配列を分割対象にします。
            </TestDialogDescription>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 2 }}>
              {(result.pages || []).map((p) => (
                <Chip
                  key={p.page}
                  label={`p.${p.page} (${p.charCount})`}
                  size="small"
                  color={p.page === selectedPage ? "primary" : "default"}
                  onClick={() => setSelectedPage(p.page)}
                />
              ))}
            </Stack>

            <Box
              sx={{
                p: 2,
                minHeight: 160,
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
              {page?.text || "(このページはテキスト空)"}
            </Box>
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>④ 全文プレビュー（先頭500文字）</TestDialogTitle>
            <CodeBlock>{result.textPreview || "(空)"}</CodeBlock>
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>⑤ Step5 へ渡す document 形</TestDialogTitle>
            <CodeBlock>
              {JSON.stringify(
                {
                  source: result.document?.source,
                  pageCount: result.document?.pages?.length,
                  pages: (result.document?.pages || []).map((p) => ({
                    page: p.page,
                    charCount: p.charCount,
                    textPreview: (p.text || "").slice(0, 80),
                  })),
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
        <CodeBlock>{STEP4_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑦ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP4_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑧ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP4_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑨ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP4_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
