"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { tooltipExample, tooltipTest1, } from "./examples";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const { useWebAppContext } = providers;
const log = new logjs("TestButton");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Tooltip</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Tooltipの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{tooltipExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Tooltipテスト1 - 通常のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.tooltip("help_send", {
                title: "このボタンで送信します",
                children: formProps.button("submit",{
                  children: "送信",
                  onClick: () => {
                    console.log("送信");
                  },
                }),
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{tooltipTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(tooltipTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Tooltipテスト2 - arrowスタイル変更</TestDialogTitle>
            <TestDialogDescription>
              {formProps.tooltip("help_send_arrow", {
                title: "arrow の色を変えています",
                arrowSx: {
                  color: "#ffcc00",
                },
                sx: {
                  backgroundColor: "#ffcc00",
                  color: "#333",
                },
                children: formProps.button("submit_arrow", {
                  children: "送信（arrow色変更）",
                  onClick: () => {
                    console.log("send with arrow style");
                  },
                }),
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Tooltipテスト3 - placement指定</TestDialogTitle>
            <TestDialogDescription>
              {formProps.tooltip("help_placement", {
                title: "bottom-start に表示されます",
                placement: "bottom-start",
                children: formProps.button("placement_btn", {
                  children: "配置テスト",
                }),
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Tooltipテスト1 - 通常のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.tooltip("help_text", {
                title: "説明用テキストです",
                children: (
                  <Typography sx={{ cursor: "help", color: "text.secondary" }}>
                    ここにカーソルを合わせてください
                  </Typography>
                ),
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{tooltipTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(tooltipTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Tooltipテスト1 - 通常のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.tooltip("help_disabled", {
                title: "条件を満たすと有効になります",
                children: formProps.button("submit_disabled", {
                  disabled: true,
                  children: "送信（無効）",
                }),
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{tooltipTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(tooltipTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Tooltipテスト1 - 通常のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.tooltip("help_box", {
                title: "エリア全体に説明を表示",
                placement: "bottom",
                children: (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px dashed",
                      cursor: "help",
                    }}
                  >
                    このエリアについて
                  </Box>
                ),
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{tooltipTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(tooltipTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
