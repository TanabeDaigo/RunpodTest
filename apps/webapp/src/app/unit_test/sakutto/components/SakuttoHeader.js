"use client";

import { Box, Typography } from "@mui/material";
import { sakuttoColors } from "../sakuttoData";

/**
 * アプリヘッダー（タイトル＋コンセプト）
 */
export default function SakuttoHeader() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 2.5, sm: 3 },
        px: 1,
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.5rem", sm: "1.75rem" },
          color: sakuttoColors.text,
          letterSpacing: "0.02em",
        }}
      >
        📒 サクッと記録
      </Typography>
      <Typography
        sx={{
          mt: 1,
          color: sakuttoColors.textMuted,
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        今日の成長をサクッと記録しよう
      </Typography>
    </Box>
  );
}
