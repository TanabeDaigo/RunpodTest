"use client";

// Radioの使用例
export const radioExample = `// Radioの基本的な使用例
import { useUnitTest } from "../useUnitTest";

// コンポーネント内で
const [form, formProps] = useUnitTest({ gender: "male" });

// 基本的な使用例
formProps.radio("gender", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  after_func: (e, form) => {
    console.log("選択された性別:", form.gender);
  }
});`;

// テストケース
export const radioTest1 = `// テスト1 - 基本的なRadio
formProps.radio("test1", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  after_func: (e, form) => {
    console.log("選択された性別:", form.test1);
  }
});`;

export const radioTest2 = `// テスト2 - 無効化されたRadio
formProps.radio("test2", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  disabled: true,
  after_func: (e, form) => {
    console.log("選択された性別:", form.test2);
  }
});`;

export const radioTest3 = `// テスト3 - エラー状態のRadio
formProps.radio("test3", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  error: true,
  after_func: (e, form) => {
    console.log("選択された性別:", form.test3);
  }
});`;

export const radioTest4 = `// テスト4 - カスタムスタイルのRadio
formProps.radio("test4", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  sx: {
    color: "primary.main",
    "& .MuiFormControlLabel-label": {
      fontWeight: "bold"
    }
  },
  after_func: (e, form) => {
    console.log("選択された性別:", form.test4);
  }
});`;

export const radioTest5 = `// テスト5 - 縦並びのRadio
formProps.radio("test5", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  row: false,
  after_func: (e, form) => {
    console.log("選択された性別:", form.test5);
  }
});`;

export const radioTest6 = `// テスト6 - 複数行のラベル
formProps.radio("test6", {
  label: "性別",
  options: [
    { value: "male", label: "男性（Male）" },
    { value: "female", label: "女性（Female）" }
  ],
  after_func: (e, form) => {
    console.log("選択された性別:", form.test6);
  }
});`;

export const radioTest7 = `// テスト7 - デバッグモード
formProps.radio("test7", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  is_debug: true,
  after_func: (e, form) => {
    console.log("選択された性別:", form.test7);
  }
});`;

export const radioTest8 = `// テスト8 - denseモード
formProps.radio("test8", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  dense: true,
  after_func: (e, form) => {
    console.log("選択された性別:", form.test8);
  }
});`;

export const radioTest9 = `// テスト9 - ラベルなしのRadio
formProps.radio("test9", {
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  after_func: (e, form) => {
    console.log("選択された性別:", form.test9);
  }
});`;
