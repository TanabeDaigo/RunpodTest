"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { loadingExample } from "./examples";

const { useWebAppContext } = providers;
const log = new logjs("TestLoading");

function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Loading</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>showLoading / hideLoading のテスト</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "showLoading() を実行",
                onClick: () => {
                  actions.showLoading();
                  setTimeout(() => {
                    actions.hideLoading();
                  }, 1500);
                },
              })}
              {formProps.button("none", {
                children: "hideLoading() を実行",
                onClick: () => {
                  actions.hideLoading();
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>withLoading のテスト</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "withLoading(非同期処理) を実行",
                onClick: async () => {
                  await actions.withLoading(async () => {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                  });
                  actions.showInfo("withLoadingのテストが完了しました");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>ローディングAPIの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{loadingExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "コードをコピー",
                onClick: () => {
                  navigator.clipboard.writeText(loadingExample);
                  actions.showInfo("コードをクリップボードにコピーしました");
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
