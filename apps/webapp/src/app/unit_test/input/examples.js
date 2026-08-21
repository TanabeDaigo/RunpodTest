export const inputExample = `// フォームの使用例
const [form, formProps] = useUnitTest({}, state, actions);

// 入力フィールドの作成
formProps.input("name", {
  label: "名前",
  placeholder: "山田太郎",
  maxlength: 20,
  required: true,
});
`;

export const inputTest1 = `// 通常のテキスト入力
formProps.input("test1", {
  label: "通常のテキスト入力",
  placeholder: "テキストを入力してください",
})`;

export const inputTest2 = `// 必須入力フィールド（赤い＊が表示されます）
formProps.input("test2", {
  label: "必須入力フィールド",
  placeholder: "必須項目を入力してください",
  required: true, // 必須項目の場合は赤い＊が表示されます
})`;

export const inputTest3 = `// エラー表示付きフィールド
formProps.input("test3", {
  label: "エラー表示付きフィールド",
  placeholder: "エラーが表示されます",
  error: true,
  helperText: "エラーメッセージが表示されます",
})`;

export const inputTest4 = `// 無効化フィールド
formProps.input("test4", {
  label: "無効化フィールド",
  placeholder: "入力できません",
  disabled: true,
})`;

export const inputTest5 = `// パスワードフィールド
formProps.input("test5", {
  label: "パスワード",
  placeholder: "パスワードを入力",
  type: "password",
})`;

export const inputTest6 = `// 数値入力フィールド
formProps.input("test6", {
  label: "数値入力",
  placeholder: "数値を入力",
  type: "number",
})`;

export const inputTest7 = `// メールアドレス入力フィールド
formProps.input("test7", {
  label: "メールアドレス",
  placeholder: "メールアドレスを入力",
  type: "email",
})`;

export const inputTest8 = `// マルチライン入力フィールド
formProps.input("test8", {
  label: "マルチライン入力",
  placeholder: "複数行のテキストを入力",
  multiline: true,
  rows: 4,
})`;

export const inputTest9 = `// 最大文字数制限付きフィールド
formProps.input("test9", {
  label: "最大文字数制限",
  placeholder: "最大10文字まで入力可能",
  maxlength: 10,
})`;

export const inputTest10 = `// サイズ指定フィールド
formProps.input("test10", {
  label: "小さいサイズ",
  placeholder: "小さいサイズの入力フィールド",
  size: "small",
})`;

export const inputTest11 = `// カラー指定フィールド
formProps.input("test11", {
  label: "カラー指定",
  placeholder: "カラー指定の入力フィールド",
  color: "primary",
})`;

export const inputTest12 = `// ログインID入力フィールド
formProps.input_login_id()`;

export const inputTest13 = `// パスワード入力フィールド
formProps.input_password()`;

export const inputTest14 = `// カスタムスタイルの入力フィールド
formProps.input("text", {
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
      boxShadow: "0 0 5px rgba(76, 175, 80, 0.3)"
    }
  },
  onChange: (e) => {
    console.log("入力値:", e.target.value);
  },
})`;

export const inputTest15 = `// テーマ対応スタイルの入力フィールド
formProps.input("text", {
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
      boxShadow: (theme) => \`0 0 5px \${theme.palette.primary.main}30\`
    },
    "&:hover": {
      borderColor: "primary.light"
    }
  },
  onChange: (e) => {
    console.log("入力値:", e.target.value);
  },
})`;

export const inputTest16 = `// 半角数字入力フィールド
{formProps.input("test16", {
  label: "半角数字",
  isNumberOnly:true,
  placeholder: "半角数字の入力フィールド",
  color: "primary",
})}`;

export const inputTest17 = `// マイナス記号含む半角数字入力フィールド
{formProps.input("test17", {
  label: "マイナス記号含む半角数字",
  isMinus: true,
  placeholder: "マイナス記号含む半角数字の入力フィールド",
  color: "primary",
})}`;

export const inputTest18 = `// 半角アルファベット入力フィールド
{formProps.input("test18", {
  label: "半角アルファベット",
  isAlphabet: true,
  placeholder: "半角アルファベットの入力フィールド",
  color: "primary",
})}`;

export const inputTest19 = `// 半角英数字入力フィールド
{formProps.input("test19", {
  label: "半角英数字",
  isNumAndAlpha: true,
  placeholder: "半角英数字の入力フィールド",
  color: "primary",
})}`;

export const inputTest20 = `// メールアドレス形式入力フィールド
{formProps.input("test20", {
  label: "メールアドレス形式",
  isMailAddress: true,
  placeholder: "メールアドレス形式の入力フィールド",
  color: "primary",
})}`;

export const inputTest21 = `// IPアドレス形式入力フィールド
{formProps.input("test21", {
  label: "IPアドレス形式",
  isIpAddress: true,
  placeholder: "IPアドレス形式の入力フィールド",
  color: "primary",
})}`;

export const inputTest22 = `// textAlign指定の入力フィールド
{formProps.input("test22", {
  label: "中央テキスト入力",
  placeholder: "テキストを入力してください",
  textAlign:"center",
})}`;
