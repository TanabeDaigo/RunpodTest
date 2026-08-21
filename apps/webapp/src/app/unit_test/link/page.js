"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
const { useWebAppContext } = providers;
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  linkExample,
  linkTest1,
  linkTest2,
  linkTest3,
  linkTest4,
  linkTest5,
  linkTest6,
  linkTest7,
  linkTest8,
  linkTest9,
  linkTest10,
  linkTest11,
  linkTest12,
  linkTest13,
  linkTest14,
  linkTest15,
} from "./examples";
import HomeIcon from "@mui/icons-material/Home";

const log = new logjs("TestLink");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Link</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Linkの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkExample)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト1 - 通常のリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "通常のリンク",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト2 - 外部リンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "https://www.yahoo.co.jp/",
                children: "外部リンク",
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト3 - アイコン付きリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: (
                  <>
                    <HomeIcon sx={{ mr: 1 }} />
                    ダッシュボードへの移動
                  </>
                ),
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト4 - 無効化リンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "無効化リンク",
                disabled: true,
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト5 - カスタムスタイルのリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "カスタムスタイル",
                style: {
                  color: "#4CAF50",
                  textDecoration: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    color: "#45a049",
                  },
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト6 - テーマ対応スタイルのリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "テーマ対応スタイル",
                sx: {
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    color: "primary.dark",
                  },
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト7 - サイズ指定リンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "大きいサイズ",
                size: "large",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト8 - カラー指定リンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "警告色",
                color: "warning",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト9 - 下線なしリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "下線なし",
                underline: "none",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト10 - カスタムクラスリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "カスタムクラス",
                className: "custom-link",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト11 - ツールチップ付きリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "ツールチップ",
                title: "リンクの説明",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest11}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest11)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト12 - イベントハンドラ付きリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "イベントハンドラ",
                onClick: (e) => {
                  e.preventDefault();
                  console.log("リンクがクリックされました");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest12}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest12)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト13 - 条件付きリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "条件付き",
                disabled: !form["isEnabled"],
                onClick: (e) => {
                  if (!form["isEnabled"]) {
                    e.preventDefault();
                  }
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest13}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest13)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト14 - カスタムコンポーネントリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "カスタムコンポーネント",
                sx: {
                  color: "secondary.main",
                  textDecoration: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    color: "secondary.dark",
                    textDecoration: "underline",
                  },
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest14}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest14)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Linkテスト15 - 複合スタイルリンク</TestDialogTitle>
            <TestDialogDescription>
              {formProps.link({
                href: "/dashboard",
                children: "複合スタイル",
                sx: {
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: "bold",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    color: "primary.dark",
                    backgroundColor: "action.hover",
                  },
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{linkTest15}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(linkTest15)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
