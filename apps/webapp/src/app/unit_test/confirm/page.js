"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { confirmExample } from "./examples";

const { useWebAppContext } = providers;
const log = new logjs("TestConfirm");

function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Confirm</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>確認ダイアログの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{confirmExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "コードをコピー",
                onClick: () => {
                  navigator.clipboard.writeText(confirmExample);
                  actions.showAlert("コードをクリップボードにコピーしました");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>基本的な確認ダイアログ</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "基本的な確認",
                onClick: async () => {
                  const result = await actions.showConfirm("確認", "この操作を実行してもよろしいですか？");
                  log.info("result", result);
                  if (result) {
                    actions.showAlert("成功", "操作を実行しました");
                  } else {
                    actions.showAlert("キャンセル", "操作をキャンセルしました");
                  }
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>HTML形式のダイアログテスト</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "HTML確認",
                onClick: async () => {
                  const result = await actions.showConfirm(
                    "HTML確認",
                    "<div style='color: red; font-weight: bold;'>警告: この操作は取り消せません</div><br/>" +
                      "<div style='color: blue;'>通常の説明テキスト</div><br/>" +
                      "<div style='background-color: #f0f0f0; padding: 10px;'>" +
                      "  スタイル付きのボックス内のテキスト" +
                      "</div>"
                  );
                  if (result) {
                    actions.showAlert("HTML確認ダイアログで「はい」が選択されました");
                  }
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
