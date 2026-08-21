/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - useInputEx Test Page                               ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   useInputExコンポーネントのテストページ                           ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはuseInputExコンポーネントのテストページを定義します。
 * 各関数の動作確認とコード例の表示を行います。
 *
 * @file page.js
 * @module unit_test/useInputEx/page
 */

"use client";

import { useUnitTest } from "./useUnitTest";
import { logjs, providers } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { useEffect } from "react";

const { useWebAppContext } = providers;
const log = new logjs("TestuseInputEx");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);

  // ページタイトルを設定
  useEffect(() => {
    actions.setPageTitle("useInputEx 関数一覧テスト");
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
        <TestDialogMainTitle>useInputEx 関数一覧テスト</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          {/* 基本情報 */}
          <TestDialogCard>
            <TestDialogTitle>useInputEx について</TestDialogTitle>
            <TestDialogDescription>
              <p>useInputExは、フォーム入力フィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化された入力フィールドを提供します。</p>
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{`// useInputExの基本的な使用例
const [form, formProps] = hooks.useInputEx();

// フォームの初期化
formProps.init();

// 各関数の使用例
formProps.input_auto_make_items_id(); // ID
formProps.input_project_id(); // プロジェクトID
formProps.input_title(); // タイトル
formProps.input_url(); // URL
formProps.input_table_name(); // 対象テーブル名
formProps.input_sort(); // ソート順
formProps.input_dbcount(); // 更新回数
formProps.input_id(); // ID
formProps.input_tinyint_col(); // tiny int型
formProps.input_category_id(); // カテゴリID
formProps.input_dbms_id(); // ID
formProps.input_industry_id(); // 業界ID
formProps.input_section_id(); // 区分ID
formProps.input_prefectury_id(); // 都道府県ID
formProps.input_area_id(); // 地方ID
formProps.input_template_id(); // テンプレートID
formProps.input_setting_id(); // ID
formProps.input_is_deleted(); // 物理削除
formProps.input_status(); // ステータス 1:削除済
formProps.input_status_id(); // ID
formProps.input_mail1(); // メールアドレス１
formProps.input_is_send_mail1(); // メールアドレス１送信フラグ
formProps.input_mail2(); // メールアドレス２
formProps.input_is_send_mail2(); // メールアドレス２送信フラグ
formProps.input_mail3(); // メールアドレス３
formProps.input_is_send_mail3(); // メールアドレス３送信フラグ
formProps.input_incoming_mail_format(); // 受信メール形式
formProps.input_sex(); // 性別 0:男性,1:女性
formProps.input_province_id(); // 都道府県ID
formProps.input_birthplace(); // 出身地
formProps.input_is_smoking(); // 喫煙フラグ true:禁煙 false:喫煙
formProps.input_blood_type(); // 血液型 A:1, O:2, B:3, AB:4
formProps.input_auth(); // ユーザー権限
formProps.input_dir_name(); // ディレクトリ名
formProps.input_contents(); // パラメータ
formProps.input_int_col(); // int型
formProps.input_smallint_col(); // small int型
formProps.input_mediumint_col(); // medium int型
formProps.input_decimal_col(); // decimal型
formProps.input_numeric_col(); // numeric型
formProps.input_float_col(); // float型
formProps.input_double_col(); // double型
formProps.input_char_col(); // char型
formProps.input_varchar_col(); // varchar型
formProps.input_text_col(); // text型
formProps.input_type(); // 種別
formProps.input_name(); // 名称
formProps.input_comments(); // コメント
formProps.input_explan(); // 説明
formProps.input_dbms_name(); // DBMS名
formProps.input_project_name(); // 名称
formProps.input_db_server(); // サーバー名
formProps.input_db_port(); // ポート番号
formProps.input_db_name(); // DB名
formProps.input_db_pass(); // DBパスワード
formProps.input_db_encoding(); // DB文字コード
formProps.input_contexts(); // ID
formProps.input_background_color(); // 背景カラーコード
formProps.input_color(); // 文字カラーコード
formProps.input_password(); // パスワード
formProps.input_password_key(); // パスワード暗号化キー
formProps.input_last_name(); // 名前(姓)
formProps.input_katakana_last_name(); // 名前かたかな(姓)
formProps.input_katakana_name(); // 名前かたかな(名)
formProps.input_post_first_no(); // 郵便番号(上3桁)
formProps.input_post_last_no(); // 郵便番号(下4桁)
formProps.input_address1(); // 住所１
formProps.input_address2(); // 住所２
formProps.input_address3(); // 住所３
formProps.input_nearest_station(); // 最寄駅
formProps.input_nationality(); // 国籍
formProps.input_official_position(); // 役職
formProps.input_department(); // 部門
formProps.input_organization(); // 組織`}</CodeBlock>
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
            <TestDialogTitle>Auto Make Items Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_auto_make_items_id</h4>
              {formProps.input_auto_make_items_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_auto_make_items_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_auto_make_items_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Project Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_project_id</h4>
              {formProps.input_project_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_project_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_project_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Title</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_title</h4>
              {formProps.input_title()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_title")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_title")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Url</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_url</h4>
              {formProps.input_url()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_url")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_url")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Table Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_table_name</h4>
              {formProps.input_table_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_table_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_table_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Sort</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_sort</h4>
              {formProps.input_sort()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_sort")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_sort")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Dbcount</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_dbcount</h4>
              {formProps.input_dbcount()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_dbcount")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_dbcount")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_id</h4>
              {formProps.input_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Tinyint Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_tinyint_col</h4>
              {formProps.input_tinyint_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_tinyint_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_tinyint_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Category Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_category_id</h4>
              {formProps.input_category_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_category_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_category_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Dbms Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_dbms_id</h4>
              {formProps.input_dbms_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_dbms_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_dbms_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Industry Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_industry_id</h4>
              {formProps.input_industry_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_industry_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_industry_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Section Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_section_id</h4>
              {formProps.input_section_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_section_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_section_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Prefectury Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_prefectury_id</h4>
              {formProps.input_prefectury_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_prefectury_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_prefectury_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Area Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_area_id</h4>
              {formProps.input_area_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_area_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_area_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Template Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_template_id</h4>
              {formProps.input_template_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_template_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_template_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Setting Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_setting_id</h4>
              {formProps.input_setting_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_setting_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_setting_id")),
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
              <h4>input_is_deleted</h4>
              {formProps.input_is_deleted()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_is_deleted")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_is_deleted")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Status</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_status</h4>
              {formProps.input_status()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_status")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_status")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Status Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_status_id</h4>
              {formProps.input_status_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_status_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_status_id")),
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
            <TestDialogTitle>Mail1</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_mail1</h4>
              {formProps.input_mail1()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_mail1")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_mail1")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Is Send Mail1</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_is_send_mail1</h4>
              {formProps.input_is_send_mail1()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_is_send_mail1")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_is_send_mail1")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Mail2</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_mail2</h4>
              {formProps.input_mail2()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_mail2")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_mail2")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Is Send Mail2</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_is_send_mail2</h4>
              {formProps.input_is_send_mail2()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_is_send_mail2")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_is_send_mail2")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Mail3</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_mail3</h4>
              {formProps.input_mail3()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_mail3")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_mail3")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Is Send Mail3</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_is_send_mail3</h4>
              {formProps.input_is_send_mail3()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_is_send_mail3")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_is_send_mail3")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Incoming Mail Format</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_incoming_mail_format</h4>
              {formProps.input_incoming_mail_format()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_incoming_mail_format")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_incoming_mail_format")),
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
              <h4>input_sex</h4>
              {formProps.input_sex()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_sex")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_sex")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Province Id</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_province_id</h4>
              {formProps.input_province_id()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_province_id")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_province_id")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Birthplace</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_birthplace</h4>
              {formProps.input_birthplace()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_birthplace")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_birthplace")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Is Smoking</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_is_smoking</h4>
              {formProps.input_is_smoking()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_is_smoking")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_is_smoking")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Blood Type</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_blood_type</h4>
              {formProps.input_blood_type()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_blood_type")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_blood_type")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Auth</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_auth</h4>
              {formProps.input_auth()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_auth")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_auth")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          
          <TestDialogCard>
            <TestDialogTitle>その他の関数</TestDialogTitle>
            <TestDialogDescription>
              <p>その他の特殊な用途の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
                    <TestDialogCard>
            <TestDialogTitle>Dir Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_dir_name</h4>
              {formProps.input_dir_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_dir_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_dir_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Contents</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_contents</h4>
              {formProps.input_contents()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_contents")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_contents")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Int Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_int_col</h4>
              {formProps.input_int_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_int_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_int_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Smallint Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_smallint_col</h4>
              {formProps.input_smallint_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_smallint_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_smallint_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Mediumint Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_mediumint_col</h4>
              {formProps.input_mediumint_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_mediumint_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_mediumint_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Decimal Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_decimal_col</h4>
              {formProps.input_decimal_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_decimal_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_decimal_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Numeric Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_numeric_col</h4>
              {formProps.input_numeric_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_numeric_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_numeric_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Float Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_float_col</h4>
              {formProps.input_float_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_float_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_float_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Double Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_double_col</h4>
              {formProps.input_double_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_double_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_double_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Char Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_char_col</h4>
              {formProps.input_char_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_char_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_char_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Varchar Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_varchar_col</h4>
              {formProps.input_varchar_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_varchar_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_varchar_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Text Col</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_text_col</h4>
              {formProps.input_text_col()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_text_col")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_text_col")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Type</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_type</h4>
              {formProps.input_type()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_type")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_type")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_name</h4>
              {formProps.input_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Comments</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_comments</h4>
              {formProps.input_comments()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_comments")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_comments")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Explan</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_explan</h4>
              {formProps.input_explan()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_explan")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_explan")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Dbms Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_dbms_name</h4>
              {formProps.input_dbms_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_dbms_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_dbms_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Project Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_project_name</h4>
              {formProps.input_project_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_project_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_project_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Db Server</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_db_server</h4>
              {formProps.input_db_server()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_db_server")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_db_server")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Db Port</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_db_port</h4>
              {formProps.input_db_port()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_db_port")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_db_port")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Db Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_db_name</h4>
              {formProps.input_db_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_db_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_db_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Db Pass</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_db_pass</h4>
              {formProps.input_db_pass()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_db_pass")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_db_pass")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Db Encoding</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_db_encoding</h4>
              {formProps.input_db_encoding()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_db_encoding")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_db_encoding")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Contexts</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_contexts</h4>
              {formProps.input_contexts()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_contexts")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_contexts")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Background Color</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_background_color</h4>
              {formProps.input_background_color()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_background_color")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_background_color")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Color</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_color</h4>
              {formProps.input_color()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_color")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_color")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Password</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_password</h4>
              {formProps.input_password()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_password")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_password")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Password Key</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_password_key</h4>
              {formProps.input_password_key()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_password_key")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_password_key")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Last Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_last_name</h4>
              {formProps.input_last_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_last_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_last_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Katakana Last Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_katakana_last_name</h4>
              {formProps.input_katakana_last_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_katakana_last_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_katakana_last_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Katakana Name</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_katakana_name</h4>
              {formProps.input_katakana_name()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_katakana_name")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_katakana_name")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Post First No</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_post_first_no</h4>
              {formProps.input_post_first_no()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_post_first_no")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_post_first_no")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Post Last No</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_post_last_no</h4>
              {formProps.input_post_last_no()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_post_last_no")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_post_last_no")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Address1</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_address1</h4>
              {formProps.input_address1()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_address1")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_address1")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Address2</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_address2</h4>
              {formProps.input_address2()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_address2")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_address2")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Address3</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_address3</h4>
              {formProps.input_address3()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_address3")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_address3")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Nearest Station</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_nearest_station</h4>
              {formProps.input_nearest_station()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_nearest_station")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_nearest_station")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Nationality</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_nationality</h4>
              {formProps.input_nationality()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_nationality")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_nationality")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Official Position</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_official_position</h4>
              {formProps.input_official_position()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_official_position")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_official_position")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Department</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_department</h4>
              {formProps.input_department()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_department")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_department")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Organization</TestDialogTitle>
            <TestDialogDescription>
              <h4>input_organization</h4>
              {formProps.input_organization()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("input_organization")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("input_organization")),
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
