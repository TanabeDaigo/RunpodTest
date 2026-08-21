"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  datePickerFromToExample,
  datePickerFromToTest1,
  datePickerFromToTest2,
  datePickerFromToTest3,
  datePickerFromToTest4,
  datePickerFromToTest5,
  datePickerFromToTest6,
  datePickerFromToTest7,
  datePickerFromToTest8,
  datePickerFromToTest9,
  datePickerFromToTest10,
  datePickerFromToTest11,
  datePickerFromToTest12,
  datePickerFromToTest13,
  datePickerFromToTest14,
} from "./examples";

const { useWebAppContext } = providers;

const log = new logjs("TestDatePickerFromTo");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test DatePickerFromTo</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト1 - 通常の日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test1", 
                {
                  label: "通常の日付選択フィールド",
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "通常の日付選択フィールド",
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト2 - ラベルなしの日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test2", 
                {
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト3 - 必須日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test3", 
                {
                  label: "必須日付選択フィールド",
                  required: true,
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "必須日付選択フィールド",
                  required: true,
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト4 -無効化日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test4", 
                {
                  label: "無効化日付選択フィールド",
                  disabled: true,
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "無効化日付選択フィールド",
                  // disabled: true,
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト5 - カラー指定日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test5", 
                {
                  label: "カラー指定日付選択フィールド",
                  color: "secondary",
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "カラー指定日付選択フィールド",
                  color: "secondary",
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト6 - 年と月のみ選択可能な日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test6", 
                {
                  label: "年と月のみ選択可能な日付選択フィールド",
                  views: ["year", "month"],
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "年と月のみ選択可能な日付選択フィールド",
                  views: ["year", "month"],
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト7 - エラー表示付き日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test7", 
                {
                  label: "エラー表示付き日付選択フィールド",
                  error: true,
                  helperText: "エラーメッセージが表示されます",
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "エラー表示付き日付選択フィールド",
                  error: true,
                  helperText: "エラーメッセージが表示されます",
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト8 - カスタムフォーマット日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test8", 
                {
                  label: "カスタムフォーマット日付選択フィールド",
                  format: "yyyy年MM月dd日",
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "カスタムフォーマット日付選択フィールド",
                  format: "yyyy年MM月dd日",
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト9 - 未来の日付を無効化した日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test9", 
                {
                  label: "未来の日付を無効化した日付選択フィールド",
                  disableFuture: true,
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "未来の日付を無効化した日付選択フィールド",
                  disableFuture: true,
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト10 - 過去の日付を無効化した日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test10", 
                {
                  label: "過去の日付を無効化した日付選択フィールド",
                  disablePast: true,
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "過去の日付を無効化した日付選択フィールド",
                  disablePast: true,
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト11 - デフォルト値のある日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test11", 
                {
                  label: "デフォルト値（YYYY/MM/DD）",
                  value: "2025/01/01",
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "デフォルト値（YYYY/MM/DD）",
                  value: "2025/01/01",
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest11}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest11)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト12 - カスタムフォーマットデフォルト値のある日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test12", 
                {
                  label: "カスタムフォーマットデフォルト値（YYYY-MM-DD）",
                  format: "yyyy-MM-dd",
                  value: "2024/01/01",
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "カスタムフォーマットデフォルト値（YYYY-MM-DD）",
                  format: "yyyy-MM-dd",
                  value: "2024/01/01",
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest12}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest12)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト13 - 展開中に操作可能な日付選択フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.datePickerFromTo("test13", 
                {
                  label: "展開中に操作可能な日付選択フィールド",
                  onChange: (date) => {
                    console.log("From 選択された日付:", date);
                  },
                },
                {
                  label: "展開中に操作可能な日付選択フィールド",
                  onChange: (date) => {
                    console.log("To 選択された日付:", date);
                  },
                },
                {
                  isAnchorEl:true,
                }
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{datePickerFromToTest13}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(datePickerFromToTest13)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>DatePickerFromToテスト14 - スイッチで操作可能な日付選択フィールド</TestDialogTitle>
              <TestDialogDescription>
                {formProps.datePickerFromTo("test14", 
                  {
                    label: "スイッチで操作可能な日付選択フィールド",
                    onChange: (date) => {
                      console.log("From 選択された日付:", date);
                    },
                  },
                  {
                    label: "スイッチで操作可能な日付選択フィールド",
                    onChange: (date) => {
                      console.log("To 選択された日付:", date);
                    },
                  },
                  {
                    unspcified: {
                      show: true,
                      default: true,
                    },
                    onChange: (unspcifiedChecked) => {
                      console.log("DatePicker Props:", {
                        unspcifiedChecked,
                      });
                    },
                  }
                )}
              </TestDialogDescription>
              <TestDialogDescription>
                <div style={{ marginBottom: "1rem" }}>
                  <CodeBlock>{datePickerFromToTest14}</CodeBlock>
                </div>
                <ButtonContainer>{formProps.copyButton(datePickerFromToTest14)}</ButtonContainer>
              </TestDialogDescription>
            </TestDialogCard>
          </TestDialogGrid>
        </div>
      </div>
    );
  }

export default Page;
