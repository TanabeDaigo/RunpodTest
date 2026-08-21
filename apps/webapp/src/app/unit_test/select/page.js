"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
const { useWebAppContext } = providers;
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  selectExample,
  selectTest1,
  selectTest2,
  selectTest3,
  selectTest4,
  selectTest5,
  selectTest6,
  selectTest7,
  selectTest8,
  selectTest9,
  selectTest10,
  selectTest11,
  selectTest12,
  selectTest13,
  selectTest14,
  selectTest15,
  selectTest16,
  selectTest17,
} from "./examples";

const log = new logjs("TestSelect");

export default function Page() {
  const initState = {
    test1: "male",
    test2: "male",
    test3: "male",
    test4: "male",
    test5: ["male"],
    test6: "male",
    test7: "male",
    test8: "male",
    test9: "male",
    test10: "male",
    test11: "male",
    test12: "male",
    test13: "male",
    test14: "male",
    test15: "male",
    test16: "male",
    test17: "male",
  };
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest(initState, state, actions);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Select</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Selectの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectExample)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test1", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test1);
                },
              },true)}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース2 - 無効化されたSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test2", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                disabled: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test2);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース3 - エラー状態のSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test3", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                error: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test3);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース4 - カスタムスタイルのSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test4", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                sx: {
                  color: "primary.main",
                  "& .MuiSelect-select": {
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
                <CodeBlock>{selectTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース5 - 複数選択のSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test5", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                multiple: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test5);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース6 - 複数行のラベル</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test6", {
                label: "性別（Gender）",
                options: [
                  { value: "male", label: "男性（Male）" },
                  { value: "female", label: "女性（Female）" },
                ],
                fullwidth: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test6);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース7 - デバッグモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test7", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                is_debug: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test7);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース8 - denseモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test8", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                dense: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test8);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース9 - ラベルなしのSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test9", {
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test9);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース10 - size: largeのSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test10", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                size: "large",
                after_func: (form) => {
                  console.log("選択された性別:", form.test10);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース11 - size: largeかつdense: trueのSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test11", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                size: "large",
                dense: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test11);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest11}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest11)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース12 - color: primaryのSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test12", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                color: "primary",
                after_func: (form) => {
                  console.log("選択された性別:", form.test12);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest12}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest12)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース13 - color: secondaryのSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test13", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                color: "secondary",
                after_func: (form) => {
                  console.log("選択された性別:", form.test13);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest13}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest13)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース14 - color: errorのSelect</TestDialogTitle>
            <TestDialogDescription>
              {formProps.select("test14", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                color: "error",
                after_func: (form) => {
                  console.log("選択された性別:", form.test14);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectTest14}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectTest14)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}
