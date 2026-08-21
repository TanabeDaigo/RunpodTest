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
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { STEP18_FLOW, STEP18_CODE, STEP18_LEARNING_NOTES } from "../examples";
import { STEP18_SETUP_MEMO } from "../setupMemos";

const log = new logjs("UnitTestLlmStep18");
const api = new apijs("api/llm");

const DOC_ACME = `【ACME社 就業規則（抜粋）】
有給休暇の申請方法:
ACME社では、人事ポータルの「休暇申請」画面から年次有給休暇を申請してください。
申請は取得希望日の3営業日前までに行い、直属上司の承認が必要です。
緊急時は事後申請も可能ですが、事由を必ず記載します。
問い合わせは hr-acme@example.com です。`;

const DOC_BETA = `【BETA社 就業規則（抜粋）】
有給休暇の申請方法:
BETA社では、紙の「年次有給休暇届」に記入し、総務課の受付ボックスへ提出してください。
電子申請は行いません。提出期限は取得日の5営業日前です。
問い合わせは somu-beta@example.com です。`;

const QUERY = "有給の申請方法は？";

/**
 * Step18: tenant_id 隔離（payload filter / collection 命名）
 */
export default function Step18Panel() {
  const [isolationMode, setIsolationMode] = useState("payload");
  const [tenantA, setTenantA] = useState("acme");
  const [tenantB, setTenantB] = useState("beta");
  const [query, setQuery] = useState(QUERY);
  const [topK, setTopK] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seedResult, setSeedResult] = useState(null);
  const [retrieveA, setRetrieveA] = useState(null);
  const [retrieveB, setRetrieveB] = useState(null);
  const [leakCheck, setLeakCheck] = useState(null);

  const handleSeedBoth = async () => {
    if (loading) return;
    if (!tenantA.trim() || !tenantB.trim()) {
      setError("tenant A / B を入力してください");
      return;
    }
    if (tenantA.trim().toLowerCase() === tenantB.trim().toLowerCase()) {
      setError("tenant A と B は別 ID にしてください");
      return;
    }

    setLoading(true);
    setError("");
    setSeedResult(null);
    setRetrieveA(null);
    setRetrieveB(null);
    setLeakCheck(null);

    try {
      const common = {
        mode: "indexChunks",
        isolationMode,
        requireTenant: true,
        replaceSource: true,
        chunkSize: 200,
        chunkOverlap: 40,
      };

      const resA = await api.post({
        ...common,
        tenantId: tenantA.trim(),
        source: "manual_leave_acme",
        text: DOC_ACME,
      });
      const resB = await api.post({
        ...common,
        tenantId: tenantB.trim(),
        source: "manual_leave_beta",
        text: DOC_BETA,
      });

      if (!resA?.success || !resB?.success) {
        setError(resA?.error || resB?.error || "index に失敗しました");
        setSeedResult({ resA, resB });
        return;
      }
      setSeedResult({ resA, resB });
    } catch (err) {
      log.error("seed failed", err);
      setError(err.message || "index 中にエラー");
    } finally {
      setLoading(false);
    }
  };

  const handleCompareRetrieve = async () => {
    if (loading) return;
    if (!query.trim()) return;
    if (!tenantA.trim() || !tenantB.trim()) {
      setError("tenant A / B を入力してください");
      return;
    }

    setLoading(true);
    setError("");
    setRetrieveA(null);
    setRetrieveB(null);
    setLeakCheck(null);

    try {
      const base = {
        mode: "retrieve",
        query: query.trim(),
        topK: Number(topK) || 3,
        isolationMode,
        requireTenant: true,
      };

      const [resA, resB] = await Promise.all([
        api.post({ ...base, tenantId: tenantA.trim() }),
        api.post({ ...base, tenantId: tenantB.trim() }),
      ]);

      setRetrieveA(resA);
      setRetrieveB(resB);

      if (!resA?.success || !resB?.success) {
        setError(resA?.error || resB?.error || "retrieve に失敗しました");
        return;
      }

      const textsA = (resA.hits || []).map((h) => h.text || "").join("\n");
      const textsB = (resB.hits || []).map((h) => h.text || "").join("\n");
      const aHasBeta = /BETA社|紙の|総務課/.test(textsA);
      const bHasAcme = /ACME社|人事ポータル/.test(textsB);
      const aOnlyAcme = /ACME社|人事ポータル/.test(textsA);
      const bOnlyBeta = /BETA社|紙の|総務課/.test(textsB);

      setLeakCheck({
        ok: !aHasBeta && !bHasAcme && aOnlyAcme && bOnlyBeta,
        aHasBeta,
        bHasAcme,
        aOnlyAcme,
        bOnlyBeta,
        collectionA: resA.collection,
        collectionB: resB.collection,
        filterA: resA.filter,
        filterB: resB.filter,
      });
    } catch (err) {
      log.error("compare retrieve failed", err);
      setError(err.message || "retrieve 中にエラー");
    } finally {
      setLoading(false);
    }
  };

  const renderHits = (res, label) => {
    if (!res) return null;
    return (
      <Box sx={{ flex: 1, minWidth: 260 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
          <Chip label={label} size="small" color="primary" />
          {res.tenantId && <Chip label={`tenant=${res.tenantId}`} size="small" variant="outlined" />}
          {res.collection && (
            <Chip label={res.collection} size="small" variant="outlined" />
          )}
          <Chip label={`hits=${res.hitCount ?? 0}`} size="small" variant="outlined" />
        </Stack>
        {(res.hits || []).map((h) => (
          <Box
            key={`${label}-${h.id}-${h.rank}`}
            sx={{
              mb: 1,
              p: 1.25,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              #{h.rank} score={h.scoreRounded ?? h.score} tenant={h.tenantId || "—"}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {h.textPreview || h.text}
            </Typography>
          </Box>
        ))}
        {!res.success && (
          <Typography color="error" variant="body2">
            {res.error}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <>
      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>① 隔離モードと tenant</TestDialogTitle>
        <TestDialogDescription>
          同じ質問でも tenant が違えば、他社のマニュアルはヒットしません。
          <code>payload</code> は共有 collection + <code>tenant_id</code> filter、
          <code>collection</code> は <code>t_&#123;tenant&#125;_docs</code> に分離します（payload にも tenant_id を付与）。
        </TestDialogDescription>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            select
            label="isolationMode"
            value={isolationMode}
            onChange={(e) => setIsolationMode(e.target.value)}
            fullWidth
            disabled={loading}
          >
            <MenuItem value="payload">payload（共有 collection + filter）</MenuItem>
            <MenuItem value="collection">collection（tenant 専用）</MenuItem>
          </TextField>
          <TextField
            label="tenant A"
            value={tenantA}
            onChange={(e) => setTenantA(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="tenant B"
            value={tenantB}
            onChange={(e) => setTenantB(e.target.value)}
            fullWidth
            disabled={loading}
          />
        </Stack>

        <TextField
          label="比較用の質問"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        />
        <TextField
          label="topK"
          type="number"
          value={topK}
          onChange={(e) => setTopK(e.target.value)}
          sx={{ mt: 2, width: 120 }}
          disabled={loading}
          inputProps={{ min: 1, max: 10 }}
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={handleSeedBoth} disabled={loading}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "① A/B を index"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleCompareRetrieve}
            disabled={loading || !query.trim()}
          >
            ② 同じ質問で A/B retrieve 比較
          </Button>
        </Stack>

        {error && (
          <Typography color="error" sx={{ mt: 2, whiteSpace: "pre-wrap" }} variant="body2">
            {error}
          </Typography>
        )}

        {seedResult?.resA?.success && seedResult?.resB?.success && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
            <Chip
              label={`A indexed → ${seedResult.resA.collection} (${seedResult.resA.chunkCount})`}
              size="small"
              color="success"
              variant="outlined"
            />
            <Chip
              label={`B indexed → ${seedResult.resB.collection} (${seedResult.resB.chunkCount})`}
              size="small"
              color="success"
              variant="outlined"
            />
          </Stack>
        )}
      </TestDialogCard>

      {(retrieveA || retrieveB) && (
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>② 比較結果</TestDialogTitle>
          {leakCheck && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label={
                  leakCheck.ok
                    ? "隔離 OK（他テナント文書の混入なし）"
                    : "隔離 NG（混入の可能性）"
                }
                color={leakCheck.ok ? "success" : "error"}
                size="small"
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                A に BETA 混入={String(leakCheck.aHasBeta)} / B に ACME 混入=
                {String(leakCheck.bHasAcme)}
              </Typography>
            </Box>
          )}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {renderHits(retrieveA, `tenant ${tenantA}`)}
            {renderHits(retrieveB, `tenant ${tenantB}`)}
          </Stack>
        </TestDialogCard>
      )}

      <TestDialogCard style={{ gridColumn: "1 / -1" }}>
        <TestDialogTitle>③ 処理の流れ / コード / 学び</TestDialogTitle>
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">処理フロー</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP18_FLOW}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">コード例</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP18_CODE}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">学習メモ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP18_LEARNING_NOTES}</CodeBlock>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">セットアップメモ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeBlock>{STEP18_SETUP_MEMO}</CodeBlock>
          </AccordionDetails>
        </Accordion>
      </TestDialogCard>
    </>
  );
}
