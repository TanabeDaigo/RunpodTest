"use client";

import { useState } from "react";
import { logjs, apijs } from "@lib/client";
import {
  TestDialogCard,
  TestDialogTitle,
  TestDialogDescription,
  CodeBlock,
} from "../../styles";
import { Button, TextField, CircularProgress, Stack, Typography, Box } from "@mui/material";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP2_FLOW, STEP2_CODE, STEP2_LEARNING_NOTES } from "../examples";
import { STEP2_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep2");
const api = new apijs("api/llm");

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "12px",
};

/**
 * Step2: Embedding（nomic-embed-text）テスト
 */
export default function Step2Panel() {
  const [embedModel, setEmbedModel] = useState("");
  const [singleText, setSingleText] = useState("日本で一番高い山は？");
  const [textA, setTextA] = useState("富士山の標高は？");
  const [textB, setTextB] = useState("日本一高い山はどこ？");
  const [embedResult, setEmbedResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState("");

  const handleEmbed = async () => {
    const prompt = singleText.trim();
    if (!prompt || loadingEmbed) return;
    if (!embedModel) {
      setError("Embedding モデルを選択してください");
      return;
    }

    setLoadingEmbed(true);
    setError("");
    setEmbedResult(null);

    try {
      const res = await api.post({
        mode: "embed",
        embedModel,
        prompt,
      });
      if (res?.success) {
        setEmbedResult(res);
      } else {
        setError(res?.error || "Embedding に失敗しました");
      }
    } catch (err) {
      log.error("embed failed", err);
      setError(err.message || "Embedding 中にエラーが発生しました");
    } finally {
      setLoadingEmbed(false);
    }
  };

  const handleCompare = async () => {
    if (!textA.trim() || !textB.trim() || loadingCompare) return;
    if (!embedModel) {
      setError("Embedding モデルを選択してください");
      return;
    }

    setLoadingCompare(true);
    setError("");
    setCompareResult(null);

    try {
      const res = await api.post({
        mode: "compareEmbeddings",
        embedModel,
        textA: textA.trim(),
        textB: textB.trim(),
      });
      if (res?.success) {
        setCompareResult(res);
      } else {
        setError(res?.error || "類似度比較に失敗しました");
      }
    } catch (err) {
      log.error("compareEmbeddings failed", err);
      setError(err.message || "類似度比較中にエラーが発生しました");
    } finally {
      setLoadingCompare(false);
    }
  };

  const similarityLabel = (score) => {
    if (score == null) return "";
    if (score >= 0.85) return "とても近い（似た意味の可能性大）";
    if (score >= 0.7) return "近い";
    if (score >= 0.5) return "やや近い";
    return "遠い（話題が違う可能性）";
  };

  return (
    <>
      <TestDialogCard>
        <TestDialogTitle>① Embedding モデル</TestDialogTitle>
        <TestDialogDescription>
          Chat 用の <code>llama3:8b</code> とは別モデルです。文章生成はせず、テキストを数値ベクトルに変換します。
        </TestDialogDescription>

        <Box sx={{ mt: 2 }}>
          <OllamaModelSelect
            kind="embed"
            value={embedModel}
            onChange={setEmbedModel}
            disabled={loadingEmbed || loadingCompare}
          />
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>② 単一テキスト → ベクトル</TestDialogTitle>
        <TestDialogDescription>
          次元数と先頭数件のプレビューを確認します（巨大配列は UI に全部は出しません）。
        </TestDialogDescription>

        <TextField
          label="テキスト"
          value={singleText}
          onChange={(e) => setSingleText(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          style={inputStyle}
          disabled={loadingEmbed}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="contained" onClick={handleEmbed} disabled={loadingEmbed || !singleText.trim()}>
            Embedding 実行
          </Button>
          {loadingEmbed && <CircularProgress size={20} />}
        </Stack>

        {embedResult && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              model={embedResult.model} / dimensions=<strong>{embedResult.dimensions}</strong> /{" "}
              {embedResult.totalDurationMs} ms
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              preview（先頭8次元）
            </Typography>
            <CodeBlock>{JSON.stringify(embedResult.preview, null, 2)}</CodeBlock>
            {embedResult.flow && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {embedResult.flow.join(" → ")}
              </Typography>
            )}
          </Box>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>③ 2テキストの類似度（Cosine Similarity）</TestDialogTitle>
        <TestDialogDescription>
          似た意味の文はスコアが高く、違う話題は低くなります。後の Qdrant 検索も同じ考え方です。
        </TestDialogDescription>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="テキスト A"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            multiline
            minRows={3}
            fullWidth
            disabled={loadingCompare}
          />
          <TextField
            label="テキスト B"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            multiline
            minRows={3}
            fullWidth
            disabled={loadingCompare}
          />
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }} alignItems="center">
          <Button
            variant="contained"
            onClick={handleCompare}
            disabled={loadingCompare || !textA.trim() || !textB.trim()}
          >
            類似度を計算
          </Button>
          {loadingCompare && <CircularProgress size={20} />}
          <Button
            variant="text"
            disabled={loadingCompare}
            onClick={() => {
              setTextA("富士山の標高は？");
              setTextB("日本一高い山はどこ？");
            }}
          >
            例: 似た意味
          </Button>
          <Button
            variant="text"
            disabled={loadingCompare}
            onClick={() => {
              setTextA("富士山の標高は？");
              setTextB("今日の天気は？");
            }}
          >
            例: 違う話題
          </Button>
          <Button
            variant="text"
            disabled={loadingCompare}
            onClick={() => {
              setTextA("富士山の標高は？");
              setTextB("富士山の標高は？");
            }}
          >
            例: 同一文
          </Button>
        </Stack>

        {compareResult && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              similarity = {compareResult.similarityRounded}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {similarityLabel(compareResult.similarity)}
            </Typography>
            <Typography variant="body2">
              dimensions={compareResult.dimensions} / {compareResult.totalDurationMs} ms
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              A preview: {JSON.stringify(compareResult.textA?.preview)}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              B preview: {JSON.stringify(compareResult.textB?.preview)}
            </Typography>
          </Box>
        )}
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>④ データフロー</TestDialogTitle>
        <CodeBlock>{STEP2_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑤ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP2_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑥ セットアップ・実施メモ</TestDialogTitle>
        <TestDialogDescription>
          インストール手順・PowerShell 操作・確認コマンド。あとから見返す用です。
        </TestDialogDescription>
        <CodeBlock>{STEP2_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑦ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP2_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
