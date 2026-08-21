"use client";

import { providers, logjs } from "@lib/client";

const { useWebAppContext } = providers;

import { Button } from "@mui/material";
import { basicSnackbarExample, customDurationExample, multipleSnackbarExample, htmlMessageExample } from "./examples";
import { TestDialogCard, TestDialogDescription, TestDialogTitle, CodeBlock, TestDialogHeader, TestDialogMainTitle, TestDialogGrid, ButtonContainer } from "../styles";

const log = new logjs("TestSnackbar");

export default function SnackbarPage() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);

  const handleShowSuccess = () => {
    actions.showSuccess("操作が正常に完了しました");
  };

  const handleShowError = () => {
    actions.showError("エラーが発生しました");
  };

  const handleShowWarning = () => {
    actions.showWarning("この操作は取り消せません");
  };

  const handleShowInfo = () => {
    actions.showInfo("システムが更新されました");
  };

  const handleShowCustomDuration = () => {
    actions.showSnackbar("このメッセージは1秒間表示されます", {
      autoHideDuration: 1000,
    });
  };

  const handleShowMultiple = () => {
    actions.showSuccess("最初のメッセージ");
    setTimeout(() => {
      actions.showInfo("2番目のメッセージ");
    }, 1000);
    setTimeout(() => {
      actions.showWarning("3番目のメッセージ");
    }, 2000);
  };

  const handleShowHtmlMessage = () => {
    actions.showSnackbar(
      <div>
        <strong>重要なお知らせ</strong>
        <p>
          システムが更新されました。
          <br />
          詳細は<a href="#">こちら</a>をご覧ください。
        </p>
      </div>,
      {
        autoHideDuration: 5000,
      }
    );
  };

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Snackbar テスト</TestDialogMainTitle>
      </TestDialogHeader>
      <TestDialogGrid>
        <TestDialogCard>
          <TestDialogTitle>基本的なSnackbar表示</TestDialogTitle>
          <TestDialogDescription>
            <CodeBlock>{basicSnackbarExample}</CodeBlock>
          </TestDialogDescription>
          <ButtonContainer>
            <Button variant="contained" color="success" onClick={handleShowSuccess}>
              成功メッセージ
            </Button>
            <Button variant="contained" color="error" onClick={handleShowError}>
              エラーメッセージ
            </Button>
            <Button variant="contained" color="warning" onClick={handleShowWarning}>
              警告メッセージ
            </Button>
            <Button variant="contained" color="info" onClick={handleShowInfo}>
              情報メッセージ
            </Button>
          </ButtonContainer>
        </TestDialogCard>

        <TestDialogCard>
          <TestDialogTitle>カスタム表示時間の設定</TestDialogTitle>
          <TestDialogDescription>
            <CodeBlock>{customDurationExample}</CodeBlock>
          </TestDialogDescription>
          <ButtonContainer>
            <Button variant="contained" onClick={handleShowCustomDuration}>
              1秒間表示するメッセージ
            </Button>
          </ButtonContainer>
        </TestDialogCard>

        <TestDialogCard>
          <TestDialogTitle>複数のSnackbar表示</TestDialogTitle>
          <TestDialogDescription>
            <CodeBlock>{multipleSnackbarExample}</CodeBlock>
          </TestDialogDescription>
          <ButtonContainer>
            <Button variant="contained" onClick={handleShowMultiple}>
              複数のメッセージを表示
            </Button>
          </ButtonContainer>
        </TestDialogCard>

        <TestDialogCard>
          <TestDialogTitle>HTMLメッセージの表示</TestDialogTitle>
          <TestDialogDescription>
            <CodeBlock>{htmlMessageExample}</CodeBlock>
          </TestDialogDescription>
          <ButtonContainer>
            <Button variant="contained" onClick={handleShowHtmlMessage}>
              HTMLメッセージを表示
            </Button>
          </ButtonContainer>
        </TestDialogCard>
      </TestDialogGrid>
    </div>
  );
}
