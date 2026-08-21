// 基本的なアラートの使用例
export const alertExample = `// 基本的なアラートの使用例
actions.showAlert("タイトル", "メッセージ");

// 成功メッセージ
actions.showSuccess("成功", "操作が完了しました");

// エラーメッセージ
actions.showError("エラー", "エラーが発生しました");

// 警告メッセージ
actions.showWarning("警告", "注意が必要です");

// 情報メッセージ
actions.showInfo("情報", "システムが更新されました");

// アラートを閉じる
actions.closeAlert();`;

// テストケース1: 基本的なアラート
export const alertTest1 = `// 基本的なアラートを表示
actions.showAlert("タイトル", "これは基本的なアラートです。");`;

// テストケース2: showAlert
export const alertTest2 = `// showAlertを使用してアラートを表示
actions.showAlert("タイトル", "これはshowAlertのテストです。");`;

// テストケース3: 成功メッセージ
export const alertTest3 = `// 成功メッセージを表示
actions.showSuccess("成功", "操作が正常に完了しました。");`;

// テストケース4: エラーメッセージ
export const alertTest4 = `// エラーメッセージを表示
actions.showError("エラー", "処理中にエラーが発生しました。");`;

// テストケース5: 警告メッセージ
export const alertTest5 = `// 警告メッセージを表示
actions.showWarning("警告", "この操作は取り消せません。");`;

// テストケース6: 情報メッセージ
export const alertTest6 = `// 情報メッセージを表示
actions.showInfo("情報", "システムが更新されました。");`;

// テストケース7: アラートの閉じる
export const alertTest7 = `// アラートを表示して3秒後に閉じる
actions.showAlert("タイトル", "このアラートは3秒後に自動的に閉じます。");
setTimeout(() => {
  actions.closeAlert();
}, 3000);`;
