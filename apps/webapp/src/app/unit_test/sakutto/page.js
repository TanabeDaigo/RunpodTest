"use client";

/**
 * サクッと記録（Sakutto）
 * 入力 →（任意）Ollama で要約（モデルは listModels）→ PostgreSQL に保存 / 最近の記録を表示
 */

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  Divider,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { apijs, logjs } from "@lib/client";
import SakuttoHeader from "./components/SakuttoHeader";
import TodayDateBanner from "./components/TodayDateBanner";
import RecordForm from "./components/RecordForm";
import RecentRecords from "./components/RecentRecords";
import { sakuttoColors, toRecentRecordView, toYmd } from "./sakuttoData";
import {
  SUMMARY_SYSTEM_PROMPT,
  buildSummaryUserPrompt,
  hasAnyRecordInput,
  stripModelNoise,
} from "./summaryPrompt";

const log = new logjs("Sakutto");
const llmApi = new apijs("api/llm");
const sakuttoApi = new apijs("api/sakutto");

const EMPTY_FORM = {
  achievement: "",
  meals: "",
  play: "",
  sleep: "",
  note: "",
};

function applyRecordToForm(record) {
  if (!record) {
    return { values: { ...EMPTY_FORM }, summary: "" };
  }
  return {
    values: {
      achievement: record.achievement || "",
      meals: record.meals || "",
      play: record.play || "",
      sleep: record.sleep || "",
      note: record.note || "",
    },
    summary: record.summary || "",
  };
}

