// 基本的な確認ダイアログの使用例
export const confirmExample = `// 基本的な確認ダイアログの使用例
actions.confirm("確認", "この操作を実行してもよろしいですか？", () => {
  // OKボタンが押された時の処理
  console.log("確認ダイアログでOKが押されました");
});`;

// テストケース1: 基本的な確認ダイアログ
export const confirmTest1 = `// 基本的な確認ダイアログを表示
actions.confirm("確認", "この操作を実行してもよろしいですか？", () => {
  log.info("確認ダイアログでOKが押されました");
});`;
