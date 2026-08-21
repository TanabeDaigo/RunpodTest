"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { buttonExample, buttonTest1, buttonTest2, buttonTest3, buttonTest4, buttonTest5, buttonTest6, buttonTest7, buttonTest8, buttonTest9, buttonTest10 } from "./examples";
import SendIcon from "@mui/icons-material/Send";

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
        <TestDialogMainTitle>Unit Test Button</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Buttonの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト1 - 通常のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト2 - 無効化されたボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                disabled: true,
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト3 - カラー指定のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                color: "primary",
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト4 - サイズ指定のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                size: "large",
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト5 - バリアント指定のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                variant: "outlined",
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト6 - フル幅のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                fullWidth: true,
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト7 - ローディング中のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                loading: true,
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト8 - アイコン付きボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                startIcon: <SendIcon />,
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト9 - style指定のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                style: {
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                },
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Buttonテスト10 - sx指定のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("submit", {
                children: "送信",
                sx: {
                  backgroundColor: "primary.main",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                },
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{buttonTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(buttonTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