export default function Page() {
  const [selectedDate, setSelectedDate] = useState(() => toYmd());
  const [values, setValues] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [summary, setSummary] = useState("");
  const [summaryModel, setSummaryModel] = useState("");
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [summarizeError, setSummarizeError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [recordLoading, setRecordLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [snackMessage, setSnackMessage] = useState("保存しました");
  const [recentRecords, setRecentRecords] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");

  const showSnack = useCallback((message, severity = "success") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }, []);

  const loadRecentRecords = useCallback(async () => {
    setRecentLoading(true);
    setRecentError("");
    try {
      const res = await sakuttoApi.post({
        mode: "listSakuttoRecords",
        limit: 10,
      });
      if (res?.success) {
        setRecentRecords((res.records || []).map(toRecentRecordView));
      } else {
        setRecentError(res?.error || "最近の記録の取得に失敗しました");
        setRecentRecords([]);
      }
    } catch (err) {
      log.error("listSakuttoRecords failed", err);
      setRecentError(err.message || "最近の記録の取得に失敗しました");
      setRecentRecords([]);
    } finally {
      setRecentLoading(false);
    }
  }, []);

  /** 選択日の記録をフォームへ反映（なければ空） */
  const loadRecordForDate = useCallback(
    async (ymd) => {
      if (!ymd) return;
      setRecordLoading(true);
      setSummarizeError("");
      setPhotoFile(null);
      try {
        const res = await sakuttoApi.post({
          mode: "getSakuttoRecord",
          recordDate: ymd,
        });
        if (res?.success) {
          const applied = applyRecordToForm(res.record);
          setValues(applied.values);
          setSummary(applied.summary);
        } else {
          setValues({ ...EMPTY_FORM });
          setSummary("");
          showSnack(res?.error || "記録の取得に失敗しました", "error");
        }
      } catch (err) {
        log.error("getSakuttoRecord failed", err);
        setValues({ ...EMPTY_FORM });
        setSummary("");
        showSnack(err.message || "記録の取得に失敗しました", "error");
      } finally {
        setRecordLoading(false);
      }
    },
    [showSnack],
  );

  useEffect(() => {
    loadRecentRecords();
  }, [loadRecentRecords]);

  useEffect(() => {
    loadRecordForDate(selectedDate);
  }, [selectedDate, loadRecordForDate]);

  useEffect(() => {
    if (!photoFile) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(photoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = (file) => {
    setPhotoFile(file);
  };

  const handleDateChange = (ymd) => {
    if (!ymd || ymd === selectedDate) return;
    setSelectedDate(ymd);
  };

  /** 上の入力を listModels で選んだチャットモデルに渡し、きれいな文章にする */
  const handleSummarize = async () => {
    if (summarizeLoading || recordLoading) return;

    if (!hasAnyRecordInput(values)) {
      setSummarizeError("先に①〜⑤のいずれかを入力してください。");
      return;
    }
    if (!summaryModel) {
      setSummarizeError("要約に使うモデルを選択してください（ollama list）。");
      return;
    }

    setSummarizeLoading(true);
    setSummarizeError("");

    try {
      const res = await llmApi.post({
        mode: "chat",
        model: summaryModel,
        messages: [
          { role: "system", content: SUMMARY_SYSTEM_PROMPT },
          { role: "user", content: buildSummaryUserPrompt(values) },
        ],
      });

      if (res?.success) {
        const text = stripModelNoise(res.content || "");
        setSummary(text || "（要約結果が空でした。もう一度お試しください）");
      } else {
        setSummarizeError(
          res?.error ||
            `要約に失敗しました。Ollama とモデル「${summaryModel}」を確認してください。`
        );
      }
    } catch (err) {
      log.error("summarize failed", err);
      setSummarizeError(err.message || "要約中にエラーが発生しました");
    } finally {
      setSummarizeLoading(false);
    }
  };

  /** PostgreSQL sakutto_records に UPSERT（選択中の日付） */
  const handleSave = async () => {
    if (saveLoading || recordLoading) return;

    if (!hasAnyRecordInput(values) && !String(summary || "").trim()) {
      showSnack("保存する内容を入力してください", "warning");
      return;
    }

    setSaveLoading(true);
    try {
      const res = await sakuttoApi.post({
        mode: "upsertSakuttoRecord",
        recordDate: selectedDate,
        achievement: values.achievement,
        meals: values.meals,
        play: values.play,
        sleep: values.sleep,
        note: values.note,
        summary,
        photoPath: photoFile?.name || null,
      });

      if (res?.success) {
        showSnack("保存しました", "success");
        await loadRecentRecords();
      } else {
        showSnack(res?.error || "保存に失敗しました", "error");
      }
    } catch (err) {
      log.error("save failed", err);
      showSnack(err.message || "保存中にエラーが発生しました", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const formBusy = recordLoading || saveLoading;

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: sakuttoColors.bg,
        py: { xs: 2, sm: 3 },
        px: { xs: 0, sm: 1 },
      }}
    >
      <Container maxWidth="sm" disableGutters={false}>
        <SakuttoHeader />

        <StackSection>
          <TodayDateBanner
            value={selectedDate}
            onChange={handleDateChange}
            disabled={formBusy || summarizeLoading}
          />
        </StackSection>

        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            bgcolor: sakuttoColors.paper,
            border: `1px solid ${sakuttoColors.border}`,
            opacity: recordLoading ? 0.7 : 1,
          }}
        >
          <RecordForm
            values={values}
            onChange={handleChange}
            previewUrl={previewUrl}
            onPhotoSelect={handlePhotoSelect}
            summary={summary}
            onSummaryChange={setSummary}
            onSummarize={handleSummarize}
            summarizeLoading={summarizeLoading || recordLoading}
            summarizeError={summarizeError}
            summaryModel={summaryModel}
            onSummaryModelChange={setSummaryModel}
            onSave={handleSave}
            saveLoading={saveLoading || recordLoading}
          />
        </Paper>

        <Divider
          sx={{
            my: 3,
            borderColor: sakuttoColors.border,
          }}
        />

        <Box sx={{ px: { xs: 0.5, sm: 0 }, pb: 4 }}>
          <RecentRecords
            records={recentRecords}
            loading={recentLoading}
            error={recentError}
          />
        </Box>
      </Container>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          variant="filled"
          sx={{
            width: "100%",
            bgcolor: snackSeverity === "success" ? sakuttoColors.primary : undefined,
            borderRadius: 2,
          }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function StackSection({ children }) {
  return <Box sx={{ mt: 1, px: { xs: 0.5, sm: 0 } }}>{children}</Box>;
}
