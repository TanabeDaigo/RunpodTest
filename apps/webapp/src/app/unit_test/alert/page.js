"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { alertExample, alertTest1, alertTest2, alertTest3, alertTest4, alertTest5, alertTest6, alertTest7 } from "./examples";
import { useEffect } from "react";
const { useWebAppContext } = providers;
const log = new logjs("TestAlert");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);
  // ページタイトルを設定
  useEffect(() => {
    actions.setPageTitle("Alert");
  }, [actions]);
  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Alert</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>アラートの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{alertExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "コードをコピー",
                onClick: () => {
                  navigator.clipboard.writeText(alertExample);
                  actions.showAlert("成功", "コードをクリップボードにコピーしました");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>基本的なアラート</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "基本的なアラート",
                onClick: () => {
                  actions.showAlert("警告", "何かがおかしいです");
                },
              })}
              {formProps.button("none", {
                children: "複数行のアラート",
                onClick: () => {
                  actions.showAlert("システムエラー", "以下のエラーが発生しました：<br/>" + "1. データベース接続エラー<br/>" + "2. ファイル読み込みエラー<br/>" + "3. メモリ不足エラー");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>HTML形式のダイアログテスト</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "基本的なHTMLアラート",
                onClick: () => {
                  actions.showAlert("HTMLアラート", "これは<b>太字</b>と<i>斜体</i>を含むHTMLアラートです。<br/>" + "改行も使用できます。");
                },
              })}
              {formProps.button("none", {
                children: "リストを含むHTMLアラート",
                onClick: () => {
                  actions.showAlert(
                    "HTMLリスト",
                    "以下の機能が利用可能です：<br/>" + "<ul>" + "  <li>太字: <b>太字テキスト</b></li>" + "  <li>斜体: <i>斜体テキスト</i></li>" + "  <li>下線: <u>下線付きテキスト</u></li>" + "</ul>"
                  );
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>スタイル付きHTMLアラート</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "スタイル付きアラート",
                onClick: () => {
                  actions.showAlert(
                    "スタイル付きアラート",
                    "<div style='color: red; font-weight: bold;'>警告メッセージ</div><br/>" +
                      "<div style='color: blue;'>通常メッセージ</div><br/>" +
                      "<div style='background-color: #f0f0f0; padding: 10px;'>" +
                      "  スタイル付きのボックス" +
                      "</div>"
                  );
                },
              })}
              {formProps.button("none", {
                children: "カラフルなアラート",
                onClick: () => {
                  actions.showAlert(
                    "カラフルなアラート",
                    "<div style='color: #ff0000; font-size: 1.2em;'>赤色の警告</div>" +
                      "<div style='color: #00ff00; font-size: 1.2em;'>緑色の成功</div>" +
                      "<div style='color: #0000ff; font-size: 1.2em;'>青色の情報</div>" +
                      "<div style='background: linear-gradient(to right, #ff0000, #00ff00); color: white; padding: 10px;'>" +
                      "  グラデーション背景" +
                      "</div>"
                  );
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Alertテスト1 - 基本的なアラート</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "アラートを表示",
                onClick: () => {
                  actions.showAlert("タイトル", "これは基本的なアラートです。");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{alertTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(alertTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Alertテスト2 - showAlert</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "showAlertを表示",
                onClick: () => {
                  actions.showAlert("タイトル", "これはshowAlertのテストです。");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{alertTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(alertTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Alertテスト3 - 成功メッセージ</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "成功メッセージを表示",
                onClick: () => {
                  actions.showSuccess("成功", "操作が正常に完了しました。");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{alertTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(alertTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Alertテスト4 - エラーメッセージ</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "エラーメッセージを表示",
                onClick: () => {
                  actions.showError("エラー", "処理中にエラーが発生しました。");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{alertTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(alertTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Alertテスト5 - 警告メッセージ</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "警告メッセージを表示",
                onClick: () => {
                  actions.showWarning("警告", "この操作は取り消せません。");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{alertTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(alertTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Alertテスト6 - 情報メッセージ</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "情報メッセージを表示",
                onClick: () => {
                  actions.showInfo("情報", "システムが更新されました。");
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{alertTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(alertTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Alertテスト7 - アラートの閉じる</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "アラートを表示して閉じる",
                onClick: () => {
                  actions.showAlert("タイトル", "このアラートは3秒後に自動的に閉じます。");
                  setTimeout(() => {
                    actions.closeAlert();
                  }, 3000);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{alertTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(alertTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
