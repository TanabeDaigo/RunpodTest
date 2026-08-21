"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { popperExample, popperTest1, } from "./examples";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const { useWebAppContext } = providers;
const log = new logjs("TestButton");

// ページレンダリング
function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions); // 単体テストフォーム

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test popper</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Popperの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{popperExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>popperテスト1 - 通常のボタン</TestDialogTitle>
            <TestDialogDescription>
              {formProps.popper("help_info", {
                value: "ここに Popper の内容",
                children: <button>Popper を表示</button>,
              })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{popperTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(popperTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>


          <TestDialogCard>

          <TestDialogTitle>popperテスト - テキスト拡大</TestDialogTitle>
          <TestDialogDescription>
            {formProps.popper("text_preview", {
              value: ({ onClose }) => (
                <div style={{ position: "relative", padding: "8px" }}>
                  {/* × ボタン */}
                  <button
                    onClick={onClose}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      border: "none",
                      background: "transparent",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    >
                    ×
                  </button>

                  <div style={{ paddingRight: "20px" }}>
                    ここに拡大表示されるテキストです。  
                    改行も  
                    問題なく  
                    表示されるか確認できます。
                  </div>
                </div>
              ),
              children: <button>テキストを表示</button>,
            })}
          </TestDialogDescription>
          <TestDialogDescription>
            <div style={{ marginBottom: "1rem" }}>
              <CodeBlock>{popperTest1}</CodeBlock>
            </div>
            <ButtonContainer>{formProps.copyButton(popperTest1)}</ButtonContainer>
          </TestDialogDescription>
          </TestDialogCard>

        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
