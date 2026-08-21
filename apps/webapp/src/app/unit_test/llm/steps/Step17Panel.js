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
  MenuItem,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP17_FLOW, STEP17_CODE, STEP17_LEARNING_NOTES } from "../examples";
import { STEP17_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep17");
const api = new apijs("api/llm");

const SAMPLE_QUERIES = [
  { label: "general", query: "富士山の高さは？短く答えて。" },
  { label: "web", query: "今日のNVIDIAの株価は？" },
  { label: "internal", query: "社内マニュアルに書かれている休暇の申請方法は？" },
];

const FORCE_OPTIONS = [
  { value: "", label: "自動（Router）" },
  { value: "internal", label: "force: internal" },
  { value: "web", label: "force: web" },
  { value: "general", label: "force: general" },
];

/**
 * Step17: Router → RAG / Web / General → Main
 */
export default function Step17Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [routerModel, setRouterModel] = useState("");
  const [mainModel, setMainModel] = useState("");
  const [collection, setCollection] = useState("");
  const [tenantId, setTenantId] = useState("demo-tenant");
  const [forceRoute, setForceRoute] = useState("");
  const [topK, setTopK] = useState(3);
  const [scoreThreshold, setScoreThreshold] = useState(0.55);
  const [routerConfidenceThreshold, setRouterConfidenceThreshold] = useState(0.6);
  const [allowInternalPromote, setAllowInternalPromote] = useState(false);
  const [maxResults, setMaxResults] = useState(5);
  const [searchDepth, setSearchDepth] = useState("basic");
  const [webProvider, setWebProvider] = useState("tavily");
  const [skipAnswer, setSkipAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    if (!routerModel && !forceRoute) {
      setError("Router モデルを選択するか、forceRoute を指定してください");
      return;
    }
    if (!skipAnswer && !mainModel) {
      setError("Main（回答）モデルを選択してください");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const body = {
        mode: "orchestrateAsk",
        query: query.trim(),
        routerModel: routerModel || undefined,
        mainModel: mainModel || undefined,
        tenantId: tenantId.trim() || undefined,
        forceRoute: forceRoute || null,
        skipAnswer,
        topK: Number(topK) || 3,
        scoreThreshold: Number(scoreThreshold),
        routerConfidenceThreshold: Number(routerConfidenceThreshold),
        allowInternalPromote,
        maxResults: Number(maxResults) || 5,
        searchDepth,
        expandRelativeDates: true,
        webProvider,
      };
      if (collection.trim()) {
        body.collection = collection.trim();
      }

      const res = await api.post(body);
      if (res?.success) {
        setResult(res);
      } else {
        setError(res?.error || "オーケストレーションに失敗しました");
        setResult(res);
      }
    } catch (err) {
      log.error("orchestrateAsk failed", err);
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const routeColor =
    result?.route === "internal"
      ? "secondary"
      : result?.route === "web"
        ? "info"
        : "default";

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① 質問 → Router → 分岐 → Main</TestDialogTitle>
        <TestDialogDescription>
          SaaS 向けオーケストレータの学習用。案件CPU（Orchestrator）が
          共通GPU API（route / embed / generate / web）を分割呼び出しします。
          internal=RAG / web=Tavily または Gemini Grounding / general=LLM。
          モデルは <code>listModels</code> から選択。tenantId を入れると internal 検索に
          <code>tenant_id</code> filter が付きます（Step18 で隔離を本確認）。
        </TestDialogDescription>

        <TextField
          label="質問"
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
          <OllamaModelSelect
            kind="chat"
            label="Router モデル（分類）"
            value={routerModel}
            onChange={setRouterModel}
            disabled={loading || Boolean(forceRoute)}
            helperText="推奨: 小さめのチャットモデル（例: qwen3:8b）"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <OllamaModelSelect
            kind="chat"
            label="Main モデル（回答）"
            value={mainModel}
            onChange={setMainModel}
            disabled={loading || skipAnswer}
          />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="tenantId（internal 時に filter）"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            fullWidth
            disabled={loading}
            helperText="指定時は payload.tenant_id で絞る（Step18）。空なら未隔離"
          />
          <TextField
            label="Qdrant collection（任意）"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            fullWidth
            disabled={loading}
            placeholder="空ならサーバ既定"
            helperText="internal ルート用。将来のテナント分離の代用品"
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            select
            label="forceRoute"
            value={forceRoute}
            onChange={(e) => setForceRoute(e.target.value)}
            fullWidth
            disabled={loading}
          >
            {FORCE_OPTIONS.map((o) => (
              <MenuItem key={o.value || "auto"} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="scoreThreshold"
            type="number"
            value={scoreThreshold}
            onChange={(e) => setScoreThreshold(e.target.value)}
            fullWidth
            disabled={loading}
            inputProps={{ step: 0.05, min: 0, max: 1 }}
            helperText="internal 維持に必要な topScore"
          />
          <TextField
            label="routerConfidenceThreshold"
            type="number"
            value={routerConfidenceThreshold}
            onChange={(e) => setRouterConfidenceThreshold(e.target.value)}
            fullWidth
            disabled={loading}
            inputProps={{ step: 0.05, min: 0, max: 1 }}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="topK (RAG)"
            type="number"
            value={topK}
            onChange={(e) => setTopK(e.target.value)}
            fullWidth
            disabled={loading}
            inputProps={{ min: 1, max: 20 }}
          />
          <TextField
            label="maxResults (Tavily)"
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(e.target.value)}
            fullWidth
            disabled={loading}
            inputProps={{ min: 1, max: 10 }}
          />
          <TextField
            select
            label="searchDepth"
            value={searchDepth}
            onChange={(e) => setSearchDepth(e.target.value)}
            fullWidth
            disabled={loading || webProvider === "gemini"}
          >
            <MenuItem value="basic">basic</MenuItem>
            <MenuItem value="advanced">advanced</MenuItem>
          </TextField>
          <TextField
            select
            label="webProvider"
            value={webProvider}
            onChange={(e) => setWebProvider(e.target.value)}
            fullWidth
            disabled={loading}
            helperText="web ルートの検索先"
          >
            <MenuItem value="tavily">Tavily → Qwen3</MenuItem>
            <MenuItem value="gemini">Gemini Grounding → Qwen3</MenuItem>
          </TextField>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
          <FormControlLabel
            control={
              <Switch
                checked={allowInternalPromote}
                onChange={(e) => setAllowInternalPromote(e.target.checked)}
                disabled={loading}
              />
            }
            label="general でも score 高なら internal 昇格"
          />
          <FormControlLabel
            control={
              <Switch
                checked={skipAnswer}
                onChange={(e) => setSkipAnswer(e.target.checked)}
                disabled={loading}
              />
            }
            label="Main LLM なし（ルート判定のみ）"
          />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleAsk} disabled={loading || !query.trim()}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "オーケストレーション実行"}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}
      </TestDialogCard>

      {result?.success && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>② 結果</TestDialogTitle>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip label={`route: ${result.route}`} color={routeColor} size="small" />
            {result.tenantId && <Chip label={`tenant: ${result.tenantId}`} size="small" variant="outlined" />}
            {result.usedQdrant && <Chip label="Qdrant" size="small" color="secondary" variant="outlined" />}
            {result.usedTavily && <Chip label="Tavily" size="small" color="info" variant="outlined" />}
            {result.usedGemini && <Chip label="Gemini" size="small" color="primary" variant="outlined" />}
            {result.mainModel && <Chip label={result.mainModel} size="small" variant="outlined" />}
            <Chip label={`${result.totalDurationMs} ms`} size="small" variant="outlined" />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {result.routeReason}
          </Typography>

          {result.flow?.length > 0 && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
              flow: {result.flow.join(" → ")}
            </Typography>
          )}

          {result.answer != null && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                whiteSpace: "pre-wrap",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                回答
              </Typography>
              <Typography variant="body2">{result.answer}</Typography>
            </Box>
          )}

          {result.router && (
            <Accordion sx={{ mt: 2 }} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Router 詳細</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeBlock>{JSON.stringify(result.router, null, 2)}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          )}

          {result.retrieval && (
            <Accordion sx={{ mt: 1 }} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">
                  Retrieval（topScore={result.retrieval.topScore ?? "—"} / hits=
                  {result.retrieval.hitCount}）
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeBlock>{JSON.stringify(result.retrieval, null, 2)}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          )}

          {result.web && (
            <Accordion sx={{ mt: 1 }} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">
                  Web / {result.web.provider || result.webProvider || "tavily"}（
                  {result.web.sources?.length || 0} 件）
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {(result.web.sources || []).map((s) => (
                    <Typography key={s.rank} variant="body2">
                      [{s.rank}]{" "}
                      {s.url ? (
                        <Link href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.title || s.url}
                        </Link>
                      ) : (
                        s.title
                      )}
                    </Typography>
                  ))}
                </Stack>
                <CodeBlock>{JSON.stringify(result.web, null, 2)}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          )}

          {result.contextPreview && (
            <Accordion sx={{ mt: 1 }} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">
                  Context プレビュー（全 {result.contextFullLength} 文字）
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeBlock>{result.contextPreview}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          )}

          <Accordion sx={{ mt: 1 }} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">生レスポンス</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CodeBlock>{JSON.stringify(result, null, 2)}</CodeBlock>
            </AccordionDetails>
          </Accordion>
        </TestDialogCard>
      )}

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>③ 処理の流れ / コード / 学び</TestDialogTitle>
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">処理フロー</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP17_FLOW}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">コード例</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP17_CODE}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">学習メモ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP17_LEARNING_NOTES}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">セットアップメモ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP17_SETUP_MEMO}</CodeBlock>
          </AccordionDetails>
        </Accordion>
      </TestDialogCard>
    </>
  );
}
