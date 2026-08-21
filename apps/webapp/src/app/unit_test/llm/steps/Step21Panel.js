"use client";

import { useMemo, useState } from "react";
import { logjs } from "@lib/client";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BlockIcon from "@mui/icons-material/Block";
import OllamaModelSelect from "../components/OllamaModelSelect";
import { STEP21_FLOW, STEP21_CODE, STEP21_LEARNING_NOTES } from "../examples";
import { STEP21_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep21");

const SAMPLE_QUERIES = [
  { label: "RAG", query: "当社の有給休暇について教えて", forceRoute: "RAG" },
  { label: "WEB", query: "今日のNVIDIAの株価は？", forceRoute: "WEB" },
  { label: "LLM", query: "富士山の高さは？短く答えて。", forceRoute: "LLM" },
];

const FORCE_OPTIONS = [
  { value: "", label: "自動（Router）" },
  { value: "RAG", label: "force: RAG" },
  { value: "WEB", label: "force: WEB" },
  { value: "LLM", label: "force: LLM" },
];

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
  });
  const json = await res.json().catch(() => ({}));
  if (json?.redirect === "/login") {
    window.location.href = "/login";
    throw new Error("セッションが無効です");
  }
  if (!res.ok && json.success === false) {
    throw new Error(json.error || `HTTP ${res.status}`);
  }
  return json;
}

function StepIcon({ status }) {
  if (status === "done") {
    return <CheckCircleIcon color="success" fontSize="small" />;
  }
  if (status === "active") {
    return <PlayArrowIcon color="primary" fontSize="small" />;
  }
  if (status === "skipped") {
    return <BlockIcon color="disabled" fontSize="small" />;
  }
  return <RadioButtonUncheckedIcon color="disabled" fontSize="small" />;
}

function stepsForRoute(route) {
  if (route === "RAG") {
    return [
      { id: "router", label: "Router判定", status: "done" },
      { id: "embed", label: "Embedding", status: "pending" },
      { id: "qdrant", label: "Qdrant検索", status: "pending" },
      { id: "context", label: "Context作成", status: "pending" },
      { id: "ollama", label: "Ollama回答生成", status: "pending" },
      { id: "done", label: "回答完了", status: "pending" },
    ];
  }
  if (route === "WEB") {
    return [
      { id: "router", label: "Router判定", status: "done" },
      { id: "tavily", label: "Tavily Web検索", status: "pending" },
      { id: "results", label: "検索結果取得", status: "pending" },
      { id: "ollama", label: "Ollama回答生成", status: "pending" },
      { id: "done", label: "回答完了", status: "pending" },
    ];
  }
  return [
    { id: "router", label: "Router判定", status: "done" },
    { id: "ollama", label: "Ollama回答生成", status: "pending" },
    { id: "done", label: "回答完了", status: "pending" },
  ];
}

/**
 * Step21: RAG / WEB / LLM 統合テスト（Router API + Answer API）
 */
