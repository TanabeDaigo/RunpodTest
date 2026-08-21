"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { dialogExample, basicDialogExample } from "./examples";
import { useXyzDialog } from "./xyzDialog/useXyzDialog";

const { useWebAppContext } = providers;
const log = new logjs("TestDialog");

function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);
  const { open, onClose, isOpen, renderDialog } = useXyzDialog();

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Custom Dialog</TestDialogMainTitle>
      </TestDialogHeader>
      {renderDialog()}
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>カスタムダイアログの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{dialogExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "コードをコピー",
                onClick: () => {
                  navigator.clipboard.writeText(dialogExample);
                  alert("コードをクリップボードにコピーしました");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>基本的なダイアログ表示</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{basicDialogExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "ダイアログを表示",
                onClick: () => {
                  open({
                    title: "基本的なダイアログ",
                    message: "これは基本的なダイアログのテストです。",
                  });
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>ダイアログの表示/非表示</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "ダイアログを表示",
                onClick: () => {
                  open();
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
