"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";
import { sakuttoColors } from "../sakuttoData";

/**
 * 最近の記録カード一覧（DB の要約文を表示）
 * @param {{
 *   records: Array<{ id: string, dateText: string, summary: string }>,
 *   loading?: boolean,
 *   error?: string,
 * }} props
 */
export default function RecentRecords({ records = [], loading = false, error = "" }) {
  return (
    <Stack spacing={1.5}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: sakuttoColors.text,
          fontSize: { xs: "1.05rem", sm: "1.15rem" },
        }}
      >
        最近の記録
      </Typography>

      {loading && (
        <Typography sx={{ color: sakuttoColors.textMuted, fontSize: "0.9rem" }}>
          読み込み中…
        </Typography>
      )}

      {!loading && error && (
        <Typography sx={{ color: "error.main", fontSize: "0.9rem" }}>{error}</Typography>
      )}

      {!loading && !error && records.length === 0 && (
        <Typography sx={{ color: sakuttoColors.textMuted, fontSize: "0.9rem" }}>
          まだ記録がありません。保存するとここに表示されます。
        </Typography>
      )}

      {!loading &&
        records.map((record) => (
          <Card
            key={record.id}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${sakuttoColors.border}`,
              bgcolor: sakuttoColors.paper,
            }}
          >
            <CardContent sx={{ py: 1.75, "&:last-child": { pb: 1.75 } }}>
              <Typography
                variant="caption"
                sx={{
                  display: "inline-block",
                  px: 1,
                  py: 0.25,
                  mb: 0.75,
                  borderRadius: 1,
                  bgcolor: sakuttoColors.accentSoft,
                  color: sakuttoColors.accent,
                  fontWeight: 600,
                }}
              >
                {record.dateText}
              </Typography>
              <Typography
                sx={{
                  color: sakuttoColors.text,
                  fontSize: "0.95rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {record.summary}
              </Typography>
            </CardContent>
          </Card>
        ))}
    </Stack>
  );
}
