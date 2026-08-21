"use client";

import React from "react";
import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
const { useWebAppContext } = providers;
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  switchExample,
  switchTest1,
  switchTest2,
  switchTest3,
  switchTest4,
  switchTest5,
  switchTest6,
  switchTest7,
  switchTest8,
  switchTest9,
} from "./examples";

const log = new logjs("TestSwitch");

export default function Page() {
  const initState = {};
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest(initState, state, actions);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Switch</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Switchの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchExample)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース</TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test1", {
                after_func: (form) => {
                  console.log("スイッチの状態:", form.test1);
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース2 - 無効化されたSwitch </TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test2", {
                disabled: true,
                after_func: (form) => {
                  console.log("スイッチの状態:", form.test2);
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース3 - カスタムカラーのSwitch </TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test3", {
                color: "secondary",
                after_func: (form) => {
                  console.log("スイッチの状態:", form.test3);
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース4 - カスタムサイズのSwitch </TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test4", {
                size: "small",
                after_func: (form) => {
                  console.log("スイッチの状態:", form.test4);
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース5 - チェック済みのSwitch ※トグル可 </TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test5", {
                defaultChecked: true,
                after_func: (form) => {
                  console.log("スイッチの状態:", form.test5);
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース6 - チェック済みのSwitch ※トグル不可</TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test6", {
                checked: true,
                after_func: (form) => {
                  console.log("スイッチの状態は変わりません");
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース7 - Rippleエフェクト無効化のSwitch </TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test7", {
                disableRipple: true,
                after_func: (form) => {
                  console.log("スイッチの状態:", form.test7);
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース8 - ラベル付きのSwitch </TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test8", {
                label: "ラベル付きスイッチ",
                after_func: (form) => {
                  console.log("スイッチの状態:", form.test8);
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース9 - カスタムラベル付きのSwitch </TestDialogTitle>
            <TestDialogDescription>
              {formProps.toggleSwitch("test9", {
                label: "カスタムラベル付きスイッチ",
                labelPlacement:"bottom",
                sx:{color:"red"},
                after_func: (form) => {
                  console.log("スイッチの状態:", form.test9);
                }
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}
