export const datePickerFromToExample = `
// 日付選択フィールドの作成
formProps.datePickerFromTo("from", "to", 
// datePickerFrom
{
  label: "日付を選択",
}, 
// datePickerTo
{
  label: "日付を選択",
}, 
);
`;

export const datePickerFromToTest1 = `
// 通常の日付選択フィールド
formProps.datePickerFromTo("test1_from", "test1_to", 
{
  label: "通常の日付選択フィールド",
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "通常の日付選択フィールド",
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest2 = `
// ラベルなしの日付選択フィールド
formProps.datePickerFromTo("test2_from", "test2_to", 
{
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest3 = `
// 必須日付選択フィールド
formProps.datePickerFromTo("test3_from", "test3_to", 
{
  label: "必須日付選択フィールド",
  required: true,
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "必須日付選択フィールド",
  required: true,
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest4 = `
// 無効化日付選択フィールド
formProps.datePickerFromTo("test4_from", "test4_to", 
{
  label: "無効化日付選択フィールド",
  disabled: true,
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "無効化日付選択フィールド",
  disabled: true,
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest5 = `
// カラー指定日付選択フィールド
formProps.datePickerFromTo("test5_from", "test5_to", 
{
  label: "カラー指定日付選択フィールド",
  color: "secondary",
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "カラー指定日付選択フィールド",
  color: "secondary",
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest6 = `
// 年と月のみ選択可能な日付選択フィールド
formProps.datePickerFromTo("test6_from", "test6_to", 
{
  label: "年と月のみ選択可能な日付選択フィールド",
  views: ["year", "month"],
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "年と月のみ選択可能な日付選択フィールド",
  views: ["year", "month"],
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest7 = `
// エラー表示付き日付選択フィールド
formProps.datePickerFromTo("test7_from", "test7_to", 
{
  label: "エラー表示付き日付選択フィールド",
  error: true,
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "エラー表示付き日付選択フィールド",
  error: true,
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest8 = `
// カスタムフォーマット日付選択フィールド
formProps.datePickerFromTo("test8_from", "test8_to", 
{
  label: "カスタムフォーマット日付選択フィールド",
  format: "yyyy年MM月dd日",
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "カスタムフォーマット日付選択フィールド",
  format: "yyyy年MM月dd日",
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest9 = `
// 未来の日付を無効化した日付選択フィールド
formProps.datePickerFromTo("test9_from", "test9_to", 
{
  label: "未来の日付を無効化した日付選択フィールド",
  disableFuture: true,
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "未来の日付を無効化した日付選択フィールド",
  disableFuture: true,
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );
`;

export const datePickerFromToTest10 = `
// 過去の日付を無効化した日付選択フィールド
formProps.datePickerFromTo("test10_from", "test10_to", 
{
  label: "過去の日付を無効化した日付選択フィールド",
  disablePast: true,
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
}, 
{
  label: "過去の日付を無効化した日付選択フィールド",
  disablePast: true,
  helperText: "エラーメッセージが表示されます",
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
}, );

`;

export const datePickerFromToTest11 = `
// デフォルト値のある日付選択フィールド
formProps.datePickerFromTo("test11_from","test11_to", 
{
label: "デフォルト値（YYYY/MM/DD）",
value: "2025/01/01",
onChange: (date) => {
console.log("From 選択された日付:", date);
},
},
{
label: "デフォルト値（YYYY/MM/DD）",
value: "2025/01/01",
onChange: (date) => {
console.log("To 選択された日付:", date);
},
},
)}

`;

export const datePickerFromToTest12 = `
// カスタムフォーマットデフォルト値のある日付選択フィールド
formProps.datePickerFromTo("test12_from","test12_to", 
{
  label: "カスタムフォーマットデフォルト値（YYYY-MM-DD）",
  format: "yyyy-MM-dd",
  value: "2024/01/01",
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
},
{
  label: "カスタムフォーマットデフォルト値（YYYY-MM-DD）",
  format: "yyyy-MM-dd",
  value: "2024/01/01",
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
},
)}

`;

export const datePickerFromToTest13 = `
// 展開中に操作可能な日付選択フィールド
formProps.datePickerFromTo("test13_from","test13_to", 
{
  label: "展開中に操作可能な日付選択フィールド",
  onChange: (date) => {
    console.log("From 選択された日付:", date);
  },
},
{
  label: "展開中に操作可能な日付選択フィールド",
  onChange: (date) => {
    console.log("To 選択された日付:", date);
  },
},
{
  isAnchorEl:true,
}
)}

`;

export const datePickerFromToTest14 = `
// スイッチで操作可能な日付選択フィールド
{formProps.datePickerFromTo("test14_from","test14_to", 
  {
    label: "スイッチで操作可能な日付選択フィールド",
    onChange: (date) => {
      console.log("From 選択された日付:", date);
    },
  },
  {
    label: "スイッチで操作可能な日付選択フィールド",
    onChange: (date) => {
      console.log("To 選択された日付:", date);
    },
  },
  {
    showSwitch:true,
    switchDefaultChecked:true,
    switchLabel:"無効",
    swichStyle:{color:"red"},
  }
)}

`;

