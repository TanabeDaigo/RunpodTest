"use client";

import { TestDialogCard, TestDialogTitle, TestDialogDescription, CodeBlock } from "../../styles";
import { Typography, Stack, Chip } from "@mui/material";

/**
 * 未実装 Step のプレースホルダ
 * ロードマップから選べるが、テスト UI はまだ無い
 */
export default function StepPlaceholder({ stepInfo }) {
  if (!stepInfo) return null;

  return (
    <TestDialogCard style={{ gridColumn: "1 / -1" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Chip label={`Step ${stepInfo.step}`} size="small" />
        <Chip label="未実装" size="small" color="warning" variant="outlined" />
      </Stack>
      <TestDialogTitle>{stepInfo.title}</TestDialogTitle>
      <TestDialogDescription>{stepInfo.summary}</TestDialogDescription>

      <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
        この Step のテスト UI はまだありません。実装が進むと、ここからいつでも再テストできるようになります。
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Step 1 など実装済みの項目は、上のロードマップからいつでも切り替えられます（コード修正は不要です）。
      </Typography>

      <CodeBlock>{`準備できたらここに追加予定:
- この Step 専用の操作 UI
- 期待する入出力の確認
- 学習メモ / データフロー図`}</CodeBlock>
    </TestDialogCard>
  );
}
