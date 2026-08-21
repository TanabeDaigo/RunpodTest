"use client";

import { useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import {
  addDaysYmd,
  formatJapaneseDate,
  parseYmd,
  sakuttoColors,
  toYmd,
} from "../sakuttoData";

/**
 * 記録日の前後移動・カレンダー選択
 * @param {{
 *   value: string, // YYYY-MM-DD
 *   onChange: (ymd: string) => void,
 *   disabled?: boolean,
 * }} props
 */
export default function TodayDateBanner({ value, onChange, disabled = false }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(value || toYmd());
  const dateInputRef = useRef(null);

  const selected = parseYmd(value) || new Date();
  const label = formatJapaneseDate(selected);

  const goPrev = () => {
    if (disabled) return;
    onChange?.(addDaysYmd(value || toYmd(), -1));
  };

  const goNext = () => {
    if (disabled) return;
    onChange?.(addDaysYmd(value || toYmd(), 1));
  };

  const openCalendar = () => {
    if (disabled) return;
    setDraftDate(value || toYmd());
    setCalendarOpen(true);
    // モバイル等でネイティブピッカーを直接開けられる場合は試す
    requestAnimationFrame(() => {
      try {
        dateInputRef.current?.showPicker?.();
      } catch {
        // ignore
      }
    });
  };

  const applyCalendar = () => {
    if (draftDate) {
      onChange?.(draftDate);
    }
    setCalendarOpen(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          bgcolor: sakuttoColors.primarySoft,
          border: `1px solid ${sakuttoColors.border}`,
          borderRadius: 3,
          py: 0.75,
          px: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 0.5,
          }}
        >
          <IconButton
            aria-label="前の日"
            onClick={goPrev}
            disabled={disabled}
            size="small"
            sx={{ color: sakuttoColors.text }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Button
            onClick={openCalendar}
            disabled={disabled}
            endIcon={<CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              flex: 1,
              minWidth: 0,
              textTransform: "none",
              fontWeight: 600,
              color: sakuttoColors.text,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              borderRadius: 2,
              py: 0.75,
              "&:hover": {
                bgcolor: "rgba(124, 179, 66, 0.18)",
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                fontSize: "inherit",
                color: "inherit",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Typography>
          </Button>

          <IconButton
            aria-label="次の日"
            onClick={goNext}
            disabled={disabled}
            size="small"
            sx={{ color: sakuttoColors.text }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Paper>

      <Dialog
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700, color: sakuttoColors.text }}>
          日付を選択
        </DialogTitle>
        <DialogContent>
          <TextField
            inputRef={dateInputRef}
            type="date"
            fullWidth
            value={draftDate}
            onChange={(e) => setDraftDate(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: sakuttoColors.border },
                "&.Mui-focused fieldset": { borderColor: sakuttoColors.primary },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCalendarOpen(false)} sx={{ textTransform: "none" }}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            onClick={applyCalendar}
            disabled={!draftDate}
            sx={{
              textTransform: "none",
              bgcolor: sakuttoColors.primary,
              "&:hover": { bgcolor: sakuttoColors.primaryDark },
            }}
          >
            この日にする
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
