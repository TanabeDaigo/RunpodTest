// checkboxのテストケース
export const checkboxExample = `
// フォームの使用例
const [form, formProps] = hooks.useFormEx({
  terms: false,
  newsletter: false
});

// チェックボックスの作成
formProps.checkbox("terms", {
  label: "利用規約に同意する",
  required: true
});
`;

export const checkboxTest1 = `
// 通常のチェックボックス
formProps.checkbox("test1", {
  label: "通常のチェックボックス",
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;

export const checkboxTest2 = `
// 必須チェックボックス
formProps.checkbox("test2", {
  label: "必須チェックボックス",
  required: true,
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;

export const checkboxTest3 = `
// 無効化チェックボックス
formProps.checkbox("test3", {
  label: "無効化チェックボックス",
  disabled: true,
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;

export const checkboxTest4 = `
// カラー指定チェックボックス
formProps.checkbox("test4", {
  label: "カラー指定チェックボックス",
  color: "secondary",
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;

export const checkboxTest5 = `
// サイズ指定チェックボックス
formProps.checkbox("test5", {
  label: "サイズ指定チェックボックス",
  size: "large",
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;

export const checkboxTest6 = `
// ラベル位置指定チェックボックス
formProps.checkbox("test6", {
  label: "ラベル位置指定チェックボックス",
  labelPlacement: "start",
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;

export const checkboxTest7 = `
// エラー表示付きチェックボックス
formProps.checkbox("test7", {
  label: "エラー表示付きチェックボックス",
  error: true,
  helperText: "エラーメッセージが表示されます",
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;

export const checkboxTest8 = `
// カスタムスタイルチェックボックス
formProps.checkbox("test8", {
  label: "カスタムスタイルチェックボックス",
  style: {
    color: "#4CAF50",
    "&.MuiChecked": {
      color: "#4CAF50",
    },
  },
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;

export const checkboxTest9 = `
// テーマ対応スタイルチェックボックス
formProps.checkbox("test9", {
  label: "テーマ対応スタイルチェックボックス",
  sx: {
    color: "primary.main",
    "&.MuiChecked": {
      color: "primary.main",
    },
    "&:hover": {
      color: "primary.light",
    },
  },
  onChange: (e) => {
    console.log("チェック状態:", e.target.checked);
  },
});`;
