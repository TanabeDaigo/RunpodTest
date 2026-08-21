"use client";

/**
 * LLM で入力内容をきれいな文章に整える欄
 * モデルは ollama list（listModels）から選択
 */

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import OllamaModelSelect from "../../llm/components/OllamaModelSelect";
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
 * @param {string} props.summary
 * @param {(value: string) => void} props.onSummaryChange
 * @param {() => void} props.onSummarize
 * @param {boolean} props.loading
 * @param {string} [props.error]
 * @param {string} [props.model]
 * @param {(name: string) => void} [props.onModelChange]
 */
export default function SummarizeSection({
  summary,
  onSummaryChange,
  onSummarize,
  loading,
  error,
  model = "",
  onModelChange,
}) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, color: sakuttoColors.text, fontWeight: 600 }}
      >
        今日のまとめ（AI 要約）
      </Typography>
      <Typography
        variant="caption"
        sx={{ display: "block", mb: 1.5, color: sakuttoColors.textMuted }}
      >
        上の入力をもとに、選んだモデルが読みやすい文章に整えます。内容は編集できます。
      </Typography>

      {typeof onModelChange === "function" && (
        <Box sx={{ mb: 1.5 }}>
          <OllamaModelSelect
            kind="chat"
            value={model}
            onChange={onModelChange}
            disabled={loading}
            label="要約モデル（ollama list）"
            helperText="インストール済みチャットモデルから選択します"
          />
        </Box>
      )}

      <Button
        variant="outlined"
        fullWidth
        startIcon={
          loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <AutoAwesomeOutlinedIcon />
          )
        }
        onClick={onSummarize}
        disabled={loading || !model}
        sx={{
          mb: 1.5,
          py: 1.2,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          borderColor: sakuttoColors.accent,
          color: sakuttoColors.accent,
          "&:hover": {
            borderColor: sakuttoColors.accent,
            bgcolor: sakuttoColors.accentSoft,
          },
        }}
      >
        {loading ? "要約中…" : "入力内容を要約する"}
      </Button>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 1, whiteSpace: "pre-wrap" }}>
          {error}
        </Typography>
      )}

      <TextField
        label="要約文"
        placeholder="「要約する」を押すと、ここにきれいな文章が表示されます"
        value={summary}
        onChange={(e) => onSummaryChange(e.target.value)}
        fullWidth
        multiline
        minRows={4}
        disabled={loading}
        sx={fieldSx}
      />
    </Box>
  );
}
