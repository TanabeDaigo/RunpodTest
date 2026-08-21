// buttonのテストケース
export const buttonExample = `
// 基本的な使用例
formProps.button("submit", {
  children: "送信",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const buttonTest1 = `
// 通常のボタン
formProps.button("submit", {
  children: "送信",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const buttonTest2 = `
// 無効化されたボタン
formProps.button("submit", {
  children: "送信",
  disabled: true,
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const buttonTest3 = `
// カラー指定のボタン
formProps.button("submit", {
  children: "送信",
  color: "primary",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const buttonTest4 = `
// サイズ指定のボタン
formProps.button("submit", {
  children: "送信",
  size: "large",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const buttonTest5 = `
// バリアント指定のボタン
formProps.button("submit", {
  children: "送信",
  variant: "outlined",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const buttonTest6 = `
// フル幅のボタン
formProps.button("submit", {
  children: "送信",
  fullWidth: true,
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const buttonTest7 = `
// ローディング中のボタン
formProps.button("submit", {
  children: "送信",
  loading: true,
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const buttonTest8 = `
// アイコン付きボタン
formProps.button("submit", {
  children: "送信",
  startIcon: <SendIcon />,
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

// Buttonテスト9 - style指定のボタン
export const buttonTest9 = `formProps.button("submit", {
  children: "送信",
  style: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#45a049"
    }
  },
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});`;

// Buttonテスト10 - sx指定のボタン
export const buttonTest10 = `formProps.button("submit", {
  children: "送信",
  sx: {
    backgroundColor: "primary.main",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "primary.dark"
    },
    "&:active": {
      transform: "scale(0.98)"
    }
  },
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});`;
