"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  iconMenuExample,
  iconMenuTest1,
  iconMenuTest2,
  iconMenuTest3,
  iconMenuTest4,
  iconMenuTest5,
  iconMenuTest6,
  iconMenuTest7,
  iconMenuTest8,
  iconMenuTest9,
  iconMenuTest10,
} from "./examples";

const log = new logjs("TestIconMenu");

import { providers } from "@lib/client";
const { useWebAppContext } = providers;

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};

  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test IconMenu</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>IconMenuの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>
          

          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト1 - 通常のアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test1", {
                options: [
                  {value: "Select1"},
                  {value: "Select2"},
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました : ", form.test1);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト2 - 無効化されたのアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test2", {
                disabled: true,
                options: [
                  {value: "Select1"},
                  {value: "Select2"},
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test2);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト3 - カラー指定のアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test3", {
                color: "primary",
                options: [
                  {value: "Select1"},
                  {value: "Select2"},
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test3);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト4 - サイズ指定のアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test4", {
                fontSize: "large",
                options: [
                  {value: "Select1"},
                  {value: "Select2"},
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test4);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト5 - ツールチップのテキストのアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test5", {
                tooltip:"This is IconMenu",
                options: [
                  {value: "Select1"},
                  {value: "Select2"},
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test5);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト6 - 表示無効化のアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test6", {
                show: false,
                options: [
                  {value: "Select1"},
                  {value: "Select2"},
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test6);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト7 - スタイルが適応されたアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test7", {
                options: [
                  {value: "Select1"},
                  {value: "Select2"},
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test7);
                },
                sx: { backgroundColor: 'lightblue' },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト8 - 選択不可の選択肢があるアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test8", {
                options: [
                  {value: "Select1", disabled: false},
                  {value: "Select2", disabled: true},
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test8);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト9 - 選択肢ごとにイベントがあるアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test9", {
                options: [
                  {
                    value: "Google",
                    onClick: () => window.open("https://www.google.com", "_blank"),
                  },
                  {
                    value: "YouTube",
                    onClick: () => window.open("https://www.youtube.com", "_blank"),
                  },
                  {
                    value: "共通の処理",
                  },
                ],
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test9);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>IconMenuテスト10 - ポップ先が変更されているアイコンメニュー</TestDialogTitle>
            <TestDialogDescription>
              {formProps.iconMenu("test10", {
                options: [
                  {value: "Select1"},
                  {value: "Select2"},
                ],
                anchorOrigin:{
                  vertical: "top",
                  horizontal: "right",
                },
                transformOrigin:{
                  vertical: "bottom",
                  horizontal: "right",
                },
                after_func: (form) => {
                  console.log("アイコンメニューがクリックされました", form.test10);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{iconMenuTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(iconMenuTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
