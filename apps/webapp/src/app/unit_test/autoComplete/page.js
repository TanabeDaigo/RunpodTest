"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  autoCompleteExample,
  autoCompleteTest1,
  autoCompleteTest2,
  autoCompleteTest3,
  autoCompleteTest4,
  autoCompleteTest5,
  autoCompleteTest6,
  autoCompleteTest7,
  autoCompleteTest8,
  autoCompleteTest9,
  autoCompleteTest10,
  autoCompleteTest11,
  autoCompleteTest12,
} from "./examples";

const log = new logjs("TestAutoComplete");

const { useWebAppContext } = providers;

// ページレンダリング
export default function Page() {
  // コンテキストの使用
  const webAppContext = useWebAppContext();
  const { state, actions, params } = webAppContext || {};

  const initState = {
    test1: "",
    test2: "",
    test3: "",
    test4: "",
    test5: "",
    test6: "",
    test7: "",
    test8: "",
    test9: "",
    test10: "",
    test11: "",
    test12: "",
  };
  const [form, formProps] = useUnitTest(initState, state, actions);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test AutoComplete</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>AutoCompleteの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteExample)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test1", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test1);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース2 - 無効化されたAutoComplete</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test2", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                disabled: true,
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test2);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース3 - エラー状態のAutoComplete</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test3", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                error: true,
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test3);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース4 - カスタムスタイルのAutoComplete</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test4", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                sx: {
                  color: "primary.main",
                  "& .MuiInputBase-input": {
                    fontWeight: "bold",
                  },
                },
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test4);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース5 - 非同期オプション</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test5", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                filterOptions: (options, { inputValue }) => {
                  return options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース6 - 複数行のラベル</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test6", {
                label: "都道府県（Prefecture）",
                options: [
                  { value: "tokyo", label: "東京都（Tokyo）" },
                  { value: "osaka", label: "大阪府（Osaka）" },
                  { value: "kyoto", label: "京都府（Kyoto）" },
                  { value: "hokkaido", label: "北海道（Hokkaido）" },
                ],
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test6);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース7 - デバッグモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test7", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                is_debug: true,
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test7);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース8 - 通常サイズモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test8", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                dense: false,
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test8);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース9 - ラベルなしのAutoComplete</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test9", {
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test9);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース10 - カラー設定</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test10", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                color: "secondary",
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test10);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース11 - フルワイドモード</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test11", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                fullWidth: true,
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test11);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest11}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest11)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース12 - デフォルトサイズ（dense: true）</TestDialogTitle>
            <TestDialogDescription>
              {formProps.autoComplete("test12", {
                label: "都道府県",
                options: [
                  { value: "tokyo", label: "東京都" },
                  { value: "osaka", label: "大阪府" },
                  { value: "kyoto", label: "京都府" },
                  { value: "hokkaido", label: "北海道" },
                ],
                after_func: (form) => {
                  console.log("選択された都道府県:", form.test12);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{autoCompleteTest12}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(autoCompleteTest12)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}
