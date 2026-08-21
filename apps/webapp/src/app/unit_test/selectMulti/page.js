"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
const { useWebAppContext } = providers;
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  selectMultiExample,
  selectMultiTest1,
  selectMultiTest2,
  selectMultiTest3,
  selectMultiTest4,
  selectMultiTest5,
  selectMultiTest6,
  selectMultiTest7,
  selectMultiTest8,
  selectMultiTest9,
  selectMultiTest10,
  selectMultiTest11,
  selectMultiTest12,
  selectMultiTest13,
  selectMultiTest14,
  selectMultiTest15,
  selectMultiTest16,
  selectMultiTest17,
} from "./examples";

const log = new logjs("TestSelectMulti");

export default function Page() {
  const initState = {
    test1: ["male"],
    test2: ["male"],
    test3: ["male"],
    test4: ["male"],
    test5: ["male"],
    test6: ["male"],
    test7: ["male"],
    test8: ["male"],
    test9: ["male"],
    test10: ["male"],
    test11: ["male"],
    test12: ["male"],
    test13: ["male"],
    test14: ["male"],
    test15: ["male"],
    test16: ["male"],
    test17: ["male"],
  };
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest(initState, state, actions);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test SelectMulti</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>SelectMultiの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiExample)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti(
                "test1",
                {
                  label: "性別",
                  options: [
                    { value: "male", label: "男性" },
                    { value: "female", label: "女性" },
                  ],
                  fullwidth: true,
                  after_func: (form) => {
                    console.log("選択された性別:", form.test1);
                  },
                },
                true
              )}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース2 - 無効化されたSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test2", {
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
                <CodeBlock>{selectMultiTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース3 - エラー状態のSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test3", {
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
                <CodeBlock>{selectMultiTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース4 - カスタムスタイルのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test4", {
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
                <CodeBlock>{selectMultiTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース5 - 複数行のラベル</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test5", {
                label: "性別（Gender）",
                options: [
                  { value: "male", label: "男性（Male）" },
                  { value: "female", label: "女性（Female）" },
                ],
                fullwidth: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test5);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース6 - デバッグモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test6", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                is_debug: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test6);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース7 - denseモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test7", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                dense: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test7);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース8 - ラベルなしのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test8", {
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test8);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース9 - size: largeのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test9", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                size: "large",
                after_func: (form) => {
                  console.log("選択された性別:", form.test9);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース10 - size: largeかつdense: trueのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test10", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                size: "large",
                dense: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test10);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース11 - color: primaryのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test11", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                color: "primary",
                after_func: (form) => {
                  console.log("選択された性別:", form.test11);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest11}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest11)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース12 - color: secondaryのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test12", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                color: "secondary",
                after_func: (form) => {
                  console.log("選択された性別:", form.test12);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest12}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest12)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース13 - color: errorのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test13", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                color: "error",
                after_func: (form) => {
                  console.log("選択された性別:", form.test13);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest13}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest13)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース14 - variant: standardのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test14", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                variant: "standard",
                after_func: (form) => {
                  console.log("選択された性別:", form.test14);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest14}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest14)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース15 - variant: outlinedのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test15", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                variant: "outlined",
                after_func: (form) => {
                  console.log("選択された性別:", form.test15);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest15}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest15)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース16 - variant: filledのSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test16", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                ],
                fullwidth: true,
                variant: "filled",
                after_func: (form) => {
                  console.log("選択された性別:", form.test16);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest16}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest16)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース17 - 全選択機能のSelectMulti</TestDialogTitle>
            <TestDialogDescription>
              {formProps.selectMulti("test17", {
                label: "性別",
                options: [
                  { value: "male", label: "男性" },
                  { value: "female", label: "女性" },
                  { value: "other", label: "その他" },
                ],

                selectAll: true,
                fullwidth: true,
                after_func: (form) => {
                  console.log("選択された性別:", form.test17);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{selectMultiTest17}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(selectMultiTest17)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}
