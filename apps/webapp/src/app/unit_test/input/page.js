"use client";

import React, { useContext } from "react";
import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  inputExample,
  inputTest1,
  inputTest2,
  inputTest3,
  inputTest4,
  inputTest5,
  inputTest6,
  inputTest7,
  inputTest8,
  inputTest9,
  inputTest10,
  inputTest11,
  inputTest12,
  inputTest13,
  inputTest14,
  inputTest15,
  inputTest16,
  inputTest17,
  inputTest18,
  inputTest19,
  inputTest20,
  inputTest21,
  inputTest22,
} from "./examples";
import { textAlign } from "@mui/system";

const { useWebAppContext } = providers;
const log = new logjs("TestInput");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};

  const [form, formProps] = useUnitTest({}, state, actions);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Input</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Inputの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト1 - 通常のテキスト入力</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test1", {
                label: "送料", isNumberOnly: true, isMinus: true, maxlength: 10, is_standard: true,
              })}
              {formProps.input("test12", {
                label: "送料", isNumberOnly: true, isMinus: true, maxlength: 10, is_standard: true,
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト2 - 必須入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test2", {
                label: "必須入力フィールド",
                placeholder: "必須項目を入力してください",
                required: true,
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest2)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト3 - エラー表示付きフィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test3", {
                label: "エラー表示付きフィールド",
                placeholder: "エラーが表示されます",
                error: true,
                helperText: "エラーメッセージが表示されます",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest3}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest3)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト4 - 無効化フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test4", {
                label: "無効化フィールド",
                placeholder: "入力できません",
                disabled: true,
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest4}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest4)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト5 - パスワードフィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test5", {
                label: "パスワード",
                placeholder: "パスワードを入力",
                type: "password",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest5}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest5)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト6 - 数値入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test6", {
                label: "数値入力",
                placeholder: "数値を入力",
                type: "number",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest6}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest6)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト7 - メールアドレス入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test7", {
                label: "メールアドレス",
                placeholder: "メールアドレスを入力",
                type: "email",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest7}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest7)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト8 - マルチライン入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test8", {
                label: "マルチライン入力",
                placeholder: "複数行のテキストを入力",
                multiline: true,
                rows: 4,
                is_standard :true,
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest8}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest8)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト9 - 最大文字数制限付きフィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test9", {
                label: "最大文字数制限",
                placeholder: "最大10文字まで入力可能",
                maxlength: 10,
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest9}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest9)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト10 - サイズ指定フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test10", {
                label: "小さいサイズ",
                placeholder: "小さいサイズの入力フィールド",
                size: "small",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest10}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest10)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト11 - カラー指定フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test11", {
                label: "カラー指定",
                placeholder: "カラー指定の入力フィールド",
                color: "primary",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest11}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest11)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト12 - ログインID入力フィールド</TestDialogTitle>
            <TestDialogDescription>{formProps.input_login_id()}</TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest12}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest12)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト13 - パスワード入力フィールド</TestDialogTitle>
            <TestDialogDescription>{formProps.input_password()}</TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest13}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest13)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト14 - style指定の入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test14", {
                label: "カスタムスタイル",
                placeholder: "カスタムスタイルの入力フィールド",
                style: {
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #ddd",
                  fontSize: "16px",
                  "&:focus": {
                    borderColor: "#4CAF50",
                    boxShadow: "0 0 5px rgba(76, 175, 80, 0.3)",
                  },
                },
                after_func: (_f) => {
                  log.info(`入力値: ${_f.test14}`);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest14}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest14)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>Inputテスト15 - sx指定の入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test15", {
                label: "テーマ対応スタイル",
                placeholder: "テーマ対応スタイルの入力フィールド",
                sx: {
                  backgroundColor: "background.paper",
                  color: "text.primary",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid",
                  borderColor: "divider",
                  fontSize: "16px",
                  "&:focus": {
                    borderColor: "primary.main",
                    boxShadow: (theme) => `0 0 5px ${theme.palette.primary.main}30`,
                  },
                  "&:hover": {
                    borderColor: "primary.light",
                  },
                },
                after_func: (_f) => {
                  log.info(`入力値: ${_f.test15}`);
                },
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest15}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest15)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>Inputテスト16 - 半角数字入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test16", {
                label: "半角数字",
                isNumberOnly:true,
                placeholder: "半角数字の入力フィールド",
                color: "primary",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest16}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest16)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>Inputテスト17 - マイナス記号含む半角数字入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test17", {
                label: "マイナス記号含む半角数字",
                isMinus: true,
                placeholder: "マイナス記号含む半角数字の入力フィールド",
                color: "primary",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest17}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest17)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>Inputテスト18 - "半角アルファベット入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test18", {
                label: "半角アルファベット",
                isAlphabet: true,
                placeholder: "半角アルファベットの入力フィールド",
                color: "primary",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest18}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest18)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>Inputテスト19 - 半角英数字入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test19", {
                label: "半角英数字",
                isNumAndAlpha: true,
                placeholder: "半角英数字の入力フィールド",
                color: "primary",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest19}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest19)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>Inputテスト20 - メールアドレス形式入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test20", {
                label: "メールアドレス形式",
                isMailAddress: true,
                placeholder: "メールアドレス形式の入力フィールド",
                color: "primary",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest20}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest20)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>Inputテスト21 - IPアドレス形式入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test21", {
                label: "IPアドレス形式",
                isIpAddress: true,
                placeholder: "IPアドレス形式の入力フィールド",
                color: "primary",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest21}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest21)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>Inputテスト22 - textAlign指定の入力フィールド</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("test22", {
                label: "中央テキスト入力",
                placeholder: "テキストを入力してください",
                textAlign:"center",
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{inputTest22}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(inputTest22)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
