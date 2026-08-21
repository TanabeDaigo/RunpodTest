export const validationExample = `

  useValidationExの基本的な使用方法
  
  1. フォームの初期化
  const initForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    ipAddress: "",
    money: "",
  };
  
  2. useFormExとuseValidationExの使用
  const [form, formProps] = hooks.useFormEx(initForm);
  const [errors, validProps] = hooks.useValidationEx(form);
  
  3. バリデーションの実行
  validProps.clear(); // エラーをクリア
  validProps.checkNull("name", "名前"); // 必須チェック
  validProps.checkMailAddress("email", "メールアドレス"); // メールアドレス形式チェック
  validProps.checkPassword("password", "confirmPassword"); // パスワード一致チェック
  validProps.checkNumber("money", "金額"); // 数値チェック
  validProps.checkDateTerm("from_date", "to_date", "日付"); // 日付範囲チェック
  
  4. エラーチェック
  if (validProps.isError()) {
    actions.showError("エラーがあります");
    return;
  }
 
`;

export const validationTest1 = `

  テスト1: 必須チェック
  
  使用方法:
  validProps.checkNull("フィールド名", "表示名");
  
  例:
  validProps.checkNull("name", "名前");
  
  説明:
  - フィールドが空の場合にエラーを設定
  - エラーメッセージは「{表示名}は必須です」の形式
 
`;

export const validationTest2 = `

  テスト2: メールアドレス形式チェック
  
  使用方法:
  validProps.checkMailAddress("フィールド名", "表示名");
  
  例:
  validProps.checkMailAddress("email", "メールアドレス");
  
  説明:
  - メールアドレスの形式が正しいかチェック
  - エラーメッセージは「{表示名}の形式が正しくありません」の形式
 
`;

export const validationTest3 = `

  テスト3: パスワード一致チェック
  
  使用方法:
  validProps.checkPassword("パスワードフィールド名", "確認用パスワードフィールド名");
  
  例:
  validProps.checkPassword("password", "confirmPassword");
  
  説明:
  - パスワードと確認用パスワードが一致するかチェック
  - エラーメッセージは「パスワードが一致しません」の形式
 
`;

export const validationTest4 = `

  テスト4: 数値チェック
  
  使用方法:
  validProps.checkNumber("フィールド名", "表示名");
  
  例:
  validProps.checkNumber("money", "金額");
  
  説明:
  - フィールドが数値として有効かチェック
  - エラーメッセージは「{表示名}は数値で入力してください」の形式
 
`;

export const validationTest5 = `

  テスト5: IPアドレス形式チェック
  
  使用方法:
  validProps.checkIpAddress("フィールド名", "表示名");
  
  例:
  validProps.checkIpAddress("ipAddress", "IPアドレス");
  
  説明:
  - IPアドレスの形式が正しいかチェック
  - エラーメッセージは「{表示名}の形式が正しくありません」の形式
 
`;

export const validationTest6 = `

  テスト6: 日付範囲チェック
  
  使用方法:
  validProps.checkDateTerm("開始日フィールド名", "終了日フィールド名", "表示名");
  
  例:
  validProps.checkDateTerm("from_date", "to_date", "日付");
  
  説明:
  - 開始日が終了日より前かチェック
  - エラーメッセージは「{表示名}の範囲が正しくありません」の形式
 
`;

export const validationTest7 = `

  テスト7: エラー状態の確認
  
  使用方法:
  validProps.isError();
  
  例:
  if (validProps.isError()) {
    actions.showError("エラーがあります");
    return;
  }
  
  説明:
  - バリデーションエラーが存在するかチェック
  - エラーが存在する場合はtrueを返す
 
`;

export const validationTest8 = `

  テスト8: エラーのクリア
  
  使用方法:
  validProps.clear();
  
  例:
  validProps.clear();
  
  説明:
  - すべてのバリデーションエラーをクリア
  - 新しいバリデーションを開始する前に呼び出す
 
`;

export const validationTest9 = `

  テスト9: エラーメッセージの取得
  
  使用方法:
  errors.フィールド名
  
  例:
  {formProps.input("name", {
    error: errors?.name,
    helperText: errors?.name
  })}
  
  説明:
  - フィールドに対応するエラーメッセージを取得
  - エラーが存在しない場合はundefined
 
`;

export const validationTest10 = `

  テスト10: フォームコンポーネントとの連携
  
  使用方法:
  formProps.input("フィールド名", {
    error: errors?.フィールド名,
    helperText: errors?.フィールド名,
    ...その他のプロパティ
  });
  
  例:
  {formProps.input("email", {
    label: "メールアドレス",
    required: true,
    error: errors?.email,
    helperText: errors?.email,
    isMailAddress: true
  })}
  
  説明:
  - フォームコンポーネントにエラー状態とメッセージを渡す
  - エラーがある場合は赤枠とエラーメッセージを表示
 
`;
