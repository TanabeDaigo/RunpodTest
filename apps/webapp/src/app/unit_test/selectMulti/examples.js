"use client";

// SelectMultiの使用例
export const selectMultiExample = `// SelectMultiの基本的な使用例
import { useUnitTest } from "../useUnitTest";

// コンポーネント内で
const [form, formProps] = useUnitTest({ gender: ["male"] });

// 基本的な使用例
formProps.selectMulti("gender", {
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
export const selectMultiTest1 = `// テスト1 - 基本的なSelectMulti
formProps.selectMulti("test1", {
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

export const selectMultiTest2 = `// テスト2 - 無効化されたSelectMulti
formProps.selectMulti("test2", {
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

export const selectMultiTest3 = `// テスト3 - エラー状態のSelectMulti
formProps.selectMulti("test3", {
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

export const selectMultiTest4 = `// テスト4 - カスタムスタイルのSelectMulti
formProps.selectMulti("test4", {
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

export const selectMultiTest5 = `// テスト5 - 複数行のラベル
formProps.selectMulti("test5", {
  label: "性別（Gender）",
  options: [
    { value: "male", label: "男性（Male）" },
    { value: "female", label: "女性（Female）" }
  ],
  fullwidth: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test5);
  }
});`;

export const selectMultiTest6 = `// テスト6 - デバッグモード
formProps.selectMulti("test6", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  is_debug: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test6);
  }
});`;

export const selectMultiTest7 = `// テスト7 - denseモード
formProps.selectMulti("test7", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  dense: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test7);
  }
});`;

export const selectMultiTest8 = `// テスト8 - ラベルなしのSelectMulti
formProps.selectMulti("test8", {
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test8);
  }
});`;

export const selectMultiTest9 = `// テスト9 - size: largeのSelectMulti
formProps.selectMulti("test9", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  size: "large",
  after_func: (form) => {
    console.log("選択された性別:", form.test9);
  }
});`;

export const selectMultiTest10 = `// テスト10 - size: largeかつdense: trueのSelectMulti
formProps.selectMulti("test10", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  size: "large",
  dense: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test10);
  }
});`;

export const selectMultiTest11 = `// テスト11 - color: primaryのSelectMulti
formProps.selectMulti("test11", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  color: "primary",
  after_func: (form) => {
    console.log("選択された性別:", form.test11);
  }
});`;

export const selectMultiTest12 = `// テスト12 - color: secondaryのSelectMulti
formProps.selectMulti("test12", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  color: "secondary",
  after_func: (form) => {
    console.log("選択された性別:", form.test12);
  }
});`;

export const selectMultiTest13 = `// テスト13 - color: errorのSelectMulti
formProps.selectMulti("test13", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  color: "error",
  after_func: (form) => {
    console.log("選択された性別:", form.test13);
  }
});`;

export const selectMultiTest14 = `// テスト14 - variant: standardのSelectMulti
formProps.selectMulti("test14", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  variant: "standard",
  after_func: (form) => {
    console.log("選択された性別:", form.test14);
  }
});`;

export const selectMultiTest15 = `// テスト15 - variant: outlinedのSelectMulti
formProps.selectMulti("test15", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  variant: "outlined",
  after_func: (form) => {
    console.log("選択された性別:", form.test15);
  }
});`;

export const selectMultiTest16 = `// テスト16 - variant: filledのSelectMulti
formProps.selectMulti("test16", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" }
  ],
  fullwidth: true,
  variant: "filled",
  after_func: (form) => {
    console.log("選択された性別:", form.test16);
  }
});`;

export const selectMultiTest17 = `// テスト17 - 全選択機能のSelectMulti
formProps.selectMulti("test17", {
  label: "性別",
  options: [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" },
    { value: "other", label: "その他" }
  ],
  fullwidth: true,
  after_func: (form) => {
    console.log("選択された性別:", form.test17);
  }
});`;
