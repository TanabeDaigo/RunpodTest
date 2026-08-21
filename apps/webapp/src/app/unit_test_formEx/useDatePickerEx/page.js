/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - useDatePickerEx Test Page                               ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   useDatePickerExコンポーネントのテストページ                           ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはuseDatePickerExコンポーネントのテストページを定義します。
 * 各関数の動作確認とコード例の表示を行います。
 *
 * @file page.js
 * @module unit_test/useDatePickerEx/page
 */

"use client";

import { useUnitTest } from "./useUnitTest";
import { logjs, providers } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { useEffect } from "react";

const { useWebAppContext } = providers;
const log = new logjs("TestuseDatePickerEx");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);

  // ページタイトルを設定
  useEffect(() => {
    actions.setPageTitle("useDatePickerEx 関数一覧テスト");
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
        <TestDialogMainTitle>useDatePickerEx 関数一覧テスト</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          {/* 基本情報 */}
          <TestDialogCard>
            <TestDialogTitle>useDatePickerEx について</TestDialogTitle>
            <TestDialogDescription>
              <p>useDatePickerExは、フォーム日付ピッカーフィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化された日付ピッカーフィールドを提供します。</p>
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{`// useDatePickerExの基本的な使用例
const [form, formProps] = hooks.useDatePickerEx();

// フォームの初期化
formProps.init();

// 各関数の使用例
formProps.datePicker_created_at(); // 登録日時
formProps.datePicker_updated_at(); // 更新日時
formProps.datePicker_date_col(); // date型
formProps.datePicker_datetime_col(); // datetime型
formProps.datePicker_timestamp_col(); // timestamp型
formProps.datePicker_date_of_birth(); // 生年月日`}</CodeBlock>
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
            <TestDialogTitle>Created At</TestDialogTitle>
            <TestDialogDescription>
              <h4>datePicker_created_at</h4>
              {formProps.datePicker_created_at()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("datePicker_created_at")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("datePicker_created_at")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Updated At</TestDialogTitle>
            <TestDialogDescription>
              <h4>datePicker_updated_at</h4>
              {formProps.datePicker_updated_at()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("datePicker_updated_at")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("datePicker_updated_at")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Date Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>datePicker_date_col</h4>
              {formProps.datePicker_date_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("datePicker_date_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("datePicker_date_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Datetime Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>datePicker_datetime_col</h4>
              {formProps.datePicker_datetime_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("datePicker_datetime_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("datePicker_datetime_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Timestamp Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>datePicker_timestamp_col</h4>
              {formProps.datePicker_timestamp_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("datePicker_timestamp_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("datePicker_timestamp_col")),
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
            <TestDialogTitle>Date Of Birth</TestDialogTitle>
            <TestDialogDescription>
              <h4>datePicker_date_of_birth</h4>
              {formProps.datePicker_date_of_birth()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("datePicker_date_of_birth")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("datePicker_date_of_birth")),
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
