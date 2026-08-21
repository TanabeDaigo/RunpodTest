"use client";

import { useRef, useState } from "react";
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
  FormControlLabel,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { STEP6_FLOW, STEP6_CODE, STEP6_LEARNING_NOTES } from "../examples";
import { STEP6_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep6");
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
 * Step6: Chunking → Embedding → Qdrant Indexing
 * 入力: テキスト or PDF
 */
export default function Step6Panel() {
  const inputRef = useRef(null);
  const [inputMode, setInputMode] = useState("text"); // text | pdf
  const [text, setText] = useState(SAMPLE_TEXT);
  const [source, setSource] = useState("sample_manual.txt");
  const [pdfFile, setPdfFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(120);
  const [chunkOverlap, setChunkOverlap] = useState(30);
  const [replaceSource, setReplaceSource] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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

  const canIndex =
    inputMode === "pdf" ? Boolean(pdfFile) : Boolean(text.trim());

  const handleIndex = async () => {
    if (!canIndex || loading) return;
    if (chunkOverlap >= chunkSize) {
      setError("overlap は chunkSize より小さくしてください");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let res;
      if (inputMode === "pdf") {
        const contentBase64 = await readAsBase64(pdfFile);
        res = await api.post({
          mode: "indexPdf",
          filename: pdfFile.name,
          contentBase64,
          source: source.trim() || pdfFile.name,
          chunkSize,
          chunkOverlap,
          replaceSource,
        });
      } else {
        res = await api.post({
          mode: "indexChunks",
          text: text.trim(),
          source: source.trim() || "manual_input",
          chunkSize,
          chunkOverlap,
          replaceSource,
        });
      }

      if (res?.success) {
        setResult(res);
      } else {
        setError(res?.error || "Indexing に失敗しました");
        if (res?.pdf) {
          setResult({ success: false, ...res });
        }
      }
    } catch (err) {
      log.error(inputMode === "pdf" ? "indexPdf failed" : "indexChunks failed", err);
      setError(err.message || "Indexing 中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const onPdfChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setError("PDF ファイルを選択してください");
      return;
    }
    setError("");
    setResult(null);
    setPdfFile(file);
    setSource(file.name);
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① 入力と Indexing パラメータ</TestDialogTitle>
        <TestDialogDescription>
          テキスト、または PDF（Step4 相当の抽出）から Chunking → Embedding → Qdrant
          保存できます。PDF の場合は payload.page も入ります。
        </TestDialogDescription>

        <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
          入力モード
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={inputMode}
          disabled={loading}
          onChange={(_, v) => {
            if (!v) return;
            setInputMode(v);
            setError("");
            setResult(null);
            if (v === "text" && source === (pdfFile?.name || "")) {
              setSource("sample_manual.txt");
            }
          }}
        >
          <ToggleButton value="text">テキスト</ToggleButton>
          <ToggleButton value="pdf">PDF</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          label="source（payload / 再インデックス単位）"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 2, mb: 2 }}
          disabled={loading}
          helperText="同じ source で再実行すると、replace 有効時は旧 Point を消してから入れ直します"
        />

        {inputMode === "text" ? (
          <TextField
            label="インデックスするテキスト"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            minRows={8}
            fullWidth
            disabled={loading}
          />
        ) : (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              bgcolor: "#f8fafc",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Button variant="outlined" component="label" disabled={loading}>
                PDF を選択
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  hidden
                  onChange={onPdfChange}
                />
              </Button>
              {pdfFile ? (
                <Chip label={pdfFile.name} size="small" color="primary" variant="outlined" />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  未選択（文字選択できる PDF を推奨）
                </Typography>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              選択後「Indexing 実行」で抽出→分割→保存まで一括実行します。
            </Typography>
          </Box>
        )}

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

        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Checkbox
              checked={replaceSource}
              onChange={(e) => setReplaceSource(e.target.checked)}
              disabled={loading}
            />
          }
          label="同じ source の旧 Point を削除してから投入（replaceSource）"
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={handleIndex} disabled={loading || !canIndex}>
            Indexing 実行
          </Button>
          {inputMode === "text" && (
            <Button
              variant="outlined"
              disabled={loading}
              onClick={() => {
                setText(SAMPLE_TEXT);
                setSource("sample_manual.txt");
                setChunkSize(120);
                setChunkOverlap(30);
                setReplaceSource(true);
              }}
            >
              サンプルに戻す
            </Button>
          )}
          {inputMode === "pdf" && pdfFile && (
            <Button
              variant="outlined"
              disabled={loading}
              onClick={() => {
                setPdfFile(null);
                setSource("");
                setResult(null);
              }}
            >
              PDF をクリア
            </Button>
          )}
          {loading && (
            <>
              <CircularProgress size={22} />
              <Typography variant="caption" color="text.secondary">
                {inputMode === "pdf"
                  ? "PDF 抽出 → Embedding 中…（CPU では時間がかかることがあります）"
                  : "Embedding 中…（CPU では数十秒かかることがあります）"}
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
          <TestDialogCard>
            <TestDialogTitle>② Indexing サマリ</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
              {result.inputType === "pdf" && <Chip label="from PDF" color="secondary" size="small" />}
              <Chip label={`${result.chunkCount} chunks`} color="primary" size="small" />
              <Chip label={`${result.upserted} upserted`} color="success" size="small" />
              <Chip label={`Collection 合計 ${result.pointCount}`} size="small" variant="outlined" />
              <Chip label={`${result.dimensions} dim`} size="small" variant="outlined" />
              <Chip label={`${result.totalDurationMs} ms`} size="small" variant="outlined" />
              <Chip
                label={result.replaceSource ? "replace ON" : "replace OFF"}
                size="small"
                variant="outlined"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              collection={result.collection} / source={result.source} / model={result.model}
            </Typography>
            {result.pdf && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                PDF: {result.pdf.filename} / {result.pdf.numpages} ページ / {result.pdf.charCount} 文字
                {result.pdf.extractability ? ` / extractability=${result.pdf.extractability}` : ""}
              </Typography>
            )}
            {result.pdf?.warning && (
              <Typography color="warning.main" variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                {result.pdf.warning}
              </Typography>
            )}
            {result.flow && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                {result.flow.join(" → ")}
              </Typography>
            )}
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ Upsert プレビュー</TestDialogTitle>
            <TestDialogDescription>
              Point ID は source + chunkId のハッシュ。PDF 由来なら page も入ります。
            </TestDialogDescription>
            <CodeBlock>
              {JSON.stringify(
                {
                  previews: result.previews,
                  note: "vector は Qdrant 内に保存済み（画面には出さない）",
                },
                null,
                2
              )}
            </CodeBlock>
          </TestDialogCard>

          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>④ Qdrant に保存されたサンプル（scroll）</TestDialogTitle>
            <CodeBlock>
              {JSON.stringify(
                {
                  storedSamples: (result.storedSamples || []).map((p) => ({
                    id: p.id,
                    payload: {
                      source: p.payload?.source,
                      chunkId: p.payload?.chunkId,
                      page: p.payload?.page,
                      charCount: p.payload?.charCount,
                      indexedAt: p.payload?.indexedAt,
                      textPreview: (p.payload?.text || "").slice(0, 80),
                    },
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
        <TestDialogTitle>⑤ データフロー</TestDialogTitle>
        <CodeBlock>{STEP6_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP6_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP6_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP6_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
