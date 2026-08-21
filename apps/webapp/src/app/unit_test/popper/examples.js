// popperのテストケース
export const popperExample = `
// 基本的な使用例
formProps.popper("submit", {
  children: "送信",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const popperTest1 = `
// 通常のボタン
formProps.popper("submit", {
  children: "送信",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;
