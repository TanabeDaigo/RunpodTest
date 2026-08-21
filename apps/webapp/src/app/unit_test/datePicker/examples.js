export const datePickerExample = `
// フォームの使用例
const [form, formProps] = hooks.useFormEx({
  date: null,
  birthday: null
});

// 日付選択フィールドの作成
formProps.datePicker("date", {
  label: "日付を選択",
  required: true
});`;

export const datePickerTest1 = `
// 通常の日付選択フィールド
formProps.datePicker("test1", {
  label: "通常の日付選択フィールド",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest2 = `
// 必須日付選択フィールド
formProps.datePicker("test2", {
  label: "必須日付選択フィールド",
  required: true,
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest3 = `
// 無効化日付選択フィールド
formProps.datePicker("test3", {
  label: "無効化日付選択フィールド",
  disabled: true,
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest4 = `
// カラー指定日付選択フィールド
formProps.datePicker("test4", {
  label: "カラー指定日付選択フィールド",
  color: "secondary",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest5 = `
// サイズ指定日付選択フィールド
formProps.datePicker("test5", {
  label: "サイズ指定日付選択フィールド",
  size: "large",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest6 = `
// エラー表示付き日付選択フィールド
formProps.datePicker("test6", {
  label: "エラー表示付き日付選択フィールド",
  error: true,
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest7 = `
// カスタムスタイル日付選択フィールド
formProps.datePicker("test7", {
  label: "カスタムスタイル日付選択フィールド",
  style: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#4CAF50",
      },
      "&:hover fieldset": {
        borderColor: "#4CAF50",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4CAF50",
      },
    },
  },
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest8 = `
// テーマ対応スタイル日付選択フィールド
formProps.datePicker("test8", {
  label: "テーマ対応スタイル日付選択フィールド",
  sx: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "primary.main",
      },
      "&:hover fieldset": {
        borderColor: "primary.main",
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
      },
    },
  },
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest9 = `
// カスタムフォーマット日付選択フィールド
formProps.datePicker("test9", {
  label: "カスタムフォーマット日付選択フィールド",
  format: "yyyy年MM月dd日",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest10 = `
// 年と月のみ選択可能な日付選択フィールド
formProps.datePicker("test10", {
  label: "年と月のみ選択可能な日付選択フィールド",
  views: ["year", "month"],
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest11 = `
// 未来の日付を無効化した日付選択フィールド
formProps.datePicker("test11", {
  label: "未来の日付を無効化した日付選択フィールド",
  disableFuture: true,
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest12 = `
// 過去の日付を無効化した日付選択フィールド
formProps.datePicker("test12", {
  label: "過去の日付を無効化した日付選択フィールド",
  disablePast: true,
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest13 = `
// コンパクトな日付選択フィールド
formProps.datePicker("test13", {
  label: "コンパクトな日付選択フィールド",
  fullWidth: true,
  dense: true,
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest14 = `
// デフォルト値設定済み日付選択フィールド
formProps.datePicker("test14", {
  label: "デフォルト値設定済み日付選択フィールド",
  defaultValue: new Date(2024, 0, 1), // 2024年1月1日
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest15 = `
// 文字列形式のデフォルト値（YYYY/MM/DD）
formProps.datePicker("test15", {
  label: "文字列形式のデフォルト値（YYYY/MM/DD）",
  defaultValue: "2024/01/01",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest16 = `
// 文字列形式のデフォルト値（YYYY-MM-DD）
formProps.datePicker("test16", {
  label: "文字列形式のデフォルト値（YYYY-MM-DD）",
  defaultValue: "2024-01-01",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest17 = `
// 文字列形式のデフォルト値（YYYYMMDD）
formProps.datePicker("test17", {
  label: "文字列形式のデフォルト値（YYYYMMDD）",
  defaultValue: "20240101",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest18 = `
// 文字列形式の値（YYYY/MM/DD）
formProps.datePicker("test18", {
  label: "文字列形式の値（YYYY/MM/DD）",
  value: "2024/01/01",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest19 = `
// 文字列形式の値（YYYY-MM-DD）
formProps.datePicker("test19", {
  label: "文字列形式の値（YYYY-MM-DD）",
  value: "2024-01-01",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest20 = `
// 文字列形式の値（YYYYMMDD）
formProps.datePicker("test20", {
  label: "文字列形式の値（YYYYMMDD）",
  value: "20240101",
  onChange: (date) => {
    console.log("選択された日付:", date);
  },
});`;

export const datePickerTest21 = `
// 出力形式指定（YYYY/MM/DD）
formProps.datePicker("test21", {
  label: "出力形式指定（YYYY/MM/DD）",
  outputFormat: "YYYY/MM/DD",
  onChange: (date) => {
    console.log("選択された日付:", date); // 2024/01/01形式で出力
  },
});`;

export const datePickerTest22 = `
// 出力形式指定（YYYY-MM-DD）
formProps.datePicker("test22", {
  label: "出力形式指定（YYYY-MM-DD）",
  outputFormat: "YYYY-MM-DD",
  onChange: (date) => {
    console.log("選択された日付:", date); // 2024-01-01形式で出力
  },
});`;

export const datePickerTest23 = `
// 出力形式指定（YYYYMMDD）
formProps.datePicker("test23", {
  label: "出力形式指定（YYYYMMDD）",
  outputFormat: "YYYYMMDD",
  onChange: (date) => {
    console.log("選択された日付:", date); // 20240101形式で出力
  },
});`;
