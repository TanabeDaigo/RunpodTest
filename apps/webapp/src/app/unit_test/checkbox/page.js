"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { checkboxExample, checkboxTest1, checkboxTest2, checkboxTest3, checkboxTest4, checkboxTest5, checkboxTest6, checkboxTest7, checkboxTest8, checkboxTest9 } from "./examples";

const { useWebAppContext } = providers;

const log = new logjs("TestCheckbox");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Checkbox</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Checkboxの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト1 - 通常のチェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test1", {
                label: "通常のチェックボックス",
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト2 - 必須チェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test2", {
                label: "必須チェックボックス",
                required: true,
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト3 - 無効化チェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test3", {
                label: "無効化チェックボックス",
                disabled: true,
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト4 - カラー指定チェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test4", {
                label: "カラー指定チェックボックス",
                color: "secondary",
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト5 - サイズ指定チェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test5", {
                label: "サイズ指定チェックボックス",
                size: "large",
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト6 - ラベル位置指定チェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test6", {
                label: "ラベル位置指定チェックボックス",
                labelPlacement: "start",
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト7 - エラー表示付きチェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test7", {
                label: "エラー表示付きチェックボックス",
                error: true,
                helperText: "エラーメッセージが表示されます",
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト8 - カスタムスタイルチェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test8", {
                label: "カスタムスタイルチェックボックス",
                style: {
                  color: "#4CAF50",
                  "&.MuiChecked": {
                    color: "#4CAF50",
                  },
                },
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Checkboxテスト9 - テーマ対応スタイルチェックボックス</TestDialogTitle>
            <TestDialogDescription>
              {formProps.checkbox("test9", {
                label: "テーマ対応スタイルチェックボックス",
                sx: {
                  color: "primary.main",
                  "&.MuiChecked": {
                    color: "primary.main",
                  },
                  "&:hover": {
                    color: "primary.light",
                  },
                },
                onChange: (e) => {
                  console.log("チェック状態:", e.target.checked);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{checkboxTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(checkboxTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
