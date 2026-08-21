// tooltipのテストケース
export const tooltipExample = `
// 基本的な使用例
formProps.tooltip("submit", {
  children: "送信",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const tooltipTest1 = `
// 通常のボタン
formProps.tooltip("submit", {
  children: "送信",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;
