"use client";

// Selectの使用例
export const selectExample = `// Selectの基本的な使用例
import { useUnitTest } from "../useUnitTest";

// コンポーネント内で
const [form, formProps] = useUnitTest({ gender: "male" });

// 基本的な使用例
formProps.select("gender", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  after_func: (form) => {
    console.log("選択された性別:", form.gender);
  }
});`;

// テストケース
export const selectTest1 = `// テスト1 - 基本的なSelect
formProps.select("test1", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test1);
  }
});`;

export const selectTest2 = `// テスト2 - 無効化されたSelect
formProps.select("test2", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  disabled: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test2);
  }
});`;

export const selectTest3 = `// テスト3 - エラー状態のSelect
formProps.select("test3", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  error: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test3);
  }
});`;

export const selectTest4 = `// テスト4 - カスタムスタイルのSelect
formProps.select("test4", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  sx: {
    color: "primary.main",
    "& .MuiSelect-select": {
      fontWeight: "bold"
    }
  },
  after_func: (form) => {
    console.log("選択された性別:", form.test4);
  }
});`;

export const selectTest5 = `// テスト5 - 複数選択のSelect
formProps.select("test5", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  multiple: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test5);
  }
});`;

export const selectTest6 = `// テスト6 - 複数行のラベル
formProps.select("test6", {
  label: "性別（Gender）",
  options: [
    { value: "male", label: "男性（Male）" },
    { value: "female", label: "女性（Female）" }
  ],
  fullwidth: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test6);
  }
});`;

export const selectTest7 = `// テスト7 - デバッグモード
formProps.select("test7", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  is_debug: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test7);
  }
});`;

export const selectTest8 = `// テスト8 - denseモード
formProps.select("test8", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  dense: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test8);
  }
});`;

export const selectTest9 = `// テスト9 - ラベルなしのSelect
formProps.select("test9", {
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test9);
  }
});`;

export const selectTest10 = `// テスト10 - size: largeのSelect
formProps.select("test10", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  size: "large",
  after_func: (form) => {
    console.log("選択された性別:", form.test10);
  }
});`;

export const selectTest11 = `// テスト11 - size: largeかつdense: trueのSelect
formProps.select("test11", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  size: "large",
  dense: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test11);
  }
});`;

export const selectTest12 = `// テスト12 - color: primaryのSelect
formProps.select("test12", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  color: "primary",
  after_func: (form) => {
    console.log("選択された性別:", form.test12);
  }
});`;

export const selectTest13 = `// テスト13 - color: secondaryのSelect
formProps.select("test13", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  color: "secondary",
  after_func: (form) => {
    console.log("選択された性別:", form.test13);
  }
});`;

export const selectTest14 = `// テスト14 - color: errorのSelect
formProps.select("test14", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  color: "error",
  after_func: (form) => {
    console.log("選択された性別:", form.test14);
  }
});`;

export const selectTest15 = `// テスト15 - variant: standardのSelect
formProps.select("test15", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  variant: "standard",
  after_func: (form) => {
    console.log("選択された性別:", form.test15);
  }
});`;

export const selectTest16 = `// テスト16 - variant: outlinedのSelect
formProps.select("test16", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  variant: "outlined",
  after_func: (form) => {
    console.log("選択された性別:", form.test16);
  }
});`;

export const selectTest17 = `// テスト17 - variant: filledのSelect
formProps.select("test17", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  variant: "filled",
  after_func: (form) => {
    console.log("選択された性別:", form.test17);
  }
});`;
