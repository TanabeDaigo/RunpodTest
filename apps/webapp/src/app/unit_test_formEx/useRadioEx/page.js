/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - useRadioEx Test Page                               ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   useRadioExコンポーネントのテストページ                           ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはuseRadioExコンポーネントのテストページを定義します。
 * 各関数の動作確認とコード例の表示を行います。
 *
 * @file page.js
 * @module unit_test/useRadioEx/page
 */

"use client";

import { useUnitTest } from "./useUnitTest";
import { logjs, providers } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { useEffect } from "react";

const { useWebAppContext } = providers;
const log = new logjs("TestuseRadioEx");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);

  // ページタイトルを設定
  useEffect(() => {
    actions.setPageTitle("useRadioEx 関数一覧テスト");
  }, [actions]);

  // コード例を生成する関数
  const generateCodeExample = (functionName, params = {}) => {
    const paramStr = Object.keys(params).length > 0 ? JSON.stringify(params, null, 2).replace(/"/g, "'") : "";
    return `// ${functionName}の使用例
const [form, formProps] = hooks.useFormEx();

// 基本的な使用
formProps.${functionName}(${paramStr})

// デバッグモード付き
formProps.${functionName}(${paramStr  || "{}"}, true)`;
  };

  // コピー機能
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    actions.showAlert("成功", "コードをクリップボードにコピーしました");
  };

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>useRadioEx 関数一覧テスト</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          {/* 基本情報 */}
          <TestDialogCard>
            <TestDialogTitle>useRadioEx について</TestDialogTitle>
            <TestDialogDescription>
              <p>useRadioExは、フォームラジオボタンフィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化されたラジオボタンフィールドを提供します。</p>
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{`// useRadioExの基本的な使用例
const [form, formProps] = hooks.useRadioEx();

// フォームの初期化
formProps.init();

// 各関数の使用例
formProps.radio_sex(); // オプション1
formProps.radio_auth(); // オプション1`}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          

          

          

          
          <TestDialogCard>
            <TestDialogTitle>個人情報関数</TestDialogTitle>
            <TestDialogDescription>
              <p>個人情報入力用の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
                    <TestDialogCard>
            <TestDialogTitle>Radio Sex</TestDialogTitle>
            <TestDialogDescription>
              <h4>radio_sex</h4>
              {formProps.radio_sex()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("radio_sex")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("radio_sex")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Radio Auth</TestDialogTitle>
            <TestDialogDescription>
              <h4>radio_auth</h4>
              {formProps.radio_auth()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("radio_auth")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("radio_auth")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
