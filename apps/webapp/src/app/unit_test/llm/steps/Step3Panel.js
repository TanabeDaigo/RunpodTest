"use client";

import { useCallback, useEffect, useState } from "react";
import { logjs, apijs } from "@lib/client";
import {
  TestDialogCard,
  TestDialogTitle,
  TestDialogDescription,
  CodeBlock,
  ButtonContainer,
} from "../../styles";
import { Button, TextField, CircularProgress, Chip, Stack, Typography, Box, Link } from "@mui/material";
import { STEP3_FLOW, STEP3_CODE, STEP3_LEARNING_NOTES } from "../examples";
import { STEP3_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep3");
const api = new apijs("api/llm");

/**
 * Step3: Qdrant（Docker）疎通・Collection・試験 Point
 */
export default function Step3Panel() {
  const [health, setHealth] = useState(null);
  const [collections, setCollections] = useState([]);
  const [ensureResult, setEnsureResult] = useState(null);
  const [upsertResult, setUpsertResult] = useState(null);
  const [testText, setTestText] = useState("富士山の標高は3776メートルです。");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshHealth = useCallback(async () => {
    setError("");
    try {
      const res = await api.post({ mode: "checkQdrant" });
      setHealth(res);
      if (!res?.success && res?.error) {
        setError(res.error);
      }
    } catch (err) {
      log.error("checkQdrant failed", err);
      setError(err.message || "Qdrant 疎通に失敗しました");
      setHealth({ ok: false, error: err.message });
    }
  }, []);

  const refreshCollections = useCallback(async () => {
    setError("");
    try {
      const res = await api.post({ mode: "listCollections" });
      if (res?.success) {
        setCollections(res.collections || []);
      } else {
        setError(res?.error || "Collection 一覧の取得に失敗しました");
      }
    } catch (err) {
      log.error("listCollections failed", err);
      setError(err.message || "Collection 一覧の取得に失敗しました");
    }
  }, []);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  useEffect(() => {
    if (health?.ok || health?.success) {
      refreshCollections();
    }
  }, [health, refreshCollections]);

  const handleEnsure = async () => {
    setLoading(true);
    setError("");
    setEnsureResult(null);
    try {
      const res = await api.post({
        mode: "ensureCollection",
        vectorSize: 768,
        distance: "Cosine",
      });
      if (res?.success) {
        setEnsureResult(res);
        await refreshCollections();
      } else {
        setError(res?.error || "Collection 作成に失敗しました");
      }
    } catch (err) {
      log.error("ensureCollection failed", err);
      setError(err.message || "Collection 作成中にエラー");
    } finally {
      setLoading(false);
    }
  };

  const handleUpsert = async () => {
    if (!testText.trim()) return;
    setLoading(true);
    setError("");
    setUpsertResult(null);
    try {
      const res = await api.post({
        mode: "upsertTestPoint",
        text: testText.trim(),
        id: 1,
      });
      if (res?.success) {
        setUpsertResult(res);
        await refreshCollections();
      } else {
        setError(res?.error || "Point 保存に失敗しました");
      }
    } catch (err) {
      log.error("upsertTestPoint failed", err);
      setError(err.message || "Point 保存中にエラー");
    } finally {
      setLoading(false);
    }
  };

  const healthOk = health?.ok || health?.success;

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① Docker がまだの場合（先にこちら）</TestDialogTitle>
        <TestDialogDescription>
          Qdrant は Docker コンテナで動かします。未インストールなら先に Docker Desktop を入れてください。
        </TestDialogDescription>
        <Box sx={{ mt: 1, mb: 1 }}>
          <Typography variant="body2" component="div">
            1.{" "}
            <Link href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
              Docker Desktop for Windows
            </Link>{" "}
            をインストール
          </Typography>
          <Typography variant="body2">2. インストール後に PC 再起動 → Docker Desktop を起動</Typography>
          <Typography variant="body2">3. PowerShell で確認: <code>docker --version</code></Typography>
          <Typography variant="body2">4. Qdrant 起動（下記コマンド or compose）</Typography>
        </Box>
        <CodeBlock>{`# 単発起動
docker run -d --name qdrant -p 6333:6333 -p 6334:6334 qdrant/qdrant

# またはリポジトリの compose
docker compose -f docker-compose.qdrant.yml up -d

# 確認
docker ps
# ブラウザ: http://localhost:6333/dashboard`}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>② Qdrant 接続状態</TestDialogTitle>
        <TestDialogDescription>
          デフォルト <code>http://127.0.0.1:6333</code>。接続できないときは Docker / コンテナ起動を確認。
        </TestDialogDescription>

        <Stack direction="row" spacing={1} sx={{ my: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip label={healthOk ? "接続 OK" : "未接続 / エラー"} color={healthOk ? "success" : "error"} size="small" />
          <Chip label={health?.baseUrl || "http://127.0.0.1:6333"} size="small" variant="outlined" />
          {health?.version && <Chip label={`v${health.version}`} size="small" variant="outlined" />}
          {health?.latencyMs != null && <Chip label={`${health.latencyMs} ms`} size="small" variant="outlined" />}
        </Stack>

        <ButtonContainer>
          <Button variant="outlined" onClick={refreshHealth} sx={{ mr: 1 }} disabled={loading}>
            疎通確認
          </Button>
          <Button variant="outlined" onClick={refreshCollections} disabled={loading || !healthOk}>
            Collection 再取得
          </Button>
        </ButtonContainer>

        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>③ Collection（箱）を作る</TestDialogTitle>
        <TestDialogDescription>
          nomic-embed-text に合わせて <strong>768次元 / Cosine</strong>。名前はデフォルト{" "}
          <code>metrojs_rag_docs</code>。
        </TestDialogDescription>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
          <Button variant="contained" onClick={handleEnsure} disabled={loading || !healthOk}>
            Collection を確保
          </Button>
          {loading && <CircularProgress size={20} />}
        </Stack>

        {collections.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              既存 Collection
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {collections.map((c) => (
                <Chip key={c.name} label={c.name} size="small" />
              ))}
            </Stack>
          </Box>
        )}

        {ensureResult && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              {ensureResult.created ? "作成しました" : "既に存在していたのでスキップ"} —{" "}
              {ensureResult.collection} / size={ensureResult.vectorSize} / {ensureResult.distance}
            </Typography>
          </Box>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>④ 試験: 1文を Embedding → Point 保存</TestDialogTitle>
        <TestDialogDescription>
          Step2 のベクトルを Qdrant の Point として1件入れる。Payload に原文を載せます（本格投入は Step6）。
        </TestDialogDescription>

        <TextField
          label="保存するテキスト"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          sx={{ mt: 2, mb: 2 }}
          disabled={loading}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="contained" onClick={handleUpsert} disabled={loading || !healthOk || !testText.trim()}>
            Embedding して保存
          </Button>
          {loading && <CircularProgress size={20} />}
        </Stack>

        {upsertResult && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
            <Typography variant="body2">
              model={upsertResult.model} / dimensions={upsertResult.dimensions} / points count=
              {upsertResult.count}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              {upsertResult.flow?.join(" → ")}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              preview: {JSON.stringify(upsertResult.preview)}
            </Typography>
          </Box>
        )}
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑤ データフロー</TestDialogTitle>
        <CodeBlock>{STEP3_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP3_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップ・実施メモ</TestDialogTitle>
        <TestDialogDescription>Docker インストール〜Qdrant 起動の手順メモです。</TestDialogDescription>
        <CodeBlock>{STEP3_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP3_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
