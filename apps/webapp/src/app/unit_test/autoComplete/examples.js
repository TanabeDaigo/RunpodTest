export const autoCompleteExample = `// AutoCompleteの基本的な使用例
import { useUnitTest } from "../useUnitTest";

// コンポーネント内で
const [form, formProps] = useUnitTest({ prefecture: "tokyo" });

// 基本的な使用例
formProps.autoComplete("prefecture", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.prefecture);
  }
});`;

export const autoCompleteTest1 = `// テスト1 - 基本的なAutoComplete
formProps.autoComplete("test1", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test1);
  }
});`;

export const autoCompleteTest2 = `// テスト2 - 無効化されたAutoComplete
formProps.autoComplete("test2", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  disabled: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test2);
  }
});`;

export const autoCompleteTest3 = `// テスト3 - エラー状態のAutoComplete
formProps.autoComplete("test3", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  error: true,
  helperText: "エラーメッセージ",
  after_func: (form) => {
    console.log("選択された都道府県:", form.test3);
  }
});`;

export const autoCompleteTest4 = `// テスト4 - カスタムスタイルのAutoComplete
formProps.autoComplete("test4", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  sx: {
    color: "primary.main",
    "& .MuiInputBase-input": {
      fontWeight: "bold"
    }
  },
  after_func: (form) => {
    console.log("選択された都道府県:", form.test4);
  }
});`;

export const autoCompleteTest5 = `// テスト5 - 非同期オプション
formProps.autoComplete("test5", {
  label: "都道府県",
  options: async (inputValue) => {
    // 実際のAPIコールをシミュレート
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { value: "tokyo", label: "東京都" },
      { value: "osaka", label: "大阪府" },
      { value: "kyoto", label: "京都府" },
      { value: "hokkaido", label: "北海道" }
    ].filter(option => option.label.includes(inputValue));
  },
  fullWidth: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test5);
  }
});`;

export const autoCompleteTest6 = `// テスト6 - 複数行のラベル
formProps.autoComplete("test6", {
  label: "都道府県（Prefecture）",
  options: [
    { value: "tokyo", label: "東京都（Tokyo）" },
    { value: "osaka", label: "大阪府（Osaka）" },
    { value: "kyoto", label: "京都府（Kyoto）" },
    { value: "hokkaido", label: "北海道（Hokkaido）" }
  ],
  fullWidth: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test6);
  }
});`;

export const autoCompleteTest7 = `// テスト7 - デバッグモード
formProps.autoComplete("test7", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  is_debug: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test7);
  }
});`;

export const autoCompleteTest8 = `// テスト8 - 通常サイズモード
formProps.autoComplete("test8", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  dense: false,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test8);
  }
});`;

export const autoCompleteTest9 = `// テスト9 - ラベルなしのAutoComplete
formProps.autoComplete("test9", {
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test9);
  }
});`;

export const autoCompleteTest10 = `// テスト10 - カラー設定
formProps.autoComplete("test10", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  color: "secondary",
  after_func: (form) => {
    console.log("選択された都道府県:", form.test10);
  }
});`;

export const autoCompleteTest11 = `// テスト11 - フルワイドモード
formProps.autoComplete("test11", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test11);
  }
});`;

export const autoCompleteTest12 = `// テスト12 - デフォルトサイズ（dense: true）
formProps.autoComplete("test12", {
  label: "都道府県",
  options: [
    { value: "tokyo", label: "東京都" },
    { value: "osaka", label: "大阪府" },
    { value: "kyoto", label: "京都府" },
    { value: "hokkaido", label: "北海道" }
  ],
  fullWidth: true,
  after_func: (form) => {
    console.log("選択された都道府県:", form.test12);
  }
});`;
