/**
 * Snackbarの使用例
 */

// 基本的なSnackbar表示
export const basicSnackbarExample = `// 基本的なSnackbar表示
const { actions } = useWebAppContext();

// 成功メッセージ
actions.showSuccess("操作が正常に完了しました");

// エラーメッセージ
actions.showError("エラーが発生しました");

// 警告メッセージ
actions.showWarning("この操作は取り消せません");

// 情報メッセージ
actions.showInfo("システムが更新されました");`;

// カスタム表示時間の設定
export const customDurationExample = `// カスタム表示時間の設定
const { actions } = useWebAppContext();

// 1秒間表示
actions.showSnackbar("このメッセージは5秒間表示されます", {
  autoHideDuration: 1000
});`;

// 複数のSnackbar表示
export const multipleSnackbarExample = `// 複数のSnackbar表示
const { actions } = useWebAppContext();

// 順番に表示
actions.showSuccess("最初のメッセージ");
setTimeout(() => {
  actions.showInfo("2番目のメッセージ");
}, 1000);
setTimeout(() => {
  actions.showWarning("3番目のメッセージ");
}, 2000);`;

// HTMLメッセージの表示
export const htmlMessageExample = `// HTMLメッセージの表示
const { actions } = useWebAppContext();

// HTMLを含むメッセージ
actions.showSnackbar(
  <div>
    <strong>重要なお知らせ</strong>
    <p>システムが更新されました。<br/>詳細は<a href="#">こちら</a>をご覧ください。</p>
  </div>,
  {
    autoHideDuration: 5000
  }
);`;
