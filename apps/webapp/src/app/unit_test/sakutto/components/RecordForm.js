"use client";

/**
 * 今日の記録フォーム
 * 写真のあと → AI 要約 → 保存
 */

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import PhotoUpload from "./PhotoUpload";
import SummarizeSection from "./SummarizeSection";
import { sakuttoColors } from "../sakuttoData";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#fff",
    borderRadius: 2,
    "& fieldset": { borderColor: sakuttoColors.border },
    "&:hover fieldset": { borderColor: sakuttoColors.primary },
    "&.Mui-focused fieldset": { borderColor: sakuttoColors.primary },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: sakuttoColors.primaryDark,
  },
};

/**
 * @param {object} props
 * @param {object} props.values
 * @param {(field: string, value: string) => void} props.onChange
 * @param {string | null} props.previewUrl
 * @param {(file: File | null) => void} props.onPhotoSelect
 * @param {string} props.summary
 * @param {(value: string) => void} props.onSummaryChange
 * @param {() => void} props.onSummarize
 * @param {boolean} props.summarizeLoading
 * @param {string} [props.summarizeError]
 * @param {string} [props.summaryModel]
 * @param {(name: string) => void} [props.onSummaryModelChange]
 * @param {() => void} props.onSave
 * @param {boolean} [props.saveLoading]
 */
export default function RecordForm({
  values,
  onChange,
  previewUrl,
  onPhotoSelect,
  summary,
  onSummaryChange,
  onSummarize,
  summarizeLoading,
  summarizeError,
  summaryModel,
  onSummaryModelChange,
  onSave,
  saveLoading = false,
}) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: sakuttoColors.text,
          fontSize: { xs: "1.05rem", sm: "1.15rem" },
        }}
      >
        この日の記録
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          label="① 今日できるようになったこと"
          placeholder="例：ワンワンと言えた"
          value={values.achievement}
          onChange={(e) => onChange("achievement", e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={fieldSx}
        />

        <TextField
          label="② 今日食べたもの"
          placeholder="例：カレー、バナナ"
          value={values.meals}
          onChange={(e) => onChange("meals", e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={fieldSx}
        />

        <TextField
          label="③ 今日遊んだこと"
          placeholder="例：公園、積み木"
          value={values.play}
          onChange={(e) => onChange("play", e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={fieldSx}
        />

        <TextField
          label="④ 今日の睡眠"
          placeholder="例：21:00〜6:30"
          value={values.sleep}
          onChange={(e) => onChange("sleep", e.target.value)}
          fullWidth
          sx={fieldSx}
        />

        <TextField
          label="⑤ 今日のひとこと"
          placeholder="自由に記録してください"
          value={values.note}
          onChange={(e) => onChange("note", e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={fieldSx}
        />

        <Divider sx={{ borderColor: sakuttoColors.border }} />

        <PhotoUpload previewUrl={previewUrl} onSelect={onPhotoSelect} />

        <Divider sx={{ borderColor: sakuttoColors.border }} />

        {/* 保存の直前: LLM 要約 */}
        <SummarizeSection
          summary={summary}
          onSummaryChange={onSummaryChange}
          onSummarize={onSummarize}
          loading={summarizeLoading}
          error={summarizeError}
          model={summaryModel}
          onModelChange={onSummaryModelChange}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<SaveOutlinedIcon />}
          onClick={onSave}
          disabled={summarizeLoading || saveLoading}
          sx={{
            mt: 0.5,
            py: 1.4,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1rem",
            bgcolor: sakuttoColors.primary,
            boxShadow: "none",
            "&:hover": {
              bgcolor: sakuttoColors.primaryDark,
              boxShadow: "none",
            },
          }}
        >
          {saveLoading ? "保存中…" : "保存する"}
        </Button>
      </Stack>
    </Box>
  );
}
