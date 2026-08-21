"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  iconButtonExample,
  iconButtonTest1,
  iconButtonTest2,
  iconButtonTest3,
  iconButtonTest4,
  iconButtonTest5,
  iconButtonTest6,
  iconButtonTest7,
  iconButtonTest8,
  iconButtonTest9,
  iconButtonTest10,
} from "./examples";

const log = new logjs("TestIconButton");

import { providers } from "@lib/client";
const { useWebAppContext } = providers;

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};

  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test IconButton</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>IconButtonの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト1 - 通常のアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("edit", {
                title: "編集",
                onClick: () => {
                  console.log("編集ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト2 - 無効化されたアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("delete", {
                title: "削除",
                disabled: true,
                onClick: () => {
                  console.log("削除ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト3 - カラー指定のアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("view", {
                title: "表示",
                color: "primary",
                onClick: () => {
                  console.log("表示ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト4 - サイズ指定のアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("cart", {
                title: "カート",
                size: "large",
                onClick: () => {
                  console.log("カートボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト5 - カスタムアイコンのアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("finger", {
                title: "指紋認証",
                onClick: () => {
                  console.log("指紋認証ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト6 - アラームアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("alarm", {
                title: "アラーム",
                onClick: () => {
                  console.log("アラームボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト7 - 送信アイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("send", {
                title: "送信",
                onClick: () => {
                  console.log("送信ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト8 - コピーアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("copy", {
                title: "コピー",
                onClick: () => {
                  console.log("コピーボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト9 - style指定のアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("edit", {
                title: "編集",
                style: {
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "8px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "#45a049",
                    transform: "scale(1.1)",
                  },
                },
                onClick: () => {
                  console.log("編集ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconButtonテスト10 - sx指定のアイコンボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconButton("edit", {
                title: "編集",
                sx: {
                  backgroundColor: "primary.main",
                  color: "white",
                  padding: "8px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    transform: "scale(1.1)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                },
                onClick: () => {
                  console.log("編集ボタンがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconButtonTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconButtonTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
