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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP13_FLOW, STEP13_CODE, STEP13_LEARNING_NOTES } from "../examples";
import { STEP13_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep13");
const api = new apijs("api/llm");

const SAMPLE_QUERIES = [
  { label: "リンゴ", query: "リンゴの価格は？" },
  { label: "林檎（別名）", query: "林檎の値段は？" },
  { label: "apple（英）", query: "apple の価格は？" },
  { label: "バナナ", query: "バナナはいくらですか？" },
  { label: "りんごジュース", query: "りんごジュースの値段は？" },
  { label: "無い商品", query: "メロンの価格は？" },
];

/**
 * Step13: PostgreSQL 価格マスタ連携（Qdrant 不使用）
 */
export default function Step13Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [model, setModel] = useState("");
  const [productName, setProductName] = useState("");
  const [skipAnswer, setSkipAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [ensureLoading, setEnsureLoading] = useState(false);
  const [error, setError] = useState("");
  const [health, setHealth] = useState(null);
  const [rows, setRows] = useState(null);
  const [ensureInfo, setEnsureInfo] = useState(null);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    setHealthLoading(true);
    setError("");
    try {
      const res = await api.post({ mode: "checkLlmPostgres" });
      if (res?.success) {
        setHealth(res);
      } else {
        setError(res?.error || "PostgreSQL 疎通に失敗しました");
        setHealth(res);
      }
    } catch (err) {
      log.error("checkLlmPostgres failed", err);
      setError(err.message || "疎通エラー");
    } finally {
      setHealthLoading(false);
    }
  };

  const handleEnsureJsonb = async () => {
    setEnsureLoading(true);
    setError("");
    try {
      const res = await api.post({ mode: "ensureProductCatalogJsonb" });
      if (res?.success) {
        setEnsureInfo(res);
        setRows(res.sample || res.rows || []);
      } else {
        setError(res?.error || "JSONB テーブル準備に失敗しました");
      }
    } catch (err) {
      log.error("ensureProductCatalogJsonb failed", err);
      setError(err.message || "JSONB 準備エラー");
    } finally {
      setEnsureLoading(false);
    }
  };

  const handleList = async () => {
    setListLoading(true);
    setError("");
    try {
      const res = await api.post({ mode: "listProductPrices" });
      if (res?.success) {
        setRows(res.rows || []);
      } else {
        setError(res?.error || "一覧取得に失敗しました");
      }
    } catch (err) {
      log.error("listProductPrices failed", err);
      setError(err.message || "一覧エラー");
    } finally {
      setListLoading(false);
    }
  };

  const handleAnswer = async () => {
    if ((!query.trim() && !productName.trim()) || loading) return;
    if (!skipAnswer && !model) {
      setError("生成モデルを選択してください");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const body = {
        mode: "answerPriceFromPostgres",
        skipAnswer,
      };
      if (query.trim()) body.query = query.trim();
      if (productName.trim()) body.productName = productName.trim();
      if (!skipAnswer && model) body.model = model;

      const res = await api.post(body);
      if (res?.success) {
        setResult(res);
      } else {
        setError(res?.error || "価格回答に失敗しました");
        if (res?.candidates) {
          setResult(res);
        }
      }
    } catch (err) {
      log.error("answerPriceFromPostgres failed", err);
      setError(err.message || "回答エラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① PostgreSQL 疎通・JSONB 準備</TestDialogTitle>
        <TestDialogDescription>
          本体の MySQL とは別接続（LLM_PG_*）で <code>metro_llm.product_catalog</code>（payload JSONB）を見ます。
          旧 <code>product_prices</code> は残っていても、Step13 は JSONB 側を使います。Qdrant は使いません。
        </TestDialogDescription>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          <Button variant="outlined" onClick={handleCheck} disabled={healthLoading}>
            疎通確認
          </Button>
          <Button
            variant="contained"
            onClick={handleEnsureJsonb}
            disabled={ensureLoading}
            color="secondary"
          >
            JSONB テーブル準備（作成＋シード）
          </Button>
          <Button variant="outlined" onClick={handleList} disabled={listLoading}>
            価格一覧
          </Button>
          {(healthLoading || listLoading || ensureLoading) && <CircularProgress size={22} />}
        </Stack>

        {ensureInfo?.success && (
          <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
            {ensureInfo.table} 準備完了（{ensureInfo.count} 件）— aliases 付きシード済み
          </Typography>
        )}

        {health && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
            <Chip
              label={health.success || health.ok ? "接続 OK" : "接続 NG"}
              color={health.success || health.ok ? "success" : "error"}
              size="small"
            />
            <Chip
              label={`${health.host || health.config?.host}:${health.port || health.config?.port}/${health.database || health.config?.database}`}
              size="small"
              variant="outlined"
            />
            {health.tables && (
              <Chip label={`tables: ${health.tables.join(", ") || "(none)"}`} size="small" variant="outlined" />
            )}
            {health.passwordSet === false && (
              <Chip label="LLM_PG_PASSWORD 未設定" color="warning" size="small" />
            )}
          </Stack>
        )}

        {rows && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              fontFamily: "monospace",
              fontSize: 13,
              whiteSpace: "pre-wrap",
            }}
          >
            {rows.length === 0
              ? "（0件）— 先に「JSONB テーブル準備」を実行してください"
              : rows
                  .map((r) => {
                    const aliases = (r.aliases || []).join(", ");
                    return `#${r.id} ${r.productName} [${aliases}] … ${r.priceYen} 円`;
                  })
                  .join("\n")}
          </Box>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>② 質問 → JSONB 検索 → 回答</TestDialogTitle>
        <TestDialogDescription>
          「林檎の値段は？」「apple の価格は？」のように別名でも、JSONB の <code>aliases</code> で正式名に解決して価格を返します。
          価格の正本は DB です（LLM なしでも可）。
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
          label="商品名を明示（任意・優先）"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 2 }}
          disabled={loading}
          helperText="空なら質問文から「リンゴ」などを推定します"
        />

        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Switch
              checked={skipAnswer}
              onChange={(e) => setSkipAnswer(e.target.checked)}
              disabled={loading}
            />
          }
          label="LLM なし（DB 結果を定型文で返す）"
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            onClick={handleAnswer}
            disabled={loading || (!query.trim() && !productName.trim())}
          >
            価格を取得して回答
          </Button>
          {loading && (
            <>
              <CircularProgress size={22} />
              <Typography variant="caption" color="text.secondary">
                PostgreSQL JSONB →{skipAnswer ? " 定型文" : " LLM"}…
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
          <TestDialogCard style={{ gridColumn: "1 / -1" }}>
            <TestDialogTitle>③ 回答</TestDialogTitle>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <Chip label="PostgreSQL" color="primary" size="small" />
              <Chip label="Qdrant 未使用" size="small" variant="outlined" />
              {result.hit && (
                <Chip
                  label={`${result.hit.productName}: ${result.hit.priceYen}円`}
                  color="success"
                  size="small"
                />
              )}
              <Chip label={`全体 ${result.totalDurationMs} ms`} size="small" variant="outlined" />
            </Stack>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#eff6ff",
                borderRadius: 2,
                border: "1px solid #bfdbfe",
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
            <Accordion disableGutters elevation={0} sx={{ bgcolor: "transparent" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>④ DB ヒット / Context（折りたたみ）</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeBlock>{result.context}</CodeBlock>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  hit JSON
                </Typography>
                <CodeBlock>{JSON.stringify(result.hit, null, 2)}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          </TestDialogCard>
        </>
      )}

      <TestDialogCard>
        <TestDialogTitle>⑤ データフロー</TestDialogTitle>
        <CodeBlock>{STEP13_FLOW}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑥ サーバー側の本質</TestDialogTitle>
        <CodeBlock>{STEP13_CODE}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>⑦ セットアップ・実施メモ</TestDialogTitle>
        <CodeBlock>{STEP13_SETUP_MEMO.trim()}</CodeBlock>
      </TestDialogCard>

      <TestDialogCard>
        <TestDialogTitle>⑧ 学習メモ</TestDialogTitle>
        <CodeBlock>{STEP13_LEARNING_NOTES.trim()}</CodeBlock>
      </TestDialogCard>
    </>
  );
}
