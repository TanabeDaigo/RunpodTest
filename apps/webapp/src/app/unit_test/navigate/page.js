"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { navigationExample } from "./examples";

const { useWebAppContext } = providers;
const log = new logjs("TestNavigate");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const { navigate } = hooks.useNavigation(); // ナビゲーション
  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Navigation</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>ナビゲーションの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{navigationExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "コードをコピー",
                onClick: () => {
                  navigator.clipboard.writeText(navigationExample);
                  actions.showInfo("コードをクリップボードにコピーしました");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>ダッシュボードへの移動</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "ダッシュボードへ移動",
                onClick: () => {
                  navigate("/dashboard");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>プロジェクト一覧への移動</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "プロジェクト一覧へ移動",
                onClick: () => {
                  navigate("/master/projects");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>アカウント設定への移動</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "アカウント設定へ移動",
                onClick: () => {
                  navigate("/account");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>履歴操作のテスト</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "前のページに戻る",
                onClick: () => {
                  navigate(-1);
                },
              })}
              {formProps.button("none", {
                children: "次のページに進む",
                onClick: () => {
                  navigate(1);
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>ページのリフレッシュ</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "ページをリフレッシュ",
                onClick: () => {
                  navigate(0);
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
