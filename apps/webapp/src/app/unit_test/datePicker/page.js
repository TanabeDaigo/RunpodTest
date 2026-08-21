"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  datePickerExample,
  datePickerTest1,
  datePickerTest2,
  datePickerTest3,
  datePickerTest4,
  datePickerTest5,
  datePickerTest6,
  datePickerTest7,
  datePickerTest8,
  datePickerTest9,
  datePickerTest10,
  datePickerTest11,
  datePickerTest12,
  datePickerTest13,
  datePickerTest14,
  datePickerTest15,
  datePickerTest16,
  datePickerTest17,
  datePickerTest18,
  datePickerTest19,
  datePickerTest20,
  datePickerTest21,
  datePickerTest22,
  datePickerTest23,
} from "./examples";

const { useWebAppContext } = providers;

const log = new logjs("TestDatePicker");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test DatePicker</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>DatePickerの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト1 - 通常の日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test1", {
                label: "通常の日付選択フィールド",
    autoComplete: "on",
    is_standard:true,
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト2 - 必須日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test2", {
                label: "必須日付選択フィールド",
                required: true,
    is_standard:true,
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト3 - 無効化日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test3", {
                label: "無効化日付選択フィールド",
                disabled: true,
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト4 - カラー指定日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test4", {
                label: "カラー指定日付選択フィールド",
                color: "secondary",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト5 - サイズ指定日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test5", {
                label: "サイズ指定日付選択フィールド",
                size: "large",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト6 - エラー表示付き日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test6", {
                label: "エラー表示付き日付選択フィールド",
                error: true,
                helperText: "エラーメッセージが表示されます",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト7 - カスタムスタイル日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test7", {
                label: "カスタムスタイル日付選択フィールド",
                style: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4CAF50",
                    },
                  },
                },
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト8 - テーマ対応スタイル日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test8", {
                label: "テーマ対応スタイル日付選択フィールド",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                },
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト9 - カスタムフォーマット日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test9", {
                label: "カスタムフォーマット日付選択フィールド",
                format: "yyyy年MM月dd日",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト10 - 年と月のみ選択可能な日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test10", {
                label: "年と月のみ選択可能な日付選択フィールド",
                views: ["year", "month"],
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト11 - 未来の日付を無効化した日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test11", {
                label: "未来の日付を無効化した日付選択フィールド",
                disableFuture: true,
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest11}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest11)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト12 - 過去の日付を無効化した日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test12", {
                label: "過去の日付を無効化した日付選択フィールド",
                disablePast: true,
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest12}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest12)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト13 - コンパクトな日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test13", {
                label: "コンパクトな日付選択フィールド",
                fullWidth: true,
                dense: true,
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest13}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest13)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト14 - デフォルト値設定済み日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test14", {
                label: "デフォルト値設定済み日付選択フィールド",
                defaultValue: new Date(2024, 0, 1), // 2024年1月1日
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest14}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest14)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト15 - 文字列形式のデフォルト値（YYYY/MM/DD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test15", {
                label: "文字列形式のデフォルト値（YYYY/MM/DD）",
                defaultValue: "2024/01/01",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest15}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest15)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト16 - 文字列形式のデフォルト値（YYYY-MM-DD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test16", {
                label: "文字列形式のデフォルト値（YYYY-MM-DD）",
                defaultValue: "2024-01-01",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest16}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest16)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト17 - 文字列形式のデフォルト値（YYYYMMDD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test17", {
                label: "文字列形式のデフォルト値（YYYYMMDD）",
                defaultValue: "20240101",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest17}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest17)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト18 - 文字列形式の値（YYYY/MM/DD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test18", {
                label: "文字列形式の値（YYYY/MM/DD）",
                value: "2024/01/01",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest18}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest18)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト19 - 文字列形式の値（YYYY-MM-DD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test19", {
                label: "文字列形式の値（YYYY-MM-DD）",
                value: "2024-01-01",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest19}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest19)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト20 - 文字列形式の値（YYYYMMDD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test20", {
                label: "文字列形式の値（YYYYMMDD）",
                value: "20240101",
                onChange: (date) => {
                  console.log("選択された日付:", date);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest20}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest20)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト21 - 出力形式指定（YYYY/MM/DD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test21", {
                label: "出力形式指定（YYYY/MM/DD）",
                outputFormat: "YYYY/MM/DD",
                onChange: (date) => {
                  console.log("選択された日付:", date); // 2024/01/01形式で出力
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest21}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest21)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト22 - 出力形式指定（YYYY-MM-DD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test22", {
                label: "出力形式指定（YYYY-MM-DD）",
                outputFormat: "YYYY-MM-DD",
                onChange: (date) => {
                  console.log("選択された日付:", date); // 2024-01-01形式で出力
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest22}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest22)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerテスト23 - 出力形式指定（YYYYMMDD）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePicker("test23", {
                label: "出力形式指定（YYYYMMDD）",
                outputFormat: "YYYYMMDD",
                onChange: (date) => {
                  console.log("選択された日付:", date); // 20240101形式で出力
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerTest23}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerTest23)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
