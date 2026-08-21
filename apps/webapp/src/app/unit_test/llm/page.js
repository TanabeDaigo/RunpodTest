"use client";

import { useMemo, useState } from "react";
import { providers } from "@lib/client";
import {
  TestDialogGrid,
  TestDialogCard,
  TestDialogTitle,
  TestDialogDescription,
  TestDialogHeader,
  TestDialogMainTitle,
} from "../styles";
import { Chip, Stack, Typography, Box } from "@mui/material";
import { ROADMAP } from "./examples";
import Step1Panel from "./steps/Step1Panel";
import Step2Panel from "./steps/Step2Panel";
import Step3Panel from "./steps/Step3Panel";
import Step4Panel from "./steps/Step4Panel";
import Step5Panel from "./steps/Step5Panel";
import Step6Panel from "./steps/Step6Panel";
import Step7Panel from "./steps/Step7Panel";
import Step8Panel from "./steps/Step8Panel";
import Step9Panel from "./steps/Step9Panel";
import Step10Panel from "./steps/Step10Panel";
import Step11Panel from "./steps/Step11Panel";
import Step13Panel from "./steps/Step13Panel";
import Step14Panel from "./steps/Step14Panel";
import Step15Panel from "./steps/Step15Panel";
import Step16Panel from "./steps/Step16Panel";
import Step17Panel from "./steps/Step17Panel";
import Step18Panel from "./steps/Step18Panel";
import Step19Panel from "./steps/Step19Panel";
import Step20Panel from "./steps/Step20Panel";
import Step21Panel from "./steps/Step21Panel";
import StepPlaceholder from "./steps/StepPlaceholder";

const { useWebAppContext } = providers;

const STEP_PANELS = {
  1: Step1Panel,
  2: Step2Panel,
  3: Step3Panel,
  4: Step4Panel,
  5: Step5Panel,
  6: Step6Panel,
  7: Step7Panel,
  8: Step8Panel,
  9: Step9Panel,
  10: Step10Panel,
  11: Step11Panel,
  13: Step13Panel,
  14: Step14Panel,
  15: Step15Panel,
  16: Step16Panel,
  17: Step17Panel,
  18: Step18Panel,
  19: Step19Panel,
  20: Step20Panel,
  21: Step21Panel,
};

function Page() {
  useWebAppContext();

  const [selectedStep, setSelectedStep] = useState(1);

  const selectedInfo = useMemo(
    () => ROADMAP.find((item) => item.step === selectedStep) || ROADMAP[0],
    [selectedStep]
  );

  const availableCount = ROADMAP.filter((item) => item.available).length;
  const Panel = STEP_PANELS[selectedStep];

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>LLM / RAG 学習ラボ</TestDialogMainTitle>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Step を選ぶとそのテストに切り替えます。実装済み Step はいつでも再確認できます。
        </Typography>
      </TestDialogHeader>

      <TestDialogGrid>
        {/* 先頭: 実装ロードマップ（STEP 選択） */}
        <TestDialogCard style={{ gridColumn: "1 / -1" }}>
          <TestDialogTitle>実装ロードマップ</TestDialogTitle>
          <TestDialogDescription>
            クリックで Step を切り替えます。実装済み {availableCount} / {ROADMAP.length}。
            次の Step を足しても、前の Step のコードを消したり切り替え用に直したりする必要はありません。
          </TestDialogDescription>

          <Stack spacing={1} sx={{ mt: 2 }}>
            {ROADMAP.map((item) => {
              const isSelected = item.step === selectedStep;
              const canOpen = item.available;

              return (
                <Box
                  key={item.step}
                  onClick={() => setSelectedStep(item.step)}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    p: 1.25,
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    bgcolor: isSelected ? "action.selected" : "background.paper",
                    "&:hover": {
                      bgcolor: isSelected ? "action.selected" : "action.hover",
                    },
                  }}
                >
                  <Chip
                    label={`Step ${item.step}`}
                    size="small"
                    color={isSelected ? "primary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography
                        variant="body2"
                        fontWeight={isSelected ? 700 : 500}
                        color={canOpen ? "text.primary" : "text.secondary"}
                      >
                        {item.title}
                      </Typography>
                      {canOpen ? (
                        <Chip label="テスト可" size="small" color="success" variant="outlined" />
                      ) : (
                        <Chip label="未実装" size="small" variant="outlined" />
                      )}
                      {isSelected && <Chip label="選択中" size="small" color="primary" />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {item.summary}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </TestDialogCard>

        {/* 選択中 Step のテスト領域 */}
        <TestDialogCard style={{ gridColumn: "1 / -1", background: "transparent", boxShadow: "none", border: "none", padding: 0 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Step {selectedInfo.step}: {selectedInfo.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedInfo.summary}
          </Typography>
        </TestDialogCard>

        {Panel ? <Panel /> : <StepPlaceholder stepInfo={selectedInfo} />}
      </TestDialogGrid>
    </div>
  );
}

export default Page;