export default function Step21Panel() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [forceRoute, setForceRoute] = useState("");
  const [routerModel, setRouterModel] = useState("");
  const [mainModel, setMainModel] = useState("");
  const [embedModel, setEmbedModel] = useState("");
  // 空 = tenant filter なし（Step6/PDF 等）。Step18 なら acme / beta
  const [tenantId, setTenantId] = useState("");
  const [collection, setCollection] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | routing | answering | done
  const [error, setError] = useState("");
  const [routerResult, setRouterResult] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [helloLoading, setHelloLoading] = useState(false);
  const [helloResult, setHelloResult] = useState(null);
  const [helloError, setHelloError] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState(null);
  const [genError, setGenError] = useState("");
  const [genPrompt, setGenPrompt] = useState("富士山の高さは？短く日本語で答えて。");
  const [genModel, setGenModel] = useState("llama3.2:1b");

  const routeColor = useMemo(() => {
    const r = routerResult?.route || answerResult?.route;
    if (r === "RAG") return "secondary";
    if (r === "WEB") return "info";
    if (r === "LLM") return "default";
    return "default";
  }, [routerResult, answerResult]);

  const handleHello = async () => {
    if (helloLoading || loading || genLoading) return;
    setHelloLoading(true);
    setHelloError("");
    setHelloResult(null);
    try {
      const res = await postJson("/api/ai/hello", { message: "Hello World" });
      if (!res?.success) {
        setHelloError(res?.error || "疎通に失敗しました");
        setHelloResult(res);
        return;
      }
      setHelloResult(res);
    } catch (err) {
      log.error("hello failed", err);
      setHelloError(err.message || "疎通に失敗しました");
    } finally {
      setHelloLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (genLoading || loading || helloLoading) return;
    setGenLoading(true);
    setGenError("");
    setGenResult(null);
    try {
      const res = await postJson("/api/ai/generate", {
        prompt: genPrompt.trim() || "富士山の高さは？短く日本語で答えて。",
        model: genModel.trim() || undefined,
      });
      if (!res?.success) {
        setGenError(res?.error || "生成に失敗しました");
        setGenResult(res);
        return;
      }
      setGenResult(res);
    } catch (err) {
      log.error("generate failed", err);
      setGenError(err.message || "生成に失敗しました");
    } finally {
      setGenLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    if (!forceRoute && !routerModel) {
      setError("Router モデルを選ぶか、forceRoute を指定してください");
      return;
    }
    if (!mainModel) {
      setError("回答用モデル（Main）を選択してください");
      return;
    }

    setLoading(true);
    setError("");
    setRouterResult(null);
    setAnswerResult(null);
    setSteps([]);
    setPhase("routing");

    try {
      const routerBody = {
        question: query.trim(),
        routerModel: routerModel || undefined,
        forceRoute: forceRoute || undefined,
        tenantId: tenantId.trim() || undefined,
      };
      const routed = await postJson("/api/ai/router", routerBody);
      if (!routed?.success) {
        setError(routed?.error || "Router 判定に失敗しました");
        setRouterResult(routed);
        setPhase("idle");
        return;
      }
      setRouterResult(routed);
      const pending = stepsForRoute(routed.route).map((s) =>
        s.id === "router"
          ? s
          : s.id === (routed.route === "RAG" ? "embed" : routed.route === "WEB" ? "tavily" : "ollama")
            ? { ...s, status: "active" }
            : s,
      );
      setSteps(pending);
      setPhase("answering");

      const answerBody = {
        question: query.trim(),
        route: routed.route,
        mainModel,
        embedModel: embedModel || undefined,
        tenantId: tenantId.trim() || undefined,
        collection: collection.trim() || undefined,
      };
      const answered = await postJson("/api/ai/answer", answerBody);
      if (!answered?.success) {
        setError(answered?.error || "回答生成に失敗しました");
        setAnswerResult(answered);
        if (answered?.steps) setSteps(answered.steps);
        setPhase("idle");
        return;
      }
      setAnswerResult(answered);
      if (answered.steps) setSteps(answered.steps);
      setPhase("done");
    } catch (err) {
      log.error("Step21 failed", err);
      setError(err.message || "エラーが発生しました");
      setPhase("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>GPU 疎通（Hello World）</TestDialogTitle>
        <TestDialogDescription>
          Ollama を使わず Gateway までの経路を確認します。優先順:
          <code>RUNPOD_*</code>（RunPod）→ <code>AI_GATEWAY_BASE_URL</code>（stub）→
          in-process。
        </TestDialogDescription>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            onClick={handleHello}
            disabled={helloLoading || loading}
          >
            {helloLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "GPU疎通（Hello）"
            )}
          </Button>
          {helloResult?.mode && (
            <Chip
              label={`mode: ${helloResult.mode}`}
              size="small"
              color={
                helloResult.mode === "runpod" || helloResult.mode === "http"
                  ? "success"
                  : "default"
              }
            />
          )}
          {helloResult?.endpointId && (
            <Chip
              label={`endpoint: ${helloResult.endpointId}`}
              size="small"
              variant="outlined"
            />
          )}
          {helloResult?.baseUrl && (
            <Chip label={helloResult.baseUrl} size="small" variant="outlined" />
          )}
          {helloResult?.durationMs != null && (
            <Chip label={`${helloResult.durationMs} ms`} size="small" variant="outlined" />
          )}
        </Stack>
        {helloError && (
          <Typography color="error" sx={{ mt: 1.5 }} variant="body2">
            {helloError}
          </Typography>
        )}
        {helloResult?.success && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {helloResult.message}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {helloResult.data?.note}
              {helloResult.data?.hostname
                ? ` / host=${helloResult.data.hostname}`
                : ""}
              {helloResult.data?.service
                ? ` / service=${helloResult.data.service}`
                : ""}
              {helloResult.data?.runpodJobId
                ? ` / job=${helloResult.data.runpodJobId}`
                : ""}
            </Typography>
          </Box>
        )}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
          RunPod: <code>env/.env.development</code> に{" "}
          <code>RUNPOD_ENDPOINT_ID</code> と <code>RUNPOD_API_KEY</code> を設定 → 開発サーバ再起動 →
          このボタン。初回は Cold start で数十秒〜数分かかることがあります。
        </Typography>
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>RunPod LLM（軽量モデル）</TestDialogTitle>
        <TestDialogDescription>
          Worker 上の Ollama で短文生成します。モデル名を変えれば別モデルを試せます
          （Ollama 本体の再インストールは不要。未取得なら初回だけ <code>pull</code>）。
          14B は VRAM に注意（目安 24GB）。初回は数分以上かかることがあります。
        </TestDialogDescription>
        <TextField
          label="プロンプト"
          value={genPrompt}
          onChange={(e) => setGenPrompt(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          disabled={genLoading}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="モデル（Ollama タグ）"
            value={genModel}
            onChange={(e) => setGenModel(e.target.value)}
            fullWidth
            disabled={genLoading}
            helperText="例: llama3.2:1b / qwen2.5:14b / qwen3:14b"
          />
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Button
              size="small"
              variant="outlined"
              disabled={genLoading}
              onClick={() => setGenModel("llama3.2:1b")}
            >
              1b
            </Button>
            <Button
              size="small"
              variant="outlined"
              disabled={genLoading}
              onClick={() => setGenModel("qwen2.5:14b")}
            >
              14b
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={genLoading || loading || helloLoading}
          >
            {genLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "RunPod LLM"
            )}
          </Button>
          {genResult?.viaRunpod != null && (
            <Chip
              label={genResult.viaRunpod ? "via: runpod" : "via: local"}
              size="small"
              color={genResult.viaRunpod ? "success" : "default"}
            />
          )}
          {genResult?.model && (
            <Chip label={genResult.model} size="small" variant="outlined" />
          )}
          {genResult?.durationMs != null && (
            <Chip label={`${genResult.durationMs} ms`} size="small" variant="outlined" />
          )}
        </Stack>
        {genError && (
          <Typography color="error" sx={{ mt: 1.5, whiteSpace: "pre-wrap" }} variant="body2">
            {genError}
          </Typography>
        )}
        {genResult?.success && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="body2">{genResult.answer}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              {genResult.note}
              {genResult.data?.runpodJobId
                ? ` / job=${genResult.data.runpodJobId}`
                : ""}
            </Typography>
          </Box>
        )}
      </TestDialogCard>

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>AI統合テスト</TestDialogTitle>
        <TestDialogDescription>
          Router API（<code>/api/ai/router</code>）と回答 API（<code>/api/ai/answer</code>
          ）を分けて呼び出します。将来 GPU サーバへ移す前提で、画面から Ollama を直接呼びません。
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
              onClick={() => {
                setQuery(item.query);
                setForceRoute(item.forceRoute);
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <OllamaModelSelect
              kind="chat"
              label="Router モデル"
              value={routerModel}
              onChange={setRouterModel}
              disabled={loading || Boolean(forceRoute)}
              helperText="forceRoute 指定時は不要"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <OllamaModelSelect
              kind="chat"
              label="回答モデル（Ollama）"
              value={mainModel}
              onChange={setMainModel}
              disabled={loading}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <OllamaModelSelect
              kind="embed"
              label="Embedding（RAG時）"
              value={embedModel}
              onChange={setEmbedModel}
              disabled={loading}
              helperText="index 時と同じモデルを選ぶ"
            />
          </Box>
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
            label="tenantId（RAG時）"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            fullWidth
            disabled={loading}
            helperText="空=filterなし（会社概要.pdf等）。Step18は acme/beta"
            placeholder="（空推奨）"
          />
          <TextField
            label="collection（任意）"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            fullWidth
            disabled={loading}
            helperText="空なら metrojs_rag_docs"
            placeholder="空ならサーバ既定"
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
            tenant プリセット:
          </Typography>
          <Button
            size="small"
            variant={tenantId === "" ? "contained" : "outlined"}
            disabled={loading}
            onClick={() => setTenantId("")}
          >
            空（全件）
          </Button>
          <Button
            size="small"
            variant={tenantId === "acme" ? "contained" : "outlined"}
            disabled={loading}
            onClick={() => setTenantId("acme")}
          >
            acme
          </Button>
          <Button
            size="small"
            variant={tenantId === "beta" ? "contained" : "outlined"}
            disabled={loading}
            onClick={() => setTenantId("beta")}
          >
            beta
          </Button>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleAsk} disabled={loading || !query.trim()}>
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "質問する"
            )}
          </Button>
          {phase === "routing" && (
            <Typography variant="caption" sx={{ ml: 2 }} color="text.secondary">
              Router 判定中...
            </Typography>
          )}
          {phase === "answering" && routerResult?.route && (
            <Typography variant="caption" sx={{ ml: 2 }} color="text.secondary">
              {routerResult.route} で回答生成中...
            </Typography>
          )}
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}
      </TestDialogCard>

      {routerResult?.success && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>Router判定</TestDialogTitle>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip label={`判定結果: ${routerResult.route}`} color={routeColor} size="small" />
            {routerResult.confidence != null && (
              <Chip
                label={`confidence: ${Number(routerResult.confidence).toFixed(2)}`}
                size="small"
                variant="outlined"
              />
            )}
            <Chip label={`${routerResult.durationMs} ms`} size="small" variant="outlined" />
          </Stack>
          <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
            理由: {routerResult.reason}
          </Typography>
        </TestDialogCard>
      )}

      {(steps.length > 0 || phase === "answering") && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>回答生成状況</TestDialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            現在のルート: {routerResult?.route || answerResult?.route || "—"}
          </Typography>
          <List dense>
            {steps.map((s) => (
              <ListItem key={s.id} disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <StepIcon status={s.status} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    s.status === "skipped" ? `${s.label}（スキップ）` : s.label
                  }
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: s.status === "active" ? 700 : 400,
                    color:
                      s.status === "done"
                        ? "success.main"
                        : s.status === "active"
                          ? "primary.main"
                          : "text.secondary",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </TestDialogCard>
      )}

      {answerResult?.success && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>回答</TestDialogTitle>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
            <Chip label={`route: ${answerResult.route}`} color={routeColor} size="small" />
            {answerResult.mainModel && (
              <Chip label={answerResult.mainModel} size="small" variant="outlined" />
            )}
            <Chip label={`${answerResult.durationMs} ms`} size="small" variant="outlined" />
            {answerResult.aiGateway?.mode && (
              <Chip
                label={`gateway: ${answerResult.aiGateway.mode}`}
                size="small"
                variant="outlined"
              />
            )}
            {answerResult.retrieval && (
              <>
                <Chip
                  label={`hits: ${answerResult.retrieval.hitCount ?? 0}`}
                  size="small"
                  color={
                    (answerResult.retrieval.hitCount || 0) > 0
                      ? "success"
                      : "warning"
                  }
                  variant="outlined"
                />
                {answerResult.retrieval.collection && (
                  <Chip
                    label={`collection: ${answerResult.retrieval.collection}`}
                    size="small"
                    variant="outlined"
                  />
                )}
                {answerResult.retrieval.embedModel && (
                  <Chip
                    label={`embed: ${answerResult.retrieval.embedModel}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </>
            )}
          </Stack>
          {answerResult.retrieval?.filter && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Qdrant filter: {JSON.stringify(answerResult.retrieval.filter)}
            </Typography>
          )}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="body2">{answerResult.answer}</Typography>
          </Box>

          {(answerResult.retrieval?.hits || []).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                RAG ヒット
              </Typography>
              <Stack spacing={0.5}>
                {answerResult.retrieval.hits.map((h) => (
                  <Typography key={`${h.rank}-${h.id}`} variant="body2" color="text.secondary">
                    [{h.rank}] score={h.scoreRounded ?? h.score}
                    {h.tenantId ? ` tenant=${h.tenantId}` : ""} — {h.textPreview || "(no text)"}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          {(answerResult.sources || []).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                出典
              </Typography>
              <Stack spacing={0.5}>
                {answerResult.sources.map((s) => (
                  <Typography key={`${s.rank}-${s.url}`} variant="body2">
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
            </Box>
          )}

          {answerResult.contextPreview && (
            <Accordion sx={{ mt: 2 }} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Context プレビュー</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeBlock>{answerResult.contextPreview}</CodeBlock>
              </AccordionDetails>
            </Accordion>
          )}
        </TestDialogCard>
      )}

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>処理の流れ / 学び</TestDialogTitle>
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">フロー</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP21_FLOW}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">コード</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP21_CODE}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">学習メモ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP21_LEARNING_NOTES}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">セットアップ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP21_SETUP_MEMO}</CodeBlock>
          </AccordionDetails>
        </Accordion>
      </TestDialogCard>
    </>
  );
}
