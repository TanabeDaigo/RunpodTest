"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { radioExample, radioTest1, radioTest2, radioTest3, radioTest4, radioTest5, radioTest6, radioTest7, radioTest8, radioTest9 } from "./examples";

const { useWebAppContext } = providers;
const log = new logjs("TestRadio");

export default function Page() {
  const initState = {
    test1: "male",
    test2: "male",
    test3: "male",
    test4: "male",
    test5: "male",
    test6: "male",
    test7: "male",
    test8: "male",
    test9: "male",
  };
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest(initState, state, actions);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Radio</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Radioの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioExample)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test1", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                after_func: (form) => {
                  console.log("選択された性別:", form.test1);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース2 - 無効化されたRadio</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test2", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                disabled: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test2);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース3 - エラー状態のRadio</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test3", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                error: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test3);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース4 - カスタムスタイルのRadio</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test4", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                sx: {
                  color: "primary.main",
                  "& .MuiFormControlLabel-label": {
                    fontWeight: "bold",
                  },
                },
                after_func: (form) => {
                  console.log("選択された性別:", form.test4);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース5 - 縦並びのRadio</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test5", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                row: false,
                after_func: (form) => {
                  console.log("選択された性別:", form.test5);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース6 - 複数行のラベル</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test6", {
                label: "性別",
                options: [
                  { value: "male", label: "男性（Male）" },
                  { value: "female", label: "女性（Female）" },
                ],
                after_func: (form) => {
                  console.log("選択された性別:", form.test6);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース7 - デバッグモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test7", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                is_debug: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test7);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース8 - denseモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test8", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                dense: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test8);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース9 - ラベルなしのRadio</TestDialogTitle>
            <TestDialogDescription>
              {formProps.radio("test9", {
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                after_func: (form) => {
                  console.log("選択された性別:", form.test9);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{radioTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(radioTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}
