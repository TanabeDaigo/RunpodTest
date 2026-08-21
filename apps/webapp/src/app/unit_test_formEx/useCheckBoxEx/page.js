/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - useCheckBoxEx Test Page                               ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   useCheckBoxExコンポーネントのテストページ                           ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはuseCheckBoxExコンポーネントのテストページを定義します。
 * 各関数の動作確認とコード例の表示を行います。
 *
 * @file page.js
 * @module unit_test/useCheckBoxEx/page
 */

"use client";

import { useUnitTest } from "./useUnitTest";
import { logjs, providers } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { useEffect } from "react";

const { useWebAppContext } = providers;
const log = new logjs("TestuseCheckBoxEx");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);

  // ページタイトルを設定
  useEffect(() => {
    actions.setPageTitle("useCheckBoxEx 関数一覧テスト");
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
        <TestDialogMainTitle>useCheckBoxEx 関数一覧テスト</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          {/* 基本情報 */}
          <TestDialogCard>
            <TestDialogTitle>useCheckBoxEx について</TestDialogTitle>
            <TestDialogDescription>
              <p>useCheckBoxExは、フォームチェックボックスフィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化されたチェックボックスフィールドを提供します。</p>
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{`// useCheckBoxExの基本的な使用例
const [form, formProps] = hooks.useCheckBoxEx();

// フォームの初期化
formProps.init();

// 各関数の使用例
formProps.checkbox_tinyint_col(); // tiny int型
formProps.checkbox_is_deleted(); // 物理削除
formProps.checkbox_status(); // ステータス 1:削除済
formProps.checkbox_is_send_mail1(); // メールアドレス１送信フラグ
formProps.checkbox_is_send_mail2(); // メールアドレス２送信フラグ
formProps.checkbox_is_send_mail3(); // メールアドレス３送信フラグ
formProps.checkbox_sex(); // 性別 0:男性,1:女性
formProps.checkbox_province_id(); // 都道府県ID
formProps.checkbox_is_smoking(); // 喫煙フラグ true:禁煙 false:喫煙
formProps.checkbox_blood_type(); // 血液型 A:1, O:2, B:3, AB:4
formProps.checkbox_auth(); // ユーザー権限`}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          
          <TestDialogCard>
            <TestDialogTitle>基本関数</TestDialogTitle>
            <TestDialogDescription>
              <p>基本的な入力フィールドを生成する関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
                    <TestDialogCard>
            <TestDialogTitle>Tinyint Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_tinyint_col</h4>
              {formProps.checkbox_tinyint_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_tinyint_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_tinyint_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          
          <TestDialogCard>
            <TestDialogTitle>ステータス関数</TestDialogTitle>
            <TestDialogDescription>
              <p>ステータスや削除フラグなどの状態管理用の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
                    <TestDialogCard>
            <TestDialogTitle>Is Deleted</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_is_deleted</h4>
              {formProps.checkbox_is_deleted()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_is_deleted")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_is_deleted")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Status</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_status</h4>
              {formProps.checkbox_status()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_status")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_status")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          
          <TestDialogCard>
            <TestDialogTitle>メール関数</TestDialogTitle>
            <TestDialogDescription>
              <p>メールアドレス入力用の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
                    <TestDialogCard>
            <TestDialogTitle>Is Send Mail1</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_is_send_mail1</h4>
              {formProps.checkbox_is_send_mail1()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_is_send_mail1")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_is_send_mail1")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Is Send Mail2</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_is_send_mail2</h4>
              {formProps.checkbox_is_send_mail2()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_is_send_mail2")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_is_send_mail2")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Is Send Mail3</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_is_send_mail3</h4>
              {formProps.checkbox_is_send_mail3()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_is_send_mail3")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_is_send_mail3")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          
          <TestDialogCard>
            <TestDialogTitle>個人情報関数</TestDialogTitle>
            <TestDialogDescription>
              <p>個人情報入力用の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
                    <TestDialogCard>
            <TestDialogTitle>Sex</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_sex</h4>
              {formProps.checkbox_sex()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_sex")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_sex")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Province Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_province_id</h4>
              {formProps.checkbox_province_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_province_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_province_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Is Smoking</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_is_smoking</h4>
              {formProps.checkbox_is_smoking()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_is_smoking")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_is_smoking")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Blood Type</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_blood_type</h4>
              {formProps.checkbox_blood_type()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_blood_type")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_blood_type")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Auth</TestDialogTitle>
            <TestDialogDescription>
              <h4>checkbox_auth</h4>
              {formProps.checkbox_auth()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("checkbox_auth")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("checkbox_auth")),
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
