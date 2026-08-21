export const formExExample = `// FormExの使用例
const [form, formProps] = hooks.useFormEx({
  name: "",
  email: "",
  age: "",
  password: "",
  confirmPassword: "",
  terms: false
});

// テキスト入力フィールド
formProps.input("name", {
  label: "名前",
  placeholder: "山田太郎",
  maxlength: 20,
  required: true
});

// メールアドレス入力フィールド
formProps.input("email", {
  label: "メールアドレス",
  placeholder: "example@email.com",
  type: "email",
  required: true
});

// 数値入力フィールド
formProps.input("age", {
  label: "年齢",
  type: "number",
  min: 0,
  max: 120,
  required: true
});

// パスワード入力フィールド
formProps.input("password", {
  label: "パスワード",
  type: "password",
  required: true
});

// パスワード確認フィールド
formProps.input("confirmPassword", {
  label: "パスワード（確認）",
  type: "password",
  required: true
});

// チェックボックス
formProps.checkbox("terms", {
  label: "利用規約に同意する",
  required: true
});

// 送信ボタン
formProps.button("submit", {
  children: "送信",
  onClick: () => {
    if (form.password !== form.confirmPassword) {
      formProps.setError("confirmPassword", "パスワードが一致しません");
      return;
    }
    console.log("フォームデータ:", form);
  }
});`;
